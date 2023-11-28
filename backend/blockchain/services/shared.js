const fs = require("fs");
const Tx = require("ethereumjs-tx");
const path = require("path");
const web3 = require("web3");
const TronWeb = require('tronweb');
const {
    daoPublicWalletAddress,
    webSocketProvider,
    polygonSocketProvider
  } = require("../keys");


let ethWalletFile = fs
  .readFileSync(path.join(__dirname, "../.key"))
  .toString()
  .trim();

  let tronWalletFile = fs
  .readFileSync(path.join(__dirname, "../.tronKey"))
  .toString()
  .trim();

let daoPublicAddress = daoPublicWalletAddress;
let socketProvider = webSocketProvider;
let polygonProvider = polygonSocketProvider;
const fullNode = process.env.tronApiKey;
const solidityNode = process.env.tronApiKey;
const eventServer = process.env.tronApiKey;
const privateKey = process.env.PRIVATE_KEY_SHASTA;
const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);






const options = {
  reconnect: {
    auto: true,
    delay: 5000, // ms
    maxAttempts: 5,
    onTimeout: false,
  },
};
var provider = new web3.providers.WebsocketProvider(socketProvider, options);
var polygonsocketProvider = new web3.providers.WebsocketProvider(polygonProvider,options);
var web3js = new web3(provider);
var web3jsTron = new web3(provider);
var web3jsPolygon = new web3(polygonsocketProvider);

provider.on("error", (e) => {
  provider = new web3.providers.WebsocketProvider(socketProvider, options);
});
provider.on("end", (e) => {
  provider = new web3.providers.WebsocketProvider(socketProvider, options);

  provider.on("connect", function () {});

  web3js.setProvider(provider);
});


provider.on("error", (e) => {
  provider = new web3.providers.WebsocketProvider(polygonProvider, options);
});
provider.on("end", (e) => {
  provider = new web3.providers.WebsocketProvider(polygonProvider, options);

  provider.on("connect", function () {});

  web3jsPolygon.setProvider(provider);
});



function checkEthConnectivity(){
  web3js.eth.net.isListening()
  .then(function(result){
    console.log("Blockchain eth module Connected",result);
  })
  .catch(function(error){
    console.log("Attempting to reconnect",error);
    web3js = new web3(new web3.providers.WebsocketProvider(socketProvider,options));
  })
}


function checkPolygonConnectivity(){
  web3jsPolygon.eth.net.isListening()
  .then(function(result){
    console.log("Blockchain polygon module Connected",result);
  })
  .catch(function(error){
    console.log("Attempting to reconnect",error);
    web3jsPolygon = new web3(new web3.providers.WebsocketProvider(polygonProvider,options));
  })
}


// Set interval to check connectivity after every 30 minutes
setInterval(checkEthConnectivity,60000);
setInterval(checkPolygonConnectivity,60000);


const rawContract = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../build/contracts/ProjectContract.json")
  )
);

/**
 * 
 * @param {String} smartContractAddress 
 * @returns {object} contract
 */



function ethereumContractInitializer(smartContractAddress){
    let contract = new web3js.eth.Contract(rawContract.abi, smartContractAddress);
    return contract;
}


async function tronContractInitializer(smartContractAddress){
 
  let contract  = await tronWeb.contract(rawContract.abi,smartContractAddress);
  return contract;
}




async function tronTransaction(_smartContractAddress,_to,_from,_amount,_password){
  try {
    console.log("To address",_to);
    console.log("from address",_from);
    console.log("Smart",_smartContractAddress);
    const tronPrivateKey = await fetchPrivateKeyTron(tronWalletFile,_password);
    let tronPrivateKeyNew = tronPrivateKey.substring(2, 66);  
    const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,tronPrivateKeyNew);
    var senderAddress = tronWeb.defaultAddress.base58;
    var parameter = [{type:'address',value:_from},{type:'address',value:_to},{type:'uint256',value:_amount}]
    var options = {
        feeLimit:100000000,
      
    }


   const transaction = await tronWeb.transactionBuilder.triggerSmartContract(tronWeb.address.toHex(_smartContractAddress), "transferFrom(address,address,uint256)", options,
    parameter,tronWeb.address.toHex(senderAddress));
 
  const signedTxn = await tronWeb.trx.sign(transaction.transaction,tronPrivateKeyNew);
 
  const receipt = await tronWeb.trx.sendRawTransaction(signedTxn);
  console.log("Receipt",receipt);
  return receipt;
  } 
  catch(error){
    console.log(error);
    throw error;
  }

}





async function tronContractTotalSupply(_smartContractAddress){
  try {
    let contract = await tronWeb.contract().at(_smartContractAddress);
    //Use call to execute a pure or view smart contract method.
    // These methods do not modify the blockchain, do not cost anything to execute and are also not broadcasted to the network.
    let result = await contract.totaltokens().call();
   return result;
} catch(error) {
   throw error;
}

}



async function tronContractCirculationSupply(_smartContractAddress){
  try {
    let contract = await tronWeb.contract().at(_smartContractAddress);
    //Use call to execute a pure or view smart contract method.
    // These methods do not modify the blockchain, do not cost anything to execute and are also not broadcasted to the network.
    let result = await contract.circulationsupply().call();
   return result;
} catch(error) {
   throw error;
}

}

