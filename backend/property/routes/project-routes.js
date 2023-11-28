const express = require('express');
const projectRoutes = express.Router();
const adminvalidators = require('../utils/admin-validations');
const propertyCntrl = require('../Controllers/Property/index');
const userPermissions = require('../utils/user-authentication');
const projectDiscountController = require('../Controllers/Property/Funding/discount');
const youtubeFeeds = require('../Controllers/Shared/feed');
const propertyService = require('../services/property/information/listing');
// const propertyInformationService = require('../services/property/information/general-information');
const propertyRoundService = require('../services/property/funding-rounds/round');
const propertyDetail = require('../services/property/propertyDetail/project-detail');
const projectMileStones = require('../services/property/funding-rounds/milestone');
const projectDocumentService = require('../services/property/document/document');
const youtubeFeedService = require('../services/property/information/youtube-feed');

const projectInvestors = require('../services/investor/investments');
const userTransaction = require('../services/transactions/transaction');
projectRoutes.route('/admin/document')
    .post(userPermissions.checkUserPermissions('ADD_PROJECT_DOCUMENTS'), propertyCntrl.adddocument);
// Obselete Url
//  projectRoutes.get('/documents', userPermissions.checkUserPermissions('VIEW_PROJECT_DOCUMENTS_LISTING'), propertyCntrl.alldocument);
projectRoutes.post('/admin/unlockfunds', userPermissions.checkUserPermissions('UNLOCK_DEVELOPMENT_ROUND'), propertyRoundService.unlockFunds);
projectRoutes.post('/admin/lockfunds', userPermissions.checkUserPermissions('ADD_DEVELOPMENT_ROUND'), adminvalidators.adminvalidators('lock-funds'), propertyCntrl.devrounds);
projectRoutes.get('/admin/getdevrounds', userPermissions.checkUserPermissions('VIEW_DEVELOPMENT_ROUNDS'), propertyCntrl.getrounds);
projectRoutes.route('/admin/milestones')
    .get(userPermissions.checkUserPermissions('FETCH_MILESTONES'), propertyCntrl.getmilestones)
    .post(userPermissions.checkUserPermissions('ADD_PROJECT_MILESTONES'), propertyCntrl.addmilestones)
    .put(userPermissions.checkUserPermissions('UPDATE_PROJECT_MILESTONE_PROGRESS'), propertyCntrl.updatemilestones)
projectRoutes.route('/admin/propertystats')
    .get(userPermissions.checkUserPermissions(), propertyCntrl.getpropertystats)
projectRoutes.route('/admin/property')
    .get(userPermissions.checkUserPermissions('VIEW_PROJECT_INFORMATION'), propertyCntrl.propertyinfo)
    .post(userPermissions.checkUserPermissions('UPDATE_PROJECT_INFORMATION'), propertyCntrl.updatepropertyinfo)
projectRoutes.get('/admin/documents', userPermissions.checkUserPermissions('VIEW_PROJECT_DOCUMENTS_LISTING'), propertyCntrl.alldocument);
projectRoutes.get('/admin/markeplace/order', userPermissions.checkUserPermissions('MARKETPLACE_VIEW'), propertyCntrl.getMarketplaceOrders);
projectRoutes.get('/admin/markeplace/user-orders/:id',userPermissions.checkUserPermissions('MARKETPLACE_VIEW'), propertyCntrl.getMarketplaceUserOrders);
projectRoutes.get('/admin/markeplace/order/:id', userPermissions.checkUserPermissions('MARKETPLACE_VIEW'), propertyCntrl.getMarketplaceOrderItems);
projectRoutes.get('/admin/markeplace/order/:id/discard', userPermissions.checkUserPermissions('MARKETPLACE_EDIT'), propertyCntrl.adminDiscardOrderItem);
projectRoutes.get('/admin/markeplace/order/:id/revert', userPermissions.checkUserPermissions('MARKETPLACE_EDIT'), propertyCntrl.adminRevertOrder);
projectRoutes.get('/activeprice', userPermissions.checkUserPermissions('VIEW_PROJECT_ACTIVE_PRICE'), propertyCntrl.price);
projectRoutes.get('/getpropertytaxes', userPermissions.checkUserPermissions('VIEW_PROJECT_TAX'), propertyCntrl.getpropertytaxes);
projectRoutes.get('/round-stats', propertyCntrl.projectFundsStats);
projectRoutes.get('/propdiscount', projectDiscountController.discountprice);
projectRoutes.get('/elements-feed',youtubeFeeds.elementsFeed);
projectRoutes.get('/dao-feed',youtubeFeeds.daoFeed);

