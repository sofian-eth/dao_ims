const {
  validateChangeEmail,
  validateTwilio,
} = require("../../utility/validators");

const emailUtils = require("../../utility/email");
const randomString = require("randomstring");
const sessionManagement = require("../Authentication/session-managment");
const jwtUtils = require("../../utility/jwt");
const otpCode = require("../../utility/otpCode");
const permissionService = require("../Roles-permissions/permissions");
const userResponseModel = require('../../dto/user-info-model');
const userBankResponseModel = require('../../dto/user-bankinfo-model');
const userAddressBookResponseModel = require('../../dto/user-addressbook-model');
const userNextOfKinInformationModel = require('../../dto/user-nextofkin-model');
const userMediaInfoModal = require('../../dto/user-media-info-model');
const { users, phonelookup, userBankInformation, userAddressBook, userNextOfKin, media } = require("../../models/index");
const baseResponseModel = require('../../dto/response-model');
const constantMessage = require('../../resources/constant');
const core = require('core');
const { logActivity } = require('../Admin/activityLogger');
const ActionCategory = require('../../resources/enum-Action-Category');
const ActivityEvent = require('../../resources/enum-ActivityLog-event');
const { QueryTypes } = require("sequelize");
const { knex } = require("core/models/db");
// const { logActivity } = require('../shared/activity-logger.js');

async function changeEmail(req, res, next) {
  let err = {};
  let response = new baseResponseModel();
  try {
    const { errors, isValid } = validateChangeEmail(req.body);
    if (!isValid) {
      response.setError(constantMessage.INVALID_FORM_VALIDATION)
      return;

    }

    let customNormalizeEmail = req.body.email;
    req.body.email = customNormalizeEmail.toLowerCase();
    let normalizedEmail = req.body.email;
    if (normalizedEmail.endsWith("@daoproptech.com")) {
      response.setError(constantMessage.ERROR_SIGNUP_COM)

      return;
    }


    if (normalizedEmail.endsWith("@daocapital.org")) {
      response.setError(constantMessage.ERROR_SIGNUP_ORG)

      return;
    }

    let isEmailExist = await users.findOne({
      where: { email: normalizedEmail },
    });
    if (isEmailExist) {
      response.setError(constantMessage.EMAIL_ASSOCIATED_OTHER_ACCOUNT)

      return;
    }

    let userData = await users.findOne({ where: { id: req.decoded.id } });
    const verificationUrl = randomString.generate();
    if (userData.dataValues.email == normalizedEmail) {
      response.setError(constantMessage.EMAIL_DUPLICATE_ERROR)

      return;
    }

    let userUpdated = await users.update(
      {
        email: normalizedEmail,
        is_email_verified: 0,
        emailVerificationToken: verificationUrl,
      },
      {
        where: {
          id: req.decoded.id,
        },
      }
    );

    let updatedUserData = await users.findOne({
      where: { id: req.decoded.id },
    });

    emailUtils.verifyEmail(updatedUserData.dataValues);
    delete updatedUserData.dataValues.password;
    delete updatedUserData.dataValues.emailVerificationToken;
    delete updatedUserData.dataValues.passwordResetToken;
    delete updatedUserData.dataValues.updatedAt;
    delete updatedUserData.dataValues.smsID;
    let fetchPermissions = await permissionService.fetchPermissionByID(
      updatedUserData.dataValues.roleID
    );
    updatedUserData.dataValues.permissions = fetchPermissions;
    var sessionTokens = await jwtUtils.sessionToken(updatedUserData.dataValues);
    await sessionManagement.createSession(
      sessionTokens.refreshToken,
      updatedUserData.dataValues.id
    );
    response.message = constantMessage.EMAIL_ADDRESS_UPDATED;
    response.data = sessionTokens

  } catch (error) {
    response.exception = error;
    response.setError(constantMessage.ERROR_UPDATING_EMAIL)

  }
  finally {

    return res.status(200).json(response)
  }
}

async function changePhone(req, res, next) {
  let err = {};
  let response = new baseResponseModel();
  try {
    const { errors, isValid } = validateTwilio(req.body);
    if (!isValid) {
      {
        response.setError(constantMessage.INVALID_FORM_VALIDATION)

        return;
      }
    }

    let isMobileNumberExist = await users.findOne({
      where: { phoneNumber: req.body.phoneNumber },
    });
    if (
      isMobileNumberExist &&
      isMobileNumberExist.is_phonenumber_verified == true
    ) {
      response.setError(constantMessage.PHONE_NO_INUSE)

      return;
    }

    let twilioResponse = await otpCode.sendSMS(req.body.phoneNumber);
    let phonelookupDetails = await phonelookup.create({
      phoneNumber: req.body.phoneNumber,
      smsID: twilioResponse.sid,
    });
    let userUpdated = await users.update(
      {
        phoneNumber: "",
        is_phonenumber_verified: 0,
        smsID: twilioResponse.sid,
      },
      {
        where: {
          id: req.decoded.id,
        },
      }
    );

    response.message = constantMessage.VERIFY_YOUR_PHONENO

  } catch (error) {
    response.exception = error;
    response.setError(constantMessage.ERROR_UPDATING_PHONE)

  } finally {
    return res.status(200).json(response)

  }
}

