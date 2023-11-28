const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const db = require('../models/db.js');
const archiver = require("archiver");
const knex = db.knex;
dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: process.env.awsaccesskey,
    secretAccessKey: process.env.secretkey
});

const images = [".bmp", ".cd5", ".gif", ".ico", ".iff", ".jpeg", ".jpg", ".rgb", ".tiff", ".tif", ".svg", ".png"];

const getMedia = function (keyName) {
    if (!keyName)
        return;

    let params = {
        Bucket: process.env.s3Bucket,
        Key: keyName,
        Expires: 3600
    };

    return s3.getSignedUrlPromise('getObject', params)
        .then(function (url) {
            // console.log(url);
            return url;
        })
        .catch(function (error) {
            throw error;
        })
}

const getMediaAsync = async (keyName) => {
    return new Promise(async (resolve, reject) => {
        if (!keyName) {
            resolve('');
        } else {
            let params = {
                Bucket: process.env.s3Bucket,
                Key: keyName,
                Expires: 3600
            };
            let url = await s3.getSignedUrlPromise('getObject', params);
            if (url) {
                resolve(url)
            } else {
                resolve('')
            }
        }

    });
}

const getKeys = async (id, userId) => {
    return new Promise(async (resolve, reject) => {
        const returnData = {};
        const trade = await knex("tradeactivity").where({ "id": id }).first("buyerID");
        const user = await knex("users").where({ "id": trade.buyerID }).columns("cnicFrontID", "cnicBackID").select();
        if (user && user.length > 0) {
            if (user[0].cnicFrontID) {
                let _cnicFrontID = await knex("media").where({ "id": user[0].cnicFrontID });
                if (_cnicFrontID && _cnicFrontID.length > 0)
                    returnData.cnicFrontID = _cnicFrontID[0].relativePath;
            }
            if (user[0].cnicBackID) {
                let _cnicBackID = await knex("media").where({ "id": user[0].cnicBackID });
                if (_cnicBackID && _cnicBackID.length > 0)
                    returnData.cnicBackID = _cnicBackID[0].relativePath;
            }
        }
        let result = await knex("tradedocuments").where({ "tradeId": id }).select("mediaId");
        if (result && result.length > 0) {
            let otherFiles = await knex("media").where("id", "in", result.map((x) => {
                return x.mediaId
            })).select("relativePath");
            if (otherFiles && (otherFiles).length > 0) {
                returnData.otherData = otherFiles;
                resolve({
                    success: true,
                    data: returnData
                });
            } else {
                reject({
                    success: false,
                    data: {}
                });
            }
        } else {
            reject({
                success: false,
                data: {}
            });
        }
    })

}

const getFile = function (relativePath) {
    if (!relativePath) {
        throw Error("no key provided");
    }
    var params = {
        Key: relativePath,
        Bucket: process.env.s3Bucket,
    }
    return new Promise((resolve, rejec) => {
        s3.getObject(params, (err, data) => {
            if (!err) {
                resolve({
                    success: true,
                    data: data.Body
                });
            } else {
                resolve({
                    success: false,
                    data: null
                });
            }
        })
        //res.attachment(data);
        // var fileStream = s3.getObject(params).createReadStream();
        // fileStream.pipe(res);
        // s3.getObject(params).promise().then((data)=>{ 
        //     resolve(data.Body);
        // }).catch((err) => {
        //     throw err;
        // })
    })
}

const downloadAllFiles = async function (id, res, userId) {

    let zip = new archiver.create('zip');
    const key = await getKeys(id, userId);
    if (key.success === true) {
        if (key.data && key.data.cnicFrontID) {
            const cnicFrontFile = await getFile(key.data.cnicFrontID);
            if (cnicFrontFile.success === true) {
                zip.append(cnicFrontFile.data, {
                    name: key.data.cnicFrontID
                })
            }
        }
        if (key.data && key.data.cnicBackID) {
            const cnicBackFile = await getFile(key.data.cnicBackID);
            if (cnicBackFile.success === true) {
                zip.append(cnicBackFile.data, {
                    name: key.data.cnicBackID
                })
            }
        }
        if (key.data && key.data.otherData && key.data.otherData.length > 0) {
            for (let i = 0; i < key.data.otherData.length; i++) {
                const element = key.data.otherData[i];
                const d = await getFile(element.relativePath);
                if (d.success === true) {
                    zip.append(d.data, {
                        name: element.relativePath
                    })
                }
            }
        }
    }
    zip.finalize();
    return new Promise((resolve, reject) => {
        resolve(zip);
    })
}

const downloadFile = async function (data, res) {
    try {
        if (!data) {
            return;
        }
        var params = {
            Key: data,
            Bucket: process.env.s3Bucket
        }
        return new Promise((resolve, rejec) => {
            res.attachment(data);
            try {
                var fileStream = s3.getObject(params).createReadStream();
                fileStream.on('error', (e) => {
                    res.status(500).send(e);
                });
                fileStream.pipe(res);

            } catch (e) {
                res.status(500).send("");
            }
        })
    } catch (error) {
        res.status(500).send("");
    }
}

const deleteFilesAndSaveToDB = async function (data) {
    return new Promise((resolve, reject) => {
        knex("media").where({ "id": data.mediaId }).del().then(x => {
            if (x === 1) {
                resolve({
                    success: true,
                    data: x
                });
            } else {
                resolve({
                    success: false,
                    data: x
                });
            }
        }).catch(x => {
            resolve({
                success: false,
                data: x
            });
        })
    })
}

const uploadFilesAndAddToDB = async function (fileContent, mediaObject, fileType) {
    // console.log('---mediaObject---',mediaObject);
    var extension = path.extname(mediaObject.originalFileName);
    var fileName = uuidv4() + extension;
    var isImage = images.includes(extension);
    var relativePath = mediaObject.documentName + '/' + fileName;
    var mediaId;
    var url;

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
            }
            else {
                return knex('documentenum').where({ bucketId: mediaObject.documentName }).select('id')
                    .then(function (result) {

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
                            mediaId = result[0];
                            return getMedia(relativePath);
                        }).then(function (result) {
                            url = result;
                            return knex('media').join('documentenum', 'documentenum.id', 'media.documentId').where({ 'media.id': mediaId })
                                .select('media.id as mediaId', 'media.fileName', 'media.originalFileName', 'media.relativePath', 'media.description', 'media.documentId', 'media.extension', 'media.size', 'documentenum.bucketId', 'documentenum.name');

                        }).then(function (result) {
                            result[0].url = url;
                            resolve(result[0]);
                        });
                    })
                    .catch(function (error) {
                        throw error;
                    })

            }

        })

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


module.exports = { getMediaAsync, uploadFiles, uploadFilesAndAddToDB, getMedia, deleteFilesAndSaveToDB, downloadFile, downloadAllFiles };