const roundInformationModel = require('../../Models/Property/getrounds');
const pledgeArea = require('../../Models/Investor/Transactions/pledgearea');
const userDetailModel = require('../../Models/Investor/PersonalInformation/getmembershipid');
const agentInformation = require('../../Models/Agents/getagentdetails.js');
const roundModel = require('../../Models/Property/getrounds');
const ticketdetails = require('../../Models/Investor/Transactions/ticketdetails');
const roundsModel = require("../../Models/Property/getrounds");
const { TRANSACTION_STATUSES } = require("./../../resources/constants");
const transactionModel = require('../../Models/Investor/Transactions/transaction');
const transactionDTO = require('../../dto/transaction-listing-modal');
const transactionDetailDTO = require('../../dto/transaction-detail-model');
const propertyBankInformationModel = require('../../Models/Property/bank-information');
const transactionAttachment = require('../../Models/Investor/Transactions/ticketdetails');
const statusEnum = require('../../resources/statusEnum');
const portfolioBalanceModel = require('../../Models/Investor/PersonalInformation/userportfolio');
const receiptGeneration = require('../shared/receipt');
let salesAgentDetail = require('../../Models/Agents/getagentdetails');
const bankDetails = require("../../Models/Property/bank-information");
const utility = require('../../utils/utils');
const moment = require('moment');
let areaPledgeModel = require('../../Models/Investor/Transactions/pledgearea');
let projectInformationModel = require('../../Models/Property/information');
const transactionDetailsController = require('../../Models/Admins/Transactions/transactiondetailsdb');
let salesReceiptDTO = require('../../dto/sales-receipt-model');
const { calculateEarnedROI, calculateForecastedROI } = require("./../shared/investments");
const dotenv = require('dotenv');
const authmodel = require('../../Models/Admins/Auth/checkpass.js');
const { transaction } = require('../../resources/fileEnum');
const transactionCommentsModels = require("../../Models/Property/transactionComments");
const { ERROR_MESSAGES } = require('./../../resources/constants');
const { notificationModel } = require("core/dto/requests/notification.model");
const { notificationService } = require('../notification/notificationCenter');
const propertyModal = require("../../Models/Property/information");
const fcmService = require('../fcm/fcm.service');
const { logActivity } = require('../shared/activity-logger');
const UserInformationModel = require('../../Models/Property/user-information');
const slackNotification = require('../../utils/slack-notification');

dotenv.config();

// async function userCheckout(req, res, next) {


//   let err = {};



//   try {
//     let projectID = req.body.projectID;
//     let areaSqft = req.body.purchasedarea;
//     let buyerID = req.decoded.id;

//     let tempActiveRoundPricing = await roundInformation.activeRoundPricing(projectID);
//     let activeRoundPricing = tempActiveRoundPricing.pricePerSqft;

//     let totalPrice = areaSqft * activeRoundPricing;
//     let response = {};
//     response.pledgeArea = areaSqft;
//     response.areaPrice = activeRoundPricing;
//     response.roundID = tempActiveRoundPricing.id;
//     response.paymentModeID = req.body.paymentMode;
//     response.billingAddress = req.body.billingAddress;
//     response.projectID = projectID;
//     response.buyerID = buyerID;
//     response.agentCode = req.body.agentcode;

//     let areaPledge = await pledgeArea.areaPledge(response);
//     let ticketObject = {};
//     ticketObject = areaPledge;
//     ticketObject.paymentdate = areaPledge.paymentDate;
//     ticketObject.queuenumber = areaPledge.id;
//     ticketObject.sqftprice = areaPledge.sqftPrice;
//     ticketObject.totalprice = areaPledge.totalPrice;
//     ticketObject.areapledged = areaPledge.areaPledged;

//     let userDetail = await userDetailModel.userDetail(req.decoded.id);


//     ticketObject.membershipid = userDetail.membershipNumber;
//     ticketObject.investorname = userDetail.legalName;

//     let salesAgentInformation = await agentInformation.fetchSalesAgentDetails(req.body.agentcode);
//     ticketObject.agentName = salesAgentInformation.firstName + ' ' + salesAgentInformation.lastName;
//     ticketObject.agentName = ticketObject.agentName ? ticketObject.agentName : 'Haseeb Mirza';
//     ticketObject.agentEmail = salesAgentInformation.email ? salesAgentInformation.email : 'haseeb.mirza@daoproptech.com';



