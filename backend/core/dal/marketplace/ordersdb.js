const db = require('../../dbModels/index');
const moment = require('moment');
const orderModel = require('../../dto/requests/createOrderRequest');
const responseObject = require('../../dto/response/response-model');
const EligibiltyResponse = require('../../dto/response/marketplaceEligibiltyResponse');
const orderResponse = require('../../dto/response/orderResponse');
const orderItemResponse = require('../../dto/response/orderItemResponse');
const { orderItemRequest } = require('../../dto/requests/orderItemRequest');
const { orderItemDetailResponse } = require('../../dto/response/orderItemDetailResponse');
const fileHandler = require('../../helper/fileuploader');
const { orderItemPaymentResponse } = require('../../dto/response/orderItemPaymentResponse');
const { orderPaymentTypeEnum, orderPaymentStatusEnum, orderStatus, orderItemStatus, disputeStatus, showBankInformationAction, BankInformationActionEnums, PropertyCategory } = require("../../models/enums");
const { OrderSummaryResponse, OrdersSummaryResponse } = require('../../dto/response/orderSummaryResponse');
const { disputeResponse } = require('../../dto/response/disputeResponse');
const { userReviewResponse } = require("./../../dto/response/userReviewResponse");
const { timeExtensionRequestsResponse } = require('../../dto/response/timeExtensionRequestsResponse');
const { QueryTypes } = require("sequelize");
const { saveOrderPaymentRequest } = require('../../dto/requests/saveOrderPaymentRequest');
const { disputeRequest } = require('../../dto/requests/disputeRequest');
const { saveDispute } = require('../../dal/marketplace/disputedb');
const { getPropertyBanks } = require('../../dal/propertydb');
const { UserOrdersStats } = require('../../dto/response/userResponse');
const { unlockAreaRequest } = require('../../dto/requests/unlockRequest');
const { unlockAreaResponse, userUnlockAreaResponse } = require('../../dto/response/unlockResponse');
const {DataTypes} = require("sequelize");

function setLimit(pageNo=1,pageSize=10){
    return ` limit ${pageSize} offset ${(pageNo-1)*pageSize}`;
}

/* orderResponse
    Save Survey data if user provides - asking from user when user is going to sell property - optional
*/
const saveWhySellSurvey = async function (_data) {
    let resp = new responseObject();
    try {
        resp.setSuccess("order saved");
        resp.data = await db.sequelize.models.whySellSurvey.create(_data);
    } catch (ex) {
        resp.setError(ex.toString(), "ORDER_NOT_SAVED");
    }
    return resp;
}

const marketplaceEligibility = async function (id) {
    let resp = new responseObject();
    try {
        resp.setSuccess("requirements checked");
        // let result = await db.sequelize.models.users.findByPk(id, { include: [{model:db.sequelize.models.userBankInformations,where:{deleted:0}}, {model:db.sequelize.models.userAddressBooks}] });

        let result ={};
        let user = await db.sequelize.query(`select id,is_phonenumber_verified,is_email_verified,identityCardNumber,createdAt,updatedAt from users where id = ?`,{replacements:[id],type:DataTypes.SELECT});
        let userBankInformations = await db.sequelize.query(`select ifnull(count(userBankInformation.id),0) as banksCount  from userBankInformation where deleted<>1 and userID = ?`,{replacements:[id],type:DataTypes.SELECT});
        let userAddressBooks = await db.sequelize.query(`select ifnull(count(userAddressBook.id),0) as addressCount from userAddressBook where isDeleted<>1 and userID = ?`,{replacements:[id],type:DataTypes.SELECT});
        result = user[0][0];
        result["banksCount"] = userBankInformations[0][0].banksCount;
        result["addressCount"] = userAddressBooks[0][0].addressCount;
        if (result) {
            resp.data = new EligibiltyResponse.marketplaceEligibiltyResponse(result);
        } else {
            resp.setError("could not fetch marketplace eligibility data", "ELIGITY_NOT_FETCHED");
        }
    } catch (ex) {
        resp = new responseObject();
        resp.setError(ex.toString(), "ELIGITY_NOT_FETCHED");
    }
    return resp;
}

const getOrders = async function (id, isAdmin = false, propertyCat=null,type="property") {

    let resp = new responseObject();
    let _data = [];
    //let _details = [];
    let _orders = null;
    try {
        id = id && id > 0 ? id : 0;
        if( type='property' ) {
            const _is_admin = isAdmin?1:0;
            const _property_cat = propertyCat?propertyCat:'all';
            _orders = await db.sequelize.query('CALL sp_marketplace_orders(:_id, :_is_admin, :_property_cat)', { replacements: { _id: id, _is_admin, _property_cat } }, { type: QueryTypes.SELECT });
        } else {
            let sql = getOrderQuery(id, type, "(select  count(*) from orders as od where od.sellerID = users.id) as 'userOrders',", null, isAdmin, propertyCat)
            _orders = await db.sequelize.query(sql, { type: QueryTypes.SELECT });
        }
            const data = getOrderObjectGroupedByPaymentMethod(_orders);
            if (data) {
                await Promise.all(data.map(async (_order) => {
                    return await new Promise(async (resolve, reject) => {
                        try {
                            if (_order.areaLeft > 0 || isAdmin || (type='property' && _order.status=='completed')) {
                                let item = new orderResponse.orderResponse(_order);
                                if( item.serviceChargesMethod === 'area' ) {

                                    item.serviceCharges = (item.areaToSell/100)*item.serviceChargesAreaPercent;
                                } else if( item.serviceChargesMethod === 'bank' ) {
                                    item.serviceCharges = ((item.areaToSell*item.pricePerSqFt)/100)*item.serviceChargesAreaPercent;
                                }
                                // let paymentMethods = await db.sequelize.query(`select opm.id as 'orderPaymentMethodsID', ub.id as 'bankAccountID', ub.bankName as 'bankName' from orderPaymentMethods opm INNER JOIN userBankInformation ub on ub.id = opm.BankaccountID WHERE orderID = ${item.id}`, { type: QueryTypes.SELECT })
                                let paymentMethods = await db.sequelize.query(`select distinct opm.id as 'orderPaymentMethodsID', ub.id as 'bankAccountID',ifnull(nullif(ub.bankName,''),banks.name) as 'bankName', banks.svg as bankLogo from orderPaymentMethods opm INNER JOIN userBankInformation ub on ub.id = opm.BankaccountID LEFT JOIN banks ON banks.id=ub.bankId WHERE orderID = ?`, {replacements:[item.id], type: QueryTypes.SELECT });
                                item.paymentMethods = [];
                                if (paymentMethods && paymentMethods.length > 0) {
                                    for (let i = 0; i < paymentMethods.length; i++) {
                                        item.paymentMethods.push(new orderResponse.OrderPaymentMethod(paymentMethods[i]));
                                    }
                                }
                                //item.seller.profilePicture = await fileHandler.getMediaAsync(item.relativePath);
                                _data.push(item);
                                let _orderCompletion = await db.sequelize.query('CALL sp_get_order_completion_seller (:_user_id)', { replacements: { _user_id: _order.sellerID } }, { type: QueryTypes.SELECT })
                                item.orderCompletion = _orderCompletion && _orderCompletion.length > 0 ? Math.round(_orderCompletion[0].progress) : 0;
                            }
                            resolve(true);
                        } catch (e) {
                            console.log("e", e);
                            resolve(true);
                        }
                    })
                }));
                resp.setSuccess("order fetched");
            } else {
                resp.setError(_orders.toString(), "ORDERS_NOT_FETCHED");
            }
    } catch (ex) {
        resp.setError(ex.toString(), "ORDERS_NOT_FETCHED");
    }
    resp.data = _data;
    return resp;
}

const getDeals = async function (id) {

    let resp = new responseObject();
    let _data = [];
    let _deals = null;
    try {
        id = id && id > 0 ? id : 0;
        
        _deals = await db.sequelize.query('CALL sp_get_deals_by_property(:_id)', { replacements: { _id: id} }, { type: QueryTypes.SELECT });
        
        await Promise.all(_deals.map(async (_deal) => {
            return await new Promise(async (resolve, reject) => {
                try {
                        let item = new orderResponse.dealResponse(_deal);
                                
                         _data.push(item);
                            
                        resolve(true);
                    } catch (e) {
                            console.log("e", e);
                            resolve(true);
                        }
                    })
                }));
                resp.setSuccess("deals fetched");
            
        } catch (ex) {
        resp.setError(ex.toString(), "DEALS_NOT_FETCHED");
    }
    resp.data = _data;
    return resp;
}

