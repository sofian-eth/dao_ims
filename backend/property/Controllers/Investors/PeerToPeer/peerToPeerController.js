const { transferAreaRequest } = require("core/dto/requests/transferAreaRequest");
const receiptGeneration = require('../../../services/shared/receipt');
const getMedia = require('../../../services/shared/media');
const awsutils = require('../../../utils/aws-utils');
const emailUtils = require('../../../utils/email');
const fcmService = require("../../../services/fcm/fcm.service");
const { notificationService } = require("../../../services/notification/notificationCenter");
const moment = require("moment");
const dotenv = require('dotenv');
const qrCode = require('qrcode');
const { logActivity } = require("../../../services/shared/activity-logger");
dotenv.config();

const controller = {};
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */

controller.transferArea = async function(req, res, next){
    try{
        // debugger;
        req.body['userId'] = req.decoded.id;
        let successDetail = {};
        successDetail.currentDate = new Date().toDateString();
        if (req.body) {
            const request = new transferAreaRequest(req.body);
            if (!request.validate()) {
                return res.Error("Invalid fields", "TRANSFER_AREA_INVALID_REQUEST");
            }
            const findProject = await request.projectName();
            if (findProject.length > 0) {
                successDetail.projectName = findProject[0].name;
                successDetail.projectLogo = findProject[0].propertyLogo;
                successDetail.portfolio = findProject[0].portfolio;
            }
            const findSender = await request.sellerName();
            if (findSender.length > 0) {
                successDetail.senderId = findSender[0].id;
                successDetail.senderName = findSender[0].senderName;
                successDetail.senderEmail = findSender[0].senderEmail;
                successDetail.senderWalletAddress = findSender[0].senderWalletAddress;
            }
            const findReceiver = await request.checkWalletAddress();
            if (findReceiver.length > 0) {
                successDetail.receiverId = findReceiver[0].receiverId
                successDetail.receiverName = findReceiver[0].receiverName
                successDetail.receiverEmail = findReceiver[0].receiverEmail
                successDetail.receiverWalletAddress = req.body.walletAddress
            } else {
                return res.Error("Wallet Address is not valid.", "TRANSFER_AREA_INVALID_REQUEST");
            }
          
            const checkOwner = await request.checkOwner();
            if (checkOwner.length > 0) {
                // debugger
                area = req.body.area;
                ownerId = checkOwner[0].ownerID;
                req.body['ownerId'] = ownerId;
                req.body['receiverId'] = successDetail.receiverId;
                if(req.body.chargesPaidBy == 'Sender'){
                    req.body['areaToOwner'] =  ((req.body.area/100) *req.body.serviceChargesPercet);
                    req.body['areaToReceiver'] = req.body.area;
                    req.body['senderPortfolio'] = successDetail.portfolio - (req.body["areaToOwner"] + req.body["areaToReceiver"]);
                    successDetail.area = req.body['areaToReceiver'];
                    if(req.body["senderPortfolio"] < 0){
                        return res.Error("Area Transfered failed", "TRANSFER_AREA_FAILED");
                    }
                }
                if(req.body.chargesPaidBy == 'Receiver'){
                    req.body['areaToOwner'] =  ((req.body.area/100) *req.body.serviceChargesPercet);
                    req.body['areaToReceiver'] = req.body.area - ((req.body.area/100) *req.body.serviceChargesPercet);
                    req.body['senderPortfolio'] = successDetail.portfolio - req.body.area;
                    successDetail.area = req.body['areaToReceiver'];
                    if(req.body['senderPortfolio'] < 0){
                        return res.Error("Area Transfered failed", "TRANSFER_AREA_FAILED");
                    }
                }
                // debugger
                successDetail.chargesPaidBy = req.body.chargesPaidBy;
                successDetail.serviceCharges = req.body['areaToOwner'];
                successDetail.transferTo = req.body.transferTo;
                successDetail.internalStatus = 'verified';
                successDetail.chargesPaidBy = req.body.chargesPaidBy;
                successDetail.network = req.body.network;
                successDetail.blockchainReference = '';
                req.body['p2pDetail'] = JSON.stringify({
                    chargesPaidBy : req.body.chargesPaidBy,
                    serviceCharges : req.body['areaToOwner'],
                    transferTo:req.body.transferTo
                  })
            } else {
                return res.Error("Invalid Property Owner.", "TRANSFER_AREA_INVALID_REQUEST");
            }
            const updatedRequest = new transferAreaRequest(req.body);
            const result = await updatedRequest.transferArea();
            if (result.success) {

                req.body['tradeId'] = result.id;
                successDetail.tradeId = req.body['tradeId'];
                fcmService.areaReceived(req.body.receiverId,successDetail.senderName,req.body.areaToReceiver,successDetail.currentDate,successDetail.projectName);
                
                notificationService.transferSuccessfullSender({to:req.body.userId,from:req.body.receiverId,area:req.body.areaToReceiver,propertyName:successDetail.projectName,date:successDetail.currentDate,receiverName:successDetail.receiverName});
                notificationService.transferSuccessfullReceiver({to:req.body.receiverId,from:req.body.userId,area:req.body.areaToReceiver,propertyName:successDetail.projectName,date:successDetail.currentDate,senderName:successDetail.senderName});
                
                emailUtils.transferAreaSenderNotification({senderEmail:successDetail.senderEmail,area:req.body.areaToReceiver,propertyName:successDetail.projectName,receiverName:successDetail.receiverName,senderName:successDetail.senderName});
                emailUtils.transferAreaReceiverNotification({receiverEmail:successDetail.receiverEmail,area:req.body.areaToReceiver,propertyName:successDetail.projectName,senderName:successDetail.senderName,receiverName:successDetail.receiverName});
                
                return res.Success(successDetail, "Success");
            }
        }
            }catch (e) {
                console.log("error : ",e)
                res.Error(e.toString(), "TRANSFER_AREA_EXCEPTION")
            }
}

