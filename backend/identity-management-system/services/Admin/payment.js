const {paymentModeEnum} = require('../../models/index');



async function fetchPaymentMode(req, res,next) {
    let err = {};
    try {

        let paymentInformation = await paymentModeEnum.findAll();
        return res.status(200).json({ error: false, message: "", data: paymentInformation });
    } catch (error) {
       
        err.statusCode = 400;
        err.message = "Error occurred in fetching payment information";
        err.stackTrace = error;
        next(err);
    }
}

module.exports.fetchPaymentMode = fetchPaymentMode;