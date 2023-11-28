let projectInformationModel = require('../../Models/Property/information');
let roundModel = require('../../Models/Property/getrounds');
let areaMatrixModel = require('../../Models/Property/area-selection-matrix');
let salesAgentDetail = require('../../Models/Agents/getagentdetails');
let propertyTax = require('../../Models/Property/tax');
let serviceAccountModel = require('../../Models/Property/service-account');
let userInformation = require('../../Models/Property/user-information')
let areaPledgeModel = require('../../Models/Investor/Transactions/pledgearea');
let areaPledgeDTO = require('../../dto/checkout-response-model');
const { check } = require('express-validator');
const receiptGeneration = require('../shared/receipt');
const bankDetails = require("../../Models/Property/bank-information");
const utility = require('../../utils/utils');
const emailUtility = require('../../utils/email');
const userIDModel = require('../../Models/Investor/PersonalInformation/userID');


let salesReceiptDTO = require('../../dto/sales-receipt-model');
const { notificationModel } = require("core/dto/requests/notification.model");
const { notificationService } = require('../notification/notificationCenter');
const { logActivity } = require('../shared/activity-logger');
const slackNotification = require('../../utils/slack-notification');
const ActionCategory = require('../../resources/enum-Action-Category');
const ActivityEvent = require('../../resources/enum-ActivityLog-event');
const fcmService = require('../fcm/fcm.service');

