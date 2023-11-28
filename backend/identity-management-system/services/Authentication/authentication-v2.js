const { sign } = require("jsonwebtoken");
const {validateSignupForm,validateEmailLogin,validateEmailVerification} = require("../../utility/validators");
const jwtUtils = require("../../utility/jwt");
const bcryptjs = require("bcryptjs");
const randomString = require("randomstring");
const emailUtils = require("../../utility/email");
const walletUtils = require("../../utility/wallet-address");
const membershipUtils = require("../../utility/membership-number");
const referralUtils = require("../../utility/referralCode")
const passwordComparisonUtility = require("../../utility/passwordComparison");
const permissionService = require("../Roles-permissions/permissions");
const sharedService = require("../shared/common");
const sessionManagement = require("./session-managment");
const {users, portfoliobalance,accountactivity,campaign} = require('../../models/index');

const baseResponseModel = require('../../dto/response-model');
const userResponseModel = require('../../dto/user-info-model');
const constantMessage = require('../../resources/constant');
const rolesConstant = require('../../resources/roles');
const googleRecaptchaService = require('../../utility/google-recaptcha');
const { Op, QueryTypes } = require("sequelize");
const { logActivity } = require('../Admin/activityLogger');
const ActionCategory = require('../../resources/enum-Action-Category');
const fcmService = require('../fcm/fcm.service');
const { error } = require("winston");
const { sequelize } = require("core/dbModels");
const hubSpotUtils = require('../../utility/hubspot');
const phoneUtils = require('../../utility/otpCode');

// const { response } = require("core");

async function signup(req, res, next) {
  
  let transaction;
  let response = new baseResponseModel();
  try {
    const { errors, isValid } = validateSignupForm(req.body);
 
    if (!isValid) {
      response.exception = errors;
      response.setError(constantMessage.INVALID_FORM_VALIDATION);
      return ;
    }

    let spamTest = await googleRecaptchaService.verifyCaptchaToken(req.body.recaptchaToken);
    if(!spamTest){
      response.setError(constantMessage.SPAM_ERROR_ALERT);
      return;
    }
    let normalizedEmail = req.body.email;
    if (normalizedEmail.endsWith("@daoproptech.com"))
     {
      response.setError(constantMessage.DAO_EMAIL_ERROR_COM);
     return;
    }
    if (normalizedEmail.endsWith("@daocapital.org")) {
      response.setError(constantMessage.DAO_EMAIL_ERROR_ORG);
      return ;
    }
  

    let isEmailExisting = await users.findOne({
      where: { email: req.body.email },

    },{raw:true});

    if(isEmailExisting && isEmailExisting.isSuspend) {
      response.setError(constantMessage.ACCOUNT_SUSPENDED_CLIENT_MESSAGE);
      return ;
    }  
  
    if (isEmailExisting) {
      response.setError(constantMessage.DUPLICATE_EMAIL);
      return ;
    
    }

    const hashed = await bcryptjs.hash(req.body.password, 12);
    const verificationUrl = await jwtUtils.generateVerificationUrl();
    const walletAddr = await walletUtils.walletAddress();
    const tronWalletAddr = await walletUtils.tronWalletAddressGenerator();
    console.log("Tron wallet addr",tronWalletAddr);
    const membershipID = await membershipUtils.membershipNumber("DAO");
    const referralCodeofUser = await  referralUtils.referralCode();
    

   
    // try {
    transaction = await sequelize.transaction();
    let referralUserID,activeCampaignID,voucherExpireDate;
    if(req.body.refCode){
      let user = await users.findOne({where: { refferalCode: req.body.refCode }});
      if(user){
        referralUserID = user.id;
      }

      // let activeCampaign = await campaign.findOne({where: { status: 1 }});
      // if(activeCampaign && user){
      //   activeCampaignID = activeCampaign.id;
      //   let todayDate = new Date();
      //  voucherExpireDate =  new Date(today.getFullYear(), today.getMonth(), today.getDate()+7);
      // }
    }
    let newUser = await users.create(
      {
        firstName: null,
        middleName: null,
        lastName: null,
        email: req.body.email,
        password: hashed,
        is_email_verified: false,
        is_phonenumber_verified: false,
        emailVerificationToken: verificationUrl,
        source: req.body.source,
        walletAddress: walletAddr,
        membershipNumber: membershipID,
        refferalCode: referralCodeofUser,
        isBasicInfoAvailable: false,
        isOptionalInformationAvailable: false,
        roleID: 1,
        is_kyc_approved: true,
        refferedBy : referralUserID,
        campaignID : null,
        voucherExpireDate : null,
        tronAddress : tronWalletAddr,
        isFiler: false,
        device_token: '',
        showIntro:1
      },
      { transaction }
    );


    //hubSpotUtils.createContact({name: null, email: req.body.email, phoneNumber: null,leadType:null,lead:null});

    await transaction.commit();
    emailUtils.verifyEmail(newUser.dataValues);
    let refCode = ['DAO100K','QUBED2','FB100K','HS100K'];
    if(req.body.refCode && refCode.includes(req.body.refCode) )
    {
        hubSpotUtils.createContact({name: null, email: req.body.email, phoneNumber: null,leadType:req.body.refCode,lead:req.body.refCode})

    }else{
      hubSpotUtils.createContact({name: null, email: req.body.email, phoneNumber: null,leadType:'BLOC/Portal',lead:'BLOC/Portal'})
    }
    let message = constantMessage.USER_ACCO_VIA_EMAIL;
    await sharedService.activityLogs(
      req,
      message,
      "Signup",
      newUser.dataValues.id
    );
   
      

   } catch (error) {
   console.log(error);
    response.exception = error;
    response.setError(constantMessage.ERROR_OCCURRED);
  
    if (transaction) await transaction.rollback();

  }finally{
    if(response.success){
      fcmService.signUpNotification(req.body.email);
    }
      return res.status(200).json(response);
  }
   
}

