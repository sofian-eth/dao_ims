

const propertymodel = require('../../../Models/propertydb.js');
const agentInformation = require('../../../Models/Agents/getagentdetails.js');
const membershipnumber = require('../../../Models/Investor/PersonalInformation/getmembershipid.js');
const pledgerequest = require('../../../Models/Investor/Transactions/pledgearea.js');
const getemail = require('../../../Models/Investor/PersonalInformation/getemailandphone.js');
const pdftemplates = require('../../../utils/pdf-utils.js');
const awsutils = require('../../../utils/aws-utils.js');
const addreceiptdb = require('../../../Models/Investor/Transactions/addreceipt.js');
const pricedb = require('../../../Models/Property/pricedb');
const emailUtils = require('../../../utils/email');
const receiptGeneration = require('../../../services/shared/receipt');
const salesReceiptDTO = require('../../../dto/sales-receipt-model');



const pledgeArea = function (req, res, next) {
    let err = {};
    var currentPrice;
    var totalTaxPrice = 0;
    var devRound;
    var ticketObject;
    var email;
    var discount;
    var marketPrice;
    var roundName;
    pricedb.pricedb()
        .then(function (result) {

            if (req.body.purchasedarea == 0)
                throw "Are units can't be zero ";

            currentPrice = result[0].pricePerSqft;
            marketPrice = result[0].marketPrice;
            discount = Math.floor(((marketPrice - currentPrice) / marketPrice) * 100);
            return propertymodel.gettaxes()
        })
        .then(function (result) {
            result.forEach(element => {
                totalTaxPrice += element.price;
            });
            return propertymodel.getactivedevelopmentrounds()

        })
        .then(function (result) {
            devRound = result[0].id;
            roundName = result[0].roundName;

        })

        .then(function (result) {
            return pledgerequest.pledgearea(req.body, req.decoded.id, currentPrice, totalTaxPrice, devRound, discount)
        })
        .then(function (result) {
            ticketObject = result[0];

            ticketObject.paymentdate = result[0].paymentDate;
            ticketObject.queuenumber = result[0].id;
            ticketObject.sqftprice = result[0].sqftPrice;
            ticketObject.totalprice = result[0].totalPrice;
            ticketObject.areapledged = result[0].areaPledged;
            delete ticketObject.areaPledged;
            delete ticketObject.paymentDate;
            delete ticketObject.queueNumber;
            delete ticketObject.sqftPrice;
            delete ticketObject.totalPrice;

            return membershipnumber.getinvestordetails(req.decoded.id)

        })
        .then(function (result) {

            ticketObject.membershipid = result[0].membershipNumber;
            firstName = result[0].firstName;
            ticketObject.investorname = result[0].legalName;
        })
        .then(function (result) {
            ticketObject.discount = discount;
            return agentInformation.fetchSalesAgentDetails(req.body.agentcode);
        })
        .then(function (result) {
            if (result.length) {
                ticketObject.agentName = result[0].firstName + ' ' + result[0].lastName;
                ticketObject.agentEmail = result[0].email;
            }
            else {
                ticketObject.agentName = 'Haseeb Mirza';
                ticketObject.agentEmail = 'haseeb.mirza@daoproptech.com';
            }
            let dtoResponse = new salesReceiptDTO.salesReceipt(ticketobject);
            receiptGeneration.postreceipt(dtoResponse);

            sendemail(req.decoded, ticketObject.legalName, currentPrice, req.body.purchasedarea, roundName, discount, marketPrice);
            res.status(200).json({
                error: false,
                message: '',
                data: ticketObject
            });
        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error occurred in area pledge";
            err.stackTrace = error;
            next(err);
        })
}


const sendemail = function (investorid, investorName, currentprice, purchasedarea, devround, discount, marketprice) {


    return getemail.getemailofinvestor(investorid)
        .then(function (result) {
            var dataobject = {
                firstname: investorName,
                projectname: 'Elements Residencia',
                currentprice: currentprice,
                marketprice: marketprice,
                areaunits: purchasedarea,
                devround: devround,
                discount: discount,
                investoremail: result[0].email
            };
            return emailUtils.pledgeArea(dataobject);
        })
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })





}
module.exports = { pledgeArea };