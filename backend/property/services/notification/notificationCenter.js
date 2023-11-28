const { sendNotification } = require("../../utils/fcm.util");
const core = require("core");
const notificationModel = core.notificationModel;
const NOTIFICATION_ENUM = core.NOTIFICATION_ENUM;
const { socketService } = require("../../utils/socket.service");
const fcmService = require("../fcm/fcm.service");
const notificationService = {
    /**
     * 
     * @param {{to:any,from:any}} obj 
     */
    userRegistered: async function(obj){
        const model = new notificationModel({
            title:"Click here to explore investment opportunities",
            description:"Welcome to BLOC",
            redirectLink:"property/listing",
            to:obj.to,
            from:obj.from,
            type:NOTIFICATION_ENUM.WELCOME,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);
    },
    /**
     * 
     * @param {{to:any,from:any,trxId:any}} obj 
     */
    pledgeFilled:async function(obj){
        
        const model = new notificationModel({
            title:"Click here to proceed with the payment",
            description:"Your area pledge against transaction id "+obj.trxId+" has been recorded",
            redirectLink:"transaction/detail/"+obj.trxId,
            to:obj.to,
            from:obj.from,
            type:NOTIFICATION_ENUM.PLEDGE,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);
    },
    /**
     * 
     * @param {{to:any,from:any,id:any}} obj 
     */
    paymentDeposited:async function(obj){
        const model = new notificationModel({
            title:"Click here to track the status of your transaction ",
            description:"Your payment against transaction id "+obj.id+" has been deposited",
            redirectLink:"transaction/detail/"+obj.id,
            to:obj.to,
            from:obj.from,
            type:NOTIFICATION_ENUM.PAYMENT,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);

    },
    /**
     * 
     * @param {{to:any,from:any,id:any}} obj 
     */
    transactionDiscarded:async function(obj){
        const result = this.getTradeactivityDetails(obj);
        if(!result) return;

        const model = new notificationModel({
            title:"Click here to pledge a new request",
            description:"Your transaction id "+obj+" has been discarded",
            redirectLink:"property/listing",
            to:result.sellerID,
            from:result.sellerID,
            type:NOTIFICATION_ENUM.TRANSACTION,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);

    },
    /**
     * 
     * @param {{to:any,from:any,id:any}} obj 
     */
    transactionLocked:async function(obj){
        const result = this.getTradeactivityDetails(obj);
        if(!result) return;
        const model = new notificationModel({
            title:"Click here to review the details",
            description:"Your transaction id "+obj+" has been successfully locked",
            redirectLink:"transaction/listing",
            to:result.sellerID,
            from:result.sellerID,
            type:NOTIFICATION_ENUM.TRANSACTION,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);
    },
    /**
     * 
     * @param {{to:any,from:any,id:any}} obj 
     */
    advanceBooking:async function(obj){
        const model = new notificationModel({
            title:"Click here to proceed with the payment",
            description:"Your advance booking area pledge against transaction id "+obj.id+" has been recorded",
            redirectLink:"transaction/listing",
            to:obj.to,
            from:obj.from,
            type:NOTIFICATION_ENUM.ADVANCE_BOOKING,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);
    },
    /**
     * 
     * @param {{to:any,from:any,id:any}} obj 
     */
    advanceBookingCompleted:async function(obj){
        const model = new notificationModel({
            title:"Click here to to view the booking details",
            description:"Your advance booking against transaction id "+obj.id+" has been approved successfully",
            redirectLink:"transaction/listing",
            to:obj.to,
            from:obj.from,
            type:NOTIFICATION_ENUM.ADVANCE_BOOKING,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);
    },
    /**
     * 
     * @param {{to:any,from:any}} obj 
     */
    profileUpdated:async function(obj){
        const model = new notificationModel({
            title:"Click here to view the details",
            description:"Your profile has been updated successfully",
            redirectLink:"settings",
            to:obj.to,
            from:obj.from,
            type:NOTIFICATION_ENUM.PROFILE,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);
    },
    /**
     * 
     * @param {{to:any,from:any}} obj 
     */
    passwordChanged:async function(obj){
        const model = new notificationModel({
            title:"Click here to view the details",
            description:"Your password has been changed successfully",
            redirectLink:"settings",
            to:obj.to,
            from:obj.from,
            type:NOTIFICATION_ENUM.PROFILE,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);
    },
    /**
     * 
     * @param {{to:any,from:any,area:any,propertyName:any}} obj 
     */
    areaUnlockRequested:async function(obj){
        const model = new notificationModel({
            title:"Click here to track the status of your request",
            description:"Your area unlock request against "+obj.area+" sq. ft in "+obj.propertyName+" has been received",
            redirectLink:"marketplace?openmodal=sellarea",
            to:obj.to,
            from:obj.from,
            type:NOTIFICATION_ENUM.REQUEST,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);
    },
    /**
     * 
     * @param {{to:any,from:any,area:any,propertyName:any}} obj 
     */
    areaRequestApproved:async function(obj){
        const model = new notificationModel({
            title:"You can now sell the unlocked area on DAO Listing",
            description:"Your area unlock request against "+obj.area+" sq. ft in "+obj.propertyName+" has been received",
            redirectLink:"marketplace?openmodal=sellarea",
            to:obj.to,
            from:obj.from,
            type:NOTIFICATION_ENUM.APPROVED,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);
    },
    /**
     * 
     * @param {{to:any,from:any,area:any,propertyName:any}} obj 
     */
    areaRequestRejected:async function(obj){
        const model = new notificationModel({
            title:"Click here to track the status of your request",
            description:"Your area unlock request against "+obj.area+" sq. ft in "+obj.propertyName+" has been received",
            redirectLink:"marketplace?openmodal=sellarea",
            to:obj.to,
            from:obj.from,
            type:NOTIFICATION_ENUM.REJECT,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);
    },
    /**
     * 
     * @param {{to:any,from:any,area:any,propertyName:any}} obj 
     */
    marketplaceOrderPlaced:async function(obj){
        const model = new notificationModel({
            title:"Click here to review the details",
            description:"You have successfully placed your order on Marketplace against "+obj.area+" sq. ft. in "+obj.propertyName,
            redirectLink:"marketplace/seller/active/"+obj.orderID,
            to:obj.to,
            from:obj.from,
            type:NOTIFICATION_ENUM.ORDER,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);
    },
    /**
     * 
     * @param {{to:any,from:any,area:any,propertyName:any}} obj 
     */
    bidRecievedSeller:async function(obj){
        const model = new notificationModel({
            title:"Click here to start communication with the buyer",
            description:" has shown interest in purchasing your area against "+obj.area+" sq. ft. in "+obj.propertyName,
            redirectLink:"marketplace/order_requests/"+obj.dealId+"/seller",
            to:obj.to,
            from:obj.from,
            type:NOTIFICATION_ENUM.BID,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);
    },
    /**
     * 
     * @param {{to:any,from:any,area:any,propertyName:any}} obj 
     */
    bidRecievedBuyer:async function(obj){
        const model = new notificationModel({
            title:"Click here to request the bank details from the seller",
            description:"Your bid against "+obj.area+" sq. ft. in "+obj.propertyName+" has been placed successfully",
            redirectLink:"marketplace/order_requests/"+obj.dealId+"/buyer",
            to:obj.to,
            from:obj.from,
            type:NOTIFICATION_ENUM.BID,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);
    },
    /**
     * 
     * @param {{to:any,from:any,area:any,propertyName:any}} obj 
     */
    bankDetailsRequested:async function(obj){
        const model = new notificationModel({
            title:"Click here to approve & share the bank details with the buyer",
            description:" has requested the bank details against "+obj.area+" sq. ft. in "+obj.propertyName,
            redirectLink:"marketplace/order_requests/"+obj.dealId+"/seller",
            to:obj.to,
            from:obj.from,
            type:NOTIFICATION_ENUM.BANK,
            logo:""
        });
        model.create();
        console.log("Here",obj.to);
        socketService.emitNotification(obj.to,model);
    },
    /**
     * 
     * @param {{to:any,from:any,area:any,propertyName:any}} obj 
     */
    bankDetailsGranted:async function(obj){
        const model = new notificationModel({
            title:"Click here to proceed with the payment",
            description:" has shared the bank details against "+obj.area+" sq. ft. in "+obj.propertyName,
            redirectLink:"marketplace/order_requests/"+obj.dealId+"/buyer",
            to:obj.to,
            from:obj.from,
            type:NOTIFICATION_ENUM.BANK,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);
    },
    /**
     * 
     * @param {{to:any,from:any,area:any,propertyName:any}} obj 
     */
    marketPlacePaymentDeposited:async function(obj){
        const deal = await fcmService.getDealDetails(obj.dealID);
        const model = new notificationModel({
            title:"Click here to approve the payment after verifying the details",
            description:"has paid the "+obj.amount+" PKR against "+deal.areaPurchased+" sq. ft. in "+deal.propertyName,
            redirectLink:"marketplace/order_requests/"+obj.dealID+"/seller",
            to:obj.to,
            from:obj.from,
            type:NOTIFICATION_ENUM.PAYMENT,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);
    },
    /**
     * 
     * @param {{to:any,from:any,area:any,propertyName:any,amount:any}} obj 
     */
    paymentAcknowledged:async function(obj){
        const deal = await fcmService.getDealDetails(obj.dealId);
        const model = new notificationModel({
            title:"Click here to proceed with the remaining amount Please wait until the seller release the area to your name",
            description:obj.seller+" has successfully approved the payment of "+obj.amount+" PKR against "+deal.areaPurchased+" sq. ft. in "+deal.propertyName,
            redirectLink:"marketplace/order_requests/"+obj.dealId+"/buyer",
            to:obj.to,
            from:obj.from,
            type:NOTIFICATION_ENUM.PAYMENT,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);
    },
    /**
     * 
     * @param {{to:any,from:any,area:any,propertyName:any}} obj 
     */
    chatMessage:async function(obj){
        const deal = await fcmService.getDealDetails(obj.orderItemId);
        const model = new notificationModel({
            title:"Click here to view the details",
            description:(obj.to == deal.sellerID ?deal.buyerName:deal.sellerName)+" has sent you a message against "+deal.areaPurchased+" sq. ft. in "+deal.propertyName,
            redirectLink:"marketplace/order_requests/"+obj.orderItemId+"/"+(obj.to == deal.sellerID ?"seller":"buyer"),
            to:obj.to,
            from:obj.from,
            type:NOTIFICATION_ENUM.CHAT,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);
    },
    /**
     * 
     * @param {{to:any,from:any,area:any,propertyName:any}} obj 
     */
    serviceChargesPending:async function(obj){
        const model = new notificationModel({
            title:"Click here to pay service charges before you can release area to the buyer",
            description:"Your area sale against "+obj.area+" sq. ft. in "+obj.propertyName+" is almost complete",
            redirectLink:"property/listing",
            to:obj.to,
            from:obj.from,
            type:NOTIFICATION_ENUM.SERVICE_CHARGES,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);
    },
    /**
     * 
     * @param {{to:any,from:any,area:any,propertyName:any}} obj 
     */
    releaseFinalArea:async function(obj){
        const deal = await fcmService.getDealDetails(obj.dealId);
        const model = new notificationModel({
            title:"Click here to proceed to releasing area to the buyer",
            description:"You can now release the area against "+deal.areaPurchased+" sq. ft. in "+deal.propertyName,
            redirectLink:"marketplace/order_requests/"+obj.dealId+"/seller",
            to:obj.to,
            from:obj.from,
            type:NOTIFICATION_ENUM.RELEASE,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);
    },
    /**
     * 
     * @param {{to:any,from:any,area:any,propertyName:any}} obj 
     */
    transactionSuccessfullBuyer:async function(obj){
        const model = new notificationModel({
            title:"Click here to review your portfolio balance",
            description:"Your area transaction against "+obj.area+" sq. ft. in "+obj.propertyName+" has been completed successfully",
            redirectLink:"active-investment/listing",
            to:obj.to,
            from:obj.from,
            type:NOTIFICATION_ENUM.TRANSACTION,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);
    },
    transferSuccessfullSender:async function(obj){
        const model = new notificationModel({
            title:"Click here to review your Transferred Area",
            description:"you have successfully transfered "+ obj.area +"  sq. ft. in " + obj.propertyName +" to "+ obj.receiverName +" on "+ obj.date +". This trasaction will reflect on the open Blockchain record in 2 to 3 working days.",
            redirectLink:"peer-to-peer/transfer-area",
            to:obj.to,
            from:obj.from,
            type:NOTIFICATION_ENUM.P2P_TRANSFER,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);
    },
    transferSuccessfullReceiver:async function(obj){
        const model = new notificationModel({
            title:"Click here to review your Received Area",
            description:"you have successfully received "+ obj.area +"  sq. ft. in " + obj.propertyName +" from "+ obj.senderName +" on "+ obj.date +". This trasaction will reflect on the open Blockchain record in 2 to 3 working days.",
            redirectLink:"peer-to-peer/transfer-area",
            to:obj.to,
            from:obj.from,
            type:NOTIFICATION_ENUM.P2P_RECEIVER,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);
    },
    approvedTransferAreaSuccessfull:async function(obj){
        const model = new notificationModel({
            title:"Click here to review your Received Area",
            description:"You received "+ obj.area +" sq. ft. of area in the project "+ obj.propertyName +" directly from "+ obj.senderName +" . The transaction is now reflected on Blockchain.",
            redirectLink:"/dashboard",
            to:obj.to,
            from:obj.from,
            type:NOTIFICATION_ENUM.P2P_APPROVED,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);
    },
    /**
     * 
     * @param {{to:any,from:any,area:any,propertyName:any}} obj 
     */
    transactionSuccessfullSeller:async function(obj){
        const property = await getProperty(obj.propertyName);
        const model = new notificationModel({
            title:"Click here to review your portfolio balance",
            description:"Your area transaction against "+obj.area+" sq. ft. in "+property.name+" has been completed successfully",
            redirectLink:"active-investment/listing",
            to:obj.to,
            from:obj.from,
            type:NOTIFICATION_ENUM.TRANSACTION,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);
    },

    /**
     * 
     * @param {Number} dealId 
     */
    marketplaceReview:async function(dealId){
        // const deal = await fcmService.getDealDetails(dealId);
        // this.marketplaceReviewBuyer({to:deal.buyerID,from:deal.sellerID,area:deal.areaPurchased,propertyName:deal.propertyName,seller:deal.sellerName,dealId});
        // this.marketplaceReviewSeller({to:deal.sellerID,from:deal.buyerID,area:deal.areaPurchased,propertyName:deal.propertyName,seller:deal.buyerName,dealId});
    },
    /**
     * 
     * @param {{to:any,from:any,area:any,propertyName:any,seller:string}} obj 
     * @param {{orderItemID:any}}
     */
    marketplaceReviewBuyer:async function(obj){

        const model = new notificationModel({
            title:"Click here to view the details",
            description:" has provided you the reviews against "+obj.area+" sq. ft. in "+obj.propertyName,
            redirectLink:"marketplace/order_requests/"+obj.dealId+"/buyer",
            to:obj.to,
            from:obj.from,
            type:NOTIFICATION_ENUM.REVIEW,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);
    },
    /**
     * 
     * @param {{to:any,from:any,area:any,propertyName:any,buyer:string}} obj 
     */
    marketplaceReviewSeller:async function(obj){
        const model = new notificationModel({
            title:"Click here to view the details",
            description:" has provided you the reviews against "+obj.area+" sq. ft. in "+obj.propertyName,
            redirectLink:"marketplace/order_requests/"+obj.dealId+"/seller",
            to:obj.to,
            from:obj.from,
            type:NOTIFICATION_ENUM.REVIEW,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);
    },
    /**
     * 
     * @param {{to:any,from:any,propertyName:any}} obj 
     */
    newProjectLaunched:async function(obj){
        const model = new notificationModel({
            title:"Click here to explore the new opportunities",
            description:" has successfully launched a new project "+obj.projectName,
            redirectLink:"property/listing",
            to:obj.to,
            from:obj.from,
            type:NOTIFICATION_ENUM.PROJECT_LOGO,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);
    },
    /**
     * 
     * @param {{to:any,from:any,round:any,propertyName:any}} obj 
     */
    newRoundLaunched:async function(obj){
        const model = new notificationModel({
            title:"Click here to explore the details",
            description:"has successfully launched Round "+obj.round+" of "+obj.propertyName,
            redirectLink:"property/listing",
            to:obj.to,
            from:obj.from,
            type:NOTIFICATION_ENUM.ROUND_LOGO,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);
    },
    /**
     * 
     * @param {{to:any,from:any,moduleName:any}} obj 
     */
    newModuleLaunched:async function(obj){
        const model = new notificationModel({
            title:"Click here to review the details",
            description:"has successfully lauched the new module "+obj.moduleName,
            redirectLink:"property/listing",
            to:obj.to,
            from:obj.from,
            type:NOTIFICATION_ENUM.MODULE_LOGO,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);
    },
     /**
     * 
     * @param {{to:any,from:any,round:any,date:any}} obj 
     */
    roundEndingSoon:async function(obj){
        const model = new notificationModel({
            title:"Click here to review the details",
            description:"is closing the current development round "+obj.round+" on "+obj.date,
            redirectLink:"property/listing",
            to:obj.to,
            from:obj.from,
            type:NOTIFICATION_ENUM.WELCOME,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);
    },

    userReviewsApproved:async function(obj) {
        const model = new notificationModel({
            title:"Click here to see the review",
            description:`left a review for you against ${obj.area} sq. ft. in ${obj.propertyName}`,
            redirectLink:`marketplace/order_requests/${obj.orderItemsID}/${obj.userType==='BUYER' ? 'buyer' : 'seller'}`,
            to:obj.to,
            from:obj.from,
            fromName: obj.fromName,
            type:NOTIFICATION_ENUM.USER_REVIEW_APPROVED,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);
    },

    userReviewsReminder:async function(obj) {
        const model = new notificationModel({
            title:"Click here to leave a review",
            description:`wants you to leave a review against ${obj.area} sq. ft. in ${obj.propertyName}`,
            redirectLink:`marketplace/order_requests/${obj.orderItemsID}/${obj.userType==='BUYER' ? 'buyer' : 'seller'}`,
            to:obj.to,
            from:obj.from,
            fromName: obj.fromName,
            type:NOTIFICATION_ENUM.USER_REVIEW_REMINDER,
            logo:""
        });
        model.create();
        socketService.emitNotification(obj.to,model);
    },

    getTradeactivityDetails:async function(id){
        const result = await core.fcmDb.execSelect("select * from tradeactivity where id = ?",[id]);
        if(result&&result.length>0){
            return result[0];
        }else{
            return null;
        }
    },
    getProperty:async function(id){
        const result = await core.fcmDb.execSelect("select * from property where id = ?",[id]);
        if(result&&result.length>0){
            return result[0];
        }else{
            return null;
        }
    }
}


module.exports = { notificationService }