//     //     postreceipt(ticketObject);


//     return res.status(200).json({ error: false, message: '', data: ticketObject });



//   } catch (error) {
//     err.statusCode = 400;
//     err.message = "Error occurred in fetching area pledge";
//     err.stackTrace = error;
//     next(err);
//   }
// }

// async function transactionDetails(req, res, next) {
//   let err = {};


//   try {


//   } catch (err) {}
// }

async function transactionalAttachment(req, res, next) {

  // check user access control
  // Add transactional attachments

  try {
  } catch (err) { }
}

async function investorTransaction(req, res, next) {
  let err = {};
  try {

    let investorID = req.params.id ? req.params.id : req.decoded.id;
    let responseArr = [];

    let investorTransaction = await transactionModel.transactionListing(investorID, req.params.id ? "market" : null, parseInt(req.query.pageno), parseInt(req.query.pagesize));
    let investorTransactionCount = await transactionModel.transactionListingCount(investorID, req.params.id ? "market" : null, req.query.pageno, req.query.pagesize);
    for (let transaction of investorTransaction) {
      if ([TRANSACTION_STATUSES.LOCKED, TRANSACTION_STATUSES.CONFIRMED].includes(transaction.status) && transaction.propertyID) {
        let activeRoundData = await roundsModel.activeRoundPricing(
          transaction.propertyID
        );
        let roundPrice = activeRoundData.pricePerSqft;
        let finalRoundPrice = await roundsModel.finalRoundPrice(transaction.propertyID);

        let investedAmount = transaction.areaPledged * transaction.sqftPrice;
        let currentAmount = transaction.areaPledged * roundPrice;
        let monthsDiff = moment().diff(moment(transaction.Date), 'month');
        transaction.roi = calculateEarnedROI(currentAmount, investedAmount, monthsDiff);
        transaction.forcasted = calculateForecastedROI(finalRoundPrice.marketPrice, transaction.areaPledged, investedAmount);
        transaction.transactionDate = transaction.blockchainConfirmationTime;
      } else {
        transaction.roi = null;
        transaction.forcasted = null;
        transaction.transactionDate = null;
      }
      if ([TRANSACTION_STATUSES.PENDING, TRANSACTION_STATUSES.PLEDGE_SUBMITTED, TRANSACTION_STATUSES.PLEDGE_CONFIRMED].includes(transaction.status)) {
        if (transaction.due_date)
          transaction.due_date = moment(transaction.due_date).endOf('day').fromNow();
        else
          transaction.due_date = null;
      } else {
        transaction.due_date = null;
      }
      transaction.Date = transaction.Date;
      if (transaction.buyerID == req.decoded.id)
        transaction.type = 'buyer';
      else
        transaction.type = 'seller';
      let transactionData = new transactionDTO.transactionListingModal(transaction);
      responseArr.push(transactionData);


    }
    try {
      logActivity(
        {
          logName: "Manage Transaction",
          description: "Viewed the transactions page",
          subjectID: transaction.propertyID,
          subjectType: "transaction",
          event: "Viewed",
          causerID: transaction.buyerID,
          causerType: "users",
          properties: {
            attributes: {
              projectId: transaction.projectID,
              projectName: transaction.projectName,
              buyerId: transaction.buyerID,
              sellerId: transaction.sellerID,
            },
            old: null
          },
          source: null,
          metadata: null
        }
        , req)
    } catch (error) {
      console.log(error)
    }

    return res.status(200).json({ error: false, message: '', data: responseArr, count: investorTransactionCount[0].count });

  } catch (error) {
    err.statusCode = 400;
    err.message = "Error occurred in fetching transactions";
    err.stackTrace = error;
    next(err);
  }
}
async function investorTransactionDetail(req, res, next) {
  let err = {};




  try {
   
    let todaysDate = moment();
    let ticket = req.body.ticketID ;
    let investorID =  req.decoded.id;
    let data = {};
    let response = '';
    let cnicMedia = await transactionModel.cnicMedia(investorID);
    let transactionDetail = await transactionModel.transactionDetail(ticket, investorID);
    
    if (transactionDetail[0].length) {

      let txData = JSON.parse(JSON.stringify(transactionDetail[0]));

      let developmentRound = txData[0].roundID;

      let bankInformation = await propertyBankInformationModel.bankInformationFromRound(developmentRound);
      let txAttachment = await transactionAttachment.transactionAttachments(txData[0].id);
      let completedRound = await roundsModel.completedRound(txData[0].propertyID);
      let fundingRounds = await roundsModel.totalFundingRounds(txData[0].propertyID);

      data.completedRound = completedRound.completedRound + 1;
      data.totalFundingRound = fundingRounds.fundingRounds;

      data.bankInformation = bankInformation;
      data.ticketNo = txData[0].id;
      data.areaPledged = txData[0].areaPledged;
      data.pricePerSqft = txData[0].sqftPrice;
      data.totalAmount = txData[0].totalPrice;
      data.propertyName = txData[0].propertyName;
      data.paymentDueDate = txData[0].paymentDate;
      data.transactionCreationTime = txData[0].updatedAt;
      data.transactionConfirmationTime = txData[0].transactionConfirmationTime;
      data.blockChainId = txData[0].blockchainReference;
      data.buyerName = txData[0].buyerName;
      data.buyerEmail = txData[0].buyerEmail;
      data.buyerMembershipNumber = txData[0].buyerMembershipNumber;
      data.sellerName = txData[0].sellerName;
      data.sellerEmail = txData[0].sellerEmail;
      data.sellerMembershipNumber = txData[0].sellerMembershipNumber;
      data.status = txData[0].status;
      data.paymentModeName = txData[0].paymentMode;
      data.roundDeadline = txData[0].roundEndDate;
      let blockchainNetwork = txData[0].blockchainNetwork;
      data.blockchainNetwork = blockchainNetwork;
          
            if(txData[0].isMigrated && !txData[0].isForked)
                data.blockchainNetwork =  txData[0].preforkedNetwork;

    
        data.blockchainReference = txData[0].blockchainReference;
      endDate = moment(data.roundDeadline);
      data.roundName = txData[0].roundName.replace(/[^\d.-]/g, '');
      data.displayEndDate = txData[0].displayEndDate;
      data.displayStartDate = txData[0].displayStartDate;
      // data.roundDeadline = endDate.diff(todaysDate, "days");
      data.attachments = txAttachment;
      data.cnicFront = cnicMedia.cnicFront;
      data.cnicBack = cnicMedia.cnicBack;
      data.updatedAt = txData[0].updatedAt;
      data.internalStatus = txData[0].internalStatus;
      response = new transactionDetailDTO.transactionDetailModal(data);

    }

    logActivity(
      {
        logName: "Manage Transactions",
        description: "Viewed details of a transaction of " + data.areaPledged + " sq. ft. in " + data.propertyName,
        subjectID: req.body.ticketID,
        subjectType: "tradeactivity",
        event: "Viewed",
        causerID: investorID,
        causerType: "users",
        properties: {
          attributes: {
            dispID: req.body.ticketID,
            tradeID: req.body.ticketID

          },
          old: null
        },
        source: null,
        metadata: null
      }
      , req)
    return res.status(200).json({ error: false, message: '', data: response });





  } catch (error) {
   
    err.statusCode = 400;
    err.message = "Error occurred in fetching transactions";
    err.stackTrace = error;
    next(err);
  }
}