async function emailVerification(req, res, next) {
  
  
  let response = new baseResponseModel();
  
  try {
    let token = req.query.verificationToken;
    const { errors, isValid } = validateEmailVerification(token);
    if (!isValid) {
      response.exception = errors;
      response.setError(constantMessage.ERROR_OCCURRED);
      return ;
    }


    let checkTokenFromDb = await await users.findOne({
      where: { emailVerificationToken:token },

    },{raw:true});

    console.log(checkTokenFromDb);
    debugger;
    if(!checkTokenFromDb)
    {
      response.exception = 'TOKEN_NOT_FOUND';
      response.setError(constantMessage.ERROR_EMAIL_VERIFICATION);
      return;
    }

    let checkTokenValidity = jwtUtils.verifyVerificationToken(token);

    let user = await users.update(
      { is_email_verified: 1,
      emailVerificationToken: null },
      {
        where: {
          emailVerificationToken: token,
        },
      }
    );

   
    let userResponse = new userResponseModel.userInfoModal(checkTokenFromDb.dataValues);    

    let fetchPermissions = await permissionService.fetchPermissionByID(
      userResponse.roleID
    );
    userResponse.permissions = fetchPermissions;
    var sessionTokens = await jwtUtils.sessionToken(JSON.parse(JSON.stringify(userResponse)));
    
    await sessionManagement.createSession(
      sessionTokens.refreshToken,
      userResponse.id
    );


    await sharedService.activityLogs(req, constantMessage.USER_HAVE_LOGGED_IN, "Login", userResponse.id);
    response.message = constantMessage.USER_HAVE_LOGGED_IN;
    response.data = sessionTokens;


  } catch (error) {
    console.log(error);
    response.exception = error;
    response.setError(constantMessage.ERROR_EMAIL_VERIFICATION);

  }
  finally{
    return res.status(200).json(response)
  }
}


async function specialInvestorLogin(req,res,next){
  let response = new baseResponseModel();
  try {
    let membershipId  = req.body.membershipId;
    let secret = req.body.secret;
    if(secret !== 'DaoSpecialService123%')
      response.message = constantMessage.ERROR_OCCURRED_INOPERATION;

      let user = await users.findOne({
        where: {
          [Op.or]: [
            { membershipNumber: membershipId },
            { phoneNumber: membershipId },
            {email : membershipId }
          ]
        }
      });
      let userResponse = new userResponseModel.userInfoModal(user.dataValues);    

      let fetchPermissions = await permissionService.fetchPermissionByID(
        userResponse.roleID
      );
      userResponse.permissions = fetchPermissions;
      var sessionTokens = await jwtUtils.sessionToken(JSON.parse(JSON.stringify(userResponse)));
      
      await sessionManagement.createSession(
        sessionTokens.refreshToken,
        userResponse.id
      );
  
      await sharedService.activityLogs(req, constantMessage.USER_HAVE_LOGGED_IN, "Login", userResponse.id);      
      response.message = constantMessage.USER_HAVE_LOGGED_IN;
      response.data = sessionTokens;  

  } catch(error){
    console.log(error);
    response.exception = error;
    response.setError(constantMessage.ERROR_EMAIL_VERIFICATION);
  }

  finally {
    return res.status(200).json(response);
  }
}

