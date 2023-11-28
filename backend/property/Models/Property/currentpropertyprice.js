const db = require('../db');
const knex = db.knex;




const activepropertyprice = function(){

 
    return knex('propertypricehistory').where({propertyID:1}).select('propertyValue').orderBy('createdAt','desc').limit(1)
    .then(function(result){
        return result;
    })
    .catch(function(error){
        throw error;
    })


}





module.exports={activepropertyprice};