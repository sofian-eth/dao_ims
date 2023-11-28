const db = require('../db.js');
const knex = db.knex;


async function propertyServiceAccount(projectID){

   return knex('property')
          .where({id:projectID})
          .select('ownerID')
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

module.exports.propertyServiceAccount = propertyServiceAccount;