projectRoutes.get('/delete-feed-file',youtubeFeeds.deleteFeedFile);


projectRoutes.get('/projects/all',userPermissions.checkUserPermissions('VIEW_PROJECT_INFORMATION'),propertyService.projectListing);
projectRoutes.post('/projects/reminder/save',userPermissions.checkUserPermissions('VIEW_PROJECT_INFORMATION'),propertyService.propertyReminder);
projectRoutes.get('/project/active_round/');
projectRoutes.get('/project/area_stats/');
projectRoutes.get('/project/tax/list');
projectRoutes.get('/project/rounds/list/',propertyRoundService.fetchDevelopmentRounds);
projectRoutes.get('/project/rounds/detail/')
projectRoutes.get('/project/rounds/milestones/list',projectMileStones.projectMilestones);
// projectRoutes.get('/project/information/detail',propertyInformationService.projectInformation);
projectRoutes.get('project/document/list');
projectRoutes.post('/project/information/update');
projectRoutes.post('/project/round/lock');
projectRoutes.post('/project/round/unlock');
projectRoutes.post('/project/document/upload');
projectRoutes.post('/project/rounds/milestone/add');
projectRoutes.post('/project/rounds/milestone/update');
projectRoutes.get('/project/rating');
projectRoutes.post('/project/rating/update');
projectRoutes.get('/project/investor/list');

projectRoutes.get('/projects/project-detail',userPermissions.checkUserPermissions('FETCH_MILESTONES'),propertyDetail.projectDetail);
projectRoutes.get('/projects/project-detail/mature',userPermissions.checkUserPermissions('FETCH_MILESTONES'),propertyDetail.matureProjectDetail);
projectRoutes.get('/projects/round-detail',propertyDetail.getRoundDetail);
projectRoutes.get('/projects/round/detail');


projectRoutes.get('/project/view',userPermissions.checkUserPermissions('FETCH_MILESTONES'),propertyDetail.projectView);
projectRoutes.get('/project/view/detail',propertyDetail.projectViewDetail);

projectRoutes.get('/project/investments/active',propertyDetail.projectActiveInvestments);
projectRoutes.get('/project/youtube-feed',youtubeFeedService.youtubeFeed);
projectRoutes.get('/documents',projectDocumentService.fetchDocuments );

projectRoutes.get('/holders',projectInvestors.fetchHolders );

projectRoutes.get('/get-stats/:propertyid',propertyDetail.getStats);

projectRoutes.get("/get-config/:id",propertyDetail.getPropertyConfig);
projectRoutes.get('/admin/markeplace/summary', userPermissions.checkUserPermissions('MARKETPLACE_VIEW'), propertyCntrl.getSummary);
projectRoutes.get('/admin/markeplace/summary-project', userPermissions.checkUserPermissions('MARKETPLACE_VIEW'),  propertyCntrl.getProjectSummary);
projectRoutes.get('/admin/markeplace/disputes', userPermissions.checkUserPermissions('MARKETPLACE_VIEW'),  propertyCntrl.getDisputes);
projectRoutes.get('/admin/markeplace/service-charges', userPermissions.checkUserPermissions('MARKETPLACE_VIEW'),  propertyCntrl.getServiceCharges);
projectRoutes.get('/admin/markeplace/service-charges/:id/approve', userPermissions.checkUserPermissions('MARKETPLACE_EDIT'),  propertyCntrl.approveServiceCharges);
projectRoutes.get('/admin/markeplace/user-area/:id/summary', userPermissions.checkUserPermissions('MARKETPLACE_VIEW'),  propertyCntrl.getUserAreaSummary);
projectRoutes.get('/admin/user/transaction/projects/:id', userPermissions.checkUserPermissions('MARKETPLACE_VIEW'),userTransaction.investorTransaction);

projectRoutes.get('/admin/markeplace/search/:txt',userPermissions.checkUserPermissions('MARKETPLACE_VIEW'),propertyCntrl.search)


projectRoutes.get('/banks',propertyCntrl.getBanks);
projectRoutes.get('/project/banks',propertyCntrl.projectBanks)
projectRoutes.post('/projects/:id/requested', userPermissions.checkUserPermissions('VIEW_PROJECT_INFORMATION'), propertyCntrl.requestProjectAccess);




module.exports = { projectRoutes };