async function login(req, res, next) {
  let err = {};
  let userResponse;
  let isEmail=(req.body.email.includes('@')&&req.body.email.includes('.')?true:false);//check if the email field contains an email or not
  let response = new baseResponseModel();
  try {
    const { errors, isValid } = validateEmailLogin(req.body);
    if (!isValid) {
      response.setError(constantMessage.INVALID_FORM_VALIDATION,"formvalidation");
      return ;
    }
    let user = await users.findOne({
      where: {
        [Op.or]: [
          { email: req.body.email },
          { phoneNumber: req.body.email }
        ]
      }
    });

  
    if (!user || user.roleID == rolesConstant.SalesAgent ) {
      if(isEmail)
        response.setError(constantMessage.INCORRECT_EMAIL_PASS);
      else response.setError(constantMessage.INCORRECT_MOBILE_PASS);
      return ;
    }

    if(user.dataValues.isSuspend){
      response.setError(constantMessage.ACCOUNT_SUSPENDED_CLIENT_MESSAGE);
      return ;
    }
    
    if (!user.dataValues.password) {
      if(isEmail)
        response.setError(constantMessage.INCORRECT_EMAIL_PASS);
      else response.setError(constantMessage.INCORRECT_MOBILE_PASS);
      return;
    }
    let matchPwd = await passwordComparisonUtility.comparePwd(
      req.body.password,
      user.dataValues.password
      );
    
      if (!matchPwd) 
      {
        if(isEmail)
          response.setError(constantMessage.INCORRECT_EMAIL_PASS, "INCORRECT_EMAIL_PASS");
        else response.setError(constantMessage.INCORRECT_MOBILE_PASS, "INCORRECT_MOBILE_PASS");
      return ;
    }

    
    
    if (user.dataValues.is_email_verified == false)
    {
      const verificationUrl = await jwtUtils.generateVerificationUrl();
       let userUpdate = await users.update(
        {emailVerificationToken: verificationUrl },
        {
          where: {
            id: user.dataValues.id,
          },
        }
      );
      user.dataValues.emailVerificationToken = verificationUrl;
      emailUtils.verifyEmail(user.dataValues);
      response.setError(constantMessage.ACC_NOT_VERIFIED,"ACC_NOT_VERIFIED");
      return ;
    }  

    // if( user.dataValues.iskycApproved!==1 ) {
    //   response.setError(constantMessage.ACC_NOT_APPROVED, "ACC_NOT_APPROVED");
    //   return;
    // }
    if( user.dataValues.isOfflineUser==1 ) {
      if(isEmail)
        response.setError(constantMessage.INCORRECT_EMAIL_PASS);
      else response.setError(constantMessage.INCORRECT_MOBILE_PASS);
      return;
    }

    let userLoginCount = await accountactivity.count({where: {
      userID: user.dataValues.id,
      subjectID: 1
    }, raw:true});

   

    user.dataValues.loginCount = userLoginCount;

    // Convert response into dto 
    userResponse = new userResponseModel.userInfoModal(user.dataValues);    

    let fetchPermissions = await permissionService.fetchPermissionByID(
      userResponse.roleID
    );
    userResponse.permissions = fetchPermissions;
    var sessionTokens = await jwtUtils.sessionToken(JSON.parse(JSON.stringify(userResponse)));
    
    await sessionManagement.createSession(
      sessionTokens.refreshToken,
      userResponse.id
    );

//    await sharedService.activityLogs(req, constantMessage.USER_HAVE_LOGGED_IN, "Login", userResponse.id);
    response.message = constantMessage.USER_HAVE_LOGGED_IN;
    response.data = sessionTokens;
  } catch (error) {
  
    response.exception = error;
    response.setError(constantMessage.ERROR_USER_SIGIN_IN);
  }
  finally {
    if(response.success){
      logActivity(
        {
                logName: ActionCategory.SETTINGS,
                description: "Logged into investor portal",
                causerID: userResponse.id,
                causerType: 'users',
                subjectType: "users",
                event: 'Login',
                properties: {
                    attributes: {
                      id: userResponse.id,
                      email: userResponse.email,
                      userName: userResponse.legalName
                    },
                    old: null
                },
                source: null,
                metadata:null
          },req)
    }
    return res.status(200).json(response)
  }
}