async function transactionUpdate(req, res, next) {
  let err = {};
  try {

    let paymentConfirmationDate = req.body.paymentConfirmationDate;
    let bankAccountId = req.body.bankId;
    let attachments = req.body.attachments;
    let transactionId = req.body.transactionId;
    let removedFiles = req.body.removedFiles || [];
    let status = statusEnum.pledge_confirmed;


    let transactionProofs = [];

    let isTransactionExist = await transactionModel.transactionAuthorization(transactionId, req.decoded.id);
    let projectDetail = await propertyModal.projectInformation(isTransactionExist[0].propertyID);
    let transactionUpdate = await transactionModel.userTransactionConfirmation(transactionId, bankAccountId, paymentConfirmationDate);

    let updateStatus = await transactionModel.updateTransactionStatus(transactionId, status);

    if (attachments && attachments.length > 0) {
      attachments.forEach(element => {
        let object = {
          tradeID: transactionId,
          mediaId: element
        };
        transactionProofs.push(object);
      });

      addTransactionalAttachments = await transactionModel.transactionAttachment(transactionProofs);
      fcmService.receiptUploadNotification(transactionId,req.decoded);
    }
    if (removedFiles && removedFiles.length > 0) {
      let deleteTransactionalAttachments = await transactionModel.transactionAttachmentDel(removedFiles);
    }

    notificationService.paymentDeposited({ to: req.decoded.id, from: req.decoded.id, id: transactionId });
    logActivity(
      {
        logName: "Manage Transactions",
        description: "Submitted receipt for payment verification for transaction of " + isTransactionExist[0].areaPledged + " sq. ft. in " + projectDetail.name,
        subjectID: transactionId,
        subjectType: "tradeactivity",
        event: "Updated",
        causerID: req.decoded.id,
        causerType: "users",
        properties: {
          attributes: {
            dispID: transactionId,
            transactionID: transactionId

          },
          old: null
        },
        source: null,
        metadata: null
      }, req)
    return res.status(200).json({ error: false, message: 'Transaction updated successfully', data: '' });
  }


  catch (error) {
    err.statusCode = 400;
    err.message = "Error occurred in updating transaction";
    err.stackTrace = error;
    next(err);
  }
}



