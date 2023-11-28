const awsutils = require('../../utils/aws-wrapper');
const db = require('../../Models/db');
const fileEnum = require('../../resources/fileEnum');
const userKycModel = require('../../Models/Investor/PersonalInformation/personalinformation');
const transactionModel = require('../../Models/Investor/Transactions/transaction');
const documentModel = require('../../Models/Shared/files');
const documentEnum = require('../../resources/documentEnum');
const projectGalleryModel = require('../../Models/Property/gallery');
const fcmService = require('../fcm/fcm.service');
const core = require('core');
const knex = db.knex;
const pdf = require('pdf-parse');
const sharp = require('sharp');
const sanitize = require('sanitize-filename');
const dotenv = require('dotenv');
const { propertyGallery } = require('../../resources/fileEnum');
const { logActivity } = require('./activity-logger');
dotenv.config();

async function containsMaliciousCode(pdfText) {
    const javascriptPattern = /<</;
    if (javascriptPattern.test(pdfText)) {
      return true; 
    } else {
      return false;
    }
}

async function validateImage(buffer) {
    const newBuffer = await sharp(buffer).jpeg().toBuffer();
    return newBuffer;
}

const uploadMedia = async function (req, res, next) {
    const file = req.files[0];
    const buffer = file.buffer;
    const documentName = file.fieldname

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg','image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: true, message: 'Invalid file type' });
    }
  
    if (file.mimetype === 'application/pdf') {
        const pdfData = await pdf(buffer);
        const pdfTextContent = pdfData.text;
        if (containsMaliciousCode(pdfTextContent)) {
            return res.status(400).json({ error: true, message: 'Invalid PDF file' });
        }
    } else if (['image/jpeg', 'image/jpg','image/png'].includes(file.mimetype)) {
      file.buffer = await validateImage(buffer);
    }
  
    const sanitizedOriginalName = sanitize(file.originalname);
    
    knex('documentenum')
        .where({ bucketId: documentName })
        .select('id')
        .first()
        .then(function (result) {

            var object = {
                originalFileName: sanitizedOriginalName,
                size: file.size,
                documentName: documentName,
                documentId: result.id
            };

            return core.fileuploader.uploadFilesAndAddToDB(buffer, object, file.mimetype)
                .then(function (media) {

                    res.status(200).json({ error: false, message: '', data: media });

                }).catch(function (error) {

                });

        });

}




async function saveFile(req, res, next) {
    let err = {};
    try {
        let operationType = req.body.operationType;

        let type = operationType;
        let response;
        if (!type)
            throw 'Invalid operation';

        switch (type) {
            case fileEnum.userKyc:
                response = await userKycModel.updateKyc(req.decoded.id, req.body.cnicFrontId, req.body.cnicBackId);
                return res.status(200).json({ error: false, message: 'File added successfully', data: '' });
            case fileEnum.transaction:
                let attachmentsArray = body.txAttachments;
                let tradeAttachment = [];
                let object = {};
                for (var i = 0; i < attachmentsArray.length; i++) {
                    let object = {};
                    object.tradeID = req.body.tradeId;
                    object.documentId = parseInt(attachmentsArray[i]);
                    tradeAttachment.push(object);
                };
                response = await transactionModel.updateTransactionDocuments(object);
                return res.status(200).json({ error: false, message: 'File added successfully', data: '' });
            case fileEnum.propertyGallery:
                response = await projectGalleryModel.updateGallery(req.body.propertyId, req.body.mediaId);
                return res.status(200).json({ error: false, message: 'File added successfully', data: '' });
        }


    } catch (error) {
       
        err.statusCode = 400;
        err.message = "Error occurred in saving media";
        err.stackTrace = error;
        next(err);
    }

}

async function deleteFile(req,res,next){
    let err = {};
    try {
        let body = req.body;
        let response = await core.fileuploader.deleteFilesAndSaveToDB(body);
        if(response.success){
            res.status(200).send({ error: true, message: 'Deleted successfully.', data: response.data })
        }else{
            res.status(200).send({ error: false, message: 'Error deleting.', data: null })
        }
    } catch (error) {
        err.statusCode = 400;
        err.message = "Error occurred in adding file";
        err.stackTrace = error;
        next(err);
    }
}

