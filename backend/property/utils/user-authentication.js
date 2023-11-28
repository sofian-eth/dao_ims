const path = require('path');
const dotenv = require('dotenv');
var jwt = require('jsonwebtoken');
const ticketdetails = require('../Models/Investor/Transactions/ticketdetails');
const {ERROR_MESSAGES} = require('../resources/constants');
const authmodel = require('./../Models/Admins/Auth/checkpass.js');
dotenv.config();

function checkUserPermissions(requiredPermissions) {

    return function (req, res, next) {

        let token = req.headers['x-access-token'] || req.headers['authorization'] || req.headers['Authorization'];
        if (token) {

            let tokenDecoded = jwt.decode(token);
            // if( (!(tokenDecoded && tokenDecoded.iskycApproved)) && tokenDecoded.roleID===1 ) {
            //     return res.status(401).json({ error: true, message: 'Authorization failed', data: '' });
            // }

            jwt.verify(token, process.env.DAO_ACCESS_TOKEN_SECRET, (err, decoded) => {

                if (err) {
                    return res.status(401).json({ error: true, message: 'Authorization failed', data: '' });
                } else {
                    req.decoded = decoded;
                    let userPermissions = req.decoded.permissions;

                    if (!userPermissions.   includes(requiredPermissions)) {
                        return res.status(403).json({ error: true, message: ERROR_MESSAGES.INSUFFICIENT_ACCESS, data: '' });;
                    };

                    next();

                }

            });
        } else {
            return res.status(401).json({ error: true, message: 'Authorization failed', data: '' });
        }

    }

}

async function allowUpdateTransaction(req, res, next) {
    const transactionID = req.params.id;
    const transaction = await ticketdetails.transactionDetail(transactionID);
    if(transaction && transaction.buyerID==req.decoded.id) {
        next();
    } else {
        return res.status(401).json({ error: true, message: 'Authorization failed', data: '' });
    }
}

function basicAdminAuth(permission) {
    return async (req, res, next) => {

        // check for basic auth header
        if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
            res.status(401);
            res.setHeader('WWW-Authenticate', 'Basic');
            return res.json({ message: 'Missing Authorization Header' });
        }
    
        // verify auth credentials
        const base64Credentials =  req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');
        const user = await authmodel.checkUsernamePassword(username, password);
        if (!user) {
            res.status(401);
            res.setHeader('WWW-Authenticate', 'Basic');
            return res.json({ message: 'Invalid Authentication Credentials' });
        } else {
            let permissions= await authmodel.rolePermissions(user.roleID);
            if(Array.isArray(permissions) && permissions.includes(permission)) {
                next();
            } else {
                res.status(401);
                res.setHeader('WWW-Authenticate', 'Basic');
                return res.json({ message: 'Invalid Authentication Credentials' });
            }
            
        }
    };
}


module.exports = { checkUserPermissions, allowUpdateTransaction, basicAdminAuth };