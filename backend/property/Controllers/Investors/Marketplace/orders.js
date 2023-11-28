const core = require('core');
const { ERROR_MESSAGES, DEAl_CHANGE_ENUMS } = require('../../../resources/constants');
const { anotherPostReceipt } = require('../../../services/shared/receipt');
const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const emailUtils = require('../../../utils/email');
const moment = require("moment");
const { socketService } = require('../../../utils/socket.service');
const { sendNotification } = require('../../../utils/fcm.util');
const investorsdb = require('../../../Models/Admins/Investors/investors');
const { getBuyerOrderItemDetails } = require('core/dal/marketplace/ordersdb');
const fcmService = require('../../../services/fcm/fcm.service');
const { notificationModel } = require("core/dto/requests/notification.model");
const { notificationService } = require('../../../services/notification/notificationCenter');
const { logActivity } = require('../../../services/shared/activity-logger');
const ActionCategory = require('../../../resources/enum-Action-Category');
const ActivityEvent = require('../../../resources/enum-ActivityLog-event');
// require('dotenv').config()

/*
Get property Details
*/
const GetProperties = async function (req, res, next) {
    const {category=null} = req.query;
    let resp = new core.responseObject();
    let id = req.decoded && req.decoded.id ? req.decoded.id : 0;
    // let category = req.params && req.params.category ? req.params.category : 'development';
    return await core.propertyDB.getProperties(id, category)
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

/*
Get All deals / Listings for marketplace main page 
*/

const GetDeals = async function (req, res, next) {
  
    const { id=0} = req.query;
    let resp = new core.responseObject();
    return await core.ordersDB.getDeals(id)
        .then(function (result) {
            if (result.success) {
                resp.setSuccess('deals fetched');
                resp.data = result.data;
                res.status(200).json(resp);
            } else {
                resp.setError(result.message.toString(), "DEALS_NOT_FETCHED")
                res.status(200).json(resp);
            }
        })
        .catch(function (error) {
            resp.setError(error.toString(), "DEALS_NOT_FETCHED")
            res.status(200).json(resp);
        })
}

/*
Get All orders / Listings for marketplace main page 
*/
const GetOrders = async function (req, res, next) {
    const { id=0, propertyCat=null} = req.query;
    let resp = new core.responseObject();
    return await core.ordersDB.getOrders(id, false, propertyCat)
        .then(function (result) {
            if (result.success) {
                resp.setSuccess('orders fetched');
                resp.data = result.data;
                res.status(200).json(resp);
            } else {
                resp.setError(result.message.toString(), "ORDERS_NOT_FETCHED")
                res.status(200).json(resp);
            }
        })
        .catch(function (error) {
            resp.setError(error.toString(), "ORDERS_NOT_FETCHED")
            res.status(200).json(resp);
        })
}

/*
Main Order Data for seller
*/
const GetSellOrdersByUser = async function (req, res, next) {
    let resp = new core.responseObject();
    let id = req.query.id ? req.query.id : (req.decoded ? req.decoded.id : 0);
    if (id && id > 0) {
        // const status = req.query && req.query.status ? req.query.status : '';
        const {status='', propertyCat=''} = req.query;
        
        return await core.ordersDB.getMyOrders(id, status, 'sell', propertyCat)
            .then(function (result) {
                if (result.success) {
                    resp.setSuccess('my orders fetched');
                    resp.data = result.data;
                    res.status(200).json(resp);
                     
                    if(parseInt(req.query.id)){
                        logActivity(
                            {
                                    logName: ActionCategory.MARKETPLACE,
                                    description: "Viewed profile of "+req.decoded.legalName,
                                    subjectID: parseInt(req.query.id),
                                    subjectType: "orderItems.sellerID",
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
                    }
                    
                } else {
                    resp.setError(result.message.toString(), "MY_ORDERS_NOT_FETCHED")
                    res.status(200).json(resp);
                }
            })
            .catch(function (error) {
                resp.setError(error.toString(), "MY_ORDERS_NOT_FETCHED")
                res.status(200).json(resp);
            })
    } else {
        resp.setError("unauthorized", "MY_ORDERS_NOT_FETCHED")
        res.status(200).json(resp);
    }

}

/*
Order Items (buy requests against an Order) Data for seller
*/
const GetBuyRequestBySellerOrder = async function (req, res, next) {
    let resp = new core.responseObject();
    if (req.decoded && req.decoded.id) {
        const status = req.query && req.query.status ? req.query.status : '';
        const orderID = req.query && req.query.id ? req.query.id : '';
        if (!Number(orderID)) {
            resp.setError("Somethign went wrong", "MY_ORDERS_NOT_FETCHED")
            res.status(403).json(resp);
        }
        return await core.ordersDB.getOrderItemsForMyOrders(req.decoded.id, orderID, status)
            .then(function (result) {
                if (result.success) {
                    resp.setSuccess('my orders fetched');
                    resp.data = result.data;
                    res.status(200).json(resp);
                } else {
                    resp.setError(result.message.toString(), "MY_ORDERS_NOT_FETCHED")
                    res.status(200).json(resp);
                }
            })
            .catch(function (error) {
                resp.setError(error.toString(), "MY_ORDERS_NOT_FETCHED")
                res.status(200).json(resp);
            })
    } else {
        resp.setError("unauthorized", "MY_ORDERS_NOT_FETCHED")
        res.status(200).json(resp);
    }

}

/*
Order Items (buy requests against an Order) Data for buyer
*/
const GetBuyRequestByUser = async function (req, res, next) {
    let resp = new core.responseObject();
    if (req.decoded && req.decoded.id) {
        const {status='', propertyCat=''} = req.query;
        return await core.ordersDB.getMyOrders(req.decoded.id, status, 'buy', propertyCat)
            .then(function (result) {
                if (result.success) {
                    resp.setSuccess('my orders fetched');
                    resp.data = result.data;
                    res.status(200).json(resp);
                } else {
                    resp.setError(result.message.toString(), "MY_ORDERS_NOT_FETCHED")
                    res.status(200).json(resp);
                }
            })
            .catch(function (error) {
                resp.setError(error.toString(), "MY_ORDERS_NOT_FETCHED")
                res.status(200).json(resp);
            })
    } else {
        resp.setError("unauthorized", "MY_ORDERS_NOT_FETCHED")
        res.status(200).json(resp);
    }

}

/*
Get Order Data by ID
*/
const GetOrder = async function (req, res, next) {
    let resp = new core.responseObject();
    let id = req.query.id ? req.query.id : 0;
    if (id > 0) {
        return await core.ordersDB.getOrder(req.query.id)
            .then(function (result) {
                if (result.success) {
                    resp.setSuccess('my orders fetched');
                    resp.data = result.data;
                    res.status(200).json(resp);
                } else {
                    resp.setError(result.message.toString(), "MY_ORDERS_NOT_FETCHED")
                    res.status(200).json(resp);
                }
            })
            .catch(function (error) {
                resp.setError(error.toString(), "ORDER_NOT_FETCHED")
                res.status(200).json(resp);
                //next(err);
            })
    } else {
        resp.setError("Not allowed to perform this action", "ORDER_NOT_FETCHED");
        res.status(200).json(resp);
    }

}

/*
Sell area on marketplace
*/
const createOrder = async function (req, res, next) {
    let resp = new core.responseObject();
    try {

        _data = req.body;
        _data["Id"] = 0;
        _data["sellerID"] = req.decoded.id;
        let sellerDetail = await core.userDB.getUserById(req.decoded.id);
        _order = new core.RequestModels.OrderRequest.createOrderRequest(_data);
        const errors = await _order.validateRequest();
        if(errors.length>0){
            resp.setError('Invalid order request.', 'ERROR_VALIDATING_ORDER')
            resp.data = errors;
            res.status(200).json(resp);
            return ;
        }
        _orderValaidation = _order.validateCreateRequest();

        if (_orderValaidation && !_orderValaidation.success) {

            resp.setError(_orderValaidation.message, _orderValaidation.errorCocde)
            res.status(200).json(resp);
            return;

        } else {
            _order.serviceCharges = await _order.calculateServiceCharges();
            let _requestObj = {
                "order": _order,
                "paymentMethods": _data.paymentMethods
            }

            return await core.ordersDB.saveOrder(_requestObj).then(result => {
                console.log('resultv  ', result);
                if (result.success) {
                    resp.setSuccess('order save successfully');
                    resp.data = result.data;
                    result.data = result.data[0];
                    result.data.sellerDetail = sellerDetail;
                    try{
                        logActivity(
                        {
                            logName: ActionCategory.MARKETPLACE,
                            description: "Listed area on DAO Listing in "+result.data.propertyName+" containing "+result.data.areaToSell+" sq. ft.",
                            subjectID: result.data.id,
                            subjectType: "orders",
                            event: ActivityEvent.CREATED,
                            causerID: req.decoded.id,
                            causerType: "users",
                            properties: {
                                attributes:{
                                    dispID: result.data.id,
                                    area:result.data.areaLeft,
                                    pricePerSqFt: result.data.pricePerSqFt,
                                    propertyCategory: result.data.propertyCategory,
                                    propertyID: result.data.propertyID
                                },
                                old: null
                            },
                            source: null,
                            metadata: null
                        }
                        ,req)
                    }catch(error){
                        console.log(error)
                    }
                    notificationService.marketplaceOrderPlaced({to:req.decoded.id,from:req.decoded.id,area:_data.areaToSell,propertyName:result.data.propertyName,orderID:result.data.id})
                    fcmService.createOrderNotification(result.data.propertyID,req.decoded, _data.areaToSell, result.data.propertySymbol)
                    emailUtils.marketPlaceSellerOrderNotification(result.data);
                    res.status(200).json(resp);
                    return res.status(201).json({error:true,message: "Order created successfully",data:''});
                } else {
                    resp.setError('could not save ordercntroler', 'ERROR_SAVING_ORDER')
                    res.status(200).json(resp);
                    return;
                }
            })

        }

    } catch (e) {
        resp.setError(e.toString(), 'ERROR_SAVING_ORDER')
        res.status(400).json(resp);
        return;
    }
}

/*
Survey to collect data for why investor is selling
*/
const marketplaceWhySellingSurvey = async function (req, res, next) {
    let resp = new core.responseObject();
    let whySellingSurveyRequest = new core.RequestModels.whySellingSurveyRequest.whySellingSurveyRequest(req.body, req.decoded.id);
    return await core.ordersDB.saveWhySellSurvey(whySellingSurveyRequest)
        .then(function (result) {
            if (result.success) {
                resp.setSuccess('survey data saved');
                resp.data = result.data;
                res.status(200).json(resp);
            } else {
                resp.setError(error.toString(), "SURVEY_DATA_NOT_SAVED")
                res.status(200).json(resp);
            }
        })
        .catch(function (error) {
            resp.setError(error.toString(), "SURVEY_DATA_NOT_SAVED")
            res.status(200).json(resp);
            //next(err);
        })
}

/*
Check if user (seller/buyer) is a verified user
*/
const marketplaceEligibility = async function (req, res, next) {

    let resp = new core.responseObject();
    id = req.query.id ? req.query.id : req.decoded.id;
    try {
        let result = await core.ordersDB.marketplaceEligibility(id);
        if (result.success) {
            resp.setSuccess(result.message);
            resp.data = result.data;
            res.status(200).json(resp);
        } else {
            resp.setError(result.message.toString(), "ELIGITY_NOT_FETCHED")
            res.status(200).json(resp);
        }
    } catch (ex) {
        resp.setError(ex.toString(), "ELIGITY_NOT_FETCHED")
        res.status(200).json(resp);
    }
}

/*
Buy Request for an order - Order Item
*/
const createOrdeItem = async function (req, res, next) {
    try {
        _data = req.body;
        _data["buyerID"] = req.decoded.id;
        let _orderItem = new core.RequestModels.OrderItemRequest.orderItemRequest(_data);
        /* check if fields have values */
        if (_orderItem.validateFields().success == false) {
            return res.Error("All fields are required.");
        }
        const _order = await core.ordersDB.getOrder(_orderItem.orderID);
        if (_order.success == false || !_order.data) {
            return res.Error("Something went wrong.");
        }
        _order.data = _order.data[0];
        if (_order.data.areaToList < _orderItem.areaPurchased) {
            return res.Error("Invalid request.");
        }
         
        _orderItem.subTotal = parseFloat(_order.data.pricePerSqFt) * parseFloat(_orderItem.areaPurchased);
        _orderItem.tax = _order.data.salesTax;
        _orderItem.serviceCharges = await _orderItem.calculateServiceCharges(_order.data.serviceChargesMethod,_order.data.propertyConfig, _order.data.pricePerSqFt, _order.data.areaToSell, 'buyer');
        _orderItem.Total = parseFloat(_orderItem.subTotal) + parseFloat(_orderItem.tax) + parseFloat(_orderItem.serviceCharges);
        _orderItem.tokenAmount = _order.data.tokenAmount ? _order.data.tokenAmount : 0;
        _orderItem.dueDate = moment(new Date()).add(7,'days').format("MMM D, YYYY");
        let buyerDetail = await core.userDB.userDetails(req.decoded.id);
        let sellerDetail = await core.userDB.userDetails(_order.data.seller.id);
        const result = await core.ordersDB.buyOrderItem(_orderItem);
            
        _orderItem.buyerDetail = buyerDetail? buyerDetail.data : null ;
        _orderItem.sellerDetail = sellerDetail? sellerDetail.data : null;
        _orderItem.totalareaSqft = _order.data.areaToSell;
        _orderItem.projectname = _order.data.propertyName;
        
      
        if (result.success == true) {
            let orderItemID=await core.db.sequelize.query("select last_insert_id()");
             
            _orderItem.dealId = result.data;
            emailUtils.marketPlaceBidOrderNotification(_orderItem);
            emailUtils.marketplaceSellerBidNotificationEmail(_orderItem);
             
            notificationService.bidRecievedSeller({to:_order.data.seller.id,from:req.decoded.id,propertyName:_order.data.propertyName,area:_orderItem.areaPurchased,dealId:_orderItem.dealId});
            notificationService.bidRecievedBuyer({from:_order.data.seller.id,to:req.decoded.id,propertyName:_order.data.propertyName,area:_orderItem.areaPurchased,dealId:_orderItem.dealId});
            fcmService.dealCreated(result.data);
             
            //const to_token = await core.ordersDB.getToken(_order.data.seller.id);
            //sendNotification("Deal# "+result.data+"","Deal has been created. Click to view",process.env.portalurl+"/marketplace/order_requests/"+result.data+"/seller/",[to_token]).then(x=>{});
            logActivity(
                {
                        logName: ActionCategory.MARKETPLACE,
                        description: "Purchased area of "+_orderItem.areaPurchased+" sq. ft. from "+_orderItem.sellerDetail.legalName+" in "+_orderItem.projectname+" containing "+_orderItem.totalareaSqft+" sq. ft. ",
                        subjectID: orderItemID[0][0]["last_insert_id()"],
                        subjectType: "orderItems",
                        event: ActivityEvent.ADDED,
                        causerID: req.decoded.id,
                        causerType: "users",
                        properties: {
                            attributes: { 
                                dispID:orderItemID[0][0]["last_insert_id()"],
                                orderID:req.body.orderID,
                                areaPurchased:req.body.areaPurchased,
                                buyerID:req.body.buyerID
                            },
                            old: null
                        },
                        source: null,
                        metadata:null
                    }
                    ,req)
                 
            return res.Success(result.data, "Bought.");
        }
        return res.Error(result.message, result.errorCode);
    } catch (e) {
        res.Error(e.toString(), 'ERROR_SAVING_ORDER_ITEM')
    }
}

/*
Get Order Item (buy request for an order) Details for Buyer
*/
const GetOrderItemDetail = function (req, res, next) {
    let resp = new core.responseObject();
    if (req.params && req.params.id) {
        var orderid = req.params.id;
        let buyer_id = req.decoded && req.decoded.id ? req.decoded.id : 0;
        core.ordersDB.getBuyerOrderItemDetails(orderid, buyer_id)
            .then(function (result) {
                if (result.success) {
                    resp.setSuccess('order details fetched');
                    resp.data = result.data;
                    resp.data.timeLeftToPay = `${Math.round(moment(resp.data.dueDate).diff(moment(), 'days', true))} days left (${(resp.data && resp.data.dueDate) ? Math.round(moment(resp.data.dueDate).diff(moment(), 'hours', true)) : ''} hours)`;
                    res.status(200).json(resp);
                } else if (result.errorCocde == 'ORDER_DETAILS_NOT_AUTHORIZED') {
                    resp.setError(result.message.toString(), result.errorCocde)
                    res.status(403).json(resp);
                } else {
                    resp.setError(result.message.toString(), "ORDERS_DETAILS_NOT_FETCHED")
                    res.status(200).json(resp);
                }
            })
            .catch(function (error) {
                resp.setError(error.toString(), "ORDERS_DETAILS_NOT_FETCHED")
                res.status(200).json(resp);
            })
    }
}
const bankShareBitUpdate = function (req, res, next) {
    let resp = new core.responseObject();
    if (req.params && req.params.id) {
        var orderid = req.params.id;
        let buyer_id = req.decoded && req.decoded.id ? req.decoded.id : 0;
        core.ordersDB.bankShareBitUpdate(orderid, buyer_id)
            .then(function (result) {
                if (result.success) {
                    resp.setSuccess('Bit updated successfully');
                    resp.data = result.data;
                    res.status(200).json(resp);
                } else if (result.errorCocde == 'ORDER_DETAILS_NOT_AUTHORIZED') {
                    resp.setError(result.message.toString(), result.errorCocde)
                    res.status(403).json(resp);
                } else {
                    resp.setError(result.message.toString(), "ORDERS_DETAILS_NOT_FETCHED")
                    res.status(200).json(resp);
                }
            })
            .catch(function (error) {
                resp.setError(error.toString(), "ORDERS_DETAILS_NOT_FETCHED")
                res.status(200).json(resp);
            })
    }
}

/*
Get Order Item (buy request for an order) Details for Seller
*/
const getSellerOrderItemDetails = function (req, res, next) {
    let resp = new core.responseObject();
    if (req.params && req.params.id) {
        var orderid = req.params.id;
        let buyer_id = req.decoded && req.decoded.id ? req.decoded.id : 0;
        core.ordersDB.getSellerOrderItemDetails(orderid, buyer_id)
            .then(function (result) {
                if (result.success) {
                    resp.setSuccess('order details fetched');
                    resp.data = result.data;
                    resp.data.timeLeftToPay = `${Math.round(moment(resp.data.dueDate).diff(moment(), 'days', true))} days left (${(resp.data && resp.data.dueDate) ?  Math.round(moment(resp.data.dueDate).diff(moment(), 'hours', true)) : ''} hours)`;
                    res.status(200).json(resp);
                } else if (result.errorCocde == 'ORDER_DETAILS_NOT_AUTHORIZED') {
                    resp.setError(result.message.toString(), result.errorCocde)
                    res.status(403).json(resp);
                } else {
                    resp.setError(result.message.toString(), "ORDERS_DETAILS_NOT_FETCHED")
                    res.status(403).json(resp);
                }
            })
            .catch(function (error) {
                console.log(error);
                resp.setError(error.toString(), "ORDERS_DETAILS_NOT_FETCHED")
                res.status(200).json(resp);
            })
    }
}

/*
Sell area on marketplace
*/
const saveOrderPayment = async function (req, res, next) {

    let err = {};
    let resp = new core.responseObject();
    try {
        let _emailItem={};
        let sellerId;
       
        if (req.body && req.params && req.params.id && req.params.id > 0) {
            _data = req.body;
            _data["parentID"] = req.params.id;
            let id = req.decoded ? req.decoded.id : 0;
            _payment = new core.RequestModels.saveOrderPaymentRequest.saveOrderPaymentRequest(_data);
            let result = await core.paymentDB.saveOrderPayment(_payment,id);
            let propertyDetail = await core.ordersDB.getDealPropertyDetail(parseInt(req.params.id));
            let propertyData = await core.propertyDB.getPropertyInformation(propertyDetail.propertyId);
            console.log("Result",result);
            if(result.success){
                console.log("result",result);
                sellerId = result.data.seller? result.data.seller.id : result.data.sellerID; 
                let sellerDetail = await core.userDB.userDetails(sellerId);
                _emailItem.sellerDetail = sellerDetail? sellerDetail.data : null ;
                _emailItem.orderId = result.data.id;
                _emailItem.dealId = req.params.id;
                _emailItem.paymentAmount = req.body.amount;
                _emailItem.paymentType = req.body.type;
                _emailItem.paidDate = req.body.paidDate;
                if(_payment["type"] !== core.enums.orderPaymentTypeEnum.servicecharges)
                    emailUtils.marketplacePaymentReceivedNotification(_emailItem);
                resp.setSuccess(result.message ? result.message : 'order save successfully');
                resp.data = result.data;
                socketService.dealChanged(_data["parentID"],{
                    config:{
                        type:DEAl_CHANGE_ENUMS.AMOUNT_PAID
                    },
                    data:result.data
                })
                if(_payment["type"]== core.enums.orderPaymentTypeEnum.servicecharges){
                   
                    let tokens = await investorsdb.getMarketplaceUsersDeviceToken();
                    if(tokens && tokens.length>0){
                        const property  = await core.ordersDB.getDealProperty(_data["parentID"]);
                        sendNotification("Deal# "+_data["parentID"],"Service charges for deal #"+_data["parentID"]+" recieved. Click here to respond",process.env.adminurl+"admin/marketplace/orderListing/"+property+"?tab=3",tokens.map(x=>x.device_token));
                    }
                    fcmService.payServiceChargesNotification(req.decoded ,req.params.id , req.body.amount, propertyData )
                    emailUtils.marketplace_service_charges_paid_notification_email(_emailItem);
                }
                else if(_payment["type"]== core.enums.orderPaymentTypeEnum.other){
                    fcmService.payRemainingAmountNotification(req.decoded ,req.params.id , req.body.amount, propertyData)
                }
                else{
                    notificationService.marketPlacePaymentDeposited({to:sellerId,from:req.decoded.id,dealID:_data["parentID"],amount:req.body.amount});
                    fcmService.paymentRecieved(req.params.id,_payment.amount);
                    fcmService.payTokenAmountNotification(req.decoded ,req.params.id , req.body.amount, propertyData)
                }
                let paymentID=0;
                if(result.data && result.data.payments && result.data.payments.length)
                {
                    paymentID=result.data.payments[result.data.payments.length-1]["id"]
                } 
                try{
                    logActivity(
                        {
                            logName: ActionCategory.MARKETPLACE,
                            description: "Payed "+(_payment["type"]=='token' ? "Security Amount": _payment["type"]=='other' ? "Remaining Amount" : "DAO Charges")+" of "+(_payment["type"]=='token' ? _payment.amount : _payment["type"]=='other' ?  _payment.amount : _payment.amount )+" PKR against deal of "+result.data.areaPurchased+" sq. ft. to "+(result.data.seller.nickName != null ? (result.data.seller.nickName) : (result.data.seller.firstName+" "+result.data.seller.lastName) )+" in "+result.data.property.name,
                            subjectID: paymentID,
                            subjectType: "orderPayments",
                            event: ActivityEvent.PAYED,
                            causerID: req.decoded.id,
                            causerType: "users",
                            properties: {
                                attributes: {
                                    dispID: _data.parentID,
                                    amount: _data.amount,
                                    orderItemID: _data.parentID,
                                    typeOfPayment: _data.type,
                                    paymentMethod: _data.paymentMethod
                                },
                                old: null
                            },
                            source: null,
                            metadata:null
                        }
                        ,req);
                    }catch(error){
                        console.log(error)
                    }
                    res.status(200).json(resp);
                return;
            } else {
                
                if (result.errorCode == 'NOT_AUTHORIZED') {
                    resp.setError(result.message ? result.message : 'could not save payment', 'NOT_AUTHORIZED')
                    res.status(403).json(resp);
                    return;
                } else {
                    resp.setError(result.message ? result.message : 'could not save payment', 'ERROR_SAVING_ORDER')
                    res.status(200).json(resp);
                    return;
                }
            }
           
            // return  core.paymentDB.saveOrderPayment(_payment, id).then(result => {
            //     if (result.success) {
            //         console.log("result",result);
            //         sellerId = result.data.sellerId; 
                 
            //         _emailItem.sellerDetail = sellerDetail? sellerDetail.data : null ;
            //         _emailItem.orderId = result.data.id;
            //         _emailItem.paymentAmount = req.body.amount;
            //         _emailItem.paymentType = req.body.type;
            //         _emailItem.paidDate = req.body.paidDate;
            //         emailUtils.marketplacePaymentReceivedNotification(_emailItem);
            //         resp.setSuccess(result.message ? result.message : 'order save successfully');
            //         resp.data = result.data;
            //         res.status(200).json(resp);
            //         return;
            //     } else {
            //         if (result.errorCode == 'NOT_AUTHORIZED') {
            //             resp.setError(result.message ? result.message : 'could not save payment', 'NOT_AUTHORIZED')
            //             res.status(403).json(resp);
            //             return;
            //         } else {
            //             resp.setError(result.message ? result.message : 'could not save payment', 'ERROR_SAVING_ORDER')
            //             res.status(200).json(resp);
            //             return;
            //         }

               // }
           // })
        } else {
            resp.setError('not allowed to perform this action', 'UNAUTHORIZED')
            res.status(403).json(resp);
            return;
        }

    } catch (e) {
        console.log('excption', e);
        resp.setError(e.toString(), 'ERROR_SAVING_ORDER')
        res.status(400).json(resp);
        return;
    }
}

/*
Accept/Decline payment - for seller / Admin(approve service charges payment)
*/
const updateOrderPaymentStatus = async function (req, res, next) {
    let err = {};
    let resp = new core.responseObject();
    try {

        if (req.body && req.params && req.params.id && req.params.id > 0) {
            _data = req.body;
            _data["parentID"] = req.params.id;
            _data["id"] = req.params.paymentid;
            _data["status"] = req.params.status;
            let userID = req.decoded ? req.decoded.id : 0;
            if (_data["parentID"] && _data["id"] && _data["status"] && userID > 0) {
                _payment = new core.RequestModels.saveOrderPaymentRequest.saveOrderPaymentRequest(_data);
                console.log("Payment",_payment);
                let result = await core.paymentDB.updateOrderPaymentStatus(_payment,userID);

                if(result.success){
                     
                    let _buyerDetail,_sellerDetail;
                    if(req.params.status === core.enums.orderPaymentStatusEnum.approved){
                        if(result.data&&result.data.payments&&result.data.payments.length>0){
                            let paymentss = result.data.payments.filter(x=>x.id == _data["id"]);
                            if(paymentss&&paymentss.length>0){
                                fcmService.paymentApproved(_data["parentID"],paymentss[0].amount);
                                notificationService.paymentAcknowledged({to:result.data.buyer.id,from:req.decoded.id,amount:paymentss[0].amount,area:0,propertyName:"",dealID:_data["parentID"]})
                            }
                        }
                    _buyerDetail = await core.userDB.userDetails(result.data.buyer.id);
                    _sellerDetail = await core.userDB.userDetails(userID);
                    let _emailRequest = result.data;
                    _emailRequest.buyer = _buyerDetail.data;
                    _emailRequest.seller = _sellerDetail.data;
                    _emailRequest.id = _data["parentID"];
                    emailUtils.marketplacePaymentApprovedNotification(_emailRequest);
              
                    if(result.data.paymentPending == 0 && result.data.serviceCharges.status == core.enums.orderPaymentStatusEnum.approved)
                        emailUtils.marketplaceSellerAreaReleaseNotification(_emailRequest);
                    }
                    resp.setSuccess(result.message ? result.message : 'payment updated successfully');
                    resp.data = result.data;
                    socketService.dealChanged(_data["parentID"],{
                        config:{
                            type:DEAl_CHANGE_ENUMS.AMOUNT_ACCEPTED
                        },
                        data:result.data
                    })

                    logActivity(
                        {
                                logName: ActionCategory.MARKETPLACE,
                                description: "Marked as recieved "+(_payment["type"]=='token' ? "security amount": _payment["type"]=='servicecharges' ? "DAO Charges" : "remaining amount")+" of "+(_payment["type"]=='token' ? result.data.amountRecievedTillDate : _payment["type"]=='other' ?  result.data.amountRecievedTillDate : result.data.amountRecievedTillDate )+" PKR against deal of "+result.data.areaPurchased+" sq. ft. to "+(_buyerDetail.data.legalName != null ? (_buyerDetail.data.legalName) : (_buyerDetail.data.nickName) )+" in "+result.data.property.name,
                                subjectID: parseInt(_payment.id),
                                subjectType: "orderPayments",
                                event: ActivityEvent.APPROVED,
                                causerID: req.decoded.id,
                                causerType: "users",
                                properties: {
                                    attributes: {
                                        dispID:parseInt(_payment.parentID),
                                        orderItemID:parseInt(_payment.parentID),
                                        buyerName: _buyerDetail.data.legalName,
                                        buyerID: _buyerDetail.data.id,
                                        sellerName: _sellerDetail.data.legalName,
                                        sellerID: _sellerDetail.data.id,


                                    },
                                    old: null
                                },
                                source: null,
                                metadata:null
                            }
                            ,req)
                    res.status(200).json(resp);
                    return;
                } else {
                    resp.setError(result.message ? result.message : 'could not update payment', 'ERROR_SAVING_ORDER')
                    res.status(200).json(resp);
                    return;
                }

                // return await core.paymentDB.updateOrderPaymentStatus(_payment, userID).then(result => {
                //     console.log(result);
                //     if (result.success) {
                //         resp.setSuccess(result.message ? result.message : 'payment updated successfully');
                //         resp.data = result.data;
                //         res.status(200).json(resp);
                //         return;
                //     } else {
                //         resp.setError(result.message ? result.message : 'could not update payment', 'ERROR_SAVING_ORDER')
                //         res.status(200).json(resp);
                //         return;
                //     }
                // })
            } else {
                resp.setError('could not update payment', 'ERROR_SAVING_ORDER')
                res.status(200).json(resp);
            }
        } else {
            resp.setError('not allowed to perform this action', 'UNAUTHORIZED')
            res.status(403).json(resp);
            return;
        }

    } catch (e) {
        resp.setError(e.toString(), 'ERROR_SAVING_ORDER')
        res.status(400).json(resp);
        return;
    }
}

/*
Accept/Decline payment - for seller / Admin(approve service charges payment)
*/
const cancelOrderItem = async function (req, res, next) {
    let err = {};
    let resp = new core.responseObject();
    try {
        if (req.body && req.params && req.params.id && req.params.id > 0) {
            const { reasons=[] } = req.body;
            id = req.params.id;
            let userID = req.decoded ? req.decoded.id : 0;
            let dealInfo = await core.ordersDB.getDealDetail(id);
            return await core.ordersDB.deleteOrderItem(id, userID, reasons).then(result => {
                if (result.success) {
                  
                    logActivity(
                        {
                                logName: ActionCategory.MARKETPLACE,
                                description: "Cancelled a deal on DAO Listings against "+dealInfo.areaToSell+" sq. ft. to "+req.decoded.legalName+" in "+dealInfo.propertyName,
                                subjectID:  parseInt(id),
                                subjectType: "orderItems",
                                event: ActivityEvent.CANCELLED,
                                causerID: userID,
                                causerType: "users",
                                properties: {
                                    attributes: {
                                        dispID:parseInt(id)
                                    },
                                    old: null
                                },
                                source: null,
                                metadata:null
                            }
                            ,req)
                    resp.setSuccess(result.message ? result.message : 'payment updated successfully');
                    resp.data = result.data;
                    res.status(200).json(resp);
                    return;
                } else {
                    resp.setError(result.message ? result.message : 'could not update payment', 'ERROR_SAVING_ORDER')
                    res.status(200).json(resp);
                    return;
                }
            })
        } else {
            resp.setError('not allowed to perform this action', 'UNAUTHORIZED')
            res.status(403).json(resp);
            return;
        }

    } catch (e) {
        resp.setError(e.toString(), 'ERROR_SAVING_ORDER')
        res.status(400).json(resp);
        return;
    }
}

/*
Peer to Peer transfer
*/
const peerToPeer = async function (req, res, next) {
    let resp = new core.responseObject();
    try {

        _data = req.body;
        _data["Status"] = "active";
        _data["Id"] = 0;
        _data["sellerID"] = req.decoded.id;
        _order = new core.RequestModels.OrderRequest.createOrderRequest(_data);
        _orderValaidation = _order.validateCreateRequest();

        if (_orderValaidation && !_orderValaidation.success) {

            resp.setError(_orderValaidation.message, _orderValaidation.errorCocde)
            res.status(200).json(resp);
            return;

        } else {

            let _requestObj = {
                "order": _order,
                "paymentMethods": _data.paymentMethods
            }

            return await core.ordersDB.saveOrder(_requestObj).then(result => {
                console.log('resultv  ', result);
                if (result.success) {
                    resp.setSuccess('order save successfully');
                    resp.data = result.data;
                    res.status(200).json(resp);
                    return;
                } else {
                    resp.setError('could not save ordercntroler', 'ERROR_SAVING_ORDER')
                    res.status(200).json(resp);
                    return;
                }
            })

        }

    } catch (e) {
        resp.setError(e.toString(), 'ERROR_SAVING_ORDER')
        res.status(400).json(resp);
        return;
    }
}

/*
time extension request by buyer  
*/
const timeExtendRequest = async function (req, res, next) {
    let resp = new core.responseObject();
    try {

        let userID = req.decoded ? req.decoded.id : 0;
        let id = req.params && req.params.id ? req.params.id : 0;
        return await core.ordersDB.timeExtendRequest(id, userID).then(result => {

            if (result.success) {
                resp.setSuccess(result.message);
                //resp.data = result.data;
                res.status(200).json(resp);
                return;
            } else {
                resp.setError('could not save ordercntroler', 'ERROR_SAVING_ORDER')
                res.status(200).json(resp);
                return;
            }
        })

    } catch (e) {
        resp.setError(e.toString(), 'ERROR_SAVING_ORDER')
        res.status(400).json(resp);
        return;
    }
}

/*
time extension request by buyer  
*/
const approveTimeExtendRequest = async function (req, res, next) {
    let resp = new core.responseObject();
    try {

        let userID = req.decoded ? req.decoded.id : 0;
        let id = req.params && req.params.id ? req.params.id : 0;
        return await core.ordersDB.approveTimeExtendRequest(req.body, id, userID).then(result => {
            if (result.success) {
                resp.setSuccess(result.message);
                resp.data = result.data;
                res.status(200).json(resp);
                return;
            } else {
                resp.setError('could not save ordercntroler', 'ERROR_SAVING_ORDER')
                res.status(200).json(resp);
                return;
            }
        })

    } catch (e) {
        resp.setError(e.toString(), 'ERROR_SAVING_ORDER')
        res.status(400).json(resp);
        return;
    }
}

const fetchOrderItemChat = async function (req, res, next) {
    let err = {};
    let _data = {};
    let resp = new core.responseObject();
    try {
        console.log("Request param", req.params);

        _data.orderItemId = req.params.id;
        _data.userId = req.decoded.id;
        let chatResponse = await core.chatDB.fetchChat(_data);
        res.status(200).json(chatResponse);


    } catch (e) {
        console.log(e);
        resp.setError(e.toString(), 'ERROR_FETCHING_CHAT')
        res.status(400).json(resp);
        return;
    }
}

const saveMessageService = async function (req, res, next) {
    let err = {};
    let _data = {};
    let resp = new core.responseObject();
    try {
        req.body.userId = req.decoded.id;
        let saveMessage = await core.chatDB.saveChatMessage(req.body);
        _data = req.body;
        let receiverDetail = await core.userDB.getUserById(req.body.to.id);
        _data.legalName = receiverDetail.legalName;
        _data.email = receiverDetail.email;
        emailUtils.marketplaceChatNotification(_data);
        const dealDetail = await core.ordersDB.getOrderDetail(_data.orderItemId);
        notificationService.chatMessage({to:req.body.to.id, from:req.body.userId ,area:0,propertyName:"",orderItemId:_data.orderItemId});
        if(dealDetail){
            logActivity(
            {
                logName: ActionCategory.MARKETPLACE,
                description: "Sent "+( saveMessage.data.dataValues.mediaId == null ? "message" : "attachments" )+" by "+(_data.from.name != null ? _data.from.nickName : _data.from.name )+" in chat against deal of "+dealDetail.areaPurchased+" sq. ft. to "+(_data.to.name != null ? _data.to.name : _data.to.nickName )+" in "+dealDetail.propertyName,
                subjectID: dealDetail.orderID,
                subjectType: "chat",
                event: ActivityEvent.SENT,
                causerID: _data.from.id,
                causerType: "users",
                properties: {
                    attributes: null,
                    old: null
                },
                source: null,
                metadata:null
            },req);
        }
        resp.setSuccess('order save successfully');
        res.status(200).json(resp);

    } catch (e) {
        console.log(e);
        resp.setError(e.toString(), 'ERROR_SAVING_CHAT')
        res.status(400).json(resp);
        return;
    }
}
const markMsgReadService = async function (req, res, next) {
    let err = {};
    let _data = {};
    let resp = new core.responseObject();
    try {
        req.body.userId = req.decoded.id;
        let saveMessage = await core.chatDB.markMsgRead(req.body);
        resp.setSuccess('order save successfully');
        res.status(200).json(resp);

    } catch (e) {
        console.log(e);
        resp.setError(e.toString(), 'ERROR_SAVING_CHAT')
        res.status(400).json(resp);
        return;
    }
}

const getSellerOrderSummary = async function (req, res, next) {
    try {
        const data = await core.ordersDB.getSellerOrderSummary(req.params.id);
        if (data.success)
        {
            try{
            logActivity(
                {
                    logName: ActionCategory.MARKETPLACE,
                    description: "Viewed the order of "+req.decoded.legalName+" in "+data.data.propertyName+" containing "+data.data.totalSqFt+" sq. ft. ",
                    subjectID: parseInt(req.params.id),
                    subjectType: "orders",
                    event: ActivityEvent.VIEWED,
                    causerID: req.decoded.id,
                    causerType: "users",
                    properties: {
                        attributes: {
                            dispID: parseInt(req.params.id),
                            areaToList: data.data.areaToList,
                            activeDeals: data.data.activeDeals,
                            totalSqFt: data.data.totalSqFt,
                            legalName: req.decoded.legalName,
                            phoneNumber: req.decoded.phoneNumber,
                            propertyName: data.data.propertyName,
                            orderStatus: data.data.orderStatus,
                            createdAt: data.data.createdAt
                        },
                        old: null
                    },
                    source: null,
                    metadata:null
                }
                ,req);
            }catch(error){
                console.log(error)
            }
            res.Success(data.data, "ORDER_SUMMARY_FETCHED");
            return res.status(201).json({error:true,message: "ORDER_SUMMARY_FETCHED",data:''});
        } 
        else
            res.Error("Error fetching order summary", 'ERROR_FETCHING_ORDER_SUMMARY');
    } catch (e) {
        res.Error(e.toString(), 'ERROR_FETCHING_ORDER_SUMMARY')
    }
}

const getSellerOrdersSummary = async function (req, res, next) {
    try {
        let seller_id = req.query.id ? req.query.id : (req.decoded && req.decoded.id ? req.decoded.id : 0);
        const data = await core.ordersDB.getSellerOrdersSummary(seller_id);
        if (data.success){
            res.Success(data.data, "ORDER_SUMMARY_FETCHED");
            try{
                logActivity(
                    {
                        logName: ActionCategory.MARKETPLACE,
                        description: "Viewed listing profile of "+data.data.nickName,
                        subjectID:  seller_id,
                        subjectType: "listing",
                        event: ActivityEvent.VIEWED,
                        causerID: req.decoded.id,
                        causerType: "users",
                        properties: {
                            attributes: { 
                                dispID: seller_id,
                                areaToSell: data.data.areaToSell,
                                sellerNickName: data.data.nickName,
                                sellerPhoneNumber: data.data.phoneNumber,
                                walletAddress: data.data.walletAddress
                            },
                            old: null
                        },
                        source: null,
                        metadata:null
                    },req)
            }catch(error){
                console.log(error)
            }
            return res.status(201).json({error:true,message: "Viewed Order Summary Saved",data:''});
        }
        else
            res.Error("Error fetching order summary", 'ERROR_FETCHING_ORDER_SUMMARY');
    } catch (e) {
        res.Error(e.toString(), 'ERROR_FETCHING_ORDER_SUMMARY')
    }
}


async function isOTPValid(phonenumber, code) {
    console.log("phonenumber", phonenumber, process.env.TWILIO_SERVICE_ID);
    const result = await twilio.verify.v2
    .services(process.env.TWILIO_SERVICE_ID)
    .verificationChecks
    .create({
        to: phonenumber,
        code,
    });
    return result.valid;
}

const updateOrderItemStatus = async function (req, res, next) {
    const { id, status } = req.params;
    const { otpCode='' } =  req.body;
    let userID = req.decoded && req.decoded.id ? req.decoded.id : 0;
    let err = {};
    let resp = new core.responseObject();
    try {
        const user  = await core.userDB.getUserById(userID);
        if( user ) {
            if ( await isOTPValid(user.phoneNumber, otpCode) ) {
                const data = await core.ordersDB.updateOrderStatus(id, status, userID, req.body);
                if (data.success) {
                 
                    let buyerDetail = await core.userDB.userDetails(data.data[0].buyerID);
                    let _emailRequest = data.data[0];
                    _emailRequest.buyer = buyerDetail.data;
                    buyerDetail.data.dealId = id;
                    emailUtils.marketPlaceFullPaymentApprovedNotification(_emailRequest);
                    user.dealId = id;
                    // if(data && data.data[0] && data.data[0].serviceChargesMethod !== core.enums.serviceChargesMethod.area)
                    //     emailUtils.marketPlaceSellerServiceChargesNotificationEmail(user);
                    switch (status) {
                        case 'completed':
                            emailUtils.marketplaceTransactionCompleteNotification(user,false);
                            emailUtils.marketplaceTransactionCompleteNotification(buyerDetail.data,true);
                            emailUtils.marketplace_review_notification_email(user,false);
                            emailUtils.marketplace_review_notification_email(buyerDetail.data,true);
                            fcmService.dealCompleted(id);
                            notificationService.releaseFinalArea({to:req.decoded.id,from:req.decoded.id,area:0,propertyName:"",dealId:id});
                           
                            
                            const dealDetail = await core.ordersDB.getOrderDetail(id);
                            if(dealDetail) {
                                notificationService.userReviewsReminder({
                                    area: dealDetail.areaPurchased,
                                    propertyName: dealDetail.propertyName,
                                    orderItemsID: id,
                                    userType: 'BUYER',
                                    to: dealDetail.buyerID,
                                    from: dealDetail.sellerID,
                                    fromName: dealDetail.sellerName
                                });
                                notificationService.userReviewsReminder({
                                    area: dealDetail.areaPurchased,
                                    propertyName: dealDetail.propertyName,
                                    orderItemsID: id,
                                    userType: 'SELLER',
                                    to: dealDetail.sellerID,
                                    from: dealDetail.buyerID,
                                    fromName: dealDetail.buyerName
                                });
                                logActivity(
                                    {
                                            logName: ActionCategory.MARKETPLACE,
                                            description: "Marked for final authentication against deal of "+dealDetail.areaPurchased+" sq. ft. to "+dealDetail.buyerName+" in "+dealDetail.propertyName,
                                            subjectID: parseInt(id),
                                            subjectType: "orderItems",
                                            event: ActivityEvent.APPROVED,
                                            causerID: req.decoded.id,
                                            causerType: "users",
                                            properties: {
                                                attributes: {
                                                    dispID: parseInt(id),
                                                    orderID: data.data[0].id,
                                                    area: dealDetail.areaPurchased,
                                                    buyerID: dealDetail.buyerID,
                                                    buyerName: dealDetail.buyerName,
                                                    propertyID: data.data[0]['propertyID'],
                                                    propertyName: dealDetail.propertyName,
                                                    sellerID: dealDetail.sellerID,
                                                    sellerName: dealDetail.sellerName
                                                },
                                                old: null
                                            },
                                            source: null,
                                            metadata:null
                                        }
                                        ,req);
                            }
                            
                            socketService.dealChanged(id, {
                                config: {
                                    type: DEAl_CHANGE_ENUMS.DEAl_COMPLETED
                                },
                                data: data.data
                            })
                            break;
                    }

                    resp.setSuccess(data.message);
                    resp.data = null;
                    res.status(200).json(resp);
                    return;
                } else {
                    if (data.errorCode = 'UNAUTHORIZED') {
                        resp.setError('try again.', data.errorCode)
                        res.status(403).json(resp);
                        return;
                    }
                    resp.setError('try again.', 'ERROR_CONFIRMING_ORDER_PAYMENTS')
                    res.status(500).json(resp);
                    return;
                }
            } else {
                resp.setError(ERROR_MESSAGES.OTP_INVALID, 'OTP_INVALID')
                res.status(200).json(resp);
                return;
            }
        } else {
            resp.setError(ERROR_MESSAGES.USER_NOT_FOUND, 'USER_NOT_FOUND')
            res.status(401).json(resp);
            return;
        }
    } catch (e) {
        console.log(e);
        resp.setError(e.toString(), 'ERROR_CONFIRMING_ORDER_PAYMENTS')
        res.status(400).json(resp);
        return;
    }
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
const getUsers = async function (req, res, next) {
    try {
        const item_id = req.params.item_id;
        if (!item_id) return res.Error("Item id is required.", "BAD_REQUEST")
        else {
            const result = await core.chatDB.getChatUsers(item_id);
            if (result.success == true) {
                res.Success(result.data, "SUCCESS");
            } else {
                res.Error(result.message, "DB_ERROR")
            }
        }
    } catch (e) {
        res.Error(e.toString(), "EXCEPTION")
    }
}
const updateDisputeStatus = async function (req, res, next) {
    const { id, status } = req.params;
    let userID = req.decoded && req.decoded.id ? req.decoded.id : 0;
    let dealInfo = await core.ordersDB.getDealDetail(id);
    let resp = new core.responseObject();
    try {
        const data = await core.disputeDB.updateDisputeStatus(id, status, userID, req.body);
        if (data.success) {
            resp.setSuccess(data.message);
            logActivity(
                {
                        logName: ActionCategory.MARKETPLACE,
                        description: ("Created a dispute against deal of "+dealInfo.areaToSell+" sq. ft. to "+req.decoded.legalName+" in "+dealInfo.propertyName),
                        subjectID: id,
                        subjectType: "orderItems",
                        event: ActivityEvent.CREATED,
                        causerID: userID,
                        causerType: "users",
                        properties: {
                            attributes: { 
                                    dispID: id
                            },
                            old: null
                        },
                        source: null,
                        metadata:null
                    }
                    ,req)
            resp.data = data.data;
            res.status(200).json(resp);
            return;
        } else {
            if (data.errorCode = 'UNAUTHORIZED') {
                resp.setError(data.message, data.errorCode)
                res.status(403).json(resp);
                return;
            }
            resp.setError(data.message, 'ERROR_CONFIRMING_ORDER_PAYMENTS')
            res.status(500).json(resp);
            return;
        }
    } catch (e) {
        resp.setError(e.toString(), 'ERROR_CONFIRMING_ORDER_PAYMENTS')
        res.status(400).json(resp);
        return;
    }
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
const viewOrder = async function (req, res, next) {
    try {
        const id = req.params.id;
        let userID = req.decoded && req.decoded.id ? req.decoded.id : 0;
        if (!id) return res.Error("Item id is required.", "BAD_REQUEST")
        else {
            const result = await core.ordersDB.viewOrder(id, userID);
            if (result.success == true) {
                res.Success(result.data, "SUCCESS");
            } else {
                res.Error(result.data, "DB_ERROR")
            }
        }
    } catch (e) {
        res.Error(e.toString(), "EXCEPTION")
    }
}

const showBankAccountInformation = async function (req, res, next) {
    try {
        const id = req.params.id;
        const action = req.params.action;
        if (!id || !action) return res.Error("Item id or action type is required.", "BAD_REQUEST")
        else {
            const statusFlag = await core.ordersDB.checkshowBankStatus(id, action);
            if(statusFlag && statusFlag.data && statusFlag.data.showBankAccounts=='allowed'){
                res.Success(statusFlag.data, "SUCCESS");
                return res;
            }

             
            const result = await core.ordersDB.showBankAccountInformation(id, action);
            let orderDetail = await core.ordersDB.getOrderDetail(id,req.decoded.id);
            if (result.success == true) {
                if ( orderDetail ) {
                    let emailData = {};
                     
                    switch (action) {
                        
                        case  core.enums.showBankInformationAction.request:
                            fcmService.bankRequested(id);                            
                            notificationService.bankDetailsRequested({to:orderDetail.sellerID,from:req.decoded.id,area:orderDetail.areaPurchased,propertyName:orderDetail.propertyName,dealId:id})
                            let sellerDetail = await core.userDB.getUserById(orderDetail.sellerID);
                            emailData.id = sellerDetail.id;
                            emailData.email = sellerDetail.email;
                            emailData.name  = sellerDetail.legalName;
                            emailData.orderId = id
                            emailUtils.marketPlaceBankRequestOrderNotification(emailData); 
                            logActivity(
                            {
                                    logName: ActionCategory.MARKETPLACE,
                                    description: "Requested bank details against deal of "+orderDetail.areaPurchased+" sq. ft. to "+orderDetail.sellerName+" in "+orderDetail.propertyName,
                                    subjectID: parseInt(id),
                                    subjectType: "orderItems",
                                    event: ActivityEvent.REQUESTED,
                                    causerID: req.decoded.id,
                                    causerType: "users",
                                    properties: {
                                        attributes: {
                                            dispID: parseInt(id),
                                            areaPurchased: orderDetail.areaPurchased,
                                            buyerName: orderDetail.buyerName,
                                            propertyName: orderDetail.propertyName,
                                            sellerName: orderDetail.sellerName
                                        },
                                        old: null
                                    },
                                    source: null,
                                    metadata:null
                                },req);
                            break;
                        case core.enums.showBankInformationAction.allow:
                            fcmService.bankAllowed(id);
                            notificationService.bankDetailsGranted({to:orderDetail.buyerID,from:req.decoded.id,area:orderDetail.areaPurchased,propertyName:orderDetail.propertyName,dealId:id})
                            let buyerDetail = await core.userDB.getUserById(orderDetail.buyerID);
                            emailData.id = buyerDetail.id;
                            emailData.email = buyerDetail.email;
                            emailData.name  = buyerDetail.legalName;
                            emailData.orderId = id;
                            emailUtils.marketPlaceBankBuyerNotificationEmail(emailData); 
                            logActivity(
                            {
                                logName: ActionCategory.MARKETPLACE,
                                description: "Released bank details against deal of "+orderDetail.areaPurchased+" sq. ft. to "+orderDetail.sellerName+" in "+orderDetail.propertyName,
                                subjectID: parseInt(id),
                                subjectType: "orderItems",
                                event: ActivityEvent.RELEASED,
                                causerID: req.decoded.id,
                                causerType: "users",
                                properties: {
                                    attributes: {
                                        dispID: parseInt(id),
                                        areaPurchased: orderDetail.areaPurchased,
                                        buyerName: orderDetail.buyerName,
                                        propertyName: orderDetail.propertyName,
                                        sellerName: orderDetail.sellerName
                                    },
                                    old: null
                                },
                                source: null,
                                metadata:null
                            },req);
                            break;
                        case core.enums.showBankInformationAction.deny:
                            emailUtils.marketPlaceBankRequestOrderNotification(emailData); 
                            logActivity(
                                {
                                    logName: ActionCategory.MARKETPLACE,
                                    description: "Rejected to share bank details against deal of "+orderDetail.areaPurchased+" sq. ft. to "+orderDetail.sellerName+" in "+orderDetail.propertyName,
                                    subjectID: parseInt(id),
                                    subjectType: "orderItems",
                                    event: ActivityEvent.REJECTED,
                                    causerID: req.decoded.id,
                                    causerType: "users",
                                    properties: {
                                        attributes: {
                                            dispID: parseInt(id),
                                            areaPurchased: orderDetail.areaPurchased,
                                            buyerName: orderDetail.buyerName,
                                            propertyName: orderDetail.propertyName,
                                            sellerName: orderDetail.sellerName
                                        },
                                        old: null
                                    },
                                    source: null,
                                    metadata:null
                                },req);
                            break;
                    
                    }
                }
                
                socketService.dealChanged(id,{
                    config:{
                        type:DEAl_CHANGE_ENUMS.BANK_REQUEST
                    },
                    data:orderDetail
                })

                res.Success(result.data, "SUCCESS");
                return res.status(201).json({error:true,message: "REQUESTED_BANK_DETAIL_SUCCESSFULLY_SEND",data:''});
            } else {
                res.Error(result.data, result.message);
            }
        }
    } catch (e) {
        console.log(e);
        res.Error(e.toString(), "EXCEPTION")
    }
}

async function getMyOrdersStats(req, res, next) {
    let resp = new core.responseObject();
    let userID = req.decoded && req.decoded.id ? req.decoded.id : 0;
    try {
        const data = await core.ordersDB.fetchUserStats(userID);
        if (data.success) {
            resp.setSuccess(data.message);
            resp.data = data.data;
            res.status(200).json(resp);
            return;
        } else {
            resp.setError('try again.', 'ERROR_FETCHING_STATS')
            res.status(500).json(resp);
            return;
        }
    } catch (e) {
        resp.setError(e.toString(), 'ERROR_FETCHING_STATS')
        res.status(500).json(resp);
        return;
    }
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */

//Pending
async function revertOrder(req, res, next) {
    if(!req.params.id) return res.Error("Provide order id","INVALID_PARAMETERS");
    const { reason='' } = req.body;  
    let userID = req.decoded && req.decoded.id ? req.decoded.id : 0;
    let orderId = parseInt(req.params.id);
    try {
        const data = await core.ordersDB.revertOrder(req.params.id,userID, reason);
        const orderDetail = await core.ordersDB.getOrder(orderId)
        if (data.success) {
            logActivity(
                {
                        logName: ActionCategory.MARKETPLACE,
                        description: "Reverted "+orderDetail.data[0].minimumLotSize+" sq. ft. from the order on DAO Listings in "+orderDetail.data[0].propertyName,
                        subjectID: parseInt(req.params.id),
                        subjectType: "orders",
                        event: ActivityEvent.REVERTED,
                        causerID: req.decoded.id,
                        causerType: "users",
                        properties: {
                            attributes: {
                                dispID:parseInt(req.params.id) 
                            },
                            old: null
                        },
                        source: null,
                        metadata:null
                    }
                    ,req)
            res.Success(data.data,"SUCCESS");
            return res.status(201).json({error:true,message: "REVERTED_ORDER_SUCCESSFULLY",data:''});
        }else{
            res.Error(data.data,"ERROR_REVERTING_ORDER");
        }
    } catch (e) {
        res.Error(e.toString(), 'ERROR_REVERTING_ORDER');
    }
}



/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */

 async function unlockRequest(req, res, next) {
    let userID = req.decoded && req.decoded.id ? req.decoded.id : 0;
    const reqData = req.body;
    reqData.userId = userID;
    try {
        let userDetail = await core.userDB.getUserById(userID);

        const request = new core.RequestModels.unlockAreaRequest(reqData);
        const propertyDetail = await core.propertyDB.getPropertyInformation(reqData.propertyId);
        if(!request.validate()) return res.Error("Provide all fields","INVALID_REQUEST");
        const result = await request.save();
        if (result.success) {
            reqData.sellerName = userDetail.legalName;
            reqData.sellerEmail = userDetail.email;
            reqData.membershipNumber = userDetail.membershipNumber;
            reqData.propertyName = propertyDetail.name;
         
            emailUtils.marketPlaceAreaUnlockRequestNotification(reqData);
             emailUtils.adminAreaUnlockNotification(reqData);
            
             logActivity(
                {
                        logName: "Market Place",
                        description: "Requested for area unlock",
                        subjectID:  result.data,
                        subjectType: "areaUnlockRequests",
                        event: "Requested",
                        causerID: req.decoded.id,
                        causerType: "users",
                        properties: {
                            attributes: { 
                                dispID: result.data,
                                area: reqData.area,
                                propertyName: reqData.propertyName

                            },
                            old: null
                        },
                        source: null,
                        metadata:null
                    }
                    ,req)
            fcmService.unlockAreaRequestNotification(propertyDetail ,req.decoded, request.area)
            res.Success(result.message,"SUCCESS");
            
        }else{
            res.Error(result.data,"REQUEST_ERROR");
        }
    } catch (e) {
        res.Error(e.toString(), 'REQUEST_ERROR');
    }
}
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */

 async function fetchAllAreaRequest(req, res, next) {

    try {
        const request = new core.RequestModels.unlockAreaRequest();
        const result = await request.getAllRequests(req.query.id,"all");
        res.Success(result.data,"SUCCESS");
        
    } catch (e) {
        res.Error(e.toString(), 'REQUEST_ERROR');
    }
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */

 async function getUserProjectUnlockedArea(req, res, next) {
    let userId = req.decoded && req.decoded.id ? req.decoded.id : 0;
  
    try {
        const request = new core.RequestModels.userUnlockAreaRequest({userId});
        const result = await request.getUserProjectUnlockedArea();
        if(result){
            try{
                logActivity(
                    {
                        logName: "Manage Listing",
                        description: "Viewed porjects area unlock listings",
                        subjectID:  seller_id,
                        subjectType: "listing",
                        event: "Views",
                        causerID: req.decoded.id,
                        causerType: "users",
                        properties: {
                            attributes: null,
                            old: null
                        },
                        source: null,
                        metadata:null
                    },req)
            }catch(error){
                console.log(error)
            }
            res.Success(result.data,"SUCCESS");
            return res.status(201).json({error:true,message: "AREA_UNLOCKED_REQUEST_SUCCESSFULLY_SEND",data:''});
        }
        else{
            res.Error("Error sending area unlock request", 'ERROR_AREA_UNLOCKED_REQUEST');
        }
        
    } catch (e) {
        res.Error(e.toString(), 'REQUEST_ERROR');
    }
}
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */

 async function changeRequest(req, res, next) {
    // let userId = req.decoded && req.decoded.id ? req.decoded.id : 0;
    try {
        debugger;
        const request = new core.RequestModels.unlockAreaRequest();
        console.log("Request",request);
        let response = await fcmService.getRequestDetails(req.params.id);
      
        let sellerDetail = await core.userDB.getUserById(response.userID);
       
        let _request = req.params;
        _request.legalName = sellerDetail.legalName;
        _request.email = sellerDetail.email;
        _request.membershipNumber = sellerDetail.membershipNumber;
        _request.propertyName = response.name;
        const result = await request.changeRequestStatus(req.params.id,req.params.response,req.params.area);
        console.log("Parameter",req.params.response);
        if(req.params.response == 1){
            emailUtils.marketPlaceAreaUnlockRequestAcceptedNotification(_request);
            notificationService.areaRequestApproved({to:response.userID,from:response.userID,area:req.params.area,propertyName:response.name});
        }
        if(req.params.response == 0){
            console.log("Rejected notification");
              emailUtils.marketPlaceAreaUnlockRequestRejectedNotification(_request);  
              notificationService.areaRequestRejected({to:response.userID,from:response.userID,area:req.params.area,propertyName:response.name});
        }
       
        fcmService.areaRequestResponded(req.params.id,req.params.response);
        
        res.Success(result.data,"SUCCESS");
        
    } catch (e) {
        res.Error(e.toString(), 'REQUEST_ERROR');
    }
}
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
async function print(req, res, next) {
    let userId = req.decoded && req.decoded.id ? req.decoded.id : 0;
    try {
        const result = await core.ordersDB.getDealReceiptData(req.query.id);
        
        result.data["now"] = moment(new Date()).add(5,'hours').format("MMM D, YYYY - hh:mm A");
        var c =moment(result.data["createdAt"]).add('days', result.data["days"]);
        result.data["createdAt"] = moment(new Date(result.data["createdAt"])).format("MMM D, YYYY - hh:mm A");
        result.data["timeLeftDate"] =  c.format("MMM D, YYYY - hh:mm A");
        result.data["timeLeftDays"] =  c.fromNow(true);
        result.data.timeLeftToPay = `${Math.round(moment(result.data.dueDate).diff(moment(), 'days', true))} days left (${(result.data && result.data.dueDate) ? Math.round(moment(result.data.dueDate).diff(moment(), 'hours', true)) : ''} hours)`;
        result.data["site_url"]= process.env.ASSETS_URL;
        result.data["portalurl"]= process.env.portalurl;
        result.data["isSeller"] = result.data["seller"]["id"] == userId ? true :false;
        result.data["isBuyer"] = !result.data["isSeller"];
        // if isFinal true then  "Time left to pay token amount" not to show
        result.data["isFinal"] = !(result.data["amount"]["paid"] >= result.data["amount"]["total"]);
        const file = await anotherPostReceipt("recpt",result.data);
        res.Success(file,"SUCCESS");
    } catch (e) {
        res.Error(e.toString(), 'REQUEST_ERROR');
    }
}

async function downloadPropertyBabkAccounts(req, res, next) {
    try {
        const banks = req.body;
        if(banks&&banks.length>0){
            for (let i = 0; i < banks.length; i++) {
                const el = banks[i];                
                el["banksAssetsUrl"] =process.env.portalurl;
                if(el&&el.svg){

                }else{                    
                    el["svg"] = "/assets/images/BankLogos/"+(el.bankName=='JS Bank'?'JS':el.bankName)+".svg";
                }
            }
            const file = await anotherPostReceipt("banks",{banks:banks});
            res.Success(file,"SUCCESS");
        }
    } catch (e) {
        res.Error(e.toString(), 'REQUEST_ERROR');
    }
}

async function markInactiveOrder( req, res, next ) {
    let resp = new core.responseObject();
    let { id: orderid = 0 } = req.params;
    let seller_id = req.decoded && req.decoded.id ? req.decoded.id : 0;
    orderid=parseInt(orderid);
    let orderDetail = await core.ordersDB.getOrder(orderid);
    core.ordersDB.markInactive(orderid, seller_id).then(result => {
        if (result.success) {
             
            logActivity(
                {
                        logName: ActionCategory.MARKETPLACE,
                        description: "Marked an order as inactive against "+orderDetail.data[0].areaToSell+" sq. ft. in "+orderDetail.data[0].propertyName,
                        subjectID: orderid,
                        subjectType: "orders",
                        event: ActivityEvent.UPDATED,
                        causerID: req.decoded.id,
                        causerType: "users",
                        properties: {
                            attributes: {
                                status: 'Inactive'
                            },
                            old: {
                                status: 'Active'
                            }
                        },
                        source: null,
                        metadata:null
                    }
                    ,req)
            resp.setSuccess('order updated successfully!');
            resp.data = result.data;
            res.status(200).json(resp);
        } else if (result.errorCocde == 'UNAUTHORIZED') {
            resp.setError(result.message.toString(), result.errorCocde)
            res.status(403).json(resp);
        } else {
            resp.setError(result.message.toString(), "UPDATING_ORDER_ERROR")
            res.status(200).json(resp);
        }
    }).catch(err => {
        resp.setError(e.toString(), 'UPDATING_ORDER_ERROR')
        res.status(200).json(resp);
        return;
    });
}

async function markActiveOrder( req, res, next ) {
    let resp = new core.responseObject();
    let { id: orderid = 0 } = req.params;
    let seller_id = req.decoded && req.decoded.id ? req.decoded.id : 0;
    core.ordersDB.markActive(orderid, seller_id).then(result => {
        if (result.success) {
            resp.setSuccess('order updated successfully!');
            resp.data = result.data;
            res.status(200).json(resp);
        } else if (result.errorCocde == 'UNAUTHORIZED') {
            resp.setError(result.message.toString(), result.errorCocde)
            res.status(403).json(resp);
        } else {
            resp.setError(result.message.toString(), "UPDATING_ORDER_ERROR")
            res.status(200).json(resp);
        }
    }).catch(err => {
        resp.setError(e.toString(), 'UPDATING_ORDER_ERROR')
        res.status(200).json(resp);
        return;
    }); 
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
 async function getUserAvailableAreaAdmin(req, res, next) {
    let userId = req.query.id;
    try {
        const result = await core.ordersDB.getUserAvailableAreaAdmin(userId);
        res.Success(result.data,"SUCCESS");
    } catch (e) {
        res.Error(e.toString(), 'REQUEST_ERROR');
    }
}

async function getUserAvailableAreaAdmin(req, res, next) {
    let userId = req.query.id;
    try {
        const result = await core.ordersDB.getUserAvailableAreaAdmin(userId);
        res.Success(result.data,"SUCCESS");
    } catch (e) {
        res.Error(e.toString(), 'REQUEST_ERROR');
    }
}


module.exports = {
    GetProperties,
    GetOrders,
    GetDeals,
    createOrder,
    updateOrderItemStatus,
    GetOrder,
    marketplaceWhySellingSurvey,
    marketplaceEligibility,
    createOrdeItem,
    GetSellOrdersByUser,
    GetBuyRequestByUser,
    peerToPeer,
    GetOrderItemDetail,
    GetBuyRequestBySellerOrder,
    getSellerOrderItemDetails,
    fetchOrderItemChat,
    saveMessageService,
    markMsgReadService,
    saveOrderPayment,
    getSellerOrderSummary,
    getSellerOrdersSummary,
    updateOrderPaymentStatus,
    cancelOrderItem,
    approveTimeExtendRequest,
    timeExtendRequest,
    getUsers,
    updateDisputeStatus,
    viewOrder,
    showBankAccountInformation,
    getMyOrdersStats,
    revertOrder,
    unlockRequest,
    fetchAllAreaRequest,
    getUserProjectUnlockedArea,
    changeRequest,
    print,
    downloadPropertyBabkAccounts,
    markInactiveOrder,
    markActiveOrder,
    bankShareBitUpdate,
    getUserAvailableAreaAdmin
};