const getMyOrders = async function (id, status, type = 'sell', propertyCat=null) {

    let resp = new responseObject();
    let _data = [];
    let _orders = null;
    try {
        id = id && id > 0 ? id : 0;
        let sql = "";

        if (type == 'buy') {
            _orders = await db.sequelize.query(`CALL sp_get_order_items (:_user_id, :_status${propertyCat ? ', :_propertyCat' : ''})`, { replacements: { _user_id: id, _status: status, _propertyCat: propertyCat } });
        } else {
            _orders = await db.sequelize.query(`CALL sp_my_selling_orders(:_seller_id, :_status, :_property_cat)`, { replacements: { _seller_id: id, _status: status, _property_cat: propertyCat } }, { type: QueryTypes.SELECT });
            // sql = getOrderQuery(id, 'seller', '', status, false, propertyCat);
            // _orders = await db.sequelize.query(sql);
        }

        if (_orders && _orders.length > 0) {
            if (type == 'buy') {
                resp.setSuccess("order fetched");

                await Promise.all(_orders.map(async (_order) => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            let _reviews = await db.sequelize.query(`SELECT userReviews.*, reviewee.id as revieweeID, reviewee.nickName as revieweeName, reviewer.id as reviewerID, reviewer.nickName as reviewerName FROM userReviews INNER JOIN users reviewee ON reviewee.id=userReviews.reviewedTo INNER JOIN users reviewer ON reviewer.id=userReviews.reviewedBy WHERE userReviews.source='MARKETPLACE_DEAL' AND userReviews.orderItemsID=:id AND userReviews.publishedAt IS NOT NULL AND userReviews.approvedAt IS NOT NULL`, {replacements:{'id':_order.id}, type: QueryTypes.SELECT });
                            _order.reviews = _reviews.map(review => {
                                return new userReviewResponse(review);
                            })
                            let item = new orderItemResponse.orderItemBuyResponse(_order);
                            //item.buyer.profilePicture = await fileHandler.getMediaAsync(item.relativePath);
                            _data.push(item);
                            resolve(true);
                        } catch (e) {
                            reject(e);
                        }
                    })
                }));

            } else if (type == 'sell') {

                resp.setSuccess("order fetched");
                const data = getOrderObjectGroupedByPaymentMethod(_orders);
                if (data) {
                    const orders_unread_messages = await db.sequelize.query(`CALL sp_user_orders_unread_messages(:_user_id)`, { replacements: { _user_id: id } });
                    await Promise.all(data.map(async (_order) => {
                        return new Promise(async (resolve, reject) => {
                            try {
                                if( orders_unread_messages && Array.isArray(orders_unread_messages) ) {
                                    orders_unread_messages.forEach(item => {
                                        if( item.orderID==_order.id ) {
                                            _order.totalUnreadMessages = item.totalUnreadMessages;
                                        }
                                    });
                                }
                                // const statsRes = await db.sequelize.query(`CALL sp_get_order_summary (:_orderId)`, { replacements: { _orderId: _order.id } });
                                // const stats = (statsRes && statsRes.length > 0 ? statsRes[0] : null);
                                // _order.areaSold = stats ? stats.areaSold : 0;
                                // _order.arePledged = stats ? stats.areaLocked : 0;
                                // _order.areaLeft = stats ? stats.areaLeft : 0;
                                // _order.activeDeals = stats ? stats.activeDeals : 0;
                                let item = new orderResponse.orderResponse(_order);
                                //item.seller.profilePicture = await fileHandler.getMediaAsync(item.relativePath);
                                _data.push(item);
                                resolve(true);
                            } catch (e) {
                                console.log("e", e);
                                resolve(true);
                            }
                        })
                    }));
                    // console.log("_data", data, _data, _orders[0]);
                } else {
                    resp.setError(_orders.toString(), "ORDERS_NOT_FETCHED");
                }

            } else {

                resp.setError(_orders.toString(), "ORDERS_NOT_FETCHED");

            }
        }
    } catch (ex) {
        console.log(ex);
        resp.setError(ex.toString(), "ORDERS_NOT_FETCHED");
    }

    resp.data = _data;
    return resp;
}

const getOrderItemsForMyOrders = async function (id, orderID, status) {

    let resp = new responseObject();
    let _data = [];
    let _orders = null;
    try {
        id = id && id > 0 ? id : 0;

        _orders = await db.sequelize.query('CALL sp_get_seller_order_items (:_user_id, :_order_id, :_status)', { replacements: { _user_id: id, _order_id: orderID, _status: status } });
        if (_orders && _orders.length > 0) {
            await Promise.all(_orders.map(async (_order) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        let _reviews = await db.sequelize.query(`SELECT userReviews.*, reviewee.id as revieweeID, reviewee.nickName as revieweeName, reviewer.id as reviewerID, reviewer.nickName as reviewerName FROM userReviews INNER JOIN users reviewee ON reviewee.id=userReviews.reviewedTo INNER JOIN users reviewer ON reviewer.id=userReviews.reviewedBy WHERE userReviews.source='MARKETPLACE_DEAL' AND userReviews.orderItemsID=:id AND userReviews.publishedAt IS NOT NULL`, {replacements:{'id':_order.id}, type: QueryTypes.SELECT });
                        _order.reviews = _reviews.map(review => {
                            return new userReviewResponse(review);
                        })
                        let item = new orderItemResponse.sellerOrderItemResponse(_order);
                        //item.buyer.profilePicture = await fileHandler.getMediaAsync(item.relativePath);
                        _data.push(item);
                        resolve(true);
                    } catch (e) {
                        reject(e);
                    }
                })
            }));
            resp.setSuccess("order fetched");

        }
    } catch (ex) {
        resp.setError(ex.toString(), "ORDERS_NOT_FETCHED");
    }

    resp.data = _data;
    return resp;
}

const getOrder = async function (id) {

    let resp = new responseObject();
    try {
        let _data = [];
        id = id && id > 0 ? id : 0;
        // let sql = getOrderQuery(id, 'order');
        let _order = await db.sequelize.query('CALL sp_get_order_by_id(:_order_id)', { replacements: {_order_id: Number(id) } }, { type: QueryTypes.SELECT })
         //await db.sequelize.query(sql);
      
        if (_order && _order.length > 0) {
            const data = getOrderObjectGroupedByPaymentMethod(_order);
            if (data) {
                data.forEach(_order => {
                    console.log("Order",_order);
                    let item = new orderResponse.orderResponse(_order);
                    _data.push(item);
                });
                resp.setSuccess("order fetched");
                resp.data = _data;
            } else {
                resp.setError(_order.toString(), "ORDERS_NOT_FETCHED");
            }
        } else {
            resp.setError(_order.toString(), "ORDER_NOT_FETCHED");
        }
    } catch (ex) {
        console.log(ex);
        resp.setError(ex.toString(), "ORDER_NOT_FETCHED");
    }
    return resp;
}

function getOrderQuery(id, type = 'property', userCountQuery = '', status, isAdmin = false, propertyCat=null) {
    
    let sql = `SELECT ROUND((orders.areaToList - (CASE WHEN SUM(DISTINCT(oi.areaPurchased)) IS NULL THEN 0 ELSE SUM(DISTINCT(oi.areaPurchased)) END)), 4) AS 'areaLeft',
        0 AS 'orderCompletion',
        SUM(DISTINCT(orderItems.areaPurchased)) AS 'areaSold',
        (SUM(DISTINCT(orderItems.areaPurchased)) - SUM(DISTINCT(oi.areaPurchased))) as 'arePledged',
        ` + userCountQuery + `
        orders.id,
        orders.sellerID,
        orders.propertyID,
        orders.pricePerSqFt,
        orders.areaToSell,
        orders.areaToList,
        orders.minimumLotSize,
        orders.subTotal,
        orders.total,
        orders.status,
        orders.daysToAcceptPayment,
        orders.tokenAmount,
        orders.serviceChargesMethod,
        orders.serviceCharges,
        orders.serviceChargesAreaPercent,
        orders.salesTax,
        orders.createdAt,
        orders.updatedAt,
        orders.inactiveAt,
        orders.completedAt,
        GROUP_CONCAT(orderPaymentMethods.id) AS 'orderPaymentMethodsID',
        GROUP_CONCAT(IFNULL(banks.name,userBankInformation.bankName)) AS 'bankName',
        GROUP_CONCAT(userBankInformation.id) AS 'bankAccountID',
        GROUP_CONCAT(banks.logo) AS 'bankLogo',
        users.walletAddress,
        users.nickName,
        users.createdAt as userRegisteredAt,
        property.propertySymbol,
        property.name as propertyName,
        property.propertyLogo,
        property.config	as 'propertyConfig',
        property.category as propertyCategory,
        property.rentPerUnit as propertyRentPerUnit,
        (SELECT count(orderid) FROM orderViews where orderid = orders.id) as views,
        media.relativePath,
        ( SELECT count(*) FROM orderItems WHERE orderItems.orderID = orders.id and \`status\` = 'active' ) as activeDeals,
        ( SELECT count(*) FROM orders as compOrderTab WHERE compOrderTab.sellerID = orders.sellerID and \`status\` = 'completed' ) as userCompletedOrders
    FROM
        orders
        LEFT OUTER JOIN orderItems ON orderItems.orderID = orders.id AND orderItems.status = 'completed' AND orderItems.status <> 'discarded'
        LEFT OUTER JOIN orderItems oi ON oi.orderID = orders.id AND oi.status <> 'discarded'
        LEFT JOIN orderPaymentMethods ON orders.id = orderPaymentMethods.orderId
        LEFT JOIN userBankInformation ON orderPaymentMethods.BankaccountID = userBankInformation.id
        LEFT JOIN banks ON banks.id=userBankInformation.bankId
        LEFT JOIN users ON users.id = orders.sellerID
        LEFT JOIN media ON media.id = users.profilePicture
        LEFT JOIN property ON orders.propertyID = property.id`;
    let hasWhereClause = false;
    switch (type) {
        case 'property':
            if (id && id > 0) {
                sql = sql + ` where orders.propertyID = ` + id;
                if (!isAdmin) {
                    sql = sql + ` AND orders.status = 'active' AND orders.isActive=1`;
                }
                hasWhereClause = true;
            }
            break;
        case 'seller':
            if (id && id > 0) {
                sql = sql + ` where orders.sellerID = ` + id;

                if (status) {
                    if( status==='inactive' ) {
                        sql = sql + ` and orders.isActive = 0`;
                    } else {
                        sql = sql + ` and orders.status = '` + status + `' and orders.isActive=1`;
                    }
                }
                hasWhereClause = true;
            }
            break;
        case 'order':
            if (id && id > 0) {
                sql = sql + ` where orders.id = ` + id;
                hasWhereClause = true;
            }
            break;
    }

    if( propertyCat ) {
        sql = sql + ` ${hasWhereClause ? 'AND' : 'where'} property.category='${propertyCat}'`;
    }

    sql = sql + ` GROUP BY orders.id ORDER BY orders.id DESC`;
    return sql;
}

