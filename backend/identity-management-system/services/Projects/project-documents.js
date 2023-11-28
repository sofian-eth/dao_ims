//const projectDocumentModels = require('../../models/PropertyDocuments');
const {propertydocuments} = require('../../models/index')

async function projectDocuments(req, res, next) {
    let err = {};
    let projectID = 1;
    let documentType = 'Document';
    if (req.query.projectID)
        projectID = req.query.projectID;

    if (req.query.document)
        documentType = req.query.document;
    try {

        let projectDocument = await propertydocuments.findAll({ where: { documentType: documentType, propertyID: projectID } });
        return res.status(200).json({ error: false, message: '', data: projectDocument });

    } catch (error) {
        console.log(error);
        err.statusCode = error;
        err.message = 'An error occurred in fetching project documents';
        err.stackTrace = error;
        next(err);

    }

}


module.exports.projectDocuments = projectDocuments;