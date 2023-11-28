const { Op, QueryTypes } = require("sequelize");
const bcryptjs = require("bcryptjs");
const walletUtils = require("../../utility/wallet-address");
const membershipUtils = require("../../utility/membership-number");
const {
  validateAdminSignup,
  validateAdminRemove,
} = require("../../utility/validators");

const sharedService = require("../shared/common");
const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();
const {
  users,
  portfoliobalance,
  usersession,
  tradeactivity,
  accountactivity,
  usergoals,
  userInvestment,
  userInformations

} = require("../../models/index");
const baseResponseModel = require('../../dto/response-model');
const constantMessage = require('../../resources/constant');
const core = require('core');

async function addInvestor(req, res, next) {
  let email = null;
  let email_verified = false;
  let password_hash = null;
  let transaction;
  let testPhoneNumber = req.body.phoneNumber;
  let err = {};


  try {
    transaction = await sequelize.transaction();
    email = req.body.email;
    email_verified = true;
    let isEmailExisting = await users.findOne({
      where: { email: req.body.email },
    });
    if (isEmailExisting) {
      throw "This email is associated with another account";
    }

    let isPhoneExist = await users.findOne({
      where: { phoneNumber: req.body.phoneNumber },
    });
    if (isPhoneExist) {
      throw "This phone is associated with another account";
    }
    password_hash = await bcryptjs.hash(req.body.password, 12);

    const walletAddr = await walletUtils.walletAddress();
    const tronWalletAddr = await walletUtils.tronWalletAddressGenerator();
    const membershipID = await membershipUtils.membershipNumber("DAO");

    let newUser = await users.create(
      {
        email: email,
        password: password_hash,
        is_email_verified: email_verified,
        phoneNumber: req.body.phoneNumber,
        is_phonenumber_verified: true,
        source: "admin",
        walletAddress: walletAddr,
        membershipNumber: membershipID,
        roleID: 1,
        billingAddress: req.body.billingAddress,
        // shippingAddress: req.body.billingAddress,
        city: req.body.city,
        country: req.body.country,
        province: "",
        legalName: req.body.legalName,
        identityCardNumber: req.body.identityCardNumber,
        is_kyc_approved: true,
        isBasicInfoAvailable: true,
        tronAddress: tronWalletAddr,
        device_token: '',
        showIntro:true
      }, { transaction }
    );


    let message = "User with membership ID " + membershipID + " added";
    await sharedService.activityLogs(
      req,
      message,
      "investor-management",
      req.decoded.id
    );
    await transaction.commit();
    return res.status(200).json({ error: false, message: "user created" });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    err.statusCode = 400;
    err.message = error;
    err.stackTrace = error;

    next(err);
  }
}

async function updateUser(req, res, next) {
  let err = {};
  try {
    if (req.body.phoneNumber == "" || req.body.phoneNumber == null)
      req.body.phoneNumber = null;
    else {
      let number = phoneUtil.parseAndKeepRawInput(req.body.phoneNumber, "pk");
    }
    if (req.body.email == "" || req.body.email == null) req.body.email = null;


    let rawEmailQuery =
      "select * from users where email='" +
      req.body.email +
      "' AND id not in (" +
      req.body.userID +
      ")";
    let rawPhoneQuery =
      "select * from users where phoneNumber='" +
      req.body.phoneNumber +
      "' AND id not in (" +
      req.body.userID +
      ")";
    let isEmailBind = await sequelize.query(rawEmailQuery, {
      type: QueryTypes.SELECT,
    });
    if (isEmailBind.length)
      throw "This email is associated with another account";

    let isPhoneBind = await sequelize.query(rawPhoneQuery, {
      type: QueryTypes.SELECT,
    });
    if (isPhoneBind.length)
      throw "This phone is associated with another account";

    let updatePrimaryInformation = await users.update(
      {
        email: req.body.email,
        // is_email_verified: email_verified,
        phoneNumber: req.body.phoneNumber,
        billingAddress: req.body.billingAddress,
        city: req.body.city,
        country: req.body.country,
        legalName: req.body.legalName,
        identityCardNumber: req.body.identityCardNumber,
      },
      {
        where: {
          id: req.body.userID,
        },
      }
    );


    let userMembership = await users.findOne({
      where: { id: req.body.userID },
    });
    let message =
      "User with membership ID " +
      userMembership.dataValues.membershipNumber +
      " updated";
    await sharedService.activityLogs(
      req,
      message,
      "investor-management",
      req.decoded.id
    );
    return res.status(200).json({ error: false, message: "User updated" });
  } catch (error) {
    console.log(error);
    err.statusCode = 400;
    err.message = error;
    err.stackTrace = error;
    next(err);
  }
}

