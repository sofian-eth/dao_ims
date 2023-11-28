
const blockchainutils = require('../../../utils/blockchain-utils.js');
const txdetails = require('../../../Models/Admins/Transactions/transactiondetailsdb.js');
const txdb = require('../../../Models/Admins/Transactions/transactions.js');
const emailUtils = require('../../../utils/email');
const areaUnitConversion = require('../../../utils/area-unit-conversion');
const accountActivity = require('../../../Models/Shared/account-activity');
const blockchainModule = require('../../Shared/blockchain');
const projectModule = require('../../../Models/Property/information');
const transactionModule = require('../../../Models/Admins/Transactions/transactions');
const blockchaincontroller = function (req, res, next) {
//       request.smartContractAddress,
// request.buyerAddress,
// request.sellerAddress,
// request.funds,

//request.walletPassword
    let txid;
    let txstatus;
    let emailData = {};
    let jsonObject = {};
    let err = {};
    let projectID;
    txdetails.txdetaildb(req.body.queuenumber)
        .then(function (result) {
            console.log(result);
            txstatus = result[0].name;
            if (txstatus == 'locked')
                throw 'tx is locked';
            jsonObject.sellerAddress = result[0].sellethaddress,
            jsonObject.buyerAddress = result[0].walletAddress,
            jsonObject.sellerTronAddress = result[0].sellerTronAddress,
            jsonObject.buyerTronAddress = result[0].buyerTronAddress,
            jsonObject.walletPassword = req.body.pass,

            // If Migrated then add propertyconfig
            jsonObject.blockchainConfig = result[0].propertyConfig;
            emailData.receiver = result[0].email;
            emailData.firstName = result[0].buyerName;
            projectID = result[0].projectID;

            // if isMIgrated then assign new smart contract address
            if (result[0].isMigrated)
                jsonObject.smartContractAddress = result[0].newSmartContract;
            else

                jsonObject.smartContractAddress= result[0].blockchainMainContract;
            return areaUnitConversion.convertToSutar(result[0].areaPledged);
            
        })
        .then(function(result){
            jsonObject.funds = result;
           return transactionModule.pendingTransactionCount();
        })
        .then(function(result){

            jsonObject.pendingTransactionNonce = result;
            return blockchainModule.transfer(jsonObject);
        })
        .then(function (result) {
            txid = result;
            return txdb.updatetx(req.body.queuenumber, txid)


        })
        .then(function (result) {
            let activityObject = {
                subject: 'blockchain',
                action: 'Blockchain transaction for ID ' + req.body.queuenumber + ' is attempted.',
                userID: req.decoded.id,
                userAgent: req.headers['x-my-user-agent'] || req.headers['user-agent'],
                ipAddress: req.headers['my-user-ip'] || (req.headers['x-forwarded-for'] || '').split(',')[0]
            };

            accountActivity.accountActivity(activityObject);
            res.json(txid);
        })
        .catch(function (error) {
            console.log(error);
            err.statusCode = 400;
            err.message = "Error occurred in sending transaction to blockchain";
            err.stackTrace = error;
            next(err);
            // res.status(400).json({ error: true, message: error });
        })

}


const userbalance = function (req, res, next) {
    let err = {};
    blockchainutils.userbalance()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error occurred in fetching user balance";
            err.stackTrace = error;
            next(err);
            // res.status(400).json({ error: true, message: 'Error in fetching user balance' });
        })

}



module.exports = { blockchaincontroller, userbalance };