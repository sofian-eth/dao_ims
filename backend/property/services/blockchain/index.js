const blockchainModule = require("blockchain");
const transactionModel = require('../../Models/Admins/Transactions/transactions');
const areaConversionMatrix = require('../../utils/area-unit-conversion');
const statusEnum = require('../../resources/statusEnum');
const propertyInformationModel = require('../../Models/Property/listing');
const portfolioBalanceModel = require('../../Models/Investor/PersonalInformation/userportfolio');
const fcmService = require("../fcm/fcm.service");
const { notificationService } = require("../notification/notificationCenter");
const emailUtils = require('../../utils/email');
async function totalSupply(req, res, next) {
  let err = {};
  try {
    let totalSupply = await blockchainModule.blockchainStats.totalSupply(
      req.query.smartContractAddress
    );
    res.status(200).json({ error: false, message: "", data: totalSupply });
  } catch (error) {
    err.statusCode = 400;
    err.message = "Error occurred fetching circulation supply";
    err.stackTrace = error;
    next(err);
  }
}

async function circulationSupply(req, res, next) {
  let err = {};
  try {
    let circulationSupply = await blockchainModule.blockchainStats.circulationSupply(
      req.query.smartContractAddress
    );
    res
      .status(200)
      .json({ error: false, message: "", data: circulationSupply });
  } catch (error) {
    err.statusCode = 400;
    err.message = "Error occurred fetching circulation supply";
    err.stackTrace = error;
    next(err);
  }
}



async function transfer(request) {
  let err = {};
  try {
    let txID = await blockchainModule.transferService.areaTransfer(request);
   return txID;

  } catch (error) {
      throw error;
  }
}


async function lockFunds(req, res, next) {
  let err = {};
  try {
    let circulationSupply = await blockchainModule.fundingRound.lockFunds(
      req.body.smartContractAddress,
      req.body.roundName,
      req.body.funds,
      req.body.startDate,
      req.body.endDate,
      req.body.walletPassword
    );
    res
      .status(200)
      .json({ error: false, message: "", data: circulationSupply });
  } catch (error) {
    err.statusCode = 400;
    err.message = "Error occurred in locking funds";
    err.stackTrace = error;
    next(err);
  }
}


