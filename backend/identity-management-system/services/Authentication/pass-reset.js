// const userModel = require('../../models/Users');
const randomString = require("randomstring");
const bcryptjs = require("bcryptjs");
const emailUtils = require("../../utility/email");
const sharedService = require("../shared/common");
const { validateChangePassword,validateUpdatePassword } = require("../../utility/validators");
const passwordComparisonUtility = require("../../utility/passwordComparison");
const { users } = require("../../models/index");
const { logActivity } = require('../Admin/activityLogger');
const ActionCategory = require('../../resources/enum-Action-Category');
const ActivityEvent = require('../../resources/enum-ActivityLog-event');

const baseResponseModel = require('../../dto/response-model');
const constantMessage = require('../../resources/constant');


async function pwdResetRequest(req, res, next) {
  const resetUrl = randomString.generate();
  let err = {};

  let response = new baseResponseModel();
  try {
    let customNormalizeEmail = req.body.email;
    req.body.email = customNormalizeEmail.toLowerCase();
    let isEmailExisting = await users.findOne({
      where: { email: req.body.email },
    });
    if (!isEmailExisting) {
      response.setError(constantMessage.ERROR_PASS_CHANGE_REQUEST);
      return;
    }

    let userUpdated = await users.update(
      { passwordResetToken: resetUrl },
      {
        where: {
          email: req.body.email,
        },
      }
    );

    let emailResult = await emailUtils.forgotEmail(
      isEmailExisting.dataValues.legalName,
      resetUrl,
      isEmailExisting.dataValues
    );

    sharedService.activityLogs(
      req,
      "attempted for password reset via forgot password page",
      "Password Reset",
      isEmailExisting.dataValues.id
    );
    response.message =constantMessage.REQ_SENT_TO_EMAIL
 
  } catch (error) {

    response.exception = error;
    response.setError(constantMessage.ERROR_PASS_RESET);
    
  }
  finally {
  return res.status(200).json(response);
  }
}

async function resetPassword(req, res) {
  let err = {};
  let response = new baseResponseModel();
  try {
    let isResetCodeExist = await users.findOne({
      where: { passwordResetToken: req.body.token },
    });
    if (!isResetCodeExist) {

    response.setError(constantMessage.TOKEN_EXPIRED)
      return ;
    }

    const hashed = await bcryptjs.hash(req.body.password, 12);
    let updatedUser = await users.update(
      { password: hashed, passwordResetToken: "",is_email_verified: true
     },
      {
        where: {
          passwordResetToken: req.body.token,
        },
      }
    );

    await sharedService.activityLogs(
      req,
      "Password changed",
      "Password Reset",
      isResetCodeExist.dataValues.id
    );
response.message = constantMessage.PASS_CHANGED
  } catch (error) {
    response.exception = error;
    response.setError(constantMessage.ERROR_PASS_RESET);

  }
  finally {
 return res.status(200).json(response)
  }
}

async function changeUserPassword(req, res, next) {
  let err = {};
  let response = new baseResponseModel();
  try {
    const { errors, isValid } = validateChangePassword(req.body);
    if (!isValid) {
      response.setError(constantMessage.INVALID_FORM_VALIDATION)
      return;
    }
    let currentPwd = await users.findOne({ where: { id: req.decoded.id } });
    if(!currentPwd.dataValues.googleID && !currentPwd.dataValues.facebookID){
      let matchPwd = await passwordComparisonUtility.comparePwd(
        req.body.currentPassword,
        currentPwd.dataValues.password
        );
        if (!matchPwd) {
        response.setError(constantMessage.CURRENT_PASS_INCORRECT,"mismatchpwd")
        return ;
      };
    }

    const hashed = await bcryptjs.hash(req.body.newPassword, 12);
    let updateUser = await users.update(
      { password: hashed },
      {
        where: {
          id: req.decoded.id,
        },
      }
    );
    await sharedService.activityLogs(
      req,
      "Password change from account settings",
      "Password Reset",
      req.decoded.id
    );
    emailUtils.passwordChangeNotification(
      currentPwd.dataValues.legalName,
      currentPwd.dataValues
    );
    if(response.success){
      logActivity(
        {
                logName: ActionCategory.SETTINGS,
                description: "Updated Password of "+req.decoded.legalName,
                subjectID: parseInt(req.decoded.id),
                subjectType: "users",
                event: ActivityEvent.UPDATED,
                properties: {
                    attributes: null,
                    old: null
                },
                source: null,
                metadata:null
          },req)
    }
    response.message = constantMessage.PASS_CHANGED;
  } catch (error) {
    response.exception = error;
    response.setError(constantMessage.ERROR_PASS_CHANGE);
  }

  finally {
 return res.status(200).json(response);
  }
}