async function userCheckout(req, res, next) {
    let err = {};

    try {
         
        let userID = req.decoded.id;
        let paymentDate = new Date();
        paymentDate.setDate(paymentDate.getDate() + 7);

        let dataObject = {};

        let projectID = parseInt(req.body.projectID);
        let roundID = parseInt(req.body.roundID);
        let isDemo = req.body.isDemo;
        console.log(roundID);
        let areaMatrixID = req.body.areaMatrixID || null;
        let agentReferralCode = req.body.agentReferralCode || null;
        let billingAddress = req.body.billingAddress;
        let areaPledge = req.body.areaPledge;
        let agentID = null;
        let buyerID = req.decoded.id;
        let sellerID;
        let roundPrice;
        let taxCost;
        let activeRoundID;
        let clientID = await userIDModel.fetchCLientID(req.decoded.id)
        clientID=clientID[0].clientID

        let totalCost;
        let agentInformation;
        let banks;

        let paymentMode = req.body.paymentMode || 1;
        paymentMode = parseInt(paymentMode);
        let serviceAccountInformation;
        let totalTaxCost = 0;

        let projectInformation = await projectInformationModel.projectInformation(projectID);
        let roundInformation = await roundModel.activeRoundPricing(projectID,roundID);
        if(roundInformation.statusID!=8){
            roundInformation.displayStartDate.setDate(roundInformation.displayStartDate.getDate() + 2);
            paymentDate = new Date(roundInformation.displayStartDate);
        }

        taxCost = await propertyTax.propertyTax(projectID);

        taxCost.forEach(element => {

            totalTaxCost += element.price;
        });

        if (agentReferralCode) {
            agentInformation = await salesAgentDetail.fetchSalesAgentDetails(agentReferralCode);
            if (agentInformation && (agentInformation.id != buyerID))
                agentID = agentInformation.id;
            else
                agentID = null;
        } else {
            agentInformation = null;
        }

        serviceAccountInformation = await serviceAccountModel.propertyServiceAccount(projectID);
        sellerID = serviceAccountInformation.ownerID;

        roundPrice = roundInformation.pricePerSqft;
        activeRoundID = roundInformation.id;


        totalCost = areaPledge * roundPrice;

        // Data Object

        dataObject.agentID = agentID;
        dataObject.sellerID = sellerID;
        dataObject.buyerID = buyerID;
        dataObject.roundID = activeRoundID;
        dataObject.billingAddress = billingAddress;
        dataObject.areaPledged = areaPledge;
        dataObject.totalPrice = Math.round(totalCost);
        dataObject.propertyID = projectID;
        dataObject.sqftPrice = roundPrice;
        dataObject.paymentMode = paymentMode;

        dataObject.paymentDate = paymentDate;
        dataObject.operations = 'buy';
        dataObject.statusID = 2;
        dataObject.isDemo = isDemo;
        dataObject.clientID = clientID


        let response = await areaPledgeModel.areaPledge(dataObject);

        let checkoutDTO = response;
        let date = new Date();
        checkoutDTO.status = 'pending';
        checkoutDTO.salesAgentName = agentInformation ? agentInformation.legalName : '';
        checkoutDTO.salesAgentEmail = agentInformation ? agentInformation.email : '';
        checkoutDTO.currentDate = date;
        checkoutDTO.ticketNo = response.queueNumber;
        checkoutDTO.totalCost = dataObject.totalPrice;
        checkoutDTO.areaPledge = areaPledge;
        let responseObject = new areaPledgeDTO.checkoutResponseModel(checkoutDTO);

        banks = await bankDetails.bankInformation(projectID);

        let data = {
            assetUrl: process.env.ASSETS_URL,
            userId: req.decoded.id,
            queueNumber: response.queueNumber,
            status: 'pending',

            dueDate: paymentDate,
            projectID: projectID,
            name: projectInformation.name,
            areaPledged: areaPledge,
            roundName: roundInformation.roundName,
            roundPrice: dataObject.sqftPrice,
            totalCost: dataObject.totalPrice,
            agentLegalName: agentInformation && agentInformation.legalName ? agentInformation.legalName : 'Haseeb Mirza',
            agentPhoneNumber: agentInformation ? agentInformation.phoneNumber : '+923345159545',
            agentEmail: agentInformation ? agentInformation.email : 'haseeb.mirza@daoproptech.com',
            totalTaxCost: 0,
            banks: banks

        }

        // send email
        if(!isDemo){
            let _userInfo = await userInformation.userbasicInfo(userID);   
            if(_userInfo){
                emailUtility.pledgeArea(
                    {
                        investoremail: _userInfo.email,
                        firstname: _userInfo.legalName,
                        projectname: projectInformation.name,
                        areaunits: areaPledge,
                        devround: roundInformation.roundName,
                        currentprice: dataObject.sqftPrice,
                        discount: Math.round(((roundInformation.marketPrice - roundInformation.pricePerSqft)/roundInformation.marketPrice)*100),
                        marketprice: roundInformation.marketPrice,
                        roundStatus: roundInformation.statusID
                    }
                );

                slackNotification.areaPledgeNotification(
                    {
                        investoremail: _userInfo.email,
                        firstname: _userInfo.legalName,
                        projectname: projectInformation.name,
                        areaunits: areaPledge,
                        devround: roundInformation.roundName,
                        currentprice: dataObject.sqftPrice,
                        discount: Math.round(((roundInformation.marketPrice - roundInformation.pricePerSqft)/roundInformation.marketPrice)*100),
                        marketprice: roundInformation.marketPrice,
                        roundStatus: roundInformation.statusID
                    }
                );

                fcmService.areaPledgedNotification(checkoutDTO.ticketNo,req.decoded, req.body.areaPledge, projectInformation);
            
            }
        }
        let dtoResponse = new salesReceiptDTO.salesReceipt(data);
        logActivity(
            {
                    logName:  ActionCategory.PROJECTS,
                    description:  ((roundInformation.statusID==9) ? ("Reserved "+response.areaPledge+" sq. ft. area in upcomming round of "+projectInformation.name): ("Pledged "+response.areaPledge+" sq. ft. area in "+projectInformation.name+" in "+roundInformation.roundName)),
                    subjectID: response.id,
                    subjectType: "tradeactivity",
                    event: ActivityEvent.CREATED,
                    causerID: req.decoded.id,
                    causerType: "users",
                    properties: {
                        attributes: {
                            dispID: response.id,
                            areaPledge:response.areaPledge,
                            buyerID: buyerID,
                            sellerID: response.sellerID,
                            medium: response.medium,
                            roundID: response.roundID,
                            totalPrice: response.totalPrice
                        },
                        old: null
                    },
                    source: null,
                    metadata:null
            },req)
        if(roundInformation.statusID!=8)
        {
            notificationService.advanceBooking({to:userID,from:sellerID,id:responseObject.ticketNo});
        }else{
            notificationService.pledgeFilled({to:userID,from:sellerID,trxId:responseObject.ticketNo});
        }
        receiptGeneration.postreceipt(dtoResponse);

        return res.status(200).json({ error: false, message: '', data: responseObject });

    } catch (error) {        
        err.statusCode = 400;
        err.message = "Error occurred in fetching area pledge";
        err.stackTrace = error;
        next(err);
    }

}





module.exports.userCheckout = userCheckout;