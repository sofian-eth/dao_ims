const db = require('../../db.js');
const knex = db.knex;
const statusEnum = require('../../../resources/statusEnum');
const core = require('core');
const { cnicfront, cnicback } = require('../../../resources/documentEnum.js');
const { TRANSACTION_STATUSES } = require('./../../../resources/constants');
function setLimit(pageNo=1,pageSize=10){
    return ` limit ${pageSize} offset ${(pageNo-1)*pageSize}`;
}
async function transactionListing(investorID,type=null) {
    let pageNo = null;
    let pageSize = null;
    if(arguments.length>0){
        pageNo=arguments[2]?arguments[2]:null;
        pageSize=arguments[3]?arguments[3]:null;
    }
    return knex.raw(`select 
    d.roundName,t.id as ticketId, 
    p.propertySymbol as projectName,
    t.buyerID,
    t.sellerID, 
    t.areaPledged, 
    t.totalPrice as totalAmount, 
    t.sqftPrice, 
    s.name as status, 
    t.createdAt as Date, 
    t.paymentDate as due_date,
    t.transactionConfirmationTime as blockchainConfirmationTime, 
    t.propertyID,
    t.internalStatus,
    t.medium,
    t.isForked,
    JSON_UNQUOTE(p.config-> "$.blockchainConfiguration.forkedExplorerUrl") as forkedExplorerUrl,
    p.isMigrated, 
    p.newSmartContract,
    oi.id as dealId,
    ois.id as serviceDealId,
    IF(t.medium<>'DEMARCATION' ,'', (SELECT demarcatedAreaUnits.code FROM demarcatedUserAssetTransactions INNER JOIN demarcatedUserAssets ON demarcatedUserAssets.id=demarcatedUserAssetTransactions.userAssetID INNER JOIN demarcatedAreaUnits ON demarcatedAreaUnits.id=demarcatedUserAssets.areaUnitID WHERE demarcatedUserAssetTransactions.tradeActivityID=t.id LIMIT 1)) as unitCode 
    from tradeactivity as t 
    join users as a on t.sellerID = a.id
    join users as b on t.buyerID = b.id
    join developmentrounds as d on t.roundID = d.id
    join property as p on d.propertyID = p.id
    join statusenum as s on t.statusID = s.id
    left join orderItems as oi on t.id = oi.tradeActivityID
    left join orderItems as ois on t.id = ois.sellerServiceChargesTradeActivityId
    where (t.sellerID = ${investorID} or t.buyerID = ${investorID})
    ${type == "market"?" and medium='market_Place'":''}
    and isDemo is not true
    order by t.id desc ${pageNo? setLimit(pageNo,pageSize):''}`).then(function (result) { 
        if(result && result[0]){
            return result[0]
        }
            return [];
        })
        .catch(function (error) {
            throw error;
        });

}
async function transactionListingCount(investorID,type=null) {
    let pageNo = null;
    let pageSize = null;
    if(arguments.length>0){
        pageNo=arguments[2]?arguments[2]:null;
        pageSize=arguments[3]?arguments[3]:null;
    }
    return knex.raw(`select count(*) as count from tradeactivity as t 
    join users as a on t.sellerID = a.id
    join users as b on t.buyerID = b.id
    join developmentrounds as d on t.roundID = d.id
    join property as p on d.propertyID = p.id
    join statusenum as s on t.statusID = s.id
    where (t.sellerID = ${investorID} or t.buyerID = ${investorID})
    ${type == "market"?" and medium='market_Place'":''}
    and isDemo is not true
    order by t.createdAt desc`).then(function (result) { 
        if(result && result[0]){
            return result[0]
        }
            return [];
        })
        .catch(function (error) {
            throw error;
        });

}



async function transactionDetail(ticketID, investorID) {

    let rawQuery = `select t.*,d.roundName,d.displayStartDate,d.displayEndDate,b.legalName as buyerName,
    pt.name as propertyName,b.membershipNumber as buyerMembershipNumber,b.email as buyerEmail,s.legalName as sellerName,s.membershipNumber as sellerMembershipNumber,
    s.email as sellerEmail,st.name as status,bankinformationenum.bankName as paymentMode,
    d.id as roundID,d.displayEndDate as roundEndDate, 
    t.updatedAt,JSON_UNQUOTE(pt.config-> "$.blockchainConfiguration.network") as blockchainNetwork,
    JSON_UNQUOTE(pt.config-> "$.blockchainConfiguration.mainNetExplorerUrl") as mainNetExplorerUrl, 
    JSON_UNQUOTE(pt.config-> "$.blockchainConfiguration.forkedExplorerUrl") as forkedExplorerUrl,
    JSON_UNQUOTE(pt.config-> "$.blockchainConfiguration.preforkedNetwork") as preforkedNetwork,
    pt.isMigrated, pt.newSmartContract,t.isForked  
    from tradeactivity as t inner join users as b on t.buyerID=b.id 
    inner join users as s on t.sellerID=s.id 
    inner join statusenum as st on t.statusID=st.id 
    inner join paymentmodeenum as p on t.paymentMode=p.id 
    inner join developmentrounds as d on t.roundID=d.id 
    inner join property as pt on d.propertyID=pt.id  
    left join bankinformationenum on bankinformationenum.id=t.bankAccountId where t.id=` + ticketID + ` and (buyerID=` + investorID + ` or sellerID=` + investorID + `);`;
    return knex.raw(rawQuery)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        });

}

