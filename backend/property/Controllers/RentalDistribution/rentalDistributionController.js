const core = require('core');
const rentalService = require('./rentalDistributionService');
const moment = require("moment");  


const getRentalAndCreditListings = async function (req, res, next) {
    const {category=null} = req.query;
    let resp = new core.responseObject();
    let id = req.decoded && req.decoded.id ? req.decoded.id : 0;
    return await rentalService.getProperties(id)
        .then(function (result) {

            if (result.success) {
                resp.setSuccess('properties fetched');
                resp.data = result.data;
                res.status(200).json(resp);
            } else {
                resp.setError(result.message.toString(), "PROPERTIES_NOT_FETCHED")
                res.status(200).json(resp);
            }

        })
        .catch(function (error) {
            resp.setError(error.toString(), "PROPERTIES_NOT_FETCHED")
            res.status(200).json(resp);
        })
}

const getRentalAndCreditHeaderStats = async function (req, res, next) {
    const {category=null} = req.query;
    let resp = new core.responseObject();
    let id = req.decoded && req.decoded.id ? req.decoded.id : 0;
    return await rentalService.getRentalCreditHeaderStats(id)
        .then(function (result) {

            if (result.success) {
                resp.setSuccess('header stats fetched');
                resp.data = result.data;
                res.status(200).json(resp);
            } else {
                resp.setError(result.message.toString(), "STATS_NOT_FETCHED")
                res.status(200).json(resp);
            }

        })
        .catch(function (error) {
            resp.setError(error.toString(), "STATS_NOT_FETCHED")
            res.status(200).json(resp);
        })
}

const getRentalHeaderStatsOfProperty = async function (req, res, next) {
    const {propertyID=null} = req.query;
    let resp = new core.responseObject();
    let id = req.decoded && req.decoded.id ? req.decoded.id : 0;
    return await rentalService.getRentalHeaderStatsOfProperty(id,propertyID)
        .then(function (result) {

            if (result.success) {
                resp.setSuccess('header stats fetched');
                resp.data = result.data;
                res.status(200).json(resp);
            } else {
                resp.setError(result.message.toString(), "STATS_NOT_FETCHED")
                res.status(200).json(resp);
            }

        })
        .catch(function (error) {
            resp.setError(error.toString(), "STATS_NOT_FETCHED")
            res.status(200).json(resp);
        })
}

const getRentalListingByProperty = async function (req, res, next) {
    const {propertyID=null,status=null, startDate=null, endDate=null} = req.query;
    let resp = new core.responseObject();
    let id = req.decoded && req.decoded.id ? req.decoded.id : 0;
    return await rentalService.getRentalListingByProperty(id,propertyID,status,startDate,endDate)
        .then(function (result) {

            if (result.success) {
                resp.setSuccess('listsing stats fetched');
                resp.data = result.data;
                res.status(200).json(resp);
            } else {
                resp.setError(result.message.toString(), "LISTINGS_NOT_FETCHED")
                res.status(200).json(resp);
            }

        })
        .catch(function (error) {
            resp.setError(error.toString(), "LISTINGS_NOT_FETCHED")
            res.status(200).json(resp);
        })
}
const sendRentalDisbursementReminder = async function (req, res, next) {
    const {payoutID=null} = req.query;
    let resp = new core.responseObject();
    let userID = req.decoded && req.decoded.id ? req.decoded.id : 0;
    params={userID,payoutID}
    return await rentalService.sendRentalDisbursementReminder(params)
        .then(function (result) {

            if (result.success) {
                resp.setSuccess('REMINDER_SENT');
                resp.data = result.data;
                res.status(200).json(resp);
            } else {
                resp.setError(result.message.toString(), "REMINDER_NOT_SENT")
                res.status(200).json(resp);
            }

        })
        .catch(function (error) {
            resp.setError(error.toString(), "REMINDER_NOT_SENT")
            res.status(200).json(resp);
        })
}
const downloadRentalReceipt = async function (req, res, next) {
    const {payoutID=null} = req.query;
    let resp = new core.responseObject();
    let userID = req.decoded && req.decoded.id ? req.decoded.id : 0;
    let params={userID,payoutID}
    return await rentalService.downloadRentalReceipt(params)
        .then(function (result) {

            if (result.success) {
                resp.setSuccess('INVOICE_DOWNLOADED');
                resp.data = result.data;
                res.status(200).json(resp);
            } else {
                resp.setError(result.message.toString(), "INVOICE_NOT_DOWNLOADED")
                res.status(200).json(resp);
            }

        })
        .catch(function (error) {
            resp.setError(error.toString(), "INVOICE_NOT_DOWNLOADED")
            res.status(200).json(resp);
        })
}
const activityForDownload = async function (req, res, next) {
    try {
        
        let resp = new core.responseObject();
        let userID = req.decoded && req.decoded.id ? req.decoded.id : 0;
       let result = await rentalService.generateActivity(req)
            if (result) {
                    resp.setSuccess('ACTIVITY_GENERATED');
                    res.status(200).json(resp);
            }
        } catch (e) {
            resp.setError(result.message.toString(), "ACTIVITY_NOT_GENERATED")
            res.status(200).json(resp);
    }
}


