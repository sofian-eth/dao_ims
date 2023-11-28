var propertyinfodb = require('../../../Models/Property/propertyinfo');

const propertyinfo = function (req, res, next) {

    let err = {};
    propertyinfodb.propertyinfo(req.query.projectID)
        .then(function (result) {

            res.status(200).json({ error: false, message: '', data: result });
        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error occurred in fetching project information";
            err.stackTrace = error;
            next(err);
            //            res.status(400).json({ error: true, message: 'Error occurred in updating information' });
        })



}


const updatepropertyinfo = function (req, res, next) {
    let err = {};
    propertyinfodb.updatepropertyinfo(req.body)
        .then(function (result) {
            //s  res.json(result);
            res.status(200).json({ error: false, message: '', data: result });
        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error occurred in updating project information";
            err.stackTrace = error;
            next(err);
            //            res.status(400).json({ error: true, message: 'Error occurred in updating information' });
        })

}


module.exports = { propertyinfo, updatepropertyinfo };