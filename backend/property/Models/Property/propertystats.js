const db = require('../db');

const knex = db.knex;

async function totalInvestors (projectID){

    return knex('portfoliobalance')
    .count('propertyID', {as: 'investorCount'})
    .where({propertyID:projectID}).where('balance', '>', 0)
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

const updatepropertystats = function(req){

  return knex('propertystats').update({rentalyeild:req.rentalyeild,ror:req.ror,equitymultiple:req.equitymultiple,assetliquidation:req.assetliquidation,capitalgrowth:req.capitalgrowth,netrentalreturn:req.netrentalreturn,investmentperiod:req.investmentperiod,estimatedirr:req.estimatedirr,mininvestment:req.mininvestment,areasold:req.areasold}).where({propertyid:1})
    .then(function(result){
        return result;

    })
    .catch(function(error){
        throw error;
    })


}


const getpropertystats = function(projectID){
    return knex('propertystats').where({propertyID:projectID}).select('*')
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


async function propertyStats(projectID){
    let response;
    return knex('propertystats').where({propertyID:projectID}).select('*')
        .then(function(result){
            if(result.length){
                response = result[0];
                return response;
            }
                return response;
            
        })
        .catch(function(error){
            throw error;
        })
}


async function rateOfReturn(projectID){
    return knex('propertystats')
            .where({propertyID:projectID})
            .select('ROR')
            .then(function(result){
                return result;
            })
            .catch(function(error){
                throw error;
            });

}


async function areaPledged(projectId){
    let areaPledge =0;
    return knex('tradeactivity').sum('areaPledged as sum')
            .where({propertyID:projectId,statusID:2})
            .then(function(result){
                if(result.length) {
                    areaPledge = result[0].sum;
                    return areaPledge;
                }
                return areaPledge;
            })
            .catch(function(error){
                throw error;
            })
}


module.exports={updatepropertystats,getpropertystats,propertyStats,totalInvestors,rateOfReturn,areaPledged};