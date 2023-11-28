const db = require('../../db');
const knex = db.knex;



const EscrowBalance = function (investorid) {

  
    return knex('statusenum').where({ name: 'open' }).select('id')
        .then(function (result) {
            if (!result.length)
                throw 'Status ID not found';
            return knex('marketplaceorders').where({ sellerid: investorid, statusID: result[0].id }).select('areaUnits')
        })
        .then(function (result) {

            var escrowunits = 0;
            if (!result.length)
                return escrowunits;

            result.forEach(element => {

                escrowunits += element.areaUnits;
            });

            return escrowunits;
        })
        .catch(function (error) {
            throw 'Error occurred in sql query';
        });
};


module.exports = { EscrowBalance };