// controller.transferAreas = async function (req, res, next) {
//     try {
       
//         req.body["userId"] = req.decoded.id;
//         let successDetail={}
//         let currentDate = new Date().toDateString();
//         if (req.body) {
//             const request = new transferAreaRequest(req.body);
//             if (!request.validate()) {
//                 return res.Error("Invalid fields", "TRANSFER_AREA_INVALID_REQUEST");
//             }
//             const findProject = await request.projectName();
//             if (findProject.length > 0) {
//                 successDetail.projectName = findProject[0].name;
//                 successDetail.projectLogo = findProject[0].propertyLogo;
//                 successDetail.portfolio = findProject[0].portfolio;
//             }
//             const findSender = await request.sellerName();
//             if (findSender.length > 0) {
//                 successDetail.senderName = findSender[0].senderName;
//                 successDetail.senderWalletAddress = findSender[0].senderEmail;
//                 successDetail.senderWalletAddress = findSender[0].senderWalletAddress;
//             }
//             const findReceiver = await request.checkWalletAddress();
//             if (findReceiver.length > 0) {
//                 successDetail.receiverId = findReceiver[0].receiverId
//                 successDetail.receiverName = findReceiver[0].receiverName
//                 successDetail.receiverName = findReceiver[0].receiverEmail
//             } else {
//                 return res.Error("Wallet Address is not valid.", "TRANSFER_AREA_INVALID_REQUEST");
//             }



//             const checkOwner = await request.checkOwner();
//             if (checkOwner.length > 0) {
//                 successDetail.ownerId = checkOwner[0].ownerID;
//                 successDetail.ownerWalletAddress = checkOwner[0].ownerWalletAddress;

//                 successDetail.areaToTransfer = req.body.area
//                 successDetail.chargesPaidBy = req.body.chargesPaidBy
//                 successDetail.network = req.body.network
//                 successDetail.transferTo = req.body.transferTo
//                 successDetail.serviceChargesPercet = req.body.serviceChargesPercet
//                 successDetail.serviceCharges = successDetail.areaToTransfer / req.body.serviceChargesPercet;
                
                // let obj = JSON.stringify({
                //     chargesPaidBy : successDetail.chargesPaidBy,
                //     serviceCharges : successDetail.serviceCharges,
                //     transferTo:successDetail.transferTo
                //   })