async function phoneVerification(req, res, next) {
  let err = {};
  let response = new baseResponseModel();
  try {
    let twilioResponse = await otpCode.codeVerification(
      req.body.phoneNumber,
      req.body.code
    );
    if (!twilioResponse) {
      response.setError(constantMessage.OPT_INVALID)

      return;
    }

    let phonelookupDetails = await phonelookup.findOne({
      where: { smsID: twilioResponse.sid },
    });

    let userUpdated = await users.update(
      {
        smsID: "",
        is_phonenumber_verified: true,
        phoneNumber: phonelookupDetails.phoneNumber,
      },
      {
        where: {
          smsID: twilioResponse.sid,
          id: req.decoded.id,
        },
      }
    );
    let userData = await users.findOne({ where: { id: req.decoded.id } });

    delete userData.dataValues.password;
    delete userData.dataValues.emailVerificationToken;
    delete userData.dataValues.passwordResetToken;
    delete userData.dataValues.updatedAt;
    delete userData.dataValues.smsID;
    var sessionTokens = await jwtUtils.sessionToken(userData.dataValues);
    await sessionManagement.createSession(
      sessionTokens.refreshToken,
      userData.dataValues.id
    );
    response.message = constantMessage.USER_PHONE_UPDATED;
    response.data = { user: sessionTokens }

  } catch (error) {
    response.exception = error;
    response.setError(constantMessage.ERROR_PHONE_VERIFICATION);
  } finally {
    return res.status(200).json(response)

  }
}

//#region  Private functions
async function getUserInfo(userId, requireEmptyObject) {
  let userPrimaryInformation = await users.findOne({
    where: { id: userId },
  });

  if (requireEmptyObject) {
    let cnicFront = await getMediaObject(userId, 'u.cnicFrontID');
    let cnicBack = await getMediaObject(userId, 'u.cnicBackID');
    userPrimaryInformation["cnicFront"] = cnicFront ? new core.mediaResponse(cnicFront) : null;
    userPrimaryInformation["cnicBack"] = cnicBack ? new core.mediaResponse(cnicBack) : null;
    return new userResponseModel.userInfoModal(userPrimaryInformation);
  } else {
    return userPrimaryInformation;
  }
}
async function getMediaObject(userID, key) {

  return await knex('users as u')
    .select('m.originalFileName', 'd.name', 'd.bucketId',
      'm.id', 'm.relativePath', 'm.size')
    .join('media as m', key, '=', 'm.id')
    .join('documentenum as d', 'm.documentId', '=', 'd.id')
    .where({ 'u.id': userID })
    .first();

}
async function getUserBankInfo(userId, requireEmptyObject) {
  let userBanks = [];
  let query = `SELECT ubi.id, ifnull(nullif(ubi.bankName,''),b.name) bankName, ubi.accountTitle, ubi.userID, ubi.accountNumber, ubi.iban, ubi.branch,b.id as bankId, b.name,b.svg FROM userBankInformation ubi left join banks b on ubi.bankId = b.id where ifnull(deleted,0)=0 and userID=?`;
  const bankInformation = await core.db.sequelize.query(query, { replacements: [userId], type: QueryTypes.SELECT });
  // let bankInformation = await userBankInformation.findAll({
  //   where: { userID: userId, deleted:false },
  // });
  // console.log("banks:= ",bankInformation["userBankInformation"][]);
  // for (let i = 0; i < bankInformation.length; i++) {
  //   const el = bankInformation[i];
  //   if(el["bankId"]){
  //     const query = `select svg from banks where id = ${el["bankId"]}`;    
  //     const result = await core.db.sequelize.query(query,{type:QueryTypes.SELECT});
  //     el["svg"] = result[0]["svg"];
  //   }
  // }

  bankInformation.forEach(_bank => {
    userBanks.push(new userBankResponseModel.userBankInfoModal(_bank));
  });

  if (requireEmptyObject && bankInformation.length == 0) {
    userBanks.push(new userBankResponseModel.userBankInfoModal(null));
  }
  return userBanks;
}

async function getUserAddressBook(userId, requireEmptyObject) {
  let addressBook = [];

  let _addressBook = await userAddressBook.findAll({
    where: { userID: userId, isDeleted: false },
  });


  _addressBook.forEach(_address => {
    addressBook.push(new userAddressBookResponseModel.userAddressBookModal(_address));
  });

  if (requireEmptyObject && _addressBook.length == 0) {
    addressBook.push(new userAddressBookResponseModel.userAddressBookModal(null));
  }
  return addressBook;
}