function logMedia(description,userID,mediaID,req){
    logActivity(
        {
                logName: "Manage Media",
                description: description,
                subjectID: mediaID,
                subjectType: "media",
                event: "Uploaded",
                causerID: userID,
                causerType: "users",
                properties: {
                    attributes: {
                        dispID: mediaID
                    },
                    old: null
                },
                source: null,
                metadata:null
        }
            ,req)
}

async function saveFileOnUpload(req, res, next) {

    // Save file to media ID
    // Save file to document  
    let err = {};
    try {

        let file = req.files[0];
        let documentName = file.fieldname;
        let response;
        let mediaId;

        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg','image/png'];
        if (!allowedTypes.includes(file.mimetype)) {
            return res.status(400).json({ error: true, message: 'Invalid file type' });
        }

        if (file.mimetype === 'application/pdf') {
            const pdfData = await pdf(file.buffer);
            const pdfTextContent = pdfData.text;
            if (containsMaliciousCode(pdfTextContent)) {
                return res.status(400).json({ error: true, message: 'Invalid PDF file' });
            }
        } 
        else if (['image/jpeg', 'image/jpg','image/png'].includes(file.mimetype)) {
            file.buffer = await validateImage(file.buffer);
        }
    
        file.originalname = sanitize(file.originalname);
    
       


        let documentId = await documentModel.documentEnum(documentName);
        let object = {
            originalFileName: file.originalname,
            size: file.size,
            documentName: documentName,
            documentId: documentId.id
        };

        let savetoAWS = await core.fileuploader.uploadFilesAndAddToDB(file.buffer, object, file.mimetype);
        mediaId = savetoAWS.mediaId;

        let responseObject =
        {
            originalFileName: savetoAWS.originalFileName,
            documentType: savetoAWS.bucketId,
            mediaID: savetoAWS.mediaId,
            documentSize: savetoAWS.size,
            url: savetoAWS.mediaUrl ? savetoAWS.mediaUrl : savetoAWS.url
        }
        
        switch (documentName) {
            case documentEnum.cnicfront:
                userId =  req.body.buyerId || req.decoded.id ;
               
                response = await userKycModel.updateCnicFront(userId, savetoAWS.mediaId);
                logMedia('CNIC Front Updated',userId,savetoAWS.mediaId,req)
                return res.status(200).json({ error: false, message: 'File added successfully', data: responseObject });

            case documentEnum.cnicback:
                userId =  req.body.buyerId || req.decoded.id ;
                response = await userKycModel.updateCnicBack(userId, savetoAWS.mediaId);
                logMedia('CNIC Back Updated',userId,savetoAWS.mediaId,req)
                return res.status(200).json({ error: false, message: 'File added successfully', data: responseObject });

            case documentEnum.profilepic:
                response = await userKycModel.updateProfilePic(req.decoded.id, savetoAWS.mediaId);
                logMedia('Profile Picture Updated',userId,savetoAWS.mediaId,req)
                return res.status(200).json({ error: false, message: 'Profile picture changed successfully', data: responseObject });

            case documentEnum.buyercnicfront:
                userId =  req.body.buyerId || req.decoded.id ;
                logMedia('Buyer CNIC Front Updated',userId,savetoAWS.mediaId,req)
                response = await userKycModel.updateCnicFront(userId, savetoAWS.mediaId);
                return res.status(200).json({ error: false, message: 'File added successfully', data: responseObject });

            case documentEnum.buyercnicback:
              
                userId =  req.body.buyerId || req.decoded.id ;
                response = await userKycModel.updateCnicBack(userId, savetoAWS.mediaId);
                logMedia('Buyer CNIC Back Updated',userId,savetoAWS.mediaId,req)
                return res.status(200).json({ error: false, message: 'File added successfully', data: responseObject });
            
             case documentEnum.buyercnicfront:

                userId =  req.body.buyerId || req.decoded.id ;
                response = await userKycModel.updateCnicFront(userId, savetoAWS.mediaId);
                logMedia('Buyer CNIC Front Updated',userId,savetoAWS.mediaId,req)
                return res.status(200).json({ error: false, message: 'File added successfully', data: responseObject });
    
    
                 
    
            case documentEnum.buyercnicback:
                userId =  req.body.buyerId || req.decoded.id ;
                response = await userKycModel.updateCnicBack(userId, savetoAWS.mediaId);
                logMedia('Buyer CNIC Back Updated',userId,savetoAWS.mediaId,req)
                return res.status(200).json({ error: false, message: 'File added successfully', data: responseObject });
    
    
            case documentEnum.sellercnicfront:
                userId =  req.body.sellerId || req.decoded.id ; 
                response = await userKycModel.updateCnicFront(userId, savetoAWS.mediaId);
                logMedia('Seller CNIC Front Updated',userId,savetoAWS.mediaId,req)
                return res.status(200).json({ error: false, message: 'File added successfully', data: responseObject });
    
        
    
            case documentEnum.sellercnicback:
                userId =  req.body.sellerId || req.decoded.id ;
                response = await userKycModel.updateCnicBack(userId, savetoAWS.mediaId);
                logMedia('Seller CNIC Back Updated',userId,savetoAWS.mediaId,req)
                return res.status(200).json({ error: false, message: 'File added successfully', data: responseObject })

            case documentEnum.depositslip:{
                fcmService.receiptUploadNotification(req.body.transactionId,req.decoded);
            }
            case documentEnum.stamppaper: 
            case documentEnum.voucher:
            case documentEnum.ResaleDocument:
            case documentEnum.receipt:
            case documentEnum.ResaleUndertaking:    
                let transactionId = req.body.transactionId;
               // let isTransactionExist = await transactionModel.transactionAuthorization(transactionId, req.decoded.id);
               
                let object = {
                    tradeID: transactionId,
                    mediaId: savetoAWS.mediaId
                };

                response = await transactionModel.updateTransactionDocuments(object);
                if(response){
                    logActivity(
                        {
                            logName: "Manage Transactions",
                            description: "File uploaded successfully for transaction varification",
                            subjectID: mediaId,
                            subjectType: "media",
                            event: "Uploaded",
                            causerID: req.decoded.id,
                            causerType: "users",
                            properties: {
                                attributes: null,
                                old: null
                            },
                            source: null,
                            metadata:null
                        },req);
                    }
                return res.status(200).json({ error: false, message: 'File added successfully', data: responseObject });
        }

    } catch (error) {
        console.log(error)
        err.statusCode = 400;
        err.message = "Error uploading file";
        err.stackTrace = error;
        next(err);
    }
}