//                 if(successDetail.chargesPaidBy == 'Sender'){
//                     successDetail.areaToOwner =  successDetail.serviceCharges;
//                     successDetail.areaToReceiver = successDetail.areaToTransfer;
//                     successDetail.senderPortfolio = successDetail.portfolio - (successDetail.areaToTransfer + successDetail.serviceCharges);

//                 }
//                 if(successDetail.chargesPaidBy == 'receiver'){
//                     successDetail.areaToOwner =  successDetail.serviceCharges;
//                     successDetail.areaToReceiver = successDetail.areaToTransfer - successDetail.serviceCharges;
//                     successDetail.senderPortfolio = successDetail.portfolio - successDetail.areaToTransfer;
//                 }


//                 // serviceCharges = checkOwner[0].config.serviceCharges.seller.peerToPeerPercentage || checkOwner[0].config.serviceCharges.seller.percentage;
//                 // ownerCharges = parseFloat(((area / 100) * serviceCharges).toFixed(2));
//                 // calculatedArea = parseFloat((area - ownerCharges).toFixed(2));
//                 // req.body["ownerId"] = ownerId;
//                 // req.body["ownerCharges"] = ownerCharges;
//                 // req.body["area"] = calculatedArea;
//                 // req.body["buyerId"] = buyerId;
//             } else {
//                 return res.Error("Invalid Property Owner.", "TRANSFER_AREA_INVALID_REQUEST");
//             }
//             debugger
//             console.log('successDetail  : ',successDetail)
//             const updatedRequest = new transferAreaRequest(req.body);
//             const result = await updatedRequest.transferArea();
//             if (result.success) {
//                 return
//                 // logActivity(
//                 //     {
//                 //             logName: "Transfer Area",
//                 //             description: "Transfered area",
//                 //             subjectID: result.id,
//                 //             subjectType: "tradeactivity",
//                 //             event: "Created",
//                 //             causerID: req.decoded.id,
//                 //             causerType: "users",
//                 //             properties: {
//                 //                 attributes: {
//                 //                     dispID: result.id,
//                 //                     area: req.body.area,
//                 //                     buyerId: req.body.buyerId,
//                 //                     project: req.body.project
              
//                 //                 },
//                 //                 old: null
//                 //             },
//                 //             source: null,
//                 //             metadata:null
//                 //         }
//                 //         ,req)
//                 fcmService.areaReceived(req.body.receiverId,successDetail.senderName,calculatedArea,currentDate,projectName);
                
//                 notificationService.transferSuccessfullSender({to:req.body.userId,from:req.body.receiverId,area:calculatedArea,propertyName:projectName,date:currentDate,receiverName:receiverName});
//                 notificationService.transferSuccessfullReceiver({to:req.body.receiverId,from:req.body.userId,area:calculatedArea,propertyName:projectName,date:currentDate,senderName:senderName});
                
//                 emailUtils.transferAreaSenderNotification({senderEmail:senderEmail,area:calculatedArea,propertyName:projectName,receiverName:receiverName,senderName:senderName});
//                 emailUtils.transferAreaReceiverNotification({receiverEmail:receiverEmail,area:calculatedArea,propertyName:projectName,senderName:senderName,receiverName:receiverName});
                
//                 return res.Success('Area Transferrd Successfully', "Success");
//             } else {
//                 res.Error("DB Error", "SOMETHING_WENT_WRONG.");
//             }
//         }
//     } catch (e) {
//         console.log("error : ",e)
//         res.Error(e.toString(), "TRANSFER_AREA_EXCEPTION")
//     }
// }
// controller.transferArea = async function (req, res, next) {
//     try {
//         // req.body["userId"] = 477;

//         // area: 1
//         // chargesPaidBy: "receiver"
//         // network: "eth"
//         // propertyId: 2
//         // serviceCharges: 0.95
//         // transferTo: 5
//         // walletAddress: "0x702cc81ba6321480fde060d5b7d1ad7ad3b47197"
       
