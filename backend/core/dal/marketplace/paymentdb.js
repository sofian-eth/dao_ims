const db = require('../../dbModels/index');
const responseObject = require('../../dto/response/response-model');
const fileHandler = require('../../helper/fileuploader');
const { orderPaymentTypeEnum, orderPaymentStatusEnum, orderStatus, orderItemStatus } = require("../../models/enums");
const { QueryTypes } = require("sequelize");
const { saveOrderPaymentRequest } = require('../../dto/requests/saveOrderPaymentRequest');
const { getBuyerOrderItemDetails, getSellerOrderItemDetails } = require('../../dal/marketplace/ordersdb');
// const { logActivity } = require('../../../property/Models/Shared/account-activity');

/**
 * @param {saveOrderPaymentRequest} _data
 * @returns { Promise<responseObject>} 
 */
const saveOrderPayment = async function (_data, userID) {
    let resp = new responseObject();
    try {
        let result;
        let _orderData;
        if (_data && _data.type && userID > 0) {
            switch (_data.type) {
                case orderPaymentTypeEnum.token:
                    try {
                        _orderData = await db.sequelize.query(`SELECT * FROM orderItems WHERE id = ? AND buyerID = ? `, {replacements:[_data.parentID,userID], type: QueryTypes.SELECT });
                        if (_orderData && _orderData.length > 0) {
                            _orderData = _orderData[0];
                            await db.sequelize.query(`UPDATE orderPayments SET status='paid', paidDate=:paidDate, paymentMethod=:paymentMethod WHERE parentID = :parentID  AND type='token'`, { replacements:{paidDate:_data.paidDate,paymentMethod: _data.paymentMethod,parentID:_data.parentID}, type: QueryTypes.UPDATE });
                            let _payment = await db.sequelize.query(`SELECT id FROM orderPayments WHERE status='paid' AND paidDate=:paidDate AND paymentMethod=:paymentMethod AND parentID = :parentID AND type='token'`, {replacements:{paidDate:_data.paidDate,paymentMethod: _data.paymentMethod,parentID:_data.parentID}, type: QueryTypes.SELECT });
                            if (_payment && _payment.length > 0) {
                                await savePaymentAttachments(_data.media, _payment[0].id);
                            }
                            resp = await getBuyerOrderItemDetails(_orderData.id, _orderData.buyerID);
                            resp.setSuccess("token payment paid successfully");
                        } else {
                            resp = new responseObject();
                            resp.setError("You are not allowed to perform this action", "TOKEN_PAYMENT_NOT_UPDATED");
                        }
                    } catch (ex) {
                        resp = new responseObject();
                        resp.setError(ex.toString(), "TOKEN_PAYMENT_NOT_UPDATED");
                    }
                    break;
                case orderPaymentTypeEnum.servicecharges:
                    try {
                        let _orderData = await db.sequelize.query(`SELECT * FROM orders WHERE id = (SELECT oi.orderID FROM orderItems oi where oi.id = ?)`, {replacements:[_data.parentID], type: QueryTypes.SELECT });
                        
                        if (_orderData && _orderData.length > 0 && _orderData[0].id) {
                            let _serviceChargesObject = await db.sequelize.query('CALL sp_get_service_charges_for_seller (:_item_id)', { replacements: { _item_id: _data.parentID } });
                            if ( _serviceChargesObject.length > 0 ) {
                                const serviceCharges = _serviceChargesObject[0];
                                if( serviceCharges.serviceChargesMethod === 'bank' ) {
                                    await db.sequelize.query(`INSERT into orderPayments SET amount=:amount, status='paid', paidDate=:pd, paymentMethod=:pm, parentID = :pid, type='servicecharges'`,{replacements:{'amount':serviceCharges.amount,'pd':_data.paidDate,'pm':_data.paymentMethod,'pid':_data.parentID}});
                                    let _payment = await db.sequelize.query(`SELECT id FROM orderPayments WHERE status='paid' AND paidDate=:pd AND paymentMethod=:pm AND parentID =:pid AND type='servicecharges'`, {replacements:{'pd':_data.paidDate,'pm':_data.paymentMethod,'pid':_data.parentID}, type: QueryTypes.SELECT });
                                    if (_payment && _payment.length > 0) {
                                        await savePaymentAttachments(_data.media, _payment[0].id);
                                    }
                                  resp.data = _orderData[0];
                                  console.log("Resp",resp);
                                  resp.setSuccess("service charges paid successfully");
                                } else {
                                    console.log("payment method is not banck");
                                }
                            } else {
                                console.log("service charges not fetched.");
                            }
                        } else {
                            resp = new responseObject();
                            resp.setError("You are not allowed to perform this action", "TOKEN_PAYMENT_NOT_UPDATED");
                        }
                    } catch (ex) {
                        resp = new responseObject();
                        resp.setError(ex.toString(), "SEVICE_CHARGES_NOT_UPDATED");
                    }
                    break;
                case orderPaymentTypeEnum.other:
                    try {
                        let _orderInfo = await db.sequelize.query(`SELECT * FROM orders WHERE id = (SELECT orderID FROM orderItems oi where oi.id = :pid AND buyerID = :id)`, {replacements:{'pid':_data.parentID,'id':userID}, type: QueryTypes.SELECT });
                        if (_orderInfo && _orderInfo.length > 0) {

                            let _isTokenPaid = await db.sequelize.query(`SELECT * FROM orderPayments WHERE type = 'token' AND parentID = :pid `  , {replacements:{'pid':_data.parentID}, type: QueryTypes.SELECT });

                            if (_isTokenPaid && _isTokenPaid.length > 0 && _isTokenPaid[0].status != orderPaymentStatusEnum.pending) {

                                resp = await preparePaymentObject(_data, userID);

                            } else {

                                if (_isTokenPaid && _isTokenPaid.length > 0 && _data.amount >= _isTokenPaid[0].amount) {
                                    // pay token
                                    let tokenData = new saveOrderPaymentRequest(_data);
                                    tokenData.id = _isTokenPaid[0].id;
                                    tokenData.amount = _isTokenPaid[0].amount;
                                    tokenData.type = orderPaymentTypeEnum.token;
                                    tokenData.status = orderPaymentStatusEnum.paid;
                                    tokenData.paymentMethod = _data.paymentMethod;
                                    resp = await preparePaymentObject(tokenData, userID);

                                    // pay remainging amount
                                    _data.amount = Math.round((_data.amount - _isTokenPaid[0].amount) >= 0 ? (_data.amount - _isTokenPaid[0].amount) : 0);
                                    _data.type = orderPaymentTypeEnum.other;
                                    if (_data.amount > 0) {
                                        resp = await preparePaymentObject(_data, userID);
                                    }

                                } else {
                                    resp = new responseObject();
                                    resp.setError("Please pay security amount before you pay other amount", "PAYMENT_NOT_SAVED");
                                }

                            }

                        } else {
                            resp = new responseObject();
                            resp.setError("action not allowed", "NOT_AUTHORIZED");
                        }

                    } catch (ex) {
                        resp = new responseObject();
                        resp.setError(ex.toString(), "PAYMENT_NOT_SAVED");
                    }
                    break;
            }

        } else {
            resp = new responseObject();
            resp.setError("payment type is not defined", "PAYMENT_NOT_UPDATED");
        }
    } catch (ex) {
        console.log("ex", ex);
        resp = new responseObject();
        resp.setError(ex.toString(), "ELIGITY_NOT_FETCHED");
    }
    return resp;
}

