const awsutils = require('./utils/aws-wrapper.js');
const path = require('path');
const db = require('./Models/db.js');
const core = require("core");
const knex = db.knex;
const fs = require('fs');

//node aws-upload-utility [folderName] [fileName] [documentName]

const uploadMediaTest = function () {

    var documentName = process.argv[4];

    knex('documentenum')
        .where({ bucketId: documentName })
        .select('id')
        .first()
        .then(function (result) {
                        
            var basePath = 'D:\\DaoData';
            var folderName = process.argv[2]
            var originalFileName = process.argv[3];
            var fullPath = path.join(basePath,folderName,originalFileName);
            const stream = fs.readFileSync(fullPath);

            var object = {
                originalFileName: originalFileName,
                size: stream.length,
                documentName: documentName,
                documentId: result.id
            };

            core.fileuploader.uploadFilesAndAddToDB(stream, object).then(function (media) {
                getMediaTest(media.id);                
            });

        })
        .catch(function (error) {
            throw error;
        });

}


const getMediaTest = function (id) {

    knex('media').where({ id: id }).select('*').first().then(function (media) {

        core.fileuploader.getMedia(media.relativePath).then(function (url) {
            console.log(media);
        });

    });
}

uploadMediaTest();
