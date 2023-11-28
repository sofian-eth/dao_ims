
const { TRANSACTION_STATUSES } = require('./../../../resources/constants');
const db = require('../../db.js');
const { KnexTimeoutError } = require('knex');
const createtx = require('./createtransaction');
const bankDetails  = require('../../Property/bank-information');
const receiptGeneration = require('../../../services/shared/receipt');
const utility = require('../../../utils/utils');
const salesReceiptDTO= require('../../../dto/sales-receipt-model');
const knex = db.knex;
const statusEnum = require('../../../resources/statusEnum');




const transactions = function (status, order, orderByColumn) {
    var searchColumn = 't.' + orderByColumn;
    let txStatus = status;
    // if(status === 'pending')
    //     txStatus = 'pending or st.name=pledge confirmed';

    return knex('tradeactivity as t')
        .join('users as i', 't.sellerID', '=', 'i.id')
        .join('users as n', 't.buyerID', '=', 'n.id')
        .join('statusenum as st', 't.statusID', '=', 'st.id')
        .leftJoin('users as a', 't.agentID', '=', 'a.id')
        .orderBy(searchColumn, order)
        // .where({ 'st.name': txStatus })
        .select('i.email', 'n.email', 'n.phoneNumber', 't.areaPledged', 't.sqftPrice', 't.totalPrice', 't.paymentDate', 't.queueNumber', 'st.name', 't.blockchainReference', 'a.membershipNumber as agentMembershipNumber')
        .modify(function(queryBuilder){
            console.log(queryBuilder);
            if(status === 'pending') {
            console.log(txStatus);    
            queryBuilder.where({'st.name':txStatus}).orWhere({'st.name':'pledge confirmed'});
                
        }
            else
            queryBuilder.where({'st.name':txStatus});
        })
        .then(function (result) {
            return result;
        })
        .catch(function (error) {

            throw error;
        })


}


const updatetx = function (queuenumber, txid) {
    var updatedDate = new Date();
    var fetchedData;
    var propBanks;

    return knex('statusenum').where({ name: 'locked' }).select('id')
        .then(function (result) {
            return knex('tradeactivity').where({ queueNumber: queuenumber }).update({ blockchainReference: txid, statusID: result[0].id, updatedAt: updatedDate,internalStatus:'locked' })

        })
        .then(function (result) {
            return result;

        })
        .then(function (result){
            let _currData=null;
           return _currData=createtx.updateReceipt(queuenumber)
            
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
                queueNumber: queuenumber,
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
                payDate:fetchedData.paymentReceivableDate
                //paymentDate: fetchedData.paymentDate 
                // add paid amount too
            }
            
            let dtoResponse = new salesReceiptDTO.salesReceipt(modelData);
            return receiptGeneration.postreceipt(dtoResponse);
        })
        .catch(function (error) {
            throw error;
        })
}



