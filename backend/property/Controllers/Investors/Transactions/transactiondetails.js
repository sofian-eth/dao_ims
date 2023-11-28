
const ticketdetails = require('../../../Models/Investor/Transactions/ticketdetails');
const awsutils = require('../../../utils/aws-utils');
const agentInformation = require('../../../Models/Agents/getagentdetails.js');
const txdetailscontroller = function (req, res, next) {
    let err = {};
    var jsonObject;
    var investorid = req.decoded.id;
    var queuenumber = req.body.queuenumber;
    let agentID = null;
    ticketdetails.ticketAuthorization(investorid, queuenumber)
        .then(function (result) {
            return ticketdetails.ticketdetails(investorid, queuenumber);
        })
        .then(function (result) {
            if(result[0].length)
            agentID =  result[0].agentID;
            jsonobject = {
                txdetails: {
                    queuenumber: queuenumber,
                    transactionstatus: result[0].name,
                    paymentdate: result[0].paymentDate,
                    billingaddress: result[0].billingAddress,
                    areapledged: result[0].areaPledged,
                    sqftprice: result[0].sqftPrice,
                    totalprice: result[0].totalPrice,
                    paymentmode: result[0].paymentMode,
                    createdAt: result[0].createdAt

                },

                buyer: {
                    membershipid: result[0].membershipNumber,
                    name: result[0].firstName + ' ' + result[0].lastName,
                    email: result[0].email,
                    legalName:result[0].legalName,
                    primarymobilenumber: result[0].phoneNumber


                },

                seller: {
                    membershipid: result[0].sellermembership,
                    name: result[0].sellerfirstname + ' ' + result[0].sellerlastname,
                    legalName: result[0].sellerlegalname,
                    email: result[0].selleremail,
                    sellerphone: result[0].sellerphone


                },

                property: {
                    propertyName: result[0].propertyName


                },

                developmentrounds: {
                    developmentroundstage: result[0].roundName,
                    startdate: result[0].startDate,
                    enddate: result[0].endDate,
                    status: result[0].status,
                    discount: result[0].discounts


                },
                agentDetails: {
                    agentName: 'Haseeb Mirza',
                    agentEmail: 'haseeb.mirza@daoproptech.com'
                }






            }

            return ticketdetails.txdetailsattachment(result[0].id)

        }).then(function (result) {

            jsonobject.attachments = result;
            if (agentID != null)
                return agentInformation.fetchSalesAgentDetails(agentID);
            else
                res.status(200).json({ error: false, message: true, data: jsonobject });
        })
        .then(function (result) {
            if (result.length) {
                jsonobject.agentDetails.agentName = result[0].firstName + ' ' + result[0].lastName;
                jsonobject.agentDetails.agentEmail = result[0].email;
            }

            res.status(200).json({ error: false, message: true, data: jsonobject });

        })


        .catch(function (error) {

            err.statusCode = 400;
            err.message = "Error occurred in fetching transaction details";
            err.stackTrace = error;
            next(err);
            //            res.status(400).json({ error: true, message: 'Error occurred in fetching transaction details' });
        })




}


const txattachments = function (req, res, next) {
    let err = {};
    let keyName = 'trade/' + req.body.keyname;
    awsutils.generateSignedUrl(keyName)
        .then(function (result) {
            res.status(200).json({
                error: false,
                message: 'Attachment added successfully',
                data: result
            });
        })
        .catch(function (error) {

            err.statusCode = 400;
            err.message = "Error occurred in fetching transaction attachments";
            err.stackTrace = error;
            next(err);
            //            res.status(400).json({ error: true, message: 'Error occurred in fetching information' });
        })

}



module.exports = { txdetailscontroller, txattachments };