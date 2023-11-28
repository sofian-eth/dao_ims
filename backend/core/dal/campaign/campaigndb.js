const db = require("../../dbModels");
const responseObject = require('../../dto/response/response-model');
const refferalDTO = require('../../dto/response/refferalDataResponse');
const { QueryTypes } = require("sequelize");

async function getReferralData(id) {
    let resp = new responseObject();
    try {
            resp.setSuccess("refferal data fetched");
            let result = await db.sequelize.query('CALL sp_get_referral_data(0)');
            if (result) {
                let data = [];
                result.forEach((element, index) => {
                    let _row = new refferalDTO.refferalData(element);
                    _row.rank = (index + 1);
                    data.push(_row);
                });
                if(id==0){
                    resp.data = result;
                }else{
                    resp.data = new refferalDTO.refferalDataResponse(data, id);
                }
        }
    } catch (ex) {
        resp = new responseObject();
        resp.setError(ex.toString(), "ELIGITY_NOT_FETCHED");
    }

    return resp;
}
async function getRefferdByName(id) {

    let resp = new responseObject();
    try {
        if (id > 0) {
            resp.setSuccess("refferal data fetched");
            let result = await db.sequelize.query('select legalName from users where id=?',{replacements:[id],type: QueryTypes.SELECT});
            if (result) {
                resp.data = result[0]
            } else {
                resp.setError("could not fetch marketplace eligibility data", "ELIGITY_NOT_FETCHED");
            }
        } else {
            resp = new responseObject();
            resp.setError("Not allowed to perform this action", "unauthorized");
        }
    } catch (ex) {
        resp = new responseObject();
        resp.setError(ex.toString(), "ELIGITY_NOT_FETCHED");
    }

    return resp;
}
async function getActiveCampaignDetail(id) {

    let resp = new responseObject();
    try {
        if (id > 0) {
            resp.setSuccess("refferal data fetched");
            let activeCampaign = await db.sequelize.query('select id, title, status, startDate, endDate, createdAt, updatedAt from campaign where status = 1', { type: QueryTypes.SELECT });
            let userReferralLink = await db.sequelize.query(`select refferalCode from users where id=?`, {replacements:[id], type: QueryTypes.SELECT });
            let referralLink = "https://id.dev.daoproptech.com/public/register?refCode=";
            if (userReferralLink && userReferralLink.length>0) {
                referralLink += userReferralLink[0].refferalCode;
            } else {
                referralLink = '';
            }
            let data = {
                activeCampaign: activeCampaign[0],
                referralLink: referralLink
            }
            resp.data = data;
        } else {
            resp = new responseObject();
            resp.setError("Not allowed to perform this action", "unauthorized");
        }
    } catch (ex) {
        resp = new responseObject();
        resp.setError(ex.toString(), "ELIGITY_NOT_FETCHED");
    }

    return resp;
}
async function getActiveCampaignDetailRegister() {

    let resp = new responseObject();
    try {
            resp.setSuccess("refferal data fetched");
            let activeCampaign = await db.sequelize.query('select id, title, status, startDate, endDate, createdAt, updatedAt from campaign where status = 1', { type: QueryTypes.SELECT });
            let data = activeCampaign[0] ? activeCampaign[0] : {};
            resp.data = data;
    } catch (ex) {
        resp = new responseObject();
        resp.setError(ex.toString(), "ELIGITY_NOT_FETCHED");
    }

    return resp;
}
async function getCampaignDetail(id) {

    let resp = new responseObject();
    try {
        if (id > 0) {
            resp.setSuccess("refferal data fetched");
            let activeCampaign = await db.sequelize.query('select id, title, status, startDate, endDate, createdAt, updatedAt from campaign where id = 1', { type: QueryTypes.SELECT });
            let userReferralLink = await db.sequelize.query(`select refferalCode from users where id=?`, {replacements:[id], type: QueryTypes.SELECT });
            let data = {
                activeCampaign: activeCampaign[0],
                referralLink: userReferralLink[0].refferalCode
            }
            resp.data = data;
        } else {
            resp = new responseObject();
            resp.setError("Not allowed to perform this action", "unauthorized");
        }
    } catch (ex) {
        resp = new responseObject();
        resp.setError(ex.toString(), "ELIGITY_NOT_FETCHED");
    }

    return resp;
}
async function updateReferralBit(id) {
    let resp = new responseObject();
    try {
        if (id > 0) {
            resp.setSuccess("refferal bit updated");
            await db.sequelize.query(`update users set showReferralIntro=0 where id=?`, {replacements:[id], type: QueryTypes.UPDATE });
            resp.data = [];
        } else {
            resp = new responseObject();
            resp.setError("Not allowed to perform this action", "unauthorized");
        }
    } catch (ex) {
        resp = new responseObject();
        resp.setError(ex.toString(), "ELIGITY_NOT_FETCHED");
    }

    return resp;
}


async function getUserReferralData(id) {
    let resp = new responseObject();
    try {
        if (id > 0) {
            resp.setSuccess("refferal data fetched");
            let query='CALL sp_get_referral_data('+id+')'
            let result = await db.sequelize.query(query);
            currentUserIndex = -1;
            if (result) {
                let data = [];
                result.forEach((element, index) => {
                    let _row = new refferalDTO.refferalData(element);
                    _row.rank = (index + 1);
                    if (_row.userID == id) {
                        currentUserIndex = index;
                    }
                    data.push(_row);
                });
                resp.data = new refferalDTO.userRefferalDataResponse(data, currentUserIndex);
            } else {
                resp.setError("could not fetch marketplace eligibility data", "ELIGITY_NOT_FETCHED");
            }
        } else {
            resp = new responseObject();
            resp.setError("Not allowed to perform this action", "unauthorized");
        }
    } catch (ex) {
        resp = new responseObject();
        resp.setError(ex.toString(), "ELIGITY_NOT_FETCHED");
    }

    return resp;
}


module.exports = {
    getReferralData,
    getActiveCampaignDetail,
    getCampaignDetail,
    getUserReferralData,
    updateReferralBit,
    getRefferdByName,
    getActiveCampaignDetailRegister
}
