
const documentdb = require('../../../Models/Property/documents');


const adddocument = function (req, res, next) {
    let err = {};
    documentdb.adddocument(req.body)
        .then(function (result) {
            res.status(200).json({ error: false, message: "Document added successfully" });
        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error occurred in adding project document";
            err.stackTrace = error;
            next(err);
            

        })
}


const alldocuments = function (req, res, next) {
    let err = {};
    var document_type = req.query.type;
    var projectID = req.query.projectID;

    documentdb.alldocuments(document_type,projectID)
        .then(function (result) {
            res.status(200).json({ error: false, message: '', data: result });
        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error occurred in adding project document";
            err.stackTrace = error;
            next(err);

         
        })
};


module.exports = { adddocument, alldocuments };