
const Email = require('email-templates');
const sgMail = require("@sendgrid/mail");
const dotenv = require('dotenv');
const fs = require('fs');
const core = require('core');
dotenv.config();

sgMail.setApiKey(process.env.sendGridKey);
templates = {
    area_pledge: "d-36a0d399bd4b425c8ebb5bb164ce5492",
    transaction_approval: "d-1c64e826ad464c3ba65f955c57fdfd8e",
    advance_area_pledge:'d-bd3bfe813b1e462da59c958cdf25a2e5',
    advance_transaction_approval: 'd-f7f993285cb442fea5fc0d27eea2a870',
    marketplace_seller_order_notification_email : 'd-79bfb7bc651f4024b249672614ba4b0b',
    marketplace_payment_receive_notification_email : 'd-e9ebc5adf07c48e59dd7d4cb512856a7',
    marketplace_service_charges_admin_notification_email: 'd-46dfecff3b094f0b8fcc0479438038f7',
    marketplace_payment_approved_notification_email: 'd-124808b4fa7c4cb0b63edfc8875429a8',
    marketplace_full_payment_approved_notification_email : 'd-24aa30f4bdd645fb946eb8821658097d',
    marketplace_seller_notification_email : 'd-79bfb7bc651f4024b249672614ba4b0b',
    marketplace_bid_notification_email : 'd-3ea1c9e7de2548a1adf45c02ed2a8361',
    marketplace_bank_detail_Seller_notification_email: 'd-5640235175004373adb99f260a7b0033',
    marketplace_bank_detail_buyer_notification_email: 'd-ce7ae713aee54342a7cc2ac9997473e4',
    marketplace_seller_service_charges_notification_email: 'd-c555e2962ec34115af3e6766a32a53a3',
    marketplace_area_unlock_request_notification_email : 'd-a387753258dc4573be57f4fff4c8e1ef',
    marketplace_area_unlock_approval_notification_email : 'd-8b2fa59df67143ab8d2cd8d59e5315e7',
    marketplace_area_unlock_rejected_notification_email : 'd-dc3ab85795ce486a8d8b7ef1687b5cfc',
    marketplace_chat_notification_email : 'd-0451941300b141fea786847c4f6c494e',
    marketplace_seller_bid_receive_notification_email : 'd-1af29fcf40844c2a978653b719034163',
    marketplace_seller_release_area_notification_email : 'd-2d9e806b6f4d4650aac7a8d86675af68',
    marketplace_transaction_complete_notification_email : 'd-47a5e5bdeb60483681836d728730d0a7',
    marketplace_admin_area_notification_email: 'd-9c5f71024db84bd38e58434919b8825b',
    marketplace_service_charges_paid_notification_email: 'd-b2091ed93e084a198fbb51c77071df66',
    marketplace_review_notification_email: 'd-59731c665c694852b90cc9a29b229e73',
    transferarea_sender_notification_email: 'd-0ff612f081a8449da085e0d3783c89ab',
    transferarea_receiver_notification_email: 'd-5b49f635b121439b8bc730527e9b4c39',
    transferarea_approved_notification_email: 'd-e6ca8243813a4f1d8a16a7af097927ec',
    eidi_sender_notification_email: 'd-47c70082b68b461eb7de3792f4f63d6d',
    eidi_receivier_notification_email:'d-c859a0396d7a4ce6827f124e76b67c7f',
    send_rental_disbursement_reminder: 'd-84e4098867774cb9b628b224b21bc178'


};

var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PKR',
  
  });

  async function sendRentalDisbursementReminder(request) {
    const msg = {
        to: request.recieverEmail,
        from: 'noreply@daoproptech.com',
    templateId: templates['send_rental_disbursement_reminder'],
        subject: 'Rental Disbursement Reminder',
        dynamic_template_data: {
            name:request.name,
            projectName:request.propertyName
        }
    };



    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })


}

async function pledgeArea(request) {
    let templateSelected = templates['area_pledge'];
    if(request.roundStatus && request.roundStatus != 8 ){
        templateSelected = templates['advance_area_pledge'];
    }
    const msg = {
        to: request.investoremail,
        from: 'noreply@daoproptech.com',
        templateId: templateSelected,
        subject: 'Area Pledge',
        dynamic_template_data: {
            name: request.firstname,
            projectname: request.projectname,
            sqft: request.areaunits,
            fundinground: request.devround,
            sqftprice: request.currentprice,
            discount: request.discount,
            costprice: request.marketprice,
        }
    };


   console.log(sgMail);
    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            console.log(error);
            throw error;
        })
}


