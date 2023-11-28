
const pdfTemplates = require('../../utils/pdf-utils');
const awsUtils = require('../../utils/aws-utils.js');
const receiptDB = require('../../Models/Investor/Transactions/addreceipt');
const awsWrapper = require('../../utils/aws-wrapper');

const postreceipt = function (ticketobject) {
    let fileName;
    let pdfContent;

    return pdfTemplates.generatepdf('receipt', ticketobject)
        .then(function (result) {
            
            fileName = result.filename;
     
            pdfContent = result.pdfcontent;
            let object = {
                originalFileName: fileName,
                documentName: 'salesreceipt',
                size: 0
            };
         return awsWrapper.uploadFilesAndAddToDB(pdfContent,object,'application/pdf')

        })
        
        .then(function (result) {
        
            // if(ticketobject && ticketobject.bucketId)
                 return receiptDB.addattachment(ticketobject.queuenumber, result.id)            

        })
        .then(function (result) {
            return result;
        })
        .catch(function (error) {

            throw error;
        })
}

module.exports = { postreceipt };