
const sellOrderOperations = null; //require('../../../Models/Investor/Marketplace/orders');

const fetchOrders = function (req, res, next) {
    let err = {};
    return sellOrderOperations.myOrders(req.decoded.id)
        .then(function (result) {
            res.status(200).json({ error: false, message: "", data: result });

        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error occurred in fetching order history";
            err.stackTrace = error;
            next(err);

        })

}


const removeOrder = function (req, res,next) {
    let err = {};
    return sellOrderOperations.cancelOrders(req.body.orderID, req.decoded.id)
        .then(function (result) {
            res.status(200).json({ error: false, message: "Order removed", data: '' });

        })
        .catch(function (error) {
            err.statusCode = 400;
            err.message = "Error occurred in removing order";
            err.stackTrace = error;
            next(err);

        })

}

module.exports = { fetchOrders, removeOrder };