const listtransactions = require('../../../Models/Investor/Transactions/investortransactionhistory');

const transactions = function (req, res, next) {
    let err = {};
    var investorid = req.decoded.id;

    listtransactions.listtransactions(investorid)
        .then(function (result) {
            res.status(200).json({ error: false, message: '', data: result });
        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error occurred in fetching transactions";
            err.stackTrace = error;
            next(err);

        })




}


const searchtransactions = function (req, res, next) {
    let err = {};
    var order = req.query.order;
    var operations = req.query.operations;

    listtransactions.searchtransactions(req.decoded.id, order, operations)
        .then(function (result) {
            res.status(200).json({ error: false, message: '', data: result });
        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error occurred in operations";
            err.stackTrace = error;
            next(err);

        });



}

const salesTransaction = function (req, res,next) {
    let err = {};
    listtransactions.salesAgentTransaction(req.decoded.id)
        .then(function (result) {
            res.status(200).json({ error: false, message: '', data: result });
        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "No transactions found";
            err.stackTrace = error;
            next(err);
            // res.status(400).json({ error: true, message: 'No transactions found' });
        })
}

module.exports = { transactions, searchtransactions, salesTransaction };