async function transactionApproval(request) {
    const msg = {
        to: request.receiver,
        from: 'noreply@daoproptech.com',
        templateId: templates['transaction_approval'],
        subject: 'Transaction Approval',
        dynamic_template_data: {
            name: request.firstName,
        }
    };



    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })


}


// Marketplace seller order notification email 

async function marketPlaceSellerOrderNotification(_request){
    console.log("Seller email check",_request);
    console.log("Seller email check",_request.sellerDetail);

    const msg = {
        to: _request.sellerDetail.email,
        from: 'noreply@daoproptech.com',
        templateId: templates['marketplace_seller_notification_email'],
        subject: "You've successfully placed your order on DAO Marketplace",
        dynamic_template_data: {
            name: _request.sellerDetail.legalName,
            projectname: _request.propertyName,
            areaSqft: _request.areaToSell,
            pricelisted: _request.pricePerSqFt
        }
    };

    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })

}
async function transferAreaSenderNotification(obj){
    
    console.log('transferAreaSenderNotification : ',obj)

    const msg = {
        to: obj.senderEmail,
        from: 'noreply@daoproptech.com',
        templateId: templates['transferarea_sender_notification_email'],
        subject: "You've successfully transfer your area",
        dynamic_template_data: {
            senderName: obj.senderName,
            receiverName: obj.receiverName,
            projectName: obj.propertyName,
            areaSqft: obj.area,
            url: process.env.portalurl+'peer-to-peer/transfer-area'
        }
    };

    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })

}

async function transferAreaReceiverNotification(obj){
    
    console.log('transferAreaReceiverNotification : ',obj)

    const msg = {
        to: obj.receiverEmail,
        from: 'noreply@daoproptech.com',
        templateId: templates['transferarea_receiver_notification_email'],
        subject: "You've successfully received area",
        dynamic_template_data: {
            senderName: obj.senderName,
            receiverName: obj.receiverName,
            projectName: obj.propertyName,
            areaSqft: obj.area,
            url: process.env.portalurl+'peer-to-peer/transfer-area'
        }
    };

    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
}
async function approvedTransferArea(obj){
    
    console.log('approvedTransferAreaNotification : ',obj)

    const msg = {
        to: obj.receiverEmail,
        from: 'noreply@daoproptech.com',
        templateId: templates['transferarea_approved_notification_email'],
        subject: "You've successfully received area",
        dynamic_template_data: {
            senderName: obj.senderName,
            receiverName: obj.receiverName,
            projectName: obj.propertyName,
            areaSqft: obj.area,
            url: process.env.portalurl+'/dashboard'
        }
    };

    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
}




async function marketPlaceBidOrderNotification(_request){
  
    const msg = {
        to: _request.buyerDetail.email,
        from: 'noreply@daoproptech.com',
        templateId: templates['marketplace_bid_notification_email'],
        subject: "You have successfully placed a bid on DAO Marketplace",
        dynamic_template_data: {
            name: _request.buyerDetail.legalName,
            orderno: _request.orderID,
            url: process.env.portalurl+'marketplace/order_requests/'+_request.orderID+'/buyer'
        }
    };



    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
}



async function marketPlaceBankRequestOrderNotification(_request){
    console.log("_request",_request);
    const msg = {
        to: _request.email,
        from: 'noreply@daoproptech.com',
        templateId: templates['marketplace_bank_detail_Seller_notification_email'],
        subject: "You have successfully placed a bid on DAO Marketplace",
        dynamic_template_data: {
            name: _request.name,
            orderno: _request.orderId,
            url: process.env.portalurl+'marketplace/order_requests/'+_request.orderId+'/seller'
        }
    };



    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
}



async function marketPlaceSellOrderEmail(_request){
  
    
    const msg = {
        to: _request.sellerDetail.email,
        from: 'noreply@daoproptech.com',
        templateId: templates['marketplace_seller_order_notification_email'],
        subject: 'Order received',
        dynamic_template_data: {
            name: _request.sellerDetail.legalName,
            areaSqft: _request.areaPurchased,
            totalPrice: _request.Total,
            orderNo: _request.orderID
        }
    };



    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })

}

