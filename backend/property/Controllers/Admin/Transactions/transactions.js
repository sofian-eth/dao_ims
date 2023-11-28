


const txdb = require('../../../Models/Admins/Transactions/transactions.js');
const ethereumaddress = require('../../../Models/Admins/General/getethereumaddress');
const propertymodel = require('../../../Models/propertydb.js');
const userbalance = require('../../../utils/blockchain-utils');
const createtx = require('../../../Models/Admins/Transactions/createtransaction');
const awsutils = require('../../../utils/aws-utils.js');
const addreceiptdb = require('../../../Models/Investor/Transactions/addreceipt.js');
const pdftemplates = require('../../../utils/pdf-utils.js');
const { validationResult } = require('express-validator');
const authmodel = require('../../../Models/Admins/Auth/checkpass.js');
const discountsdb = require('../../../Models/Property/discounts');
const pricedb = require('../../../Models/Property/pricedb');
const utility = require('../../../utils/utils');
const membershipnumber = require('../../../Models/Investor/PersonalInformation/getmembershipid.js');
const emailUtils = require('../../../utils/email');
const userIDModel = require('../../../Models/Investor/PersonalInformation/userID');
const accountActivity = require('../../../Models/Shared/account-activity');
const transactionDetailsController = require('../../../Models/Admins/Transactions/transactiondetailsdb');
const { TRANSACTION_STATUSES } = require('./../../../resources/constants');
const receiptGeneration = require('../../../services/shared/receipt');
let projectInformationModel = require('../../../Models/Property/information');
let roundModel = require('../../../Models/Property/getrounds');
let salesReceiptDTO = require('../../../dto/sales-receipt-model');
const {ERROR_MESSAGES} = require('./../../../resources/constants');
const emailUtility = require('../../../utils/email');
const ticketdetails = require('../../../Models/Investor/Transactions/ticketdetails');
let userInformation = require('../../../Models/Property/user-information')
const bankDetails = require("../../../Models/Property/bank-information");
const { logActivity } = require('../../../services/shared/activity-logger.js');


const listtransaction = function (req, res, next) {
    let err = {};
    var transactions = {};
    txdb.transactions('pending', 'asc', 'queueNumber')
        .then(function (result) {
            transactions.pending = result;
            return txdb.transactions('locked', 'desc', 'updatedAt');

        })
        .then(function (result) {
            transactions.locked = result;
            return txdb.transactions('discard', 'desc', 'updatedAt');
        })
        .then(function (result) {

            transactions.discard = result;
            res.status(200).json({ error: false, message: '', data: transactions });

        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error occurred in fetching transaction";
            err.stackTrace = error;
            next(err);

        })

}


async function transactionFetch(req, res, next) {
    let err = {};
    let offset = 0;
    let recordLimit = 25;
    let transactionFilters = [];


    let txFilter = [];
    let allAttachments = req.query.allAttachments;
    let cnic = req.query.cnic;
    let payementProof = req.query.payementProof;
    let stampPaper = req.query.stampPaper;
    let voucher = req.query.voucher;
    let search = req.query.search;
    let projectId = req.query.projectId || 0;

    if (allAttachments == true || allAttachments == 'true' || allAttachments == 'True'){

        // Old Logic
        transactionFilters.push("receipt");
        transactionFilters.push("CNIC");
        transactionFilters.push("trade");
        transactionFilters.push("Deposit Slip");
        transactionFilters.push("propertydocument");

        // New Logic
        transactionFilters.push('cnicfront');
        transactionFilters.push('cnicback');
        transactionFilters.push('depositslip');
        transactionFilters.push('stamppaper');
        transactionFilters.push('propertydocument');
        transactionFilters.push('voucher');
    }
    if (cnic == true || cnic == 'true' || cnic == 'True'){
        transactionFilters.push("CNIC");
        transactionFilters.push('cnicfront');
        transactionFilters.push('cnicback');
    }
    if (payementProof == true || payementProof == 'true' || payementProof == 'True'){
        transactionFilters.push("depositslip");
    }
    if (stampPaper == true || stampPaper == 'true' || stampPaper == 'True'){
        transactionFilters.push("stampPaper");
        transactionFilters.push('stamppaper');
    }
    if (voucher == true || voucher == 'true' || voucher == 'True'){
        transactionFilters.push('voucher');
    }




    try {
        let result;
        if (req.query.page)
            offset = req.query.page * req.query.limit;
        if (req.query.limit)
            recordLimit = req.query.limit;

        result = await txdb.transactionListingFilters(req.query.transactionType,offset, recordLimit, transactionFilters, search, projectId);
        res.status(200).json({ error: false, message: '', data: result });

    } catch (error) {
        console.log(error);
        err.statusCode = 400;
        err.message = "Error occurred in fetching transaction";
        err.stackTrace = error;
        next(err);
    }

}