async function transactionStats() {
    let totalPledgedArea;
    let totalPledgedAreaValue;
    let testPledgedArea;
    let totalLockedArea;
    let totalLockedAreaValue;
    let totalDiscardArea;
    let totalDiscardAreaValue;
    let pendingPledgeQuery = "select sum(tradeactivity.areaPledged) as totalAreaPledged,sum(tradeactivity.totalPrice) as totalAreaPledgedValue from tradeactivity inner join statusenum on tradeactivity.statusID=statusenum.id where statusenum.name='pending';";
    let lockedAreaQuery = "select sum(tradeactivity.areaPledged) as totalLockedArea,sum(tradeactivity.totalPrice) as totalLockedAreaValue from tradeactivity inner join statusenum on tradeactivity.statusID=statusenum.id where statusenum.name='locked';";
    let discardAreaQuery = "select sum(tradeactivity.areaPledged) as totalDiscardArea,sum(tradeactivity.totalPrice) as totalDiscardAreaValue from tradeactivity inner join statusenum on tradeactivity.statusID=statusenum.id where statusenum.name='discard';";
    let formatter = new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR',

    });


    return knex.raw(pendingPledgeQuery)
        .then(function (result) {
            let parsedData = JSON.parse(JSON.stringify(result[0]));


            totalPledgedArea = parseInt(parsedData[0].totalAreaPledged);
            totalPledgedAreaValue = parseInt(parsedData[0].totalAreaPledgedValue);
            return knex.raw(lockedAreaQuery);
        })
        .then(function (result) {
            let parsedData = JSON.parse(JSON.stringify(result[0]));
            totalLockedArea = parseInt(parsedData[0].totalLockedArea);
            totalLockedAreaValue = parseInt(parsedData[0].totalLockedAreaValue);

            return knex.raw(discardAreaQuery);
        })
        .then(function (result) {

            let parsedData = JSON.parse(JSON.stringify(result[0]));
            totalDiscardArea = parseInt(parsedData[0].totalDiscardArea);
            totalDiscardAreaValue = parseInt(parsedData[0].totalDiscardAreaValue);

            let jsonResponse = {
                totalPledgedArea: totalPledgedArea,
                totalPledgedAreaValue: totalPledgedAreaValue,
                totalLockedArea: totalLockedArea,
                totalLockedAreaValue: totalLockedAreaValue,
                totalDiscardArea: totalDiscardArea,
                totalDiscardAreaValue: totalDiscardAreaValue
            }

            return jsonResponse;
        })
        .catch(function (error) {
            throw error;
        })



}


async function transactionListingFilters(txType,offset, recordLimit, transactionFilters, search,projectId) {
    let orderByColumn = 't.queueNumber';
    if(TRANSACTION_STATUSES.LOCKED == txType){
        orderByColumn='lockedDate';
      }
    let txOrder = 'desc';
    let Query2='';
    let statuses = [txType];
    switch (txType) {
        case TRANSACTION_STATUSES.PENDING:
            statuses = [TRANSACTION_STATUSES.PENDING, TRANSACTION_STATUSES.PLEDGE_SUBMITTED,TRANSACTION_STATUSES.PLEDGE_CONFIRMED];
            break;
        case TRANSACTION_STATUSES.PLEDGE_CONFIRMED:
            statuses = [TRANSACTION_STATUSES.PLEDGE_SUBMITTED, TRANSACTION_STATUSES.PLEDGE_CONFIRMED];
            break;
        case TRANSACTION_STATUSES.LOCKED:
            statuses = [TRANSACTION_STATUSES.LOCKED,TRANSACTION_STATUSES.CONFIRMED];
            break;
        case TRANSACTION_STATUSES.DISCARDED:
            statuses = [TRANSACTION_STATUSES.DISCARDED];
            break;
        case TRANSACTION_STATUSES.CONFIRMED:
            statuses = [TRANSACTION_STATUSES.LOCKED, TRANSACTION_STATUSES.CONFIRMED];
            break;
    }
    if(projectId == 0){
        Query2 = ''
    }else{
        Query2 = `p.id = "${projectId}" AND`
    }

    let Query = `select distinct(t.queueNumber) as queueNumber,t.id, p.propertySymbol as propertyName,dev.roundName,
    n.email as email, n.phoneNumber, t.areaPledged, 
     t.sqftPrice, t.totalPrice, t.createdAt as pledgedDate, ifnull(t.transactionConfirmationTime,t.updatedAt) as lockedDate,
     s.name, a.membershipNumber as agentMembershipNumber
     ,concat(a.firstName, ' ', a.lastName) as AgentName,
     t.internalStatus,t.updatedAt, t.blockchainReference, JSON_UNQUOTE(p.config-> "$.blockchainConfiguration.network") as blockchainNetwork,JSON_UNQUOTE(p.config-> "$.blockchainConfiguration.mainNetExplorerUrl") as mainNetExplorerUrl,JSON_UNQUOTE(p.config-> "$.blockchainConfiguration.testNetExplorerUrl") as testNetExplorerUrl,
     t.isForked,
    JSON_UNQUOTE(p.config-> "$.blockchainConfiguration.forkedExplorerUrl") as forkedExplorerUrl,
    p.isMigrated, 
    p.newSmartContract,
      t.medium from tradeactivity as t
	 left join tradedocuments as td on td.tradeID = t.id
     join statusenum as s on t.statusID = s.id
	 left join documents as d on td.documentID = d.id
	 left join media as m on td.mediaId = m.id
	 left join documentenum as de on de.id = m.documentId
     inner join property as p on p.id = t.propertyID
 	 inner join users as i on t.sellerID = i.id
 	 inner join users as n on t.buyerID = n.id
 	 left join users as a on t.agentID = a.id
    left join developmentrounds as dev on t.roundID =dev.id
    where ${Query2} t.internalStatus in ("${statuses.join('","')}") and t.isDemo is not true`;
    

    if(transactionFilters.length>0){
        Query +=` and ( d.documentType in ("${transactionFilters.join('","')}")  or de.bucketId in ("${transactionFilters.join('","')}"))`;
    }

    if(search.length>0){
        Query+=` and  (t.queueNumber like '%${search}%' or 
        t.createdAt like '%${search}%' or
        t.sqftPrice like '%${search}%' or
        t.totalPrice like '%${search}%' or
        t.areaPledged like '%${search}%' or
        t.blockchainReference like '%${search}%' or
        n.legalName like '%${search}%' or
        t.blockchainReference like '%${search}%' or
        n.email like '%${search}%' or
        n.phoneNumber like '%${search}%' or
        a.membershipNumber like '%${search}%' or
        dev.roundName like '%${search}%' or
        p.propertySymbol like '%${search}%' 
        )` 
    }
      let totalRecords = await knex.raw(Query);
      records = await knex.raw(Query + ` order by ${orderByColumn.toString()} ${txOrder} limit ${recordLimit} offset ${offset}`);
    let output = {
        totalRecords: totalRecords[0].length,
        records: records[0]
    };
    return output;
    }


