const db = require('../db');
const aws = require('../../utils/aws-utils');
const knex = db.knex;




const file = function (file, body) {

    var filename = Date.now() + file[0].originalname;
    var completeFileKey = body.type + '/' + filename;
    let fileName = body.name || body.type;
    return aws.uploadFiles(file[0].buffer, completeFileKey, file[0].mimetype)
        .then(function (result) {
            return knex('documents').insert({ documentName: fileName, documentUrl: filename, documentType: body.type });

        })
        .then(function (result) {
            return knex('documents').where({ documentUrl: filename }).select('id');

        })
        .then(function (result) {
            return result;
        })

        .catch(function (error) {

            throw error;
        })





}

const fetchfile = function (body) {
    return knex('documents')
        .select('documentName', 'documentType', 'documentUrl')

        .modify(function (queryBuilder) {
            if (body) {
                queryBuilder.where({ documentUrl: body }).orWhere({ id: body });
            }
        })

        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
}

const transactionAttachment = function (body) {
    let attachmentsArray = body.attachments;
    let tradeAttachment = [];
    for (var i = 0; i < attachmentsArray.length; i++) {
        let object = {};
        object.tradeID = body.tradeID;
        object.mediaId = parseInt(attachmentsArray[i]);
        tradeAttachment.push(object);
    };


    return knex('tradedocuments').insert(tradeAttachment)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw 'Error occurred in adding document';
        })
}


const removeTradeAttachment = function (body) {
    return knex('tradedocuments').where({ documentID: body.documentID }).orWhere({mediaID: body.documentID}).del()
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw 'Error occurred in removing document';
        })
}


async function documentEnum(name){
    return knex('documentenum')
    .where({ bucketId: name })
    .select('id')
    .first()
    .then(function(result){
        return result;
    })
    .catch(function(error){
        throw 'Invalid bucket name';
    })
};


module.exports = { file, fetchfile, transactionAttachment, removeTradeAttachment,documentEnum };