async function transactionListingWithDepositSlip(req, res, next) {
    let err = {};
    let offset = 0;
    let recordLimit = 15;
    try {

        if (req.query.page)
            offset = req.query.page * req.query.limit;
        if (req.query.limit)
            recordLimit = req.query.limit;

        let result = await txdb.transactionListingFilters(offset, recordLimit);
        res.status(200).json({ error: false, message: '', data: result });

    } catch (error) {
        err.statusCode = 400;
        err.message = "Error occurred in fetching transaction";
        err.stackTrace = error;
        next(err);
    }

}



const createTransaction = function (req, res, next) {
    let err = {};
    var currentprice;
    var totaltaxprice = 0;
    var devround = req.body.developRounds;
    var ticketobject = {};
    var marketPrice;
    var roundName;
    var sellerID;
    var buyerID;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return res.status(400).json({ error: true, message: 'Validation failed' });
    }

    if (req.body.sellerform.investor == req.body.buyerform.investor)
        return res.status(400).json({ error: true, message: 'Buyer and seller are same ' });

    ethereumaddress.getethereumaddress(req.body.sellerform.investor)
        .then(function (result) {

            return userbalance.investorbalance(result[0].walletAddress);
        })
        .then(function (result) {

            if (result < req.body.areaunits)
                throw 'Insufficient balance';

            return pricedb.devRoundPrice(req.body.developRounds);
        })
        .then(function (result) {
            currentprice = result[0].pricePerSqft;
            marketPrice = result[0].marketPrice;
            roundName = result[0].roundName;
            return propertymodel.gettaxes()

        })
        .then(function (result) {
            result.forEach(element => {

                totaltaxprice += element.price;

            });

            return userIDModel.fetchUserID(req.body.sellerform.investor);
        })
        .then(function (result) {
            if (!result)
                throw 'Seller ID not found';
            sellerID = result[0].id;
            return userIDModel.fetchUserID(req.body.buyerform.investor);
        })
        .then(function (result) {
            if (!result)
                throw 'buyer ID not found';
            buyerID = result[0].id;

            var jsonobject = {
                sellerID: sellerID,
                buyerID: buyerID,
                areaunits: req.body.areaunits,
                currentprice: currentprice,
                totaltaxes: totaltaxprice,
                devround: devround,
                paymentmode: req.body.paymentmode,
                paymentdeadline: req.body.paymentdeadline,
                operations: req.body.operations
            };

            return createtx.createTX(jsonobject)
        })
        .then(function (result) {
            ticketobject = result;
            ticketobject.paymentdate = result.paymentDate;
            ticketobject.queuenumber = result.id;
            ticketobject.sqftprice = result.sqftPrice;
            ticketobject.totalprice = result.totalPrice;
            ticketobject.areapledged = result.areaPledged;
            ticketobject.marketprice = marketPrice;
            // delete ticketobject.areaPledged;
            // delete ticketobject.paymentDate;
            // delete ticketobject.queueNumber;
            // delete ticketobject.sqftPrice;
            // delete ticketobject.totalPrice;
            return membershipnumber.getinvestordetails(buyerID);
        })
        .then(function (result) {
            ticketobject.membershipid = result[0].membershipNumber;
            firstName = result[0].legalName;
            ticketobject.investorname = result[0].legalName;
            var buyerEmail = result[0].email || null;
            let dtoResponse = new salesReceiptDTO.salesReceipt(ticketobject);
            receiptGeneration.postreceipt(dtoResponse);
            if (buyerEmail)
                sendemail(firstName, buyerEmail, currentprice, req.body.areaunits, ticketobject, roundName);

            let activityObject = {
                subject: 'Transaction',
                action: 'Transaction with ID ' + ticketobject.queuenumber + ' created.',
                userID: req.decoded.id,
                userAgent: req.headers['x-my-user-agent'] || req.headers['user-agent'],
                ipAddress: req.headers['my-user-ip'] || (req.headers['x-forwarded-for'] || '').split(',')[0]
            }
            accountActivity.accountActivity(activityObject);
            // res.json(ticketobject);
            res.status(200).json({ error: false, message: '', data: ticketobject });

        })

        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error occurred in creating transaction";
            err.stackTrace = error;
            next(err);
            //          res.status(400).json({ error: true, message: error })
        })

}