/**
 
 */
const updateOrderPaymentStatus = async function (_data, userID) {
    let resp = new responseObject();
    try {
        let result;
        let _orderData;
        if (_data && _data.status && userID > 0) {
            _paymentRow = await db.sequelize.query(`SELECT op.* FROM orderPayments op INNER JOIN orderItems on orderItems.id =  op.parentID AND orderItems.id=` + _data.parentID + ` INNER JOIN orders on orders.id = orderItems.orderID AND orders.sellerID = ` + userID + ` WHERE op.id = ` + _data.id, { type: QueryTypes.SELECT });
            console.log('_paymentRow_paymentRow ', _paymentRow);
            if (_paymentRow && _paymentRow.length > 0) {
                _paymentRow = _paymentRow[0];
                // skipped pending part as it is not required
                switch (_data.status) {
                    case orderPaymentStatusEnum.pending:
                        try {
                            if (_paymentRow.status == orderPaymentStatusEnum.paid) {
                                await db.sequelize.query(`UPDATE orderPayments SET status='` + orderPaymentStatusEnum.paid + `' WHERE id = ` + _data.id);
                                //_data.amount = _dataItem && _dataItem.amount ? _dataItem.amount : 0;
                                resp = await getSellerOrderItemDetails(_data.parentID, userID);
                                resp.setSuccess("payment updated successfully");
                            } else {
                                resp.setError("this action is not allowed", "PAYMENT_NOT_UPDATED");
                            }
                        } catch (ex) {
                            resp.setError(ex.toString(), "TOKEN_PAYMENT_NOT_UPDATED");
                        }
                        break;
                    case orderPaymentStatusEnum.paid:
                        try {
                            if (_paymentRow.status == orderPaymentStatusEnum.pending) {
                                await db.sequelize.query(`UPDATE orderPayments SET status='` + orderPaymentStatusEnum.paid + `' WHERE id = ` + _data.id);
                                //_data.amount = _dataItem && _dataItem.amount ? _dataItem.amount : 0;
                                resp = await getSellerOrderItemDetails(_data.parentID, userID);
                                resp.setSuccess("payment updated successfully");
                            } else {
                                resp.setError("this action is not allowed", "PAYMENT_NOT_UPDATED");
                            }
                        } catch (ex) {
                            resp.setError(ex.toString(), "TOKEN_PAYMENT_NOT_UPDATED");
                        }
                        break;
                    case orderPaymentStatusEnum.approved:
                        try {
                            if (_paymentRow.status == orderPaymentStatusEnum.paid) {
                                await db.sequelize.query(`UPDATE orderPayments SET status='` + orderPaymentStatusEnum.approved + `' WHERE id = ` + _data.id);
                                //_data.amount = _dataItem && _dataItem.amount ? _dataItem.amount : 0;
                                resp = await getSellerOrderItemDetails(_data.parentID, userID);
                                resp.setSuccess("payment updated successfully");
                            } else {
                                resp.setError("action not allowed, only paid transactions can be approved", "PAYMENT_NOT_UPDATED");
                            }
                        } catch (ex) {
                            resp.setError(ex.toString(), "TOKEN_PAYMENT_NOT_UPDATED");
                        }
                        break;
                    case orderPaymentStatusEnum.disputed:
                        try {
                            if (_paymentRow.status == orderPaymentStatusEnum.paid) {
                                await db.sequelize.query(`UPDATE orderPayments SET status='` + orderPaymentStatusEnum.approved + `' WHERE id = ` + _data.id);
                                // mark this deal as disputed as well
                                await db.sequelize.query(`UPDATE orderItems SET status='` + orderStatus.approved + `' WHERE id = ` + _data.id);
                                //_data.amount = _dataItem && _dataItem.amount ? _dataItem.amount : 0;
                                resp = await getSellerOrderItemDetails(_data.parentID, userID);
                                resp.setSuccess("payment updated successfully");
                            } else {
                                resp.setError("this action is not allowed", "PAYMENT_NOT_UPDATED");
                            }
                        } catch (ex) {
                            resp.setError(ex.toString(), "TOKEN_PAYMENT_NOT_UPDATED");
                        }
                        break;
                    case orderPaymentStatusEnum.pending:
                        try {
                            await db.sequelize.query(`UPDATE orderPayments SET status='` + orderPaymentStatusEnum.pending + ` WHERE id = ` + _data.id);
                            //_data.amount = _dataItem && _dataItem.amount ? _dataItem.amount : 0;
                            resp = await getSellerOrderItemDetails(_data.parentID, userID);
                            resp.setSuccess("payment updated successfully");
                        } catch (ex) {
                            resp.setError(ex.toString(), "TOKEN_PAYMENT_NOT_UPDATED");
                        }
                        break;
                }
            } else {
                resp.setError("action not allowed, you cannot make changes to this record", "PAYMENT_NOT_UPDATED");
            }

        } else {
            resp.setError("payment type is not defined", "PAYMENT_NOT_UPDATED");
        }
    } catch (ex) {
        console.log("ex", ex);
        resp.setError(ex.toString(), "ELIGITY_NOT_FETCHED");
    }
    return resp;
}



