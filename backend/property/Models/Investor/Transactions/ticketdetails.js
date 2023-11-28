

const db = require('../../db');
const core = require('core');

const knex = db.knex;

const ticketdetails = function (investorid, queuenumber) {


    return knex('tradeactivity as t')
        .where({ 't.queueNumber': queuenumber })
        // .andWhere({'t.fromuser':investorid})
        // .orWhere({'t.touser':investorid})
        .join('users as b', 't.buyerID', '=', 'b.id')
        .join('users as s', 't.sellerID', '=', 's.id')
        .join('developmentrounds as d', 't.roundID', '=', 'd.id')
        .join('property as p', 'd.propertyID', '=', 'p.id')
        .join('statusenum as st', 't.statusID', '=', 'st.id')
        .join('paymentmodeenum as pm', 't.paymentMode', '=', 'pm.id')
        .select('t.id', 't.queueNumber', 't.agentID', 't.paymentDate', 't.billingAddress', 't.areaPledged', 't.totalPrice', 't.sqftPrice', 'pm.paymentMode as paymentMode', 'b.membershipNumber', 'b.firstName', 'b.lastName', 'b.legalName', 'b.email', 'b.phoneNumber', 's.membershipNumber as sellermembership', 's.firstName as sellerfirstname', 's.lastName as sellerlastname', 's.legalName as sellerlegalname', 's.email as selleremail', 's.phoneNumber as sellerphone', 'p.name as propertyName', 'd.roundName', 'd.startDate', 'd.endDate', 'd.discounts', 'st.name', 't.createdAt')
        .then(function (result) {

            return result;
        })
        .catch(function (error) {
            throw error;
        })

}

const transactionDetail = (id) => {
    return knex('tradeactivity').where({id}).then(res => res.length > 0 ? res.pop() : null).catch(err => {throw err});
}

const txdetailsattachment = function (txid) {

    return knex('tradedocuments as td')
        .where({ 'td.tradeID': txid })
        .join('documents as d', 'td.documentID', '=', 'd.id')
        .select('d.documentUrl', 'd.documentType', 'd.documentName')
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })

}


const ticketAuthorization = function (investorid, queuenumber) {

    return knex('tradeactivity')
        .where({ queueNumber: queuenumber }).select('buyerID', 'sellerID', 'agentID')
        .then(function (result) {

            if (!result.length)
                throw 'Transaction does not exist';
            if (result[0].buyerID != investorid && result[0].sellerID != investorid && result[0].agentID != investorid)
                throw 'Authorization check not passed';

            return 'Authorization check pass';

        })
        .catch(function (error) {
            throw error;
        })
}


// async function transactionAttachments(ticketID) {

//     let response = [];

//     return knex('tradedocuments as td')
//         .where({ 'td.tradeID': ticketID })
//         .select("*")
//         .then(function (result) {

//              let myPromise = new Promise(function (resolve, reject) {
             
           
//             result.forEach(element => {
//                 if(element.mediaId)
//                     {
                      

                        
//                         let mediaResponse;
//                         return knex('media as m')
//                             .select('m.originalFileName','d.name','d.bucketId','m.relativePath','m.size','m.id')
//                             .join('documentenum as d','m.documentId','=','d.id')
//                             .where({'m.id': element.mediaId})
//                             .then(function(result){
                                
//                                 mediaResponse = new core.mediaResponse(result[0]);
//                                 return core.fileuploader.getMedia(result[0].relativePath);

//                             })
//                             .then(function(result){
//                                 mediaResponse.url = result;
//                                 response.push(mediaResponse);
                               
//                                return;
//                             })

                       

                       
                            
                    
  
//                     }

//                     if(element.documentID)
//                     {
                      
//                         let documentResponse;
//                         return knex('tradedocuments as td')
//                             .select('d.documentUrl as originalFileName',
//                                 'd.documentName', 'd.id as documentID',
//                                 'd.documentType')
//                             .where({ 'd.id': element.documentID })
//                             .join('documents as d', 'td.documentID', '=', 'd.id')
//                             .then(function(result){
//                                 documentResponse = {
//                                     originalFileName: result[0].originalFileName,
//                                                             documentName: result[0].documentName,
//                                                             documentType: result[0].documentType,
//                                                             mediaID: null,
//                                                             documentSize: 0
//                                 };
//                                 return core.fileuploader.getMedia('trade' + '/' + result[0].originalFileName);
//                             })
//                             .then(function(result){
//                                 documentResponse.url = result;
//                                 response.push(documentResponse);
//                                return;
                               
