
const express = require('express');
const marketplaceRoutes = express.Router();
const userPermissions = require('../utils/user-authentication');
var multer = require('multer')
var storage = multer.memoryStorage()
var upload = multer({
    storage: storage,
    // limits: { fileSize: 500000 },
    fileFilter: function (req, file, cb, res) {

        var filetypes = /jpeg|jpg|png|pdf/;
        var mimetype = filetypes.test(file.mimetype);

        if (mimetype) {
            return cb(null, true);
        }
        return cb(new Error("Error: File upload only supports image or pdf formats "));
    }
})

const orderController = require('../Controllers/Investors/Marketplace/orders');
const userReviewsController = require("./../Controllers/Investors/Marketplace/userReviews");
const orderTimeExtensionRequestsController = require('../Controllers/Investors/Marketplace/orderTimeExtensionRequests');
const dashboardController = require('../Controllers/Investors/Personal/dashboard');

marketplaceRoutes.get('/marketplace/properties', userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), orderController.GetProperties);
marketplaceRoutes.get('/marketplace/orders', userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), orderController.GetOrders);
marketplaceRoutes.get('/marketplace/deals/property', userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), orderController.GetDeals);
marketplaceRoutes.get('/marketplace/orders/stats', userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), orderController.getMyOrdersStats);
marketplaceRoutes.post('/marketplace/orders', userPermissions.checkUserPermissions('USER_CAN_SELL'), orderController.createOrder);
marketplaceRoutes.get('/marketplace/me/sell', userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), orderController.GetSellOrdersByUser);
marketplaceRoutes.get('/marketplace/me/sell/buyrequests', userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), orderController.GetBuyRequestBySellerOrder);
marketplaceRoutes.get('/marketplace/me/buy', userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), orderController.GetBuyRequestByUser);
marketplaceRoutes.get('/marketplace/order', userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), orderController.GetOrder);
marketplaceRoutes.post('/marketplace/whysellingsurvey',userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), orderController.marketplaceWhySellingSurvey);
marketplaceRoutes.get('/marketplace/eligibility', userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), orderController.marketplaceEligibility);
marketplaceRoutes.post('/marketplace/order-item',userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'),orderController.createOrdeItem);
marketplaceRoutes.get('/marketplace/peertopeer', userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), orderController.marketplaceEligibility);
marketplaceRoutes.get('/marketplace/buyer/order-items/:id', userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), orderController.GetOrderItemDetail);
marketplaceRoutes.get('/marketplace/buyer/bank-share-bit-update/:id', userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), orderController.bankShareBitUpdate);
marketplaceRoutes.get('/marketplace/seller/order-items/:id', userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), orderController.getSellerOrderItemDetails);
marketplaceRoutes.get('/marketplace/order-items/:id/chat', userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), orderController.fetchOrderItemChat);
marketplaceRoutes.post('/marketplace/order-items/chat/saveMessage',userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'),orderController.saveMessageService);
marketplaceRoutes.post('/marketplace/order-items/chat/markMsgRead',userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'),orderController.markMsgReadService);
marketplaceRoutes.put('/marketplace/order-items/:id/savePayment',userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'),orderController.saveOrderPayment);
marketplaceRoutes.get("/marketplace/seller/orders-summary",userPermissions.checkUserPermissions("VIEW_MARKETPLACE_ORDERS"),orderController.getSellerOrdersSummary)
marketplaceRoutes.get('/marketplace/seller/order-summary/:id', userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), orderController.getSellerOrderSummary);
marketplaceRoutes.put('/marketplace/order-items/:id/cancel', userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), orderController.cancelOrderItem);
marketplaceRoutes.put('/marketplace/order-items/:id/payment/:paymentid/:status',userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'),orderController.updateOrderPaymentStatus);
marketplaceRoutes.put('/marketplace/order-items/:id/extendtimerequest', userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), orderController.timeExtendRequest);
marketplaceRoutes.put('/marketplace/order-items/:id/approveextendtimerequest', userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), orderController.approveTimeExtendRequest);
marketplaceRoutes.put('/marketplace/order-items/:id/showBankInfo/:action', userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), orderController.showBankAccountInformation);
marketplaceRoutes.put('/marketplace/order-items/:id/:status', userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), orderController.updateOrderItemStatus);
marketplaceRoutes.get('/marketplace/chat-users/:item_id',userPermissions.checkUserPermissions('FETCH_MILESTONES'),orderController.getUsers)
marketplaceRoutes.put('/marketplace/dispute/:id/:status',userPermissions.checkUserPermissions('FETCH_MILESTONES'),orderController.updateDisputeStatus);
marketplaceRoutes.get('/marketplace/view/order/:id',userPermissions.checkUserPermissions('FETCH_MILESTONES'),orderController.viewOrder);
marketplaceRoutes.put('/marketplace/order/:id/revert',userPermissions.checkUserPermissions('FETCH_MILESTONES'),orderController.revertOrder);

