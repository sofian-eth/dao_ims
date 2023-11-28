const investmentModel = require("../../Models/Investor/PersonalInformation/userportfolio");
const dashboardDTO = require("../../dto/dashboard-model");
const roundsModel = require("../../Models/Property/getrounds");
const userInformationModel = require("../../Models/Investor/PersonalInformation/personalinformation");
const projectStatsModel = require("../../Models/Property/propertystats");
const areaLeftStats = require("../property/stats/stats");
const transactionModel = require("../../Models/Investor/Transactions/transaction");
const { calculateEarnedROI, calculateForecastedROI } = require("./../shared/investments");
const projectServiceAccount = require('../../Models/Property/service-account');
const balanceModel = require('../../Models/Investor/PersonalInformation/userportfolio');
const blockchain = require('blockchain');
const numberFormatterUtils = require('../../utils/number-formatter');
const moment = require('moment');
const authmodel = require('./../../Models/Admins/Auth/checkpass.js');
const eidiService = require("../eid/daoEidi.service");



async function dashboard(req, res, next) {
  let err = {};
  try {
    let responseArr = [];
    let totalInvestmentValue;

    let userInformation = await userInformationModel.userInformation(
      req.decoded.id
    );

    

    


    let userInvestments = await investmentModel.activeInvestments(
      req.decoded.id
    );
    let userReserveArea = await investmentModel.reserveInvestments(
      req.decoded.id
    );
    let estimation = await investmentModel.estimation(
      req.decoded.id
    );

    let demarcatedUnits = await investmentModel.demarcatedAreaUnits(req.decoded.id);

    let _estimation = [...estimation[0]];
    if (estimation.length > 0 && estimation[0].length > 0) {
      estimation = estimation[0].reduce(function (p, c) {
        return {
          marketNetCompletion: p.marketNetCompletion + c.marketNetCompletion,
          blocNetCompletion: p.blocNetCompletion + c.blocNetCompletion,
          netInvestment: p.netInvestment + c.netInvestment
        }
      });
    }
    let transactionReminder = await transactionModel.transactionReminder(
      req.decoded.id
    );

    let totalProjectInvestors = 0;
    if (userInvestments && userInvestments.length > 0)
      totalProjectInvestors = await projectStatsModel.totalInvestors(userInvestments[0].propertyId);

    let projectionValue = 0;

    let totalArea = 0;
    let actualInvestmentValue = 0;
    let currentInvestmentValue = 0;
    let futureProjectionValue = 0;
    let threeYearProjectionValue = 0;
    let estimatedProjectCompletionValue = 0;
    let estimatedMarketCompletionValue = 0;

    let data = {};

    let cumulativeGraphValues = [];
   // userInformation[0].email ='ntump@gmail.com';
    data.eidiReceived = await eidiService.eidiReceived(userInformation[0].email);
    
    for (investment of userInvestments) {
      let roundsData = {};
      if (investment.category === 'development') {

        let graphValues = [];


        let activeRoundData = await roundsModel.activeRoundPricing(
          investment.propertyId
        );

        let serviceAccountId = await projectServiceAccount.propertyServiceAccount(investment.propertyId);

        let propertyStats = await projectStatsModel.rateOfReturn(investment.propertyId);
        //  let soldArea = await areaLeftStats.soldArea(investment.propertyId);
        let roundPrice = activeRoundData.pricePerSqft;
        let areaLeft = await balanceModel.userBalance(serviceAccountId.ownerID, investment.propertyId);
        areaLeft = numberFormatterUtils.checkNegativeValue(areaLeft);
        let areaLeftPercentage = Math.ceil((areaLeft / activeRoundData.funds) * 100);
        areaLeftPercentage = numberFormatterUtils.checkMaximumPercentage(areaLeftPercentage);
        let soldArea = numberFormatterUtils.checkNegativeValue((activeRoundData.funds - Math.floor(areaLeft)));
        let soldAreaPercentage = numberFormatterUtils.checkMaximumPercentage(100 - areaLeftPercentage);


        let completedRound = await roundsModel.completedRound(
          investment.propertyId
        );
        let fundingRounds = await roundsModel.totalFundingRounds(
          investment.propertyId
        );

        let areaPledged = await areaLeftStats.pendingPledge(investment.propertyId);
        let finalRoundPrice = await roundsModel.finalRoundPrice(investment.propertyId);
        let transactions = await transactionModel.getConfirmedTranByUserAndProperty(req.decoded.id, investment.propertyId);
        let totalAreaPledged = 0;
        // transactions = [
        //   {
        //     areaPledged: 1000, 
        //     sqftPrice: 5250,
        //     months: 11,
        //   },
        //   {
        //     areaPledged: 200,
        //     sqftPrice: 5640,
        //     months: 6,
        //   },
        //   {
        //     areaPledged: 100,
        //     sqftPrice: 5990,
        //     months: 3,
        //   }
        // ];
        // console.log("roundPrice = ", roundPrice);
        // console.log("finalRoundPrice = ", finalRoundPrice);
        transactions.forEach((transaction, index) => {
          //roundPrice= 6425;
          // console.log("-------------------");
          // console.log(index);
          // console.log("transaction = ", transaction);
          let investedAmount = transaction.areaPledged * transaction.sqftPrice;
          // console.log("investedAmount = transaction.areaPledged * transaction.sqftPrice = ",investedAmount);
          let currentAmount = transaction.areaPledged * roundPrice;
          // console.log("currentAmount = transaction.areaPledged * roundPrice = ", currentAmount);
          let monthsDiff = moment().diff(moment(transaction.createdAt), 'month');
          // console.log("monthsDiff = moment().diff(moment(transaction.createdAt), 'month') = ", monthsDiff);
          transaction.monthsDiff = monthsDiff;
          // console.log("transaction.monthsDiff = ", monthsDiff);
          transaction.investedAmount = investedAmount;
          // console.log("transaction.investedAmount = ", investedAmount);
          transaction.currentAmount = currentAmount;
          // console.log("transaction.currentAmount = ", currentAmount);
          transaction.roi = calculateEarnedROI(currentAmount, investedAmount, monthsDiff);
          // console.log("transaction.roi = (((((currentAmount-investedAmount)/investedAmount)*100)/monthsDiff)*12).toFixed(2) = ", transaction.roi);
          transaction.forcasted = calculateForecastedROI(finalRoundPrice.marketPrice, transaction.areaPledged, investedAmount);
          // console.log("transaction.forcasted = ((((((finalRoundPrice.marketPrice*transaction.areaPledged)-investedAmount)/investedAmount)*100))).toFixed(2)", transaction.forcasted);
          totalAreaPledged = totalAreaPledged + transaction.areaPledged;
        });
        let accmulatedORI = transactions.reduce((pre, cur) => totalAreaPledged !== 0 ? ((cur.roi * cur.areaPledged) / totalAreaPledged) + pre : 0, 0);
        let accmulatedForcasted = transactions.reduce((pre, cur) => totalAreaPledged !== 0 ? ((cur.forcasted * cur.areaPledged) / totalAreaPledged) + pre : 0, 0);
        roundsData.accmulatedForcasted = Math.round(accmulatedForcasted);
        roundsData.accmulatedORI = Math.round(accmulatedORI);
        roundsData.areaPledged = areaPledged.areaPledge;
        roundsData.areaLeft = {
          areaLeft: areaLeft,
          areaLeftPercentage: areaLeftPercentage
        };
        roundsData.soldArea = {
          areaSold: soldArea,
          areaSoldPercentage: soldAreaPercentage
        };
        roundsData.totalArea = activeRoundData.funds;
        roundsData.propertyName = investment.propertyName;
        roundsData.areaUnits = investment.balance;
        roundsData.propertyCoverPhoto = investment.coverPhoto;
        roundsData.propertyLogo = investment.propertyLogo;
        roundsData.purchasedPrice = Math.round(investment.purchasedPrice);
        roundsData.currentValue = Math.round(roundsData.areaUnits * roundPrice);
        roundsData.endDate = activeRoundData.displayEndDate;
        roundsData.lastRoundMarketPrice = activeRoundData.lastRoundMarketPrice;
        roundsData.roundPrice = roundPrice;
        totalArea = totalArea + investment.balance;
        actualInvestmentValue = actualInvestmentValue + investment.purchasedPrice;
        currentInvestmentValue =
          Math.round(currentInvestmentValue + investment.balance * roundPrice);
        let projectionBaseValue = currentInvestmentValue;

        estimatedProjectCompletionValue = Math.round(estimatedProjectCompletionValue + (investment.balance * finalRoundPrice.pricePerSqft));

        estimatedMarketCompletionValue = Math.round(estimatedMarketCompletionValue + (investment.balance * finalRoundPrice.marketPrice));
        graphValues.push({ name: 'Current', value: roundsData.currentValue });
        for (i = 1; i <= 3; i++) {
          let nthName = i + nth(i);

          projectionBaseValue =
            projectionBaseValue +
            projectionBaseValue * (propertyStats[0].ROR / 100);
          let data = {
            name: nthName + ' year',
            value: projectionBaseValue,
          };

          graphValues.push(data);

          if (i == 3)
            threeYearProjectionValue = projectionBaseValue;
          cumulativeGraphValues.push(data);

        }

        roundsData.graphValues = graphValues;

        roundsData.completedRound = completedRound.completedRound + 1;
        roundsData.fundingRounds = fundingRounds.fundingRounds;
        roundsData.propertyId = investment.propertyId;
        roundsData.completionArea = investment.completionArea;
        roundsData.expectedmaturitydate = investment.expectedmaturitydate;
        roundsData.category = investment.category;


      } else {

        roundsData = investment;
        roundsData.rentPayouts = [];//await investmentModel.getUserRentPayouts(req.decoded.id);
      }

      responseArr.push(roundsData);

    }






    var graphValues = [];
    graphValues.push({ name: 'Current', value: currentInvestmentValue });
    cumulativeGraphValues.reduce(function (res, value) {
      if (!res[value.name]) {
        res[value.name] = { name: value.name, value: 0 };
        graphValues.push(res[value.name]);
      }
      res[value.name].value += value.value;
      return res;
    }, {});






    data.actualInvestmentValue = Math.round(actualInvestmentValue);
    data.currentInvestmentValue = currentInvestmentValue;
    data.futureProjections = graphValues;
    // data.actualInves
    data.estimatedProjectCompletionValue = estimatedProjectCompletionValue;
    data.estimatedMarketCompletionValue = estimatedMarketCompletionValue;

    data.totalAreaUnits = totalArea;
    data.activeInvestments = responseArr;
    data.reminders = transactionReminder;

    data.investors = totalProjectInvestors.investorCount;
    data.personalInformation = {
      name: Array.isArray(userInformation) && userInformation.length > 0 && userInformation[0] ? userInformation[0].legalName : null,
      email: Array.isArray(userInformation) && userInformation.length > 0 && userInformation[0] ? userInformation[0].email : null,
      phoneNumber: Array.isArray(userInformation) && userInformation.length > 0 && userInformation[0] ? userInformation[0].phoneNumber : null,
      isEmailVerified: Array.isArray(userInformation) && userInformation.length > 0 && userInformation[0] ? userInformation[0].is_email_verified : null,
      isPhoneVerified: Array.isArray(userInformation) && userInformation.length > 0 && userInformation[0] ? userInformation[0].is_phonenumber_verified : null,
      membershipNumber: Array.isArray(userInformation) && userInformation.length > 0 && userInformation[0] ? userInformation[0].membershipNumber : null,
      accountCreationTime: Array.isArray(userInformation) && userInformation.length > 0 && userInformation[0] ? userInformation[0].createdAt : null,
    };
    data.estimation = {
      "market": {
        estMarketValue: estimation.marketNetCompletion,
        estMarketGain: estimation.marketNetCompletion - estimation.netInvestment
      },
      "bloc": {
        estMarketValue: estimation.blocNetCompletion,
        estMarketGain: estimation.blocNetCompletion - estimation.netInvestment
      }
    };
    data.reserveInvestment = userReserveArea;
    data._estimation = _estimation;
    let total_ER_Transcation = await investmentModel.totalTranscations();
    data.investorStats = {
      investors: totalProjectInvestors.investorCount,
      propertyName: Array.isArray(userInvestments) && userInvestments.length > 0 && userInvestments[0] ? userInvestments[0].propertyName : null,
      coverPhoto: Array.isArray(userInvestments) && userInvestments.length > 0 && userInvestments[0] ? userInvestments[0].coverPhoto : null,
      propertyLogo: Array.isArray(userInvestments) && userInvestments.length > 0 && userInvestments[0] ? userInvestments[0].propertyLogo : null,
      totalTranscations: total_ER_Transcation
    };

    data.investmentValueIncreasePercentage = Math.ceil(
      ((threeYearProjectionValue - data.actualInvestmentValue) /
        data.actualInvestmentValue) *
      100
    );

    data.investmentRoundIncreasePercentage = Math.ceil(
      ((data.currentInvestmentValue - data.actualInvestmentValue) /
        data.actualInvestmentValue) *
      100
    );

    data.demarcatedUnits = demarcatedUnits;

    let response = new dashboardDTO.userDashboardModel(data);

    return res.status(200).json({ error: false, message: "", data: response });
  } catch (error) {
    console.log(error);
    err.statusCode = 400;
    err.message = "Error occurred in dashboard API";
    err.stackTrace = error;
    next(err);
  }
}

