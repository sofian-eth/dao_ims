const AWS = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config();




const s3 = new AWS.S3({
    accessKeyId: process.env.awsaccesskey,
    secretAccessKey: process.env.secretkey,
    signatureVersion: 'v4',
    region: 'ap-southeast-1'
});




const uploadFiles = function (fileContent, keyName, fileType) {
    let params = {
        Bucket: process.env.s3Bucket,
        Key: keyName,
        Body: fileContent,
        ContentDisposition: "inline",
        ContentType: fileType
    };

    return new Promise(function (resolve, reject) {

        return s3.upload(params, function (error, success) {
            if (error) {
                reject('Error occurred')
            }
            else
                resolve(success);
        });

    });



}


const generateSignedUrl = function (keyName) {
    let params = {
        Bucket: process.env.s3Bucket,
        Key: keyName,
        Expires: 300
    };

    return s3.getSignedUrlPromise('getObject', params)
        .then(function (url) {
            return url;
        })
        .catch(function (error) {
            throw error;
        })
}


const getFile = function(key){
    if(key){
        let params = {
            Bucket: process.env.s3Bucket,
            Key: key
        }
        return s3.getObject(params);
    }
    return '';
}

module.exports = { uploadFiles, generateSignedUrl,getFile };