async function transactionFetch(txType, offset, recordLimit, search) {
    let orderByColumn = 'updatedAt';
    let txOrder = 'desc';
    if (txType == TRANSACTION_STATUSES.PENDING) {
        orderByColumn = 'queueNumber';
        txOrder = 'asc';
    }
    let statuses = [txType];
    switch (txType) {
        case TRANSACTION_STATUSES.PLEDGE_SUBMITTED:
        case TRANSACTION_STATUSES.PLEDGE_CONFIRMED:
        case TRANSACTION_STATUSES.PENDING:
            statuses = [TRANSACTION_STATUSES.PENDING,TRANSACTION_STATUSES.PLEDGE_SUBMITTED, TRANSACTION_STATUSES.PLEDGE_CONFIRMED];
            break;
        case TRANSACTION_STATUSES.LOCKED:
        case TRANSACTION_STATUSES.CONFIRMED:
            statuses = [TRANSACTION_STATUSES.LOCKED, TRANSACTION_STATUSES.CONFIRMED];
            break;
    }
    let searchColumn = 't.' + orderByColumn;
    let totalRecords;
    let data;
    return knex('tradeactivity as t')
        .join('users as i', 't.sellerID', '=', 'i.id')
        .join('users as n', 't.buyerID', '=', 'n.id')
        .join('statusenum as st', 't.statusID', '=', 'st.id')
        .leftJoin('users as a', 't.agentID', '=', 'a.id')
        .leftJoin('property', 't.propertyID', '=', 'property.id')
        .orderBy(searchColumn, txOrder)
        .whereIn('st.name', statuses)
        .where(function () {
            if (search.length > 0) {
                this.orWhere('t.id', 'like', `%${search}%`)
                this.orWhere('t.paymentDate', 'like', `%${search}%`)
                this.orWhere('t.sqftPrice', 'like', `%${search}%`)
                this.orWhere('t.totalPrice', 'like', `%${search}%`)
                this.orWhere('t.areaPledged', 'like', `%${search}%`)
                this.orWhere('t.blockchainReference', 'like', `%${search}%`)
                this.orWhere('st.name', 'like', `%${search}%`)
                this.orWhere('n.email', 'like', `%${search}%`)
                this.orWhere('n.phoneNumber', 'like', `%${search}%`)
                this.orWhere('a.membershipNumber', 'like', `%${search}%`)
            }

        })
        .count('*', { as: 'totalRecords' })
        .then(function (result) {
            totalRecords = result[0].totalRecords;

            return knex('tradeactivity as t')
                .join('users as i', 't.sellerID', '=', 'i.id')
                .join('users as n', 't.buyerID', '=', 'n.id')
                .join('statusenum as st', 't.statusID', '=', 'st.id')
                .leftJoin('users as a', 't.agentID', '=', 'a.id')
                .leftJoin('property', 't.propertyID', '=', 'property.id')
                .orderBy(searchColumn, txOrder)
                .limit(recordLimit)
                .offset(offset)
                .whereIn('st.name', statuses)
                .where(function () {
                    if (search.length > 0) {
                        this.orWhere('t.id', 'like', `%${search}%`)
                        this.orWhere('t.paymentDate', 'like', `%${search}%`)
                        this.orWhere('t.sqftPrice', 'like', `%${search}%`)
                        this.orWhere('t.totalPrice', 'like', `%${search}%`)
                        this.orWhere('t.areaPledged', 'like', `%${search}%`)
                        this.orWhere('t.blockchainReference', 'like', `%${search}%`)
                        this.orWhere('st.name', 'like', `%${search}%`)
                        this.orWhere('n.email', 'like', `%${search}%`)
                        this.orWhere('n.phoneNumber', 'like', `%${search}%`)
                        this.orWhere('a.membershipNumber', 'like', `%${search}%`)
                    }

                })
                .select('i.email', 'n.email', 'n.phoneNumber', 't.areaPledged', 't.sqftPrice', 't.totalPrice', 't.createdAt as paymentDate', 't.queueNumber', 'st.name', 't.blockchainReference', 'a.membershipNumber as agentMembershipNumber', 'property.name as propertyName');
        })
        .then(function (result) {
            let output = {
                totalRecords: totalRecords,
                records: result
            };
            return output;
        })
        .catch(function (error) {
            console.log("Transaction Error", error);
            throw error;
        })


}


