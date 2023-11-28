
const pdfTemplates = require('../../utils/pdf-utils');

const receiptDB = require('../../Models/Investor/Transactions/addreceipt');

const core = require('core');
const anotherPostReceipt = async function(filename,data){
    return pdfTemplates.generatepdf(filename, data)
    .then(function (result) {
        
        fileName = result.filename;
 
        pdfContent = result.pdfcontent;
        let size = 0;
        if(result.pdfcontent&&result.pdfcontent.length>0){
            size=result.pdfcontent.length
        }
        let object = {
            originalFileName: fileName,
            documentName: 'salesreceipt',
            size: size
        };
        //return result;
     return core.fileuploader.uploadFilesAndAddToDB(pdfContent,object,'application/pdf')

    })
    
    // .then(function (result) {

    //          return receiptDB.addattachment(ticketobject.queuenumber, result.mediaId)            

    // })
    .then(function (result) {
        return result;
    })
    .catch(function (error) {
        
        throw error;
    })
}
const postreceipt = function (ticketobject) {
    let fileName;
    let pdfContent;
    // todo: just in case if somewhere dto is not used
    ticketobject.status_class = ticketobject.status.replace(/ +/g, "");
    return pdfTemplates.generatepdf('receipt', ticketobject)
        .then(function (result) {
            
            fileName = result.filename;
     
            pdfContent = result.pdfcontent;
            let size = 0;
            if(result.pdfcontent&&result.pdfcontent.length>0){
                size=result.pdfcontent.length
            }
            let object = {
                originalFileName: fileName,
                documentName: 'salesreceipt',
                size: size
            };
         return core.fileuploader.uploadFilesAndAddToDB(pdfContent,object,'application/pdf')

        })
        
        .then(function (result) {

                 return receiptDB.addReceiptMedia(ticketobject.queuenumber, result.mediaId)            

        })
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            
            throw error;
        })
}
const peerToPeerreceipt = function (ticketobject) {
    let fileName;
    let pdfContent;
    // todo: just in case if somewhere dto is not used
    // ticketobject.status_class = ticketobject.status.replace(/ +/g, "");
    return pdfTemplates.generatepdf('p2p-recipt', ticketobject)
        .then(function (result) {
            // console.log('recipt result : ',result)
            fileName = result.filename;
     
            pdfContent = result.pdfcontent;
            let size = 0;
            if(result.pdfcontent&&result.pdfcontent.length>0){
                size=result.pdfcontent.length
            }
            let object = {
                originalFileName: fileName,
                documentName: 'peertopeer',
                size: size
            };
         return core.fileuploader.uploadFilesAndAddToDB(pdfContent,object,'application/pdf')

        })
        
        .then(function (result) {

                 return receiptDB.addattachment(ticketobject.queueNumber, result.mediaId)            

        })
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            
            throw error;
        })
}

const eReportsReceipts = function (ticketobject,templateType) {
    let fileName;
    let pdfContent;
    // todo: just in case if somewhere dto is not used
    return pdfTemplates.generatepdf(templateType, ticketobject)
        .then(function (result) {
            
            fileName = result.filename;
     
            pdfContent = result.pdfcontent;
            let size = 0;
            if(result.pdfcontent&&result.pdfcontent.length>0){
                size=result.pdfcontent.length
            }
            let object = {
                originalFileName: fileName,
                documentName: 'e-reports',
                size: size
            };
         return core.fileuploader.uploadFilesAndAddToDB(pdfContent,object,'application/pdf')

        })
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            
            throw error;
        })
}


const invoiceReceipt = function (purpose,data) {
    let fileName;
    let pdfContent;
    data.domain_url=process.env.BACKEND_URL
    // data.domain_url='http://localhost:8081/';
    return pdfTemplates.generatepdf(purpose, data)
        .then(function (result) {
            
            fileName = result.filename;
     
            pdfContent = result.pdfcontent;
            let size = 0;
            if(result.pdfcontent&&result.pdfcontent.length>0){
                size=result.pdfcontent.length
            }
            let object = {
                originalFileName: data.membershipNumber??data?.userInfo?.daoID+'-Rental-Receipt',
                fileName: data.membershipNumber??data?.userInfo?.daoID+'-Rental-Receipt',
                documentName: 'invoice',
                size: size
            };
         return core.fileuploader.uploadFilesAndAddToDB(pdfContent,object,'application/pdf')

        })
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            
            throw error;
        })
}


const rentalReport = function (purpose,data) {
    let fileName;
    let pdfContent;
    // data.domain_url=this.get('BACKEND_URL')
    data.site_url=process.env.ASSETS_URL;
    return pdfTemplates.generatepdf(purpose, data)
        .then(function (result) {
            
            fileName = result.filename;
     
            pdfContent = result.pdfcontent;
            let size = 0;
            if(result.pdfcontent&&result.pdfcontent.length>0){
                size=result.pdfcontent.length
            }
            let object = {
                originalFileName: data.holderInfo.daoID+'-Rental-Report',
                fileName: data.holderInfo.daoID+'-Rental-Report',
                documentName: 'invoice',
                size: size
            };
         return core.fileuploader.uploadFilesAndAddToDB(pdfContent,object,'application/pdf')

        })
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            
            throw error;
        })
}


module.exports = { postreceipt,eReportsReceipts, anotherPostReceipt,peerToPeerreceipt,invoiceReceipt,rentalReport};