const express = require('express');
const genericRoutes = express.Router();
var multer = require('multer')
var storage = multer.memoryStorage()

var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb, res) {

        var filetypes = /jpeg|jpg|png|pdf/;
        var mimetype = filetypes.test(file.mimetype);

        if (mimetype) {
            return cb(null, true);
        }
        return cb(new Error("Error: File upload only supports image or pdf formats "));
    }
})
const userDashboardController = require('../Controllers/Investors/Personal/dashboard');
const campaignController = require('../Controllers/campaign/campaign');
const fileController = require('../Controllers/Shared/files');
const investorController = require('../Controllers/Admin/Investors/investors');
const activeInvestmentService = require('../services/investor/investments');
const userDashboardService = require('../services/investor/dashboard');
const userPermissions = require('../utils/user-authentication');
const userTitleController = require('../Controllers/Admin/Investors/fetchtitle');
const mediaService = require('../services/shared/media'); 
const blockchainCronService = require('../services/blockchain/index');
const areaHolderService = require('../services/investor/holders');
genericRoutes.route('/admin/files')
    .get(userPermissions.checkUserPermissions('VIEW_FILES'), fileController.getfile)
    .post(userPermissions.checkUserPermissions('ADD_FILES'), upload.any(), fileController.uploadfile);
genericRoutes.get('/admin/document/url', userPermissions.checkUserPermissions('FETCH_PROJECT_DOCUMENT'), fileController.signedurl);
genericRoutes.get('/document/url', userPermissions.checkUserPermissions('FETCH_PROJECT_DOCUMENT'), fileController.signedurl);
genericRoutes.get('/admin/investors', userPermissions.checkUserPermissions('VIEW_INVESTORS'), investorController.investorcontrollers);
genericRoutes.post('/admin/fetchtitle', userPermissions.checkUserPermissions('CREATE_TRANSACTION'), userTitleController.fetchUserInformation);
genericRoutes.route('/files')
    .post(userPermissions.checkUserPermissions('ADD_FILES'), upload.any(),fileController.uploadfile);
genericRoutes.get('/dashboard', userPermissions.checkUserPermissions('VIEW_USER_DASHBOARD'), userDashboardController.DashboardController);
genericRoutes.get('/user/investments/all',userPermissions.checkUserPermissions('VIEW_USER_DASHBOARD'), activeInvestmentService.activeInvestments);
genericRoutes.get('/user/rental-incomes',userPermissions.checkUserPermissions('VIEW_USER_DASHBOARD'),userDashboardController.rentalIncome);
genericRoutes.get('/user/rental-stats',userPermissions.checkUserPermissions('VIEW_USER_DASHBOARD'),userDashboardController.rentalStats);
genericRoutes.get('/user/dashboard',userPermissions.checkUserPermissions('VIEW_USER_DASHBOARD'),userDashboardService.dashboard);
genericRoutes.get('/user/getReminders',userPermissions.checkUserPermissions('VIEW_USER_DASHBOARD'),userDashboardService.reminders);
genericRoutes.post('/user/password-check',userPermissions.checkUserPermissions('VIEW_USER_DASHBOARD'), userDashboardService.passwordCheck);
genericRoutes.get('/campaign/get-referral-data',userPermissions.checkUserPermissions('VIEW_USER_DASHBOARD'), campaignController.getReferralData);
genericRoutes.get('/campaign/get-referral-datav2', campaignController.getReferralData);
genericRoutes.get('/campaign/get-refferedByName',userPermissions.checkUserPermissions('VIEW_USER_DASHBOARD'), campaignController.getRefferdByName);
genericRoutes.get('/campaign/get-user-referral-data',userPermissions.checkUserPermissions('VIEW_USER_DASHBOARD'), campaignController.getUserReferralData);
genericRoutes.get('/campaign/get-active-campaign-detail',userPermissions.checkUserPermissions('VIEW_USER_DASHBOARD'), campaignController.getActiveCampaignDetail);
genericRoutes.get('/campaign/get-active-campaign-detailRegister', campaignController.getActiveCampaignDetailRegister);
genericRoutes.get('/campaign/get-campaign-detail',userPermissions.checkUserPermissions('VIEW_USER_DASHBOARD'), campaignController.getCampaignDetail);
genericRoutes.get('/campaign/update-referral-bit',userPermissions.checkUserPermissions('VIEW_USER_DASHBOARD'), campaignController.updateReferralBit);

genericRoutes.post('/media/upload',userPermissions.checkUserPermissions('ADD_FILES'), upload.any(), mediaService.uploadMedia);
genericRoutes.post('/media/save',userPermissions.checkUserPermissions('ADD_FILES'), mediaService.saveFile);
genericRoutes.post('/media/save/one-step',userPermissions.checkUserPermissions('ADD_FILES'),upload.any(),mediaService.saveFileOnUpload);
genericRoutes.post('/media/fetch'
,userPermissions.checkUserPermissions('ADD_FILES')
, mediaService.fetchMediaFile);
genericRoutes.get('/blockchain-cron',blockchainCronService.blockchainEventChecker);
genericRoutes.get('/admin/holders',areaHolderService.areaHolders);
genericRoutes.post('/media/fetch-key',userPermissions.checkUserPermissions('ADD_FILES'), mediaService.fetchMediaUrlByKey);
genericRoutes.get('/media/download/:file',mediaService.downloadFile)
genericRoutes.get('/media/downloadall/:id',mediaService.downloadAllFiles)

genericRoutes.post('/user/sendOTP', userPermissions.checkUserPermissions('VIEW_USER_DASHBOARD'), userDashboardController.sendOTPCodeToPhoneNumber);
genericRoutes.post("/user/update-device-token",userPermissions.checkUserPermissions('FETCH_MILESTONES'),userDashboardController.updateUserDeviceToken);
genericRoutes.get("/admin-device-token",investorController.getMarketplaceUsersDeviceToken);
genericRoutes.get("/notifications",userPermissions.checkUserPermissions("VIEW_USER_DASHBOARD"),investorController.getNotification);
genericRoutes.get("/updateReadBit-notification",userPermissions.checkUserPermissions("VIEW_USER_DASHBOARD"),investorController.updateReadBitNotification);
genericRoutes.get("/markallread-notification",userPermissions.checkUserPermissions("VIEW_USER_DASHBOARD"),investorController.marketAllReadNotification);
genericRoutes.get("/user/portfolio-worth",userPermissions.checkUserPermissions("VIEW_USER_DASHBOARD"),investorController.getPortfolioWorth)
genericRoutes.get("/user/balance", userPermissions.checkUserPermissions("VIEW_USER_DASHBOARD"), investorController.portfolioBalance)
genericRoutes.get("/public/amna-homes", investorController.activateProperty);
genericRoutes.get("/public/launchDate", investorController.launchDate);
genericRoutes.get('/public/currencies',investorController.fetchCurrencies);
genericRoutes.get('/user/check-user-status',userPermissions.checkUserPermissions('VIEW_USER_DASHBOARD'),userDashboardService.checkUserStatus)
module.exports = { genericRoutes };