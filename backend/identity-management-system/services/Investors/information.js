
const { validateTwilio, validatePhone, validateCNIC, validateBillingInfo } = require("../../utility/validators");

const otpCode = require("../../utility/otpCode");
const { users, phonelookup, media, userAddressBook } = require('../../models/index');
const { Op, QueryTypes } = require("sequelize");

const baseResponseModel = require('../../dto/response-model');
const constantMessage = require('../../resources/constant');
const userResponseModel = require('../../dto/user-info-model');
const { response } = require("express");
const core = require('core');
const { sessionToken } = require("../../utility/jwt");
const { updateUserPhoneNumber } = require("../../utility/hubspot");
const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();
const PNF = require('google-libphonenumber').PhoneNumberFormat;
const hubSpotUtils = require('../../utility/hubspot');
async function phoneVerificationRequest(req, res, next) {
  let err = {};
  let response = new baseResponseModel();
  let isVerifyOnly = req.body.isVerifyOnly;
  try {

    
    // if (phoneUtil.isValidNumber(req.body.phoneNumber)){
    //   console.log("Valid number");
    // }

    // else {
    //   console.log("Invalid number");
    // }

    // if (user.isBasicInfoAvailable) {
    //   response.setError(constantMessage.COMPLETE_PROFILE_SETUP)
    //   return;
    // }
    // const { errors, isValid } = validateTwilio(req.body);
    // if (!isValid) {
    //   response.exception = errors;
    //   response.setError(constantMessage.INVALID_FORM_VALIDATION)
    //   return;
    // }
    const rawNumber = phoneUtil.parseAndKeepRawInput(req.body.phoneNumber, 'PK');
    console.log("Raw Number",rawNumber);
    let number = phoneUtil.format(rawNumber, PNF.INTERNATIONAL);
    req.body.phoneNumber = number.replace(/\s/g, "");
    
    // let user = await users.findOne({
    //   raw: true,
    //   where: {
    //     id: req.decoded.id,
    //   },
    // });

    let isMobileNumberExist = await users.findOne({
      where: { phoneNumber: req.body.phoneNumber, id: {[Op.ne]: req.decoded.id},roleID:1 },
    });
    if (isMobileNumberExist && (!isVerifyOnly)) {
      response.setError(constantMessage.PHONE_NO_INUSE)
      return;
    }
    let twilioResponse = await otpCode.sendSMS(req.body.phoneNumber);
    let phonelookupDetails = await phonelookup.create({
      phoneNumber: req.body.phoneNumber,
      smsID: twilioResponse.sid,
    });
    let userUpdated = await

      users.update(
        {
          // phoneNumber: null,
          // is_phonenumber_verified: 0,
          smsID: twilioResponse.sid,
        },
        {
          where: {
            id: req.decoded.id,
          },
        }
      );
    response.message = constantMessage.VERIFY_YOUR_PHONENO;

  } catch (error) {
    console.log(error);
    response.exception = error;
    response.setError(constantMessage.ERROR_PHONE_VERIFICATION);

  }

  finally {
    return res.status(200).json(response)
  }
}

