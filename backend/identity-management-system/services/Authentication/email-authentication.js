

const sessionManagement = require('./session-managment');
const jwtUtils = require('../../utility/jwt');
const bcryptjs = require('bcryptjs');
const randomString = require('randomstring');
const emailUtils = require('../../utility/email');
const walletUtils = require('../../utility/wallet-address');
const membershipUtils = require('../../utility/membership-number');
const hubSpotUtils = require('../../utility/hubspot');
const { ErrorHandler } = require('../../utility/error-handler');
const { validateEmailSignup, validateEmailLogin } = require('../../utility/validators');
const sharedService = require('../shared/common');
const { Op, QueryTypes } = require("sequelize");
const passwordComparisonUtility = require('../../utility/passwordComparison');
const permissionService = require('../Roles-permissions/permissions');
const baseResponseModel = require('../../dto/response-model');


const {users,userInformations,portfoliobalance} = require('../../models/index');
async function signupEmail(req, res, next) {
    let err = {};
    let transaction;
    try {
        const { errors, isValid } = validateEmailSignup(req.body);
        if (!isValid) {

            throw errors;

        }

        let customNormalizeEmail = req.body.email;
        req.body.email = customNormalizeEmail.toLowerCase();
        let normalizedEmail = req.body.email;
        if (normalizedEmail.endsWith("@daoproptech.com"))
            throw 'User can not signup from @daoproptech.com address';

        if (normalizedEmail.endsWith("@daocapital.org"))
            throw 'User can not signup from @daocapital.org address';

        const hashed = await bcryptjs.hash(req.body.password, 12);
        const verificationUrl = randomString.generate();
        const walletAddr = await walletUtils.walletAddress();
        const membershipID = await membershipUtils.membershipNumber('DAO');

      
        let isEmailExisting = await users.findOne({ where: { email: req.body.email } });
        if (isEmailExisting) {
            throw 'This email is associated with another account';
        }
       
        transaction = await sequelize.transaction();
        let newUser = await users.create({
            firstName: req.body.firstname,
            middleName: req.body.middlename,
            lastName: req.body.lastname,
            email: req.body.email,
            password: hashed,
            is_email_verified: false,
            is_phonenumber_verified: false,
            emailVerificationToken: verificationUrl,
            source: req.body.source,
            walletAddress: walletAddr,
            membershipNumber: membershipID,
            roleID: 1
        }, { transaction });

        //           hubSpotUtils.createContact(req.body);

        await userInformations.create({
            userID: newUser.dataValues.id,
            is_kyc_approved: false
        }, { transaction });

        await portfoliobalance.create({
            userID: newUser.dataValues.id,
            propertyID: 1,
            balance: 0
        }, { transaction });

        await transaction.commit();
        emailUtils.verifyEmail(newUser.dataValues);
        delete newUser.dataValues.password;
        delete newUser.dataValues.emailVerificationToken;
        delete newUser.dataValues.passwordResetToken;
        delete newUser.dataValues.updatedAt;
        delete newUser.dataValues.smsID;
        let fetchPermissions = await permissionService.fetchPermissionByID(1);
        newUser.dataValues.permissions = fetchPermissions;

        var sessionTokens = await jwtUtils.sessionToken(newUser.dataValues);
        await sessionManagement.createSession(sessionTokens.refreshToken, newUser.dataValues.id);
        let message = 'User have created account via email';
        await sharedService.activityLogs(req, message, 'Signup', newUser.dataValues.id);
        return res.status(200).json({ error: false, message: "user created", message: '', user: sessionTokens })


    }

    catch (error) {
        if (transaction) await transaction.rollback();
        err.statusCode = 400;
        err.message = 'Error occurred in user signup';
        err.stackTrace = error;
        next(err);
    }


}