const sendemail = function (firstName, investoremail, currentprice, purchasedarea, ticketobject, roundName) {

    let discount = Math.floor((currentprice / ticketobject.marketprice) * 100);



    var dataObject = {
        firstname: firstName,
        projectname: 'Elements Residencia',
        currentprice: currentprice,
        marketprice: ticketobject.marketprice,
        areaunits: purchasedarea,
        devround: roundName,
        discount: discount,
        investoremail: investoremail

    }
    return emailUtils.pledgeArea(dataObject);


}


const updatetx = function (req, res, next) {
    let err = {};
    var currentprice;
    var discount;
    var totaltaxprice = 0;
    var fetchedData;
    var propBanks;
    var passwordbody = {
        pass: req.body.password.password
    };
    authmodel.checkpass(req.decoded.id, passwordbody)
        .then(function (result) {
            if (result)
                return pricedb.pricedb()

            throw 'password is not correct';

        })


        .then(function (result) {
            currentprice = result;
            return propertymodel.gettaxes()
        })
        .then(function (result) {
            result.forEach(element => {
                totaltaxprice += element.price;
            });

            return discountsdb.getdiscountsdb();

        })
        .then(function (result) {
            
            discount = result[0].discount;

            var jsonobject = {
                queuenumber: req.body.formdata.queuenumber,
                areaunits: req.body.formdata.areapledged,
                currentprice: currentprice,
                totaltaxes: totaltaxprice,
                discount: discount,
                paymentmode: req.body.formdata.paymentmode,
                paymentdeadline: req.body.formdata.paymentdate
            };

            return createtx.updatetx(jsonobject);

        })
        .then(function (result){
            let _currData=null;
           return _currData=createtx.updateReceipt(req.body.formdata.queuenumber)
            
        })
        .then(function (result) {
            debugger;
            fetchedData=result;
            //console.log("curent data receievd",result)
            //banks = await bankDetails.bankInformation(projectID);
            
            return bankDetails.bankInformation(fetchedData.projectID)
            
        })
        .then(function(result){
            propBanks=result;
            debugger;
            let data = {
                assetUrl: process.env.ASSETS_URL,
                userId: fetchedData.userId,
                queueNumber: req.body.formdata.queuenumber,
                status: fetchedData.currStatus,
                dueDate: utility.dateformater(fetchedData.dueDate, 'MM/DD/YYYY'),
                projectID: fetchedData.projectID,
                name: fetchedData.projectName,
                areaPledged: fetchedData.areaPledged,
                roundName: fetchedData.roundName,
                roundPrice: fetchedData.roundPrice,
                totalCost: fetchedData.totalPrice,
                agentLegalName: (fetchedData.agentID && fetchedData.saleAgentLegalName) ? fetchedData.saleAgentLegalName : 'Haseeb Mirza',
                agentPhoneNumber: fetchedData.agentID ? fetchedData.saleAgentPhoneNumber : '+923345159545',
                agentEmail: fetchedData.agentID ? fetchedData.saleAgentEmail : 'haseeb.mirza@daoproptech.com',
                totalTaxCost: 0,
                banks: propBanks,
                payDate:fetchedData && fetchedData.paymentReceivableDate ?  fetchedData.paymentReceivableDate:new Date()
                // add paid amount too
            }
            let dtoResponse = new salesReceiptDTO.salesReceipt(data);
            return receiptGeneration.postreceipt(dtoResponse);
        })
        .then(function (result) {
            let activityObject = {
                subject: 'Transaction',
                action: 'Transaction with ID ' + req.body.formdata.queuenumber + ' updated.',
                userID: req.decoded.id,
                userAgent: req.headers['x-my-user-agent'] || req.headers['user-agent'],
                ipAddress: req.headers['my-user-ip']
            }
            accountActivity.accountActivity(activityObject);
            res.status(200).json({ error: false, message: "Transaction updated successfully" });
        })
        .catch(function (error) {
            console.log(error)
            err.statusCode = 400;
            err.message = "Error occurred in updating transaction";
            err.stackTrace = error;
            next(err);
            //           res.status(400).json({ error: true, message: error });
        })


}
 
