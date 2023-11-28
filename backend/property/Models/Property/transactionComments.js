const db = require("../db.js");
const bankDetails = require("./bank-information");
const utility = require('../../utils/utils');
const createtx = require('../Admins/Transactions/createtransaction');
let salesReceiptDTO = require('../../dto/sales-receipt-model');

const receiptGeneration = require('../../services/shared/receipt');
const statusEnum = require("../../resources/statusEnum.js");
const knex = db.knex;
async function addComments(comment) {
  comment.createdAt = new Date();
  comment.updatedAt = new Date();
  return knex("transactionComments")
    .insert(comment)
    .then((x) => {
      return x;
    })
    .catch((x) => {
      throw x;
    });
}

async function getComments(id) {
  let query =
    "select tc.createdAt,tc.updatedAt,tc.comments,u.email,u.firstName,u.lastName from transactionComments as tc join users as u on tc.userId = u.id and tc.tradeId=" +
    id +
    " order by tc.createdAt desc";
  return knex
    .raw(query)
    .then((x) => {
      return x[0];
    })
    .catch((x) => {
      throw x;
    });
}
async function updateAgentAndStatus(data) {  
  var fetchedData;
  var propBanks;
  let paidAmount=0;
  let status = data.status;
  let tradeActivityID = data.id;

  return knex("tradeactivity")
    .where("id", "=", data.id)
    .update({
      internalStatus: data.status,
      agentID: data.agentID,
    })
    .then((x) => {
      return x;
    })
    .then(function (result){
      let _currData=null;
     return _currData=createtx.updateReceipt(data.id)
      
  })
  .then(function (result) {
      
      fetchedData=result;
      
      return bankDetails.bankInformation(fetchedData.projectID)
      
  })
  .then(function(result){
      propBanks=result;
      if(data.status == statusEnum.approved)
        paidAmount = fetchedData.totalPrice;

      
      let modelData = {
          assetUrl: process.env.ASSETS_URL,
          userId: fetchedData.userId,
          queueNumber: data.id,
          status: fetchedData.currStatus,
          dueDate: utility.dateformater(fetchedData.dueDate, 'MMM DD,YYYY'),
          projectID: fetchedData.projectID,
          name: fetchedData.projectName,
          areaPledged: fetchedData.areaPledged,
          roundName: fetchedData.roundName,
          roundPrice: fetchedData.roundPrice,
          totalCost: fetchedData.totalPrice,
          agentLegalName: (fetchedData.agentID && fetchedData?.saleAgentLegalName) ? fetchedData.saleAgentLegalName : 'Haseeb Mirza',
          agentPhoneNumber: fetchedData?.agentID ? fetchedData?.saleAgentPhoneNumber : '+923345159545',
          agentEmail: fetchedData?.agentID ? fetchedData?.saleAgentEmail : 'haseeb.mirza@daoproptech.com',
          totalTaxCost: 0,
          banks: propBanks,
          payDate:fetchedData?.paymentReceivableDate,
          amountPaid: fetchedData.totalPrice
          //paymentDate: fetchedData.paymentDate 
          // add paid amount too
      }
      let dtoResponse = new salesReceiptDTO.salesReceipt(modelData);
      return receiptGeneration.postreceipt(dtoResponse);
  })
  .then(async function(data){
    if( status===statusEnum.pending || status===statusEnum.verified || status===statusEnum.approved ) {
      status = (status===statusEnum.verified && 'VERIFIED') || (status===statusEnum.approved && 'APPROVED') || (status===statusEnum.pending && 'PENDING');
      await knex("demarcatedUserAssetTransactions")
      .where("tradeActivityID", "=", tradeActivityID)
      .update({
        status,
      })
    }
    return data;
  })
    .catch((x) => {
      throw x;
    });
}

module.exports.addComments = addComments;
module.exports.getComments = getComments;
module.exports.updateAgentAndStatus = updateAgentAndStatus;
