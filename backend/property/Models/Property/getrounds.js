

const db = require('../db.js');
const knex = db.knex;




const getrounds = function (projectID) {
    let sqlQuery = `select d.id, s.name, d.roundName, d.roundDetails, d.startDate, d.endDate, d.funds, d.pricePerSqft, d.lockFundsTx, d.unlockFundsTx, d.discounts,JSON_UNQUOTE(p.config-> "$.blockchainConfiguration.network") as blockchainNetwork,JSON_UNQUOTE(p.config-> "$.blockchainConfiguration.mainNetExplorerUrl") as mainNetExplorerUrl,JSON_UNQUOTE(p.config-> "$.blockchainConfiguration.testNetExplorerUrl") as testNetExplorerUrl from developmentrounds as d inner join statusenum as s on d.statusID=s.id inner join property as p on d.propertyID=p.id where d.propertyID=?`;
  
    return knex.raw(sqlQuery,[projectID])
    // return knex('developmentrounds as d').where('d.propertyID','=',projectID)
    //     .join('statusenum as s', 'd.statusID', '=', 's.id')
    //     .join('property as p','d.propertyID','=','p.id')
    //     .select(`d.id, s.name, d.roundName, d.roundDetails, d.startDate, d.endDate, d.funds, d.pricePerSqft, d.lockFundsTx, d.unlockFundsTx, d.discounts,JSON_UNQUOTE(p.config-> "$.blockchainConfiguration.network") as blockchainNetwork`,`JSON_UNQUOTE(p.config-> "$.blockchainConfiguration.mainNetExplorerUrl") as mainNetExplorerUrl,JSON_UNQUOTE(p.config-> "$.blockchainConfiguration.testNetExplorerUrl") as testNetExplorerUrl `)
        .then(function (result) {
            console.log(result);

            return result[0];
        })
        .catch(function (error) {
            throw error;
        })
}

const singledevrounds = function (request) {
    return knex('developmentrounds as d')
    .where({ 'd.id': request.id })
    .join('statusenum as s','d.statusID','=','s.id')
    .select('d.id','d.roundName','d.roundDetails','d.startDate','d.endDate','d.funds','d.pricePerSqft','d.lockFundsTx','d.unlockFundsTx','d.discounts','d.createdAt','d.updatedAt','d.marketPrice','s.name')
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
}


async function roundDetail (request) {
    return knex('developmentrounds as d')
    .where({ 'd.id': request.id })
    .join('statusenum as s','d.statusID','=','s.id')
    .join('property as p','d.propertyID','p.id')
    .select('d.id','d.roundName','d.roundDetails','d.startDate','d.endDate','d.funds','d.pricePerSqft','d.lockFundsTx','d.unlockFundsTx','d.discounts','d.createdAt','d.updatedAt','d.marketPrice','s.name','d.propertyID','p.ownerID')
        .then(function (result) {
            if(result.length)
                return result[0];
            return;
        })
        .catch(function (error) {
            throw error;
        })
}


const getroundsforinvestor = function () {
    return knex('developmentrounds').select('roundName', 'startDate', 'endDate', 'funds', 'pricePerSqft')
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
}

const completedroundsdb = function () {
    return knex('developmentrounds').where({ statusID: 'Done' }).count('id as CNT')
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
}
const totalrounds = function (projectID) {
    return knex('developmentrounds').where({ propertyID: projectID }).count('id as CNT')
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
}

const activeRound = function () {
    return knex('statusenum').where({ name: 'Active' }).select('id')
        .then(function (result) {
            return knex('developmentrounds').where({ statusID: result[0].id }).select('roundName','pricePerSqft');
        })
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })
}