async function marketplacePaymentReceivedNotification(_request){
    let date = new Date();
    console.log("Request",_request);
 
 
    let _to = _request.sellerDetail.email;
    // if(_request.paymentType === core.enums.orderPaymentTypeEnum.servicecharges ){
    //     templateSelected = templates['marketplace_service_charges_admin_notification_email'];
    //     _to = 'muhammad.obaid@daoproptech.com';
       
    // }

 
    const msg = {
        to: _to,
        from: 'noreply@daoproptech.com',
        templateId: templates['marketplace_payment_receive_notification_email'],
        subject: 'The buyer has made a payment',
        dynamic_template_data: {
            name: _request.sellerDetail.legalName,
            totalAmount: _request.paymentAmount,
            paymentType: core.enums.orderPaymentTypeEnumEmail[_request.paymentType],
            orderno: _request.orderId,
            url: process.env.portalurl+'marketplace/order_requests/'+_request.orderId+'/seller'
            // dateplus7days: (date.setDate(date.getDate() + 7))
        }
    };


    

    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            console.log(error);
            throw error;
        })
}

async function marketplacePaymentApprovedNotification(_request){
  
   
   console.log("request",_request);
    const msg = {
        to: _request.buyer.email,
        from: 'noreply@daoproptech.com',
        templateId: templates['marketplace_payment_approved_notification_email'],
        subject: 'Payment Approved',
        dynamic_template_data: {
            name: _request.buyer.legalName,
            orderno: _request.id,
            url: process.env.portalurl+'marketplace/order_requests/'+_request.id+'/buyer'
        }
    };

 console.log("request",msg);

    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })

}


async function marketPlaceFullPaymentApprovedNotification(_request){
  
   
    const msg = {
        to: _request.buyer.email,
        from: 'noreply@daoproptech.com',
        templateId: templates['marketplace_full_payment_approved_notification_email'],
        subject: 'Payment Approved',
        dynamic_template_data: {
            name: _request.buyer.legalName,
            orderNo: _request.id
        }
    };


 console.log("Full payment Notification",msg);
    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })

}


async function marketPlaceBankBuyerNotificationEmail(_request){
    const msg = {
        to: _request.email,
        from: 'noreply@daoproptech.com',
        templateId: templates['marketplace_bank_detail_buyer_notification_email'],
        subject: "The seller has confirmed their bank details",
        dynamic_template_data: {
            name: _request.name,
            orderno: _request.orderId,
            url: process.env.portalurl+'marketplace/order_requests/'+_request.orderId+'/buyer'
        }
    };




    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
}


async function marketPlaceSellerServiceChargesNotificationEmail(_request){
    const msg = {
        to: _request.email,
        from: 'noreply@daoproptech.com',
        templateId: templates['marketplace_seller_service_charges_notification_email'],
        subject: "Your area sale transaction is almost complete",
        dynamic_template_data: {
            name: _request.legalName,
            orderno: _request.dealId,
            url: process.env.portalurl+'marketplace/order_requests/'+_request.dealId+'/seller'
            
        }
    };




    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
}


async function marketPlaceAdminNotificationEmail(_request){
   
    const msg = {
        to: 'muhammad.obaid@daoproptech.com',
        from: 'noreply@daoproptech.com',
        templateId: templates['marketplace_service_charges_admin_notification_email'],
        
       
        dynamic_template_data: {
            orderno: _request.id,
            DAOid: _request.seller.membershipNumber,
            projectname: _request.projectName,
            areaSqft: _request.areaToSell
            
        }
    };




    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
}


async function marketPlaceApprovedAreaNotification(_request){
    
      const msg = {
        to: 'muhammad.obaid@daoproptech.com',
        from: 'noreply@daoproptech.com',
        templateId: templates['marketplace_service_charges_admin_notification_email'],
        
       
        dynamic_template_data: {
            orderno: _request.id,
            DAOid: _request.seller.membershipNumber,
            projectname: _request.projectName,
            areaSqft: _request.areaToSell
            
        }
    };




    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
}

async function marketPlaceAreaUnlockRequestNotification(_request){
    const msg = {
        to: _request.sellerEmail,
        from: 'noreply@daoproptech.com',
        templateId: templates['marketplace_area_unlock_request_notification_email'],
        
       
        dynamic_template_data: {
            name: _request.sellerName,
            DAOid: _request.membershipNumber,
            areaSqft: _request.area
            
        }
    };




    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
}


