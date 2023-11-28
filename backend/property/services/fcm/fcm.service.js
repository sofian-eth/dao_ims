const { sendNotification, getDeviceToken,getDeviceTokenByPropertyId, uploadReceiptNotification, insertNotificationData } = require("../../utils/fcm.util");
const core = require("core");
const notificationCenter = require('../../resources/notification-center');
const fcmService = {
    dealCreated:async function(dealID){
        const deal = await this.getDealDetails(dealID);        
        sendNotification("Bid",deal.buyerName+" has shown interest in purchasing your area against "+deal.areaPurchased+" sq. ft. in "+deal.propertyName,process.env.portalurl+"/marketplace/order_requests/"+deal.dealID+"/seller/",[deal.sellerDeviceToken],deal.propertyLogo).then(x=>{});
    },

    /**
     * 
     * @param {*} seller 
     * @param {*} buyer 
     * @returns {Promise<any>}
     */
     serviceChargesApproved: async function (id) {
        const userId = await this.getSellerIDfromOrderItem(id);
        const to  = await this.getUserToken(userId);
        return  sendNotification("Service charges",`Service charges has been Approved. \nClick here to visit`,process.env.portalurl+"marketplace/order_requests/"+id+"/seller",to);
        
    },
    /**
     * 
     * @param {*} seller 
     * @param {*} buyer 
     * @returns {Promise<any>}
     */
    transactionCompleted: async function (seller, buyer, transactionID) {
        const _seller_to = await this.getUserToken(seller);
        const _buyer_to = await this.getUserToken(buyer);
        const dealID = await this.getDealIdFromTransactionID(transactionID);
        sendNotification("Transaction completed", "Deal# " + dealID + " \n Transaction completed.", process.env.portalurl + "marketplace/order_requests/" + dealID + "/seller", [_seller_to]);
        return sendNotification("Transaction completed", "Deal# " + dealID + " \n Transaction completed.", process.env.portalurl + "marketplace/order_requests/" + dealID + "/buyer", [_buyer_to]);
    },
    areaReceived:async function (receiverId,sender,area,date,project){
        const _receiver_to = await this.getUserToken(receiverId);
        console.log('_receiver_to : ',_receiver_to);
        sendNotification("DAO Proptech", "You have recieved " + area + " \n  sq. ft. in "+ project +"from "+ sender + " on "+ date +". This trasaction will reflect on the open Blockchain record in 2 to 3 working days.", process.env.portalurl + "peer-to-peer/transfer-area", [_receiver_to]);
        return sendNotification("DAO Proptech", "You have recieved " + area + " \n  sq. ft. in "+ project +"from "+ sender + " on "+ date +". This trasaction will reflect on the open Blockchain record in 2 to 3 working days.", process.env.portalurl + "peer-to-peer/transfer-area", [_receiver_to]);
    },
    approvedTransferArea:async function (receiverId,sender,area,project){
        const _receiver_to = await this.getUserToken(receiverId);
        console.log('_receiver_to : ',_receiver_to);
        sendNotification("DAO Proptech","You received "+ area +" sq. ft. of area in the project "+  +" directly from"+ sender +" . The transaction is now reflected on Blockchain.", process.env.portalurl + "peer-to-peer/transfer-area", [_receiver_to]);
        return sendNotification("DAO Proptech","You received"+ area +" sq. ft. of area in the project "+ project +" directly from"+ sender +" . The transaction is now reflected on Blockchain.", process.env.portalurl + "peer-to-peer/transfer-area", [_receiver_to]);
    },
    /**
         * 
         * @param {Number} orderItemId 
         * @returns {Promise<any>}
         */
    newChatMessage: async function (_to, msg, orderItemId, type) {
        const deal = await this.getDealDetails(orderItemId);
        return sendNotification("Chat", (type == 1 ? deal.sellerName : deal.buyerName)+" has sent you a message against "+deal.areaPurchased+" sq. ft. in "+deal.propertyName, process.env.portalurl + "marketplace/order_requests/" + orderItemId + (type == 1 ? "/buyer" : "/seller"),(type == 1 ? deal.buyerDeviceToken : deal.sellerDeviceToken));
        // const model = new notificationModel();
        // let userID; 
        // if(type == 0){
        //     userID = await this.getBuyerIDfromOrderItem(orderItemId,msg);
        // }else{
        //     userID = await this.getSellerIDfromOrderItem(orderItemId,msg);
        // }
        // model.title = 'New Message from Deal '+orderItemId;
        // model.description = msg;
        // model.from = userID;
        // model.fromName = 'Faisal Siddique';
        // model.logo = '';
        // model.redirectLink = process.env.portalurl + "marketplace/order_requests/" + orderItemId + (type == 1 ? "/buyer" : "/seller");
        // model.to = _to;
        // model.type = 'chat';
        // model.create().then(x=>{
        //     socketService.emitNotification(_to);
        // })

        // // const userID = await this.getBuyerIDfromOrderItem(orderItemId,msg);
        // const to = await this.getUserToken(_to);
        // return sendNotification("New Message", msg, process.env.portalurl + "marketplace/order_requests/" + orderItemId + (type == 1 ? "/buyer" : "/seller"), to);
    },
    /**
     * 
     * @param {Number} orderItemId 
     * @returns {Promise<any>}
     */
    dealCompleted: async function (orderItemId) {
        const userID = await this.getBuyerIDfromOrderItem(orderItemId);
        const to = await this.getUserToken(userID);
        return sendNotification("Deal completed", "Deal has been marked completed. deal# " + orderItemId, process.env.portalurl + "marketplace/order_requests/" + orderItemId + "/buyer", to);
    },
    /**
     * 
     * @param {Number} orderItemId 
     * @returns {Promise<any>}
     */
    paymentApproved: async function (orderItemId,amount) {
        const deal = await this.getDealDetails(orderItemId);
        return sendNotification( deal.sellerName,"has successfully approved the payment of "+amount+" PKR  against "+deal.areaPurchased+" sq. ft. in " + deal.propertyName, process.env.portalurl + "marketplace/order_requests/" + orderItemId + "/buyer", deal.buyerDeviceToken);
    },
    /**
     * 
     * @param {Number} orderItemId 
     * @returns {Promise<any>}
     */
    paymentRecieved: async function (orderItemId,amount) {
        const deal = await this.getDealDetails(orderItemId);
        return sendNotification("Payment", deal.buyerName+" has paid the "+amount+" PKR against "+deal.areaPurchased+" sq. ft. in "+deal.propertyName, process.env.portalurl + "marketplace/order_requests/" + orderItemId + "/seller", deal.sellerDeviceToken);
    },
    /**
     * 
     * @param {Number} orderItemId 
     * @returns {Promise<any>}
     */
    bankRequested: async function (orderItemId) {
        const deal = await this.getDealDetails(orderItemId);
        return sendNotification("Bank", deal.buyerName+" has requested the bank details against "+deal.areaPurchased+" sq. ft. in "+deal.propertyName , process.env.portalurl + "marketplace/order_requests/" + deal.dealID + "/seller", deal.sellerDeviceToken);
    },
    /**
     * 
     * @param {Number} orderItemId 
     * @returns {Promise<any>}
     */
    bankAllowed: async function (orderItemId) {
        const deal = await this.getDealDetails(orderItemId);
        return sendNotification("Bank", deal.sellerName+" has shared the bank details against "+deal.areaPurchased+" sq. ft. in "+deal.propertyName , process.env.portalurl + "marketplace/order_requests/" + orderItemId + "/buyer", deal.buyerDeviceToken);
    },
    /**
     * 
     * @param {*} id 
     * @param {*} resp 
     * @returns 
     */
    areaRequestResponded: async function (id, resp) {
        const req = await this.getRequestDetails(id);
        return sendNotification(resp == 1 ? 'Approved' : 'Rejected', `Your area unlock request against ${resp == 1 ? req.approvedArea : req.area} sq. ft in ${req.name} has been  ${resp == 1 ? 'approve' : 'rejected'}`, process.env.portalurl + "marketplace?openmodal=sellarea", req.deviceToken);
    },
    /**
     * @param {Number} userId - User ID
     */
    getUserToken: async function (userId) {
        let query = `select device_token from users where id = ?`;
        const result = await core.fcmDb.execSelect(query, [userId]);
        if (result && result.length > 0) {
            return result[0]["device_token"];
        }
        else {
            return 0;
        }
    },
    /**
     * 
     * @param {*} reqId 
     * @returns {Promise<any>}
     */
    getUserIdFromUnlockRequest: async function (reqId) {
        let query = `select userID from areaUnlockRequests where id = ?`;
        const result = await core.fcmDb.execSelect(query, [reqId]);
        // const result = await core.db.sequelize.query(query,{replacements:[reqId],type:QueryTypes.SELECT});
        if (result && result.length > 0) {
            return result[0]["userID"];
        }
        else {
            return 0;
        }
    },
    /**
     * 
     * @param {*} orderItemId 
    * @returns {Promise<any>}
     */
    getSellerIDfromOrderItem: async function (orderItemId) {
        let query = `select sellerID from orders where id = (select orderID from orderItems where id = ? limit 1)`;
        const result = await core.fcmDb.execSelect(query, [orderItemId]);
        if (result && result.length > 0) {
            return result[0]["sellerID"];
        }
        else {
            return 0;
        }

    },
    /**
 * 
 * @param {*} orderItemId 
* @returns {Promise<any>}
 */
    getBuyerIDfromOrderItem: async function (orderItemId) {
        let query = `select buyerID from orderItems where id = ? limit 1`;
        const result = await core.fcmDb.execSelect(query, [orderItemId]);
        if (result && result.length > 0) {
            return result[0]["buyerID"];
        }
        else {
            return 0;
        }

    },
    getDealIdFromTransactionID: async function (id) {
        let query = `select id from orderItems where tradeActivityID = ? limit 1`;
        const result = await core.fcmDb.execSelect(query, [id]);
        if (result && result.length > 0) {
            return result[0]["id"];
        }
        else {
            return 0;
        }
    },
    /**
     * 
     * @param {*} dealID 
     * @returns {Promise<dealResponse>}
     */
    getDealDetails: async function(dealID){
        let query = `select 
        o.sellerID, 
        ifnull(seller.nickName,'') as sellerName,
        seller.device_token  sellerDeviceToken,
        oi.buyerID,
        ifnull(buyer.nickName,'') as buyerName,
        buyer.device_token  buyerDeviceToken,
        p.id as propertyID,
        p.name as propertyName,
        p.propertyLogo,
        oi.id as dealID,
        oi.areaPurchased
        from orderItems oi 
        join 
        orders o 
        on oi.orderID = o.id 
        and 
        oi.id = ? 
        join
        users seller 
        on o.sellerID = seller.id
        join 
        users buyer 
        on oi.buyerID = buyer.id
        join property p 
        on p.id = o.propertyID;`;
        const result = await core.fcmDb.execSelect(query, [dealID]);
        if (result && result.length > 0) {
            return result[0];
        }
        else {
            return null;
        }
    },
    /**
     * 
     * @param {*} id 
     * @returns {Promise<areaReq>}
     */
    getRequestDetails: async function(id){
        let query = `select 
        aur.id,
        aur.area,
        aur.approvedArea,
        aur.propertyID,
        p.name,
        p.propertyLogo,
        aur.userID,
        ifnull(concat(u.firstName,' ',u.lastName),u.legalName) requesterName,
        u.device_token as deviceToken
        from 
        areaUnlockRequests aur
        join property p
        on p.id = aur.propertyID and aur. id =?
        join users u on aur.userID = u.id`;
        const result = await core.fcmDb.execSelect(query, [id]);
        if (result && result.length > 0) {
            return result[0];
        }
        else {
            return null;
        }
    },

    userReviewsApproved: async function (data) {
        const senderName = (data.reviewedBy===data.buyerID ? data.buyerName : data.sellerName);
        const token = (data.reviewedBy===data.buyerID ? data.sellerDeviceToken : data.buyerDeviceToken);
        const userType =  (data.reviewedTo===data.buyerID ? 'BUYER' : 'SELLER')
        if(token) {
            return sendNotification('User Review',`${senderName} left a review for you against ${data.areaPurchased} sq. ft. in ${data.propertyName}`,process.env.portalurl+`marketplace/order_requests/${data.orderItemsID}/${userType==='BUYER' ? 'buyer' : 'seller'}`, token);
        } else {
            return null;
        }
    },

    //Admin Notification Service...

    receiptUploadNotification: async function (transactionId, userDetail){
        try {
            let user = await core.userDB.getUserNameById(userDetail.id);
            let t1 = await getDeviceToken(transactionId);
            if(t1.length>0 && t1[0].length>0) {
                tokens = t1[0][0];
                tokens.forEach(item => {
                    if( item.device_token!=null && item.device_token!='null' && item.device_token!='' ) {
                        uploadReceiptNotification("Payment Proof (TRX "+transactionId+")", (user[0].legalName != null ? user[0].legalName : user[0].firstName+" "+user[0].lastName )+" has uploaded receipt.", item.device_token);
                    }
                });
            }
            return;
        } catch(e) {
            console.log(e);
        }
    },
    
    areaPledgedNotification: async function(transactionId, userDetail, sqft, propertyDetail){
        try {
            let user = await core.userDB.getUserNameById(userDetail.id);
            let t1 = await getDeviceToken(transactionId);
            if(t1.length>0 && t1[0].length>0) {
                tokens = t1[0][0];
                tokens.forEach(item => {
                    if( item.device_token!=null && item.device_token!='null' && item.device_token!='' ) {
                        uploadReceiptNotification(propertyDetail.propertySymbol+" pledge request for (TRX "+transactionId+") ", (user[0].legalName != null ? user[0].legalName : user[0].firstName+" "+user[0].lastName )+" has created a pledge of "+sqft+" sq. ft.", item.device_token);
                    }
                });
            }
            return;
        } catch(e) {
            console.log(e);
        }
    },


    createOrderNotification: async function(propertyId, userDetail, sqft, propertySymbol){
        try {
            let user = await core.userDB.getUserNameById(userDetail.id);
            let t1 = await getDeviceTokenByPropertyId(propertyId);
            if(t1.length>0 && t1[0].length>0) {
                tokens = t1[0][0];
                tokens.forEach(item => {
                    if( item.device_token!=null && item.device_token!='null' && item.device_token!='' ) {
                        uploadReceiptNotification(propertySymbol+" order created", (user[0].legalName != null ? user[0].legalName : user[0].firstName+" "+user[0].lastName )+" has created an order of "+sqft+" sq. ft. ", item.device_token);
                    }
                });
            }
            return;
        } catch(e) {
            console.log(e);
        }
    },

    unlockAreaRequestNotification: async function(propertyDetail, userDetail, sqft){
        try {
            let user = await core.userDB.getUserNameById(userDetail.id);
            let t1 = await getDeviceTokenByPropertyId(propertyDetail.id);
            if(t1.length>0 && t1[0].length>0) {
                tokens = t1[0][0];
                tokens.forEach(item => {
                    if( item.device_token!=null && item.device_token!='null' && item.device_token!='' ) {
                        uploadReceiptNotification(propertyDetail.propertySymbol+" area unlock request", (user[0].legalName != null ? user[0].legalName : user[0].firstName+" "+user[0].lastName )+" has requested to unlock "+sqft+" sq. ft.", item.device_token);
                    }
                });
            }
            return;
        } catch(e) {
            console.log(e);
        }
    },

    payServiceChargesNotification: async function(userDetail, dealId, paymentAmount, propertyDetail){
        try {
            let user = await core.userDB.getUserNameById(userDetail.id);
            let t1 = await getDeviceTokenByPropertyId(propertyDetail.id);
            if(t1.length>0 && t1[0].length>0) {
                tokens = t1[0][0];
                tokens.forEach(item => {
                    if( item.device_token!=null && item.device_token!='null' && item.device_token!='' ) {
                        uploadReceiptNotification(propertyDetail.propertySymbol+" service charges paid against deal # "+dealId,  (user[0].legalName != null ? user[0].legalName : user[0].firstName+" "+user[0].lastName )+" has paid service charges of PKR "+paymentAmount, item.device_token);
                    }
                });
            }
            return;
        } catch(e) {
            console.log(e);
        }
    },

    payTokenAmountNotification: async function(userDetail, dealId, paymentAmount, propertyDetail){
        try {
            let user = await core.userDB.getUserNameById(userDetail.id);
            let t1 = await getDeviceTokenByPropertyId(propertyDetail.id);
            if(t1.length>0 && t1[0].length>0) {
                tokens = t1[0][0];
                tokens.forEach(item => {
                    if( item.device_token!=null && item.device_token!='null' && item.device_token!='' ) {
                        uploadReceiptNotification(propertyDetail.propertySymbol+" security amount paid against deal # "+dealId,  (user[0].legalName != null ? user[0].legalName : user[0].firstName+" "+user[0].lastName )+" has paid security amount of PKR "+paymentAmount, item.device_token);
                    }
                });
            }
            return;
        } catch(e) {
            console.log(e);
        }
    },


    payRemainingAmountNotification: async function(userDetail, dealId, paymentAmount, propertyDetail){
        try {
            let user = await core.userDB.getUserNameById(userDetail.id);
            let t1 = await getDeviceTokenByPropertyId(propertyDetail.id);
            if(t1.length>0 && t1[0].length>0) {
                tokens = t1[0][0];
                tokens.forEach(item => {
                    if( item.device_token!=null && item.device_token!='null' && item.device_token!='' ) {
                        uploadReceiptNotification(propertyDetail.propertySymbol+" remainging amount paid against deal # "+dealId,  (user[0].legalName != null ? user[0].legalName : user[0].firstName+" "+user[0].lastName )+" has paid remaining amount of PKR "+paymentAmount, item.device_token);
                    }
                });
            }
            return;
        } catch(e) {
            console.log(e);
        }
    },

    requestProjectAccessNotification: async function(propertyDetail, req){
        let notificationArray = [];
        try {
            let user = await core.userDB.getUserNameById(req.id);
            let t1 = await getDeviceTokenByPropertyId(propertyDetail.id);
            if(t1.length>0 && t1[0].length>0) {
                tokens = t1[0][0];
                tokens.forEach(item => {
                    let notificationObj = {
                        title: `Unlock request received`,
                        pushTitle: `Unlock request received`,
                        description: `${propertyDetail.name}: A new unlock request was received by ${(user[0].legalName != null ? user[0].legalName : user[0].firstName+" "+user[0].lastName )} (DAO-ID ${req.id})`,
                        redirectLink:`properties/developmentrounds?propertyId=${propertyDetail.id}`,
                        from: req.id,
                        to: item.id,
                        type: notificationCenter.ADMIN_PROPERTIES
                    }
                    if(req.id !== item.id){
                        notificationArray.push(notificationObj)
                    }
                    if( item.device_token!=null && item.device_token!='null' && item.device_token!='' ) {
                        uploadReceiptNotification(notificationObj.pushTitle, notificationObj.description, item.device_token);
                    }
                });
            }
            insertNotificationData(notificationArray);
            return;
        } catch(e) {
            console.log(e);
        }
    },

    purchaseEntireUnitNotification: async function(userDetail, propertyDetail){
        try {
            let user = await core.userDB.getUserNameById(userDetail.id);
            let t1 = await getDeviceTokenByPropertyId(propertyDetail.id);
            if(t1.length>0 && t1[0].length>0) {
                tokens = t1[0][0];
                tokens.forEach(item => {
                    if( item.device_token!=null && item.device_token!='null' && item.device_token!='' ) {
                        uploadReceiptNotification(propertyDetail.propertySymbol+" entire unit requested", (user[0].legalName != null ? user[0].legalName : user[0].firstName+" "+user[0].lastName )+" has requested entire unit appartment in "+propertyDetail.name, item.device_token);
                    }
                });
            }
            return;
        } catch(e) {
            console.log(e);
        }
    },


}


class dealResponse{
    constructor(obj = {}){
        this.sellerID = 0;
        this.sellerName = "";
        this.buyerID = 0;
        this.buyerName = "";
        this.propertyID = 0; 
        this.propertyName = "";
        this.propertyLogo = "";
        this.dealID = 0;
        this.areaPurchased = 0;
        this.sellerDeviceToken = "";
        this.buyerDeviceToken = "";
    }
}
class areaReq{
    constructor(){
        this.id = 0; 
        this.area = 0; 
        this.approvedArea = 0; 
        this.propertyID = 0; 
        this.name = ""; 
        this.propertyLogo = ""; 
        this.userID = 0; 
        this.requesterName = ""; 
        this.deviceToken = "";    
    }
}
module.exports = fcmService;