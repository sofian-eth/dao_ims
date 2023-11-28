var propertydb = require('../../../Models/propertydb.js');

const getpropertytaxes = function (req, res, next) {
    let err = {};
    propertydb.gettaxes()
        .then(function (result) {

            res.status(200).json({ error: false, message: '', data: result });
        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error occurred in fetching project taxes";
            err.stackTrace = error;
            next(err);
        })
}


module.exports = { getpropertytaxes };