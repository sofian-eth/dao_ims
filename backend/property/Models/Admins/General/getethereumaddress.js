const db = require('../../db');
const knex = db.knex;

const getethereumaddress = function(emailaddress){

    return knex('users').where({email:emailaddress}).select('walletAddress')
        .then(function(result){
            if(!result.length)
                throw 'Not found';

            return result;    
        })
        .catch(function(error){
            throw error;s
        })


}


module.exports={getethereumaddress};