async function adminApproveArea(_request){
  console.log("Request" ,_request);
        const msg = {
        to: 'muhammad.obaid@daoproptech.com',
        from: 'noreply@daoproptech.com',
        templateId: templates['marketplace_area_unlock_request_notification_email'],
        
       
        dynamic_template_data: {
            orderno: _request.id,
            DAOid: _request.seller.membershipNumber,
            projectname: _request.projectName,
            areaSqft: _request.areaToSell,
          
            
        }
    };




    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })

}


async function marketPlaceAreaUnlockRequestAcceptedNotification(_request){
    const msg = {
        to: _request.email,
        from: 'noreply@daoproptech.com',
        templateId: templates['marketplace_area_unlock_approval_notification_email'],
        
       
        dynamic_template_data: {
            name: _request.legalName,
            DAOid: _request.membershipNumber,
            areaSqft: _request.area,
            areaSqft: _request.area,
            projectname: _request.propertyName,
            
        }
    };




    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
}


async function marketPlaceAreaUnlockRequestRejectedNotification(_request){
    const msg = {
        to: _request.email,
        from: 'noreply@daoproptech.com',
        templateId: templates['marketplace_area_unlock_rejected_notification_email'],
        
       
        dynamic_template_data: {
            name: _request.legalName,
        }
    };




    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
}


async function marketplaceChatNotification(_request){
 
    let senderType = (_request.senderType == 1 ) ? 'seller' : 'buyer';
    const msg = {
        to: _request.email,
        from: 'noreply@daoproptech.com',
        templateId: templates['marketplace_chat_notification_email'],
        
       
        dynamic_template_data: {
            name: _request.legalName,
            orderno: _request.orderItemId,
            buyerorseller: senderType,
            url: process.env.portalurl+'marketplace/order_requests/'+_request.orderItemId+'/'+senderType
        }
    };




    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
}
async function marketplaceSellerBidNotificationEmail(_request){
    console.log("Seller Notification Bid email",_request);
    const msg = {
        to: _request.sellerDetail.email,
        from: 'noreply@daoproptech.com',
        templateId: templates['marketplace_seller_bid_receive_notification_email'],

        
       
        dynamic_template_data: {
            name: _request.sellerDetail.legalName,
            orderno: _request.orderID,
            projectname: _request.projectname,
            totalareaSqft: _request.totalareaSqft,
            pledgedareaSqft : _request.areaPurchased,
            dateplus7days: _request.dueDate,
            url: process.env.portalurl+'marketplace/seller/active/'+_request.orderID
        }
    };




    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
}

async function marketplaceTransactionCompleteNotification(_request,buyer){
    let senderType = (buyer) ? 'buyer' : 'seller';
    const msg = {
        to: _request.email,
        from: 'noreply@daoproptech.com',
        templateId: templates['marketplace_transaction_complete_notification_email'],
        
       
        dynamic_template_data: {
            name: _request.legalName,
            orderno: _request.dealId,
            url: process.env.portalurl+'marketplace/order_requests/'+_request.dealId+'/'+senderType

        }
    };




    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
}


async function marketplaceAdminAreaUnlockNotification(_request){
    const msg = {
        to: 'muhammad.obaid@daoproptech.com',
        from: 'noreply@daoproptech.com',
        templateId: templates['marketplace_transaction_complete_notification_email'],
        
       
        dynamic_template_data: {
            DAOid: _request.legalName,
            projectname: _request.projectName,
            areaSqft : _request.areaSqft
        }
    };




    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
}


async function marketplaceSellerAreaReleaseNotification(_request){
  
    const msg = {
        to: _request.seller.email,
        from: 'noreply@daoproptech.com',
        templateId: templates['marketplace_seller_release_area_notification_email'],
        
       
        dynamic_template_data: {
            name: _request.seller.legalName,
            orderno: _request.id,
            url: process.env.portalurl+'marketplace/order_requests/'+_request.id+'/seller'
        }
    };




    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
}


async function adminAreaUnlockNotification(_request){
    
    const msg = {
        to: 'muhammad.obaid@daoproptech.com',
        from: 'noreply@daoproptech.com',
        templateId: templates['marketplace_admin_area_notification_email'],
        
       
        dynamic_template_data: {
            DAOid: _request.membershipNumber,
            projectname: _request.propertyName,
            areaSqft: _request.area
        }
    };




    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
}

async function marketplace_service_charges_paid_notification_email(_request){
    const msg = {
        to: _request.sellerDetail.email,
        from: 'noreply@daoproptech.com',
        templateId: templates['marketplace_admin_area_notification_email'],
        
       
        dynamic_template_data: {
            name: _request.sellerDetail.legalName,
            orderno: _request.dealId,
            url: process.env.portalurl+'marketplace/order_requests/'+_request.dealId+'/seller'
        }
    };




    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
}