async function getUsernextOfKinInformation(userId, requireEmptyObject) {
  let nextofkin = [];

  let _nextofkin = await userNextOfKin.findAll({
    where: { userID: userId, isDeleted: false },
  });


  _nextofkin.forEach(nextofkinobj => {
    nextofkin.push(new userNextOfKinInformationModel.userNextOfKinInformation(nextofkinobj));
  });
  for (let i = 0; i < nextofkin.length; i++) {
    const el = nextofkin[i];
    el.profile = await core.fileuploader.getMediaAsync(el.profile);
  }
  if (requireEmptyObject && _nextofkin.length == 0) {
    nextofkin.push(new userNextOfKinInformationModel.userNextOfKinInformation(null));
  }
  return nextofkin;
}

async function getUserProfilePicture(MediaId, requireEmptyObject) {

  let awsImageInfo;
  let userMediaInfo = MediaId && MediaId > 0 ? await media.findOne({
    where: { id: MediaId },
  }) : null;

  if (userMediaInfo) {
    awsImageInfo = await core.fileuploader.getMedia(userMediaInfo.relativePath)
  }

  if (requireEmptyObject) {

    return new userMediaInfoModal.userMediaInfoModal(userMediaInfo, awsImageInfo);
  } else {
    return userMediaInfo;
  }
}

async function prepareUserObject(userId, requireEmptyObject) {
  try {
    usr_data = await getUserInfo(userId, requireEmptyObject);
    let userData = {
      userInformation: usr_data,
      bankInformation: await getUserBankInfo(userId, requireEmptyObject),
      addressBook: await getUserAddressBook(userId, requireEmptyObject),
      nextOfKinInformation: await getUsernextOfKinInformation(userId, requireEmptyObject),
      profileImage: await getUserProfilePicture(usr_data.profilePicture, requireEmptyObject),
      transactionsProperties: (await getPropertiesInfo()).data
    };
    return userData;
  } catch (ex) {
    console.log(ex);
    return null;
  }

}


async function fetchBankInformation(req, res, next) {
  try {

    let bankInformation = await getUserBankInfo(req.decoded.id, requireEmptyObject);

  } catch (ex) {
    return null;
  }
}

//#endregion private function 

async function generalSetting(req, res, next) {
  let err = {};
  let response = new baseResponseModel();
  try {

    let userObj = await prepareUserObject(req.decoded.id, true);

    if (!userObj.userInformation || userObj.userInformation.id == 0) {
      response.setError(constantMessage.ERROR_FETCH_USER_DETAIL);
      return;
    }

    response.data = userObj;

  } catch (error) {
    console.log(error);
    response.exception = error;
    response.setError(constantMessage.ERROR_FETCH_USER_INFO);

  } finally {

    return res.status(200).json(response);

  }
}

async function saveAccountPersonalDetails(req, res, next) {
  let err = {};
  let response = new baseResponseModel();
  try {

    // let userPhoneNumber = await users.findOne({
    //   where: { phoneNumber: req.body.phoneNumber },
    //   raw: true
    // });
    // if (userPhoneNumber && userPhoneNumber.phoneNumber && userPhoneNumber.id !== req.decoded.id) {
    //   response.setError(constantMessage.PHONE_NO_INUSE, "PHONE_NO_INUSE");
    //   return;
    // }

    // let prevDetails=await users.findOne({
    //   where: {
    //     id: req.decoded.id
    //   }
    // });
    // prevDetails=prevDetails['_previousDataValues'];


    let updateUser = await users.update({
      dateOfBirth: req.body.dateOfBirth,
      gender: req.body.gender,
      identityCardNumber: req.body.identityCardNumber,
      legalName: req.body.legalName,
      ntn: req.body.ntn,
      nickName: req.body.nickName
    },

      {
        where: {
          id: req.decoded.id,
        },
      }
    );
    // let updatedDetails=await users.findOne({
    //   where: {
    //     id: req.decoded.id
    //   }
    // });
    // updatedDetails=updatedDetails['_previousDataValues'];
    // logActivity(
    // {
    //         logName: "User Settings",
    //         description: "Personal Information has been updated",
    //         subjectID: req.decoded.id,
    //         subjectType: "users",
    //         event: 'updated',
    //         causerID: req.decoded.id,
    //         causerType: "users",
    //         properties: {
    //             attributes: {
    //               dateOfBirth: req.body.dateOfBirth,
    //               gender: req.body.gender,
    //               identityCardNumber : req.body.identityCardNumber,
    //               legalName: req.body.legalName,
    //               ntn: req.body.ntn,
    //               nickName: req.body.nickName        
    //             },
    //             old: null
    //         },
    //         source: null,
    //     }
    //     ,req);

    //response.data = prepareUserObject(req.decoded.id, true);
    response.message = constantMessage.USER_INFO_UPDATED_SUCCESS;
    if (response.success) {
      logActivity(
        {
          logName: ActionCategory.SETTINGS,
          description: "Updated personal information of " + req.body.legalName,
          subjectID: parseInt(req.decoded.id),
          subjectType: "users",
          event: ActivityEvent.UPDATED,
          properties: {
            attributes: {
              dispID: parseInt(req.decoded.id),
              legalName: req.body.legalName,
              nickName: req.body.nickName,
              dateOfBirth: req.body.dateOfBirth,
              phoneNumber: req.body.phoneNumber,
              gender: req.body.gender,
            },
            old: {
              legalName: req.decoded.legalName,
              nickName: req.decoded.nickName,
              dateOfBirth: req.decoded.dateOfBirth,
              phoneNumber: req.decoded.phoneNumber,
              gender: req.decoded.gender,
            }
          },
          source: null,
          metadata: null
        }
        , req)
    }
  } catch (error) {
    console.log(error);
    response.exception = error;
    response.setError(constantMessage.ERROR_UPDATEING_INFO);
  }
  finally {
    return res.status(200).json(response)
  }
}