async function loginEmail(req, res, next) {

    let err = {};

    try {
        const { errors, isValid } = validateEmailLogin(req.body);
        if (!isValid) {
            throw errors;

        }
        let user = await users.findOne({
            where: {
                email: req.body.email
            }
        });
        
        if (!user) {
            throw 'Incorrect email or password';
        }

        if (!user.dataValues.password) {
            throw 'Incorrect email or password';
        }
        let matchPwd = await passwordComparisonUtility.comparePwd(req.body.password, user.dataValues.password);

        if (matchPwd == false)
            throw 'Incorrect email or password';
        delete user.dataValues.password;
        delete user.dataValues.emailVerificationToken;
        delete user.dataValues.passwordResetToken;
        delete user.dataValues.updatedAt;
        delete user.dataValues.smsID;
        
        let fetchPermissions = await permissionService.fetchPermissionByID(user.dataValues.roleID);
        user.dataValues.permissions = fetchPermissions;
        var sessionTokens = await jwtUtils.sessionToken(user.dataValues);
        await sessionManagement.createSession(sessionTokens.refreshToken, user.dataValues.id);
        let message = 'User have logged in';
        await sharedService.activityLogs(req, message, 'Login', user.dataValues.id);
        
        let error = new baseResponseModel.responseModel({data:sessionTokens});
        return res.status(200).send(error);
        // return res.status(200).send({ error: false, message: '', data: sessionTokens });        

    } catch (error) {
        console.log("Login error",error);
        err.statusCode = 400;
        err.message = "Error occurred in user sign-in";
        err.stackTrace = error;
        next(err);

    }


}

async function emailVerification(req, res, next) {
    let verificationToken = req.body.token;
    let err = {};


    try {

        let userDetails = await await users.findOne({ where: { emailVerificationToken: verificationToken } });


        let user = await users.update({ is_email_verified: 1, emailVerificationToken: '' }, {
            where: {
                emailVerificationToken: verificationToken
            }
        });

        let updatedUser = await users.findOne({ where: { id: userDetails.dataValues.id } });

        delete updatedUser.dataValues.password;
        delete updatedUser.dataValues.emailVerificationToken;
        delete updatedUser.dataValues.passwordResetToken;
        delete updatedUser.dataValues.updatedAt;
        delete updatedUser.dataValues.smsID;
        let fetchPermissions = await permissionService.fetchPermissionByID(updatedUser.dataValues.roleID);
        updatedUser.dataValues.permissions = fetchPermissions;        
        var sessionTokens = await jwtUtils.sessionToken(updatedUser.dataValues);
        await sessionManagement.createSession(sessionTokens.refreshToken, updatedUser.dataValues.id);
        return res.status(200).send({ error: false, message: '', data: sessionTokens });

    } catch (error) {
        err.statusCode = 400;
        err.message = "Error occurred in verifying email address";
        err.stackTrace = error;
        next(err);
    }
}




async function loginEmailTest(req, res, next) {

    let err = {};

    try {
        const { errors, isValid } = validateEmailLogin(req.body);
        if (!isValid) {
            throw errors;

        }
        let user = await users.findOne({
            where: {
                email: req.body.email
            }
        });


        if (!user) {
            throw 'Incorrect email or password';
        }

        if (!user.dataValues.password) {
            throw 'Incorrect email or password';
        }
        let matchPwd = await passwordComparisonUtility.comparePwd(req.body.password, user.dataValues.password);

        if (matchPwd == false)
            throw 'Incorrect email or password';
        delete user.dataValues.password;
        delete user.dataValues.emailVerificationToken;
        delete user.dataValues.passwordResetToken;
        delete user.dataValues.updatedAt;
        delete user.dataValues.smsID;

        let fetchPermissions = await permissionService.fetchPermissionByID(user.dataValues.roleID);
        user.dataValues.permissions = fetchPermissions;
        var sessionTokens = await jwtUtils.sessionToken(user.dataValues);
        await sessionManagement.createSession(sessionTokens.refreshToken, user.dataValues.id);
        let message = 'User have logged in';
        await sharedService.activityLogs(req, message, 'Login', user.dataValues.id);
        return res.status(200).send({ error: false, message: '', data: sessionTokens });


    } catch (error) {
        console.log(error);
        err.statusCode = 400;
        err.message = "Error occurred in user sign-in";
        err.stackTrace = error;
        next(err);

    }


}



module.exports.signupEmail = signupEmail;
module.exports.loginEmail = loginEmail;
module.exports.emailVerification = emailVerification;
module.exports.loginEmailTest = loginEmailTest;