async function removeUser(req, res, next) {
  let err = {};
  let transaction;
  try {
    let userInformation = await users.findOne({
      where: { id: req.body.userID },
    });


    let userBalance = await portfoliobalance.findOne({
      where: {
        userID: req.body.userID
      }, raw: true
    });

    if (userBalance)
      throw 'User investments found in property', userBalance;


    transaction = await sequelize.transaction();

    await portfoliobalance.destroy(
      { where: { userID: req.body.userID } },
      { transaction }
    );

    await usersession.destroy(
      { where: { userID: req.body.userID } },
      { transaction }
    );
    await accountactivity.destroy(
      { where: { userID: req.body.userID } },
      { transaction }
    );
    await userInformations.destroy({ where: { userID: req.body.userID } }, { transaction });

    await usergoals.destroy({ where: { userID: req.body.userID } }, { transaction });
    await userInvestment.destroy({ where: { userID: req.body.userID } }, { transaction });

    await users.destroy({ where: { id: req.body.userID } }, { transaction });

    await transaction.commit();
    let message =
      "User with membership ID " +
      userInformation.dataValues.membershipNumber +
      " removed";
    await sharedService.activityLogs(
      req,
      message,
      "investor-management",
      req.decoded.id
    );
    return res.status(200).json({ error: false, message: "User removed" });
  } catch (error) {

    if (transaction) await transaction.rollback();
    err.statusCode = 400;
    err.message = "Error occurred in removing user";
    err.stackTrace = error;
    next(err);
  }
}


async function suspendUser(req,res,next){
  let response = new baseResponseModel();
  try {

    let userId = req.body.userID;
    let userUpdate = await users.update(
      {
        isSuspend: true,
      },
      {
        where: {
          id: userId,
        },
      }
    );

    response.message =constantMessage.ACCOUNT_SUSPENDED;
    

  
  }
  catch(error){
    response.exception = error;
    response.setError(constantMessage.ERROR_OCCURRED_IN_ACCOUNT_SUSPENSION);
  }finally{
    return res.status(200).json(response);
}

}


async function activateUser(req,res,next){
  let response = new baseResponseModel();
  try {

    let userId = req.body.userID;
    let userUpdate = await users.update(
      {
        isSuspend: false,
      },
      {
        where: {
          id: userId,
        },
      }
    );

    response.message =constantMessage.ACCOUNT_ACTIVATION;
    

  
  }
  catch(error){
    response.exception = error;
    response.setError(constantMessage.ERROR_OCCURRED_IN_ACCOUNT_ACTIVATION);
  }finally{
    return res.status(200).json(response);
}

}


async function userDetails(req,res,next){

  let resp = new core.responseObject();
  try {
  
    let result = await core.userDB.userDetails(req.body.userID);

    if (result.success) {
      resp.setSuccess('User Account fetched');
      resp.data = result.data;
      res.status(200).json(resp);
    } else {
      resp.setError(result.message.toString(), "ACCOUNTS_NOT_FETCHED")
      res.status(200).json(resp);
    }
  } catch (error) {
    
    resp.setError(error.toString(), "ACCOUNTS_NOT_FETCHED3")
    res.status(200).json(resp);
  }
 
}

// async function userDetails(req, res, next) {
//   let err = {};
//   let countryCode = "92";
//   let rawNumber = "";
//   let countryShortCode = "pk";
//   try {
//     let userPrimaryInformation = await users.findOne({
//       where: { id: req.body.userID },
//     });
//     // let userSecondaryInformation = await userInformations.findOne({
//     //   where: { userID: req.body.userID },
//     // });
//     if (userPrimaryInformation.dataValues.phoneNumber) {
//       let number = phoneUtil.parseAndKeepRawInput(
//         userPrimaryInformation.dataValues.phoneNumber,
//         "pk"
//       );
//       countryCode = number.getCountryCode();
//       rawNumber = number.getNationalNumber();
//       countryShortCode = phoneUtil.getRegionCodeForNumber(number);
//     }

