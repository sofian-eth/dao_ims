const blockchainModule = require("blockchain");
const dotenv = require('dotenv');
const request = require('request');
const utils = require('util');
const propertyInformationModel = require('../../Models/Property/information');
dotenv.config();
const numberFormatterUtils = require('../../utils/number-formatter');
async function totalSupply(req, res, next) {
  let err = {};
  try {
    let totalSupply = await blockchainModule.blockchainStats.tronContractSupply(
      req.query.smartContractAddress
    );
    res.status(200).json({ error: false, message: "", data: totalSupply });
  } catch (error) {
    console.log(error);
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


async function tronLockFunds(req,res,next){
  let err = {};
  try {
    let circulationSupply = await blockchainModule.fundingRound.tronLockFunds(
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
    console.log(error);
    err.statusCode = 400;
    err.message = "Error occurred in locking funds";
    err.stackTrace = error;
    next(err);
  }
}


async function tronUnlockFunds(req, res, next) {
  let err = {};
  try {
    let txID = await blockchainModule.fundingRound.tronUnLockFunds(
      req.body.smartContractAddress,
      req.body.roundName,
      req.body.walletPassword
    );
    res
      .status(200)
      .json({ error: false, message: "", data: txID });
  } catch (error) {
    console.log(error);
    err.statusCode = 400;
    err.message = "Error occurred unlocking funds";
    err.stackTrace = error;
    next(err);
  }
}



async function tronCirculationSupply(req, res, next) {
  let err = {};
  try {
    let circulationSupply = await blockchainModule.blockchainStats.tronCirculationSupply(
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


async function blockchainStats(req,res,next){
  let err = {};
  try {

    // let buyerAddress = req.body.buyerAddress;
    // let sellerAddress = req.body.sellerAddress;
    // let funds = req.body.funds;
    // let propertyInformation = await propertyInformationModel.projectInformation(req.body.propertyId);
    // let transferEstimate = await blockchainModule.transferService.gasEstimateOfTransfer(propertyInformation.blockchainMainContract,buyerAddress,sellerAddress,funds);

    let balance_eth = await blockchainModule.balanceService.userEtherBalance(process.env.daopublicaddress);

    let usdBalance =  await currencyExchange();
    // let gasEstimates = await gasPriceEstimates();
    // gasEstimates = JSON.parse(gasEstimates);
    usdBalance = JSON.parse(usdBalance);
   
    let balance_usd = usdBalance.USD * balance_eth;
    
    // let pricing = [
    //   {
    //     title: "Fastest",
    //     description: "",
    //     price_eth: gasEstimates.result.FastGasPrice,
    //     tx_price_eth : transferEstimate * (gasEstimates.result.FastGasPrice/100000000),
    //     price_usd: (transferEstimate *(gasEstimates.result.FastGasPrice /100000000)) *  usdBalance.USD
    //   },

    //   {
    //     title: "Proposed",
    //     description: "",
    //     price_eth: gasEstimates.result.ProposeGasPrice,
    //     tx_price_eth : transferEstimate * (gasEstimates.result.ProposeGasPrice/100000000),
    //     tx_price_usd: (transferEstimate *(gasEstimates.result.ProposeGasPrice /100000000)) *  usdBalance.USD
    //   },


    //   {
    //     title: "Slowest",
    //     description: "",
    //     price_eth: gasEstimates.result.SafeGasPrice,
    //     tx_price_eth : transferEstimate * (gasEstimates.result.SafeGasPrice/100000000),
    //     price_usd: (transferEstimate *(gasEstimates.result.SafeGasPrice /100000000)) *  usdBalance.USD
    //   },


    // ];


    let jsonObject = {
      balance_usd : numberFormatterUtils.numberFormatter( Math.ceil(balance_usd)),
      balance_eth: balance_eth,
      estimatedTransactionCount :numberFormatterUtils.numberFormatter(Math.ceil(balance_usd/10))
      // pricing: pricing
    }
    return res.status(200).json({error:false,message: "",data: jsonObject});
  } catch(error){
    console.log(error);
    err.statusCode = 400;
    err.message = "Error occurred in fetching milestone";
    err.stackTrace = error;
    next(err);
  }
}  


async function currencyExchange(){
  return new Promise(function(resolve,reject){
    request.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD',function(error,response,body){
      if(!error)
        resolve(body);
      
      if(error)
        reject(error);  
    })
    
  })
}


async function gasPriceEstimates(){
  const etherScanUrl = process.env.etherScan + 'api?module=gastracker&action=gasoracle&apikey='+process.env.etherScanApi;
  return new Promise(function(resolve,reject){
    request.get(etherScanUrl,function(error,response,body){
      if(!error)
           resolve(body);
      if(error)
          reject(error);
    })

  })
}

async function investorBalance(req,res,next){
  let err = {};
  try {

    let walletBalance = await blockchainModule.balanceService.investorBalance(req.body.smartContractAddress,req.body.walletAddress,req.body.sellerAddress);
    return res.status(200).json({error:false,message:'',data:walletBalance});

  } catch(error){
    err.statusCode = 400;
    err.message = "Error occurred in fetching balance";
    err.stackTrace = error;
    next(err);
  }
}

module.exports.totalSupply = totalSupply;
module.exports.circulationSupply = circulationSupply;
module.exports.transfer = transfer;
module.exports.lockFunds = lockFunds;
module.exports.unlockFunds = unlockFunds;
module.exports.blockchainStats = blockchainStats;
module.exports.investorBalance =investorBalance;
module.exports.tronLockFunds = tronLockFunds;
module.exports.tronCirculationSupply = tronCirculationSupply;
module.exports.tronUnlockFunds = tronUnlockFunds;