const discardtx = function (req, res, next) {
    let err = {};
    debugger;
    if(!(req.body.pass)){
        if ( req.body.queuenumber)
                return createtx.discardtx(req.body.queuenumber)
                .then(function (result){
                    let _currData=null;
                
                   return _currData=createtx.updateReceipt(req.body.queuenumber)
                    
                })
                .then(function (result) {
                    fetchedData=result;
                    return bankDetails.bankInformation(fetchedData.projectID)
                    
                })
                .then(function(result){
                    propBanks=result;
                    let modelData = {
                        assetUrl: process.env.ASSETS_URL,
                        userId: fetchedData.userId,
                        queueNumber: req.body.queuenumber,
                        status: fetchedData.currStatus,
                        dueDate: utility.dateformater(fetchedData.dueDate, 'MM/DD/YYYY'),
                        projectID: fetchedData.projectID,
                        name: fetchedData.projectName,
                        areaPledged: fetchedData.areaPledged,
                        roundName: fetchedData.roundName,
                        roundPrice: fetchedData.roundPrice,
                        totalCost: fetchedData.totalPrice,
                        agentLegalName: (fetchedData.agentID && fetchedData?.saleAgentLegalName) ? fetchedData.saleAgentLegalName : 'Haseeb Mirza',
                        agentPhoneNumber: fetchedData?.agentID ? fetchedData?.saleAgentPhoneNumber : '+923345159545',
                        agentEmail: fetchedData?.agentID ? fetchedData?.saleAgentEmail : 'haseeb.mirza@daoproptech.com',
                        totalTaxCost: 0,
                        banks: propBanks,
                        payDate:fetchedData?.paymentReceivableDate
                        //paymentDate: fetchedData.paymentDate 
                        // add paid amount too
                    }
                    
                    let dtoResponse = new salesReceiptDTO.salesReceipt(modelData);
                    try{
                        logActivity(
                            {
                                    logName: "Manage Transaction",
                                    description: "Discarded a transaction of "+modelData.areaPledged+" sq. ft. in "+modelData.name,
                                    subjectID:  req.body.queuenumber,
                                    subjectType: "tradeaactivity",
                                    event: "Deleted",
                                    causerID: req.decoded.id,
                                    causerType: "users",
                                    properties: {
                                        attributes: { 
                                            dispID: req.body.queuenumber,
                                            areaPledged: fetchedData.areaPledged
                                        },
                                        old: null
                                    },
                                    source: null,
                                    metadata:null
                                },req)
                    }catch(error){
                        console.log(error)
                    }

                    return receiptGeneration.postreceipt(dtoResponse);
                    
                })
                .then(function (result) {
                    let activityObject = {
                        subject: 'Transaction',
                        action: 'Transaction with ID ' + req.body.queuenumber + ' discarded.',
                        userID: req.decoded.id,
                        userAgent: req.headers['x-my-user-agent'] || req.headers['user-agent'],
                        ipAddress: req.headers['my-user-ip'] || (req.headers['x-forwarded-for'] || '').split(',')[0]
                    }
                    accountActivity.accountActivity(activityObject);
                    res.status(200).json({ error: false, message: 'Operation performed successfully', data: '' });
                })
                .catch(function (error) {
                    err.statusCode = 400;
                    err.message = error;
                    err.stackTrace = error;
                    next(err);
                    //           res.status(400).json({ error: true, message: error });
                })
    }

    else{

    
     authmodel.checkpass(req.decoded.id, req.body)
         .then(function (result) {
            if ( req.body.queuenumber)
                return createtx.discardtx(req.body.queuenumber)

            // throw ERROR_MESSAGES.CURRENT_PASS_INCORRECT;

         })
        
        .then(function (result){
            let _currData=null;
        
           return _currData=createtx.updateReceipt(req.body.queuenumber)
            
        })
        .then(function (result) {
            debugger;
            fetchedData=result;
            return bankDetails.bankInformation(fetchedData.projectID)
            
        })
        .then(function(result){
            propBanks=result;
            debugger;
            let modelData = {
                assetUrl: process.env.ASSETS_URL,
                userId: fetchedData.userId,
                queueNumber: req.body.queuenumber,
                status: fetchedData.currStatus,
                dueDate: utility.dateformater(fetchedData.dueDate, 'MM/DD/YYYY'),
                projectID: fetchedData.projectID,
                name: fetchedData.projectName,
                areaPledged: fetchedData.areaPledged,
                roundName: fetchedData.roundName,
                roundPrice: fetchedData.roundPrice,
                totalCost: fetchedData.totalPrice,
                agentLegalName: (fetchedData.agentID && fetchedData?.saleAgentLegalName) ? fetchedData.saleAgentLegalName : 'Haseeb Mirza',
                agentPhoneNumber: fetchedData?.agentID ? fetchedData?.saleAgentPhoneNumber : '+923345159545',
                agentEmail: fetchedData?.agentID ? fetchedData?.saleAgentEmail : 'haseeb.mirza@daoproptech.com',
                totalTaxCost: 0,
                banks: propBanks,
                payDate:fetchedData?.paymentReceivableDate
                //paymentDate: fetchedData.paymentDate 
                // add paid amount too
            }
            
            let dtoResponse = new salesReceiptDTO.salesReceipt(modelData);
            return receiptGeneration.postreceipt(dtoResponse);
        })
        .then(function (result) {
            let activityObject = {
                subject: 'Transaction',
                action: 'Transaction with ID ' + req.body.queuenumber + ' discarded.',
                userID: req.decoded.id,
                userAgent: req.headers['x-my-user-agent'] || req.headers['user-agent'],
                ipAddress: req.headers['my-user-ip'] || (req.headers['x-forwarded-for'] || '').split(',')[0]
            }
            accountActivity.accountActivity(activityObject);
            res.status(200).json({ error: false, message: 'Operation performed successfully', data: '' });
        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = error;
            err.stackTrace = error;
            next(err);
            //           res.status(400).json({ error: true, message: error });
        })
    }

}