function getOrderObjectGroupedByPaymentMethod(orders) {
    const merged = orders.reduce((r, { id, sellerID, views, propertyID, pricePerSqFt, activeDeals, areaToSell, areaToList, minimumLotSize, subTotal, total, status, daysToAcceptPayment, tokenAmount, serviceChargesMethod, salesTax, createdAt, updatedAt, walletAddress,propertyName, propertySymbol, propertyLogo, areaLeft, orderCompletion, propertyConfig, userOrders, areaSold, arePledged, nickName, relativePath, userRegisteredAt, userCompletedOrders, serviceCharges, propertyCategory, propertyRentPerUnit,inactiveAt,completedAt, totalPaymentsNeedToConfirm, serviceChargesAreaPercent, totalActiveDeals, totalCompletedDeals, avgBuyersRating, ...rest }) => {
        const key = `${id}-${sellerID}-${propertyID}`;
        r[key] = r[key] || { id, sellerID, views, propertyID, pricePerSqFt, activeDeals, areaToSell, areaToList, minimumLotSize, subTotal, total, status, daysToAcceptPayment, tokenAmount, serviceChargesMethod, salesTax, createdAt, updatedAt, walletAddress,propertyName, propertySymbol, propertyLogo, areaLeft, orderCompletion, propertyConfig, userOrders, areaSold, arePledged, nickName, relativePath, userRegisteredAt, userCompletedOrders, serviceCharges, propertyCategory, propertyRentPerUnit,inactiveAt,completedAt, totalPaymentsNeedToConfirm, serviceChargesAreaPercent, totalActiveDeals, totalCompletedDeals, avgBuyersRating, orderPaymentMethods: [] };
        r[key]["orderPaymentMethods"] = getPaymentMethodObject(rest)
        return r;
    }, {});
    return Object.values(merged);
}

function getPaymentMethodObject(methods) {
    let _paymentMethod = [];
    if (typeof (methods) != "undefined" && methods.orderPaymentMethodsID && methods.bankName && methods.bankAccountID && methods.accountNumber) {
        let _p_m = methods.orderPaymentMethodsID.split(',');
        let _p_n = methods.bankName.split(',');
        let _p_ids = methods.bankAccountID.toString().split(',');
        let _p_accountNumber = methods.accountNumber.toString().split(',');
        let _p_l = []; 
        if(methods&& methods.bankLogo )
           _p_l = methods.bankLogo.toString().split(',');
        console.log("Payment logo",_p_l);
        for (let index = 0; index < _p_m.length; index++) {
            let _accounts = { id: _p_m[index], orderPaymentMethodsID: _p_m[index], bankName: _p_n[index], bankAccountID: _p_ids[index],bankLogo:_p_l[index],accountNumber:_p_accountNumber[index] };
            _paymentMethod.push(new orderResponse.OrderPaymentMethod(_accounts));
        }
        _paymentMethod = _paymentMethod.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));
    }
    return _paymentMethod;
}

