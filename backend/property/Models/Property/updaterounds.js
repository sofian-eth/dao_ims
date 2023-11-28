const db = require('../db.js');
const knex = db.knex;





// const updaterounds = function(devid,txid){


//     return knex('statusenum').where({name:'Active'}).select('id')
//         .then(function(result){
//             return knex('developmentrounds').where({statusID:result[0].id}).select('id');
//         })
//         .then(function(result){
//             if (result.length)
//                 return knex('developmentrounds').where({id:result[0].id}).update({statusID: 10});
    
//                 return result;
    
//         })
//         .then(function(result){
//             return knex('developmentrounds').where({id:devid}).update({unlockFundsTx:txid,statusID:8});
    
//         })
//         .then(function(result){
//             return result;
//         })
//         .catch(function(error){
//             throw error;
//         });

  
// }

async function updateRound(roundId,txId,propertyId,funds,ownerId){
    return knex('statusenum').where({name: 'Active'}).select('id')
        .then(function(result){
            console.log(propertyId);
            return knex('developmentrounds').where({statusID:result[0].id,propertyID:propertyId}).select('id');

        })
        .then(function(result){
            console.log(result);
            if(result.length)
                return knex('developmentrounds').where({id:result[0].id}).update({statusID:10});
            else 
            return result;

        })
        .then(function(result){
            return knex('developmentrounds').where({id:roundId}).update({unlockFundsTx:txId,statusID:8});
        })
        .then(function(result){
            return knex('portfoliobalance').where({propertyID:propertyId,userID: 2}).select('balance');
            
        })
        .then(function(result){
            let existingBalance = result[0].balance;
            console.log("Existing balance",existingBalance);
            let newBalance = existingBalance + funds;
            console.log("new Balance",newBalance);
            console.log("ownerID",ownerId);
            console.log("propertyId",propertyId);
            return knex('portfoliobalance').where({propertyID: propertyId,userID: 2}).update({balance: newBalance});
        })
        .then(function(result){
            return result;
        })
        .catch(function(error){
            console.log(error);
            throw error;
        })
}


module.exports={updateRound}