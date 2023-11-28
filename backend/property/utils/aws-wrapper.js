const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const db = require('../Models/db.js');
const knex = db.knex;
dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: process.env.awsaccesskey,
    secretAccessKey: process.env.secretkey
});

const images = [".bmp", ".cd5", ".gif", ".ico", ".iff", ".jpeg", ".jpg", ".rgb", ".tiff", ".tif", ".svg", ".png"];

const getMedia = function (keyName) {

    let params = {
        Bucket: process.env.s3Bucket,
        Key: keyName,
        Expires: 3600
    };

    return s3.getSignedUrlPromise('getObject', params)
        .then(function (url) {
            return url;
        })
        .catch(function (error) {
            throw error;
        })
}

const uploadFilesAndAddToDB = async function (fileContent, mediaObject,fileType) {

    var extension = path.extname(mediaObject.originalFileName);
    var fileName = uuidv4() + extension;
    var isImage = images.includes(extension);
    var relativePath = mediaObject.documentName + '/' + fileName

   


    let params = {
        Bucket: process.env.s3Bucket,
        Key: relativePath,
        Body: fileContent,
        ContentDisposition: "inline",
        ContentType: fileType
    };

    return new Promise(function (resolve, reject) {

          s3.upload(params, function (error, success) {
            if (error) {
                console.log(error);
            }
            else {
               
                return knex('documentenum').where({bucketId:mediaObject.documentName}).select('id')
                .then(function(result){
                    
                return knex('media').insert({
                    fileName: fileName,
                    originalFileName: mediaObject.originalFileName,
                    relativePath: relativePath,
                    description: "Uploaded By System",
                    isImage: isImage,
                    extension: extension,
                    size: mediaObject.size,
                    documentId: result[0].id,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }).then(function (result) {
    
                     knex('media').where({ id: result[0] }).select('*').then(function (result) {                         
                        resolve(result[0])
                    });
                });
    
                })
            }
            
        });

    });




}


const uploadFiles = function (fileContent, documentType, originalFileName) {

    var uuid = uuidv4();

    let params = {
        Bucket: process.env.s3Bucket,
        Key: documentType + '/' + uuid + path.extname(originalFileName),
        Body: fileContent,
        ContentDisposition: "inline"
    };

    return s3.upload(params, function (error, success) {
        if (error) {
            console.log(`File upload error. ${error}`);
        }
        else {
            console.log(`File uploaded successfully. ${success.Location}`);
            //resolve(success);
        }
    });
}


module.exports = { uploadFiles, uploadFilesAndAddToDB, getMedia };