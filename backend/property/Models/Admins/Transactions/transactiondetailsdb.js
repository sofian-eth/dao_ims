
const db = require('../../db.js');
const knex = db.knex;



const propertyBankingDetails = async (propertyID) => {
    return knex('bankinformationenum')
        .select('id', 'bankName', 'accountTitle', 'accountNumber', 'IBAN', 'branch')
        .where({propertyID});
}



const txdetaildb = function (queuenumber) {
    return knex('tradeactivity as t')
        .where({ 't.queueNumber': queuenumber })
        .join('users as b', 't.buyerID', '=', 'b.id')
        .join('users as s', 't.sellerID', '=', 's.id')
        .leftJoin('paymentmodeenum as pm', 't.paymentMode', '=', 'pm.id')
        .join('developmentrounds as d', 't.roundID', '=', 'd.id')
        .join('property as p','t.propertyID','p.id')
        .join('statusenum as st', 't.statusID', '=', 'st.id')
        .select('t.internalStatus','t.id', 't.queueNumber', 't.medium', 't.agentID', 'st.name', 't.paymentDate', 't.billingAddress', 'pm.paymentMode as paymentMode', 't.areaPledged', 't.totalPrice', 't.sqftPrice', 'b.membershipNumber', 'b.legalName as buyerName', 'b.email', 'b.walletAddress','b.tronAddress as buyerTronAddress', 'b.phoneNumber', 's.membershipNumber as sellermembership','s.tronAddress as sellerTronAddress','b.id as buyerId','s.id as sellerId', 's.legalName as sellerName','s.cnicFrontID as sellerCnicFrontId','s.cnicBackID as sellerCnicBackId','b.cnicFrontID as buyerCnicFrontId','b.cnicBackID as buyerCnicBackId', 's.email as selleremail', 's.walletAddress as sellethaddress', 's.phoneNumber as sellerphone', 'd.roundName', 'd.startDate', 'd.endDate', 't.createdAt','p.id as projectID','p.blockchainMainContract', 'p.name as propertyName','p.config as propertyConfig')
        .then(function (result) {
             
            return Promise.all(result.map(async row => {
                row.bankingDetails = await propertyBankingDetails(row.projectID);
                return row;
            }));

        })
        .catch(function (error) {
            throw error;
        })


}



const txdetailsattachment = function (txid=null) {


    return knex('tradedocuments as td')
        .select('media.id as mediaID', 'media.originalFileName', 'media.size as fileSize', 'documentenum.name as fileTypes')
        .where({ 'td.tradeID': txid })
        .join('media', 'td.documentID', '=', 'media.id')
        .join('documentenum', 'media.documentId', '=', 'documentenum.id')
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })

}

async function transactionDetailsForReceipt(queueNumber) {

  

    let response;

    return knex('tradeactivity as t')
        .where({ 't.queueNumber': queueNumber })
        .join('users as b', 't.buyerID', '=', 'b.id')
        .join('paymentmodeenum as pm', 't.paymentMode', '=', 'pm.id')
        .join('statusenum as s','t.statusID','=','s.id')
        .select('t.queueNumber', 'b.membershipNumber', 't.paymentDate', 'b.firstName', 'b.lastName', 't.areaPledged', 't.totalPrice','t.buyerID','s.name as status','t.paymentDate as dueDate','t.propertyID','t.sqftPrice','t.agentID')

        .then(function (result) {
            if(result.length)
            {
                response = result[0];
            return response;
            }

            return response;
        })
        .catch(function (error) {
            throw error;
        })

}
module.exports = { txdetaildb, txdetailsattachment, transactionDetailsForReceipt };