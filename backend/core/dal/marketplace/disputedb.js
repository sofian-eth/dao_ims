const db = require('../../dbModels/index');
const responseObject = require('../../dto/response/response-model');
const { disputeAction, disputeStatus } = require('../../models/enums');
const { QueryTypes } = require("sequelize");
const { disputeRequest } = require('../../dto/requests/disputeRequest');
const { disputeResponse } = require('../../dto/response/disputeResponse');

const updateDisputeStatus = async function (id, status, userID, _data) {
    let resp = new responseObject();
    try {
        resp.setSuccess("dispute saved");
        let sql = ``;
        switch (status) {
            case disputeAction.open:
                resp = openDespute(id, userID, _data);
                break;
            case disputeAction.resolve:
                resp = resolveDespute(id, userID, _data);
                break;
            case disputeAction.deffer:
                resp = defferDespute(id, userID, _data);
                break;
        }
    } catch (ex) {
        resp.setError(ex.toString(), "DISPUTE_STATUS_NOT_UPDATED");
    }
    return resp;
};



/*
Open Despute
*/
async function openDespute(id, userID, _data) {
    let resp = new responseObject();
    resp.data = null;
    try {
        if (id && userID > 0) {

            result = await db.sequelize.query(`select * from orderItems INNER JOIN orders on orders.id = orderItems.orderID AND (orders.sellerID = ? OR orderItems.buyerID = ?) AND orderItems.status<>'disputed' AND orderItems.id =?`, {replacements:[userID,userID,id], type: QueryTypes.SELECT })
            if (result && result.length > 0) {
                try {
                    // add dispute entry as well
                    _data["orderItemID"] = id;
                    _data["status"] = disputeStatus.active;
                    _data["userId"] = userID;
                    let requestData = new disputeRequest(_data);
                    let _ret = await saveDispute(requestData);
                    if (_ret.success) {
                        await db.sequelize.query(`update orderItems set status='disputed' where id=?`,{replacements:[id]});
                        const disputeId = Array.isArray(_ret.data) && _ret.data.length > 0 ? _ret.data[0] : 0;
                        const disputeRes = await db.sequelize.query(`SELECT * FROM disputes WHERE disputes.id=?`, {replacements:[disputeId],type: QueryTypes.SELECT});
                        if (disputeRes && disputeRes.length > 0) {
                            resp.data = new disputeResponse(disputeRes[0]);
                        }
                        resp.setSuccess("Order status updated successfully");
                    } else {
                        resp.setError(resp.message, "Could not add dispute");
                    }
                } catch (ex) {
                    console.log("ex", ex);
                    resp.setError(ex.toString(), "Could not add dispute");
                }
            } else {
                resp.setError("Action not allowed or already in despute", "UNAUTHORIZED");
            }

        } else {
            resp.setError("somethign went wrong", "ORDERITEM_STATUS_NOT_UPDATED");
        }
    } catch (e) {
        resp.setError(e.toString(), "ORDERITEM_STATUS_NOT_UPDATED");
    }
    return resp;
}

/*
Resolve Despute
*/
async function resolveDespute(id, userID, _data) {
    let transaction;
    let resp = new responseObject();
    try {
        if (id && userID > 0) {

            result = await db.sequelize.query(`select * from orderItems INNER JOIN orders on orders.id = orderItems.orderID AND (orders.sellerID = ? OR orderItems.buyerID = ?) AND status='disputed' AND orderItems.id =?`, {replacements:[userID,userID,id], type: QueryTypes.SELECT })
            if (result && result.length > 0) {
                try {
                    // add dispute entry as well
                    _data["orderItemID"] = id;
                    _data["status"] = disputeStatus.resolved;
                    let requestData = new disputeRequest(_data);
                    await saveDispute(requestData);
                    resp.data = await db.sequelize.query(`update orderItems set status='active' where id=?`,{replacements:[id]});
                    resp.setSuccess("Order status updated successfully");
                } catch (ex) {
                    console.log("ex", ex);
                    resp.setError(ex.toString(), "Could not add dispute");
                }
            } else {
                resp.setError("Action not allowed or already in despute", "UNAUTHORIZED");
            }

        } else {
            resp.setError("somethign went wrong", "ORDERITEM_STATUS_NOT_UPDATED");
        }
    } catch (e) {
        if (transaction) { transaction.rollback(); }
        console.log("ex", e);
        resp.setError(e.toString(), "ORDERITEM_STATUS_NOT_UPDATED");
    }
    return resp;
}

/*
Resolve Despute
*/
async function defferDespute(id, userID, _data) {
    let transaction;
    let resp = new responseObject();
    try {
        if (id && userID > 0) {

            result = await db.sequelize.query(`select * from orderItems INNER JOIN orders on orders.id = orderItems.orderID AND (orders.sellerID = ? OR orderItems.buyerID = ?) AND status='disputed' AND orderItems.id =?`, {replacements:[userID,userID,id], type: QueryTypes.SELECT })
            if (result && result.length > 0) {
                try {
                    // add dispute entry as well
                    _data["orderItemID"] = id;
                    _data["status"] = disputeStatus.deffered;
                    let requestData = new disputeRequest(_data);
                    await saveDispute(requestData);
                    resp.data = await db.sequelize.query(`update orderItems set status='disputed' where id=?`,{replacements:[id]});
                    resp.setSuccess("Order status updated successfully");
                } catch (ex) {
                    console.log("ex", ex);
                    resp.setError(ex.toString(), "Could not add dispute");
                }
            } else {
                resp.setError("Action not allowed or already in despute", "UNAUTHORIZED");
            }

        } else {
            resp.setError("somethign went wrong", "ORDERITEM_STATUS_NOT_UPDATED");
        }
    } catch (e) {
        if (transaction) { transaction.rollback(); }
        console.log("ex", e);
        resp.setError(e.toString(), "ORDERITEM_STATUS_NOT_UPDATED");
    }
    return resp;
}
/**
 * 
 * @param {disputeRequest} _data 
 * @returns 
 */
const saveDispute = async function (_data) {
    let resp = new responseObject();
    try {
        resp.setSuccess("dispute saved");
        let sql = `INSERT INTO disputes (category, additionDetails, orderItemID, status, createdAt, updatedAt,userId)
         VALUES (?,?,?,?,?,?,?)`;
         let date = new Date();
        resp.data = await db.sequelize.query(sql, { 
        replacements: [_data.category, _data.additionalDetails, _data.orderItemID,_data.status, date, date,_data.userId]
        ,type: QueryTypes.INSERT });
        console.log("sqldata",resp.data)
    } catch (ex) {
        resp.setError(ex.toString(), "DISPUTE_NOT_SAVED");
    }
    return resp;
};


module.exports = {
    saveDispute,
    updateDisputeStatus
};