async function fetchTransactionList(status,network) {
    return knex('tradeactivity as t')
        .join('statusenum as s', 't.statusID', 's.id')
        .join('developmentrounds as d', 't.roundID', 'd.id')
        .join('property as p','t.propertyID','p.id')
        .where('s.name', status)
        .whereRaw('JSON_UNQUOTE(p.config-> "$.blockchainConfiguration.network")=?',[network])
        .select('t.id', 't.blockchainReference', 't.buyerID', 't.sellerID', 'd.propertyID', 't.totalPrice', 't.areaPledged')
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
}


async function fetchTransactionByHash(status,transactionId){
    let response ;
    return knex('tradeactivity as t')
    .join('statusenum as s', 't.statusID', 's.id')
    .join('developmentrounds as d', 't.roundID', 'd.id')
    .join('property as p', 'd.propertyID', 'p.id')
    .join('users as u', 't.sellerID', 'u.id')
    .join('users as b', 't.buyerID', 'b.id')
    .where({'s.name': status,'t.blockchainReference':transactionId})
    .select('u.email as sellerEmail','b.email as buyerEmail','b.legalName as buyerName',
    't.id', 't.blockchainReference', 't.buyerID', 't.sellerID', 'd.propertyID', 
    'p.name as projectName','u.legalName as sellerName','t.totalPrice', 't.areaPledged','t.medium')
    .then(function (result) {
        if(result.length)
            {
                response = result[0];
            }
            return response;

    })
    .catch(function (error) {
        throw error;
    })
}


async function lockTransaction(txID) {
    return knex('statusenum as s')
        .where('s.name', 'locked')
        .select('id')
        .then(function (result) {
            if (!result.length)
                throw 'status not found';
            return knex('tradeactivity')
                .where({ blockchainReference: txID })
                .update({ statusID: result[0].id });




        })
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw 'Unable to update transaction with id ' + txID;
        })


}