async function updateLegalName(req, res, next) {
  let response = new baseResponseModel();
  await users.update(
    {
      legalName: req.body.legalName,
      identityCardNumber: req.body.cnic,
      isBasicInfoAvailable: true,
    },
    {
      where: {
        id: req.decoded.id,
      },
    }
  );
  let user = await users.findOne({where:{id:req.decoded.id}});
  userResponseModel.userInfoModal(user);
  console.log(userResponseModel);
  let token =await sessionToken(userResponseModel);
  response.data=token;
  response.message = constantMessage.USER_INFO_UPDATED;
  return res.status(200).json(response)
}
async function phoneVerification(req, res, next) {
  let err = {};
  let transaction;
  let response = new baseResponseModel();
  try {

    transaction = await sequelize.transaction();
    let userInformation = await users.findOne({
      where: { id: req.decoded.id },
      raw: true
    });

    const rawNumber = phoneUtil.parseAndKeepRawInput(req.body.phoneNumber, 'PK');
    console.log("Raw Number",rawNumber);
    let number = phoneUtil.format(rawNumber, PNF.INTERNATIONAL);
    req.body.phoneNumber = number.replace(/\s/g, "");

    let twilioResponse = await otpCode.codeVerification(
      req.body.phoneNumber,
      req.body.code
    );

    console.log("Twilio response",twilioResponse);

    if (!twilioResponse) {
      response.setError(constantMessage.OPT_INVALID)
      return;
    }

    let phonelookupDetails = await phonelookup.findOne({
      where: { smsID: twilioResponse.sid },
    });

    let user = await users.update(
      {
        is_phonenumber_verified: true,
        phoneNumber: phonelookupDetails.phoneNumber,
        isBasicInfoAvailable: true,
      },
      {
        where: {
          id: req.decoded.id,
        },
      },
      { transaction }
    );
    let leadType = '';
    if(userInformation.refferedBy && userInformation.refferedBy.toString() == '12018'){
      leadType = 'DAO100K';
    }else if(userInformation.refferedBy && userInformation.refferedBy.toString() == '12019'){
      leadType = 'QUBED2';
    }
    else if(userInformation.refferedBy && userInformation.refferedBy.toString() == '16477'){
      leadType = 'FB100K';
    }
    else if(userInformation.refferedBy && userInformation.refferedBy.toString() == '16478'){
      leadType = 'HS100K';
    }
    hubSpotUtils.updateUserPhoneNumber(userInformation.email,req.body.phoneNumber,userInformation.legalName,leadType);
    await transaction.commit();
      
    await updateUserPhoneNumber(userInformation.email,req.body.phoneNumber, userInformation.legalName);
      

    updateUserPhoneNumber(userInformation.email,req.body.phoneNumber,userInformation.legalName);

    response.message = constantMessage.USER_INFO_UPDATED;

  } catch (error) {
    console.log(error);
    if (transaction) await transaction.rollback();

    //response.exception = error;
    response.setError(constantMessage.OPT_INVALID);

  }

  finally {
    return res.status(200).json(response)
  }
}
async function billingInformation(req, res, next) {

  let response = new baseResponseModel();
  try {
    let userID = req.decoded.id;


    let userBillingInfo = await users.findOne(
      {
        raw: true,
        where: { id: userID },
        attributes: ['legalName', 'identityCardNumber', 'phoneNumber', 'billingAddress', 'shippingAddress', 'city', 'country', 'province', 'is_phonenumber_verified', 'is_email_verified', 'cnicFrontID', 'cnicBackID']
      }, {
      include: {
        model: media
      }
    });

    let _userAddressBook = await userAddressBook.findOne({
        raw: true,
        where: { userID: userID,isDeleted:0 }
      });
      let _address ="";
      if(_userAddressBook){
        if(_userAddressBook.addressLine1 || _userAddressBook.addressLine2){
          _address = (_userAddressBook?_userAddressBook.addressLine1:"") +', '+ (_userAddressBook?_userAddressBook.addressLine2:"");
        }
      }

    if (userBillingInfo) {

      let data = {};
      data.id =_userAddressBook ? _userAddressBook.id:0;
      data.legalName = userBillingInfo.legalName;
      data.identityCardNumber = userBillingInfo.identityCardNumber;
      data.phoneNumber = userBillingInfo.phoneNumber;
      // data.isPhoneVerified = userBillingInfo.is_phonenumber_verified;
      data.is_phonenumber_verified = userBillingInfo.is_phonenumber_verified;
      data.is_email_verified = userBillingInfo.is_email_verified;
      data.billingAddress = _address ? _address : '';
      data.addressLine1 = _userAddressBook ? _userAddressBook.addressLine1 : '';
      data.addressLine2 = _userAddressBook ? _userAddressBook.addressLine2 : '';
      data.shippingAddress = userBillingInfo.shippingAddress;
      data.city = _userAddressBook ? _userAddressBook.city : userBillingInfo.city?userBillingInfo.city:"";
      data.country = _userAddressBook ? _userAddressBook.country : userBillingInfo.country? userBillingInfo.country:"";
      data.province = userBillingInfo.province?userBillingInfo.province:"";

      if (userBillingInfo.cnicFrontID) {
        let cnicFrontMedia = await media.findOne({
          raw: true,
          where: { id: userBillingInfo.cnicFrontID },
          attributes: [['id', 'mediaID'], 'originalFileName', 'relativePath', ['size', 'documentSize']]
        });
        data.cnicFront = cnicFrontMedia;
        data.cnicFront.url = await core.fileuploader.getMedia(cnicFrontMedia.relativePath);
      }
      // originalFileName, documentType, mediaID, url, documentSize

      if (userBillingInfo.cnicBackID) {
        let cnicBackMedia = await media.findOne({
          raw: true,
          where: { id: userBillingInfo.cnicBackID },
          attributes: [['id', 'mediaID'], 'originalFileName', 'relativePath', ['size', 'documentSize']]
        });
        data.cnicBack = cnicBackMedia;
        data.cnicBack.url = await core.fileuploader.getMedia(cnicBackMedia.relativePath);
      }

      response = new userResponseModel.userInfoModal(data);
    } else {
      response.setError(constantMessage.ERROR_UPDATEING_INFO);
      return;
    }

  }
  catch (error) {
    console.log(error);
    response.exception = error;
    response.setError(constantMessage.ERROR_UPDATING_USER);

  } finally {
    return res.status(200).json(response)
  }

}
async function updateIdentityNumber(req, res, next) {

  let response = new baseResponseModel();
  try {
    let userID = req.decoded.id;

    // Form validation 

    const { errors, isValid } = validateCNIC(req.body);
    if (!isValid) {
      response.exception = errors;
      response.setError(constantMessage.ERROR_OCCURRED);
      return;
    }

    let identityCardNumber = req.body.identityCardNumber;

    let updateIdentityCard = await users.update({
      identityCardNumber: identityCardNumber
    },
      {
        where: { id: userID }
      })

    response.message = constantMessage.CNIC_UPDATE_SUCCESS;
  } catch (error) {
    response.exception = error;
    response.setError(constantMessage.ERROR_OCCURRED)
  }
  finally {
    return res.status(200).json(response);
  }
}


