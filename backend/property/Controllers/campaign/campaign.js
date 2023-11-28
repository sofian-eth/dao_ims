const core = require('core');

async function getReferralData(req, res, next) {
    let resp = new core.responseObject();
    id = req.decoded ? req.decoded.id : 0;
    return await core.campaignDB.getReferralData(id)
        .then(function (result) {
            if (result.success) {
                resp.setSuccess('refferal data fetched');
                resp.data = result.data;
                res.status(200).json(resp);
            } else {
                resp.setError(result.message.toString(), "REFFERAL_DATA_NOT_FETCHED")
                res.status(200).json(resp);
            }
        })
        .catch(function (error) {
            resp.setError(error.toString(), "REFFERAL_DATA_NOT_FETCHED")
            res.status(200).json(resp);
        })
}
async function getRefferdByName(req, res, next) {
    let resp = new core.responseObject();
    id = req.query.userID;

    return await core.campaignDB.getRefferdByName(id)
        .then(function (result) {
            if (result.success) {
                resp.setSuccess('refferal data fetched');
                resp.data = result.data;
                res.status(200).json(resp);
            } else {
                resp.setError(result.message.toString(), "REFFERAL_DATA_NOT_FETCHED")
                res.status(200).json(resp);
            }
        })
        .catch(function (error) {
            resp.setError(error.toString(), "REFFERAL_DATA_NOT_FETCHED")
            res.status(200).json(resp);
        })
}

async function getUserReferralData(req, res, next) {
    let resp = new core.responseObject();
    id = req.decoded ? req.decoded.id : null;
    return await core.campaignDB.getUserReferralData(id)
        .then(function (result) {
            if (result.success) {
                resp.setSuccess('refferal data fetched');
                resp.data = result.data;
                res.status(200).json(resp);
            } else {
                resp.setError(result.message.toString(), "REFFERAL_DATA_NOT_FETCHED")
                res.status(200).json(resp);
            }
        })
        .catch(function (error) {
            resp.setError(error.toString(), "REFFERAL_DATA_NOT_FETCHED")
            res.status(200).json(resp);
        })
}

async function getActiveCampaignDetail(req, res, next) {
    let err = {};
    let resp = new core.responseObject();
    let userID = req.decoded.id;
    return await core.campaignDB.getActiveCampaignDetail(userID)
        .then(function (result) {
            if (result.success) {
                resp.setSuccess('Active Campaign data fetched');
                resp.data = result.data;
                res.status(200).json(resp);
            } else {
                resp.setError(result.message.toString(), "CAMPAIGN_DATA_NOT_FETCHED")
                res.status(200).json(resp);
            }
        })
        .catch(function (error) {
            resp.setError(error.toString(), "CAMPAIGN_DATA_NOT_FETCHED")
            res.status(200).json(resp);
        });
}
async function getActiveCampaignDetailRegister(req, res, next) {
    let err = {};
    let resp = new core.responseObject();
    return await core.campaignDB.getActiveCampaignDetailRegister()
        .then(function (result) {
            if (result.success) {
                resp.setSuccess('Active Campaign data fetched');
                resp.data = result.data;
                res.status(200).json(resp);
            } else {
                resp.setError(result.message.toString(), "CAMPAIGN_DATA_NOT_FETCHED")
                res.status(200).json(resp);
            }
        })
        .catch(function (error) {
            resp.setError(error.toString(), "CAMPAIGN_DATA_NOT_FETCHED")
            res.status(200).json(resp);
        });
}
async function getCampaignDetail(req, res, next) {
    let err = {};
    let resp = new core.responseObject();
    let userID = req.decoded.id;
    return await core.campaignDB.getCampaignDetail(userID)
        .then(function (result) {
            if (result.success) {
                resp.setSuccess('Active Campaign data fetched');
                resp.data = result.data;
                res.status(200).json(resp);
            } else {
                resp.setError(result.message.toString(), "CAMPAIGN_DATA_NOT_FETCHED")
                res.status(200).json(resp);
            }
        })
        .catch(function (error) {
            resp.setError(error.toString(), "CAMPAIGN_DATA_NOT_FETCHED")
            res.status(200).json(resp);
        });
}
async function updateReferralBit(req, res, next) {
    let resp = new core.responseObject();
    let userID = req.decoded.id;
    return await core.campaignDB.updateReferralBit(userID)
        .then(function (result) {
            if (result.success) {
                resp.setSuccess('Active Campaign data fetched');
                resp.data = result.data;
                res.status(200).json(resp);
            } else {
                resp.setError(result.message.toString(), "CAMPAIGN_DATA_NOT_FETCHED")
                res.status(200).json(resp);
            }
        })
        .catch(function (error) {
            resp.setError(error.toString(), "CAMPAIGN_DATA_NOT_FETCHED")
            res.status(200).json(resp);
        });
}

module.exports = { getReferralData, getUserReferralData, getActiveCampaignDetail,getCampaignDetail,updateReferralBit,getRefferdByName,getActiveCampaignDetailRegister };