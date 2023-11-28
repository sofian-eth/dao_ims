const db = require("../../db");
const knex = db.knex;

// const fetchtitle = function (formdata) {
//   return knex("users as i")
//     .join("portfoliobalance as ip", "i.id", "=", "ip.userID")
//     .where({ "i.membershipNumber": formdata.investor })
//     .orWhere({ "i.email": formdata.investor })
//     .orWhere({ "i.phoneNumber": formdata.investor })
//     .select("i.firstName", "i.lastName", "i.email", "ip.balance")
//     .then(function (result) {
//       return result;
//     })
//     .catch(function (error) {
//       throw error;
//     });
// };


async function userInformation(formData){
  let response;
  return knex('users')
  .where({ "membershipNumber": formData.investor })
  .orWhere({ "email": formData.investor })
  .orWhere({ "phoneNumber": formData.investor })
  .select("id","legalName", "email", "phoneNumber", "membershipNumber")
  .then(function(result){
    if(result.length)
    {
      response = result[0];
      return response;
    }
    else 
      throw 'Account not found';

  })
  .catch(function(error){
    throw error;
  })
    
}

module.exports = { userInformation };
