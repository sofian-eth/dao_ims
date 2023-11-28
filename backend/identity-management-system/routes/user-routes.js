const express = require("express");
const passResetService = require("../services/Authentication/pass-reset");
const generalSettingService = require("../services/Account-settings/general-settings");
const middlewareAuthorization = require("../utility/authorization-middleware");
const commonApiService = require("../services/shared/common");
const blockchainApiService = require("../services/shared/blockchain-query");
const projectService = require("../services/Projects/project-updates");
const projectRoundService = require("../services/Projects/project-rounds");
const authenticationService = require("../services/Authentication/authentication-v2");
const investorService = require("../services/Investors/information");
const businessInformation = require("../services/Investors/business-information");
const router = express.Router();

router.get(
  "/user/explorer",
  middlewareAuthorization.checkUserPermissions("VIEW_EXPLORER"),
  commonApiService.fetchLockTransactions
);
router.get("/user/security-check", passResetService.securityCheck);
router.post(
  "/user/update-password",
  middlewareAuthorization.checkUserPermissions("CHANGE_MY_PASSWORD"),
  passResetService.updatePasswordFromSecurityCheck
  );
router.get(
  "/user/total-supply",
  middlewareAuthorization.checkUserPermissions("VIEW_TOTAL_SUPPLY"),
  blockchainApiService.elementsTotalSupply
);
router.get(
  "/user/circulation-supply",
  middlewareAuthorization.checkUserPermissions("VIEW_CIRCULATION_SUPPLY"),
  blockchainApiService.elementsCirculationSupply
);
router.get(
  "/youtube-feed",
  middlewareAuthorization.checkUserPermissions("VIEW_PROJECT_UPDATES"),
  projectService.fetchYoutubeUpdates
);
router.get(
  "/active-round",
  middlewareAuthorization.checkUserPermissions("VIEW_PROJECT_ACTIVE_PRICE"),
  projectRoundService.elementsActiveRound
);
router.get(
  "/youtube-feed-test",
  middlewareAuthorization.checkUserPermissions("VIEW_PROJECT_UPDATES"),
  projectService.fetchYoutubeUpdates
);
// router.get('/user/sales', middlewareAuthorization.checkUserPermissions('VIEW_SALES_AGENT_CODE'), commonApiService.fetchSalesAgent);
router.get("/user/sales", commonApiService.fetchSalesAgent);
router.get("/user/test-route", commonApiService.testStatusCode);

router.get(
  "/is_phonenumber_verified",
  middlewareAuthorization.checkUserPermissions("VIEW_EXPLORER"),
  authenticationService.checkPhoneNumberVerification
);
router.get(
  "/check_basic_info",
  middlewareAuthorization.checkUserPermissions("VIEW_EXPLORER"),
  authenticationService.fetchUserBasicInfo
);
router.post(
  "/user/information/step-one",
  middlewareAuthorization.checkUserPermissions("VIEW_EXPLORER"),
  investorService.phoneVerificationRequest
  );
router.post(
  "/user/information/step-two",
  middlewareAuthorization.checkUserPermissions("VIEW_EXPLORER"),
  investorService.phoneVerification
  );
router.put(
    "/user/information/legalName",
    middlewareAuthorization.checkUserPermissions("VIEW_EXPLORER"),
    investorService.updateLegalName
    );
router.get(
  "/user/information/goals",
businessInformation.goalFetch
  );
  // middlewareAuthorization.checkUserPermissions("VIEW_EXPLORER"),

  router.get("/user/information/investment/options",businessInformation.investmentEnums)

router.post(
  "/user/information/save",
   middlewareAuthorization.checkUserPermissions("VIEW_EXPLORER"),
  businessInformation.saveUserBusinessInformation
  );
  
  // middlewareAuthorization.checkUserPermissions("VIEW_EXPLORER"),

  router.get(
    "/user/check_business_info",
    middlewareAuthorization.checkUserPermissions("VIEW_EXPLORER"),
    businessInformation.fetchAdditionalInformation
  );

router.get('/user/billing-info',middlewareAuthorization.checkUserPermissions('VIEW_GENERAL_SETTINGS'),investorService.billingInformation)

router.post('/user/update/cnic',
middlewareAuthorization.checkUserPermissions('UPDATE_GENERAL_SETTINGS'),
investorService.updateIdentityNumber)

router.post('/user/update/billing-info',
middlewareAuthorization.checkUserPermissions('UPDATE_GENERAL_SETTINGS'),
investorService.updateBillingInformation);


router.post('/user/kyc/save',middlewareAuthorization.checkUserPermissions('UPDATE_GENERAL_SETTINGS'), investorService.saveKycInformation);

router.put('/nickname',middlewareAuthorization.checkUserPermissions('UPDATE_GENERAL_SETTINGS'), investorService.updateNickname)
router.get('/user/bank-information',middlewareAuthorization.checkUserPermissions('UPDATE_GENERAL_SETTINGS'), generalSettingService.getUserBankInformation);
router.get('/switchtoadmin',middlewareAuthorization.checkUserPermissions("VIEW_EXPLORER"),authenticationService.switchToAdmin)

module.exports = router;
