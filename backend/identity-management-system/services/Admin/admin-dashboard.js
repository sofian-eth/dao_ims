
const {tradeactivity,property,users}= require('../../models/index');
 
async function dashboardStats(req, res, next) {
    try {

        let tradeCount = await tradeactivity.count();
        let propertyCount = await property.count();
        let userCount = await users.count();
        return res.status(200).json({ error: false, message: '', data: { tradeCount: tradeCount, propertyCount: propertyCount, userCount: userCount } });

    } catch (error) {
        let err = {};
        err.statusCode = 400;
        err.message = 'Error occurred in fetching transaction';
        err.stackTrace = error;
    }
}


module.exports.dashboardStats = dashboardStats;