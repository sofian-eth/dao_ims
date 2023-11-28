

const db = require('../db');
const knex = db.knex;


const pricehistory = function(){


    return knex('propertypricehistory').select('propertyValue','createdAt').orderBy('createdAt','desc')
        .then(function(result){
            return result;
        })
        .catch(function(error){
            throw error;
        })
}



const updatepricehistory = function(request){
    return knex('propertypricehistory').insert({'propertyValue':request.price,propertyID:1})
        .then(function(result){
            return result;

        })
        .catch(function(error){
            throw error;
        })
}

module.exports={pricehistory,updatepricehistory};