async function saveNotificationPreferences(req, res, next) {
  let err = {};
  let oldStatus;
  let response = new baseResponseModel();
  const { notificationType, status } = req.body;
  try {
    await users.update(
      {
        [notificationType]: (status ? 1 : 0)
      },
      {
        where: {
          id: req.decoded.id
        },
      }
    );
    oldStatus = !req.body.status
    if (response.success) {
      switch (req.body.status) {
        case (true): {
          logActivity(
            {
              logName: ActionCategory.SETTINGS,
              description: "Enabled " + (req.body.notificationType == "smsNotification" ? "SMS" : "push") + " notification of " + req.decoded.legalName,
              subjectID: parseInt(req.decoded.id),
              subjectType: "users",
              event: ActivityEvent.UPDATED,
              properties: {
                attributes: {
                  notification: req.body.notificationType,
                  status: "Enabled"
                },
                old: {
                  notification: req.body.notificationType,
                  status: "Disabled"
                },
              },
              source: null,
              metadata: null
            }
            , req)
          break;
        }
        case (false): {
          logActivity(
            {
              logName: ActionCategory.SETTINGS,
              description: "Disabled " + (req.body.notificationType == "smsNotification" ? "SMS" : "push") + " notification of " + req.decoded.legalName,
              subjectID: parseInt(req.decoded.id),
              subjectType: "users",
              event: ActivityEvent.UPDATED,
              properties: {
                attributes: {
                  notification: req.body.notificationType,
                  status: "Disabled"
                },
                old: {
                  notification: req.body.notificationType,
                  status: "Enabled"
                },
              },
              source: null,
              metadata: null
            }
            , req)
          break;
        }
      }
    }
    response.message = constantMessage.USER_INFO_UPDATED_SUCCESS;
  } catch (error) {
    response.exception = error;
    //console.log(error);
    response.setError(constantMessage.ERROR_UPDATEING_INFO);
  }
  finally {
    return res.status(200).json(response)
  }
}

