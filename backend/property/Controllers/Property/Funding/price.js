const pricedb = require('../../../Models/Property/pricedb');

const price = function (req, res, next) {
    let err = {};

    pricedb.pricedb()
        .then(function (result) {
            if (!result.length)
                throw 'Data not found';
       


            let response = {
                price: result[0].pricePerSqft,
                marketPrice: result[0].marketPrice
            }

            res.status(200).json({ error: false, message: true, data: response });
        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error occurred in fetching project price";
            err.stackTrace = error;
            next(err);
            //  res.status(400).json({ error: true, message: 'Error occurred in fetching price' });
        })


};


module.exports = { price };