//         req.body["userId"] = req.decoded.id;
//         let buyerId;
//         let buyerName;
//         let sellerName;
//         let projectName;
//         let area;
//         let ownerId;
//         let serviceCharges;
//         let ownerCharges;
//         let calculatedArea;
//         let sellerEmail;
//         let buyerEmail;
//         let currentDate = new Date().toDateString();
//         if (req.body) {
//             const request = new transferAreaRequest(req.body);
//             if (!request.validate()) {
//                 return res.Error("Invalid fields", "TRANSFER_AREA_INVALID_REQUEST");
//             }
//             const findprojectName = await request.projectName();
//             if (findprojectName.length > 0) {
//               projectName = findprojectName[0].name;
//             }
//             const findSellerName = await request.sellerName();
//             if (findSellerName.length > 0) {
//               sellerName = findSellerName[0].legalName;
//               sellerEmail = findSellerName[0].sellerEmail
//             }
//             const findBuyerId = await request.checkWalletAddress();
//             if (findBuyerId.length > 0) {
//                 buyerId = findBuyerId[0].buyerId
//                 buyerName = findBuyerId[0].legalName
//                 buyerEmail = findBuyerId[0].buyerEmail
//             } else {
//                 return res.Error("Wallet Address is not valid.", "TRANSFER_AREA_INVALID_REQUEST");
//             }
            // const checkOwner = await request.checkOwner();
            // if (checkOwner.length > 0) {
            //     area = req.body.area;
            //     ownerId = checkOwner[0].ownerID;
//                 serviceCharges = checkOwner[0].config.serviceCharges.seller.peerToPeerPercentage || checkOwner[0].config.serviceCharges.seller.percentage;
//                 ownerCharges = parseFloat(((area / 100) * serviceCharges).toFixed(2));
//                 calculatedArea = parseFloat((area - ownerCharges).toFixed(2));
//                 req.body["ownerId"] = ownerId;
//                 req.body["ownerCharges"] = ownerCharges;
//                 req.body["area"] = calculatedArea;
//                 req.body["buyerId"] = buyerId;
//             } else {
//                 return res.Error("Invalid Property Owner.", "TRANSFER_AREA_INVALID_REQUEST");
//             }
//             const updatedRequest = new transferAreaRequest(req.body);
//             const result = await updatedRequest.transferArea();
//             if (result.success) {
                
//                 logActivity(
//                     {
//                             logName: "Transfer Area",
//                             description: "Transfered area",
//                             subjectID: result.id,
//                             subjectType: "tradeactivity",
//                             event: "Created",
//                             causerID: req.decoded.id,
//                             causerType: "users",
//                             properties: {
//                                 attributes: {
//                                     dispID: result.id,
//                                     area: req.body.area,
//                                     buyerId: req.body.buyerId,
//                                     project: req.body.project
              
//                                 },
//                                 old: null
//                             },
//                             source: null,
//                             metadata:null
//                         }
//                         ,req)
//                 fcmService.areaReceived(req.body.buyerId,sellerName,calculatedArea,currentDate,projectName);
                
//                 notificationService.transferSuccessfullSender({to:req.body.userId,from:req.body.buyerId,area:calculatedArea,propertyName:projectName,date:currentDate,receiverName:buyerName});
//                 notificationService.transferSuccessfullReceiver({to:req.body.buyerId,from:req.body.userId,area:calculatedArea,propertyName:projectName,date:currentDate,senderName:sellerName});
                
//                 emailUtils.transferAreaSenderNotification({senderEmail:sellerEmail,area:calculatedArea,propertyName:projectName,receiverName:buyerName,senderName:sellerName});
//                 emailUtils.transferAreaReceiverNotification({receiverEmail:buyerEmail,area:calculatedArea,propertyName:projectName,senderName:sellerName,receiverName:buyerName});
                