async function adminCreateTransaction(req, res, next) {
  let err = {};
  try {
    let currentRoundPrice;
    let dataObject = {};
    let buyerId = req.body.buyerId;
    let sellerId = req.body.sellerId;
    let projectId = req.body.propertyId;

    let areaUnits = req.body.areaUnits;
    let roundId = req.body.roundId;
    let paymentModeId = req.body.paymentModeId;

    let sellerBalance;
    let totalPrice;

    // find user portfoliobalance in user project
    let buyerInformation = await UserInformationModel.userbasicInfo(buyerId);
    sellerBalance = await portfolioBalanceModel.userBalance(sellerId, projectId);
    if (sellerBalance <= 0)
      throw 'Insufficient Balance';


    // find current price 
    let projectInformation = await projectInformationModel.projectInformation(projectId);
    let roundData = await roundInformationModel.roundPrice(projectId, roundId);

    currentRoundPrice = roundData.pricePerSqft;

    totalPrice = currentRoundPrice * areaUnits;

    dataObject.sellerID = sellerId;
    dataObject.buyerID = buyerId;
    dataObject.roundID = roundId;

    dataObject.areaPledged = areaUnits;
    dataObject.totalPrice = totalPrice;
    dataObject.propertyID = projectId;
    dataObject.sqftPrice = currentRoundPrice;
    dataObject.paymentMode = paymentModeId;
    dataObject.operations = 'buy';
    dataObject.statusID = 2;


    let response = await areaPledgeModel.areaPledge(dataObject);


    // Receipt Generation


    let projectBanks = await bankDetails.bankInformation(projectId);

    let data = {
      site_url: process.env.ASSETS_URL,
      userId: buyerId,
      queueNumber: response.queueNumber,
      status: 'Pending',
      status_class: 'pending',
      dueDate: response.paymentDate,
      projectID: projectId,
      name: projectInformation.name,
      areaPledged: areaUnits,
      roundName: roundData.roundName,
      roundPrice: currentRoundPrice,
      totalCost: totalPrice,
      agentLegalName: agentInformation && agentInformation.legalName ? agentInformation.legalName : agentInformation.firstName + ' ' + agentInformation.lastName,
      agentPhoneNumber: agentInformation ? agentInformation.phoneNumber : '',
      agentEmail: agentInformation ? agentInformation.email : '',
      noOfBanks: 2,
      totalCost: totalPrice,
      totalTaxCost: 0,

      paymentInfo: {
        bankInfo: projectBanks
      }
    }


    let dtoResponse = new salesReceiptDTO.salesReceipt(data);
    receiptGeneration.postreceipt(dtoResponse);

    slackNotification.areaPledgeNotification(
      {
          investoremail: buyerInformation.email,
          firstname: buyerInformation.legalName,
          projectname: projectInformation.name,
          areaunits: areaUnits,
          devround: roundData.roundName,
          currentprice: currentRoundPrice,
          discount: null,
          marketprice: null,
          roundStatus: null
      }
  );


    return res.status(200).json({ error: false, message: 'Transaction created successfully', data: '' });








  } catch (error) {
    console.log(error);
    err.statusCode = 400;
    err.message = "Error occurred in creating transaction";
    err.stackTrace = error;
    next(err);
  }
}




