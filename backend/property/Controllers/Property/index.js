
const propertyinformation = require('./General/information');
const propertystats = require('./General/stats');
const propertytaxes = require('./General/taxes');
const propertymilestones = require('./Milestones/milestone');
// const milestonedescription = require('./Milestones/milestonedetails');
const propertydiscount = require('./Funding/discount');
const fundingroundprice = require('./Funding/price');
const devrounds = require('./Funding/Devrounds');
const documents = require('./Documents/documents');
const core = require("core");
const { socketService } = require('../../utils/socket.service');
const { DEAl_CHANGE_ENUMS } = require('../../resources/constants');
const emailUtils = require('../../utils/email');
const fcmService = require("./../../services/fcm/fcm.service");
const { response } = require('express');
async function getMarketplaceOrders(req,res,next){
    try {
        const data = await core.ordersDB.getOrders(req.query.id,true);
        res.Success(data.data.sort(function(a,b){return b.id-a.id}));
    } catch (error) {
        console.log('error', error);
        res.Error(error.toString(),"ERROR");
    }
}
async function getMarketplaceOrderItems(req,res,next){
    try {
        const data = await core.ordersDB.adminGetOrderItems(req.params.id);
        res.Success(data.data);
    } catch (error) {
        console.log('error', error);
        res.Error(error.toString(),"ERROR");
    }
}
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */

 async function adminDiscardOrderItem(req, res, next) {
    // let userId = req.decoded && req.decoded.id ? req.decoded.id : 0;
    try {
        const result = await core.ordersDB.adminDeleteOrderItem(req.params.id);
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

 async function adminRevertOrder(req, res, next) {
    // let userId = req.decoded && req.decoded.id ? req.decoded.id : 0;
    try {
        const result = await core.ordersDB.revertOrder(req.params.id);
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

 async function getSummary(req, res, next) {
    // let userId = req.decoded && req.decoded.id ? req.decoded.id : 0;
    try {
        const result = await core.ordersDB.getAdminMarketplaceSummary();
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

 async function getProjectSummary(req, res, next) {
    // let userId = req.decoded && req.decoded.id ? req.decoded.id : 0;
    try {
        const result = await core.ordersDB.getAdminMarketplaceProjectSummary(req.query.id);
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

 async function getDisputes(req, res, next) {
    // let userId = req.decoded && req.decoded.id ? req.decoded.id : 0;
    try {
        const result = await core.ordersDB.getDisputes(req.query.pageno,req.query.pagesize);
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

 async function getServiceCharges(req, res, next) {
    // let userId = req.decoded && req.decoded.id ? req.decoded.id : 0;
    try {
        const result = await core.ordersDB.getServiceCharges(req.query.pageno,req.query.pagesize);
        return res.status(200).json({ error: false, message: '', data: result.data,count:result.count });
        
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

 async function approveServiceCharges(req, res, next) {
    // let userId = req.decoded && req.decoded.id ? req.decoded.id : 0;
    try {
        const result = await core.ordersDB.approveServiceCharges(req.params.id);
        fcmService.serviceChargesApproved(result.data[0].parentID);        
        socketService.dealChanged(result.data[0].parentID,{
            config:{
                type:DEAl_CHANGE_ENUMS.DEAl_COMPLETED
            },
            data:result.data
        })
        
        const order = await core.ordersDB.getOrderDetail(result.data[0].parentID);
        const orderDetail = await core.ordersDB.getSellerOrderItemDetails(result.data[0].parentID,order.sellerID);
        
        if(orderDetail.data.serviceCharges.status == core.enums.orderPaymentStatusEnum.approved && orderDetail.data.paymentPending == 0)
            {
            let userDetail = await core.userDB.userDetails(order.sellerID);
            orderDetail.data.seller = userDetail.data;
            orderDetail.data.id = orderDetail.data.orderID;   
            emailUtils.marketplaceSellerAreaReleaseNotification(orderDetail.data);
            }
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

 async function getUserAreaSummary(req, res, next) {
    // let userId = req.decoded && req.decoded.id ? req.decoded.id : 0;
    try {
        const result = await core.ordersDB.getUserAreaSummary(req.params.id);
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

 async function getMarketplaceUserOrders(req, res, next) {
    try {
        const data = await core.ordersDB.getOrders(req.params.id,true,null,"seller");
        res.Success(data.data.sort(function(a,b){return b.id-a.id}));
    } catch (error) {
        console.log('error', error);
        res.Error(error.toString(),"ERROR");
    }
}
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */

 async function search(req, res, next) {
    try {
        const data = await core.ordersDB.search(req.params.txt);
        res.Success(data.data);
    } catch (error) {
        console.log('error', error);
        res.Error(error.toString(),"ERROR");
    }
}
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */

 async function getBanks(req, res, next) {
    try {
        const data = await core.userDB.getBanks();
        res.Success(data.data);
    } catch (error) {
        console.log('error', error);
        res.Error(error.toString(),"ERROR");
    }
}



async function projectBanks(req,res,next){
    try {
        const data = await core.propertyDB.getPropertyBanks(req.query.propertyId);
        console.log("Data",data);
  
        res.Success(data);
    } catch (error) {
        console.log('error', error);
        res.Error(error.toString(),"ERROR");
    }
}

async function requestProjectAccess(req,res,next) {
    try {
        const propertyID = req.params.id;
        const userID = (req.decoded && req.decoded.id) ? req.decoded.id : 0;
        if( userID===0 ) {
            throw 'Error';
        }
        const data = await core.propertyDB.addPropertyRequest(propertyID, userID);
        let propertyData = await core.propertyDB.getPropertyInformation(propertyID);
        console.log(data);
        if( data.status ) {
            fcmService.requestProjectAccessNotification(propertyData, req.decoded)
            res.Success({status: true});
        } else {
            throw 'Error';
        }
    } catch(e) {
        console.log('error', e);
        res.Error(e.toString(),"ERROR");
    }
}

module.exports = {
    propertyinfo : propertyinformation.propertyinfo,
    updatepropertyinfo : propertyinformation.updatepropertyinfo,
    updatepropertystats : propertystats.updatepropertystats,
    getpropertystats : propertystats.getpropertystats,
    getpropertytaxes : propertytaxes.getpropertytaxes,
    addmilestones : propertymilestones.addmilestones,
    updatemilestones : propertymilestones.updatemilestones,
    getmilestones : propertymilestones.getmilestones,
 //   getroundmilestones : milestonedescription.getroundmilestones,
    propertydiscount : propertydiscount.discountprice,
    price : fundingroundprice.price,
    devrounds : devrounds.devrounds,
    getrounds : devrounds.getrounds,
    investorgetrounds : devrounds.investorgetrounds, 
    completedrounds : devrounds.completedrounds,
    unlockfunds : devrounds.unlockFunds,
    adddocument : documents.adddocument,
    getdocument : documents.getdocument,
    alldocument : documents.alldocuments,
    activeRound: devrounds.activeRound,
    projectFundsStats : propertystats.propertyFundingStats,
    getMarketplaceOrders,
    getMarketplaceOrderItems,
    adminDiscardOrderItem,
    adminRevertOrder,
    getSummary,
    getProjectSummary,
    getDisputes,
    getServiceCharges,
    approveServiceCharges,
    getUserAreaSummary,
    getMarketplaceUserOrders,
    search,
    getBanks,
    projectBanks,
    requestProjectAccess,
};





