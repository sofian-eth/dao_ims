const express = require('express');
const { 
    getProperty, 
    getEndTradeActivityDate, 
    getInvestmentReport, 
    getInvestmentReportCount,
    getInvestmentSummary, 
    getInvestmentCertificate,
    recordInvestmentReportLog,
    getReportStatementLogs,
    downloadInvestmentSummary,
} = require('../services/reports/report.service');

const reportRouter = express.Router();
const userPermissions = require('../utils/user-authentication');


reportRouter.get('/reportProperties',userPermissions.checkUserPermissions('VIEW_PROJECT_INFORMATION'),getProperty);
reportRouter.get('/endTradeActivityDate',userPermissions.checkUserPermissions('VIEW_PROJECT_INFORMATION'),getEndTradeActivityDate);
//reportRouter.get('/getInvestmentReport',userPermissions.checkUserPermissions('VIEW_PROJECT_INFORMATION'),reportController.investmentReport);
reportRouter.get('/getInvestmentReport',userPermissions.checkUserPermissions('VIEW_PROJECT_INFORMATION'),getInvestmentReport);
reportRouter.get('/getInvestmentReportCount',userPermissions.checkUserPermissions('VIEW_PROJECT_INFORMATION'),getInvestmentReportCount);
reportRouter.get('/getInvestmentSummary',userPermissions.checkUserPermissions('VIEW_PROJECT_INFORMATION'),getInvestmentSummary);
reportRouter.get('/getInvestmentCertificate',userPermissions.checkUserPermissions('VIEW_PROJECT_INFORMATION'),getInvestmentCertificate);
reportRouter.post('/getSetReportLog',userPermissions.checkUserPermissions('VIEW_PROJECT_INFORMATION'),recordInvestmentReportLog);
reportRouter.post('/downloadInvestmentSummary',userPermissions.checkUserPermissions('VIEW_PROJECT_INFORMATION'),downloadInvestmentSummary);
reportRouter.get('/getReportStatementLogs',userPermissions.checkUserPermissions('VIEW_PROJECT_INFORMATION'),getReportStatementLogs);






module.exports = {reportRouter}