const getMyRentalProperties = async function (req, res, next) {
    const {payoutID=null} = req.query;
    let resp = new core.responseObject();
    let userID = req.decoded && req.decoded.id ? req.decoded.id : 0;
    return await rentalService.getMyRentalProperties(userID)
        .then(function (result) {

            if (result.success) {
                resp.setSuccess('PROPERTIES_FETCHED');
                resp.data = result.data;
                res.status(200).json(resp);
            } else {
                resp.setError(result.message.toString(), "PROPERTIES_NOT_FETCHED")
                res.status(200).json(resp);
            }

        })
        .catch(function (error) {
            resp.setError(error.toString(), "PROPERTIES_NOT_FETCHED")
            res.status(200).json(resp);
        })
}

const generateRentalPropertyPayoutReport = async function (req, res, next) {
    const {propertyID=null, startDate=null,endDate=null} = req.query;
    let resp = new core.responseObject();
    let userID = req.decoded && req.decoded.id ? req.decoded.id : 0;
    let params={propertyID,userID,startDate,endDate}
    return await rentalService.generateRentalPropertyPayoutReport(params)
    .then(function (result) {
        
            if (result.success) {
                resp.setSuccess('PAYOUTS_FETCHED');
                resp.data = result.data;
                res.status(200).json(resp);
            } else {
                resp.setError(result.message.toString(), "PAYOUTS_NOT_FETCHED")
                res.status(200).json(resp);
            }

        })
        .catch(function (error) {
            resp.setError(error.toString(), "PAYOUTS_NOT_FETCHED")
            res.status(200).json(resp);
        })
}


const generateRentalPropertiesDataReport = async function (req, res, next) {
    const {propertyID=null, startDate=null,endDate=null} = req.query;
    let resp = new core.responseObject();
    let userID = req.decoded && req.decoded.id ? req.decoded.id : 0;
    let params={propertyID,userID,startDate,endDate}
    return await rentalService.generateRentalPropertiesDataReport(params)
    .then(function (result) {

            if (result.success) {
                resp.setSuccess('PAYOUTS_FETCHED');
                resp.data = result.data;
                res.status(200).json(resp);
            } else {
                resp.setError(result.message.toString(), "PAYOUTS_NOT_FETCHED")
                res.status(200).json(resp);
            }
            
        })
        .catch(function (error) {
            resp.setError(error.toString(), "PAYOUTS_NOT_FETCHED")
            res.status(200).json(resp);
        })
}


const downloadGeneratedReport = async function (req, res, next) {
    const {propertyID=null, startDate=null,endDate=null,propertyPayout=false} = req.query;
    let resp = new core.responseObject();
    let userID = req.decoded && req.decoded.id ? req.decoded.id : 0;
    let params={propertyID,userID,startDate,endDate,propertyPayout}
    return await rentalService.downloadGeneratedReport(params)
    .then(function (result) {
        
        if (result.success) {
            resp.setSuccess('PAYOUTS_FETCHED');
            resp.data = result.data;
            res.status(200).json(resp);
            } else {
                resp.setError(result.message.toString(), "PAYOUTS_NOT_FETCHED")
                res.status(200).json(resp);
            }

        })
        .catch(function (error) {
            resp.setError(error.toString(), "PAYOUTS_NOT_FETCHED")
            res.status(200).json(resp);
        })
}

const markDisbursementAsRecieved = async function (req, res, next) {
    const {disbursementID=null} = req.query;
    let resp = new core.responseObject();
    let userID = req.decoded && req.decoded.id ? req.decoded.id : 0;
    let params={disbursementID,userID}
    return await rentalService.markDisbursementAsRecieved(params)
    .then(function (result) {

            if (result.success) {
                resp.setSuccess('PAYOUT_ACK');
                resp.data = result.data;
                res.status(200).json(resp);
            } else {
                resp.setError(result.message.toString(), "PAYOUTS_NOT_FETCHED")
                res.status(200).json(resp);
            }

        })
        .catch(function (error) {
            resp.setError(error.toString(), "PAYOUTS_NOT_FETCHED")
            res.status(200).json(resp);
        })
}