//                             })
                     
                        
                      
//                     }

                    
//                     resolve(response);
                   
                   
                    

//                 });
               

//             });

//             return myPromise.then(function (params) {
//                          return params;
//                      })



//         })
//         .then(function(result){
//             return result;
//         })
//         .catch(error => {
//             throw error;
//         });

// }


async function transactionAttachments(ticketID) {

    let response = [];

    return knex('tradedocuments as td')
        .where({ 'td.tradeID': ticketID })
        .select("*")
        .then(function (result) {


            if (result && result.length && result[0].mediaId) {

                return knex('tradedocuments as td')
                    .select('m.originalFileName', 'd.name', 'd.bucketId', 'm.relativePath',
                            'm.size','m.id')
                    .where({ 'td.tradeID': ticketID })
                    .join('media as m', 'td.mediaID', '=', 'm.id')
                    .join('documentenum as d', 'm.documentId', '=', 'd.id')
                    .orderBy('m.createdAt', 'desc')
                    .then(function (result) {

                        let mypromise = new Promise(function (resolve, reject) {

                            result.forEach(x => {

                                core.fileuploader.getMedia(x.relativePath).then(function (url) {

                                    let data = new core.mediaResponse(x);
                                    data.url = url;
                                    data.relativePath=x.relativePath;
                                    response.push(data);
                                    resolve(response);
                                });
                            });
                        });

                        return mypromise.then(function (params) {
                            return params;
                        })

                    })
            }

            else if (result && result.length && result[0].documentID) {

                return knex('tradedocuments as td')
                    .select('d.documentUrl as originalFileName',
                        'd.documentName', 'd.id as documentID',
                        'd.documentType')
                    .where({ 'td.tradeID': ticketID })
                    .join('documents as d', 'td.documentID', '=', 'd.id')
                    .then(function (result) {

                        let mypromise = new Promise(function (resolve, reject) {

                            result.forEach(x => {

                                let awsUrl = 'trade' + '/' + x.originalFileName
                                core.fileuploader.getMedia(awsUrl).then(function (url) {

                                    response.push({
                                        originalFileName: x.originalFileName,
                                        documentName: x.documentName,
                                        documentType: x.documentType,
                                        url: url,
                                        mediaID: null,
                                        documentSize: 0
                                    });

                                    resolve(response);
                                });
                            });
                        });

                        return mypromise.then(function (params) {
                            return params;
                        })
                    })
            }

            else {
                return response;
            }

        })
        .catch(error => {
            throw error;
        });

    // return knex('tradedocuments as td')
    // .select('media.id as mediaID', 'media.originalFileName', 
    //         'media.size as fileSize', 'documentenum.name as documentName',
    //         'documentenum.id as documentID')
    // .where({ 'td.tradeID': ticketID })    
    // .leftJoin('media', 'td.mediaID', '=', 'media.id')
    // .leftJoin('documentenum', 'media.documentId', '=', 'documentenum.id')
    // .leftJoin('documents as d', 'td.documentID', '=', 'd.id')
    // .then(function (result) {

    //     return result;
    // })
    // .catch(error => {
    //     throw error;
    // })
}


// async function transactionAttachments(ticketID) {

//     let response = [];

//     return knex('tradedocuments as td')
//         .where({ 'td.tradeID': ticketID })
//         .select("*")
//         .then(function (result) {

//             // for loop for all result 
//             // if key exist for specific entry then do that and that
//             //  response me push
//             // else pass
//             if(result && result.length && result[1].mediaId)
//                 return knex('tradedocuments as td')
//                 .select('m.originalFileName', 'd.name', 'd.bucketId', 'm.relativePath','m.size','m.id')
//                 .where({ 'td.tradeID': ticketID })
//                 .join('media as m', 'td.mediaId', '=', 'm.id')
//                 .join('documentenum as d', 'm.documentId', '=', 'd.id');
            
