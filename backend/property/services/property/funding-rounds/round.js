
const { daoPrivateKey } = require("blockchain/keys");
const fundingRoundDetailModel = require("../../../Models/Property/fundingrounddetails");
const fundingRoundModel = require("../../../Models/Property/getrounds");
const fundingRoundDTO = require('../../../dto/funding-round-model');
const projectServiceAccount = require('../../../Models/Property/service-account');
const moment = require('moment');
const statusEnum = require('../../../resources/statusEnum');
const balanceModel = require("../../../Models/Investor/PersonalInformation/userportfolio");
const roundsModel = require('../../../Models/Property/getrounds.js');

const updateRoundModel = require('../../../Models/Property/updaterounds');
const blockchainModule = require('blockchain');
const propertyModel = require('../../../Models/Property/information');
const transactionModule = require('../../../Models/Admins/Transactions/transactions');
const numberFormatterUtils = require('../../../utils/number-formatter');


async function fetchDevelopmentRounds(req,res,next){
  let err={};
  try {
    let _records = await fundingRoundModel.fetchAllRoundsSP(req.query.projectID);
      return res.status(200).json(_records);

  } catch(error){
      console.log(error);
    err.statusCode = 400;
    err.message = "Error occurred in fetching development round ";
    err.stackTrace = error;
    next(err);
  }
}

async function projectRoundsListing(req, res, next) {
  let err={};

 
  try {
    let roundNumber = 1;
    let data = {};
    let responseArr = [];  
    let totalFundingRounds = await fundingRoundModel.totalFundingRounds(req.query.projectID);
    let discount = await fundingRoundModel.getDiscount(req.query.projectID);
    let fundingRound = await fundingRoundDetailModel.fundingRound(req.query.projectID);
    let serviceAccountId = await projectServiceAccount.propertyServiceAccount(req.query.projectID);
   
    for (round of fundingRound)
    
    {
    //   let areaPledged = await fundingRoundDetailModel.projectRoundPledge(round.id,req.query.projectID,serviceAccountId.ownerID);
    
    //   areaPledged = areaPledged[0].totalAreaPledged ? areaPledged[0].totalAreaPledged : 0;
    // //  areaPledgedPercentage = Math.floor((areaPledged/round.funds)*100);
    //   areaLockedPercentage = Math.floor((areaPledged/round.funds)*100);

    //   // let areaLeftPercentage = Math.floor(((round.funds-areaPledged)/round.funds)*100);
    //   areaLeftPercentage = 100 - areaLockedPercentage;
     
      if(round.status == statusEnum.done)
          {
            data.locked = 100;
            data.areaRemaining = 0;
          }

      if(round.status == statusEnum.upcoming){
        data.locked = 0;
        data.areaRemaining = 100;
      }   
      
      if(round.status == statusEnum.active){
        let areaRemaining =  await balanceModel.userBalance(serviceAccountId.ownerID,req.query.projectID);
        areaRemaining = numberFormatterUtils.checkNegativeValue(areaRemaining);
        data.areaRemaining = numberFormatterUtils.checkMaximumPercentage(Math.ceil((areaRemaining/round.funds)*100));
        data.locked = 100- data.areaRemaining; 
      }

      data.id = round.id;
      data.roundName = round.roundName;
      data.startDate = round.startDate;
      data.endDate = round.endDate;
      data.totalFunds = round.funds;
      // data.locked = areaLockedPercentage;
      // data.areaRemaining = areaLeftPercentage;
      data.roundPrice = round.pricePerSqft;
      data.roundNumber = roundNumber;
      data.status = round.status;
      data.totalRound = totalFundingRounds.fundingRounds;
      data.discount = (((round.marketPrice-round.pricePerSqft)*100)/round.marketPrice).toFixed(2)+" %";
      
      let response = new fundingRoundDTO.fundingRoundModel(data);

      responseArr.push(response);
      roundNumber = roundNumber+1;

    }


    return res.status(200).json({error:false,message:'',data:responseArr});


  } catch (error) {
    console.log(error);
    err.statusCode = 400;
    err.message = "Error occurred in fetching development round ";
    err.stackTrace = error;
    next(err);
  }
}

async function roundLock(req, res, next) {

    try {
    } catch (err) {}
}

async function unlockFunds (req, res, next) {

  let err = {};
 

  try {
      console.log(req.body); 
      let roundDetail = await roundsModel.roundDetail(req.body);
      if(roundDetail && roundDetail.name == 'Done')
          throw 'Developmentunding Round have been closed previously';
      let propertyDetail =   await propertyModel.projectInformation(req.body.propertyId); 
      let pendingNonce = await  transactionModule.pendingTransactionCount();
    
      let blockchainUnlockFund = await blockchainModule.fundingRound.unLockFunds(propertyDetail.blockchainMainContract,propertyDetail.blockchainNetwork,roundDetail.roundName, req.body.walletPassword,pendingNonce);
      let dbUpdate = await updateRoundModel.updateRound(req.body.id,blockchainUnlockFund,req.body.propertyId,roundDetail.funds,roundDetail.ownerID);
// 

      return res.status(200).json({error:false,message: 'Funds unlocked successfully',data:''});


  } catch(error){
    console.log(error);
      err.statusCode = 400;
      err.message = error;
      err.stackTrace = error;
      next(err);
  }




}



async function roundDetails(req,res,next){
  try {
    let projectID = req.query.projectID;
    let roundID = req.query.roundID;

    


  } catch(err){

  }
}

async function activeRoundPricing(req, res, next) {}

module.exports.projectRoundsListing = projectRoundsListing;
module.exports.roundLock = roundLock;
module.exports.unlockFunds = unlockFunds;
module.exports.activeRoundPricing = activeRoundPricing;
module.exports.fetchDevelopmentRounds =fetchDevelopmentRounds;
