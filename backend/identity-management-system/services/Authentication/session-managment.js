
const { ErrorHandler } = require('../../utility/error-handler');
const {usersession} = require('../../models/index');

const baseResponseModel = require('../../dto/response-model');
const constantMessage = require('../../resources/constant');

async function createSession(sessionID, userID) {
    let err = {};
    let response = new baseResponseModel();
    try {
        await usersession.create({
            userID: userID,
            sessionKey: sessionID
        });

        return ;

    } catch (error) {
        throw error;

    }
    
}


async function revokeSession(req, res, next) {
    let err = {};
    let response = new baseResponseModel();
    try {
        await usersession.destroy({
            where: {
                sessionKey: req.body.refreshtoken
            }
        });
        response.message = constantMessage.LOGOUT_SUCCESS
    
        
        
    } catch (error) {
        response.exception = error;
        response.setError(constantMessage.ERROR_REVOKING_SESSION)
        
     
    }
    
    finally {
  return res.status(200).json(response)
    }
}


module.exports.createSession = createSession;
module.exports.revokeSession = revokeSession;