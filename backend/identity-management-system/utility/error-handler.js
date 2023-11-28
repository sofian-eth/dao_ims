class ErrorHandler extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}


const handleError = function (err, res) {
    const { statusCode, message } = err;
    res.status(statusCode).json({
        error: 'true',
        message: message
    });


}


module.exports = {
    ErrorHandler, handleError
}