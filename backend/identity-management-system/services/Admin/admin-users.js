const { Op, QueryTypes } = require("sequelize");
const bcryptjs = require('bcryptjs');
const walletUtils = require('../../utility/wallet-address');
const membershipUtils = require('../../utility/membership-number');
const { validateAdminSignup, validateAdminRemove } = require('../../utility/validators');
const sharedService = require('../shared/common');
const sequelize = require('../../utility/dbConnection');
const permissions = require('../../resources/permissions');


const {users,portfoliobalance,usersession,accountactivity} = require('../../models/index');

async function adminUsers(req, res, next) {
    let err = {};
    try {
        // let rawQuery ="";
        // rawQuery = "select u.id,u.firstName,u.lastName,u.email,u.createdAt,r.name as role from users as u inner join roles as r on u.roleID = r.id where r.name NOT LIKE 'INVESTOR';";
        // let QueryOutput = await sequelize.query(rawQuery, { type: QueryTypes.SELECT });
        // return res.status(200).json({ error: false, message: "", data: QueryOutput });

        let rawQuery ="";
        if(req.query.role == 'sales'){
            rawQuery = "select u.id,u.firstName,u.lastName,u.email,u.createdAt,r.name as role, p.name as permissionId from users as u \
            inner join roles as r on u.roleID = r.id \
            inner join rolePermissions as rp on u.roleID = rp.roleID \
            inner join permissions as p on rp.permissionID = p.id \
             where p.name='"+permissions.IS_USER_SALES_AGENT+"'";
        }
        else{
            rawQuery = "select u.id,u.firstName,u.lastName,u.email,u.createdAt,r.name as role from users as u inner join roles as r on u.roleID = r.id where r.name NOT LIKE 'INVESTOR';";
        }
        let QueryOutput = await sequelize.query(rawQuery, { type: QueryTypes.SELECT });
        return res.status(200).json({ error: false, message: "", data: QueryOutput });

    } catch (error) {
        err.statusCode = 400;
        err.message = "Error occurred in fetching admin user";
        err.stackTrace = error;
        next(err);
    }

}

async function addAdminUsers(req, res, next) {
    let err = {};
    let transaction;

    try {
        const { errors, isValid } = validateAdminSignup(req.body);
        if (!isValid) {

            throw errors;

        }


        const hashed = await bcryptjs.hash(req.body.password, 12);

        const walletAddr = await walletUtils.walletAddress();
        const tronWalletAddr = await walletUtils.tronWalletAddressGenerator();
        const membershipID = await membershipUtils.membershipNumber('DPT');

        let isEmailExisting = await users.findOne({ where: { email: req.body.email } });
        if (isEmailExisting) {
            throw 'This email is associated with another account';
        }

        transaction = await sequelize.transaction();
        let newUser = await users.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashed,
            is_email_verified: true,
            phoneNumber: null,
            is_phonenumber_verified: false,
            source: "api",
            walletAddress: walletAddr,
            membershipNumber: membershipID,
            roleID: req.body.roleID,
            is_kyc_approved: true,
            tronAddress :  tronWalletAddr
        }, { transaction });


      
      

        await transaction.commit();
        let message = 'Admin with email ' + req.body.email + ' added';
        await sharedService.activityLogs(req, message, 'admin-management', req.decoded.id);
        return res.status(200).json({ error: false, message: "admin user created" })

    } catch (error) {
        if (transaction) await transaction.rollback();
        err.statusCode = 400;
        err.message = "Error occurred in adding admin users";
        err.stackTrace = error;
        next(err);
    }
}



async function removeAdminUsers(req, res, next) {
    let err = {};
    let transaction;
    try {

        transaction = await sequelize.transaction();
        if (req.body.id == req.decoded.id)
            throw 'An admin can only remove other users';
        let userEmail = await users.findOne({ where: { id: req.body.id } });
        await portfoliobalance.destroy({ where: { userID: req.body.id } }, { transaction });
//        await userInformations.destroy({ where: { userID: req.body.id } }, { transaction });
        await usersession.destroy({ where: { userID: req.body.id } }, { transaction });
        await accountactivity.destroy({ where: { userID: req.body.id } }, { transaction });
        await users.destroy({ where: { id: req.body.id } }, { transaction });
        await transaction.commit();
        let message = 'User with email ' + userEmail.dataValues.email + ' removed';
        await sharedService.activityLogs(req, message, 'admin-management', req.decoded.id);
        return res.status(200).json({ error: false, message: "admin user removed" })
    } catch (error) {
        if (transaction) await transaction.rollback();
        err.statusCode = 400;
        err.message = "Error occurred in removing user";
        err.stackTrace = error;
        next(err);
    }
}


async function updateTeamMembers(req, res, next) {
    let err = {};
    let transaction;
    try {
        let rawEmailQuery = "select * from users where email='" + req.body.email + "' AND id not in (" + req.body.userID + ")";
        let isEmailBind = await sequelize.query(rawEmailQuery, { type: QueryTypes.SELECT });
        if (isEmailBind.length)
            throw "This email is associated with another account";

        let updatePrimaryInformation = await users.update(
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                roleID: req.body.roleID
            }, {
            where: {
                id: req.body.userID
            }
        });

        return res.status(200).json({ error: false, message: "Team member updated" })

    } catch (error) {
        console.log(error);
        err.statusCode = 400;
        err.message = "Error occurred in updating user";
        err.stackTrace = error;
        next(err);
    }
}

async function fetchTeamMemberDetails(req, res, next) {
    let err = {};
    try {
        let rawQuery = "select u.firstName,u.lastName,u.email,u.roleID, r.name as roleName from users as u inner join roles as r on u.roleID = r.id where u.id=" + req.query.userID + ";";
        let userData = await sequelize.query(rawQuery, { type: QueryTypes.SELECT });
        return res.status(200).json({ error: false, message: "", data: userData });
    } catch (error) {
      
        err.statusCode = 400;
        err.message = "Error occurred in fetching user";
        err.stackTrace = error;
        next(err);
    }
}

module.exports.adminUsers = adminUsers;
module.exports.addAdminUsers = addAdminUsers;
module.exports.removeAdminUsers = removeAdminUsers;
module.exports.updateTeamMembers = updateTeamMembers;
module.exports.fetchTeamMemberDetails = fetchTeamMemberDetails;