async function marketplace_review_notification_email(_request,buyer){
   
    let senderType = (buyer) ? 'buyer' : 'seller';
    const msg = {
        to: _request.email,
        from: 'noreply@daoproptech.com',
        templateId: templates['marketplace_review_notification_email'],
        
       
        dynamic_template_data: {
            name: _request.legalName,
            orderno: _request.dealId,
            url: process.env.portalurl+'marketplace/order_requests/'+_request.dealId+'/'+senderType
        }
    };




    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
}



async function eidi_sender_notification_email(_request){

   
    const msg = {
        to: _request.senderEmail,
        from: 'noreply@daoproptech.com',
        templateId: templates['eidi_sender_notification_email'],
        
       
        dynamic_template_data: {
            senderName : _request.senderName,
            receipient_name: _request.firstName,
            recipient_email: _request.email,
            recipient_phone : _request.phoneNumber,
            sqft : _request.sqft,
            project_name : _request.projectName,
           
        }
    };




    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
      
            throw error;
        })
}


async function eidi_receiver_notification_email(_request){
   
    
    const msg = {
        to: _request.email,
        from: 'noreply@daoproptech.com',
        templateId: templates['eidi_receivier_notification_email'],
        
       
        dynamic_template_data: {
            name: _request.firstName,
            sqft: _request.sqft,
            senderName: _request.senderName,
            url: process.env.portalurl+'eidi-transfer'
        }
    };




    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
           
            throw error;
        })
}



module.exports.pledgeArea = pledgeArea;
module.exports.sendRentalDisbursementReminder = sendRentalDisbursementReminder;
module.exports.transactionApproval = transactionApproval;
module.exports.marketPlaceSellOrderEmail = marketPlaceSellOrderEmail;
module.exports.marketplacePaymentReceivedNotification = marketplacePaymentReceivedNotification;
module.exports.marketPlaceFullPaymentApprovedNotification = marketPlaceFullPaymentApprovedNotification;
module.exports.marketplacePaymentApprovedNotification =marketplacePaymentApprovedNotification;
module.exports.marketPlaceSellerOrderNotification = marketPlaceSellerOrderNotification;
module.exports.marketPlaceBidOrderNotification = marketPlaceBidOrderNotification;
module.exports.marketPlaceBankRequestOrderNotification = marketPlaceBankRequestOrderNotification;
module.exports.marketPlaceBankBuyerNotificationEmail = marketPlaceBankBuyerNotificationEmail;
module.exports.marketPlaceSellerServiceChargesNotificationEmail = marketPlaceSellerServiceChargesNotificationEmail;
module.exports.marketPlaceAdminNotificationEmail = marketPlaceAdminNotificationEmail;
module.exports.adminApproveArea = adminApproveArea;
module.exports.marketPlaceAreaUnlockRequestNotification = marketPlaceAreaUnlockRequestNotification;
module.exports.marketPlaceAreaUnlockRequestAcceptedNotification = marketPlaceAreaUnlockRequestAcceptedNotification;
module.exports.marketPlaceAreaUnlockRequestRejectedNotification = marketPlaceAreaUnlockRequestRejectedNotification;
module.exports.marketplaceChatNotification = marketplaceChatNotification;
module.exports.marketplaceSellerBidNotificationEmail = marketplaceSellerBidNotificationEmail;
module.exports.marketplaceTransactionCompleteNotification = marketplaceTransactionCompleteNotification;
module.exports.marketplaceAdminAreaUnlockNotification = marketplaceAdminAreaUnlockNotification;
module.exports.marketplaceSellerAreaReleaseNotification = marketplaceSellerAreaReleaseNotification;
module.exports.adminAreaUnlockNotification = adminAreaUnlockNotification;
module.exports.marketplace_service_charges_paid_notification_email = marketplace_service_charges_paid_notification_email;
module.exports.marketplace_review_notification_email  = marketplace_review_notification_email;
module.exports.transferAreaSenderNotification  = transferAreaSenderNotification;
module.exports.transferAreaReceiverNotification  = transferAreaReceiverNotification;
module.exports.approvedTransferArea  = approvedTransferArea;
module.exports.eidi_sender_notification_email = eidi_sender_notification_email;
module.exports.eidi_receiver_notification_email = eidi_receiver_notification_email;