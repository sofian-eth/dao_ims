const express = require("express");
const emailAuthenticationService = require("../services/Authentication/email-authentication");
const phoneAuthenticationService = require("../services/Authentication/phone-authentication");
const codeVerification = require("../services/Authentication/phone-verification");
const sessionManagement = require("../services/Authentication/session-managment");
const passport = require("passport");
const jwtUtils = require("../utility/jwt");
const sendGrid = require("../utility/send-grid");
const passResetService = require("../services/Authentication/pass-reset");
const logger = require("../utility/logger");
const permissionService = require("../services/Roles-permissions/permissions");
const authenticationService = require("../services/Authentication/authentication-v2");
const userResponseModel = require('../dto/user-info-model');
const {users,accountactivity,campaign}= require('../models/index');
const sharedService = require("../services/shared/common");
const constantMessage = require('../resources/constant');
const router = express.Router();
const referralUtils = require("../utility/referralCode");
const { createContact } = require("../utility/hubspot");
router.post("/auth/phone", phoneAuthenticationService.signupPhone);
router.post("/signup/email", emailAuthenticationService.signupEmail);
router.post("/verifyPhone", codeVerification.phoneVerification);
// router.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
  
// );

router.get(
  "/auth/google",function(req,res,next){
  
    passport.authenticate("google", { scope: ["profile", "email"],state:req.query.refCode })(req,res,next);
  }
  
);


router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.post("/login/email", emailAuthenticationService.loginEmail);
router.post(
  "/login/email-permissions",
  emailAuthenticationService.loginEmailTest
);

router.post("/auth/reset/request", passResetService.pwdResetRequest);
router.post("/auth/reset/change", passResetService.resetPassword);

router.post("/verifyEmail", emailAuthenticationService.emailVerification);

router.get("/auth/failed", (req, res) => {
  return res.status(400).json({ error: true, message: "Login failed" });
});
router.get("/auth/success", (req, res) => {
  return res.status(200).json({ error: false, message: "Login success" });
});

router.post("/auth/logout", sessionManagement.revokeSession);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failed" }),
  async function (req, res) {
    let redirectUrlPath = "/";
    req.query["refCode"] = req.query.state;
    let currUser = await  users.findOne({ where:{id:req.user.dataValues.id}});
    if(currUser){
      const referralCodeofUser = await  referralUtils.referralCode();
      await users.update({ refferalCode: referralCodeofUser
          },{
          where: {
              id: req.user.dataValues.id
          }
      });

    }
    if(req.query && req.query.refCode){
      let userRef = await  users.findOne({ where:{refferalCode:req.query.refCode}});

      if(userRef && userRef.dataValues && req.user && req.user.dataValues && userRef.dataValues.id != req.user.dataValues.id){
        if(currUser && !currUser.dataValues.refferedBy){
          await users.update({ refferedBy: userRef.dataValues.id
          },{
          where: {
              id: req.user.dataValues.id
          }
      });
        }
      }
      
    }

    try{
      let dataObject = {
        lastname:req.user.dataValues.legalName,
        email: req.user.dataValues.email,
        phone: req.user.dataValues.phoneNumber ? req.user.dataValues.phoneNumber : null,
        relationship_with_contact_owner: null,
        master_original_source_drilldown_2_copy: null,
        leadType:req.query.refCode ?? 'BLOC/Portal'
      }
      if(dataValues && dataValues.email && !dataValues.email.includes('daoproptech.com')){
        createContact(dataObject); 
      }
    }
    catch{

    }

    let userResponse = new userResponseModel.userInfoModal(req.user.dataValues);
    let fetchPermissions = await permissionService.fetchPermissionByID(
      userResponse.roleID
    );
    userResponse.permissions = fetchPermissions;
  
    var sessionTokens = await jwtUtils.sessionToken(JSON.parse(JSON.stringify(userResponse)));
    sessionTokens.redirectUrlPath = redirectUrlPath;
    await sessionManagement.createSession(
      sessionTokens.refreshToken,
      userResponse.id
    );

    await sharedService.activityLogs(req, constantMessage.USER_HAVE_LOGGED_IN, "Login", userResponse.id);
    return res
      .status(200)
      .send({ error: false, message: "", data: sessionTokens });
  }
);

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/auth/failed" }),
  async function (req, res) {
  //   delete req.user.dataValues.password;
  //   let fetchPermissions = await permissionService.fetchPermissionByID(
  //     req.user.dataValues.roleID
  //   );
  //   req.user.dataValues.permissions = fetchPermissions;
  //   var sessionTokens = await jwtUtils.sessionToken(req.user.dataValues);
  //   return res
  //     .status(200)
  //     .send({ error: false, message: "", data: sessionTokens });
  // }
  let userResponse = new userResponseModel.userInfoModal(req.user.dataValues);
    let fetchPermissions = await permissionService.fetchPermissionByID(
      userResponse.roleID
    );
    userResponse.permissions = fetchPermissions;
  
    let currUser = await  users.findOne({ where:{id:req.user.dataValues.id}});
    if(currUser && !currUser.dataValues.refferalCode){
      const referralCodeofUser = await  referralUtils.referralCode();
      await users.update({ refferalCode: referralCodeofUser
          },{
          where: {
              id: req.user.dataValues.id
          }
      });

    }

    if(req.query && req.query.refCode){
      let userRef = await  users.findOne({ where:{refferalCode:req.query.refCode}});

      if(userRef && userRef.dataValues && req.user && req.user.dataValues && userRef.dataValues.id != req.user.dataValues.id){
        if(currUser && !currUser.dataValues.refferedBy){
          await users.update({ refferedBy: userRef.dataValues.id
          },{
          where: {
              id: req.user.dataValues.id
          }
      });
        }
        
      }
      
    }
    var sessionTokens = await jwtUtils.sessionToken(JSON.parse(JSON.stringify(userResponse)));
    return res
      .status(200)
      .send({ error: false, message: "", data: sessionTokens });
  }
);

// router.post('/sendGrid', async (req, res) => {
//     let sgrid = await sendGrid.SendMail(req.body.to, req.body.subject, req.body.message)
//     try {
//         if (sgrid) {
//             return res.status(200).json({ error: false, message: "mail sent" })
//         }
//     } catch (error) {
//         return next()
//     }
// })

router.post("/signup_new", authenticationService.signup);
router.post("/login_new", authenticationService.login);
router.get("/verifyEmail_new", authenticationService.emailVerification);
// router.get("/check_basic_info",authenticationService.fetchUserBasicInfo);
// router.post("/user/additional_information");

router.post('/resend-email',authenticationService.resendEmail);
router.post('/specialInvestorLogin',authenticationService.specialInvestorLogin);
router.post('/leads',authenticationService.leadGenerationForm);
router.post('/website/leads',authenticationService.hubSpotForm)
module.exports = router;