async function saveAccountAddressBook(req, res, next) {
  let oldAddress;
  // let err = {};
  // let response = new baseResponseModel();
  // try {
  //   let saveUserAddress;
  //   if (req.body.id > 0) {
  //     saveUserAddress = await userAddressBook.update(
  //       req.body,
  //       {
  //         where: {
  //           id: req.body.id,
  //           userID: req.decoded.id,
  //         },
  //       }
  //     );
  //   } else {
  //     let data = req.body;
  //     data['userID'] = req.decoded.id;
  //     saveUserAddress = await userAddressBook.create(req.body);
  //   }

  //   response.message = constantMessage.USER_INFO_UPDATED_SUCCESS;
  // } catch (error) {
  //   response.exception = error;
  //   //console.log(error);
  //   response.setError(constantMessage.ERROR_UPDATEING_INFO);
  // }
  // finally {
  //   return res.status(200).json(response)
  // }

  let resp = new core.responseObject();
  try {
    req.body.userID = req.decoded && req.decoded.id ? req.decoded.id : 0;
    let area = req.body.areaDropDown;
    if (req.body.areaText)
      area = req.body.addressLine1 + " " + req.body.addressLine2;

    //req.body.addressLine1 = area;  
    console.log("Req.body", req.body);

    let _userAddressRequest = new core.RequestModels.userAddressRequest.userAddressBookModal(req.body);
    // let objectID = _userAddressRequest.id ? _userAddressRequest.id : null;
    // let prevAddress;
    // if(typeof(objectID) == 'number') {
    //   prevAddress=await userAddressBook.findOne({
    //     where: {
    //       id: objectID
    //     }
    //   });
    // }
    let userInfo = await core.userDB.getUserNameById(req.body.userID);
    if (req.body.updated) {
      oldAddress = await core.userDB.getUserOldAddress(req.body.id);
    }
    let result = await core.userDB.saveUserAddress(_userAddressRequest);
    if (result.success) {
      if (req.body.updated) {
        logActivity(
          {
            logName: ActionCategory.SETTINGS,
            description: "Updated residential Address info for " + userInfo[0].legalName,
            subjectID: parseInt(req.decoded.id),
            subjectType: "users",
            event: ActivityEvent.UPDATED,
            properties: {
              attributes: {
                city: _userAddressRequest.city,
                country: _userAddressRequest.country,
                userID: _userAddressRequest.userID,
                addressLine1: _userAddressRequest.addressLine1,
                addressLine2: _userAddressRequest.addressLine2,
              },
              old: {
                city: oldAddress[0].city,
                country: oldAddress[0].country,
                userID: oldAddress[0].userID,
                addressLine1: oldAddress[0].addressLine1,
                addressLine2: oldAddress[0].addressLine2,
              }
            },
            source: null,
            metadata: null
          }, req)
      } else {
        logActivity(
          {
            logName: ActionCategory.SETTINGS,
            description: "Added residential Address info for " + userInfo[0].legalName,
            subjectID: parseInt(req.decoded.id),
            subjectType: "users",
            event: ActivityEvent.ADDED,
            properties: {
              attributes: {
                city: _userAddressRequest.city,
                country: _userAddressRequest.country,
                userID: _userAddressRequest.userID,
                addressLine1: _userAddressRequest.addressLine1,
                addressLine2: _userAddressRequest.addressLine2,
              },
              old: null
            },
            source: null,
            metadata: null
          }, req)
      }

      resp.setSuccess(constantMessage.BANK_ACCOUNT_SAVED);
      resp.data = result.data[0];
      res.status(200).json(resp);
    } else {
      resp.setError(result.message.toString(), "BANK_ACCOUNT_NOT_SAVED")
      res.status(200).json(resp);
    }
  }
  catch (error) {
    resp.setError(error.message.toString(), "BANK_ACCOUNT_NOT_SAVED")
    res.status(200).json(resp);
  }
}

async function removeUserAddress(req, res, next) {
  let resp = new core.responseObject();
  try {
    req.body.userID = req.decoded && req.decoded.id ? req.decoded.id : 0;
    let _userAddressRequest = new core.RequestModels.userAddressRequest.userAddressBookModal(req.body);
    let userInfo = await core.userDB.getUserNameById(req.body.userID);
    let result = await core.userDB.removeUserAddress(_userAddressRequest);

    if (result.success) {
      resp.setSuccess(constantMessage.BANK_ACCOUNT_SAVED);
      resp.data = result.data[0];
      logActivity(
        {
          logName: ActionCategory.SETTINGS,
          description: "Deleted residential address info for " + userInfo[0].legalName,
          subjectID: parseInt(req.decoded.id),
          subjectType: "users",
          event: ActivityEvent.DELETED,
          properties: {
            attributes: null,
            old: null
          },
          source: null,
          metadata: null
        }, req)
      res.status(200).json(resp);
    } else {
      resp.setError(result.message.toString(), "USER_ADDRESS_NOT_REMOVED")
      res.status(200).json(resp);
    }
  } catch (error) {
    resp.setError(error.message.toString(), "USER_ADDRESS_NOT_REMOVED")
    res.status(200).json(resp);
  }
}

async function saveNextofKinInformation(req, res, next) {
  let err = {};
  let response = new baseResponseModel();
  try {
    let saveUserAddress;
    if (req.body.id > 0) {
      saveUserAddress = await userNextOfKin.update(
        req.body,
        {
          where: {
            id: req.body.id,
            userID: req.decoded.id,
          },
        }
      );
    } else {
      let data = req.body;
      data['userID'] = req.decoded.id;
      saveUserAddress = await userNextOfKin.create(data);
    }
    if (response.success) {
      logActivity(
        {
          logName: ActionCategory.SETTINGS,
          description: "Added next of kin information for " + req.decoded.legalName,
          subjectID: parseInt(req.decoded.id),
          subjectType: "users",
          event: ActivityEvent.ADDED,
          properties: {
            attributes: {
              fullName: req.body.fullName,
              email: req.body.email,
              cnic: req.body.cnic,
              address: req.body.address,
              phoneNumber: req.body.phoneNumber
            },
            old: null
          },
          source: null,
          metadata: null
        }, req)
    }
    response.message = constantMessage.USER_NEXTOFKIN_INFO_UPDATED_SUCCESS;
  } catch (error) {
    response.exception = error;
    response.setError(constantMessage.ERROR_UPDATEING_INFO);
  }
  finally {
    return res.status(200).json(response)
  }
}