async function updateBillingInformation(req, res, next) {


  let response = new baseResponseModel();
  try {
    let userID = req.decoded.id;

    // Form validation //

    const { errors, isValid } = validateBillingInfo(req.body);
    if (!isValid) {
      response.exception = errors;
      response.setError(constantMessage.ERROR_OCCURRED);
      return;
    }


    let legalName = req.body.legalName;
    let city = req.body.city;
    let country = req.body.country;
    let billingAddress = req.body.billingAddress;
    let shippingAddress = req.body.shippingAddress;
    let updateBillingDetail = await users.update({
      legalName: legalName,
      city: city,
      country: country,
      billingAddress: billingAddress,
      shippingAddress: shippingAddress
    },
      {
        where: { id: userID }
      })

    response.message = constantMessage.BILLING_INFO_UPDATE_SUCCESS;

  } catch (error) {
    response.exception = error;
    response.setError(constantMessage.ERROR_OCCURRED)
  }
  finally {
    return res.status(200).json(response);
  }
}

async function saveKycInformation(req, res, next) {
  let response = new baseResponseModel();
  try {
    let frontCnicID = req.body.frontCnicID;
    let backCnicID = req.body.backCnicID;
    let userID = req.decoded.id;
    let userInfo = await users.update({
      cnicFrontID: frontCnicID,
      cnicBackID: backCnicID,
    },
      {
        where: { id: userID }
      })
    // if(userInfo){
    //   response.message = constantMessage.PROFILE_UPDATED
    // }

    response.message = constantMessage.PROFILE_UPDATED;


  } catch (error) {
    response.exception = error;
    response.setError(constantMessage.ERROR_OCCURRED)
  }
  finally {
    return res.status(200).json(response);
  }
}

async function updateNickname(req, res, next) {
  let response = new baseResponseModel();
  const { name=null } = req.body;
  if( !name ) {
    response.setError('name is required', 422);
    return res.status(422).json(response);
  }
  let userID = req.decoded.id;
  console.log("Nick Name",name);
  try {
    let userInfo = await users.update({
      nickName: name,
    },
    {
      where: { id: userID }
    });
    console.log("userInfo", userInfo);
    response.message = constantMessage.PROFILE_UPDATED;
    return res.status(200).json(response);
  } catch(e) {
    response.exception = e;
    response.setError(constantMessage.ERROR_OCCURRED);
    return res.status(500).json(response);
  }
}

module.exports.saveKycInformation = saveKycInformation;
module.exports.updateIdentityNumber = updateIdentityNumber;
module.exports.updateBillingInformation = updateBillingInformation;
module.exports.billingInformation = billingInformation;
module.exports.phoneVerification = phoneVerification;
module.exports.updateLegalName = updateLegalName;
module.exports.phoneVerificationRequest = phoneVerificationRequest;
module.exports.updateNickname = updateNickname;
