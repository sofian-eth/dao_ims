
const fundingRoundModel = require('../../../Models/Property/getrounds');
const fundingRoundDetails = require("../../../Models/Property/fundingrounddetails");
const projectServiceAccount = require('../../../Models/Property/service-account');
const userWalletModel = require('../../../Models/Investor/PersonalInformation/getethereumaddress');
const blockchain = require('blockchain');

async function areaMatrix(req,res,next){
    try {
    } catch (err) {}
}



async function totalRounds(req,res,next){
    try {
        let totalRounds = await fundingRoundModel.totalFundingRounds(req.query.projectID);
        return res.status(200).json({error:false,message:'',data:totalRounds});


    } catch (err) {
        err.statusCode = 400;
        err.message = "Error occurred in fetching projects stats";
        err.stackTrace = error;
        next(err);
    }
}


async function projectRating(req,res,next){
    try {
    } catch (err) {}
}


async function projectMinInvestment(req,res,next){
    try {
        let projectStats = await fundingRoundModel.propertyStats(req.query.projectID);
        return res.status(200).json({error:false,message:'',data:projectStats.minInvestment});


    } catch (err) {
        err.statusCode = 400;
        err.message = "Error occurred in fetching projects stats";
        err.stackTrace = error;
        next(err);
    }
}



async function areaLeft(propertyId){
     // l
    //  let serviceAccountId = await projectServiceAccount.propertyServiceAccount(propertyId);
    //  let serviceAccountBalance = await 
    

    
}


async function roundAreaLeft(propertyId){
    let areaLeftPercentage =0;
    let netRemainingArea = 0;
    let serviceAccountId = await projectServiceAccount.propertyServiceAccount(propertyId);
    let activeRoundData = await fundingRoundModel.activeRoundPricing(propertyId);
    let lockedArea = await fundingRoundDetails.totalAllocatedArea(propertyId,serviceAccountId.ownerID); 
    netRemainingArea = activeRoundData.funds -  Math.floor(lockedArea[0].totalAllocatedArea); 
    if(netRemainingArea < 0)
     areaLeftPercentage = 0;
    else {  
    areaLeftPercentage = Math.floor(( netRemainingArea / activeRoundData.funds) * 100);
    }

    let areaLeft = {
        areaLeft: netRemainingArea,
        areaLeftPercentage : areaLeftPercentage
    }

    return areaLeft;

}


async function roundOverPledge(propertyId){
    
}


async function soldArea(propertyId){
    let areaSoldPercentage =0;
    let activeRoundData = await fundingRoundModel.activeRoundPricing(propertyId);
    let serviceAccountModel = await projectServiceAccount.propertyServiceAccount(propertyId);

    let lockedArea = await fundingRoundDetails.totalAllocatedArea(propertyId,serviceAccountModel.ownerID); 
    lockedArea =  lockedArea[0] ?  lockedArea[0].totalAllocatedArea: 0;
  
    areaSoldPercentage = Math.floor((  lockedArea / activeRoundData.funds) * 100);
  
    let areaSold = {
        areaSold: lockedArea,
        areaSoldPercentage : areaSoldPercentage
    }

    return areaSold;

}


async function pendingPledge(propertyId){
    let activeRoundData = await fundingRoundModel.activeRoundPricing(propertyId);
    let areaPledgeData = await fundingRoundDetails.roundPendingPledge(propertyId); 
    areaPledge =  areaPledgeData[0] ?  areaPledgeData[0].areaPledgeArea: 0;
  
    areaPledgePercentage = Math.floor((  areaPledge / activeRoundData.funds) * 100);
  
    let areaPledgeObject = {
        areaPledge: areaPledge,
        areaPledgePercentage : areaPledgePercentage
    }

    return areaPledgeObject;
}



async function remainingSellableArea(propertyId){
    let serviceAccountId = await projectServiceAccount.propertyServiceAccount(propertyId);
    let walletAddress  = await userWalletModel.userWalletAddress(serviceAccountId.ownerID);
    let remainingBalance = await blockchain.balanceService.investorBalance()

}
module.exports.areaMatrix = areaMatrix;
module.exports.totalRounds = totalRounds;
module.exports.projectMinInvestment = projectMinInvestment;
module.exports.projectRating = projectRating;
module.exports.areaLeft = areaLeft;
module.exports.roundAreaLeft =roundAreaLeft;
module.exports.soldArea =soldArea;
module.exports.pendingPledge =pendingPledge;