async function updateGeneralSetting(req, res, next) {
  let err = {};
  let response = new baseResponseModel();
  try {
    let updateUser = await users.update(
      {
        billingAddress: req.body.billingAddress,
        city: req.body.city,
        country: req.body.country,
        province: "",
        legalName: req.body.legalName,
        nickName: req.body.nickName
      },
      {
        where: {
          id: req.decoded.id,
        },
      }
    );
    response.message = constantMessage.USER_INFO_UPDATED_SUCCESS;
  } catch (error) {
    response.exception = error;
    response.setError(constantMessage.ERROR_UPDATEING_INFO);
  }
  finally {
    return res.status(200).json(response)
  }
}

async function getUserInformation(req, res, next) {
  let err = {};
  let response = new baseResponseModel();
  try {
    let userPrimaryInformation = await users.findOne({
      where: { id: req.decoded.id },
    });
    let phoneNumber;
    if (userPrimaryInformation.dataValues.phoneNumber)
      phoneNumber = userPrimaryInformation.dataValues.phoneNumber;

    if (userPrimaryInformation.dataValues.smsID) {
      let phonelookupData = await phonelookup.findOne({
        where: { smsID: userPrimaryInformation.dataValues.smsID },
      });
      if (phonelookupData) phoneNumber = phonelookupData.dataValues.phoneNumber;
    }

    var userInformation = {
      email: userPrimaryInformation.dataValues.email,
      phoneNumber: phoneNumber,
      legalName: userPrimaryInformation.dataValues.legalName,
      billingAddress: userPrimaryInformation.dataValues.billingAddress,
      city: userPrimaryInformation.dataValues.city,
      country: userPrimaryInformation.dataValues.country,
      paymentMode: userPrimaryInformation.dataValues.paymentModeID,
      identityCardNumber: userPrimaryInformation.dataValues.identityCardNumber,
    };
    response.data = userInformation
  } catch (error) {
    response.exception = error;
    response.setError(constantMessage.ERROR_FETCH_USER_INFO);
  }
  finally {

    return res.status(200).json(response);
  }
}

async function updateUserInformation(req, res, next) {
  let err = {};
  let response = new baseResponseModel();
  try {

    var identityCard = req.body.identityCardNumber.toString();
    let updateUser = await users.update(
      {
        billingAddress: req.body.billingAddress,
        city: req.body.city,
        province: req.body.province,
        country: req.body.country,
        shippingAddress: req.body.billingAddress,
        paymentModeID: req.body.paymentMode,
        identityCardNumber: identityCard,
      },
      {
        where: {
          id: req.decoded.id,
        },
      }
    );

    response.message = constantMessage.USER_INFO_UPDATED_SUCCESS;
  } catch (error) {
    response.exception = error;
    response.setError(constantMessage.ERROR_UPDATEING_INFO);
  } finally {
    return res.status(200).json(response);

  }
}

async function resendEmailVerification(req, res, next) {
  let err = {};
  let response = new baseResponseModel();
  try {
    const verificationUrl = randomString.generate();
    const email = await users.findOne({ where: { id: req.decoded.id } });
    const userUpdate = await users.update(
      { emailVerificationToken: verificationUrl, is_email_verified: 0 },
      { where: { id: req.decoded.id } }
    );

    let updatedUserData = await users.findOne({
      where: { id: req.decoded.id },
    });
    emailUtils.verifyEmail(updatedUserData.dataValues);
    response.message = constantMessage.EMAIL_CONFIRMATION_SEND;
  } catch (error) {
    response.exception = error;
    response.setError(constantMessage.ERROR_SENDING_EMAIL);
  } finally {
    return res.status(200).json(response);
  }
}

async function getUserBankInformation(req, res, next) {
  let resp = new core.responseObject();
  try {
    id = req.decoded && req.decoded.id ? req.decoded.id : 0;
    let result = await core.userDB.getBankAccounts(id);

    if (result.success) {
      resp.setSuccess('Accounts fetched');
      resp.data = result.data;
      res.status(200).json(resp);
    } else {
      resp.setError(result.message.toString(), "ACCOUNTS_NOT_FETCHED1")
      res.status(200).json(resp);
    }
  } catch (error) {
    //response.exception = error;
    //response.setError(constantMessage.ERROR_FETCH_USER_INFO);
    resp.setError(error.toString(), "ACCOUNTS_NOT_FETCHED3")
    res.status(200).json(resp);
  }
}

