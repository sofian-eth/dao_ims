
const addattachmentdb = require('../../../Models/Investor/Transactions/attachments');
const fileDB = require('../../../Models/Shared/files');
const ticketDetails = require('../../../Models/Investor/Transactions/ticketdetails');

const addattachments = function (req, res, next) {
    let err = {};
    addattachmentdb.addattachment(req.files, req.body, req.decoded.id)
        .then(function (result) {
            res.status(200).json({ error: false, message: 'Attachment added successfully', data: '' });
        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error occurred in adding attachment";
            err.stackTrace = error;
            next(err);

        })
}


const transactionAttachments = function (req, res, next) {
    let err = {};
    ticketDetails.ticketAuthorization(req.decoded.id, req.body.tradeID)
        .then(function (result) {
            return fileDB.transactionAttachment(req.body);

        })
        .then(function (result) {
            res.status(200).json({ error: false, message: 'Attachments added successfully' });
        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error occurred in adding attachment";
            err.stackTrace = error;
            next(err);
        })

}

module.exports = { addattachments, transactionAttachments };