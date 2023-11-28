const fileuploader = require('./helper/fileuploader');
const responseModel = require('./models/response-model'); // OLD - we need tp remove it
const responseObject = require('./dto/response/response-model');
const mediaResponse = require('./models/response-media');
const db = require('./dbModels/index.js');
const ordersDB = require('./dal/marketplace/ordersdb');
const demarcatedAreaUnitDB = require('./dal/demarcation/demarcatedAreaUnit');
const propertyDB = require('./dal/propertydb');
const userDB = require('./dal/account/userdb');
const disputeDB = require('./dal/marketplace/disputedb');
const userReviewsDB = require('./dal/marketplace/userReviewsdb')
const demarcatedInvestmentPlansDB = require('./dal/demarcatedInvestmentPlans/demarcatedInvestmentPlanDB');
const paymentDB = require('./dal/marketplace/paymentdb');
const fcmDb = require('./dal/fcm/fcmdb');
const campaignDB = require('./dal/campaign/campaigndb');
const orderTimeExtensionRequestsdb = require('./dal/marketplace/orderTimeExtensionRequestsdb');


// request Models
const OrderRequest = require('./dto/requests/createOrderRequest');
const OrderItemRequest = require('./dto/requests/orderItemRequest');
const whySellingSurveyRequest = require('./dto/requests/whySellingSurveyRequest');
const bankAccountRequest = require('./dto/requests/createBankAccountRequest');
const userAddressRequest = require('./dto/requests/createAddressbookRequest');
const {unlockAreaRequest,userUnlockAreaRequest} = require('./dto/requests/unlockRequest');
const { AreaUnitsRequest } = require('./dto/requests/demarcatedRequests');
const saveOrderPaymentRequest = require('./dto/requests/saveOrderPaymentRequest');
const {notificationModel} = require('./dto/requests/notification.model');
const {NOTIFICATION_ENUM} = require('./dto/requests/notification.model');

//response models
const bankAccountModel = require('./dto/response/bankAccountResponse');
const userDetailResponseModel = require('./dto/response/userResponse');
const userRentalStats = require('./dto/response/userRentalResponse');
const chatDB = require('./dal/marketplace/chatdb');

//ENUMS

const { orderStatus, orderPaymentStatusEnum, orderPaymentTypeEnum,BankInformationActionEnums,showBankInformationAction,orderPaymentTypeEnumEmail,serviceChargesMethod,PropertyCategory } = require('./models/enums')


module.exports.fileuploader = fileuploader;
module.exports.responseModel = responseModel;
module.exports.mediaResponse = mediaResponse;
module.exports.ordersDB = ordersDB;
module.exports.chatDB = chatDB;
module.exports.propertyDB = propertyDB;
module.exports.userDB = userDB;
module.exports.disputeDB = disputeDB;
module.exports.paymentDB = paymentDB;
module.exports.campaignDB = campaignDB;
module.exports.db = db;
module.exports.fcmDb = fcmDb;
module.exports.RequestModels = { OrderRequest, whySellingSurveyRequest, OrderItemRequest, bankAccountRequest, saveOrderPaymentRequest,unlockAreaRequest,userUnlockAreaRequest,userAddressRequest,AreaUnitsRequest };
module.exports.responseObject = responseObject;
module.exports.enums = { orderStatus, orderPaymentStatusEnum, orderPaymentTypeEnum,BankInformationActionEnums,showBankInformationAction,orderPaymentTypeEnumEmail,serviceChargesMethod ,PropertyCategory};
module.exports.userDetailResponseModel = userDetailResponseModel;
module.exports.orderTimeExtensionRequestsdb = orderTimeExtensionRequestsdb;
module.exports.userReviewsDB = userReviewsDB;
module.exports.notificationModel = notificationModel;
module.exports.NOTIFICATION_ENUM = NOTIFICATION_ENUM;
module.exports.userRentalHistoryResponse = userRentalStats;
module.exports.demarcatedAreaUnitDB = demarcatedAreaUnitDB;
module.exports.demarcatedInvestmentPlansDB = demarcatedInvestmentPlansDB;