async function changeUserPasswordByAdmin(req, res, next) {
  let err = {};
  let response = new baseResponseModel();
  try {
    // const { errors, isValid } = validateChangePassword(req.body);
    // if (!isValid) {
    //     throw errors;
    // }
    let currentPwd = await users.findOne({ where: { id: req.decoded.id } });
    let matchPwd = await passwordComparisonUtility.comparePwd(
      req.body.passwords.adminpassword,
      currentPwd.dataValues.password
    );
    if (!matchPwd){
      response.setError(constantMessage.CURRENT_PASS_INCORRECT);
      return ;
    }
    const hashed = await bcryptjs.hash(req.body.passwords.investorpassword, 12);
    let updateUser = await users.update(
      { password: hashed },
      {
        where: {
          id: req.body.investorid,
        },
      }
    );
    const recvr = await users.findOne({ where: { id: req.body.investorid, } });
    emailUtils.passwordChangeNotification(
      recvr.dataValues.legalName,
      recvr.dataValues
    );//changess
    let message = constantMessage.PASS_CHANGE_BY_ADMIN_USERID + req.body.investorid;
    await sharedService.activityLogs(
      req,
      message,
      "password-reset",
      req.decoded.id
    );
response.message = constantMessage.PASS_CHANGED;

  } catch (error) {
    response.exception = error;
    response.setError(constantMessage.CURRENT_PASS_INCORRECT);
  }
  finally {
  return res.status(200).json(response)
  }
}

async function securityCheck(req, res, next) {
  let err = {};
  let response = new baseResponseModel();
  try {
    let userData = await users.findOne({ where: { id: req.decoded.id } });
    if (!userData) {
      response.setError(constantMessage.USER_NOT_FOUND);
   
    }
    let pwdChangeRequired = userData.dataValues.passwordChangeRequire;
    response.data = { changePassword: pwdChangeRequired } 
  } catch (error) {
    response.exception = error;
    response.setError(constantMessage.ERROR_OCCURRED);
  }

  finally {
 return res.status(200).json(response);
  }
}

async function enableSecurityCheck(req, res, next) {
  let err = {};
  let response = new baseResponseModel();
  try {
    let updateUserConfiguration = await users.update(
      { passwordChangeRequire: true },
      { where: { id: req.body.userID } }
    );


    response.message = constantMessage.PASS_CHANG_ENABLE
  } catch (error) {
    response.exception = error;
    response.setError(constantMessage.ERROR_OCCURRED_INOPERATION);
  }

  finally {
 return res.status(200).json(response)
  }
}

async function updatePasswordFromSecurityCheck(req, res, next) {
  let err = {};
  let response = new baseResponseModel();
  try {
    
    // apply server side validation on password update field

    const { errors, isValid } = validateUpdatePassword(req.body.password);
    if (!isValid) {
      response.exception = errors;
      response.setError(constantMessage.ERROR_OCCURRED);
      return ;
    }


    let PasswordCheckEnabled = await users.findOne({
      where: { id: req.decoded.id },
    });
    if (!PasswordCheckEnabled){
      
      response.setError(constantMessage.USER_NOT_FOUND);
      return;
    } 
    if (!PasswordCheckEnabled.dataValues.passwordChangeRequire)
    {
    response.setError(constantMessage.PASS_CONFIG_NOT_ENABLED);
    return ;
    }

    const hashed = await bcryptjs.hash(req.body.password, 12);
    let updatedUser = await users.update(
      {
        password: hashed,
        passwordResetToken: "",
        passwordChangeRequire: false,
      },
      {
        where: {
          id: req.decoded.id,
        },
      }
    );
      response.message = constantMessage.PASS_UPDATED
 
  } catch (error) {
    response.exception = error;
    response.setError(constantMessage.ERR0R_PASS_UPDATED);
  }
  finally{
  return res.status(200).json(response)
  }
}
module.exports.pwdResetRequest = pwdResetRequest;
module.exports.resetPassword = resetPassword;
module.exports.changeUserPassword = changeUserPassword;
module.exports.changeUserPasswordByAdmin = changeUserPasswordByAdmin;
module.exports.securityCheck = securityCheck;
module.exports.enableSecurityCheck = enableSecurityCheck;
module.exports.updatePasswordFromSecurityCheck = updatePasswordFromSecurityCheck;
