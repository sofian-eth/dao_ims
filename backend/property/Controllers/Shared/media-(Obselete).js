const awsutils = require('../../utils/aws-wrapper');
const db = require('../../Models/db');
const knex = db.knex;

const dotenv = require('dotenv');
dotenv.config();

const uploadMedia = function (req, res, next) {

    var file = req.files[0];
    var documentName = file.fieldname

    knex('documentenum')
        .where({ bucketId: documentName })
        .select('id')
        .first()
        .then(function (result) {

            var object = {
                originalFileName: file.originalname,
                size: file.size,
                documentName: documentName,
                documentId: result.id
            };

            return awsutils.uploadFilesAndAddToDB(file.buffer, object, file.mimetype)
                .then(function (media) {
                    res.status(200).json({ error: false, message: '', data: media });

                }).catch(function (error) {

                });

        });

}

module.exports = { uploadMedia };