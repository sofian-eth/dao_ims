const web3 = require("web3");

const path = require("path");
const fs = require("fs");
const Tx = require("ethereumjs-tx");
const sharedUtility = require("./shared");
const enumModels = require('../models/enum');
const transactionRequestDTO = require('../dto/requests/createBlockchainTransactionRequest');


/**
 * 
 * @param {String} smartContractAddress 
 * @param {String} buyerAddress 
 * @param {String} sellerAddress
 * @param {String} funds
 * @param {String} walletPassword
 * @param {String} pendingNonce
 * @param {object} blockchainConfiguration
 * @returns {string} transactionId
 */

const areaTransfer = async function(dataObject){
   console.log("Data object",dataObject); 
   let propertyConfigData  = JSON.parse(dataObject.blockchainConfig);
   dataObject.blockchainConfig = propertyConfigData.blockchainConfiguration;
   let parseRequestData  = new transactionRequestDTO.blockchainTransactionRequest(dataObject);
  
  switch(parseRequestData.network) {
    case enumModels.blockchainNetwork.eth :
      let contract = sharedUtility.ethereumContractInitializer(parseRequestData.smartContractAddress);
      let transfer = contract.methods.transferFrom(parseRequestData.sellerAddress,parseRequestData.buyerAddress,parseRequestData.funds);
      let encodeABI = transfer.encodeABI();
      let txObject = await sharedUtility.transactionObject(encodeABI, parseRequestData.walletPassword, parseRequestData.smartContractAddress,parseRequestData.pendingNonce);
      let txID = txObject[0];
      let signedTransaction = txObject[1];
      let blockchainTx = await sharedUtility.blockchainRelayer(signedTransaction);
      return blockchainTx;
      
    case enumModels.blockchainNetwork.trx :
      let tronTransfer = await sharedUtility.tronTransaction(parseRequestData.smartContractAddress,parseRequestData.buyerTronAddress,parseRequestData.sellerTronAddress,parseRequestData.funds,parseRequestData.walletPassword);
      return tronTransfer.txid;
      
     
  }


}




/**
 * 
 * @param {String} smartContractAddress 
 * @param {String} buyerAddress 
 * @param {String} sellerAddress
 * @param {String} funds
 * @param {String} walletPassword
 * @param {String} pendingNonce
 * @returns {string} transactionId
 */








async function transfer(smartContractAddress,buyerAddress,sellerAddress,funds, walletPassword,pendingNonce){
    try {  
    let contract = sharedUtility.ethereumContractInitializer(smartContractAddress);
    let transfer = contract.methods.transferFrom(sellerAddress,buyerAddress,funds);
    let encodeABI = transfer.encodeABI();
    let txObject = await sharedUtility.transactionObject(encodeABI, walletPassword, smartContractAddress,pendingNonce);
    let txID = txObject[0];
    let signedTransaction = txObject[1];
    let blockchainTx = await sharedUtility.blockchainRelayer(signedTransaction);
    console.log("Blockchain",blockchainTx);
    return txID;
  
  
    }
    catch(error){
      console.log(error);
        throw error;
    }
  }


  /**
 * 
 * @param {String} smartContractAddress 
 * @param {String} buyerAddress 
 * @param {String} sellerAddress
 * @param {String} funds
 
 * @returns {object} gasFeesObject
 */


  async function gasEstimateOfTransfer(smartContractAddress,buyerAddress,sellerAddress,funds){
    try {
     
      let contract = sharedUtility.contractInitializer(smartContractAddress);
      return new Promise(function(resolve,reject){
        contract.methods.transferFrom(sellerAddress,buyerAddress,funds).estimateGas({from: sellerAddress})
        .then(function(result){
          resolve(result);
        })
        .catch(function(error){
         throw error;
        })
      })
      

    } catch(error){
      throw error;
    }
  }



module.exports.transfer = transfer;
module.exports.gasEstimateOfTransfer =gasEstimateOfTransfer;
module.exports.areaTransfer = areaTransfer;