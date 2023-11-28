const  db  = require('core');
const investorsdb = require('../../../Models/Admins/Investors/investors');
const { logActivity } = require('../../../services/shared/activity-logger');
const ActivityEvent = require('../../../resources/enum-ActivityLog-event');
const  core = require('core');
const investorcontrollers = function (req, res, next) {
    let err = {};
    investorsdb.investors()
        .then(function (result) {

            res.status(200).json({ error: false, message: '', data: result });
        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error occurred in fetching data";
            err.stackTrace = error;
            next(err);
        })
}

const getMarketplaceUsersDeviceToken = function (req, res, next) {
    let err = {};
    investorsdb.getMarketplaceUsersDeviceToken()
        .then(function (result) {

            res.status(200).json({ error: false, message: '', data: result });
        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error occurred in fetching data";
            err.stackTrace = error;
            next(err);
        })
}

const getNotification = function (req,res,next) {
    let err = {};
    let query = 'select no.id,no.type,no.title,no.description,no.createdAt,no.readBit,no.logo,us.nickName,no.redirectLink,no.to,no.from  from notificationCenter as no join users as us on us.id = no.from where `to` = ? order by no.createdAt desc';
    let data = [req.decoded && req.decoded.id ? req.decoded.id : 0];
    db.fcmDb.execSelect(query,data)
        .then(function (result) {
            res.status(200).json({ error: false, message: '', data: result });
        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error occurred in fetching data";
            err.stackTrace = error;
            next(err);
        })
}
const updateReadBitNotification = function (req,res,next) {
    let err = {};
    let query = 'update notificationCenter set readBit = 1 where id = ?';
    let data = [req.query.id ? req.query.id : 0];
    db.fcmDb.execUpdate(query,data)
        .then(function (result) {
          
            logActivity(
                {
                        logName: "Notification Centre",
                        description: "Viewed notification of "+req.decoded.legalName,
                        subjectID: parseInt(req.query.id),
                        subjectType: "notificationCenter",
                        event: ActivityEvent.VIEWED,
                        causerID: req.decoded.id,
                        causerType: "users",
                        properties: {
                            attributes: {
                                dispID: parseInt(req.query.id)
                            },
                            old: null
                        },
                        source: null,
                        metadata:null
                    }
                    ,req)
            res.status(200).json({ error: false, message: '', data: result });
        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error occurred in fetching data";
            err.stackTrace = error;
            next(err);
        })
}
const marketAllReadNotification = function (req,res,next) {
    let err = {};
    let query = 'update notificationCenter set readBit = 1 where notificationCenter.to = ?';
    let data = [req.decoded && req.decoded.id ? req.decoded.id : 0];
    db.fcmDb.execUpdate(query,data)
        .then(function (result) {
            logActivity(
                {
                    logName: "Notification",
                    description: "Marked all notifiaction as read",
                    subjectType: "notificationCenter",
                    event: ActivityEvent.VIEWED,
                    causerID: req.decoded.id,
                    causerType: "users",
                    properties: {
                        attributes:null,
                        old: null
                    },
                    source: null,
                    metadata:null
                }
                ,req)
            res.status(200).json({ error: false, message: '', data: result });
        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error occurred in fetching data";
            err.stackTrace = error;
            next(err);
        })
}

const getPortfolioWorth = async function(req,res,next) {
    let err = {};
    const userId = (req.decoded && req.decoded.id) ? req.decoded.id : 0;
    try {
        const result = await investorsdb.userPortfolio(userId);
        for(let i=0; i<result.length; i++) {
            const item = result[i];
            if( item.category==='development' ) {
                item.developmentRounds = await investorsdb.getDevelopmentRounds(item.propertyID);
                const developmentRoundsSortByEndDate = item.developmentRounds.sort(function (a, b) {
                    var dateA = new Date(a.displayEndDate).getTime();
                    var dateB = new Date(b.displayEndDate).getTime();
                    return dateA < dateB ? 1 : -1; // ? -1 : 1 for ascending/increasing order
                });
                item.lastRoundDisplayEndDate = developmentRoundsSortByEndDate.length > 0 ? developmentRoundsSortByEndDate[0].displayEndDate : null;
                item.lastRoundRate = developmentRoundsSortByEndDate.length > 0 ? developmentRoundsSortByEndDate[0].pricePerSqft : null;
            } else {
                item.developmentRounds = [];
            }
        }
        res.status(200).json({ error: false, message: '', data: result });
    } catch(e) {
        console.log(e);
        err.statusCode = 400;
        err.message = "Error occurred in fetching data";
        err.stackTrace = e;
        next(err);
    }
    
}

const portfolioBalance = async function(req, res, next) {
    let err = {};
    const userId = (req.decoded && req.decoded.id) ? req.decoded.id : 0;
    try {
        const result = await investorsdb.userPortfolioBalance(userId);
        res.status(200).json({ error: false, message: '', success: true, data: result });
    } catch(e) {
        console.log(e);
        err.statusCode = 400;
        err.message = "Error occurred in fetching data";
        err.stackTrace = e;
        next(err);
    }
}

const activateProperty = async function(req, res, next) {
    if(req.query.password!='amnaHome'){
        res.status(200).json({ error: false, message: 'Invalid password', success: true, data: '' });
        return;
    }
    if(!req.query.propertyID){
        req.query.propertyID=5;
    }
    try {
        const result = await investorsdb.activateProperty(req.query.propertyID);
        res.status(200).json({ error: false, message: '', success: true, data: result });
    } catch(e) {
        console.log(e);
        err.statusCode = 400;
        err.message = "Error occurred in fetching data";
        err.stackTrace = e;
        next(err);
    }

}
const launchDate = async function(req, res, next) {
    if(req.query.password!='amnaHome'){
        res.status(200).json({ error: false, message: 'Invalid password', success: true, data: '' });
        return;
    }
    if(!req.query.propertyID){
        req.query.propertyID=5;
    }
    try {
        const result = await investorsdb.launchDate(req.query.propertyID);
        res.status(200).json({ error: false, message: '', success: true, data: result });
    } catch(e) {
        console.log(e);
        err.statusCode = 400;
        err.message = "Error occurred in fetching data";
        err.stackTrace = e;
        next(err);
    }

}

const fetchCurrencies = async function(req, res, next) {
    let err = {};
    try {
        const result = await core.userDB.getUserCurrencies();
        res.status(200).json({ error: false, message: '', success: true, data: result });
    } catch(e) {
        console.log(e);
        err.statusCode = 400;
        err.message = "Error occurred in fetching data";
        err.stackTrace = e;
        next(err);
    }

}


module.exports = { investorcontrollers,getMarketplaceUsersDeviceToken,getNotification,updateReadBitNotification,marketAllReadNotification, 
    getPortfolioWorth, portfolioBalance,activateProperty ,launchDate,fetchCurrencies};
