
const blockchainutils = require('../../../utils/blockchain-utils.js');
const addrounddb = require('../../../Models/Property/addrounds.js');
const getroundsdb = require('../../../Models/Property/getrounds.js');
const masteruserbalance = require('../../../utils/blockchain-utils.js');

const updaterounds = require('../../../Models/Property/updaterounds');
const areaConversionUtils = require('../../../utils/area-unit-conversion');
const blockchainModule = require('blockchain');
const propertyModel = require('../../../Models/Property/information')
const devrounds = function (req, res, next) {
    let err = {};
    var txid;
    var jsonobject;
    areaConversionUtils.convertToSutar(req.body.area)
        .then(function (result) {
            req.body.sutarUnits = result;
            return blockchainutils.lockfunds(req.body);
        })
        .then(function (result) {

            jsonobject = {
                name: req.body.name,
                area: req.body.area,
                starttime: req.body.startdate,
                endtime: req.body.enddate,
                sqftprice: req.body.sqftprice,
                marketprice: req.body.marketprice,
                txid: result.txid
            }
            txid = result.txid;
            return addrounddb.addrounds(jsonobject)
        })
        .then(function (result) {
            return masteruserbalance.userbalance()
        })
        .then(function (result) {
            return result;
        })
        .then(function (result) {
            res.status(400).json({ error: false, message: 'Funding round created successfully' });
            res.json(txid);
        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error occurred in unlocking round";
            err.stackTrace = error;
            next(err);
           

        })

}


const getrounds = function (req, res, next) {
    let err = {};
    var projectID = req.query.projectID;
    return getroundsdb.getrounds(projectID)
        .then(function (result) {
            result.forEach(element => {

                if(process.env.environment === 'prod') {
                    element.lockFundsTx = element.mainNetExplorerUrl +element.lockFundsTx;
                    if(element.unlockFundsTx)
                    element.unlockFundsTx = element.mainNetExplorerUrl +element.unlockFundsTx;

                }
                else { 
                    element.lockFundsTx = element.testNetExplorerUrl +element.lockFundsTx;
                    if(element.unlockFundsTx)
                    element.unlockFundsTx = element.testNetExplorerUrl +element.unlockFundsTx;
                   
                }
            });
            res.status(200).json({ error: false, message: '', data: result });

        })
        .catch(function (error) {
            console.log(error);
            err.statusCode = 400;
            err.message = "Error occurred in unlocking round";
            err.stackTrace = error;
            next(err);
       
        })
}



const completedrounds = function (req, res, next) {
    let err = {};
    return getroundsdb.completedroundsdb()
        .then(function (result) {

            let count = {
                count: result[0].CNT
            };

            res.status(200).json({ error: false, message: '', data: count });
 

        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error occurred in unlocking round";
            err.stackTrace = error;
            next(err);
            //  res.status(400).json({ error: true, message: 'Error in fetching completed rounds ' });
        })
}

// const unlockfunds = function (req, res, next) {

//     var txid;
//     let err = {};
//     getroundsdb.singledevrounds(req.body)
//         .then(function (result) {

//             if (result[0].name == 'Done')
//                 throw 'Funding Round have been closed previously';
//             return blockchainutils.unlockfunds(result[0].roundName, req.body.walletPassword)
//         })
//         .then(function (result) {
//             txid = result;
//             return updaterounds.updaterounds(req.body.id, txid,req.body.propertyId);
//         })
//         .then(function (result) {

//             return blockchainutils.userbalance()

//         })
//         .then(function (result) {

//             return result;
//         })
//         .then(function (result) {
//             res.status(200).json({ error: false, message: '', result: txid });

//         })
//         .catch(function (error) {
//             err.statusCode = 400;
//             err.message = error;
//             err.stackTrace = error;
//             next(err);

//             //  res.status(400).json({ error: true, message: error })
//         })





// }







module.exports = { devrounds, getrounds, completedrounds };