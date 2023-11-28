

const txdb = require('../../../Models/Admins/Transactions/transactiondetailsdb.js');
const awsutils = require('../../../utils/aws-utils.js');
const accountActivity = require('../../../Models/Shared/account-activity');
const agentInformation = require('../../../Models/Agents/getagentdetails.js');
const transactionAttachment = require('../../../Models/Investor/Transactions/ticketdetails');
const transactionModel = require('../../../Models/Investor/Transactions/transaction');
const mediaService = require('../../../services/shared/media');

const transactiondetails = function (req, res, next) {
    
        var jsonobject;
        let err = {};
        let activityObject = {
            subject: 'Transaction',
            action: 'User viewed transaction ID ' + req.body.queuenumber,
            userID: req.decoded.id,
            userAgent: req.headers['x-my-user-agent'] || req.headers['user-agent'],
            ipAddress: req.headers['my-user-ip'] || (req.headers['x-forwarded-for'] || '').split(',')[0]
        };
        let agentID = null;
         accountActivity.accountActivity(activityObject);
        let transactionAttachments=[] ;
        let oldTransactionAttachments = [];
        let newTransactionAttachments =[];
        let transactionData;
    
        txdb.txdetaildb(req.body.queuenumber)
            .then(function (result) { 
                transactionData = result[0];
                    agentID = result[0] && result[0].agentID;
                jsonobject = {
                    txdetails: {
                        queuenumber: req.body.queuenumber,
                        transactionstatus: result[0] && result[0].name,
                        paymentdate: result[0] && result[0].paymentDate,
                        billingaddress: result[0] && result[0].billingAddress,
                        areapledged: result[0] && result[0].areaPledged,
                        sqftprice: result[0] && result[0].sqftPrice,
                        totalprice: result[0] && result[0].totalPrice,
                        paymentmode: result[0] && result[0].paymentMode,
                        createdAt: result[0] && result[0].createdAt,
                        propertyName: result[0] && result[0].propertyName,
                        internalStatus:result[0] && result[0].internalStatus,
                        id:result[0] && result[0].id,
                        medium: result[0] && result[0].medium,
                    },
    
                    buyer: {
                        buyerId: result[0] && result[0].buyerId,
                        membershipid: result[0] && result[0].membershipNumber,
                        name: result[0] && result[0].buyerName,
                        email: result[0] && result[0].email,
                        ethereumpublicaddress: result[0] && result[0].walletAddress,
                        primarymobilenumber: result[0] && result[0].phoneNumber
    
    
                    },
    
                    seller: {
                        sellerId: result[0] && result[0].sellerId,
                        membershipid: result[0] && result[0].sellermembership,
                        name: result[0] && result[0].sellerName,
                        email: result[0] && result[0].selleremail,
                        ethereumpublicaddress: result[0] && result[0].sellethaddress,
                        sellerphone: result[0] && result[0].sellerphone
    
    
                    },
    
    
                    developmentrounds: {
                        developmentroundstage: result[0] && result[0].roundName,
                        startdate: result[0] && result[0].startDate,
                        enddate: result[0] && result[0].endDate,
    
    
    
                    },
                    agentDetails: {
                        agentName: null,
                        agentEmail: null
                    },
                    bankingDetails: result[0] && result[0].bankingDetails
                };
    
              
    
                return transactionAttachment.oldAttachments(result[0].id);
            }).then(function (result) {
                
                result.forEach(element => {
                    transactionAttachments.push(element);
                });
                oldTransactionAttachments.push(result);
             
                return transactionAttachment.newAttachments(req.body.queuenumber);
            })
            .then((result) => {
                result.forEach(element => {
                    transactionAttachments.push(element);
                });

                return jsonobject.txdetails.medium==='market_Place' ? transactionAttachment.marketplaceAttachments(req.body.queuenumber) : Promise.resolve([]);
            })
            .then(function(result){
                 
                result.forEach(element => {
                    element.isLocked = true;
                    transactionAttachments.push(element);
                });
                
               return mediaService.fetchMediaDetail(transactionData.buyerCnicFrontId);
            })
            .then(function(result){
                 
                if(result)
                    transactionAttachments.push(result);
                return mediaService.fetchMediaDetail(transactionData.buyerCnicBackId);
            })
            .then(function(result){
                
                if(result)
                    transactionAttachments.push(result);
                return mediaService.fetchMediaDetail(transactionData.sellerCnicFrontId);
            })
            .then(function(result){
                
                if(result)
                    transactionAttachments.push(result);
                return mediaService.fetchMediaDetail(transactionData.sellerCnicBackId);
            })

            // .then(function(result){
                 
            //     if(result)
            //         transactionAttachments.push(result);

            //     return mediaService.fetchMediaDetail(transactionData.sellerCnicFrontId);

            // })

            // .then(function(result){  
            //     if(result) 
            //         transactionAttachments.push(result);

            //     return mediaService.fetchMediaDetail(transactionData.sellerCnicBackId);

            // })
            .then(function(result){
                if(result)
                    transactionAttachments.push(result);
                jsonobject.attachments= transactionAttachments;
    
                jsonobject.attachments.sort(function(a,b){
                    return new Date(b.createdAt) - new Date(a.createdAt);
                  });
            
                if (agentID != null)
                    return agentInformation.fetchSalesAgentDetails(agentID);


            }).then(function (result) {
                 

                if (result) {
                    if(result.firstName || result.lastName){
                        jsonobject.agentDetails.agentName = result.firstName + ' ' + result.lastName;
                        jsonobject.agentDetails.agentEmail = result.email;
                    }
                    res.status(200).json({ error: false, message: true, data: jsonobject });
                }else{
                    res.status(200).json({ error: false, message: true, data: jsonobject });
                }
            }).catch(function (error) {
                 
                err.statusCode = 400;
                err.message = "Error occurred in fetching transaction detail";
                err.stackTrace = error;
                next(err);
                //         res.status(400).json({ error: true, message: 'Error occurred in fetching transaction detail' });
            })


}


const txattachments = function (req, res, next) {
    let err = {};
    let keyName = 'trade/' + req.body.keyname;
    awsutils.generateSignedUrl(keyName)
        .then(function (result) {
            // res.json({
            //     url: result
            // });
            res.status(200).json({ error: false, message: '', data: result });
        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error occurred in fetching transaction attachments";
            err.stackTrace = error;
            next(err);
            // res.status(400).json({ error: true, message: 'Error occurred in fetching tx attachments' });
        })

}




module.exports = { transactiondetails, txattachments };