// const generateSalesReceipt = function (req, res, next) {
//     let err = {};
//     let queueNumber = req.body.queueNumber;
//     let fileName;

//     let projectInformation = await projectInformationModel.projectInformation(projectID);
//     let roundInformation = await roundModel.activeRoundPricing(projectID);

//     taxCost = await propertyTax.propertyTax(projectID);

//     taxCost.forEach(element => {

//         totalTaxCost += element.price;
//     });

//     if (agentReferralCode) {
//         agentInformation = await salesAgentDetail.fetchSalesAgentDetails(agentReferralCode);
//         if (agentInformation && (agentInformation.id != buyerID))
//             agentID = agentInformation.id;
//         else
//             agentID = null;
//     } else {
//         agentInformation = await salesAgentDetail.fetchSalesAgentDetails(agentReferralCode);
//     }

//     serviceAccountInformation = await serviceAccountModel.propertyServiceAccount(projectID);
//     sellerID = serviceAccountInformation.ownerID;


//     transactionDetailsController.transactionDetailsForReceipt(queueNumber)
//         .then(function (result) {
//             if (!result.length)
//                 throw 'Data not found';
//             let ticketObject = {
//                 queuenumber: result[0].queueNumber,
//                 membershipid: result[0].membershipNumber,
//                 paymentDate: result[0].paymentData,
//                 investorname: result[0].firstName + ' ' + result[0].lastName,
//                 areapledged: result[0].areaPledged,
//                 totalprice: result[0].totalPrice,
//             };

