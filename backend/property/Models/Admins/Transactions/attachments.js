

const db = require('../../db.js');
const aws = require('../../../utils/aws-utils.js');
const knex = db.knex;


const addattachment = function (file, body) {

    var filename = Date.now() + file[0].originalname;
    var fileKey = 'trade/' + filename;
    var documentid;

    return knex('documents').insert({ documentName: body.type, documentUrl: filename, documentType: 'trade' })
        .then(function (result) {

            return knex('documents').where({ documenturl: filename }).select('id')
        })
        .then(function (result) {
            documentid = result[0].id;
            return knex('tradeactivity').where({ queuenumber: body.qid }).select('id')
        })
        .then(function (result) {
            return knex('tradedocuments').insert({ tradeid: result[0].id, documentid: documentid })
        })
        .then(function (result) {
            return aws.uploadFiles(file[0].buffer, fileKey, file[0].mimetype)
        })
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })



}




module.exports = { addattachment };