async function projectactiveRound(projectID){
    return knex('statusenum').where({ name: 'Active' }).select('id')
    .then(function (result) {
        return knex('developmentrounds').where({propertyID: projectID, statusID: result[0].id }).select('id','roundName','pricePerSqft');
    })
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

async function totalFundingRounds(projectID){
    return knex('propertystats').where({propertyID:projectID}).select('fundingRounds')
        .then(function(result){
            let response = result;
            if(result.length)
                response = result[0];
            return response;
        })
        .catch(function(error){
            throw error;
        })
}
async function getDiscount(projectID){
    return knex('propertystats').where({propertyID:projectID}).select('discount')
        .then(function(result){
            let response = result;
            if(result.length)
                response = result[0];
            return response;
        })
        .catch(function(error){
            throw error;
        })
}


async function completedRound(projectID){
    return knex('statusenum').where({ name: 'Done' }).select('id')
    .then(function (result) {
        return knex('developmentrounds').where({propertyID: projectID, statusID: result[0].id }).count('id as completedRound');
    })
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

async function roundAreaPurchase(projectID,roundID){
    return knex.raw(`select  sum(areaPledged) as areaLeft from tradeactivity where roundID = ? and propertyID=? and ( internalStatus='locked')`,[roundID,projectID])
    .then(function(result){
        if(result[0][0].areaLeft ==null){
            return 0;
        }else
        return result[0][0].areaLeft;

    });
    
}
async function getActiveRoundID(projectID){
    return knex.raw(`select id from developmentrounds where propertyID=? and statusID=8`,[projectID])
    .then(function(result){
        if(result[0][0].id ==null){
            return 0;
        }else
        return result[0][0].id;

    });
}

async function currentRoundCount(projectID,roundID){
    return knex.raw(`select count(id) as count from developmentrounds where propertyID=? and id<=?`,[projectID,roundID])
    .then(function(result){
        if(result[0][0].count ==null){
            return 0;
        }else
        return result[0][0].count;

    });
}

async function reserveArea(projectID,roundID){
    return knex.raw(`select  sum(areaPledged) as areaLeft from tradeactivity where roundID = ? and propertyID=? and  (internalStatus='approved' or internalStatus='locked')`,[roundID,projectID])
    .then(function(result){
        if(result[0][0].areaLeft ==null){
            return 0;
        }else
        return result[0][0].areaLeft;

    });
    
}

async function areaIOwn(projectID,userID){
    return knex.raw('SELECT * FROM portfoliobalance WHERE portfoliobalance.propertyID=? AND portfoliobalance.userID=? LIMIT 1;', [projectID, userID])
            .then(res => {
                console.log("resresresresresresresresresresresresresresres", res);
                if( res[0] && res[0].length > 0 ) {
                    return res[0][0].balance; 
                } else {
                    return 0;
                }
            });
}

async function activeRoundPricing(projectID,roundID) {

   
    return knex('statusenum').where({ name: 'Active' }).select('id')
        .then(function (result) {
                return knex('developmentrounds').modify(function(qb) {
                    if(!roundID ||roundID=='0'){
                        console.log(result[0].id);
                        qb.where('statusID',result[0].id).where('propertyID',projectID)
                    }
                    else {
                        qb.where('id',roundID).where('propertyID',projectID)
                    }
                   
                }).select(knex.raw('id,roundName,pricePerSqft,marketPrice,statusID,funds,endDate,startDate,pricePerSqft,marketPrice,displayStartDate,displayEndDate, (SELECT developmentrounds.marketPrice FROM developmentrounds WHERE developmentrounds.propertyID=? ORDER BY developmentrounds.roundNumber DESC LIMIT 1) as lastRoundMarketPrice',[projectID]));
        })
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


async function roundPrice(projectId,roundId) {
    
    return knex('developmentrounds').where({ propertyID: projectId, id: roundId }).select('id','roundName','pricePerSqft','marketPrice','funds','endDate','startDate')
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


async function roundDetails(projectID,roundID){
    //total funds
    //round info
    // round price
    // start date
    // end date
    // area pledge
    // area left

    
}

async function getRoundDetail(projectID){
    return knex.raw(`call sp_getRoundDetail(?)`,[projectID]);
}


async function finalRoundPrice(projectID){
    let response;
    return knex('developmentrounds')
            .where({propertyID:projectID})
            .orderBy('id','desc')
            .limit(1)
            .select('pricePerSqft','marketPrice')
            .then(function(result){
                if(result.length)
                    response = result[0];
                    return response;
            })
            .catch(function(error){
                throw error;
            })
}


async function fetchAllRoundsSP(projectId){
    let response;
  
   return new Promise((resolve,reject)=>{
        knex.raw('CALL `sp_get_round_stats`(?);',[projectId]).then(x=>{
            if(x.length>0&&x[0].length>0&&x[0][0].length>0){
                resolve({
                    success:true,
                    data:x[0][0]
                });
            }else{
                resolve({
                    success:false,
                    data:x
                });
            }
            
        }).catch(x=>{
            resolve({
                success:false,
                data:x
            });
        })
    })
}

async function fetchActiveRoundAreaInfo(projectId,roundId){
  
   return new Promise((resolve,reject)=>{
        knex.raw('CALL `sp_get_current_round_stats`(?);',[[projectId,roundId]]).then(x=>{
            if(x.length>0&&x[0].length>0&&x[0][0].length>0){
                resolve({
                    success:true,
                    data:x[0][0]
                });
            }else{
                resolve({
                    success:false,
                    data:x
                });
            }
            
        }).catch(x=>{
            resolve({
                success:false,
                data:x
            });
        })
    })
}
module.exports = { fetchActiveRoundAreaInfo,getrounds, singledevrounds, getroundsforinvestor, completedroundsdb, activeRound,totalFundingRounds,completedRound,activeRoundPricing,totalrounds,projectactiveRound ,roundDetails,roundPrice,finalRoundPrice,roundDetail,getRoundDetail,roundAreaPurchase,reserveArea,getActiveRoundID,currentRoundCount,getDiscount,fetchAllRoundsSP,areaIOwn};