async function fetchUserBasicInfo(req, res, next) {
  let err = {};
  let response = new baseResponseModel();
  try {
    let userID = req.decoded.id;
    let fetchUserBasicInfo = await users.findOne({ where: { id: userID } });
    let outputObject = {
      is_user_basic_info: fetchUserBasicInfo.isBasicInfoAvailable,
      user_basic_info:fetchUserBasicInfo
    };
    response.data = outputObject;
  } catch (error) {
    response.exception = error;
    response.setError(constantMessage.ERROR_USER_SIGIN_IN);

  }
  finally {  return res.status(200).json(response);
  }
}

async function checkPhoneNumberVerification(req, res, next) {
  let err = {};
  let response = new baseResponseModel();
  let userID = req.decoded.id;
  let fetchUserBasicInfo = await users.findOne({ where: { id: userID } });
  let outputObject = {
    status: (fetchUserBasicInfo.is_phonenumber_verified===1 || fetchUserBasicInfo.is_phonenumber_verified==='1' ? true : false),
  };
  response.data = outputObject;
  return res.status(200).json(response);
}
async function switchToAdmin(req, res, next) {
  let response = new baseResponseModel();
  let userAccessControl = [];
  let userID = req.decoded.id;
  let user = await users.findOne({ where: { id: userID } });
  let query ="call sp_admin_get_priviliges(?);";
  
  let result = await sequelize.query(query, {
    replacements:[userID]
  });
  let clients=null;
  if (user.isDAOSuperAdmin || user.isDAOMember || user.isGuest)
    clients = null;
  else{
    let query2 ="call sp_admin_get_clients(?);";
  
    clients = await sequelize.query(query2, {
      replacements:[userID]
    })
  }
  user.clientInfo=clients;
   
  if (result) {
    result.forEach(element => {
        element.client = element.clients?element.clients.name:'';
        element.role = element.role?element.role.name:'';
        element.permissions = element.permissions;
        element.explicitPermissions = element.explicitPermissions;
        let newArr = new Map((element.explicitPermissions).map(item => [item['name'], item]).values());
        element.explicitPermissions = newArr;
        userAccessControl.push(
          element
        );
    });
} 
 let legalName = user.legalName?user.legalName: user.firstName + ' ' +user.lastName;
  let data = {
    id: user.id,
    legalName : legalName,
    adminHomePage:user.adminHomePage,
    role: user.role,
    email: user.email,
    profilePictureID : user.profilePicture,
    isSuperAdmin: user.isSuperAdmin,
    isDAOSuperAdmin: user.isDAOSuperAdmin,
    isDAOMember : user.isDAOMember,
    isGuest: user.isGuest,
    type:user.type,
    // clientInfo: user.clientInfo,
    clientInfo: (user.clientInfo && user.clientInfo.length>0 && user.clientInfo[0].clientInfo )? user.clientInfo[0].clientInfo : null,
    accessList: userAccessControl
  }
  let accessToken = await jwtUtils.switchToAdminToken(data);
  response.data = accessToken;
  return res.status(200).json(response);
  
}

