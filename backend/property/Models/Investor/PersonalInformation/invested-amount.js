const db = require('../../db');
const knex = db.knex;



const InvestedAmount = function(investorid){

    var amount_invested = 0;
    var amount_withdraw = 0;
    var net_amount ;
    var status_id;
    
    
    return knex('statusenum').where({name:'locked'}).select('id')
       .then(function(result){
           if(!result.length)
               throw 'Status id not found';
              
           status_id = result[0].id;
   
         return knex('tradeactivity').where({statusID:status_id}).andWhere({buyerID:investorid}).select('totalPrice');  
       })
       .then(function(result){
           var invested = result;
           invested.forEach(element => {
               amount_invested += element.totalPrice;
           });
   
           return knex('tradeactivity').where({statusID:status_id}).andWhere({sellerID:investorid}).select('totalPrice');  
       })
       .then(function(result){
           var withdraw = result;
           withdraw.forEach(element => {
               amount_withdraw += element.totalPrice;
           });
           net_amount = amount_invested - amount_withdraw;
   
           return net_amount;
       })
       .catch(function(error){
           throw error;
       })
   
   
   }
   


module.exports = {InvestedAmount};

