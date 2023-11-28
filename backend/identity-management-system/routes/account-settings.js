const express = require('express');
const passResetService = require('../services/Authentication/pass-reset');
const generalSettingService = require('../services/Account-settings/general-settings');
const middlewareAuthorization = require('../utility/authorization-middleware');
const commonApiService = require('../services/shared/common');
const router = express.Router();


router.post('/account/change-password', middlewareAuthorization.checkUserPermissions('CHANGE_MY_PASSWORD'), passResetService.changeUserPassword);
router.post('/account/change-email', middlewareAuthorization.checkUserPermissions('CHANGE_MY_EMAIL'), generalSettingService.changeEmail);
router.post('/account/change-phone', middlewareAuthorization.checkUserPermissions('CHANGE_MY_PHONE_NUMBER'), generalSettingService.changePhone);
router.post('/account/verify-phone', middlewareAuthorization.checkUserPermissions('CHANGE_MY_PHONE_NUMBER'),generalSettingService.phoneVerification);
router.route('/account/general-setting')
    .get(middlewareAuthorization.checkUserPermissions('VIEW_GENERAL_SETTINGS'), generalSettingService.generalSetting)
    .post(middlewareAuthorization.checkUserPermissions('UPDATE_GENERAL_SETTINGS'), generalSettingService.updateGeneralSetting);

router.route('/account/personal-details').post(middlewareAuthorization.checkUserPermissions('UPDATE_GENERAL_SETTINGS'), generalSettingService.saveAccountPersonalDetails);
router.route('/account/notification-preferences').post(middlewareAuthorization.checkUserPermissions('UPDATE_GENERAL_SETTINGS'), generalSettingService.saveNotificationPreferences);
router.route('/account/address-book').post(middlewareAuthorization.checkUserPermissions('UPDATE_GENERAL_SETTINGS'), generalSettingService.saveAccountAddressBook);
router.route('/account/address-book/remove').post(middlewareAuthorization.checkUserPermissions('UPDATE_GENERAL_SETTINGS'), generalSettingService.removeUserAddress);
router.route('/account/bank-info').post(middlewareAuthorization.checkUserPermissions('UPDATE_GENERAL_SETTINGS'), generalSettingService.saveAccountBankInformation);
router.route('/account/bank-info').get(middlewareAuthorization.checkUserPermissions('UPDATE_GENERAL_SETTINGS'), generalSettingService.getUserBankInformation);
router.route('/account/next-of-kin').post(middlewareAuthorization.checkUserPermissions('UPDATE_GENERAL_SETTINGS'), generalSettingService.saveNextofKinInformation);
router.route('/account/update-legal-info').post(middlewareAuthorization.checkUserPermissions('UPDATE_GENERAL_SETTINGS'), generalSettingService.updateLegalInfo);
router.route('/account/next-of-kin/:id/delete').delete(middlewareAuthorization.checkUserPermissions('UPDATE_GENERAL_SETTINGS'),generalSettingService.deleteNextofKinInformation)
router.route('/account/delete-bank-info').delete(middlewareAuthorization.checkUserPermissions('UPDATE_GENERAL_SETTINGS'), generalSettingService.deleteAccountBank);

// router.route('/account/personal-information')
//     .get(middlewareAuthorization.checkUserPermissions('VIEW_PERSONAL_SETTINGS'), generalSettingService.getUserInformation)
//     .post(middlewareAuthorization.checkUserPermissions('UPDATE_PERSONAL_SETTINGS'), generalSettingService.updateUserInformation);
router.route('/account/personal-information')
    .get(middlewareAuthorization.checkUserPermissions('VIEW_GENERAL_SETTINGS'),generalSettingService.getUserInformation)
    .post(middlewareAuthorization.checkUserPermissions('UPDATE_GENERAL_SETTINGS'),generalSettingService.updateUserInformation);
    router.get('/account/updateUserCookiesBit' , commonApiService.updateCookiesBit);
router.post('/account/check-number', middlewareAuthorization.checkUserPermissions('CHECK_PHONE_NUMBER'), commonApiService.checkPhoneNumber);
router.get('/account/payment', middlewareAuthorization.checkUserPermissions('FETCH_PAYMENT_OPTIONS'), commonApiService.getPaymentNumber);
router.get('/account/name-initial', middlewareAuthorization.checkUserPermissions('FETCH_NAME_INITIALS'), commonApiService.getNameInitials);

router.get('/user-intro-modules', middlewareAuthorization.checkUserPermissions('FETCH_NAME_INITIALS'), commonApiService.getUserIntroModules);
router.post('/save-module-skip-count', middlewareAuthorization.checkUserPermissions('FETCH_NAME_INITIALS'), commonApiService.saveIntroCount);
router.post('/save-module-done', middlewareAuthorization.checkUserPermissions('FETCH_NAME_INITIALS'), commonApiService.doneIntroCount);
router.post('/save-popup-bit', middlewareAuthorization.checkUserPermissions('FETCH_NAME_INITIALS'), commonApiService.savePopupBit);
router.post('/popup-bit', middlewareAuthorization.checkUserPermissions('FETCH_NAME_INITIALS'), commonApiService.popupBit);
router.get('/walkthrough-checks', middlewareAuthorization.checkUserPermissions('FETCH_NAME_INITIALS'),commonApiService.walkthroughChecks)

router.post('/account/roundSubscription', middlewareAuthorization.checkUserPermissions('FETCH_NAME_INITIALS'), commonApiService.roundSubscription);
router.post('/account/check-email', commonApiService.checkEmail);
router.get('/account/resend-email',middlewareAuthorization.checkUserPermissions('CHECK_PHONE_NUMBER'),generalSettingService.resendEmailVerification)
module.exports = router;