//     let tradeActivities = await tradeactivity.findAndCountAll({
//       where: {
//         [Op.or]: [{ buyerID: req.body.userID }, { sellerID: req.body.userID }],
//       },
//       limit: 5,
//       offset: 0,
//     });
//     let jsonObject = {
//       biographic_information: {
//         firstName: userPrimaryInformation
//           ? userPrimaryInformation.dataValues.firstName
//           : "-",
//         lastName: userPrimaryInformation
//           ? userPrimaryInformation.dataValues.lastName
//           : "-",
//         legalName: userPrimaryInformation
//           ? userPrimaryInformation.dataValues.legalName
//           : "-",
//         billingAddress: userPrimaryInformation
//           ? userPrimaryInformation.dataValues.billingAddress
//           : "-",
//         country: userPrimaryInformation
//           ? userPrimaryInformation.dataValues.country
//           : "-",
//         city: userPrimaryInformation
//           ? userPrimaryInformation.dataValues.city
//           : "-",
//         identityCardNumber: userPrimaryInformation
//           ? userPrimaryInformation.dataValues.identityCardNumber
//           : "-",
//       },
//       dao_ims_information: {
//         email: userPrimaryInformation
//           ? userPrimaryInformation.dataValues.email
//           : "-",
//         phoneNumber: userPrimaryInformation
//           ? userPrimaryInformation.dataValues.phoneNumber
//           : "-",
//         account_creation_date: userPrimaryInformation.dataValues.createdAt,
//         membershipNumber: userPrimaryInformation.dataValues.membershipNumber,
//         is_email_verified: userPrimaryInformation.dataValues.is_email_verified,
//         is_phone_verified:
//           userPrimaryInformation.dataValues.is_phonenumber_verified,
//         walletAddress: userPrimaryInformation.dataValues.walletAddress,
//         countryCode: countryCode,
//         rawNumber: rawNumber,
//         countryShortCode: countryShortCode,
//         isSuspended: userPrimaryInformation.dataValues.isSuspend
//       },
//     };

//     return res.status(200).json({ error: true, message: "", data: jsonObject });
//   } catch (error) {
//     err.statusCode = 400;
//     err.message = "Error occurred in fetching user details";
//     err.stackTrace = error;
//     next(err);
//   }
// }

async function fetchInvestors(req, res, next) {
  let pageSize = parseInt(req.query.pageSize || 10);
  let pageNo = parseInt(req.query.pageNo || 0);
  let offset = parseInt(pageNo * pageSize);
  let err = {};
  try {
    let { count, rows } = await users.findAndCountAll({
      raw: true,
      where: { roleID: 1, isSuspend: false },
      attributes: [
        "id",
        "firstName",
        "middleName",
        "lastName",
        "legalName",
        "email",
        "phoneNumber",
        "createdAt",
        "membershipNumber",
        "isSuspend",
        "iskycApproved"
      ],
      offset: offset,
      limit: pageSize,
      order: [
        ['createdAt', 'DESC']
      ]
    });
    if (rows) {
      res.status(200).json({
        err: false,
        message: "",
        data: {
          totalRecords: count,
          Users: rows,
        },
      });
    }
  } catch (error) {
    err.statusCode = 400;
    err.message = "Error occurred in fetching investors";
    err.stackTrace = error;
    next(err);
  }
}



async function searchInvestor(req, res, next) {
  let err = {};
  let pageSize = parseInt(req.query.pageSize || 10);
  let pageNo = parseInt(req.query.pageNo || 0);
  let offset = parseInt(pageNo * pageSize);
  try {
    let query = req.query.id;
    let { count, rows } = await users.findAndCountAll({
      where: {
        [Op.or]: [{ email: { [Op.like]: '%' + query + '%' } }, { legalName: { [Op.like]: '%' + query + '%' } }, { phoneNumber: { [Op.like]: '%' + query + '%' } }, { membershipNumber: { [Op.like]: '%' + query + '%' } }],
        roleID:1,
        isSuspend: false
      }, attributes: ["id",
        "firstName",
        "middleName",
        "lastName",
        "legalName",
        "email",
        "phoneNumber",
        "createdAt",
        "membershipNumber",
        "isSuspend",
        "iskycApproved"
      ],
      offset: offset,
      limit: pageSize,
      order: [
        ['createdAt', 'DESC']
      ]
    });
    if (rows) {
      res.status(200).json({
        err: false,
        message: "",
        data: {
          totalRecords: count,
          Users: rows,
        },
      });
    }

  } catch (error) {
    err.statusCode = 400;
    err.message = "Error occurred in fetching investors";
    err.stackTrace = error;
    next(err);

  }
}

async function approveAccount(req, res, next) {
  let response = new baseResponseModel();
  try {
    console.log("req.params", req.params);
    let userId = req.params.id;
    let userUpdate = await users.update(
      {
        iskycApproved: true,
        kycApprovedAt: new Date()
      },
      {
        where: {
          id: userId,
        },
      }
    );

    response.message =constantMessage.ACCOUNT_APPROVED;
  }
  catch(error){
    response.exception = error;
    response.setError(constantMessage.ERROR_OCCURRED_in_ACCOUNT_APPROVAL);
  }finally{
    return res.status(200).json(response);
  }
}


module.exports.fetchInvestors = fetchInvestors;
module.exports.addInvestor = addInvestor;
module.exports.updateUser = updateUser;
module.exports.userDetails = userDetails;
module.exports.removeUser = removeUser;
module.exports.searchInvestor = searchInvestor;
module.exports.suspendUser = suspendUser;
module.exports.activateUser =activateUser;
module.exports.approveAccount = approveAccount;