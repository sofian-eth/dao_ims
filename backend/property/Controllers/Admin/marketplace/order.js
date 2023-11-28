
const orderModels = require('../../../Models/Admins/marketplace/order');

const openorders = function (req, res) {
    orderModels.getOrders()
        .then(function (result) {
            res.json({
                status: "success",
                message: "",
                data: result
            });
        })
        .catch(function (error) {
            res.status(404)
                .send({
                    status: "fail",
                    message: "",
                    data: error
                });

        })
}


const approveBid = function (req, res) {

}

const rejectBid = function (req, res) {

}


const discardOrder = function (req, res) {

}

module.exports = { openorders, approveBid, rejectBid, discardOrder };