//                 return res.Success('Area Transferrd Successfully', "Success");
//             } else {
//                 res.Error("DB Error", "SOMETHING_WENT_WRONG.");
//             }
//         }
//     } catch (e) {
//         console.log("error : ",e)
//         res.Error(e.toString(), "TRANSFER_AREA_EXCEPTION")
//     }
// }

controller.recentTransferArea = async function (req, res, next) {
    // req.body["userId"] = 477;
    req.body["userId"] = req.decoded.id;
    const request = new transferAreaRequest(req.body);
    request.pageno = (req?.query && req.query?.pageno) ? parseInt(req.query.pageno) : 1;
    request.pagesize = (req?.query && req.query?.pagesize) ? parseInt(req.query.pagesize) :50;
    request.search = (req?.query && req.query?.search) ? req.query.search :'';
    const result = await request.recentTransferArea();

    const result2 = await request.myArea();
    if (result.length == 0) {
        return res.Error("No transfer found", "NO_TRANSFER_FOUND");
    } else {
       
        //  debugger;
        // for (var i = 0; i < result.length; i++) {
        //     if (req.body.userId == result[i].senderId) {
        //         result[i]['type'] = 'Transferred'
        //     }
        //     if (req.body.userId == result[i].receiverID) {
        //         result[i]['type'] = 'Received'
        //     }
        //     let totalArea = result2.filter(function (property) {
        //         if (property.propertyId == result[i].projectId) {
        //             result[i]['senderTotalArea'] = property.totalSqft;
        //         }
        //     })
        // }
        return res.Success(result, "Success");
    }
}

controller.frequentRecipients = async function (req, res, next) {
    
    // req.body["userId"] = 477;
    req.body["userId"] = req.decoded.id;
    const request = new transferAreaRequest(req.body);
    request.pageno = (req?.query && req.query?.pageno) ? parseInt(req.query.pageno) : 1;
    request.pagesize = (req?.query && req.query?.pagesize) ? parseInt(req.query.pagesize) :50;
    request.search = (req?.query && req.query?.search) ? req.query.search :'';
    const result = await request.frequentRecipients();
    if (!result) {
        return res.Error("No frequent recipients found", "NO_FREQUIENT_RECIPIENTS_FOUND");
    } else {
        return res.Success(result, "Success");
    }
}
controller.deleteRecipient = async function (req, res, next) {
    // req.body["userId"] = 477;
    req.body["userId"] = req.decoded.id;
    const request = new transferAreaRequest(req.body);
    const result = await request.deleteRecipient();
    if (!result) {
        return res.Error("Unable to delete recipient, please try again.", "ERROR_OCCURRED");
    } else {
        return res.Success("Recipient deleted successfully.", "Success");
    }
}
controller.editRecipient = async function (req, res, next) {
    // req.body["userId"] = 477;
    req.body["userId"] = req.decoded.id;
    const request = new transferAreaRequest(req.body);
    const result = await request.editRecipient();
    if (!result) {
        return res.Error("Unable to edit recipient, please try again.", "ERROR_OCCURRED");
    } else {
        return res.Success("Recipient edited successfully.", "Success");
    }
}

controller.postFrequentRecipients = async function (req, res, next) {
    req.body["userId"] = req.decoded.id;
    // req.body["buyerId"] = req.body.buyerId;
    // req.body["project"] = req.body.projectId;
    const request = new transferAreaRequest(req.body);
    const result = await request.postFrequentRecipients();
    if (result.result.length == 0) {
        
        return res.Error(result.message, "ERROR_FREQUENT_RECIPIENT");
    } else {
        
        // logActivity(
        //     {
        //             logName: "Transfer Area",
        //             description: "Added a new recepient",
        //             subjectID: result[0]['id'],
        //             subjectType: "usersRecipient",
        //             event: "Added",
        //             causerID: req.decoded.id,
        //             causerType: "users",
        //             properties: {
        //                 attributes: {
        //                     dispID: req.body.buyerId,
        //                     userId: req.decoded.id,
        //                     buyerId: req.body.buyerId,
        //                     projectId: req.body.projectId
        //                 },
        //                 old: null
        //             },
        //             source: null,
        //             metadata:null
        //         }
        //         ,req)
        return res.Success("Frerquent recepient added successfully", "SUCCESS_FREQUENT_RECIPIENT");
    }
}

