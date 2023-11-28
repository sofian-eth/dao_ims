// const projectModel = require('../../models/Property');
// const projectStatsModel = require('../../models/PropertyStats');

const {property,propertystats} = require('../../models/index');

async function projectInformation(req, res, next) {
    let projectID = 1;
    if (req.query.projectID)
        projectID = req.query.projectID;
    try {

        let projectInformation = await property.findOne({ where: { id: projectID } });
        delete projectInformation.dataValues.statusID;
        delete projectInformation.dataValues.blockchainMainContract;
        delete projectInformation.dataValues.coverPhoto;
        return res.status(200).json({ error: false, message: '', data: projectInformation.dataValues });
    } catch (error) {
        let err = {};
        err.statusCode = 400;
        err.message = 'An error occurred in fetching project Information';
        err.stackTrace = error;
        next(err);
    }
}

async function projectStats(req, res, next) {
    let projectID = 1;
    if (req.query.projectID)
        projectID = req.query.projectID;

    try {
        let projectStats = await propertystats.findOne({ where: { propertyID: projectID } });
        return res.status(200).json({ error: false, message: '', data: projectStats.dataValues });

    } catch (error) {
        let err = {};
        err.statusCode = 400;
        err.message = 'An error occurred in fetching project stats';
        err.stackTrace = error;
        next(err);

    }

}
module.exports.projectInformation = projectInformation;
module.exports.projectStats = projectStats;