async function saveAccountBankInformation(req, res, next) {
  let oldBank
  let resp = new core.responseObject();
  try {
    id = req.decoded && req.decoded.id ? req.decoded.id : 0;
    let _bankAccountrequest = new core.RequestModels.bankAccountRequest.createBankAccountRequest(req.body, id);
    if (_bankAccountrequest.id > 0) {
      oldBank = await core.userDB.getBankById(_bankAccountrequest.id);
    }

    let result = await core.userDB.saveBankAccount(_bankAccountrequest);

    let userInfo = await core.userDB.getUserNameById(id);
    if (result.success) {
      resp.setSuccess(constantMessage.BANK_ACCOUNT_SAVED);
      resp.data = result.data[0];
      if (_bankAccountrequest.id > 0 && !_bankAccountrequest.rentalUpdate) {
        logActivity(
          {
            logName: ActionCategory.SETTINGS,
            description: "Updated bank account details for " + userInfo[0].legalName,
            subjectID: parseInt(req.decoded.id),
            subjectType: "users",
            event: ActivityEvent.UPDATED,
            propertyID: _bankAccountrequest.propertyID,
            properties: {
              attributes: {
                accountNumber: _bankAccountrequest.accountNumber,
                accountTitle: _bankAccountrequest.accountTitle,
                bankId: oldBank[0].bankId,
                iban: _bankAccountrequest.iban,
                userId: _bankAccountrequest.userID
              },
              old: {
                accountNumber: oldBank[0].accountNumber,
                accountTitle: oldBank[0].accountTitle,
                bankId: oldBank[0].bankId,
                iban: oldBank[0].iban,
                userId: oldBank[0].userID
              },
            },
            source: null,
            metadata: null
          }, req)
      }
      else if (_bankAccountrequest.id > 0 && _bankAccountrequest.rentalUpdate) {
        logActivity(
          {
            logName: ActionCategory.RENTAL,
            description: "Updated bank account details for " + userInfo[0].legalName,
            subjectID: parseInt(req.decoded.id),
            subjectType: "users",
            event: ActivityEvent.UPDATED,
            propertyID: _bankAccountrequest.propertyID,
            properties: {
              attributes: {
                bankDetail:{
                number: _bankAccountrequest.accountNumber,
                title: _bankAccountrequest.accountTitle,
                id: oldBank[0].bankId,
                iban: _bankAccountrequest.iban,
                userId: _bankAccountrequest.userID}
              },
              old: {
                bankDetail:{
                  number: oldBank[0].accountNumber,
                  title: oldBank[0].accountTitle,
                  id: oldBank[0].bankId,
                  iban: oldBank[0].iban,
                  userId: oldBank[0].userID}
              },
            },
            source: null,
            metadata: null
          }, req)
      }
      else {
        logActivity(
          {
            logName: ActionCategory.SETTINGS,
            description: "Added bank Account details for " + userInfo[0].legalName,
            subjectID: parseInt(req.decoded.id),
            subjectType: "users",
            event: ActivityEvent.ADDED,
            propertyID: _bankAccountrequest.propertyID,
            properties: {
              attributes: {
                accountNumber: _bankAccountrequest.accountNumber,
                accountTitle: _bankAccountrequest.accountTitle,
                bankId: _bankAccountrequest.bankId,
                iban: _bankAccountrequest.iban,
                userId: _bankAccountrequest.userID
              },
              old: null
            },
            source: null,
            metadata: null
          }, req)
      }
      res.status(200).json(resp);
    } else {
      resp.setError(result.message.toString(), "BANK_ACCOUNT_NOT_SAVED")
      res.status(200).json(resp);
    }
  } catch (error) {
    resp.setError(error.message.toString(), "BANK_ACCOUNT_NOT_SAVED")
    res.status(200).json(resp);
  }
}

