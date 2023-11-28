const db = require('../../db.js');
const aws = require('../../../utils/aws-utils.js');
const knex = db.knex;


const addattachment = function (file, body, investorid) {

    var filename = Date.now() + file[0].originalname;
    var fileKey = 'trade/'+filename;
    var statusID;
    var documentid;

    return knex('statusenum').where({ name: 'locked' }).select('id')
        .then(function (result) {
            statusID = result[0].status;
            return knex('tradeactivity').where({ queueNumber: body.qid }).select('statusID');
        })
        .then(function (result) {
            if (!result.length)
                throw 'Not found';

            status = result[0].status;
            if (statusID == status)
                throw 'Transaction is locked';

            return knex('documents').insert({ documentName: body.type, documentUrl: filename, documentType: 'trade' })

        })
        .then(function (result) {

            return knex('documents').where({ documentUrl: filename }).select('id')
        })
        .then(function (result) {
            documentid = result[0].id;
            return knex('tradeactivity').where({ queueNumber: body.qid }).select('id')
        })
        .then(function (result) {
            return knex('tradedocuments').insert({ tradeID: result[0].id, documentID: documentid })
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
