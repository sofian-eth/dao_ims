
const discountdb = require('../../../Models/Property/discounts');

const discountprice = function (req, res, next) {
    let err = {};
    discountdb.getdiscountsdb()
        .then(function (result) {
            if (!result.length)
                throw 'Data not found';
 //           res.json(result[0].discounts);
            res.status(200).json({ error: false, message: '', data: result[0].discounts });
        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error occurred in fetching discount";
            err.stackTrace = error;
            next(err);
            //           res.status(400).json({ error: true, message: 'Error occurred' });
        });





};


module.exports = { discountprice };