async function tronLockFunds(_smartContractAddress,roundName,funds,startDate,endDate,_password){
  try {
    console.log("Smart contract address",_smartContractAddress);
    const tronPrivateKey = await fetchPrivateKey(tronWalletFile,_password);
    let tronPrivateKeyNew = tronPrivateKey.substring(2, 66);  
    const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,tronPrivateKeyNew);
    var senderAddress = tronWeb.defaultAddress.base58;
    var parameter = [{type:'string',value:roundName},{type:'uint256',value:funds},{type:'uint256',value:startDate},{type:'uint256',value:endDate}]
    var options = {
        feeLimit:100000000,
      
    }


  const transaction = await tronWeb.transactionBuilder.triggerSmartContract(tronWeb.address.toHex(_smartContractAddress), "developmentRounds(string,uint256,uint256,uint256)", options,
    parameter,tronWeb.address.toHex(senderAddress));
    console.log("Tron web",tronWeb);
  const signedTxn = await tronWeb.trx.sign(transaction.transaction,tronPrivateKeyNew);
 
  const receipt = await tronWeb.trx.sendRawTransaction(signedTxn);
  return receipt;
  } 
  catch(error){
    throw error;
  }

}



async function tronunLockFunds(_smartContractAddress,roundName,_password,pendingNonce){
  try {
    console.log("Smart contract address",_smartContractAddress);
    const tronPrivateKey = await fetchPrivateKey(tronWalletFile,_password);
    let tronPrivateKeyNew = tronPrivateKey.substring(2, 66);  
    const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,tronPrivateKeyNew);
    var senderAddress = tronWeb.defaultAddress.base58;
 
    var senderAddress = tronWeb.defaultAddress.base58;
    var parameter = [{type:'string',value:roundName}]
    var options = {
        feeLimit:100000000,
      
    }


  const transaction = await tronWeb.transactionBuilder.triggerSmartContract(tronWeb.address.toHex(_smartContractAddress), "releasefunds(string)", options,
    parameter,tronWeb.address.toHex(senderAddress));
 
  const signedTxn = await tronWeb.trx.sign(transaction.transaction,tronPrivateKeyNew);
 
  const receipt = await tronWeb.trx.sendRawTransaction(signedTxn);
  return receipt;
  } 
  catch(error){
    console.log(error);
    throw error;
  }

}


/**
 * 
 
 * @returns {int} gasLimit
 */


async function gasLimit() {
  return new Promise(function (resolve, reject) {
    web3js.eth.getBlock("latest", false, (error, result) => {
      if (error) reject("Error in fetching gas limit");

      resolve(result.gasLimit);
    });
  });

}


/**
 * 
   @param {string} accountPassword 
 * @returns {int} privateKey
 */

async function fetchPrivateKey(walletFile,accountPassword) {
  return new Promise(function (resolve, reject) {
    if (!web3js.eth.accounts.wallet.decrypt([walletFile], accountPassword)) {
      reject("Invalid Password");
    }
    if (
      web3js.eth.accounts.wallet.decrypt(
        [walletFile],
        accountPassword
      ) instanceof Error
    ) {
      reject("Invalid Password");
    }

    let decrypted = web3js.eth.accounts.wallet.decrypt(
      [walletFile],
      accountPassword
    );
    resolve(decrypted[0].privateKey);
  });
}
async function fetchPrivateKeyTron(walletFile,accountPassword) {

  console.log("Private wallet",walletFile);
  console.log("Private key password",accountPassword);
  return new Promise(function (resolve, reject) {
    if (!web3jsTron.eth.accounts.wallet.decrypt([walletFile], accountPassword)) {
      reject("Invalid Password");
    }
    if (
      web3jsTron.eth.accounts.wallet.decrypt(
        [walletFile],
        accountPassword
      ) instanceof Error
    ) {
      reject("Invalid Password");
    }

    let decrypted = web3jsTron.eth.accounts.wallet.decrypt(
      [walletFile],
      accountPassword
    );
    console.log("Decrypted private key",decrypted);
    resolve(decrypted[0].privateKey);
  });
}
async function fetchPrivateKeyTron(walletFile,accountPassword) {

  console.log("Private wallet",walletFile);
  console.log("Private key password",accountPassword);
  return new Promise(function (resolve, reject) {
    if (!web3jsTron.eth.accounts.wallet.decrypt([walletFile], accountPassword)) {
      reject("Invalid Password");
    }
    if (
      web3jsTron.eth.accounts.wallet.decrypt(
        [walletFile],
        accountPassword
      ) instanceof Error
    ) {
      reject("Invalid Password");
    }

    let decrypted = web3jsTron.eth.accounts.wallet.decrypt(
      [walletFile],
      accountPassword
    );
    console.log("Decrypted private key",decrypted);
    resolve(decrypted[0].privateKey);
  });
}

