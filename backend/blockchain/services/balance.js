
const sharedUtility = require("./shared");


/**
 * 
 * @param {String} contractAddress 
 * @param {String} daoAddress 
 * @returns {int} balance
 */



async function daoWalletBalance(contractAddress, daoAddress) {
 let contract = sharedUtility.ethereumContractInitializer(contractAddress);
  return new Promise(function (resolve, reject) {
    contract.methods
      .balances(daoAddress)
      .call()
      .then(function (result) {
        resolve(result);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}



/**
 * 
 * @param {String} contractAddress 
 * @param {String} address 
 * @returns {int} balance
 */


async function userBalance(contractAddress, address) {
  let contract = sharedUtility.ethereumContractInitializer(contractAddress);
  return new Promise(function (resolve, reject) {
    contract.methods
      .balances(address)
      .call()

      .then(function (result) {
        resolve(result);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}


/**
 * 
 * @param {String} txHash 

 * @returns {object} receipt
 */


async function fetchTransactionReceipt (txHash){

  try {
    let receipt = await sharedUtility.transactionReceipt(txHash);
    if(!receipt)
      return false

    if(receipt.status){
      let areaUnit = parseInt(receipt.logs[0].data, 16);
      let jsonResponse = {
        status: receipt.status,
        areaUnit: areaUnit
      }
      return receipt;
    }
    
    
    if(!receipt.status)
      return false;


  } catch(error){
    throw error;
  }


}


async function fetchPolygonTransactionReceipt (txHash){

  try {
    let receipt = await sharedUtility.polygonTransactionReceipt(txHash);
    if(!receipt)
      return false

    if(receipt.status){
      let areaUnit = parseInt(receipt.logs[0].data, 16);
      let jsonResponse = {
        status: receipt.status,
        areaUnit: areaUnit
      }
      return receipt;
    }
    
    
    if(!receipt.status)
      return false;


  } catch(error){
    throw error;
  }


}


async function fetchTronTransactionReceipt (txHash){

  try {
    let receipt = await sharedUtility.tronTransactionReceipt(txHash);
    if(!receipt)
      return false

    if(receipt.receipt.result == 'SUCCESS'){
      let areaUnit = parseInt(receipt.log[0].data, 16);
      console.log(areaUnit);
      let jsonResponse = {
        status: true,
        areaUnit: areaUnit
      }
      return receipt;
    }
    
    
   else
      return false;


  } catch(error){
    throw error;
  }


}


/**
 * 
 * @param {String} address 

 * @returns {string} userBalance
 */


async function userEtherBalance(address){
  try {
    let userBalance = await sharedUtility.userEtherBalance(address);
    return userBalance;

  } catch(error){
    throw error;
  
  }

}


/**
 * 
 * @param {String} smartContractAddress 
 * @param {String} sellerAddress 
 * @param {string} walletAddress
 * @returns {int} balance
 */


async function investorBalance(smartContractAddress,walletAddress,sellerAddress){
  try {  
    let contract = sharedUtility.contractInitializer(smartContractAddress);
      return new Promise(function(resolve,reject){
        contract.methods.balanceOf(walletAddress).call({from: sellerAddress})
        .then(function(result){
          console.log(result);
          resolve(result);
        })
        .catch(function(error){
         throw error;
        })
      })
  
    }
    catch(error){
      console.log(error);
        throw error;
    }
}



module.exports.daoWalletBalance = daoWalletBalance;
module.exports.userBalance = userBalance;
module.exports.fetchTransactionReceipt = fetchTransactionReceipt;
module.exports.userEtherBalance = userEtherBalance;
module.exports.investorBalance = investorBalance;
module.exports.fetchTronTransactionReceipt = fetchTronTransactionReceipt; 
module.exports.fetchPolygonTransactionReceipt = fetchPolygonTransactionReceipt;