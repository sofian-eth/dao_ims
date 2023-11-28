



const BlockchainUtils = require('../../../utils/blockchain-utils');
const Validator = require("validator");
const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const PropertyPrice = require('../../../Models/Property/currentpropertyprice');
const PropertyDb = require('../../../Models/propertydb.js');
const DevroundsDb = require('../../../Models/Property/getrounds');
const HoldersDb = require('../../../Models/Investor/General/holders.js');
const InvestorHistory = require('../../../Models/Investor/Transactions/investortransactionhistory.js');
const InvestedAmount = require('../../../Models/Investor/PersonalInformation/invested-amount');
const AveragePropertyCost = require('../../../Models/Investor/PersonalInformation/userportfolio');
const UserBalance = require('../Balance/user-balance');
const priceModel = require('../../../Models/Property/pricedb');
const areaUnitsConversionUtils = require('../../../utils/area-unit-conversion');
const personalInformationQuery = require('../../../Models/Investor/PersonalInformation/personalinformation');
const core = require('core');
const { ERROR_MESSAGES } = require('../../../resources/constants');
const DashboardController = function (req, res, next) {


    var investor_purchased_units;
    var active_property_price;
    var milestones_detail;
    var development_round_detail;
    var area_unit_details;
    var holders_table;
    var investor_history;
    var invested_amount;
    var average_cost;
    let err = {};

    return UserBalance.InvestorBalance(req.decoded.walletAddress)
        .then(function (result) {
            if (result)
                investor_purchased_units = result;
            else
                investor_purchased_units = 0;
            return priceModel.activeRoundPrice();
        })
        .then(function (result) {
            if (!result)
                active_property_price = 0;
            active_property_price = result[0].pricePerSqft;
            return PropertyDb.getfundingmilestonedetails();
        })
        .then(function (result) {
            milestones_detail = result;
            return DevroundsDb.getrounds();
        })
        .then(function (result) {
            development_round_detail = result;
            return AreaSold();
        })
        .then(function (result) {
            area_unit_details = result;
            return HoldersDb.getholdertables();
        })
        .then(function (result) {
            holders_table = result;
            return InvestorHistory.getinvestoryhistory(req.decoded.id);
        })
        .then(function (result) {
            investor_history = result;
            return InvestedAmount.InvestedAmount(req.decoded.id);
        })
        .then(function (result) {

            invested_amount = result;
            return AveragePropertyCost.profitlosscalculator(req.decoded.id);
        })
        .then(function (result) {

            average_cost = result;

            return personalInformationQuery.userPersonalInformation(req.decoded.id);
        })
        .then(function (result) {
            if (!result.length)
                result = null;


            res.json({
                error: "false",
                message: '',
                data: {
                    personal_details: {
                        investor_purchased_units: investor_purchased_units,
                        invested_amount: invested_amount,
                        average_cost: average_cost,
                        current_investment_value: investor_purchased_units * active_property_price,
                        information: result[0]
                    },
                    property_price: active_property_price,
                    active_milestones_details: milestones_detail,
                    development_round_details: development_round_detail,
                    area_unit_details: area_unit_details,
                    holders_table: holders_table,
                    investor_history: investor_history,
                }
            })

        })
        .catch(function (error) {
            console.log(error);
            err.statusCode = 400;
            err.message = "Error occurred in fetching user dashboard details";
            err.stackTrace = error;
            next(err);
        })



}


const InvestorBalance = function (investoraddress) {

    var investor_balance;
    return BlockchainUtils.investorbalance(investoraddress)
        .then(function (result) {
            if (result)
                investor_balance = result;

            return investor_balance;
        })
        .catch(function (error) {
            throw 'Error in fetching user balance';
        });


}


const AreaSold = function () {
    var master_wallet_area_units;
    var circulation_area_units;
    var area_units_sold;
    return BlockchainUtils.userbalance()
        .then(function (result) {
            master_wallet_area_units = result;
            return BlockchainUtils.circulationtokens()
        })
        .then(function (result) {
            circulation_area_units = result;
            area_units_sold = 100 - (master_wallet_area_units / circulation_area_units) * 100;
            var jsonobject = {
                total_area_units: circulation_area_units,
                area_units_left: master_wallet_area_units,
                area_units_sold: area_units_sold
            }
            return jsonobject;

        })
        .catch(function (error) {

            throw 'Error in calculating area sold';
        })
}

async function sendOTPCodeToPhoneNumber(req, res, next) {
    let resp = new core.responseObject();
    const userID = req.decoded.id;
    try {
        const user  = await core.userDB.getUserById(userID);
        if( user ) {
            if( Validator.isMobilePhone(user.phoneNumber) ) {
                const smsRef = await twilio.verify
                                .services(process.env.TWILIO_SERVICE_ID)
                                .verifications
                                .create({
                                    to: user.phoneNumber,
                                    channel: 'sms'
                                });
                if( smsRef.status ) {
                    resp.setSuccess('OTP sent.');
                    resp.data = {status: true, mobileNumber: user.phoneNumber};
                    res.status(200).json(resp);
                } else {
                    resp.setError(ERROR_MESSAGES.SERVER_ERROR, "SERVER_ERROR");
                    res.status(500).json(resp);
                }
            } else {
                resp.setError(ERROR_MESSAGES.PHONE_NUMBER_INVALID, "PHONE_NUMBER_INVALID");
                res.status(422).json(resp);
            }
    
        } else {
            resp.setError(ERROR_MESSAGES.USER_NOT_FOUND, "USER_NOT_FOUND");
            res.status(401).json(resp);
        }
    } catch(e) {
        resp.setError(ERROR_MESSAGES.SERVER_ERROR, "SERVER_ERROR");
        res.status(500).json(resp);
    }

}
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
async function updateUserDeviceToken (req,res,next){
    try {
        if(req.body.device_token){
        const userID = req.decoded.id;
        const result = await core.userDB.updateUserDeviceToken({device_token:req.body.device_token,userID});
        res.Success(result,"SUCCESS");
        }else{
            res.Error("Device token not provided","NO_TOKEN");
        }
    } catch (error) {
        res.Error(error.toString(),"ERROR");
    }
}

async function rentalStats(req,res,next){
    try {
        let userId= req.decoded ? req.decoded.id : 0;
     
        let rentalStats = await core.userDB.userRentalStats(userId);
        res.Success(rentalStats,"SUCCESS");
    } catch(error){
        res.Error(error.toString(),"ERROR");
    }
}

async function rentalIncome(req,res,next){
    try{
        let userId= req.decoded ? req.decoded.id : 0;
        let result={};
        let rentalHistoryResponse=[];
        let rentalHistory = await core.userDB.userRentalHistory(userId);
        rentalHistory.forEach(element => {
            let userRentalHistory = new core.userRentalHistoryResponse.userRentalStats(element[0]);
            rentalHistoryResponse.push(userRentalHistory);
            
        });

        res.Success(rentalHistoryResponse,"SUCCESS");


    } catch(error){
        res.Error(error.toString(),"ERROR");
    }
}

module.exports = { DashboardController, sendOTPCodeToPhoneNumber,updateUserDeviceToken,rentalIncome,rentalStats };