async function updateUserBalance(buyerID, projectID, balance, sellerID, netAmount, statusName, txId,timestamp) {
 console.log(timestamp);
 console.log(txId);

    let netBuyerBalance = 0;
    let netSellerBalance = 0;
    let netBuyerInvestment;
    let netSellerInvestment;

    let buyerPreviousBalance;
    let buyerClosingBalance;
    let sellerPreviousBalance;
    let sellerClosingBalance;


    return knex.transaction(function (tx) {
        return tx('portfoliobalance')
            .where({ userID: buyerID, propertyID: projectID })
            .select('balance', 'netInvestment')
            .then(function (result) {
                if (result.length) {
                    netBuyerBalance = result[0].balance + balance;
                    netBuyerInvestment = result[0].netInvestment + netAmount;
                    
                    buyerPreviousBalance = result[0].balance;
                    buyerClosingBalance = netBuyerBalance;

                    return tx('portfoliobalance').where({ userID: buyerID, propertyID: projectID }).update({ balance: netBuyerBalance, netInvestment: netBuyerInvestment });
                }
                else {

                    netBuyerBalance = balance;
                    netBuyerInvestment = netAmount;
                    return tx('portfoliobalance').insert({ userID: buyerID, propertyID: projectID, balance: netBuyerBalance, netInvestment: netBuyerInvestment });
                }

            })
            .then(function (result) {
                return tx('portfoliobalance')
                    .where({ userID: sellerID, propertyID: projectID })
                    .select('balance', 'netInvestment');

            })
            .then(function (result) {
                if (result.length) {
                    netSellerBalance = result[0].balance - balance;
                    netSellerInvestment = result[0].netInvestment - netAmount;

                    sellerPreviousBalance = result[0].balance;
                    sellerClosingBalance = netSellerBalance;

                    return tx('portfoliobalance').where({ userID: sellerID, propertyID: projectID }).update({ balance: netSellerBalance, netInvestment: netSellerInvestment });
                }

                else
                    throw 'seller not found';


            })
            .then(function (result) {
                return tx('statusenum').where({ name: statusName })
                    .select('id')

            })
            .then(function (result) {
                if (!result.length)
                    throw 'Status not found';

                let id = result[0].id;
                return tx('tradeactivity').where({ id: txId }).update({ 
                    statusID: id, 
                    transactionConfirmationTime: timestamp,
                    buyerPreviousBalance : buyerPreviousBalance,
                    buyerClosingBalance : buyerClosingBalance,
                    sellerPreviousBalance : sellerPreviousBalance,
                    sellerClosingBalance : sellerClosingBalance,
                    
                });
            })
            .then(function(result) {
                if( statusName===statusEnum.confirmed ) {
                    return tx('demarcatedUserAssetTransactions').where({ tradeActivityID: txId }).update({ status: 'LOCKED' });
                }
                return result;
            })
            .then(function (result) {
                return result;
            })
            .catch(function (error) {

                throw error;
            })
    });





}


async function updateTransactionStatus(statusName, txId) {
    return knex('statusenum').where({ name: statusName })
        .select('id')
        .then(function (result) {
            if (!result.length)
                throw 'Status not found';

            let id = result[0].id;
            return knex('tradeactivity').where({ id: txId }).update({ statusID: id });

        })
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })

}

async function pendingTransactionCount(){
    let response;
    return knex('statusenum').where({name: TRANSACTION_STATUSES.LOCKED})
            .select('id')
            .then(function(result){
                return knex('tradeactivity')
                        .where({statusID: result[0].id})
                        .count('*',{as: 'pendingCount'})
                        .then(function(result){
                            if(result.length)
                               response = result[0].pendingCount;
                            
                               return response;
                        })
                        .catch(function(error){
                            throw error;
                        })
            })    
}
module.exports = { transactions, updatetx, transactionStats, transactionListingFilters, transactionFetch, fetchTransactionList, lockTransaction, updateUserBalance, updateTransactionStatus,fetchTransactionByHash,pendingTransactionCount };