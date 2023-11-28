const sharedUtility = require("./shared");
const enumModels = require('../models/enum');
/**
 * 
 * @param {String} smartContractAddress 
 * @param {String} roundName 
 * @param {String} funds
 * @param {String} startDate
 * @param {String} endDate
 * @param {String} walletPassword
 * @returns {string} transactionId
 */



async function lockFunds(smartContractAddress,roundName,funds,startDate,endDate,walletPassword) {
  try {
    let startRoundTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
    let endRoundTimestamp = Math.floor(new Date(endDate).getTime() / 1000);
    let contract = sharedUtility.contractInitializer(smartContractAddress);
    let roundInstance = contract.methods.developmentRounds(roundName,funds,startRoundTimestamp,endRoundTimestamp);
    let encodeABI = roundInstance.encodeABI();
    let txObject = await sharedUtility.transactionObject(encodeABI, walletPassword, smartContractAddress);
    let txID = txObject[0];
    let signedTransaction = txObject[1];
    let blockchainTx = await sharedUtility.blockchainRelayer(signedTransaction);
  
    return txID;
  } catch (error) {
    throw error;
  }


 
}





/**
 * 
 * @param {String} smartContractAddress 
 * @param {String} roundName 
 * @param {String} pendingNonce
 * @param {String} walletPassword
 * @returns {string} transactionId
 */



async function unlockFunds(smartContractAddress,blockchainNetwork,roundName,walletPassword,pendingNonce){
    try {
      console.log("blockchainnetwork",blockchainNetwork);
      switch(blockchainNetwork) {
        case enumModels.blockchainNetwork.eth :
          let contract = sharedUtility.ethereumContractInitializer(smartContractAddress);
          let roundInstance = contract.methods.releasefunds(roundName);
          let encodeABI = roundInstance.encodeABI();
          let txObject = await sharedUtility.transactionObject(encodeABI, walletPassword, smartContractAddress,pendingNonce);
          let txID = txObject[0];
          let signedTransaction = txObject[1];
          let blockchainTx = await sharedUtility.blockchainRelayer(signedTransaction);
          return txID;
        case enumModels.blockchainNetwork.trx :
          let tronTransfer = await sharedUtility.tronunLockFunds(smartContractAddress,roundName,walletPassword);
          return tronTransfer.txid;
      }
      

    } catch(error){
        throw error;
    }
}


async function tronLockFunds(smartContractAddress,roundName,funds,startDate,endDate,walletPassword) {
  try {

    let startRoundTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
    let endRoundTimestamp = Math.floor(new Date(endDate).getTime() / 1000);
    let tronTransfer = await sharedUtility.tronLockFunds(smartContractAddress,roundName,funds,startRoundTimestamp,endRoundTimestamp,walletPassword);
    return tronTransfer.txid;
    
  } catch (error) {
    throw error;
  }


 
}


async function tronUnLockFunds(smartContractAddress,roundName,walletPassword) {
  try {

    let tronTransfer = await sharedUtility.tronunLockFunds(smartContractAddress,roundName,walletPassword);
    return tronTransfer.txid;
    
  } catch (error) {
    throw error;
  }


 
}

module.exports.lockFunds = lockFunds;
module.exports.unLockFunds = unlockFunds;
module.exports.tronLockFunds = tronLockFunds;
module.exports.tronUnLockFunds = tronUnLockFunds;
