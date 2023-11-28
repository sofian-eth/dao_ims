const { sequelize } = require("core/dbModels");

const utility = require('../../utils/utils');
const moment= require('moment'); 
const { getInvestmentReportCountSP, getInvestmentSummaryBreakDown } = require("./eReportsStatements");
const { eReportsReceipts } = require("../shared/receipt");
const investmentModel = require('../../Models/Investor/PersonalInformation/userportfolio');
const activeInvestmentDTO = require('../../dto/active-investment-model');


async function getProperty(req,res,next){
    let userId= req.decoded.id;
    //let userId= 477;
    await sequelize.query("call sp_report_get_properties(?);",
    {
        replacements: [userId]
    }).then((x)=>{
            res.status(200).json({success: true, error:false,message:'Properties fetched',data:x});
        }).catch((error)=>{
            res.status(400).send({success: false, error:true,message:error.message,data:''});
        })
}

async function getEndTradeActivityDate(req,res, next){
    let userId= req.decoded.id;
    await sequelize.query("call sp_report_get_endTrade_Date(?);",
    {
        replacements: [userId]
    }).then((x)=>{
            res.status(200).json({success: true, error:false,message:'Trade Activity End Date fecthed ',data:x[0]});
        }).catch((error)=>{
            res.status(400).send({success: false, error:true,message:error.message,data:''});
         })

}

async function getInvestmentReport(req,res,next){
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
            // logActivity(
            //     {
            //             logName: "Active Purchases",
            //             description: "Viewed the active purchases page",
            //             subjectType: "activePurchases",
            //             event: ActivityEvent.VIEWED,
            //             causerID: req.decoded.id,
            //             causerType: "users",
            //             properties: {
            //                 attributes: null,
            //                 old: null
            //             },
            //             source: null,
            //             metadata:null
            //         }
            //         ,req)
            return res.status(200).json({error:false, message: "",data: response});
   

           
    } catch(error){
        console.log(error); 
        err.statusCode = 400;
        err.message = "Error occurred in fetching active investments";
        err.stackTrace = error;
        next(err);
    }
}

