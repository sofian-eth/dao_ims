const paymentMethodObj = require('./paymentMethodResponse');

class OrderSummaryResponse {
    constructor(obj = {}) {
        this.activeDeals = obj.activeDeals ? obj.activeDeals : 0;
        this.completedDeals = obj.completedDeals ? obj.completedDeals : 0;
        this.areaLeft = obj.areaLeft ? obj.areaLeft : 0;
        this.areaSold = obj.areaSold ? obj.areaSold : 0;
        this.processed = obj.processed ? obj.processed : 0;
        this.areaLocked = obj.areaLocked ? obj.areaLocked : 0;
        this.propertyLogo = obj.propertyLogo ? obj.propertyLogo : "";
        this.propertyName = obj.propertyName ? obj.propertyName : "";
        this.totalSqFt = obj.totalSqFt ? obj.totalSqFt : 0;
        this.createdAt = obj.createdAt ? obj.createdAt : null;
        this.totalViews = obj.totalViews ? obj.totalViews : 0;
        this.pricePerSqFt = obj.pricePerSqFt ? obj.pricePerSqFt : 0;
        this.orderStatus = obj.orderStatus ? obj.orderStatus : null;
        this.serviceCharges = {
            serviceChargesPaid:obj.serviceChargesPaid?obj.serviceChargesPaid:0,
            serviceChargesMethod:obj.serviceChargesMethod?obj.serviceChargesMethod:0,
            serviceChargesAmount:obj.serviceChargesAmount?obj.serviceChargesAmount:0
        };
        this.paymentMethods = this.getPaymentMethodsByObject(obj.paymentMethodId, obj.paymentMethodBankName, obj.paymentMethodAccountTitle, obj.paymentMethodAccountNumber, obj.paymentMethodAccountIBAN, obj.paymentMethodAccountBranch,obj.bankLogo);
        this.minimumLotSize = (obj&&obj.minimumLotSize) ? obj.minimumLotSize : 0;
        this.daysToAcceptPayment = (obj&&obj.daysToAcceptPayment) ? obj.daysToAcceptPayment : 0;
        this.areaToList = (obj&&obj.areaToList) ? obj.areaToList : 0;
        this.propertySymbol = (obj&&obj.propertySymbol) ? obj.propertySymbol : null;
    }

    getPaymentMethodsByObject(_ids, _names, _titles, _numbers, _ibans, _branches,_logos) {
        let payments = [];
        if (_ids) {
            _ids = _ids.split(',');
            _names = _names ? _names.split(',') : [];
            _titles = _titles ? _titles.split(',') : [];
            _numbers = _numbers ? _numbers.split(',') : [];
            _ibans = _ibans ? _ibans.split(',') : [];
            _branches = _branches ? _branches.split(',') : [];
            _logos = _logos ? _logos.split(',') : [];
            for (let i = 0; i < _ids.length; i++) {
                let paymObj = { id: _ids[i], name: _names[i], title: _titles[i], number: _numbers[i], ibans: _ibans[i], branch: _branches[i] ? _branches[i] : '',logo: _logos[i] }
                payments.push(new paymentMethodObj.paymentMethodResponse(paymObj))
            }
        }
        return payments;
    }
}
class OrdersSummaryResponse {
    constructor(obj = {}) {
        this.areaToSell = obj.areaToSell ? obj.areaToSell : 0;
        this.sold = obj.sold ? obj.sold : 0;
        this.inactive = obj.inactive ? obj.inactive : 0;
        this.locked = obj.locked ? obj.locked : 0;
        this.totalProcessed = obj.totalProcessed ? obj.totalProcessed : 0;
        this.nickName=obj.nickName?obj.nickName:"";
        this.walletAddress=obj.walletAddress?obj.walletAddress:"";
        this.createdAt=obj.createdAt?obj.createdAt:Date.now();
        this.phoneNumber=obj.phoneNumber?obj.phoneNumber:"";
        this.email=obj.email?obj.email:"";
        this.verfied=obj.verfied?obj.verfied:false;
        this.totalOrders = obj.totalOrders ? obj.totalOrders : 0;
        this.orderCompletion = obj.orderCompletion ? obj.orderCompletion : 0;
        this.reviews = obj.reviews ? obj.reviews : [];
        this.first_purchase = (obj&&obj.first_purchase)?obj.first_purchase:null;
        this.last_activity = (obj&&obj.last_activity)?obj.last_activity:null;
        this.totalSellingDeals = (obj&&obj.totalSellingDeals) ? obj.totalSellingDeals : 0;
        this.totalBuyingDeals = (obj&&obj.totalBuyingDeals) ? obj.totalBuyingDeals : 0; 

    }
}
module.exports = { OrderSummaryResponse,OrdersSummaryResponse };