async function deleteAccountBank(req, res, next) {
  let resp = new core.responseObject();
  try {
    let userID = req.decoded && req.decoded.id ? req.decoded.id : 0;
    let bankAccountID = req.query.id ? req.query.id : 0;
    let result = await core.userDB.deleteBankAccount(bankAccountID, userID);
    let userInfo = await core.userDB.getUserNameById(userID);
    if (result.success) {
      resp.setSuccess(constantMessage.BANK_ACCOUNT_DELETED);
      resp.data = result.data;
      logActivity(
        {
          logName: ActionCategory.SETTINGS,
          description: "Deleted bank Account details for " + userInfo[0].legalName,
          subjectID: parseInt(req.decoded.id),
          subjectType: "users",
          event: ActivityEvent.DELETED,
          properties: {
            attributes: null,
            old: null
          },
          source: null,
          metadata: null
        }, req)
      res.status(200).json(resp);
    } else {
      resp.setError(result.message.toString(), "BANK_ACCOUNT_NOT_DELETED")
      res.status(200).json(resp);
    }
  } catch (error) {
    resp.setError(error.message.toString(), "BANK_ACCOUNT_NOT_DELETED")
    res.status(200).json(resp);
  }
}
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
async function deleteNextofKinInformation(req, res, next) {
  let resp = new core.responseObject();
  try {
    const id = req.params.id;
    saveUserAddress = await userNextOfKin.update(
      {
        isDeleted: true
      },
      {
        where: {
          id: id,
        },
      }
    );
  } catch (error) {
    resp.setError(error.message.toString(), "BANK_ACCOUNT_NOT_DELETED")
    res.status(200).json(resp);
  }
  if (resp.success) {
    logActivity(
      {
        logName: ActionCategory.SETTINGS,
        description: "Deleted next of kin information for " + req.decoded.legalName,
        subjectID: parseInt(req.decoded.id),
        subjectType: "users",
        event: ActivityEvent.DELETED,
        properties: {
          attributes: null,
          old: null
        },
        source: null,
        metadata: null
      }, req)
  }
  res.send(resp);
}




/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
async function updateLegalInfo(req, res, next) {
  let resp = new core.responseObject();
  try {

    const userId = id = req.decoded && req.decoded.id ? req.decoded.id : 0;
    const data = req.body;
    let oldResult = await core.userDB.getUserLegalInfo(userId);
    let userInfo = await core.userDB.getUserNameById(userId);

    if (userId > 0 && data.cnic && data.cnicFront && data.cnicBack) {
      data["userID"] = userId;
      let result = await core.userDB.updateLegalInfo(data);
      if (result.success) {
        logActivity(
          {
            logName: ActionCategory.SETTINGS,
            description: "Updated legal Information of " + userInfo[0].legalName,
            subjectID: parseInt(req.decoded.id),
            subjectType: "users",
            event: ActivityEvent.UPDATED,
            properties: {
              attributes: {
                cnic: data.cnic,
                fullName: userInfo[0].firstName + ' ' + userInfo[0].lastName,
                ntn: data.ntn,
              },
              old: {
                cnic: oldResult[0].identityCardNumber,
                fullName: userInfo[0].firstName + ' ' + userInfo[0].lastName,
                ntn: oldResult[0].ntn,
              }
            },
            source: null,
            metadata: null
          }, req)
      }
      resp.setSuccess("Updated successfully.");
    } else {
      resp.setError("User id not found.", "ERROR_USERID_NOT_FOUND");
    }

  } catch (error) {
    resp.setError(error.message.toString(), "BANK_ACCOUNT_NOT_DELETED")
  }
  res.send(resp);
}
/**
 * @returns {Promise<core.responseObject>}
 */
async function getPropertiesInfo() {
  let resp = new core.responseObject();
  try {
    let queryeth = `select id,name,coverPhoto,propertyLogo,propertySymbol from property where JSON_EXTRACT(config, "$.blockchainConfiguration.network") in ('eth','polygon');`;
    let querytrx = `select id,name,coverPhoto,propertyLogo,propertySymbol from property where JSON_EXTRACT(config, "$.blockchainConfiguration.network") ='trx';`;
    const ethProperties = await core.db.sequelize.query(queryeth, { type: QueryTypes.SELECT });
    const trxProperties = await core.db.sequelize.query(querytrx, { type: QueryTypes.SELECT });

    return { data: { eth: ethProperties, trx: trxProperties } };
    resp.setSuccess("")
  } catch (error) {
    resp.setError("", "");
  }
  return resp;
}



module.exports.changeEmail = changeEmail;
module.exports.changePhone = changePhone;
module.exports.phoneVerification = phoneVerification;
module.exports.generalSetting = generalSetting;
module.exports.updateGeneralSetting = updateGeneralSetting;
module.exports.getUserInformation = getUserInformation;
module.exports.updateUserInformation = updateUserInformation;
//module.exports.getNameInitials = getNameInitials;
module.exports.resendEmailVerification = resendEmailVerification;
module.exports.saveAccountPersonalDetails = saveAccountPersonalDetails;
module.exports.saveAccountAddressBook = saveAccountAddressBook;
module.exports.saveAccountBankInformation = saveAccountBankInformation;
module.exports.saveNextofKinInformation = saveNextofKinInformation;
module.exports.getUserProfilePicture = getUserProfilePicture;
module.exports.saveNotificationPreferences = saveNotificationPreferences;
module.exports.getUserBankInformation = getUserBankInformation;
module.exports.deleteAccountBank = deleteAccountBank;
module.exports.removeUserAddress = removeUserAddress;
module.exports.deleteNextofKinInformation = deleteNextofKinInformation;
module.exports.updateLegalInfo = updateLegalInfo;