async function resendEmail(req,res,next){
 
  let response = new baseResponseModel();
  try{
      let fetchUserInfo = await users.findOne({ where: { email: req.body.email } });
      if(!fetchUserInfo){
          response.setError(constantMessage.USER_NOT_FOUND);
      return ; 
    }

    if(fetchUserInfo.dataValues.is_email_verified){
      response.setError(constantMessage.EMAIL_VERIFIED)
      return ;
    }

    let emailVerificationToken = fetchUserInfo.dataValues.emailVerificationToken;

    

    
    let data = {
      emailVerificationToken: emailVerificationToken,
      email: req.body.email
    };
    emailUtils.verifyEmail(data);
    let message = constantMessage.USER_ACCO_VIA_EMAIL;

  } catch (error) {
     
    response.exception = error;
    response.setError(constantMessage.ERROR_USER_SIGIN_IN);
  
  }

  finally {
    return res.status(200).json(response);
  }
  }


  async function leadGenerationForm(req,res){
    
    let response = new baseResponseModel();

    try{
      let hubSpotContactNumber = req.body.phoneNumber;
      let isEmailExisting = await users.findOne({
        where: { email: req.body.email },
  
      },{raw:true});
  
      let newUserId=0;
    
    

      let isPhoneNumberExist = await users.findOne({
        where: {phoneNumber: req.body.phoneNumber}
      });


      if(isPhoneNumberExist){
        req.body.phoneNumber = null;
      }


      let randomPassGenerator  = randomString.generate(10);
      const resetUrl = randomString.generate();
      const hashed = await bcryptjs.hash(randomPassGenerator, 12);
      const walletAddr = await walletUtils.walletAddress();
      const tronWalletAddr = await walletUtils.tronWalletAddressGenerator();
      const membershipID = await membershipUtils.membershipNumber("DAO");
      if (isEmailExisting) {
       
        newUser = isEmailExisting.id;
      
      } else {
      transaction = await sequelize.transaction();

      let newUser = await users.create(
        {
          firstName: null,
          middleName: null,
          lastName: null,
          email: req.body.email,
          legalName: req.body.name,
          password: hashed,
          is_email_verified: false,
          phoneNumber: null,
          is_kyc_approved:0,
          is_phonenumber_verified: false,
          emailVerificationToken: null,
          passwordResetToken: resetUrl,
          source: 'dubaiexpo2022',
          walletAddress: walletAddr,
          membershipNumber: membershipID,
          isBasicInfoAvailable: 1,
          isOptionalInformationAvailable: false,
          roleID: 1,
          is_kyc_approved: true,
          tronAddress : tronWalletAddr,
          isFiler: false,
          device_token: '',
          showIntro:1,
          interestedUseCase: req.body.purpose,
          interestedProjectID: 2,

        },
        { transaction }
      );
      await transaction.commit();

      newUserId = newUser.id;
      };
      
    
  
  
       sequelize.query(
        'call sp_create_transaction_for_leads(?,?,?,?,?)',
        {
          replacements: [newUserId,req.body.propertyId,req.body.areaPledged,2,'DAO'],
          type: QueryTypes.SELECT
        }
      );

      let emailResult =  emailUtils.createPassword(
         req.body.name,
        resetUrl,
        req.body.email  
      );
    //  console.log("Phone Number",hubSpotContactNumber); 
       hubSpotUtils.createContact({name: req.body.name, email: req.body.email, phoneNumber: hubSpotContactNumber,leadType:'Dubai Expo Lead Pledge',lead:'Dubai_Expo_2022'})

  
      // User entry with random password generator
      // Both email and phone will not verified
      // Password send to user email

    } catch (err){
      console.log("Err",err);
      response.exception = err;
      response.setError(constantMessage.ERROR_USER_SIGIN_IN);
    } finally{
      return res.status(200).json(response);
    }

  }

 async function hubSpotForm(req,res){
  let response = new baseResponseModel();
  try {
    let result = await hubSpotUtils.createContact({name: req.body.name, email: req.body.email, phoneNumber: req.body.phoneNumber,leadType:'Dubai Expo Lead Contact',lead:'Dubai_Expo_2022'})
  } catch(error){
    console.log("Err",err);
      response.exception = err;
      response.setError(constantMessage.ERROR_USER_SIGIN_IN);
  } finally{
    return res.status(200).json(response);
  }
 }

module.exports.resendEmail = resendEmail;
module.exports.signup = signup;
module.exports.login = login;
module.exports.emailVerification = emailVerification;
module.exports.fetchUserBasicInfo = fetchUserBasicInfo;
module.exports.specialInvestorLogin = specialInvestorLogin;
module.exports.checkPhoneNumberVerification = checkPhoneNumberVerification;
module.exports.switchToAdmin = switchToAdmin;
module.exports.leadGenerationForm = leadGenerationForm;
module.exports.hubSpotForm = hubSpotForm;
