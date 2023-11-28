var propertystats = require('../../../Models/Property/propertystats');
const projectFundingRoundStats = require('../../../Models/Property/fundingrounddetails');
const blockchainUtils = require('../../../utils/blockchain-utils');



const getpropertystats = function (req, res, next) {
    let err = {};
    propertystats.getpropertystats()
        .then(function (result) {
          
            res.status(200).json({ error: false, message: '', data: result });
        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error occurred in fetching project milestones";
            err.stackTrace = error;
            next(err);
            
        })
}


const propertyFundingStats = function (req, res, next) {
    let err = {};
    var soldArea = 0;
    var pendingPledges = 0;
    var overPledges = 0;
    var Funds = 0;
    var daoWalletAddress;
    return blockchainUtils.userbalance()
        .then(function (result) {

            daoWalletAddress = result;
            return projectFundingRoundStats.pendingPledges(1);

        })
        .then(function (result) {
            let parsedData = JSON.parse(JSON.stringify(result[0]));


            pendingPledges = parseInt(parsedData[0].pendingPledges);
            return blockchainUtils.circulationtokens();
        })
        .then(function (result) {
            Funds = result;
            soldArea = Funds - daoWalletAddress;
            let remainingFunds = Funds - (soldArea + pendingPledges);
            if (remainingFunds < 0) {
                overPledges = (soldArea + pendingPledges) - Funds;
                pendingPledges = pendingPledges - overPledges;
                remainingFunds = 0;


            }

            let responseData = {
                soldArea: Math.round(soldArea),
                AreaPledged: Math.round(pendingPledges),
                overPledges: Math.round(overPledges),
                remainingFunds: Math.round(remainingFunds),
                Funds: Funds,



            };
            return res.status(200).json({ error: false, message: '', data: responseData })
        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error occurred in fetching round stats";
            err.stackTrace = error;
            next(err);
        })



}

module.exports = { getpropertystats, propertyFundingStats };