controller.myArea = async function (req, res, next) {
    req.body["userId"] = req.decoded.id;
    const request = new transferAreaRequest(req.body);
    const result = await request.myArea();
    if (result.length == 0) {
        return res.Error("No Area found", "NO_AREA_FOUND");
    } else {
        return res.Success(result, "success");
    }
}

controller.projects = async function (req, res, next) {
    // req.body["userId"] = req.decoded.id;
    const request = new transferAreaRequest(req.body);
    const result = await request.allProperties();
    if (result.length == 0) {
        return res.Error("No Area found", "NO_AREA_FOUND");
    } else {
        return res.Success(result, "success");
    }
}

controller.verifyWalletAddress = async function (req, res, next) {
    req.body["userId"] = req.decoded.id;
    const request = new transferAreaRequest(req.body);
    if (!request.validateAddressField()) {
        return res.Error("Invalid fields", "INVALID_REQUEST");
    }
    const walletAddressExists = await request.checkWalletAddress();
    if (walletAddressExists.length == 0) {
        return res.Error("Wallet Address is not valid.", "WALLET_ADDRESS_INVALID_REQUEST");
    } else {
        const getProperties = await request.getProperties();  
        if (getProperties.length != 0) {
            return res.Success({receiverDetail:walletAddressExists[0],properties:getProperties}, "Success");
        }
    }
}
controller.p2p2Popup = async function (req, res, next) {
    req.body["userId"] = req.decoded.id;
    const request = new transferAreaRequest(req.body);
    let result = await request.p2p2Popup();
    if(result.length == 0){
        return res.Error('Failed to get popup information', "FAILED");
    }
    return res.Success(result[0], "Success");
}

