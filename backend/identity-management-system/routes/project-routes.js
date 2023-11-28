const express = require('express');
const router = express.Router();
const projectDetailService = require('../services/Projects/project-details');
const projectRoundService = require('../services/Projects/project-rounds');
const projectUpdateService = require('../services/Projects/project-updates');
const projectDocumentsService = require('../services/Projects/project-documents');
const middlewareAuthorization = require('../utility/authorization-middleware');

router.get('/information', middlewareAuthorization.checkUserPermissions('VIEW_PROJECT_INFORMATION'), projectDetailService.projectInformation);
router.get('/stats', middlewareAuthorization.checkUserPermissions('VIEW_PROJECT_STATS'), projectDetailService.projectStats);
router.get('/documents', middlewareAuthorization.checkUserPermissions('VIEW_PROJECT_DOCUMENTS_LISTING'), projectDocumentsService.projectDocuments);
module.exports = router;