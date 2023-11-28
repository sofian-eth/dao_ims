const express = require('express');
const rentalDistributionRoutes = express.Router();
const userPermissions = require('../utils/user-authentication');
const rentalDistributionController = require('../Controllers/RentalDistribution/rentalDistributionController')
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

// rentalDistributionRoutes.post("/rentaldistribution/orderTimeExtensionRequests", orderTimeExtensionRequestsController.creatExtendTimeRequest)
rentalDistributionRoutes.get("/get-rentals-and-credits-listings",userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'),rentalDistributionController.getRentalAndCreditListings)
rentalDistributionRoutes.get("/get-rentals-and-credits-header-stats",userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'),rentalDistributionController.getRentalAndCreditHeaderStats)
rentalDistributionRoutes.get("/get-rentals-stats-by-property",userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'),rentalDistributionController.getRentalHeaderStatsOfProperty)
rentalDistributionRoutes.get("/get-rentals-listings-by-property",userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'),rentalDistributionController.getRentalListingByProperty)
rentalDistributionRoutes.get("/send-rental-disbursement-reminder",userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'),rentalDistributionController.sendRentalDisbursementReminder)
rentalDistributionRoutes.get("/download-rental-receipt",userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'),rentalDistributionController.downloadRentalReceipt)
rentalDistributionRoutes.get("/get-rental-properties",userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'),rentalDistributionController.getMyRentalProperties)
rentalDistributionRoutes.get("/get-rental-property-payout-report",userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'),rentalDistributionController.generateRentalPropertyPayoutReport)
rentalDistributionRoutes.get("/get-rental-properties-data-report",userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'),rentalDistributionController.generateRentalPropertiesDataReport)
rentalDistributionRoutes.get("/download-generated-report",userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'),rentalDistributionController.downloadGeneratedReport)
rentalDistributionRoutes.get("/mark-disbursement-as-recieved",userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'),rentalDistributionController.markDisbursementAsRecieved)
rentalDistributionRoutes.post("/request-skipped-payout",userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'),rentalDistributionController.requestSkippedPayouts)
rentalDistributionRoutes.get("/set-default-bank",userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'),rentalDistributionController.setDefaultBankForPayout)
rentalDistributionRoutes.post("/skip-payout/:id",userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'),rentalDistributionController.skipPayout)

rentalDistributionRoutes.get("/get-rentals-activity-log", userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), rentalDistributionController.getRentalActivityLog)
rentalDistributionRoutes.post("/activity-for-download",userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'),rentalDistributionController.activityForDownload)
rentalDistributionRoutes.get("/download-liability-report/:id", userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), rentalDistributionController.downloadLiabilityReport)

module.exports = { rentalDistributionRoutes };
