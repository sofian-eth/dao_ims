const express = require('express');
const userPermissions = require('../utils/user-authentication');
const areaUnitsController = require('../Controllers/Property/Demarcation/areaUnits.controller');
const userAssetsController = require('../Controllers/Property/Demarcation/userAssets.controller');
const demarcationRoutes = express.Router();

demarcationRoutes.get('/demarcated/area-units', userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), areaUnitsController.get);
demarcationRoutes.get('/demarcated/area-units/me', userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), areaUnitsController.getMyAreaUnits)
demarcationRoutes.get('/demarcated/area-units/dashboard', userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), areaUnitsController.dashboardDemarcatedUnits);
demarcationRoutes.get('/demarcated/area-units/:id', userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'),areaUnitsController.getByID);
demarcationRoutes.put('/demarcated/area-units/:id/status', userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), areaUnitsController.setUserDemarcatedUnitPlan);
demarcationRoutes.put('/demarcated/area-units/:id/:action', userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), areaUnitsController.updateStatus);
demarcationRoutes.post('/demarcated/subscribe', userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), areaUnitsController.subscribeUnit);
demarcationRoutes.post('/demarcated/area-units/createInvestmentPlan', userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), areaUnitsController.createDemarcatedInvestmentPlan);
demarcationRoutes.post('/demarcated/views', userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), areaUnitsController.subscribeUnit);

demarcationRoutes.get('/demarcated/get-area-units',areaUnitsController.getAreaUnits)
demarcationRoutes.get('/demarcated/fundingRound',areaUnitsController.fundingRoundForInstallmentPlan);
demarcationRoutes.get('/demarcated/user-balance',userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'),areaUnitsController.fetchUserPortfolioBalance);

demarcationRoutes.post('/demarcated/user-asset/:id/accumulate-area',userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), userAssetsController.accumulateArea)
demarcationRoutes.post('/demarcated/get-area-units-price-range',areaUnitsController.fetchDemarcatedUnitByPriceRange);
demarcationRoutes.get('/demarcated/projects',userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'),areaUnitsController.fetchAreaUnits);
module.exports = { demarcationRoutes }