// private functions
async function preparePaymentObject(_dataObj, userID) {
    let _orderData = await db.sequelize.query(`SELECT * FROM orderItems WHERE id = ` + _dataObj.parentID + ` AND buyerID = ` + userID, { type: QueryTypes.SELECT });

    if (_orderData && _orderData.length > 0 && _orderData[0].id) {

        result = await savePaymentObject(_dataObj);
        if (result) {
            await savePaymentAttachments(_dataObj.media, result);
            resp = await getBuyerOrderItemDetails(_orderData[0].id, _orderData[0].buyerID);
            // try{
            //     logActivity(
            //         {
            //             logName: "Market Place",
            //             description: "Payed remaining amount of "+_payment.amount+" PKR against deal of "+_orderData[0].areaPurchased+" sq. ft. to "+(resp.data.seller.firstName != null ? (resp.data.seller.firstName+" "+resp.data.seller.lastName) : (resp.data.seller.nickName))+" in "+resp.data.property.name,
            //             subjectID: parseInt(_payment.id),
            //             subjectType: "orderPayments",
            //             event: "paymentApproved",
            //             causerID: resp.data.buyer.id,
            //             causerType: "users",
            //             properties: {
            //                 attributes: null,
            //                 old: null
            //             },
            //             source: null,
            //             metadata:null
            //         }
            //         ,req)
            // }catch(error){
            //     console.log(error)
            // }
            resp.setSuccess("payment made successfully");
        } else {
            resp = new responseObject();
            resp.setError("could not save payment", "PAYMENT_NOT_SAVED");
        }

    } else {
        resp = new responseObject();
        resp.setError("You are not allowed to perform this action", "PAYMENT_NOT_SAVED");
    }

    return resp;
}

async function savePaymentObject(_data) {
    let sql = ``;
    let res;
    if (_data.id > 0) {
        sql = `UPDATE orderPayments SET type = '${_data.type}', status = '${_data.status}', paidDate = '${_data.paidDate}', updatedAt = now()${_data &&_data.paymentMethod ? ",paymentMethod='"+_data.paymentMethod+"'" : ""} WHERE id = ${_data.id}`;
        await db.sequelize.query(sql);
    } else {
        sql = `insert into orderPayments(amount, type, status, parentID, paidDate, paymentMethod, createdAt, updatedAt)
        values('${_data.amount}','${_data.type}', 'paid', '${_data.parentID}','${_data.paidDate}', '${_data.paymentMethod}', now(), now());`;
        res = await db.sequelize.query(sql);
    }

    return res ? res[0] : _data.id;
}

async function savePaymentAttachments(media, paymentID) {
    media.forEach(async attachment => {
        let abc = await db.sequelize.query(`INSERT INTO paymentAttachments (paymentID,mediaID,createdAt,updatedAt) VALUES(` + paymentID + `, ` + attachment + `, NOW(), NOW())`);
    });
}

module.exports = {
    saveOrderPayment,
    updateOrderPaymentStatus
};