async function reminders(req, res, next) {
  try {
    let transactionReminder = await transactionModel.transactionReminder(
      req.decoded.id
    );
    return res.status(200).json({ error: false, message: "", data: transactionReminder });
  } catch (error) {
    console.log(error);
    err.statusCode = 400;
    err.message = "Error occurred in dashboard API";
    err.stackTrace = error;
    next(err);
  }


}

async function passwordCheck(req, res, next) {
  const message = '';
  const data = { status: false };
  try {
    const passCheck = await authmodel.checkpass(req.decoded.id, req.body)
    if (passCheck) {
      data.status = true;
    }
    return res.status(200).json({ error: false, message, data });
  } catch (e) {
    err.statusCode = 400;
    err.message = "Error occurred in dashboard API";
    err.stackTrace = error;
    next(err);
  }
}

function nth(n) {
  return ["st", "nd", "rd"][((((n + 90) % 100) - 10) % 10) - 1] || "th";
}

/**
* 
* @param {import("express").Request} req 
* @param {import("express").Response} res 
* @param {import("express").NextFunction} next 
*/

async function checkUserStatus(req, res) {
  try {
    let el = JSON.parse(JSON.stringify(await authmodel.getSuspendedStatus(req.decoded.id)))[0]
    return res.status(200).json( { error: false, message: "", data: el });
  }
  catch (e) {
    e.statusCode = 400;
    e.message = "Error occurred in dashboard API";
    err.stackTrace = error;
    next(err);
  }


}

module.exports.dashboard = dashboard;
module.exports.passwordCheck = passwordCheck;
module.exports.reminders = reminders;
module.exports.checkUserStatus = checkUserStatus;
