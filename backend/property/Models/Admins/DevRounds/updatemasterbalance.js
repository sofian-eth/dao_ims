
// const db = require('../../db');
// const blockchainutils = require('../../tempblockchain');
// const knex = db.knex;

// const updatemasterbalance = function(){
    
//     return blockchainutils.userbalance()
//         .then(function(result){
//             return knex('investor_portfoliobalance').update({balance:result}).where({investorid:53})

//         })
//         .then(function(result){
//             return result;
//         })
    
//         .catch(function(error){
//             console.log("Blockchain Utils error",error);
//             throw error;
//         })

// }

// module.exports={updatemasterbalance};