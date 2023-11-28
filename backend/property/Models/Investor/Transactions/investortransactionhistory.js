
const db = require('../../db.js');
const knex = db.knex;

const getinvestortransaction = function(investorid){
    return knex('tradeactivity as t')
        .where({ 't.sellerID': investorid })
        .orWhere({ 't.buyerID': investorid })
        .join('users as a', 't.sellerID', '=', 'a.id')
        .join('users as b', 't.buyerID', '=', 'b.id')
        .join('property as p', 't.propertyID', '=', 'p.id')
        .join('statusenum as s', 't.statusID', '=', 's.id')
        // .join('propertypricehistory as h', 't.propertyID', '=', 'h.propertyID')
        .select( 't.id as ticket.','p.name','t.areaPledged', 't.totalPrice', 'p.totalSqft','t.sqftPrice', 's.name as status','t.createdAt as Date','t.paymentDate as Due Date')
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        }) 
}
const getinvestortransactionDetail = function(ticket,investorid){
    return knex('tradeactivity as t')
        .where({ 't.id': ticket })
        .join('users as b', 't.buyerID', '=', 'b.id')
        .join('users as se', 't.sellerID', '=', 'se.id')
        .join('property as p', 't.propertyID', '=', 'p.id')
        .join('statusenum as s', 't.statusID', '=', 's.id')
        .join('paymentmodeenum as m', 't.paymentMode', '=', 'm.id')
        .select('se.legalName as Seller Name','se.email  as Seller Email','se.membershipNumber  as Seller Membership Id','b.legalName as Buyer Name','b.email  as Buyer Email','b.membershipNumber  as Buyer Membership Id', 'm.paymentMode','p.name','t.areaPledged', 't.totalPrice', 'p.totalSqft','t.sqftPrice', 's.name as status','t.createdAt as Date','t.paymentDate as Due Date')
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            console.log(error)
            throw error;
        }) 
}

const getinvestoryhistory = function (investorid) {

    return knex('tradeactivity as t')
        .where({ 't.sellerID': investorid })
        .orWhere({ 't.buyerID': investorid })
        .join('users as a', 't.sellerID', '=', 'a.id')
        .join('users as b', 't.buyerID', '=', 'b.id')
        .join('property as p', 't.propertyID', '=', 'p.id')
        .join('statusenum as s', 't.statusID', '=', 's.id')
        .select('a.walletAddress as fromuser', 'b.walletAddress as touser', 's.name', 't.createdAt', 't.areaPledged', 'p.name', 't.sqftPrice', 's.name as status')
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
}




const listtransactions = function (investorid) {

    return knex('tradeactivity as t')
        .where({ 't.sellerID': investorid })
        .orWhere({ 't.buyerID': investorid })
        .join('users as i', 't.sellerID', '=', 'i.id')
        .join('users as n', 't.buyerID', '=', 'n.id')
        .join('statusenum as s', 't.statusID', '=', 's.id')
        .orderBy('t.queueNumber')
        .select('i.email', 'n.email', 'n.phoneNumber', 't.areaPledged', 't.sqftPrice', 't.totalPrice', 't.paymentDate', 't.queueNumber', 's.name')
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })


}


const salesAgentTransaction = function (agentID) {

    return knex('tradeactivity as t')
        .where({ 't.agentID': agentID })
        .join('users as i', 't.sellerID', '=', 'i.id')
        .join('users as n', 't.buyerID', '=', 'n.id')
        .join('statusenum as s', 't.statusID', '=', 's.id')
        .orderBy('t.queueNumber')
        .select('i.membershipNumber as seller', 'n.membershipNumber as buyer ', 't.areaPledged', 't.sqftPrice', 't.totalPrice', 't.paymentDate', 't.queueNumber', 's.name as status')
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })


}


const searchtransactions = function (investorid, order, operations) {

    history = 'desc';
    if (order == 'Oldest')
        history = 'asc';

    return knex('tradeactivity as t').where({ 't.sellerID': investorid }).orWhere({ 't.buyerID': investorid }).join('users as a', 't.sellerID', '=', 'a.id').join('users as b', 't.buyerID', '=', 'b.id').join('property as p', 't.propertyID', '=', 'p.id').join('statusenum as s', 't.statusID', '=', 's.id').orderBy('createdAt', history).select('a.walletAddress as fromuser', 'b.walletAddress as touser', 's.name', 't.createdAt', 't.areaPledged', 'p.name', 't.sqftPrice', 's.name as status')
        .modify(function (queryBuilder) {
            if (operations == 'buy' || operations == 'sell')
                queryBuilder.where({ operations: operations })

        })
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })

}



async function transactionListing (investorID){
    return knex('tradeactivity as t')
        .where({ 't.sellerID': investorID })
        .orWhere({ 't.buyerID': investorID })
        .join('users as a', 't.sellerID', '=', 'a.id')
        .join('users as b', 't.buyerID', '=', 'b.id')
        .join('property as p', 't.propertyID', '=', 'p.id')
        .join('statusenum as s', 't.statusID', '=', 's.id')
        .leftJoin('orderItems as oi','t.id','=','oi.tradeActivityID')
        .leftJoin('orderItems as ois','t.id','=','ois.sellerServiceChargesTradeActivityId')
        .select( 't.id as ticketNo','p.name as projectName','t.areaPledged', 't.totalPrice','t.sqftPrice', 's.name as status','t.createdAt as Date','t.paymentDate as Due Date','t.medium as medium','oi.id','ois.id')
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        }) 


       
}

module.exports = { getinvestoryhistory, listtransactions, searchtransactions,salesAgentTransaction,getinvestortransaction,getinvestortransactionDetail,transactionListing };