const saveOrder = async function (_data) {
    let resp = new responseObject();
    try {
        // let orderRequest = new orderModel.createOrderRequest(_data.order);
        let orderRequest = _data.order;
        let _paymentMethod = _data.paymentMethods;
        
        // Fetch Area Available 
        // let _areaAvailableForSale = getAreaAvailableForUser(orderRequest.propertyID, orderRequest.sellerID);
        // _order = await db.sequelize.models.orders.create(orderRequest);
        _order = await db.sequelize.query(`INSERT INTO orders (sellerID,propertyID,pricePerSqFt,areaToSell,areaToList,minimumLotSize,subTotal,total,status,daysToAcceptPayment,tokenAmount,serviceChargesMethod,serviceCharges,salesTax,createdAt,updatedAt,serviceChargesAreaPercent) 
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, {replacements:[orderRequest.sellerID,orderRequest.propertyID,orderRequest.pricePerSqFt,orderRequest.areaToSell,orderRequest.areaToList,orderRequest.minimumLotSize,orderRequest.subTotal,orderRequest.total,orderRequest.status,orderRequest.daysToAcceptPayment,orderRequest.tokenAmount,orderRequest.serviceChargesMethod,orderRequest.serviceCharges,orderRequest.salesTax,moment().format(),moment().format(),orderRequest.serviceChargesAreaPercent], type: QueryTypes.INSERT });
        console.log('_order', _order);
        await db.sequelize.query("call sp_deduct_area(?,?,?)",{replacements:[orderRequest.sellerID,orderRequest.propertyID,orderRequest.areaToSell]});

        if (_order && _order.length > 0) {

            _paymentMethod = orderRequest.getOrderPaymentMethod(_paymentMethod, _order[0]);
            _respMethods = await db.sequelize.models.orderPaymentMethods.bulkCreate(_paymentMethod, { returning: true });

            resp.setSuccess("order saved");
            let orderFetched = await this.getOrder(_order[0]);
            //let to = await getToken(orderFetched.sellerID);
            //sendNotification("Order# "+_order[0]+"","Order has been created. Click to view",process.env.portalurl+"/marketplace/order_requests/"+_order[0]+"/seller/",to).then(x=>{});
            resp.data = orderFetched && orderFetched.data ? orderFetched.data : null;

        } else {

            resp.setError("could not save order to db", "ORDER_NOT_SAVED");
        }

    } catch (ex) {
        resp.setError(ex.toString(), "ORDER_NOT_SAVED");
    }

    return resp;
}

const showBankAccountInformation = async function (itemID, action) {
    let resp = new responseObject();
    try {
        switch (action) {
            case showBankInformationAction.request:
                resp.setSuccess("Bank account information requested");
                await db.sequelize.query(`UPDATE orderItems SET showBankAccounts = :showBankAccounts,showBankAccountsBit=0 WHERE id = :id`,{replacements:{'showBankAccounts':BankInformationActionEnums.requested,'id':itemID}});
                break;
            case showBankInformationAction.allow:
                resp.setSuccess("Bank account information request approved");
                await db.sequelize.query(`UPDATE orderItems SET showBankAccounts = :showBankAccounts,showBankAccountsBit=1 WHERE id = :id`,{replacements:{'showBankAccounts':BankInformationActionEnums.allowed,'id':itemID}});
                break;
            case showBankInformationAction.deny:
                resp.setSuccess("Bank account information request rejected");
                await db.sequelize.query(`UPDATE orderItems SET showBankAccounts = :showBankAccounts,showBankAccountsBit=0 WHERE id = :id`,{replacements:{'showBankAccounts':BankInformationActionEnums.rejected,'id':itemID}});
                break;
            default:
                resp.setError('not allowed to perform this action', 'UNAUTHORIZED');
                break;
        }

    } catch (ex) {
        resp.setError(ex.toString(), "ORDER_NOT_SAVED");
    }

    return resp;
}
const checkshowBankStatus = async function (itemID, action) {
    let resp = new responseObject();
    try {
         let data = await db.sequelize.query(`select showBankAccounts from orderItems  WHERE id = ?`,{replacements:[itemID], type: QueryTypes.SELECT });
         if(data && data.length > 0)
         resp.data = data[0];
         else
         resp.data = {status:''}

    } catch (ex) {
        resp.setError(ex.toString(), "ORDER_NOT_SAVED");
    }

    return resp;
}

/**
 * 
 * @param {orderItemRequest} _data
 * @returns { Promise<responseObject>} 
 */
const buyOrderItem = async function (_data) {
    let resp = new responseObject();
    try {
        resp.setSuccess("Done");
        let sql = `insert into orderItems(areaPurchased, subTotal, tax, serviceCharges, Total, tokenAmount, status, orderID, buyerID, createdAt, updatedAt, extendedDays)
        values(?,?,?,?,?,?,?,?,?,?,?,?);`;
        let createdAt, updatedAt;
        createdAt=new Date(Date.now())
        updatedAt=new Date(Date.now())
        const _result = await db.sequelize.query(sql,{replacements:[_data.areaPurchased,_data.subTotal,_data.tax,_data.serviceCharges,_data.Total, 
        _data.tokenAmount, _data.status,_data.orderID,_data.buyerID, createdAt, updatedAt, 0]});

        if (_result && _result.length > 0) {
            const _tokenAmount = Math.round((_data.tokenAmount / 100) * _data.Total);
            if (_data.Total >= _tokenAmount) {
                let tokenPaymentSQL = `insert into orderPayments(amount, type, status, parentID, createdAt, updatedAt)
                        values(':_tokenAmount','token', 'pending', ':_result', now(), now());`;
                await db.sequelize.query(tokenPaymentSQL,{replacements:{_tokenAmount:_tokenAmount,_result:_result[0]}});
            }
        }

        resp.data = _result && _result.length > 0 ? _result[0] : null;

    } catch (ex) {
        console.log("ex", ex);
        resp = new responseObject();
        resp.setError(ex.toString(), "ELIGITY_NOT_FETCHED");
    }
    return resp;
}

/**
 * Get Order Item Details for buyer
 * @param {string} orderItemID
 * @param {string} buyer_id
 * @returns { Promise<responseObject>} 
 */
const getBuyerOrderItemDetails = async function (orderItemID, buyer_id) {

    let resp = new responseObject();
    try {
        let _data = {};
        if (orderItemID && orderItemID > 0) {
            let _orderDetails = await db.sequelize.query('CALL sp_get_order_item_detail_for_buyer (:_order_item_id, :_buyer_id)', { replacements: { _order_item_id: orderItemID, _buyer_id: buyer_id } });
            if (_orderDetails && _orderDetails.length > 0) {
                await _orderDetails.reduce(async (memo, _orderDetail) => {
                    await memo;
                    if (_orderDetails[0].id) {
                        // _orderDetails[0].paymentMethodId = !_orderDetails[0].showBankAccounts || _orderDetails[0].showBankAccounts == "" || _orderDetails[0].showBankAccounts == BankInformationActionEnums.rejected || _orderDetails[0].showBankAccounts == BankInformationActionEnums.requested ? null : _orderDetails[0].paymentMethodId;
                        let item = new orderItemDetailResponse(_orderDetails[0]);
                        if( !_orderDetails[0].showBankAccounts || _orderDetails[0].showBankAccounts == "" || _orderDetails[0].showBankAccounts == BankInformationActionEnums.rejected || _orderDetails[0].showBankAccounts == BankInformationActionEnums.requested ) {
                            item.paymentMethodsImages = item.paymentMethods.map(obj => {
                                return {
                                    name: obj.name,
                                    bankLogo: obj.bankLogo
                                };
                            });
                            item.paymentMethods = [];
                        }
                        // payments Object
                        let _payments = await db.sequelize.query('CALL sp_get_order_item_payments (:_order_item_id)', { replacements: { _order_item_id: orderItemID } });

                        if (_payments && _payments.length > 0) {
                            let amount = 0;
                            let payments = [];
                            item.amountPaidTillDate = 0;
                            for (let i = 0; i < _payments.length; i++) {
                                let _paymentObj = new orderItemPaymentResponse(_payments[i]);
                                if (_payments[i].paymentAttachments && _payments[i].paymentAttachments.length > 0) {
                                    for (let j = 0; j < _payments[i].paymentAttachments.length; j++) {
                                        if (_payments[i].paymentAttachments[j].relativePath) {
                                            const url = await fileHandler.getMediaAsync(_payments[i].paymentAttachments[j].relativePath);
                                            _paymentObj.setProof({ url, ..._payments[i].paymentAttachments[j] });
                                        }
                                    }
                                }
                                if ([orderPaymentStatusEnum.paid, orderPaymentStatusEnum.approved].includes(_paymentObj.status)) item.amountPaidTillDate = item.amountPaidTillDate + _paymentObj.amount;

                                payments.push(_paymentObj);
                                amount = amount + (_payments[i].amount ? _payments[i].amount : 0);
                            }
                            item.payments = payments;
                            item.paymentPending = Math.round(item.Total - amount);
                        }

                        // disputes Object
                        let _disputes = await db.sequelize.query(`select * from disputes where orderItemID = ${orderItemID}`, { type: QueryTypes.SELECT });
                        if (_disputes && _disputes.length > 0) {
                            for (let disp = 0; disp < _disputes.length; disp++) {
                                item.disputes.push(new disputeResponse(_disputes[disp]));
                            }
                        }

                        let _timeExtensionRequests = await db.sequelize.query(`SELECT *  FROM orderTimeExtensionRequests WHERE orderTimeExtensionRequests.orderItemID=?`, {replacements:[orderItemID], type: QueryTypes.SELECT });
                        if( _timeExtensionRequests && _timeExtensionRequests.length > 0 ) {
                            item.extendTimeRequests = _timeExtensionRequests.map(item => new timeExtensionRequestsResponse(item));
                        }

                        let _reviews = await db.sequelize.query(`SELECT userReviews.*, reviewee.id as revieweeID, reviewee.nickName as revieweeName, reviewer.id as reviewerID, reviewer.nickName as reviewerName FROM userReviews INNER JOIN users reviewee ON reviewee.id=userReviews.reviewedTo INNER JOIN users reviewer ON reviewer.id=userReviews.reviewedBy WHERE userReviews.source='MARKETPLACE_DEAL' AND userReviews.orderItemsID=:id`, {replacements:{'id':orderItemID}, type: QueryTypes.SELECT });
                        item.reviews = _reviews.map(review => {
                            if( (review.publishedAt && review.approvedAt) || review.reviewedBy===Number(buyer_id) ) {
                                return new userReviewResponse(review);
                            } else {
                                review.comment = null;
                                review.rating = null;
                                return new userReviewResponse(review);
                            }
                        })
                        _data = item;
                        resp.setSuccess("order details fetched");
                    } else {
                        resp.setError("unauthorized", "ORDER_DETAILS_NOT_AUTHORIZED");
                    }
                    resp.data = _data;

                }, undefined);

            } else {
                resp.setError(_orderDetails.toString(), "ORDER_DETAILS_NOT_AUTHORIZED");
            }
        } else {
            resp.setError("Order ID not supplied", "ORDER_DETAILS_NOT_FETCHED");
        }
    } catch (ex) {
        resp.setError(ex.toString(), "ORDER_DETAILS_NOT_FETCHED");
    }
    return resp;
}
const bankShareBitUpdate = async function (orderItemID, buyer_id) {

    let resp = new responseObject();
    try {
        if (orderItemID && orderItemID > 0) {
            await db.sequelize.query(`update orderItems set showBankAccountsBit=0 where id=:id;`,{replacements:{'id':orderItemID}});
        } else {
            resp.setError("Order ID not supplied", "ORDER_DETAILS_NOT_FETCHED");
        }
    } catch (ex) {
        resp.setError(ex.toString(), "ORDER_DETAILS_NOT_FETCHED");
    }
    return resp;
}

/**
 * Get Order Item Details for seller
 * @param {string} orderItemID
 * @param {string} seller_id
 * @returns { Promise<responseObject>}
 */
const getSellerOrderItemDetails = async function (orderItemID, seller_id) {

    let resp = new responseObject();
    try {
        let _data = {};
        if (orderItemID && orderItemID > 0) {
            let _orderDetails = await db.sequelize.query('CALL sp_get_order_item_detail_for_seller (:_order_item_id, :_seller_id)', { replacements: { _order_item_id: orderItemID, _seller_id: seller_id } });            
            if (_orderDetails && _orderDetails.length > 0) {
                let _propertyBanks = [];
                let serviceChargeBankAccount = [];
                await _orderDetails.reduce(async (memo, _orderDetail) => {
                    await memo;
                    if (_orderDetails[0].id) {                        
                        let item = new orderItemDetailResponse(_orderDetails[0]);

                        // payments Object
                        let _payments = await db.sequelize.query('CALL sp_get_order_item_payments (:_order_item_id)', { replacements: { _order_item_id: orderItemID } });
                        if (_payments && _payments.length > 0) {
                            let amount = 0;
                            let payments = [];
                            for (let i = 0; i < _payments.length; i++) {
                                let _paymentObj = new orderItemPaymentResponse(_payments[i]);
                                if (_payments[i].paymentAttachments && _payments[i].paymentAttachments.length > 0) {
                                    for (let j = 0; j < _payments[i].paymentAttachments.length; j++) {
                                        if(_payments[i].paymentAttachments[j].id){

                                            let url = '';
                                            if (_payments[i].paymentAttachments[j].relativePath) {
                                                url = await fileHandler.getMediaAsync(_payments[i].paymentAttachments[j].relativePath);
                                            }
                                            let payObj = { 'url': url, 'originalFileName': _payments[i].paymentAttachments[j].originalFileName, 'size': _payments[i].paymentAttachments[j].size, 'extension': _payments[i].paymentAttachments[j].extension };
                                            _paymentObj.setProof(payObj);
                                        }
                                    }
                                }
                                if ([orderPaymentStatusEnum.approved].includes(_paymentObj.status)) item.amountRecievedTillDate = item.amountRecievedTillDate + _paymentObj.amount;
                                payments.push(_paymentObj);
                                if ([orderPaymentStatusEnum.paid, orderPaymentStatusEnum.approved].includes(_paymentObj.status)) {
                                    amount = amount + (_payments[i].amount ? _payments[i].amount : 0)
                                }
                            }
                            item.amountPaidTillDate = amount ? amount : 0;
                            item.payments = payments;
                            item.paymentPending = Math.round(item.Total - item.amountPaidTillDate);
                        }

                        // disputes Object
                        let _disputes = await db.sequelize.query(`select * from disputes where orderItemID = ${orderItemID}`, { type: QueryTypes.SELECT });
                        if (_disputes && _disputes.length > 0) {
                            for (let disp = 0; disp < _disputes.length; disp++) {
                                item.disputes.push(new disputeResponse(_disputes[disp]));
                            }
                        }

                        let _propertyID = _orderDetails[0].propertyID;
                        // banks information
                        if (_propertyBanks.length == 0 || _propertyBanks.find(x => x.property != _propertyID)) {
                            let _banks = await getPropertyBanks(_propertyID);
                            _propertyBanks.push({ 'property': _propertyID, 'banks': _banks });
                            item.propertyBanks = _banks;
                        } else {
                            let _bankFound = _propertyBanks.find(x => x.property == _propertyID);
                            item.propertyBanks = _bankFound ? _bankFound.banks : [];
                        }


                        // service charges bank information
                        if(item.serviceAccountId) {
                            let _serviceChargesBankAccount = await db.sequelize.query('CALL sp_fetch_user_bank_information(:_user_id)',{replacements:{_user_id:item.serviceAccountId}});
                            item.serviceChargeBankAccount = _serviceChargesBankAccount;
                        }
                        // service charges
                        let _serviceChargesObject = await db.sequelize.query('CALL sp_get_service_charges_for_seller (:_item_id)', { replacements: { _item_id: orderItemID } });
                        for (let i = 0; i < _serviceChargesObject.length; i++) {
                            _serviceChargesObject[i].type = orderPaymentTypeEnum.servicecharges;
                            console.log('_serviceChargesObject[i]', _serviceChargesObject[i]);
                            let _paymentObj = new orderItemPaymentResponse(_serviceChargesObject[i]);
                            if (_serviceChargesObject[i].paymentAttachments && _serviceChargesObject[i].paymentAttachments.length > 0) {
                                for (let j = 0; j < _serviceChargesObject[i].paymentAttachments.length; j++) {
                                    let url = '';
                                    if (_serviceChargesObject[i].paymentAttachments[j].relativePath) {
                                        url = await fileHandler.getMediaAsync(_serviceChargesObject[i].paymentAttachments[j].relativePath);
                                        let payObj = { 'url': url, 'originalFileName': _serviceChargesObject[i].paymentAttachments[j].originalFileName, 'size': _serviceChargesObject[i].paymentAttachments[j].size, 'extension': _serviceChargesObject[i].paymentAttachments[j].extension };
                                        _paymentObj.setProof(payObj);
                                    }
                                }
                            }
                            item.serviceCharges = _paymentObj;
                        }

                        let _timeExtensionRequests = await db.sequelize.query(`SELECT *  FROM orderTimeExtensionRequests WHERE orderTimeExtensionRequests.orderItemID=${orderItemID}`, { type: QueryTypes.SELECT });
                        if( _timeExtensionRequests && _timeExtensionRequests.length > 0 ) {
                            item.extendTimeRequests = _timeExtensionRequests.map(item => new timeExtensionRequestsResponse(item));
                        }

                        let _reviews = await db.sequelize.query(`SELECT userReviews.*, reviewee.id as revieweeID, reviewee.nickName as revieweeName, reviewer.id as reviewerID, reviewer.nickName as reviewerName FROM userReviews INNER JOIN users reviewee ON reviewee.id=userReviews.reviewedTo INNER JOIN users reviewer ON reviewer.id=userReviews.reviewedBy WHERE userReviews.source='MARKETPLACE_DEAL' AND userReviews.orderItemsID=${orderItemID}`, { type: QueryTypes.SELECT });
                        item.reviews = _reviews.map(review => {
                            if( (review.publishedAt && review.approvedAt) || review.reviewedBy===Number(seller_id) ) {
                                return new userReviewResponse(review);
                            } else {
                                review.comment = null;
                                review.rating = null;
                                return new userReviewResponse(review);
                            }
                        })
                        
                        _data = item;
                        resp.setSuccess("order details fetched");
                    } else {
                        resp.setError("unauthorized", "ORDER_DETAILS_NOT_AUTHORIZED");
                    }
                    resp.data = _data;

                }, undefined);

            } else {
                resp.setError(_order.toString(), "ORDER_DETAILS_NOT_FETCHED");
            }
        } else {
            resp.setError("Order ID not supplied", "ORDER_DETAILS_NOT_FETCHED");
        }
    } catch (ex) {
        console.log(ex);
        resp.setError(ex.toString(), "ORDER_DETAILS_NOT_FETCHED");
    }
    return resp;
}

const getOrderDetail = async function (_order_item_id) {
    const result = await db.sequelize.query(`SELECT orderItems.orderID, orderItems.buyerID, orders.sellerID,orderItems.areaPurchased,property.name as propertyName, buyer.nickName as buyerName, seller.nickName as sellerName FROM orderItems INNER JOIN orders ON orders.id=orderItems.orderID INNER JOIN property ON property.id=orders.propertyID INNER JOIN users buyer ON buyer.id=orderItems.buyerID INNER JOIN users seller ON seller.id=orders.sellerID WHERE orderItems.id=? LIMIT 1;`, {replacements:[_order_item_id], type: QueryTypes.SELECT });
    if( result && result.length > 0 ) {
        return result.pop();
    } else {
        return null;
    }
}


const getDealDetail = async function(_dealID){
    const result = await db.sequelize.query(`select oi.id, oi.areaPurchased, o.areaToSell, p.name AS propertyName , oi.subTotal, oi.status from orderItems AS oi INNER JOIN orders AS o ON oi.orderID = o.id INNER JOIN property AS p ON o.propertyID = p.id WHERE oi.id = ? LIMIT 1;`, {replacements:[_dealID], type: QueryTypes.SELECT });
    if( result && result.length > 0 ) {
        return result.pop();
    } else {
        return null;
    }
}

const getDealPropertyDetail = async function(_dealID){
    const result = await db.sequelize.query(`select oi.id, oi.areaPurchased, o.areaToSell,p.id AS propertyId, p.name AS propertyName , oi.subTotal, oi.status from orderItems AS oi INNER JOIN orders AS o ON oi.orderID = o.id INNER JOIN property AS p ON o.propertyID = p.id WHERE oi.id = ? LIMIT 1;`, {replacements:[_dealID], type: QueryTypes.SELECT });
    if( result && result.length > 0 ) {
        return result[0];
    } else {
        return null;
    }
}

/*
Update Order Item (deal) status
*/
async function updateOrderStatus(id, status, userID, _data) {
    let transaction;
    let resp = new responseObject();
    try {
        if (id && status && userID > 0) {

            result = await db.sequelize.query(`select * from orderItems INNER JOIN orders on orders.id = orderItems.orderID WHERE orderItems.id =?`, {replacements:[id], type: QueryTypes.SELECT })
            console.log("result", result, status);
            if (result && result.length > 0) {
                switch (status) {
                    case orderItemStatus.active:
                        resp.data = await db.sequelize.query(`update orderItems set status='active' where id=?`,{replacements:[id]});
                        resp.setSuccess("Order status updated successfully");
                        break;
                    case orderItemStatus.completed:
                        const serviceCharges = await db.sequelize.query('call sp_get_service_charges_for_seller(:id)', { replacements: { id } }, );
                        console.log("serviceCharges", serviceCharges);
                        if( serviceCharges.length > 0 ) {
                            const data = serviceCharges[0];
                            console.log("_data", data);
                            if ( data.serviceChargesMethod==='area' ) {
                                await db.sequelize.query('call sp_marketplace_confirm_deal(:id,:serviceChargesArea)', { replacements: { id, serviceChargesArea: Number(data.area).toFixed(4) } });
                                let getMedia = await db.sequelize.query(`select tradeactivity.id,paymentAttachments.mediaID from tradeactivity 
                                inner join orderItems on orderItems.tradeActivityID=tradeactivity.id 
                                inner join orderPayments on orderPayments.parentID=orderItems.id 
                                inner join paymentAttachments on paymentAttachments.paymentID=orderPayments.id where  orderItems.id=${id}`,{type:QueryTypes.SELECT});
                                getMedia.forEach(x=>{
                                    db.sequelize.query(`insert into  tradedocuments(tradeID,mediaId,createdAt,updatedAt) 
                                    Values (${x.id},${x.mediaID},CURDATE(),CURDATE());`,{type:QueryTypes.INSERT});
                                });
                                resp.data = result;
                                resp.setSuccess("Order status updated successfully");
                            } else if( data.serviceChargesMethod==='bank' && data.status==='approved' ) {
                                const spres = await db.sequelize.query('call sp_marketplace_confirm_deal(:id, :serviceChargesArea)', { replacements: { id, serviceChargesArea: 0 } });
                                let getMedia = await db.sequelize.query(`select tradeactivity.id,paymentAttachments.mediaID from tradeactivity 
                                inner join orderItems on orderItems.tradeActivityID=tradeactivity.id 
                                inner join orderPayments on orderPayments.parentID=orderItems.id 
                                inner join paymentAttachments on paymentAttachments.paymentID=orderPayments.id where  orderItems.id=${id}`);
                                getMedia.forEach(x=>{
                                    db.sequelize.query(`insert into  tradedocuments(tradeID,mediaId,createdAt,updatedAt) 
                                    Values (${x.id},${x.mediaID},CURDATE(),CURDATE());`,{type:QueryTypes.INSERT});
                                });
                                resp.data = result;
                                resp.setSuccess("Order status updated successfully");
                            } else {
                                console.log("dfdsfsdfdsfdfds");
                                resp.setError("Please try again.", "ORDERITEM_STATUS_NOT_UPDATED")
                            }       
                        }
                        break;
                    case orderItemStatus.discarded:
                        resp.data = await db.sequelize.query(`update orderItems set status='discarded' where id=?`,{replacements:[id]});
                        resp.setSuccess("Order status updated successfully");
                        break;
                    case orderItemStatus.disputed:
                        try {
                            // add dispute entry as well
                            _data["orderItemID"] = id;
                            _data["status"] = disputeStatus.active;
                            let requestData = new disputeRequest(_data);
                            await saveDispute(requestData);
                            resp.data = await db.sequelize.query(`update orderItems set status='disputed' where id=?`,{replacements:[id]});
                            resp.setSuccess("Order status updated successfully");
                        } catch (ex) {
                            console.log("ex", ex);
                            resp.setError(ex.toString(), "Could not add dispute");
                        }
                        break;
                }
            } else {
                resp.setError("Action not allowed", "UNAUTHORIZED");
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
Update Order Item (deal) status
*/
async function deleteOrderItem(id, userID, reasons=[]) {
    let transaction;
    let resp = new responseObject();
    try {
        if (id && userID > 0) {

            result = await db.sequelize.query(`SELECT COUNT(*) as paymentsCount from orderPayments WHERE orderPayments.parentID=? and orderPayments.status IN ('paid', 'approved');`, {replacements:[id], type: QueryTypes.SELECT })
            console.log("result", result);
            if (result && result.length > 0 && result[0].paymentsCount <= 0) {
                // if (result.status == orderItemStatus.active) {
                    resp.data = await db.sequelize.query(`update orderItems set status=:status, cancelledReasons=:reasons, cancelledBy=:cancelledBy, cancelledAt=NOW() where id=${id}`, {replacements: { status: 'discarded', reasons: reasons.join(" | "), cancelledBy: userID }});
                    // ToDO: do we have to mark discarded all payments as well?
                    // await db.sequelize.query(`update orderPayments set status='discarded' where parentID=${id}`);
                    resp.setSuccess("Order status updated successfully");
                // } else {
                //     resp.setError("Action not allowed", "UNAUTHORIZED");
                // }
            } else {
                resp.setError("Action not allowed", "UNAUTHORIZED");
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
Update Order Item (deal) status
*/
async function timeExtendRequest(id, userID) {
    let transaction;
    let resp = new responseObject();
    try {
        if (id && userID > 0) {

            result = await db.sequelize.query(`select * from orderItems WHERE id =? AND buyerID =? `, {replacements:[id,userID], type: QueryTypes.SELECT });

            if (result && result.length > 0) {
                if (result[0].status == orderItemStatus.active) {
                    resp.data = await db.sequelize.query(`update orderItems set timeExtensionRequired=1 where id=?`,{replacements:[id]});
                    // ToDO: do we have to mark discarded all payments as well?
                    // await db.sequelize.query(`update orderPayments set status='discarded' where parentID=${id}`);
                    resp.setSuccess("Time extend request sent successfully");
                } else {
                    resp.setError("Action not allowed", "UNAUTHORIZED");
                }
            } else {
                resp.setError("Action not allowed", "UNAUTHORIZED");
            }

        } else {
            resp.setError("somethign went wrong", "TIME_EXTEND_NOT_UPDATED");
        }
    } catch (e) {
        if (transaction) { transaction.rollback(); }
        console.log("ex", e);
        resp.setError(e.toString(), "TIME_EXTEND_NOT_UPDATED");
    }
    return resp;
}

/*
Update Order Item (deal) status
*/
async function approveTimeExtendRequest(data, id, userID) {
    let transaction;
    let resp = new responseObject();
    try {
        if (id && userID > 0) {

            await db.sequelize.query(`update orderItems set extendedDays = (extendedDays + ` + data.days + `) where id=${id}`);
            await db.sequelize.query(`update orderTimeExtensionRequests set status = 'ACCEPTED', acceptedAt = NOW() where orderItemID=${id}`);
            
            resp.setSuccess("Time extend request approved successfully");

        } else {
            resp.setError("somethign went wrong", "TIME_EXTEND_NOT_UPDATED");
        }
    } catch (e) {
        if (transaction) { transaction.rollback(); }
        console.log("ex", e);
        resp.setError(e.toString(), "TIME_EXTEND_NOT_UPDATED");
    }
    return resp;
}

// private functions start here 
async function getSellerOrderSummary(orderId) {
    const data = await db.sequelize.query('call sp_get_order_summary(:_orderId)', { replacements: { _orderId: orderId } });
    if (data.length > 0) {

        const _formated = new OrderSummaryResponse(data[0]);
        return {
            success: true,
            data: _formated
        }
    }
    else {
        return {
            success: false,
            data: {}
        }
    }

}

async function getSellerOrdersSummary(userId) {
    const data = await db.sequelize.query('call sp_get_orders_summary(:_user_id)', { replacements: { _user_id: userId } }, { type: QueryTypes.SELECT });
    if (data.length > 0) {
        let _orderCompletion = await db.sequelize.query('CALL sp_get_order_completion_seller (:_user_id)', { replacements: { _user_id: userId } }, { type: QueryTypes.SELECT })
        if( data[0] ) {
            data[0].orderCompletion = _orderCompletion && _orderCompletion.length > 0 ? Math.round(_orderCompletion[0].progress) : 0;
            let _reviews = await db.sequelize.query(`CALL sp_marketplace_get_user_review(:_user_id)`, { replacements: { _user_id: userId } }, { type: QueryTypes.SELECT });
            _reviews = _reviews.map(review => {
                return new userReviewResponse(review);
            })
            data[0].reviews = _reviews;
        }
        const _formated = new OrdersSummaryResponse(data[0]);
        return {
            success: true,
            data: _formated
        }
    }
    else {
        return {
            success: false,
            data: {}
        }
    }

}

async function fetchUserStats(userId) {
    try {
        let userStats = await db.sequelize.query('call sp_user_orders_stats(:_user_id)', { replacements: { _user_id: userId } }, { type: QueryTypes.SELECT });
        if( userStats.length > 0 ) {
            userStats = userStats[0];
        } else {
            userStats = null
        }
        const _formated = new UserOrdersStats(userStats);
        return {
            success: true,
            data: _formated
        }
    } catch (e) {
        return {
            success: false,
            data: {}
        }
    }
}

async function getAreaAvailableForUser(propertyID, sellerID) {
    let _availableArea = await db.sequelize.query('CALL sp_get_property_available_for_sale (:_property_id, :_user_id)', { replacements: { _property_id: propertyID, _user_id: sellerID } });
    _availableArea = _availableArea[0]
    let arePurchased = _availableArea && _availableArea.totalAreaPledged ? _availableArea.totalAreaPledged : 0;
    let totalAreaSold = _availableArea && _availableArea.totalAreaSold ? _availableArea.totalAreaSold : 0;
    return ((arePurchased - totalAreaSold) < 0 ? 0 : (arePurchased - totalAreaSold));
}

async function viewOrder(orderId, userId) {
    try {
        let result = await db.sequelize.query('INSERT IGNORE INTO orderViews(userId,orderId) VALUES(:_user_id,:_order_id);', { replacements: { _user_id: userId, _order_id: orderId } });
        return {
            success: true,
            data: result
        }
    } catch (error) {
        return {
            success: false,
            data: error.toString()
        }
    }

}

async function revertOrder(orderId, userId=0, reason='') {
    try {
        let result = await db.sequelize.query('call sp_revert_order(:_order_id, :_reason);', { replacements: { _order_id: orderId, _reason: reason } });
        return {
            success: true,
            data: {status: true}
        }
    } catch (error) {
        return {
            success: false,
            data: error.toString()
        }
    }
}

async function adminGetOrders() {
    let resp = new responseObject();
    try {
        let _data = [];
        let _properties = await db.sequelize.query('select id from property',{  type: QueryTypes.SELECT});
        for (let i = 0; i < _properties.length; i++) {
            const el = _properties[i];
            let _orders = await getOrders(el.id, true);
            _data.push(..._orders.data);
        }
        resp.setSuccess("Time extend request approved successfully");
        resp.data = _data;
    } catch (error) {
        console.log("ex", error);
        resp.setError(error.toString(), "TIME_EXTEND_NOT_UPDATED");
    }
    return resp;
}


async function getUserInfo (userId){
    let resp = new responseObject();
    try {
        let users = await db.sequelize.query('select * from users where id =? ',{replacements:[userId],  type: QueryTypes.SELECT});
        if(users.length>0){
            resp.data = {
                id:users[0].id,
                firstName:users[0].firstName,
                lastName:users[0].lastName,
                nickName:users[0].nickName,
            };
        }
        resp.setSuccess("Time extend request approved successfully");
    } catch (error) {
        console.log("ex", error);
        resp.setError(error.toString(), "TIME_EXTEND_NOT_UPDATED");
    }
    return resp;
}

async function getUserBankInfo (userId){
    let resp = new responseObject();
    try {
        let users = await db.sequelize.query('select ubi.id,ifnull(nullif(ubi.bankName,\'\'),b.name) bankName,b.svg ,ubi.accountTitle,ubi.userID,ubi.accountNumber,ubi.iban,ubi.branch,ubi.bankId from userBankInformation ubi left join banks b on ubi.bankId = b.id where ifnull(deleted,0)=0 and userID = '+userId,{  type: QueryTypes.SELECT});
        if(users.length>0){
            resp.data = users;
        }
        resp.setSuccess("Time extend request approved successfully");
    } catch (error) {
        console.log("ex", error);
        resp.setError(error.toString(), "TIME_EXTEND_NOT_UPDATED");
    }
    return resp;
}
async function getChat(orderItemId){
    let resp = new responseObject();
    try {
        let chat = await db.sequelize.query('select * from chat where orderItemId =? ',{replacements:[orderItemId],  type: QueryTypes.SELECT});
        if(chat.length>0){
            resp.data = chat;
        }else{
            resp.data=[];
        }
        resp.setSuccess("Time extend request approved successfully");
    } catch (error) {
        console.log("ex", error);
        resp.setError(error.toString(), "TIME_EXTEND_NOT_UPDATED");
    }
    return resp;
}
/**
 * 
 * @param {*} orderItem 
 * @returns {responseObject}
 */
async function adminGetOrderItems(orderItem) {
    let resp = new responseObject();
    try {
        let result = await db.sequelize.query('SELECT sellerID FROM orders WHERE id =?;', { replacements:[orderItem], type: QueryTypes.SELECT });
        let result1 = await db.sequelize.query('SELECT id FROM orderItems WHERE orderID = ?', { replacements:[orderItem],type: QueryTypes.SELECT });
       
        if (result) {
            id = result[0].sellerID;
            let data = [];
            if(result1&&result1.length>0){
                for (let i = 0; i < result1.length; i++) {
                    const el = result1[i];                    
                    let res = await getSellerOrderItemDetails(el.id, id);
                    let chat = (await getChat(el.id)).data;
                    res.data["chat"] = chat;
                    data.push(res.data);
                }
                let orderSummary = (await getSellerOrderSummary(orderItem)).data;
                orderSummary["seller"] = (await getUserInfo(result[0].sellerID)).data;
                orderSummary["sellerBankInfo"] = (await getUserBankInfo(result[0].sellerID)).data;
                data.forEach(ele => {                    
                    ele["tokenPaid"] = ele.payments.findIndex(x=>x.type=="token"&&x.status=="approved")>-1;
                });
                resp.data = {order:orderSummary,deals:data};
            }
        }

        resp.setSuccess("Admin Order Items Fetched");
    } catch (error) {
        console.log("ex", error);
        resp.setError(error.toString(), "TIME_EXTEND_NOT_UPDATED");
    }
    return resp;
}
/**
 * 
 * @param {unlockAreaRequest} obj 
 * @returns {Promise<responseObject>}
 */

async function requestAreaUnlock(obj) {
    let resp = new responseObject();
    try {
        let result = await db.sequelize.query(`INSERT INTO areaUnlockRequests(area,propertyID,userID,status,createdAt, reason)VALUES(${obj.area},${obj.propertyId},${obj.userId},'pending',now(), '${obj.reason ? obj.reason : ''}');`);
        resp.setSuccess("Area unlocked request placed successfully.");
        resp.data = result[0];
    } catch (error) {
        console.log("ex", error);
        resp.setError(error.toString(), "TIME_EXTEND_NOT_UPDATED");
    }
    return resp;
}
/**
 * 
 * @param {String} obj 
 * @returns {Promise<responseObject>}
 */

async function getAllRequests(id,obj = "all" || "pending") {
    let resp = new responseObject();
    try {
        let result = await db.sequelize.query(`select aur.id, aur.area,ifnull(aur.approvedArea,0) approvedArea, aur.propertyID as propertyId, aur.userID as userId,aur.reason,aur.createdAt, p.name,p.propertySymbol,p.propertyLogo,u.firstName,u.lastName,u.legalName,u.nickName,aur.status,aur.reason from areaUnlockRequests aur join property p on aur.propertyID = p.id join users u on aur.userID = u.id ${obj == "pending" ? " and aur.status = 'pending' " : ''} where aur.propertyID = ${id} order by aur.id desc;`);
        resp.setSuccess("Area unlocked request placed successfully.");
        const _result = [] = result[0];
        resp.data = _result.map(x => new unlockAreaResponse(x));
    } catch (error) {
        console.log("ex", error);
        resp.setError(error.toString(), "TIME_EXTEND_NOT_UPDATED");
    }
    return resp;
}
/**
 * 
 * @param {String} obj 
 * @returns {Promise<responseObject>}
 */

async function getUserProjectUnlockedArea(obj) {
    let resp = new responseObject();
    try {
        let result = await db.sequelize.query(`call sp_get_user_projects_sell_area(?);`,{replacements:[obj]});
        resp.setSuccess("Success.");
        const _result = [] = result;
        resp.data = await Promise.all(_result.map(async x => {
            let unlockRequests = await db.sequelize.query(`SELECT * FROM areaUnlockRequests WHERE areaUnlockRequests.userID=${obj} AND areaUnlockRequests.propertyID=${x.propertyId} ORDER BY areaUnlockRequests.createdAt DESC LIMIT 1`, { type: QueryTypes.SELECT });
            if( unlockRequests && Array.isArray(unlockRequests) ) {
                x.lastAreaUnlockRequest = unlockRequests.pop();
            }

            if(x.category === PropertyCategory.mature)
                x.unlocked = x.balance;

            return new userUnlockAreaResponse(x);
        }));
    } catch (error) {
        console.log("ex", error);
        resp.setError(error.toString(), "TIME_EXTEND_NOT_UPDATED");
    }
    return resp;
}


/**
 * 
 * @param {String} obj 
 * @returns {Promise<responseObject>}
 */

async function changeRequestStatus(id, obj, area) {
    let resp = new responseObject();
    try {
        let result = await db.sequelize.query(`call sp_change_request_status(?,?,?)`,{replacements:[id,obj,area]});
        resp.setSuccess("Success.");
        resp.data = null;
    } catch (error) {
        console.log("ex", error);
        resp.setError(error.toString(), "TIME_EXTEND_NOT_UPDATED");
    }
    return resp;
}

async function markInactive(orderId, userID) {
    let resp = new responseObject();
    try {
        const result = await db.sequelize.query(`select count(*) as totalOrders from orders where orders.id=? and orders.sellerID=?`, {replacements:[orderId,userID], type: QueryTypes.SELECT });
        console.log("result", result);
        if(result && result.length > 0 && result[0].totalOrders > 0) {
            await db.sequelize.query(`update orders set isActive=0, inactiveAt=NOW() where orders.id=?`,{replacements:[orderId]});
            resp.setSuccess("Success.");
            resp.data = null;
        } else {
            resp.setError("Action not allowed", "UNAUTHORIZED");
        }
    } catch(e) {
        console.log("result", e);
        resp.setError(e.toString(), "UPDATING_ORDER_ERROR");
    }
    return resp;
}

async function markActive(orderId, userID) {
    let resp = new responseObject();
    try {
        const result = await db.sequelize.query(`select count(*) as totalOrders from orders where orders.id=? and orders.sellerID=?`, {replacements:[orderId,userID], type: QueryTypes.SELECT });
        console.log("result", result);
        if(result && result.length > 0 && result[0].totalOrders > 0) {
            await db.sequelize.query(`update orders set isActive=1 where orders.id=${orderId}`);
            resp.setSuccess("Success.");
            resp.data = null;
        } else {
            resp.setError("Action not allowed", "UNAUTHORIZED");
        }
    } catch(e) {
        console.log("result", e);
        resp.setError(e.toString(), "UPDATING_ORDER_ERROR");
    }
    return resp;
}

async function getDealReceiptData(dealId){

    const resp = new responseObject();
    try {
        let query = "select  DATE_ADD( oi.createdAt, INTERVAL + (o.daysToAcceptPayment + oi.extendedDays) DAY ) AS 'dueDate', o.sellerID,oi.buyerID,o.id orderId,oi.id as dealId,o.propertyID,o.pricePerSqFt,oi.areaPurchased,oi.Total,(oi.tokenAmount*oi.Total)/100 tokenAmount ,o.serviceChargesMethod,oi.createdAt,ifnull(o.daysToAcceptPayment,0)+ifnull(oi.extendedDays,0) as days from orders o join orderItems oi on o.id = oi.orderID and oi.id =:id ";
        const dealResult = await db.sequelize.query(query, {replacements:{id:dealId}, type: QueryTypes.SELECT });
        if(dealResult&&dealResult.length>0){
            const deal = dealResult[0];
            let sellerQuery = "select id,nickName from users where id = "+deal.sellerID;
            const sellerResult = await db.sequelize.query(sellerQuery,{ type: QueryTypes.SELECT });
            deal["seller"] = sellerResult[0];
            let buyerQuery = "select id,nickName from users where id = "+deal.buyerID;
            const buyerResult = await db.sequelize.query(buyerQuery,{ type: QueryTypes.SELECT });
            deal["buyer"] = buyerResult [0];
            const propertyQuery = "select name,coverPhoto,propertySymbol,propertyLogo,category,config from property where id = "+deal.propertyID;
            const propertyResult = await db.sequelize.query(propertyQuery,{ type: QueryTypes.SELECT });
            deal["property"] = propertyResult[0];
            //const banksQuery = "select * from userBankInformation where userID = "+deal.sellerID+" limit 2";
            // const banksQuery = `SELECT ubi.id, ifnull(nullif(ubi.bankName,''),b.name) bankName, ubi.accountTitle, ubi.userID, ubi.accountNumber, ubi.iban, ubi.branch,b.name,b.svg FROM userBankInformation ubi left join banks b on ubi.bankId = b.id where ifnull(deleted,0)=0 and userID=${deal.sellerID} limit 2`;
            const banksQuery = `select ubi.id,ifnull(nullif(ubi.bankName,''),b.name) bankName,ubi.accountTitle, ubi.userID, ubi.accountNumber, ubi.iban, ubi.branch,b.name,b.svg from orderPaymentMethods opm
            join userBankInformation ubi on ubi.id = opm.BankaccountID and orderID = ?
            left join banks b on ubi.bankId = b.id;`;
            banksResult = await db.sequelize.query(banksQuery,{replacements:[deal["orderId"]],type: QueryTypes.SELECT });
            deal["banks"] = banksResult;
            const paymentsQuery = "select * from orderPayments where parentID = "+deal.dealId;
            const paymentsResult = await db.sequelize.query(paymentsQuery,{ type: QueryTypes.SELECT });
            deal["payments"] = paymentsResult;
            let token = {
                total: Math.round(deal.tokenAmount),
                paid:0,
                remaining:0
            };
            let amount={
                total:deal.Total,
                paid:0
            }
            if(deal.payments&&deal.payments.length>0){
                token.paid = deal.payments.filter(x=>x.type=='token' && x.status == 'approved').reduce((a,b)=>a+b.amount,0);
                token.remaining = Math.abs(token.total - token.paid);
                amount.paid =  deal.payments.filter(x=>x.type!='servicecharges' && x.status == 'approved').reduce((a,b)=>a+b.amount,0);
            }

            deal["token"] = token;
            deal["amount"] = amount;
            
            resp.data = deal;
            
            resp.setSuccess("Fetched.");
        }

    } catch (er) {
        resp.setError(er.toString(),"EXCEPTION")
    }
    return resp;
}
async function getAdminMarketplaceSummary(){
    const resp = new responseObject();
    try{
        let query = "call sp_admin_get_markeplace_summary();";
        const result = await db.sequelize.query(query);
        resp.data = result[0];
        resp.setSuccess("Summary fetched");
    } catch (er) {
        resp.setError(er.toString(),"EXCEPTION")
    }
    return resp;
}
async function getAdminMarketplaceProjectSummary(id){
    const resp = new responseObject();
    try{
        let projQuery = "select id,name,propertyLogo,coverPhoto from property "+(id?" where id = "+id:"");
        let projRes = await db.sequelize.query(projQuery,{type:QueryTypes.SELECT});
        let data = [];
        if(projRes&&projRes.length>0){
            for (let i = 0; i < projRes.length; i++) {
                const el = projRes[i];
                let query = "call sp_admin_get_summary_by_project("+el.id+");";
                const result = await db.sequelize.query(query);

                if(result&&result.length>0){
                    result[0].requestsCount = (await getAllRequests(el.id,"pending")).data.length
                    data.push({property:el,summary:result[0]});
                }
            }
        }
        if(id)
            resp.data = data[0];
        else
            resp.data = data;
        resp.setSuccess("Summary fetched");
    } catch (er) {
        resp.setError(er.toString(),"EXCEPTION")
    }
    return resp;
}


/**
 * 
 * @param {number} orderItemId 
 */
 async function adminDeleteOrderItem(orderItemId){
    let transaction;
    let resp = new responseObject();
    try {
        if (orderItemId > 0) {
            result = await db.sequelize.query(`select * from orderItems WHERE id =?;`, {replacements:[orderItemId], type: QueryTypes.SELECT })
            if (result && result.length > 0) {
                if (result[0].status == orderItemStatus.active) {
                    resp.data = await db.sequelize.query(`update orderItems set status='discarded' where id=${orderItemId}`);
                    // ToDO: do we have to mark discarded all payments as well?
                    // await db.sequelize.query(`update orderPayments set status='discarded' where parentID=${id}`);
                    resp.setSuccess("Order status updated successfully");
                } else {
                    resp.setError("Action not allowed", "UNAUTHORIZED");
                }
            } else {
                resp.setError("Action not allowed", "UNAUTHORIZED");
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

async function getDisputes(){
    let resp = new responseObject();
    try{
        let query = "SELECT o.id as orderId,o.sellerID,oi.buyerID,oi.id as dealId,case when oi.buyerID = d.userId then 'Buyer' else 'Seller' end as raisedBy, d.* from disputes d join orderItems oi on d.orderItemID = oi.id join orders o on o.id = oi.orderID ";        
        if(arguments.length>0){
            if(arguments[0]&&arguments[1])
                query += setLimit(arguments[0],arguments[1]);
        }
        let result = await db.sequelize.query(query,{type:QueryTypes.SELECT});
        for (let i = 0; i < result.length; i++) {
            const el = result[i];
            el["seller"] = (await getUserInfo(el.sellerID)).data;
            el["buyer"] = (await getUserInfo(el.buyerID)).data;
        }
        resp.data = result;
    } catch (e) {
    resp.setError(e.toString(), "ORDERITEM_STATUS_NOT_UPDATED");
    }
    return resp;
}
async function getServiceCharges(pageNo,pageSize){
    let resp = new responseObject();
    try{
        let query = "select op.id,o.id orderId,oi.id dealId,o.sellerID, op.amount,op.status,op.paidDate from orderPayments op join orderItems oi on op.parentID = oi.id join orders o on oi.orderID = o.id where type = 'servicecharges' order by  status desc,op.id desc ";
        let countQuery = "select count(*) as count from orderPayments op join orderItems oi on op.parentID = oi.id join orders o on oi.orderID = o.id where type = 'servicecharges' order by  op.status desc ";        
        if(pageNo){
            query+= setLimit(pageNo,(pageSize?pageSize:10));
        }
        let result = await db.sequelize.query(query,{type:QueryTypes.SELECT});
        let countResult = await db.sequelize.query(countQuery,{type:QueryTypes.SELECT});
        for (let i = 0; i < result.length; i++) {
            const el = result[i];
            el["seller"] = (await getUserInfo(el.sellerID)).data;
            let mQuery = `select fileName,originalFileName,relativePath from media where id in (select  mediaID from paymentAttachments where paymentID = ${el.id})`;
            el["attachments"] = (await db.sequelize.query(mQuery,{type:QueryTypes.SELECT}));
            for (let j = 0; j < el["attachments"].length; j++) {
                const attachment = el["attachments"][j];
                attachment["url"] = await fileHandler.getMediaAsync(attachment.relativePath);
                
            }
        }
        
        resp.data = result;
        resp["count"] = countResult[0].count
    } catch (e) {
    resp.setError(e.toString(), "ORDERITEM_STATUS_NOT_UPDATED");
    }
    return resp;
}
async function approveServiceCharges(id){
    debugger;
    let resp = new responseObject();
    try{
        let query = "update orderPayments set status = 'approved',updatedAt = now() where id =:id ";
        
        let result = await db.sequelize.query(query,{replacements:{id:id}, type:QueryTypes.UPDATE});
        let response = await db.sequelize.query(`select parentID from orderPayments where id = ?`,{replacements:[id],type:QueryTypes.SELECT});
        const sellerID = await getSellerIDfromOrderItem(response[0].parentID);
        response[0]["sellerID"] = sellerID;
        resp.data = response;
        let fetchQuery = "select * from orderPayments where id =? ";
        result = await db.sequelize.query(fetchQuery,{replacements:[id],type:QueryTypes.SELECT});
    
        resp.data = result;
    } catch (e) {
    resp.setError(e.toString(), "ORDERITEM_STATUS_NOT_UPDATED");
    }
    return resp;
}
async function getUserAreaSummary(id){
    let resp = new responseObject();
    try{
        let query = "call sp_get_user_area_summary(?);";
        let data = {};
        let result = await db.sequelize.query(query,{replacements:[id]});
        const developmental = result.filter(x=>x.category=='development');
        const mature = result.filter(x=>x.category=='mature');
        data["developmental"]={
            "porfolio":{
                "area":developmental.filter(x=>x.type=='Porfolio')[0].area
            },
            "requests":{
                "area":developmental.filter(x=>x.type=='Requests')[0].area
            },
            "unlocked":{
                "area":developmental.filter(x=>x.type=='Unlocked')[0].area
            },
        }
        data["mature"]={
            "porfolio":{
                "area":mature.filter(x=>x.type=='Porfolio')[0].area
            },
            "requests":{
                "area":mature.filter(x=>x.type=='Requests')[0].area
            },
            "unlocked":{
                "area":mature.filter(x=>x.type=='Unlocked')[0].area
            },
        }
        resp.data = data;
    } catch (e) {
    resp.setError(e.toString(), "ORDERITEM_STATUS_NOT_UPDATED");
    }
    return resp;
}

const search = async function(txt){
    let resp = new responseObject();
    try{
        let query = "call sp_marketplace_generic_search(?);";
        let data = {
            orders:[],
            deals:[],
            request:[],
            disputes:[],
            serviceCharges:[]
        };
        let result = await db.sequelize.query(query,{replacements:[txt]});
        if(result&&result.length>0){
            if(result[0]["@ordersJson"]){
                data["orders"] = JSON.parse(result[0]["@ordersJson"]);
            }
            if(result[0]["@orderItemsJson"]){
                data["deals"] = JSON.parse(result[0]["@orderItemsJson"]);
            }
            if(result[0]["@areaRequestJson"]){
                data["request"] = JSON.parse(result[0]["@areaRequestJson"]);
            }
            if(result[0]["@disputesJson"]){
                data["disputes"] = JSON.parse(result[0]["@disputesJson"]);
            }
            if(result[0]["@serviceChargesJson"]){
                data["serviceCharges"] = JSON.parse(result[0]["@serviceChargesJson"]);
            }
        }
        resp.data = data;
    } catch (e) {
        resp.setError(e.toString(), "ORDERITEM_STATUS_NOT_UPDATED");
    }
    return resp;
}

const getUserAvailableAreaAdmin = async function(userID){
    let resp = new responseObject();
    try {
        const query = "call sp_get_user_projects_sell_area(?)";
        const result = await db.sequelize.query(query,{replacements:[userID]});
        resp.data = result;
        resp.setSuccess("Fetched");
    } catch (error) {
        resp.setError(error.toString(),"ERROR")
    }
    return resp;
}
async function getToken(userId){
    let query = `select device_token from users where id = ?`;
    const data = await db.sequelize.query(query,{replacements:[userId],type:QueryTypes.SELECT});
    return (data&&data.length > 0) ? data[0]["device_token"] : 0;
}
/**
 * 
 * @param {Number} id 
 * @returns {Number} - sellerID
 */
async function getSellerIDfromOrderItem(id){
    let query = `select sellerID from orders where id = (select orderID from orderItems where id = ? limit 1)`;
    const data = await db.sequelize.query(query,{replacements:[id],type:QueryTypes.SELECT});
    return data[0]["sellerID"];
}
async function getDealProperty(id){
    let query = `select o.propertyID from orderItems oi join orders o on o.id=oi.orderID and oi.id = ?`;
    const data = await db.sequelize.query(query,{replacements:[id],type:QueryTypes.SELECT});
    return data[0]["propertyID"];
}
module.exports = {
    saveWhySellSurvey,
    marketplaceEligibility,
    getOrders,
    getDeals,
    getDealPropertyDetail,
    saveOrder,
    getOrder,
    getMyOrders,
    buyOrderItem,
    getBuyerOrderItemDetails,
    getSellerOrderItemDetails,
    getOrderItemsForMyOrders,
    getSellerOrderSummary,
    getSellerOrdersSummary,
    updateOrderStatus,
    getAreaAvailableForUser,
    timeExtendRequest,
    approveTimeExtendRequest,
    viewOrder,
    deleteOrderItem,
    showBankAccountInformation,
    fetchUserStats,
    revertOrder,
    adminGetOrders,
    adminGetOrderItems,
    requestAreaUnlock,
    getAllRequests,
    getUserProjectUnlockedArea,
    changeRequestStatus,
    adminDeleteOrderItem,
    getDealReceiptData,
    getAdminMarketplaceSummary,
    markInactive,
    markActive,
    getAdminMarketplaceProjectSummary,
    getDisputes,
    getServiceCharges,
    approveServiceCharges,
    getUserAreaSummary,
    search,
    getOrderDetail,
    bankShareBitUpdate,
    getUserAvailableAreaAdmin,
    checkshowBankStatus,
    getToken,
    getDealProperty,
    getDealDetail
};