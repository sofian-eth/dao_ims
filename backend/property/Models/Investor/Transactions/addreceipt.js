

const db = require('../../db.js');
const knex = db.knex;

// const addattachment = function (filename, queuenumber) {

//     var documentid;

//     return knex()

//     return knex('documents').insert({ documentName: 'Sales Receipt', documentUrl: filename, documentType: 'trade' }).returning('id')
//         .then(function (result) {
//             documentid = result[0];
//             return knex('tradeactivity').where({ queueNumber: queuenumber }).select('id')
//         })
//         .then(function (result) {
//             return knex('tradedocuments').insert({ tradeID: result[0].id, documentID: documentid })
//         })

//         .then(function (result) {
//             return result;
//         })
//         .catch(function (error) {
//             throw error;
//         })
// }

// const addattachment = function (filename, queuenumber, documentName) {

//     var mediaid;
    
//     return knex('documentenum').where({ bucketId: "salesreceipt" }).select('id').first()
//         .then(function (result) {
//             var media = { fileName: filename, originalFileName: filename, description: "Uploaded By System", isImage: 0, extension: ".pdf", size: size, documentId: result.id, createdAt: new Date(), updatedAt: new Date()}
//             return knex('media').insert(media).returning('id')
//                 .then(function (result) {
//                     console.log(result);
//                     mediaid = result[0];
//                     return knex('tradeactivity').where({ queueNumber: queuenumber }).select('id')
//                 })
//                 .then(function (result) {
//                     return knex('tradedocuments').insert({ tradeID: result[0].id, mediaId: mediaid })
//                 })
//                 .then(function (result) {
//                     return result;
//                 })
//                 .catch(function (error) {
//                     throw error;
//                 })
//         })

// }


async function addattachment(ticketId,mediaId){

    return knex('tradeactivity').where({ queueNumber: ticketId }).select('id')
        .then(function(result){
            return knex('tradedocuments').insert({ tradeID: result[0].id, mediaId: mediaId })
        })
        .then(function(result){
            return {tradeActivityID: result, mediaId: mediaId};
        })
        .catch(function(error){
            throw error;
        })
};

async function addReceiptMedia(ticketId,mediaId){

    return knex('tradeactivity').where({ queueNumber: ticketId }).select('id')
        .then(function(result){
            
            return knex('tradedocuments').where({tradeID: result[0].id})
        })
        .then(function(result){
            
            
            if(result.length==0){
                return knex('tradeactivity').where({ queueNumber: ticketId }).select('id')
                    .then(function(result){
                            return knex('tradedocuments').insert({ tradeID: result[0].id, mediaId: mediaId })
                        })
                    .then(function(result){
                            return {tradeActivityID: result, mediaId: mediaId};
                        })
                        .catch(function(error){
                             throw error;
                        })
            }

            else{
               
                
                //documentID is set here 11, representing to update sale receipts only not other media of respective trade
                let query="UPDATE tradedocuments INNER JOIN media SET tradedocuments.mediaID=?  WHERE tradedocuments.tradeID=? AND media.id=tradedocuments.mediaId AND media.documentId=?";
                return knex.raw(query,[mediaId, ticketId,11])
                    .then(function(result){
                        return {tradeActivityID: result, mediaId: mediaId};
                    })
                    .catch(function(error){
                        throw error;
                    })
                
            }
        })

    
};


const txreceipt = function (investorid, tradeid) {

    return knex('tradeactivity').where({ id: tradeid }).select('fromuser', 'touser')
        .then(function (result) {
            if (!result.length)
                throw 'Transaction not found';

            if (result[0].fromuser == investorid || result[0].touser == investorid)
                return knex('tradedocuments as td').where({ tradeid: tradeid }).join('documents as d', 'td.documentid', '=', 'd.id').where({ 'd.docuemnttype': 'receipt' }).select('documenturl');
            else
                throw 'Access control issue';
        })
        .then(function (result) {
            if (!result.length)
                throw 'Document not found';
            return result[0].documenturl;
        })
        .catch(function (error) {
            throw error;
        })
};



module.exports = { addattachment, addReceiptMedia,txreceipt };