async function blockchainRelayer(signedTransaction) {


  return new Promise(function (resolve, reject) {
    debugger;
    web3js.eth.sendSignedTransaction(signedTransaction, function (err, hash) {
      console.log(" Blockchain relayer Error",err);
      console.log("Blockchain relayer Hash",hash);
      if (err) reject(err);
      if (!err) {
        resolve(hash);
      }
    });
  });
};



/**
 * 
 *  @param {object} ABI
 *  @param {string} walletPassword   
 *  @param {string} smartContractAddress   
 *  @param {string} pendingNonce 

* @returns {object} transactionArray
 */



async function transactionObject(ABI, walletPassword, smartContractAddress,pendingNonce) {
    let count;
    let gasPrice = 60 * 1000000000;
    let gasLimitValue;
    let privateKey;
  
    return new Promise(function (resolve, reject) {
      fetchPrivateKey(ethWalletFile,walletPassword)
        .then(function (result) {
          privateKey = Buffer.from(result.substring(2, 66), "hex");
        //   return gasLimit();
        // })
        // .then(function (result) {
       
        //   gasLimitValue = result;
          return web3js.eth.getTransactionCount(daoPublicAddress,"pending");
        })
        .then(function (v) {
         
        console.log("Count",v) ;   
        console.log("pending nonce",pendingNonce) ; 
      //    count = v + pendingNonce;
      const rawTransaction = {
            nonce: v,
            from: daoPublicAddress,
            to: smartContractAddress,
            value: 0,
            gasPrice: gasPrice,
            gas: 80000,
            data: ABI,
            chainId: 1,
          };
          console.log("Eth transaction",rawTransaction);
          let transaction = new Tx(rawTransaction);
          transaction.sign(privateKey);
          let signedTransaction = "0x" + transaction.serialize().toString("hex");
          let transactionPayload = new Tx(signedTransaction)
            .hash()
            .toString("hex");
          let transactionFinalPayload = "0x" + transactionPayload;
          let transactionArray = [transactionFinalPayload, signedTransaction];
  
          resolve(transactionArray);
        })
        .catch(function (error) {
          reject (error);
        });
    });
  }
 

async function transactionReceipt(txHash){
  console.log(txHash);
  let response;
  return new Promise(function(resolve,reject){
    web3js.eth.getTransactionReceipt(txHash)
    .then(function(result){
      console.log(result);
      response = result;
      let blockNumber = response.blockNumber;
      return web3js.eth.getBlock(blockNumber);
    })
    .then(function(result){
      console.log(result);
      let timeStamp = new Date(result.timestamp*1000);

      response.timestamp = timeStamp;
      console.log("JSON Response",response);
    resolve(response);
    })
    .catch(function(error){
      reject(error);
    })
  
  });

  }


  async function polygonTransactionReceipt(txHash){
    console.log(txHash);
    let response;
    return new Promise(function(resolve,reject){
      web3jsPolygon.eth.getTransactionReceipt(txHash)
      .then(function(result){
        console.log(result);
        response = result;
        let blockNumber = response.blockNumber;
        return web3jsPolygon.eth.getBlock(blockNumber);
      })
      .then(function(result){
        console.log(result);
        let timeStamp = new Date(result.timestamp*1000);
  
        response.timestamp = timeStamp;
        console.log("JSON Response polygon",response);
      resolve(response);
      })
      .catch(function(error){
        reject(error);
      })
    
    });
  
    }
  


 async function tronTransactionReceipt(txHash){
   let response;
   let txStatus = await tronWeb.trx.getTransactionInfo(txHash);
  //  console.log("Tx Status",txStatus);
   return txStatus;
 } 


  async function userEtherBalance(address){
    console.log("Web3 Js",web3js);
    return new Promise(function(resolve,reject){
      web3js.eth.getBalance(address)
      .then(function(result){
        return web3js.utils.fromWei(result,'ether');
      })
      .then(function(result){

        resolve(result);
      })
      .catch(function(error){
        reject(error);
      })
    })
  }


  


// async function transactionEvent(blockNumber,txHash){
//   return new Promise(function(resolve,reject){
//     web3js.eth.getTransactionReceipt(txHash)
//     .then(function(result){
//       resolve(result);
//     })
//     .catch(function(error){
//       reject(error);
//     })

//   });

// }  
module.exports.gasLimit = gasLimit;
module.exports.fetchPrivateKey = fetchPrivateKey;
module.exports.blockchainRelayer = blockchainRelayer;
module.exports.transactionObject = transactionObject;
module.exports.ethereumContractInitializer = ethereumContractInitializer;
module.exports.transactionReceipt = transactionReceipt;
module.exports.userEtherBalance = userEtherBalance;
module.exports.tronContractInitializer = tronContractInitializer;
module.exports.tronTransaction = tronTransaction;
module.exports.tronLockFunds = tronLockFunds;
module.exports.tronunLockFunds = tronunLockFunds;
module.exports.tronContractTotalSupply = tronContractTotalSupply;
module.exports.tronContractCirculationSupply = tronContractCirculationSupply;
module.exports.tronTransactionReceipt = tronTransactionReceipt;
module.exports.polygonTransactionReceipt = polygonTransactionReceipt;
module.exports.tronWeb = tronWeb;
