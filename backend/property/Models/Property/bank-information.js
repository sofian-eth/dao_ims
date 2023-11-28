
const db = require('../db.js');
const knex = db.knex;

async function bankInformation(projectID){

    return knex('bankinformationenum').where({propertyID: projectID}).select('id','bankName','accountTitle','accountNumber','IBAN','branch')
        .then(function(result){
            let response = result;
           
            return response;
        })
        .catch(function(error){
            throw error;
        })

}


async function bankInformationFromRound(roundID){

    return knex('developmentrounds as d')
            .join('bankinformationenum as b','d.propertyID','=','b.propertyID')
            .where('d.id',roundID)
            .select('b.id','b.bankName','b.accountTitle','b.accountNumber','b.IBAN','b.branch')
            .then(function(result){
                return result;
            })
            .catch(function(error){
                throw error;
            })


}
module.exports.bankInformation = bankInformation;
module.exports.bankInformationFromRound = bankInformationFromRound;