async function fetchMediaFile(req, res, next) {
    let err = {};
    try {
        let mediaUrl = await getMediaTest(req.body.mediaId);
        return res.status(200).json({ error: false, message: '', data: mediaUrl });

    } catch (error) {
        err.statusCode = 400;
        err.message = "Error occurred in fetching file";
        err.stackTrace = error;
        next(err);
    }
}

async function getMediaTest(id) {

    return knex('media')
        .where({ id: id })
        .select('*')
        .first()
        .then(function (media) {

            return core.fileuploader.getMedia(media.relativePath);

        })
        .then(function (url) {
            // console.log(url)
            return url;
        })
        .catch(function (error) {
            throw error;
        });


}


async function fetchMediaDetail(id){
    let response;
    return knex('media')
    .innerJoin('documentenum','documentenum.id','=','media.documentId')    
    .where({ 'media.id': id })
    .select('documentenum.name as documentName','media.size as documentSize','documentenum.bucketId as documentType','media.id as mediaID','media.originalFileName','media.relativePath')
    .then(function (result) {
        
        if(result.length && result[0].relativePath){
            response = result[0];
           
            return core.fileuploader.getMedia(response.relativePath);
        }
        else
        return response;
    })
    .then(function(result){
        if(result)
        response.url = result;
        return response;
    })
    .catch(function (error) {
        throw error;
    });
}


async function fetchMediaUrlByKey(req,res,next){
    let err = {};
    return core.fileuploader.getMedia(req.body.keyName)
    .then(function(result){
        return res.status(200).json({error:false,message:'',data:result});
    })
    .catch(function(error){
        err.statusCode = 400;
        err.message = "Error occurred in saving media";
        err.stackTrace = error;
        next(err);
    })
}
const downloadFile = function (req,res,next){
    const params = req.params.file;
    if(!params) res.status(500).send();
    core.fileuploader.downloadFile(params,res);
}
const downloadAllFiles = async function (req,res,next){
    const params = req.params.id;
    const userId = null;// req.body.buyerId || req.decoded.id ;
    const zip = await core.fileuploader.downloadAllFiles(params,res,userId);
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=" + params+".zip");
    zip.pipe(res);
}
module.exports = { uploadMedia, saveFile, saveFileOnUpload, getMediaTest, fetchMediaFile,fetchMediaUrlByKey,fetchMediaDetail,deleteFile,downloadFile,downloadAllFiles };