marketplaceRoutes.post('/marketplace/area/unlock',userPermissions.checkUserPermissions('FETCH_MILESTONES'),orderController.unlockRequest);
marketplaceRoutes.get('/marketplace/fetch-all-area-requests',userPermissions.checkUserPermissions('FETCH_MILESTONES'),orderController.fetchAllAreaRequest);
marketplaceRoutes.get('/marketplace/my-marketplace-area',userPermissions.checkUserPermissions('FETCH_MILESTONES'),orderController.getUserProjectUnlockedArea);
marketplaceRoutes.get('/marketplace/request/:id/:response/:area',orderController.changeRequest);
marketplaceRoutes.put('/marketplace/orders/:id/mark-inactive', userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), orderController.markInactiveOrder);
marketplaceRoutes.put('/marketplace/orders/:id/mark-active', userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), orderController.markActiveOrder);

marketplaceRoutes.get("/print",userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'),orderController.print);
marketplaceRoutes.post("/download-property-bank-accounts",userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'),orderController.downloadPropertyBabkAccounts);


marketplaceRoutes.post("/marketplace/orderTimeExtensionRequests", userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), orderTimeExtensionRequestsController.creatExtendTimeRequest)
marketplaceRoutes.get("/marketplace/get-user-available-area",orderController.getUserAvailableAreaAdmin)

marketplaceRoutes.post("/marketplace/userReviews", userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), userReviewsController.postDealReview)
//fetching request for reviews...
marketplaceRoutes.get('/marketplace/fetch-all-reviews',userPermissions.checkUserPermissions('FETCH_MILESTONES'),userReviewsController.fetchAllPendingReviews);
marketplaceRoutes.put('/marketplace/userReviews/:id/approve',userPermissions.checkUserPermissions('FETCH_MILESTONES'), userReviewsController.approveUserReviews )
//transactionRoutes.post('/sell', userPermissions.checkUserPermissions('USER_CAN_SELL'), marketPlaceController.sellRequest);

// transactionRoutes.get('/sell/list', userPermissions.checkUserPermissions('VIEW_MARKETPLACE_ORDERS'), marketPlaceController.GetOrders);
//transactionRoutes.get('/order/:id', userPermissions.checkUserPermissions('USER_CAN_SELL'), marketPlaceController.GetOrderDetail);
//transactionRoutes.post('/bid', userPermissions.checkUserPermissions('USER_CAN_SELL'), marketPlaceController.BidOrder);
//transactionRoutes.get('/sell-orders', userPermissions.checkUserPermissions('VIEW_MY_TRANSACTIONS'), sellOrderController.fetchOrders);
//transactionRoutes.post('/cancel-orders', userPermissions.checkUserPermissions('USER_CAN_SELL'), sellOrderController.removeOrder);
module.exports = { marketplaceRoutes };