controller.hidePopup = async function (req, res, next) {
    req.body["userId"] = req.decoded.id;
    const request = new transferAreaRequest(req.body);
    let result = await request.hidePopup();
    if(result.length == 0){
        return res.Error('Failed to update', "FAILED");
    }
    return res.Success('Popup hide successfully', "Success");
}
controller.getReceiptData = async function (req, res, next) {
    
    req.body["userId"] = req.decoded.id;
    const request = new transferAreaRequest(req.body);
    let getReceiptData = await request.getReceiptData();
    let etherApi;
    let reciptData={};
    if (getReceiptData.length > 0) {
        getReceiptData = getReceiptData[0]

        reciptData.queueNumber = getReceiptData.queueNumber; 

        reciptData.transferType1 = getReceiptData.sellerID == req.body.userId ? 'Outgoing Transfer' :  ''; 
        reciptData.transferType2 = getReceiptData.buyerID == req.body.userId ? 'Incoming Transfer' :  ''; 
        
        reciptData.transferRequestDate = moment(getReceiptData.createdAt).format("MMM D, YYYY"); 
        reciptData.transferRequestTime = moment(getReceiptData.createdAt).format("hh:mm A"); 

        reciptData.generationDate = moment(new Date()).format("MMM D, YYYY"); 
        reciptData.generationTime = moment(new Date()).format("hh:mm A"); 


        reciptData.direction1 = getReceiptData.sellerID == req.body.userId ? "FROM(YOU)" : "FROM";
        reciptData.direction2 = getReceiptData.buyerID == req.body.userId ? "TO(YOU)" : "TO";

        reciptData.senderId = "DAO ID:"+getReceiptData.sellerID;
        reciptData.senderName = getReceiptData.sellerName;
        reciptData.senderWalletAddress = req.body.network === 'eth' ? getReceiptData.sellerWalletAddress : getReceiptData.sellerTronAddress;
        
        reciptData.receiverId = "DAO ID:"+getReceiptData.buyerID;
        reciptData.receiverName = getReceiptData.buyerName;
        reciptData.receiverWalletAddress = req.body.network === 'eth' ? getReceiptData.buyerWalletAddress : getReceiptData.buyerTronAddress;

        reciptData.status1 = getReceiptData.internalStatus == 'locked' ? 'Success' : ''
        reciptData.status2 = getReceiptData.internalStatus != 'locked' ? 'Pending' : ''

        reciptData.propertyName = getReceiptData.propertyName;
        reciptData.propertyLogo = getReceiptData.propertyLogo;
        reciptData.area = parseFloat(getReceiptData.areaPledged); // x must be a number;

        reciptData.serviceCharges = getReceiptData.p2pDetail.serviceCharges
        reciptData.chargesPaidBy = getReceiptData.sellerID == req.body.userId && getReceiptData.p2pDetail.chargesPaidBy ?
        getReceiptData.p2pDetail.chargesPaidBy+'(You)' : 
        getReceiptData.p2pDetail.chargesPaidBy
        reciptData.transferTo = getReceiptData.p2pDetail.transferTo.charAt(0).toUpperCase() + getReceiptData.p2pDetail.transferTo.slice(1)
        reciptData.blockchainReference = getReceiptData.blockchainReference
        reciptData.site_url = process.env.ASSETS_URL;
        // debugger
        if(getReceiptData.blockchainReference){
            reciptData.transferDate = moment(getReceiptData.transferDate).format("MMM D,YYYY"); 
            reciptData.transferTime = moment(getReceiptData.transferDate).format("hh:mm A"); 
            etherApi = getReceiptData.config.blockchainConfiguration.mainNetUrl+getReceiptData.blockchainReference
            // etherApi = process.env.etherScanApi+getReceiptData.blockchainReference
            let src = await qrCode.toDataURL(etherApi)
            // debugger
            if(src){
                reciptData.qrImage = src; 
            }
        }
        // debugger
        let receiptResponse = await receiptGeneration.peerToPeerreceipt(reciptData);
        if (receiptResponse) {
            // debugger
            let getreciptLink = await getMedia.getMediaTest(receiptResponse.mediaId)
            if (getreciptLink.length == 0) {
                return res.Error("Failed to generate recipt", "FAILED");
            } else {
                // debugger
                return res.Success(getreciptLink, "Success");
            }
        }
    }
}
// controller.getReceiptData = async function (req, res, next) {
//     req.body["tradeId"] = req.query.tradeId;
//     const request = new transferAreaRequest(req.body);
//     let getReceiptData = await request.getReceiptData();
//     let etherApi;

//     if (getReceiptData.length > 0) {
//         getReceiptData = getReceiptData[0]
//         let date = moment(getReceiptData.createdAt).format("MMM D,YYYY");
//         getReceiptData['date'] = date;
//         let time = moment(getReceiptData.createdAt).format("hh:mm A");
//         getReceiptData['time'] = time;
//         getReceiptData['site_url'] = process.env.ASSETS_URL;
        
//         getReceiptData['sellerWalletAddress'] = getReceiptData.sellerWalletAddress.substring(0, 6) + '...' + getReceiptData.sellerWalletAddress.substring(getReceiptData.sellerWalletAddress.length - 6, getReceiptData.sellerWalletAddress.length);
//         getReceiptData['buyerWalletAddress'] = getReceiptData.buyerWalletAddress.substring(0, 6) + '...' + getReceiptData.buyerWalletAddress.substring(getReceiptData.buyerWalletAddress.length - 6, getReceiptData.buyerWalletAddress.length);
        
//         etherApi = process.env.etherScanApi+getReceiptData.blockchainReference
//         let src = await qrCode.toDataURL(etherApi)
//         if(src){
//             getReceiptData['qrImage'] = src; 
//         }
//         let receiptResponse = await receiptGeneration.peerToPeerreceipt(getReceiptData);
//         if (receiptResponse) {
//             let getreciptLink = await getMedia.getMediaTest(receiptResponse.mediaId)
//             if (getreciptLink.length == 0) {
//                 return res.Error("Failed to generate wallet address.", "FAILED");
//             } else {
//                 return res.Success(getreciptLink, "Success");
//             }
//         }
//     }
// }
module.exports = controller;