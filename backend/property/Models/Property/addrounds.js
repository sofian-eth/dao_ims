const db = require('../db.js');
const knex = db.knex;


const addrounds = function(data){

    
    return knex('developmentrounds').insert({roundName:data.name,startDate:data.starttime,endDate:data.endtime,funds:data.area,propertyID:1,statusID:9,lockFundsTx:data.txid,unlockFundsTx:'',marketPrice:data.marketprice,pricePerSqft:data.sqftprice})
        .then(function(result){
            return result;
        })
        .catch(function(error){
            throw error;
        })

}


module.exports={addrounds}