const requestSkippedPayouts = async function (req, res, next) {
    const disbursementIDs = req.body.payoutIDs;
    let resp = new core.responseObject();
    let userID = req.decoded && req.decoded.id ? req.decoded.id : 0;
    return await rentalService.requestSkippedPayouts(disbursementIDs,userID,req)
        .then(function (result) {

            if (result.success) {
                resp.setSuccess('PAYOUTS_REQUESTED');
                resp.data = result.data;
                res.status(200).json(resp);
            } else {
                resp.setError(result.message.toString(), "FAILED_TO_REQUEST_PAYOUTS")
                res.status(200).json(resp);
            }
            
        })
        .catch(function (error) {
            resp.setError(error.toString(), "FAILED_TO_REQUEST_PAYOUTS")
            res.status(200).json(resp);
        })
    }
    
    const setDefaultBankForPayout = async function (req, res, next) {
        const {bankID=null, propertyID=null} = req.query;
        let resp = new core.responseObject();
        let userID = req.decoded && req.decoded.id ? req.decoded.id : 0;
        return await rentalService.setDefaultBankForPayout(bankID,userID,propertyID)
        .then(function (result) {
            
            if (result.success) {
                resp.setSuccess('BANK_SET_AS_DEFAULT');
                resp.data = result.data;
                res.status(200).json(resp);
            } else {
                resp.setError(result.message.toString(), "FAILED_TO_SET_BANK_AS_DEFAULT")
                res.status(200).json(resp);
            }
            
        })
        .catch(function (error) {
            resp.setError(error.toString(), "FAILED_TO_SET_BANK_AS_DEFAULT")
            res.status(200).json(resp);
        })
    }

    const skipPayout = async function (req, res, next) {
        const disbursementID = req.params.id;
    let resp = new core.responseObject();
    let userID = req.decoded && req.decoded.id ? req.decoded.id : 0;
    return await rentalService.skipPayout(disbursementID,userID,req)
        .then(function (result) {
            
            if (result.success) {
                resp.setSuccess('PAYOUT_SKIPPED');
                resp.data = result.data;
                res.status(200).json(resp);
            } else {
                resp.setError(result.message.toString(), "FAILED_TO_SKIP_PAYOUT")
                res.status(200).json(resp);
            }

        })
        .catch(function (error) {
            resp.setError(error.toString(), "FAILED_TO_SKIP_PAYOUT")
            res.status(200).json(resp);
        })
}
    
    const getRentalActivityLog = async function (req, res, next) {
        let resp = new core.responseObject();
        // const propertyID = req.query.propertyID;
        let userID = req.decoded && req.decoded.id ? req.decoded.id : 0;
        return await rentalService.getRentalActivityLog(userID,req)
            .then(function (result) {
    
                if (result.success) {
                    resp.setSuccess('ACTIVITIES_FETCHED');
                    resp.data = result.data;
                    res.status(200).json(resp);
                } else {
                    resp.setError(result.message.toString(), "ACTIVITIES_NOT_FETCHED")
                    res.status(200).json(resp);
                }
    
            })
            .catch(function (error) {
                resp.setError(error.toString(), "PROPERTIES_NOT_FETCHED")
                res.status(200).json(resp);
            })
    }

    const downloadLiabilityReport = async function (req, res, next) {
        let resp = new core.responseObject();
        const propertyID = req.params.id;
        let userID = req.decoded && req.decoded.id ? req.decoded.id : 0;
        return await rentalService.downloadLiabilityReport(userID,propertyID)
            .then(function (result) {
    
                if (result.success) {
                    resp.setSuccess('REPORT_GENERATED');
                    resp.data = result.data;
                    res.status(200).json(resp);
                } else {
                    resp.setError(result.message.toString(), "REPORT_NOT_GENERATED")
                    res.status(200).json(resp);
                }
    
            })
            .catch(function (error) {
                resp.setError(error.toString(), "REPORT_NOT_GENERATED")
                res.status(200).json(resp);
            })
    }
    
    
    module.exports = {
    getRentalAndCreditListings,
    getRentalAndCreditHeaderStats,
    getRentalHeaderStatsOfProperty,
    getRentalListingByProperty,
    sendRentalDisbursementReminder,
    downloadRentalReceipt,
    getMyRentalProperties,
    generateRentalPropertyPayoutReport,
    generateRentalPropertiesDataReport,
    downloadGeneratedReport,
    markDisbursementAsRecieved,
    requestSkippedPayouts,
    setDefaultBankForPayout,
    skipPayout,
    getRentalActivityLog,
    activityForDownload,
    downloadLiabilityReport
}