async function unlockFunds(req, res, next) {
    let err = {};
    try {
      let txID = await blockchainModule.fundingRound.unLockFunds(
        req.body.smartContractAddress,
        req.body.roundName,
        req.body.walletPassword
      );
      res
        .status(200)
        .json({ error: false, message: "", data: txID });
    } catch (error) {
      err.statusCode = 400;
      err.message = "Error occurred unlocking funds";
      err.stackTrace = error;
      next(err);
    }
  }


  async function blockchainEventChecker(req,res,next){

    let network = 'eth';

    if(req)
        network = req; 
    if(req.query)
       network = req.query.network;
    
      
 
      let err = {};
      let id=0;
      try {
        
        let lockTransaction = await transactionModel.fetchTransactionList(statusEnum.locked,network);
        
        for(const tx of lockTransaction){
           
          if(tx.blockchainReference){
          
            let buyerID = tx.buyerID;
            let sellerID = tx.sellerID;
            let propertyID = tx.propertyID;
            let transactionId = tx.id;
            let netAmount = tx.totalPrice;
            let areaUnits = tx.areaPledged;
            let txConfirmation;
            if(process.env.ENVIRONMENT == 'dev'){
              let updateBalanceDev = await transactionModel.updateUserBalance(buyerID,propertyID,areaUnits,sellerID,netAmount,statusEnum.confirmed,transactionId,Date.now());
            }
            else {

            if(network == 'eth') {
              txConfirmation = await blockchainModule.balanceService.fetchTransactionReceipt(tx.blockchainReference);
          } 
            else if (network == 'polygon'){
              txConfirmation = await blockchainModule.balanceService.fetchPolygonTransactionReceipt(tx.blockchainReference);
            }
            else {
              txConfirmation = await blockchainModule.balanceService.fetchTronTransactionReceipt(tx.blockchainReference);
            }
            if(txConfirmation){
              let date;
              if(txConfirmation.blockTimeStamp)
                date  = new Date(txConfirmation.blockTimeStamp);
              else 
                date =  txConfirmation.timestamp; 
            let updateBalance = await transactionModel.updateUserBalance(buyerID,propertyID,areaUnits,sellerID,netAmount,statusEnum.confirmed,transactionId,txConfirmation.timestamp);
        

            }

          }



          }

        
        
        }

        return res.status(200).json({error:false,message:"Cron job executed"});
        

      } catch(error){
        console.log(error);
        err.statusCode = 400;
        err.message = "Error occurred in executing cronjob";
        err.stackTrace = error;
        next(err);
      }

  }


  async function updateUserBalance(transactionId){
    let err = {};
    try {
      let transactionDetail = await transactionModel.fetchTransactionByHash(statusEnum.locked,transactionId);
      
      if(transactionDetail.blockchainReference){
          
        let buyerID = transactionDetail.buyerID;
        let sellerID = transactionDetail.sellerID;
        let propertyID = transactionDetail.propertyID;
        let transactionId = transactionDetail.id;
        let netAmount = transactionDetail.totalPrice;
        let areaUnits = transactionDetail.areaPledged;
        let medium = transactionDetail.medium; 
        let projectName = transactionDetail.projectName; 
        let sellerName = transactionDetail.sellerName; 
        let buyerName = transactionDetail.buyerName; 
        let sellerEmail = transactionDetail.sellerEmail; 
        let buyerEmail = transactionDetail.buyerEmail; 
        let timestamp = new Date();
        let emailData = {};
        emailData.receiver = buyerEmail;
        emailData.firstName = buyerName;
        console.log(timestamp);
        let formattedDate = timestamp.toISOString();
        await transactionModel.updateUserBalance(buyerID,propertyID,areaUnits,sellerID,netAmount,statusEnum.confirmed,transactionId,formattedDate);
        if(medium=='market_Place'){
          fcmService.transactionCompleted(sellerID,buyerID,transactionId);
          notificationService.transactionSuccessfullBuyer({to:buyerID,from:buyerID,area:transactionDetail.areaPledged,propertyName:transactionDetail.propertyID});
          notificationService.transactionSuccessfullSeller({to:sellerID,from:sellerID,area:transactionDetail.areaPledged,propertyName:transactionDetail.propertyID});
        }
        if(medium=='Peer_To_Peer'){
          fcmService.approvedTransferArea(buyerID,sellerName,areaUnits,projectName);
          notificationService.approvedTransferAreaSuccessfull({to:buyerID,from:sellerID,area:areaUnits,propertyName:projectName,senderName:sellerName});
          emailUtils.approvedTransferArea({receiverEmail:buyerEmail,area:areaUnits,propertyName:projectName,senderName:sellerName,receiverName:buyerName});
        }
        if(!(medium=='Peer_To_Peer')){
          emailUtils.transactionApproval(emailData);
        }
        console.log("Balance updated for transaction ID",transactionId);
        }

    } catch(error){
      err.statusCode = 400;
      err.message = "Error occurred in updating balance";
      err.stackTrace = error;
    
    }
  }


  async function updateServiceAccountBalance(){
    console.log("Active ROund");
    let err = {};
    try {
      let propertyInformation = await propertyInformationModel.propertyOwnerInformation();
     
      for(const rec of propertyInformation){
     
        let userBalance = await blockchainModule.balanceService.userBalance(rec.blockchainMainContract,rec.walletAddress);
      
        let userConvertedBalance = await areaConversionMatrix.convertToSqft(userBalance);
     
        let updateUserBalance = await portfolioBalanceModel.updateUserBalance(rec.userId,rec.id,userConvertedBalance);

      }
    } catch(error){
   
      err.statusCode = 400;
      err.message = "Error occcurred in updating balance"
      err.stackTrace = error;
    }

  }

module.exports.totalSupply = totalSupply;
module.exports.circulationSupply = circulationSupply;
module.exports.transfer = transfer;
module.exports.lockFunds = lockFunds;
module.exports.unlockFunds = unlockFunds;
module.exports.blockchainEventChecker = blockchainEventChecker;
module.exports.updateUserBalance =updateUserBalance;
module.exports.updateServiceAccountBalance = updateServiceAccountBalance;
