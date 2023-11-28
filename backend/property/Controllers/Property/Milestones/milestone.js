

const milestondb = require('../../../Models/Property/addmilestones');
const devrounddetails = require('../../../Models/Property/fundingrounddetails');
const milestonedetails = require('../../../Models/Property/getmilestones');

const addmilestones = function (req, res, next) {
    let err = {};
    return milestondb.addmilestones(req.body)
        .then(function (result) {
            res.status(200).json({ error: false, message: 'Milestone added.' });
        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error occurred in adding project milestones";
            err.stackTrace = error;
            next(err);
            //           res.status(400).json({ error: true, message: 'Error in adding milestone' });
        })


}

const updatemilestones = function (req, res, next) {
    let err = {};
    return milestondb.updateMilestoneStatus(req.body)
        .then(function (result) {
            res.status(200).json({ error: false, message: 'Milestone progress updated.' });
        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error occurred in adding project milestones";
            err.stackTrace = error;
            next(err);
            //            res.status(400).json({ error: true, message: 'Error in updating progress.' });
        })
}

const getmilestones = function (req, res, next) {
    let err = {};
    var rounddetails;

    devrounddetails.fundingrounddetails(req.query.propertyid, req.query.devid)
        .then(function (result) {
            rounddetails = result[0];
            return milestonedetails.milestonedetails(req.query.propertyid, req.query.devid)
        })
        .then(function (result) {

            let response = {
                rounddetails: rounddetails,
                milestones: result
            };
            res.status(200).json({ error: false, message: '', data: response });

        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error occurred in fetching project milestones";
            err.stackTrace = error;
            next(err);
            // res.status(400).json({ error: true, message: 'Error in fetching milestones' });
        })


}

module.exports = { addmilestones, updatemilestones, getmilestones };