async function generateSalesReceipt(req, res, next) {
  let err = {};
  try {


    let data = {};
    let queueNumber = req.body.queueNumber;
    let transactionDetail = await transactionDetailsController.transactionDetailsForReceipt(queueNumber);
    let projectInformation = await projectInformationModel.projectInformation(transactionDetail.propertyID);
    let roundInformation = await roundInformationModel.activeRoundPricing(transactionDetail.propertyID);
    let banks = await bankDetails.bankInformation(transactionDetail.propertyID);
    data.assetUrl = process.env.ASSETS_URL;
    data.userId = transactionDetail.buyerID;
    data.queueNumber = transactionDetail.queueNumber;
    data.status = transactionDetail.status;
    data.dueDate = transactionDetail.dueDate;
    data.projectID = transactionDetail.propertyID;
    data.name = projectInformation.name;
    data.areaPledged = transactionDetail.areaPledged;
    data.roundName = roundInformation.roundName;
    data.roundPrice = transactionDetail.sqftPrice;
    data.totalCost = transactionDetail.totalPrice;
    data.agentLegalName = '';
    data.agentPhoneNumber = '';
    data.agentEmail = '';
    data.totalTaxCost = 0;
    data.banks = banks;

    let response = new salesReceiptDTO.salesReceipt(data);

    let receiptResponse = await receiptGeneration.postreceipt(response);

    return res.status(200).json({ error: false, message: '', data: receiptResponse });




  } catch (error) {

    err.statusCode = 400;
    err.message = "Error occurred in generating sales receipt";
    err.stackTrace = error;
    next(err);
  }
}



async function removeTradeAttachments(req, res, next) {
  let err = {};

  try {

    let mediaId = req.body.documentID || req.body.mediaId;
    let removeAttachments = await transactionModel.removeTradeAttachment(mediaId);

    logActivity(
      {
        logName: "Manage Transactions",
        description: "Removed Trade Document from transaction",
        subjectID: mediaId,
        subjectType: "tradedocuments",
        event: "Deleted",
        causerID: req.decoded.id,
        causerType: "users",
        properties: {
          attributes: {
            dispID: req.body.tradeId,
            tradeId: req.body.tradeId
          },
          old: null
        },
        source: null,
        metadata: null
      }, req);

    return res.status(200).json({ error: false, message: 'Attachment removed successfully', data: '' });

  } catch (error) {
    err.statusCode = 400;
    err.message = "Error occurred in removing attachments";
    err.stackTrace = error;
    next(err);
  }


}

async function updateTransactions(req, res, next) {
  let err = {};
  try {

    const { id = 0 } = req.params;
    const { areaPledge, password } = req.body;
    const result = await authmodel.checkpass(req.decoded.id, { password });
    if (result) {

      const transaction = await ticketdetails.transactionDetail(id);
      if (transaction) {
        let roundInformation = await roundModel.activeRoundPricing(transaction.propertyID);
        let roundPrice = roundInformation.pricePerSqft;
        let totalCost = areaPledge * roundPrice;
        let sqftPrice = roundPrice;
        const dataObject = {
          totalPrice: totalCost,
          sqftPrice,
          areaPledged: areaPledge,
        };
        banks = await bankDetails.bankInformation(transaction.propertyID);
        let projectInformation = await projectInformationModel.projectInformation(transaction.propertyID);
        let response = await areaPledgeModel.updateAreaPledge(id, dataObject);
        let agentInformation = null;
        if (transaction.agentID) {
          agentInformation = await userDetailModel.userDetail(transaction.agentID);
        }
        const data = {
          assetUrl: process.env.ASSETS_URL,
          userId: transaction.buyerID,
          queueNumber: transaction.queueNumber,
          status: transaction.internalStatus,
          dueDate: utility.dateformater(transaction.paymentDate, 'MM/DD/YYYY'),
          projectID: transaction.propertyID,
          name: projectInformation.name,
          areaPledged: areaPledge,
          roundName: roundInformation.roundName,
          roundPrice: dataObject.sqftPrice,
          totalCost: dataObject.totalPrice,
          agentLegalName: agentInformation && agentInformation.legalName ? agentInformation.legalName : 'Haseeb Mirza',
          agentPhoneNumber: agentInformation ? agentInformation.phoneNumber : '+923345159545',
          agentEmail: agentInformation ? agentInformation.email : 'haseeb.mirza@daoproptech.com',
          totalTaxCost: 0,
          banks: banks

        }
        let dtoResponse = new salesReceiptDTO.salesReceipt(data);
        receiptGeneration.postreceipt(dtoResponse);
        if (data) {
          logActivity(
            {
              logName: "Manage Transaction",
              description: "Updated a transaction of " + data.areaPledged + " sq. ft. in " + data.name,
              subjectID: data.queueNumber,
              subjectType: "tradeaactivity",
              event: "Updated",
              causerID: req.decoded.id,
              causerType: "users",
              properties: {
                attributes: {
                  dispID: data.queueNumber,
                  userId: data.userId,
                  projectId: data.projectID,
                  projectName: data.name,
                  areaPledged: data.areaPledged
                },
                old: {
                  areaPledged: transaction.areaPledged
                }
              },
              source: null,
              metadata: null
            }, req)
        }
        return res.status(200).json({ success: true, error: false, message: 'Transaction updated successfully', data: '' });
      } else {

        err.statusCode = 400;
        err.message = "Error occurred in updating transaction.";
        next(err);
      }

    } else {

      err.statusCode = 400;
      err.message = ERROR_MESSAGES.CURRENT_PASS_INCORRECT;
      next(err);
    }
  } catch (error) {

    console.log("err", error);
    err.statusCode = 400;
    err.message = "Error occurred in updating transaction.";
    err.stackTrace = error;
    next(err);
  }
}

