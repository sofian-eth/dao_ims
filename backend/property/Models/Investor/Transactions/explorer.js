const db = require('../../db.js');
const knex =  db.knex;





const explorer = function(){


    return knex('tradeactivity as a')
        .join('users as i','a.sellerID','i.id').join('users as b','a.buyerID','b.id')
        .select('i.walletAddress as from','b.walletAddress as to','a.updatedAt as Timestamp','areaPledged as Area')
        .then(function(result){
            return result;
        })
        .catch(function(error){
            throw error;
        })
}



module.exports={explorer};