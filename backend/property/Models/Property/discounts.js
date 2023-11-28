const db = require('../db');
const knex = db.knex;




const getdiscountsdb = function(){

    return knex('statusenum').where({name:'Active'}).select('id')
        .then(function(result){
            return knex('developmentrounds').where({statusID:result[0].id}).select('discounts');
        })
        .then(function(result){
            return result;
        })
        .catch(function(error){
            throw error;
        })

  

}


module.exports = {getdiscountsdb};