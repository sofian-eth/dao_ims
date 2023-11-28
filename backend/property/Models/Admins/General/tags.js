

const db = require('../../db');
const knex = db.knex;



const gettags = function(){

    return knex('tagenum').select('id as value','tagname as viewValue')
        .then(function(result){
            return result;
        })
        .catch(function(error){
            throw error;
        })
};


module.exports={gettags};