const db = require('../db.js');
const knex = db.knex;


async function userbasicInfo(id){

   return knex('users')
          .where({id:id})
          .select('id','firstName','lastName','email','legalName')
          .then(function(result){
            let response = result;
        if(result.length)
            response = result[0];
        return response;
          })
          .catch(function(error){
              throw error;
          })
        }

module.exports.userbasicInfo = userbasicInfo;