//             if(result && result.length && result[0].documentID)
//                 return knex('tradedocuments as td')
//                 .select('d.documentUrl as originalFileName','d.documentName', 'd.id as documentID','d.documentType')
//                 .where({ 'td.tradeID': ticketID })
//                 .join('documents as d', 'td.documentID', '=', 'd.id') ;
//         })
//         .then(function(result){

//             if(result.relativePath)
//                 return core.fileuploader.getMedia(result[0].relativePath);
//             else {
//                 console.log(result);
//                 return core.fileuploader.getMedia('trade' + '/' + result[0].originalFileName);    
//             }
//         })
//         .then(function(result){
//             response.push(result);
//             console.log(response);
//         })

//         .catch(function(error){
//             console.log(error);
//         })



// }


async function oldAttachments(ticketID){
    let documentResponse=[];
    return knex('tradedocuments as td')
    .select('d.documentUrl as originalFileName',
        'd.documentName', 'd.id as documentID',
        'd.documentType','td.createdAt')
    .where({ 'td.tradeID': ticketID })
    .join('documents as d', 'td.documentID', '=', 'd.id')
    .then(function(result){
        result.forEach(element => {
            let response = {
                originalFileName: element.originalFileName,
                documentName: element.documentName,
                documentType: element.documentType,
                relativePath: 'trade/'+ element.originalFileName,
                mediaID: null,
                documentSize: 0,
                createdAt:element.createdAt
            };

            documentResponse.push(response)

        });
          
       
    })
    .then(function(result){
       
       return documentResponse;
       
    })
}

async function newAttachments(ticketID){
    let mediaResponse=[];
    return knex('tradedocuments as td')
                 .select('m.originalFileName', 'd.name', 'd.bucketId', 'm.relativePath','m.size','m.id','m.createdAt')
                 .where({ 'td.tradeID': ticketID })
                 .join('media as m', 'td.mediaId', '=', 'm.id')
                 .join('documentenum as d', 'm.documentId', '=', 'd.id')
        .then(function(result){
            result.forEach(element => {
                    let response = new core.mediaResponse(element);
                    response.relativePath = element.relativePath;
                     mediaResponse.push(response);
            });

        })
        .then(function(result){
          
           
           return mediaResponse;
        })


}


async function marketplaceAttachments(ticketID) {
    let mediaResponse = [];
    return knex.raw(`SELECT DISTINCT media.originalFileName, IF(orderPayments.type='servicecharges','Service Charges',documentenum.name) as name, documentenum.bucketId, media.relativePath,media.size,media.id,media.createdAt FROM orderItems INNER JOIN orderPayments ON orderPayments.parentID=orderItems.id INNER JOIN paymentAttachments ON paymentAttachments.paymentID=orderPayments.id AND paymentAttachments.id IS NOT NULL  INNER JOIN media ON paymentAttachments.mediaID=media.id inner join documentenum on media.documentId=documentenum.id WHERE orderItems.tradeActivityID=${ticketID};`)
                .then((result) => {
                    if( Array.isArray(result) && result.length > 0) {
                        result[0].forEach(element => {
                            let response = new core.mediaResponse(element);
                            response.relativePath = element.relativePath;
                            mediaResponse.push(response);
                        });
                    }
                })
                .then(() => {
                    console.log("mediaResponse", mediaResponse);
                    return mediaResponse;
                });
    return knex('orderItems')
                .distinct('media.originalFileName', knex.if , 'documentenum.name', 'documentenum.bucketId', 'media.relativePath','media.size','media.id','media.createdAt')
                .innerJoin('orderPayments', 'orderPayments.parentID', '=', 'orderItems.id')
                .innerJoin('paymentAttachments', 'paymentAttachments.paymentID', '=', 'orderPayments.id')
                .innerJoin('media', 'paymentAttachments.mediaID', '=', 'media.id')
                .innerJoin('documentenum', 'media.documentId', '=', 'documentenum.id')
                .where({'orderItems.tradeActivityID': ticketID})
                .then((result) => {
                    result.forEach(element => {
                        let response = new core.mediaResponse(element);
                        response.relativePath = element.relativePath;
                         mediaResponse.push(response);
                    });
                })
                .then(() => {
                    console.log("mediaResponse", mediaResponse);
                    return mediaResponse;
                })
}

module.exports = { ticketdetails, txdetailsattachment, ticketAuthorization, transactionAttachments,oldAttachments,newAttachments, transactionDetail,marketplaceAttachments };