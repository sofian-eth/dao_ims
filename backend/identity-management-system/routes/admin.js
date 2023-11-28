const express = require('express');
const middlewareAuthorization = require('../utility/authorization-middleware');
const adminServices = require('../services/Admin/admin-users');
const adminInvestorServices = require('../services/Admin/investors');
const paymentService = require('../services/Admin/payment');
const passResetService = require('../services/Authentication/pass-reset');
const commonApiService = require('../services/shared/common');
const adminDashboardService = require('../services/Admin/admin-dashboard');
const rolesService = require('../services/Roles-permissions/roles');
const permissionService = require('../services/Roles-permissions/permissions');
const router = express.Router();

router.get('/users', middlewareAuthorization.checkUserPermissions('VIEW_TEAM_MEMBERS'), adminServices.adminUsers);
router.get('/team/detail', adminServices.fetchTeamMemberDetails);
router.post('/user', middlewareAuthorization.checkUserPermissions('ADD_TEAM_MEMBER'), adminServices.addAdminUsers);
router.post('/update/team-member', middlewareAuthorization.checkUserPermissions('UPDATE_TEAM_MEMBER'), adminServices.updateTeamMembers);
router.post('/remove/user', middlewareAuthorization.checkUserPermissions('REMOVE_TEAM_MEMBER'), adminServices.removeAdminUsers);
router.post('/add/investor', middlewareAuthorization.checkUserPermissions('ADD_INVESTORS'), adminInvestorServices.addInvestor);
 router.get('/account/payment', middlewareAuthorization.checkUserPermissions('FETCH_PAYMENT_OPTIONS'), paymentService.fetchPaymentMode);
//router.get('/account/payment', paymentService.fetchPaymentMode);
router
.post('/request-password',middlewareAuthorization.checkUserPermissions('CHANGE_USER_PASSWORD'), passResetService.pwdResetRequest);
router.post('/update/user', middlewareAuthorization.checkUserPermissions('UPDATE_INVESTORS'), adminInvestorServices.updateUser);
router.post('/user-detail', middlewareAuthorization.checkUserPermissions('VIEW_INVESTOR_DETAILS'), adminInvestorServices.userDetails);
// router.post('/remove/investor', middlewareAuthorization.checkUserPermissions('REMOVE_INVESTORS'), adminInvestorServices.removeUser);
router.post('/reset-user-pwd', middlewareAuthorization.checkUserPermissions('CHANGE_USER_PASSWORD'), passResetService.changeUserPasswordByAdmin);
router.get('/account/name-initial', middlewareAuthorization.checkUserPermissions('FETCH_NAME_INITIALS'), commonApiService.getNameInitials);
router.get('/user/tx-history', middlewareAuthorization.checkUserPermissions('VIEW_USER_TRANSACTION_HISTORY'), commonApiService.transactionHistory);
router.get('/admin-activity', middlewareAuthorization.checkUserPermissions('VIEW_ADMIN_ACTIVITIES'), commonApiService.fetchAdminActivityLogs);
router.get('/user/activity', commonApiService.fetchUserActivities);
router.get('/user/balance', commonApiService.userBalance);
router.get('/user-blockchain-transaction', commonApiService.userBlockchainTransaction);

router.get('/user/area/:id',commonApiService.getUserArea);
router.post('/user/area',commonApiService.addUserArea);
router.delete('/user/area/:id',commonApiService.deleteUserArea);
router.put('/user/area',commonApiService.updateUserArea);



//router.post('/enable-pass-reset', middlewareAuthorization.checkUserPermissions('ADD_ADMINS'), passResetService.enableSecurityCheck);
router.get('/dashboard-stats', middlewareAuthorization.checkUserPermissions('VIEW_USER_STATS'), adminDashboardService.dashboardStats);
router.get('/roles', middlewareAuthorization.checkUserPermissions('VIEW_ALL_ROLES'), rolesService.fetchRoles);
router.get('/permissions', middlewareAuthorization.checkUserPermissions('VIEW_ALL_PERMISSIONS'), permissionService.fetchPermissions);
router.post('/add-role', middlewareAuthorization.checkUserPermissions('ADD_ROLE'), rolesService.addRoles);
router.post('/update-role', middlewareAuthorization.checkUserPermissions('UPDATE_ROLE'), rolesService.updateRoles);
router.get('/role-detail', middlewareAuthorization.checkUserPermissions('FETCH_ROLE_DETAILS'), rolesService.fetchRoleDetails);
router.post('/add/permissions', middlewareAuthorization.checkUserPermissions('ADD_PERMISSIONS'), permissionService.addPermissions);
router.get('/fetch/roles', middlewareAuthorization.checkUserPermissions('FETCH_TEAM_ROLES'), rolesService.teamRoles);

// Fetch investor API

router.post('/suspend/investor', middlewareAuthorization.checkUserPermissions('REMOVE_INVESTORS'), adminInvestorServices.suspendUser);
router.post('/activate/investor', middlewareAuthorization.checkUserPermissions('REMOVE_INVESTORS'), adminInvestorServices.activateUser);
router.put('/users/:id/approveAccount', middlewareAuthorization.checkUserPermissions('REMOVE_INVESTORS'), adminInvestorServices.approveAccount);

router.get('/investor/list',adminInvestorServices.fetchInvestors);
router.get('/investor/search',adminInvestorServices.searchInvestor);
// middlewareAuthorization.checkUserPermissions('VIEW_INVESTORS'),
module.exports = router;