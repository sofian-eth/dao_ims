// const db = require('../../db');
// const knex = db.knex;


// const getOrders = function () {


//     var status_id;
//     return knex('statuses').where({ statusname: 'open' }).select('id')
//         .then(function (result) {
//             status_id = result[0].id;
//             return knex('marketplaceorders as m')
//                 .where({ 'm.status': status_id })
//                 .join('investors as i', 'i.id', '=', 'm.sellerid')
//                 .select('m.areaunits', 'm.sqftprice', 'm.totalcost', 'm.created_at', 'i.email')
//         })
//         .then(function (result) {
//             console.log(result);
//             return result;
//         })
//         .catch(function (error) {
//             throw 'Error in sql query';
//         });


// };

// module.exports = { getOrders };