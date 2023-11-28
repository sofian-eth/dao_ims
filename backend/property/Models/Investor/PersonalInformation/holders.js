
const db = require('../../db.js');
const knex = db.knex;

async function areaHolders(pageNo,recordSize){
    let totalRecords;
    let response ={};
    return knex('portfoliobalance')
           .count('*',{as:'totalRecords'})
           .then(function(result){
            totalRecords = result[0].totalRecords;
return knex('portfoliobalance')
            .join('users','users.id','=','portfoliobalance.userID')
            .join('property','property.id','=','portfoliobalance.propertyID')
            .select('users.membershipNumber','users.email','property.name','portfoliobalance.balance','portfoliobalance.netInvestment')
            .limit(recordSize)
            .offset(pageNo);
           })

            .then(function(result){
                response.totalRecords = totalRecords;
                response.data = result;
                return response;
            })
            .catch(function(error){
                throw error;
            })

}


async function totalInvestors(projectID){
    let totalInvestors = 0;

    return knex('portfoliobalance')
            .count('* as totalInvestors')
            .where({propertyID:projectID})
            .then(function(result){
                if(result.length)
                    totalInvestors = result[0].totalInvestors;
                return totalInvestors;
            })
            .catch(function(error){
                throw error;
            })


}

module.exports.areaHolders = areaHolders;
module.exports.totalInvestors =totalInvestors;