class ErrorHandler extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
        this.stackTrace = stackTrace;
    }
}


const handleError = function (err, res) {
    const { statusCode, message, stackTrace } = err;
    res.status(statusCode).json({
        error: 'true',
        message: message,
        stackTrace: stackTrace
    });
}


module.exports = {
    ErrorHandler, handleError
}