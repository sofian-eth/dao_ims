const otpUtils = require('../../utility/otpCode');
const jwtUtils = require('../../utility/jwt');
const sessionManagement = require('./session-managment');

const walletUtils = require('../../utility/wallet-address');
const membershipUtils = require('../../utility/membership-number');
const permissionService = require('../Roles-permissions/permissions');

const {users,userInformations,phonelookup,portfoliobalance} = require('../../models/index');

const baseResponseModel = require('../../dto/response-model');
const userResponseModel = require('../../dto/user-info-model');

const constantMessage = require('../../resources/constant');
const hubSpotUtils = require('../../utility/hubspot');
async function phoneVerification(req, res, next) {
    let err = {};
    let transaction;
    let response = new baseResponseModel();
    try {
        let twilioResponse = await otpUtils.codeVerification(req.body.phoneNumber, req.body.code);
        if (!twilioResponse)
        {
            response.setError(constantMessage.OPT_INVALID)
            return ;
        }   
        let userID = await users.findOne({ where: { phoneNumber: req.body.phoneNumber, is_phonenumber_verified: true } });

        if (userID) {
            hubSpotUtils.updateContact({name: userID.dataValues.legalName, email: userID.dataValues.email, phoneNumber: req.body.phoneNumber});
            delete userID.dataValues.password;
            delete userID.dataValues.smsID;
            delete userID.dataValues.googleID;
            delete userID.dataValues.facebookID;
            delete userID.dataValues.emailVerificationToken;
            delete userID.dataValues.passwordResetToken;
            delete userID.dataValues.updatedAt;

            let fetchPermissions = await permissionService.fetchPermissionByID(userID.dataValues.roleID);
            userID.dataValues.permissions = fetchPermissions;           
            var sessionTokens = await jwtUtils.sessionToken(userID.dataValues);
            await sessionManagement.createSession(sessionTokens.refreshToken, userID.dataValues.id);
            
            response.message = constantMessage.USER_VERIFIED;
            response.data = sessionTokens;
           

        }

        else {

            let phoneNumber = await phonelookup.findOne({ where: { smsID: twilioResponse.sid } });


            if (!phoneNumber){
               response.setError(constantMessage.ERROR_OCCURRED)                 
               return ; 
            }
            const walletAddr = await walletUtils.walletAddress();
            const membershipID = await membershipUtils.membershipNumber('DAO');
            transaction = await sequelize.transaction();
            let newUser = await users.create({
                phoneNumber: req.body.phoneNumber,
                is_email_verified: false,
                is_phonenumber_verified: true,
                source: req.body.source,
                roleID: 1,
                walletAddress: walletAddr,
                membershipNumber: membershipID,
                smsID: ''
            }, { transaction });

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

            let userInformation = await users.findOne({ where: { id: newUser.dataValues.id } });

            delete userInformation.dataValues.password;
            delete userInformation.dataValues.smsID;
            delete userInformation.dataValues.googleID;
            delete userInformation.dataValues.facebookID;
            delete userInformation.dataValues.emailVerificationToken;
            delete userInformation.dataValues.passwordResetToken;
            delete userInformation.dataValues.updatedAt;
            let fetchPermissions = await permissionService.fetchPermissionByID(userInformation.dataValues.roleID);
            userInformation.dataValues.permissions = fetchPermissions;           
            var sessionTokens = await jwtUtils.sessionToken(userInformation.dataValues);
            await sessionManagement.createSession(sessionTokens.refreshToken, userInformation.dataValues.id);
            
            response.message = constantMessage.USER_VERIFIED;
            response.data = sessionTokens

        }

    } catch (error) {
        if (transaction) await transaction.rollback();
        response.exception = error;
        response.setError(constantMessage.ERROR_PHONE_VERIFICATION)
 

    }
    finally {
    return res.status(200).json(response);
    }
}



module.exports.phoneVerification = phoneVerification;