async function totalPurchasedArea(req, res, next) {
  let err = {};

  try {
    let userID = req.decoded.id;
    const area = await portfolioBalanceModel.totalPurchasedArea(userID);
    return res.status(200).json({ success: true, error: false, message: 'Total purchased area fetched successfully', data: { purchasedArea: area } });

  } catch (error) {
    console.log("err", error);
    err.statusCode = 400;
    err.message = "Error occurred in fetching total purchased area.";
    err.stackTrace = error;
    next(err);
  }
}

async function addComments(req, res, next) {
  let err = {};
  try {
    let comment = req.body;
    let userID = req.decoded.id;
    comment.userId = userID;
    const result = await transactionCommentsModels.addComments(comment);
    return res.status(200).json({ success: true, error: false, message: 'Comment added successfully', data: result });
  } catch (error) {
    console.log("err", error);
    err.statusCode = 400;
    err.message = "Error occurred.";
    err.stackTrace = error;
    next(err);
  }
}

async function getComments(req, res, next) {
  let err = {};
  try {
    let id = req.query.id;
    if (!id) return res.status(200).json({ success: false, error: true, message: 'Provide trade id.', data: {} });
    const comments = await transactionCommentsModels.getComments(id);
    return res.status(200).json({ success: true, error: false, message: 'Comments fetched successfully', data: comments });
  } catch (error) {
    console.log("err", error);
    err.statusCode = 400;
    err.message = "Error occurred.";
    err.stackTrace = error;
    next(err);
  }
}


async function updateAgentAndStatus(req, res, next) {
  let err = {};
  try {
    let body = req.body;
    const result = await transactionCommentsModels.updateAgentAndStatus(body);
    if (body.status == "discard") {
      notificationService.transactionDiscarded(body.id);
    }
    if (body.status == "locked") {
      notificationService.transactionLocked(body.id)
    }
    return res.status(200).json({ success: true, error: false, message: 'Comment added successfully', data: result });
  } catch (error) {
    console.log("err", error);
    err.statusCode = 400;
    err.message = "Error occurred.";
    err.stackTrace = error;
    next(err);
  }
}

module.exports.investorTransactionDetail = investorTransactionDetail;
module.exports.investorTransaction = investorTransaction;

// module.exports.userCheckout = userCheckout;
module.exports.transactionalAttachment = transactionalAttachment;
module.exports.transactionUpdate = transactionUpdate;
module.exports.adminCreateTransaction = adminCreateTransaction;
module.exports.generateSalesReceipt = generateSalesReceipt;
module.exports.removeTradeAttachments = removeTradeAttachments;
module.exports.updateTransactions = updateTransactions;
module.exports.totalPurchasedArea = totalPurchasedArea;
module.exports.getComments = getComments;
module.exports.addComments = addComments;
module.exports.updateAgentAndStatus = updateAgentAndStatus;