async function downloadInvestmentSummary(req, res, next){
    let userId = req.decoded.id;
    let reportType = req.query.reportType
    try {
        const startDate = req.query.startDate ? req.query.startDate : null;
        const endDate = req.query.endDate ? req.query.endDate : null;
        const projectID = req.query.projectID&&req.query.projectID!=='0' ? req.query.projectID : null;
        let investments = [];
        let userInvestments = await investmentModel.activeInvestments(userId, projectID, startDate, endDate);
        let totalArea=0;
        let netActualInvestment=0;
        let netAmountWithdraw = 0;
        let netCurrentInvestment=0;
        let onCompletionInvestment = 0;
        let dtoResponse = {};
        for (investment of userInvestments){
            let data = {};
              data.propertyId = investment.propertyId;
              data.propertyName =  investment.propertyName; 
              data.propertySymbol = investment.propertySymbol;
              data.totalInvestedAmount = investment.totalInvestedAmount;
            //   data.propertyCoverPhoto = investment.coverPhoto; 
              data.propertyLogo = investment.propertyLogo; 
        
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
    investments.forEach(x => {
        x.gainLoss = utility.moneyTransform((x.currentPrice*x.totalArea) - x.totalInvestedAmount);
        x.currentValue = utility.moneyTransform(x.currentPrice * x.totalArea);
        x.totalWithdraw = utility.moneyTransform(x.totalWithdraw);
        x.nonDemarcatedArea = utility.thousandseparator(x.totalArea - x.totalDemarcatedArea);
        x.totalDemarcatedArea = utility.thousandseparator(x.totalDemarcatedArea)
        x.propertySymbolShow = process.env.ASSETS_URL+'/images/'+x.propertySymbol;
        x.propertyPrecentage = ((x.totalArea / totalArea) * 100).toFixed(2) ;
        x.totalArea = utility.thousandseparator(x.totalArea);
    })
    investments.forEach(x => {
        x.totalInvestedAmount = utility.moneyTransform(x.totalInvestedAmount)
    })
            dtoResponse.investments = investments;
            dtoResponse.totalArea = totalArea;
            dtoResponse.netActualInvestment =  netActualInvestment;
            dtoResponse.netCurrentInvestment =  netCurrentInvestment;
            dtoResponse.onCompletionInvestment = onCompletionInvestment;
            dtoResponse.netAmountWithdrawn = netAmountWithdraw;
            let response = new activeInvestmentDTO.activeInvestmentModel(dtoResponse);
            
            let pdfdata={
                userName: req.decoded.legalName,
                userPhone: req.decoded.phoneNumber?.replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3'),
                userID: req.decoded.membershipNumber,
                userEmail: req.decoded.email,
                propertyListings: investments,
                startDuration: moment.unix(startDate).format('MMM DD, yyyy'),
                endDuration: moment.unix(endDate).format('MMM DD, yyyy'),
                currentDate: moment(new Date()).format('MMM DD, YYYY'),
                totalArea: utility.thousandseparator(parseFloat(totalArea).toFixed(2)) ,
                amountInvested: utility.moneyTransform(netActualInvestment),
                currentValue: utility.moneyTransform(netCurrentInvestment),
                overallIncrease: utility.moneyTransform(netCurrentInvestment - netActualInvestment),
                totalGainLoss: utility.moneyTransform(netCurrentInvestment - netActualInvestment),
                totalWithdraw: utility.moneyTransform(netAmountWithdraw),
                percentageChange: (((netCurrentInvestment - netActualInvestment ) / netActualInvestment ) * 100).toFixed(0),
                site_url: process.env.ASSETS_URL+'/images',
            }
            let media = await eReportsReceipts(pdfdata,'investmentSummary_template');
            let selectedProperties = investments.map(x=>{
                return {propertyID: x.propertyId, propertyName:x.propertyName, propertySymbol:x.propertySymbol}
             })
            let createdAt = moment(new Date()).toString();
            let reportObj = {
                reportType: reportType,
                createdBy: userId,
                createdAt: createdAt,
                updatedAt: createdAt,
                reportStartDate: moment.unix(startDate).format('yyyy-MM-DD hh:mm:ss'),
                reportEndDate: moment.unix(endDate).format('yyyy-MM-DD hh:mm:ss'),
                mediaID : media.mediaId
            }

            let mediaSave = await insertRecord(reportObj, selectedProperties);
            // logActivity(
            //     {
            //             logName: "Active Purchases",
            //             description: "Viewed the active purchases page",
            //             subjectType: "activePurchases",
            //             event: ActivityEvent.VIEWED,
            //             causerID: req.decoded.id,
            //             causerType: "users",
            //             properties: {
            //                 attributes: null,
            //                 old: null
            //             },
            //             source: null,
            //             metadata:null
            //         }
            //         ,req)
            return res.status(200).json({error:false, message: "",data: media});
   } catch(error){
        console.log(error); 
        err.statusCode = 400;
        err.message = "Error occurred in fetching active investments";
        err.stackTrace = error;
        next(err);
    }
}

async function getInvestmentReportCount(req,res,next){
    let userId = req.decoded.id;
    const projectID = parseInt(req.query.projectID);
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    await sequelize.query("call sp_report_get_active_investments_count(?);",
    {
        replacements: [[userId, projectID, startDate, endDate]]
    }).then((x)=>{
            res.status(200).json({success: true, error:false,message:'Investment Report Date fecthed ',data:x});
        }).catch((error)=>{
            res.status(400).send({success: false, error:true,message:error.message,data:''});
         })
}


async function getInvestmentSummary(req,res,next){
    let userId = req.decoded.id;
    const projectID = parseInt(req.query.projectID);
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    let totalInflow = 0;
    let totalAreaToShow = 0;
    let totalOutflow = 0;
    let tareaSold = 0;
    let areaCalculated = 0;
    let dataToDisplay = [];
    let compileData={listings:[],propertyBreakDown:[]};
    await sequelize.query("call sp_report_get_investment_summary(?);",
    {
        replacements: [[userId, projectID, startDate, endDate]]
    }).then((x) => {
        dataToDisplay=x.map((data)=>Object.assign({},data));
        dataToDisplay.forEach(x => {
            x.areaSold = parseFloat(x.areaSold);
            x.areaPurchased = parseFloat(x.areaPurchased);
        })
        compileData.listings=x
        return getInvestmentSummaryBreakDown(userId)
    }).then((x) => {
        compileData.propertyBreakDown=x[0][0];
    }).then(function(result)  {
        
        compileData.listings.forEach(x => {
            x.inflow = (x.areaPurchased  ? (x.discountedTotalAmount ? parseFloat(x.discountedTotalAmount): '') : '-');
            x.outflow = (x.areaSold ? (x.discountedTotalAmount ? parseFloat(x.discountedTotalAmount): '') : '-');
        })
        compileData.listings.forEach(x => {
            totalInflow = (x.areaPurchased ? (x.inflow ? totalInflow + x.inflow : totalInflow) : totalInflow);
            totalOutflow =(x.areaSold ? (x.outflow ? totalOutflow + x.outflow : totalOutflow ): totalOutflow);
            x.areaToShow = (x.areaSold ? x.areaSold : x.areaPurchased);
        })
        compileData.propertyBreakDown.forEach(x => {
            x.nonDemarcatedArea = x.totalArea - x.demarcatedArea;
        })
        
        //Transforming into required type
        compileData.listings.forEach(x => {
            x.areaPurchased = x.areaPurchased;
            x.areaSold = x.areaSold;
            x.areaToShow = utility.thousandseparator(parseFloat(x.areaToShow).toFixed(2));
            x.inflow = (x.inflow != '-' ? utility.moneyTransform((x.inflow)) : '' );
            x.outflow = (x.outflow != '-' ? utility.moneyTransform((x.outflow)) : '' );
            x.inflowPKR = (x.inflow != '' ? 'PKR' : '' );
            x.outflowPKR = (x.outflow != '' ? 'PKR'  : '' );
            x.paymentDate = moment(x.paymentDate).format('MMM DD, YYYY');
            x.transactionColumn = ( x.areaPurchased > 0 ? (x.medium == 'Peer_To_Peer' ? 'Area Received' : 'Area Purchased') : (x.medium == 'Peer_To_Peer' ? 'Area Transfer' : 'Area Sold') );
            x.transactionColumnDirection = ( x.areaPurchased > 0 ? (x.medium == 'Peer_To_Peer' ? 'fa-arrow-circle-down' : 'fa-arrow-circle-down') : (x.medium == 'Peer_To_Peer' ? 'fa-arrow-circle-up' : 'fa-arrow-circle-up') );
            x.transactionColumnColor = ( x.areaPurchased > 0 ? (x.medium == 'Peer_To_Peer' ? '#0A955E' : '#0A955E') : (x.medium == 'Peer_To_Peer' ? '#DC143C' : '#DC143C') );
            totalAreaToShow = totalAreaToShow + (x.areaPurchased ? parseFloat(x.areaPurchased) : parseFloat(x.areaSold))
        })
        compileData.listings.forEach(x =>{
            tareaSold = (x.transactionColumn == 'Area Sold' || x.transactionColumn == 'Area Transfer'  ? tareaSold + parseFloat(x.areaSold) : tareaSold)
        })
        compileData.propertyBreakDown.forEach(x => {
            x.worth = utility.thousandseparator(Math.round(x.worth));
            x.totalArea =  utility.thousandseparator(parseFloat(x.totalArea).toFixed(2));
            x.nonDemarcatedArea =  utility.thousandseparator(parseFloat(x.nonDemarcatedArea).toFixed(2));
            x.demarcatedArea =  utility.thousandseparator(parseFloat(x.demarcatedArea).toFixed(2));
        })
        areaCalculated = totalAreaToShow - tareaSold
        let data={
            startDuration: moment(startDate).format('MMM DD, YYYY'),
            endDuration: moment(endDate).format('MMM DD, YYYY'),
            currentDate: moment(new Date()).format('MMM DD, YYYY'),
            userName: req.decoded.legalName,
            userPhone: req.decoded.phoneNumber?.replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3'),
            userID: req.decoded.membershipNumber,
            userEmail: req.decoded.email,
            totalArea : utility.thousandseparator(areaCalculated.toFixed(2)),
            totalInflow : utility.moneyTransform(totalInflow),
            totalOutflow:  utility.moneyTransform(totalOutflow),
            netAmount: utility.thousandseparator(Math.abs(totalOutflow - totalInflow).toFixed(2)),
            //totalNetAmount: netAmount.toFixed(2),
            summaryList: compileData.listings,
            investmentBreakdown: compileData.propertyBreakDown,
            site_url: process.env.ASSETS_URL+'/images',
        }
        return eReportsReceipts(data,'transactionReport_template');
    }).then(function(x){
        next();
        res.status(200).json({success: true, error:false,message:'Download Receipt Data Fetched ',data:{listings:dataToDisplay,mediaDetails:x}});
        return x
    })
    .catch((error)=> {
        console.log(error);
        res.status(400).send({success: false, error:true,message:error.message,data:''});
    })
}

async function getInvestmentCertificate(req,res,next){
    let userId = req.decoded.id;
    let reportType = req.query.reportType
    try {
        const startDate = req.query.startDate ? req.query.startDate : null;
        const endDate = req.query.endDate ? req.query.endDate : null;
        const projectID = req.query.projectID&&req.query.projectID!=='0' ? req.query.projectID : null;
        let investments = [];
        let userInvestments = await investmentModel.activeInvestments(userId, projectID, startDate, endDate);
        let totalArea=0;
        let netActualInvestment=0;
        let netAmountWithdraw = 0;
        let netCurrentInvestment=0;
        let onCompletionInvestment = 0;
        let dtoResponse = {};
        for (investment of userInvestments){
            let data = {};
              data.propertyId = investment.propertyId;
              data.propertyName =  investment.propertyName; 
              data.propertySymbol = investment.propertySymbol;
              data.totalInvestedAmount = investment.totalInvestedAmount;
            //   data.propertyCoverPhoto = investment.coverPhoto; 
              data.propertyLogo = investment.propertyLogo; 
        
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
    let amountTotalInvested = 0;
    investments.forEach(x => {
        amountTotalInvested = amountTotalInvested + x.totalInvestedAmount;
        x.gainLoss = utility.moneyTransform((x.currentPrice*x.totalArea) - x.totalInvestedAmount);
        x.currentValue = utility.moneyTransform(x.currentPrice * x.totalArea);
        x.nonDemarcatedArea = x.totalArea - x.totalDemarcatedArea;
        x.totalArea = x.totalArea.toFixed(2);
        x.totalArea = utility.thousandseparator(x.totalArea);
        x.totalInvestedAmount = utility.thousandseparator(x.totalInvestedAmount);
        x.propertySymbolShow = process.env.ASSETS_URL+'/images/'+x.propertySymbol;
        x.propertyPrecentage = ((x.totalArea / totalArea) * 100).toFixed(2) ;
    })
    
            dtoResponse.investments = investments;
            dtoResponse.totalArea = totalArea;
            dtoResponse.netActualInvestment =  netActualInvestment;
            dtoResponse.netCurrentInvestment =  netCurrentInvestment;
            dtoResponse.onCompletionInvestment = onCompletionInvestment;
            dtoResponse.netAmountWithdrawn = netAmountWithdraw;
            let response = new activeInvestmentDTO.activeInvestmentModel(dtoResponse);
            totalArea = totalArea.toFixed(2)
            let pdfdata={
                userName: req.decoded.legalName,
                userPhone: req.decoded.phoneNumber?.replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3'),
                userID: req.decoded.membershipNumber,
                userEmail: req.decoded.email,
                userCnic: req.decoded.identityCardNumber,
                propertyListings: investments,
                startDuration: moment.unix(startDate).format('MMM DD, yyyy'),
                endDuration: moment.unix(endDate).format('MMM DD, yyyy'),
                currentDate: moment(new Date()).format('MMM DD, YYYY'),
                totalArea: utility.thousandseparator(totalArea),
                amountInvested: utility.thousandseparator(amountTotalInvested),
                currentValue: utility.moneyTransform(netCurrentInvestment),
                overallIncrease: utility.moneyTransform(netCurrentInvestment - netActualInvestment),
                totalGainLoss: utility.moneyTransform(netCurrentInvestment - netActualInvestment),
                site_url: process.env.ASSETS_URL+'/images',
            }
            let media = await eReportsReceipts(pdfdata,'investmentCertificate_template');
            let selectedProperties = investments.map(x=>{
                return {propertyID: x.propertyId, propertyName:x.propertyName, propertySymbol:x.propertySymbol}
             })
            let createdAt = moment(new Date()).toString();
            let reportObj = {
                reportType: reportType,
                createdBy: userId,
                createdAt: createdAt,
                updatedAt: createdAt,
                reportStartDate: moment.unix(startDate).format('yyyy-MM-DD hh:mm:ss'),
                reportEndDate: moment.unix(endDate).format('yyyy-MM-DD hh:mm:ss'),
                mediaID : media.mediaId
            }

            let mediaSave = await insertRecord(reportObj, selectedProperties);
            // logActivity(
            //     {
            //             logName: "Active Purchases",
            //             description: "Viewed the active purchases page",
            //             subjectType: "activePurchases",
            //             event: ActivityEvent.VIEWED,
            //             causerID: req.decoded.id,
            //             causerType: "users",
            //             properties: {
            //                 attributes: null,
            //                 old: null
            //             },
            //             source: null,
            //             metadata:null
            //         }
            //         ,req)
            return res.status(200).json({error:false, message: "",data: media});
   } catch(error){
        console.log(error); 
        err.statusCode = 400;
        err.message = "Error occurred in fetching active investments";
        err.stackTrace = error;
        next(err);
    }
}

async function insertRecord(obj, propertyArray){
    obj.allPropertySelected=JSON.stringify(propertyArray)
    let query = `INSERT INTO reportsLog (reportType, createdBy, createdAt, updatedAt ,reportStartDate, reportEndDate, selectedProperties, mediaID) VALUES (?,?,?,?,?,?,?,?)`;
    await sequelize.query(query,
    {
        replacements: [obj.reportType, obj.createdBy, obj.createdAt, obj.createdAt, obj.reportStartDate, obj.reportEndDate, obj.allPropertySelected, obj.mediaID]
    }).then((x)=>{
            return true
        }).catch((error)=>{
            return false
        })
}

async function recordInvestmentReportLog(req,res,next){
    let userId = req.decoded.id;
    let stDat = new Date();
    let startDate = moment(new Date()).toString();
    let obj = req.body;
    obj.allPropertySelected=JSON.stringify(obj.allPropertySelected)
    let query = `INSERT INTO reportsLog (reportType, createdBy, createdAt, updatedAt ,reportStartDate, reportEndDate, selectedProperties, mediaID) VALUES (?,?,?,?,?,?,?,?)`;
    await sequelize.query(query,
    {
        replacements: [obj.reportType, userId, startDate, startDate, obj.reportStartDate, obj.reportEndDate, obj.allPropertySelected, obj.mediaId]
    }).then((x)=>{
            res.status(200).json({success: true, error:false,message:'Data Insert Sucessfully',data:''});
        }).catch((error)=>{
            res.status(400).send({success: false, error:true,message:error.message,data:''});
         })
}

async function getReportStatementLogs(req,res,next){
    let userId = req.decoded.id;
    let obj = req.query;
    let query = `call sp_report_get_statementLogs(?);`
    await sequelize.query(query, {
        replacements: [[userId, obj.limit, obj.page, obj.orderBy, obj.orderType]]
    }).then((x) => {
        res.status(200).json({success: true, error:false, message: 'Statement Fecthed Successfully',data:{listing: x}})
    }).catch(err => {
        res.status(400).json({success: false, error:true, message: 'Failed to Fecthed statements' + err.message,data:''})
    })

}


module.exports = {
getProperty,
getEndTradeActivityDate,
getInvestmentReport,
getInvestmentReportCount,
getInvestmentCertificate,
getInvestmentSummary,
recordInvestmentReportLog,
getReportStatementLogs,
downloadInvestmentSummary,
}