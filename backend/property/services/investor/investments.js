const investmentModel = require('../../Models/Investor/PersonalInformation/userportfolio');
const activeInvestmentDTO = require('../../dto/active-investment-model');
const roundsModel = require("../../Models/Property/getrounds");
const projectInformation = require("../../Models/Property/information");
const { logActivity } = require('../shared/activity-logger');
const ActionCategory = require('../../resources/enum-Action-Category');
const ActivityEvent = require('../../resources/enum-ActivityLog-event');

const holderModel = require('../../Models/Investor/General/holders');
async function activeInvestments(req,res,next){
    let err={};
    try {
        const startDate = req.query.startDate ? req.query.startDate : null;
        const endDate = req.query.endDate ? req.query.endDate : null;
        const projectID = req.query.projectID&&req.query.projectID!=='0' ? req.query.projectID : null;
        let investments = [];
        let userInvestments = await investmentModel.activeInvestments(req.decoded.id, projectID, startDate, endDate);
        let totalArea=0;
        let netActualInvestment=0;
        let netAmountWithdraw = 0;
        let netCurrentInvestment=0;
        let onCompletionInvestment = 0;
        let dtoResponse = {};
        for (investment of userInvestments){
            let data = {};
            // let activeRoundData = await roundsModel.activeRoundPricing(investment.propertyId);
            // let pledgeArea = await projectInformation.pledgeAreaStats(investment.propertyId);
            
            // let unlocked = await investmentModel.getUnlockedArea(req.decoded.id,investment.propertyId);
            // let roundPrice = activeRoundData.pricePerSqft;
              data.propertyId = investment.propertyId;
              data.propertyName =  investment.propertyName; 
              data.propertySymbol = investment.propertySymbol;
              data.totalInvestedAmount = investment.totalInvestedAmount;
            //   data.propertyCoverPhoto = investment.coverPhoto; 
              data.propertyLogo = investment.propertyLogo; 
            //   data.areaUnits =  investment.balance;
            //   data.purchasedPrice =  investment.purchasedPrice;
            //   totalArea = totalArea + data.areaUnits;
            //   data.propertyType = investment.propertyType;
            //   data.pledgeArea = pledgeArea;
            //   data.unlockedArea = (unlocked&&unlocked.unlocked)?unlocked.unlocked:0;

              data.totalArea =  investment.balance;
              data.totalUnlockedArea = investment.totalUnlockedArea;
              data.totalDemarcatedArea = investment.totalDemarcatedArea;
              data.netInvestment = investment.purchasedPrice;
              data.totalWithdraw = investment.totalWithdraw;
              data.lastRoundPrice= investment.lastRoundPrice;
              data.currentPrice =  investment.currentPrice;
              data.marketplaceThumbnail = investment.marketplaceThumbnail;
              data.category = investment.category;
              data.avgBuyingRate = investment.avgBuyingRate;
              data.startedAt = investment.startedAt;
              data.totalTransactions = investment.totalTransactions;

              totalArea = totalArea + investment.balance;
              netActualInvestment = netActualInvestment + (investment.purchasedPrice ? investment.purchasedPrice : 0);
              netAmountWithdraw = netAmountWithdraw + investment.totalWithdraw;
              netCurrentInvestment = netCurrentInvestment + (investment.balance*investment.currentPrice);
              onCompletionInvestment = onCompletionInvestment + (investment.balance*investment.lastRoundPrice);


            //   let response = new activeInvestmentDTO.activeInvestmentModel(data);
            investments.push(data);

    } 
            dtoResponse.investments = investments;
            dtoResponse.totalArea = totalArea;
            dtoResponse.netActualInvestment =  netActualInvestment;
            dtoResponse.netCurrentInvestment =  netCurrentInvestment;
            dtoResponse.onCompletionInvestment = onCompletionInvestment;
            dtoResponse.netAmountWithdrawn = netAmountWithdraw;
            let response = new activeInvestmentDTO.activeInvestmentModel(dtoResponse);
            logActivity(
                {
                        logName: "Active Purchases",
                        description: "Viewed the active purchases page",
                        subjectType: "activePurchases",
                        event: ActivityEvent.VIEWED,
                        causerID: req.decoded.id,
                        causerType: "users",
                        properties: {
                            attributes: null,
                            old: null
                        },
                        source: null,
                        metadata:null
                    }
                    ,req)
            return res.status(200).json({error:false, message: "",data: response});
   

           
    } catch(error){
        console.log(error); 
        err.statusCode = 400;
        err.message = "Error occurred in fetching active investments";
        err.stackTrace = error;
        next(err);
    }

}

async function fetchHolders(req,res,next){

    try{
        let holderDetail = await holderModel.getholderDetail()
        return res.status(200).json({error:false, message: "",data: holderDetail});
    }catch(error){
        console.log(error)
        err.statusCode = 400;
        err.message = "Error occurred in fetching active investments";
        err.stackTrace = error;
        next(err);
    }

}

module.exports.activeInvestments = activeInvestments;
module.exports.fetchHolders = fetchHolders;