//             return pdftemplates.generatepdf('receipt', ticketObject);

//         })
//         .then(function (result) {
//             fileName = result.filename;
//             var fileKey = 'trade/' + result.filename;
//             pdfcontent = result.pdfcontent;
//             return awsutils.uploadFiles(pdfcontent, fileKey, 'application/pdf');


//         })
//         .then(function (result) {
//             return addreceiptdb.addattachment(fileName, req.body.queueNumber)

//         })
//         .then(function (result) {
//             res.status(200).json({ error: false, message: 'Sales receipt generated successfully' });
//         })
//         .catch(function (error) {
//             err.statusCode = 400;
//             err.message = "Error occurred in generating receipt";
//             err.stackTrace = error;
//             next(err);
//             //           res.status(400).json({ error: true, message: 'Error occurred in generating receipt' });
//         })


// }



async function transactionStats(req, res, next) {
    let err = {};
    try {

        let transactionStatsResult = await txdb.transactionStats();
        res.status(200).json({ error: false, message: '', data: transactionStatsResult });

    } catch (error) {
        err.statusCode = 400;
        err.message = "Error occurred in fetching transaction stats";
        err.stackTrace = error;
        next(err);
    }
}

async function sendPledgeEmail(req, res, next) {
    let err = {};
    const {id=0} = req.params;
    try {
        const transaction = await ticketdetails.transactionDetail(id);
        if(! transaction) {
            res.status(404).json({ error: true, message: 'Transaction not found', data: null });
            return;
        }
        let _userInfo = await userInformation.userbasicInfo(transaction.buyerID);   
        let projectInformation = await projectInformationModel.projectInformation(transaction.propertyID);
        let roundInformation = await roundModel.activeRoundPricing(transaction.propertyID);
        let roundPrice = roundInformation.pricePerSqft;
        if(_userInfo && projectInformation && roundInformation && roundPrice){
            const data = {
                investoremail: _userInfo.email,
                firstname: _userInfo.firstName,
                projectname: projectInformation.name,
                areaunits: transaction.areaPledged,
                devround: roundInformation.roundName,
                currentprice: roundPrice,
                discount: roundInformation.marketPrice - roundInformation.pricePerSqft,
                marketprice: roundInformation.marketPrice,
            };
            emailUtility.pledgeArea(data);
            res.status(200).json({ error: false, message: '', data: data });
        } else {
            res.status(500).json({ error: true, message: '', data: null });
        }
    } catch(error) {
        console.log(error);
        err.statusCode = 400;
        err.message = "Error occurred in sending email";
        err.stackTrace = error;
        next(err);
    }
}


module.exports = { listtransaction, updatetx, discardtx, createTransaction, transactionStats, transactionListingWithDepositSlip, transactionFetch, sendPledgeEmail }
