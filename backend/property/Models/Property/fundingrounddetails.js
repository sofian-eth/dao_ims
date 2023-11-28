
const db = require('../db');
const knex = db.knex;
const statusEnum = require('../../resources/statusEnum');

const fundingrounddetails = function (propertyid, devid) {

    return knex('developmentrounds as d').where({ 'd.propertyID': propertyid }).andWhere({ 'd.id': devid })
        .join('statusenum as st', 'd.statusID', '=', 'st.id')
        .select('d.id', 'd.startDate', 'd.endDate', 'd.roundName', 'd.roundDetails', 'd.funds', 'd.pricePerSqft', 'd.lockFundsTx', 'd.unlockFundsTx', 'd.discounts', 'd.createdAt', 'd.marketPrice', 'st.name as status')
        .then(function (result) {

            return result;
        })
        .catch(function (error) {
            throw error;
        })


}

const soldArea = function (projectID) {
    return knex.raw("select SUM(areaPledged) as SoldArea from tradeactivity as t inner join developmentrounds as d on t.roundID=d.id inner join statusenum as ts on t.status=ts.id inner join status as ds on d.statusID=ds.id where d.propertyID=" + projectID + " and ts.name='locked' ;")
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
};


async function pendingPledges (projectID,roundID,excludeTransacID=0) {
    return knex.raw(`select SUM(areaPledged) as pendingPledges from tradeactivity as t 
    inner join developmentrounds as d on t.roundID=d.id 
    inner join statusenum as ts on t.statusID=ts.id 
    inner join statusenum as ds on d.statusID=ds.id 
    where d.propertyID=? and t.internalstatus = 'verified' and t.id!=? and d.id=?`,[projectID,excludeTransacID,roundID])
        .then(function (result) {
            let response = result;
        if(result.length)
            response = result[0];
        return response;
        })
        .catch(function (error) {
            throw error;
        })
};


const activeRoundFunds = function (projectID) {
    return knex.raw("select d.funds from developmentrounds as d inner join statusenum as s on d.statusID=s.id where d.propertyID=" + projectID + " and s.name='Active'; ")
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
}



async function totalAllocatedArea (projectID,serviceAccountId) {
    let qs = null;
    if(serviceAccountId) {
        qs = "select SUM(areaPledged) as totalAllocatedArea from tradeactivity as t inner join developmentrounds as d on t.roundID=d.id inner join statusenum as ts on t.statusID=ts.id inner join statusenum as ds on d.statusID=ds.id where d.propertyID=" + projectID + " and ts.name='"+statusEnum.confirmed+"' and ds.name='"+statusEnum.active+"' and t.sellerID="+serviceAccountId+ ";";
    } else {
        qs = "select SUM(areaPledged) as totalAllocatedArea from tradeactivity as t inner join developmentrounds as d on t.roundID=d.id inner join statusenum as ts on t.statusID=ts.id inner join statusenum as ds on d.statusID=ds.id where d.propertyID=" + projectID + " and ts.name='"+statusEnum.confirmed+"' and ds.name='"+statusEnum.active+"';";
    }
    return knex.raw(qs)
        .then(function (result) {
            let response = result;
        if(result.length)
            response = result[0];
        return response;
        })
        .catch(function (error) {
            throw error;
        })
}


async function fundingRound(projectID){
    return knex('developmentrounds as d')
    .join('statusenum as s','d.statusID','=','s.id')
    .where({'d.propertyID':projectID})
    .select('d.id','d.roundName','d.displayStartDate as startDate','d.displayEndDate as endDate','d.funds','d.pricePerSqft','s.name as status' , 'marketPrice','pricePerSqft')
    .then(function(result){
       
            return result;

    })
    .catch(function(error){
        throw error;
    })
}


async function roundPledge(roundID){
    return knex.raw("select SUM(areaPledged) as totalAreaPledged from tradeactivity as t inner join developmentrounds as d on t.roundID=d.id inner join statusenum as ts on t.statusID=ts.id where t.roundID=" + roundID + " and ts.name='"+statusEnum.confirmed+"' ;")
    .then(function (result) {
        let response = result;
    if(result.length)
        response = result[0];
    return response;
    })
    .catch(function (error) {
        throw error;
    })
}



async function roundPendingPledge(projectID){
    return knex.raw("select SUM(areaPledged) as areaPledgeArea from tradeactivity as t inner join developmentrounds as d on t.roundID=d.id inner join statusenum as ts on t.statusID=ts.id inner join statusenum as ds on d.statusID=ds.id where d.propertyID=" + projectID + " and t.internalStatus='verified' and ds.name='"+statusEnum.active+"' ;")
        .then(function (result) {
            let response = result;
        if(result.length)
            response = result[0];
        return response;
        })
        .catch(function (error) {
            throw error;
        })
}


async function projectRoundPledge(roundID,projectID){
  
    return knex.raw("select SUM(areaPledged) as totalAreaPledged from tradeactivity as t inner join developmentrounds as d on t.roundID=d.id inner join statusenum as ts on t.statusID=ts.id where t.roundID=" + roundID + " and ts.name='"+statusEnum.confirmed+"' and t.propertyID="+projectID+ ";")
    .then(function (result) {
        let response = result;
    if(result.length)
        response = result[0];
    return response;
    })
    .catch(function (error) {
        throw error;
    })
}
module.exports = { fundingrounddetails, soldArea, pendingPledges, activeRoundFunds, totalAllocatedArea,fundingRound,roundPledge,projectRoundPledge,roundPendingPledge };