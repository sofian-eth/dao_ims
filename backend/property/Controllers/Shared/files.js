
const filedb = require('../../Models/Shared/files');
const awsutils = require('../../utils/aws-utils');
const dotenv = require('dotenv');
dotenv.config();

const uploadfile = function (req, res, next) {
    return filedb.file(req.files, req.body)
        .then(function (result) {
            //           res.json(result);
            res.status(200).json({ error: false, message: '', data: result });

        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error occurred in uploading file";
            err.stackTrace = error;
            next(err);
            //            res.status(400).json({ error: true, message: error });
        })

}


const getfile = function (req, res, next) {
    let err = {};
    var documentid = req.query.document;
    return filedb.fetchfile(documentid)
        .then(function (result) {
            //           res.json(result);
            res.status(200).json({ error: false, message: '', result: result });
        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error occurred in fetching file";
            err.stackTrace = error;
            next(err);
            //  res.status(400).json({ error: true, message: 'Error in fetching file' });
        })
}




const signedurl = function (req, res, next) {
    let err = {};
    var documentid = req.query.document;
    return filedb.fetchfile(documentid)
        .then(function (result) {
            if (result.length == 0)
                throw 'Not Found';
            let documentKey = result[0].documentType + '/' + result[0].documentUrl;
            return awsutils.generateSignedUrl(documentKey);

        })
        .then(function (result) {
            res.status(200).json({ error: false, message: '', data: result });
            //           res.json(result);
        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error in generating signed URL";
            err.stackTrace = error;
            next(err);
            //          res.status(400).json({ error: true, message: 'Error in generating signed URL' })
        })
}



const tradeAttachments = function (req, res, next) {
    let err = {};
    return filedb.transactionAttachment(req.body)
        .then(function (result) {
            res.status(200).json({ error: false, message: 'Attachments added successfully' });
        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error in adding attachments";
            err.stackTrace = error;
            next(err);
            //            res.status(400).json({ error: true, message: 'Error in adding attachments' });
        })

}

const removeTradeAttachments = function (req, res, next) {
    let err = {};
    return filedb.removeTradeAttachment(req.body)
        .then(function (result) {
            res.status(200).json({ error: false, message: 'Attachment removed successfully' });

        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error in removing attachment";
            err.stackTrace = error;
            next(err);
            //            res.status(400).json({ error: false, message: 'Error in removing attachment' });
        })
}
module.exports = { uploadfile, getfile, signedurl, tradeAttachments, removeTradeAttachments };