async function getMediaObject (userID,key) {
    
    return await knex('users as u')
    .select('m.originalFileName', 'd.name','d.bucketId', 
            'm.id', 'm.relativePath','m.size')
    .join('media as m', key, '=', 'm.id')
    .join('documentenum as d', 'm.documentId', '=', 'd.id')
    .where({ 'u.id': userID })
    .first();

}

async function cnicMedia(userID) {
    try {

        let cnicMedia = {};
        let cnicFront = await getMediaObject(userID,'u.cnicFrontID');
        let cnicBack = await getMediaObject(userID,'u.cnicBackID');

        if (cnicFront) {
            cnicMedia.cnicFront = new core.mediaResponse(cnicFront);           
        }

        if(cnicBack){
            cnicMedia.cnicBack = new core.mediaResponse(cnicBack);
        }


        return cnicMedia;
        
    } catch (error) {
        //TODO: Properly pass response instead of throwing
        throw error;
        
    }
}


async function transactionAuthorization(ticketId, investorId) {
    let rawQuery = "select * from tradeactivity where id=" + ticketId + " AND (sellerId=" + investorId + " OR buyerId=" + investorId + " )";
    return knex.raw(rawQuery)
        .then(function (result) {
            let res = result[0];
            if (!res.length)
                throw 'Transaction not found';
            return res;

        })
        .catch(function (error) {
            throw error;
        });



}


async function userTransactionConfirmation(ticketId, bankId, paymentConfirmationDate) {
    return knex('tradeactivity')
        .where({ id: ticketId })
        .update({ bankAccountId: bankId, paymentReceivableDate: paymentConfirmationDate })
        .then(function (result) {
            return result;

        })
        .catch(function (error) {
            throw error;
        })

}

async function updateTransactionStatus(ticketId, status) {
    let statusId;
    return knex('statusenum')
        .where({ name: status })
        .select('id')
        .then(function (result) {
            if (!result.length)
                throw 'Status not found';
            statusId = result[0].id;
            return knex('tradeactivity').where({ id: ticketId }).update({ statusID: statusId });
        })
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })



};



async function transactionAttachment(txObject) {

    return knex('tradedocuments')
        .insert(txObject)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })



};

async function transactionAttachmentDel(txObject) {

    return knex('tradedocuments').whereIn('mediaId',txObject).del()
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })



};

async function transactionReminder(userId) {


    return knex('tradeactivity as t')
        .join('developmentrounds as d', 't.roundID', 'd.id')
        .join('property as p', 'd.propertyID', 'p.id')
        .join('statusenum as s', 't.statusID', 's.id')
        .where({ 's.name': statusEnum.pending, 't.buyerID': userId })
        .andWhere('t.paymentDate','>=',new Date())
        .where(function(){
            this.orWhere({'t.internalStatus': 'pending'}).orWhere({'t.internalStatus': 'verified'})
        })
        .limit(5)
        .orderBy('t.createdAt', 'desc')
        .select('t.id as ticketNo', 'p.name as propertyName','p.coverPhoto','p.propertyLogo', 't.areaPledged', 't.totalPrice', 't.paymentDate')
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })

}

async function updateTransactionDocuments(object) {


    return knex('tradedocuments').insert(object)
        .then(function (result) {
            return result; 
        })
        .catch(function (error) {
            
            throw 'Error occurred in adding document';
        })
}

async function getConfirmedTranByUserAndProperty(buyerID, propertyID) {
    return knex('tradeactivity')
            .select('tradeactivity.*')
            .join('statusenum', 'statusenum.id', 'tradeactivity.statusID')
            .where({'tradeactivity.buyerID': buyerID, 'tradeactivity.propertyID': propertyID})
            .whereIn('statusenum.name', [TRANSACTION_STATUSES.LOCKED, TRANSACTION_STATUSES.CONFIRMED]);
}


async function removeTradeAttachment  (mediaId) {
    return knex('tradedocuments').where({ documentID: mediaId }).orWhere({mediaID: mediaId}).del()
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw 'Error occurred in removing document';
        })
}



module.exports.transactionListing = transactionListing;
module.exports.transactionDetail = transactionDetail;
module.exports.transactionAuthorization = transactionAuthorization;
module.exports.userTransactionConfirmation = userTransactionConfirmation;
module.exports.updateTransactionStatus = updateTransactionStatus;
module.exports.transactionAttachment = transactionAttachment;
module.exports.transactionReminder = transactionReminder;
module.exports.cnicMedia = cnicMedia;
module.exports.updateTransactionDocuments = updateTransactionDocuments;
module.exports.transactionAttachmentDel= transactionAttachmentDel;
module.exports.getConfirmedTranByUserAndProperty= getConfirmedTranByUserAndProperty;
module.exports.removeTradeAttachment = removeTradeAttachment;
module.exports.transactionListingCount = transactionListingCount;
