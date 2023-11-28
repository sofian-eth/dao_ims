class dealResponse {
    constructor(data) {
        this.propertyLogo = data && data.propertyLogo ? data.propertyLogo : '';
        this.buyerName = data && data.buyerName ? data.buyerName : '';
        this.sellerName = data && data.sellerName ? data.sellerName : '';
        this.area = data.area;
        this.pricePerSqFt = data.pricePerSqFt;
        this.createdAt = data.createdAt;
        this.updatedAt =data.updatedAt; 
    }
}
class orderResponse {
    constructor(data) {
        this.id = data.id ? data.id : 0;
        this.propertyID = data.propertyID;
        this.pricePerSqFt = data.pricePerSqFt;
        this.areaToSell = data.areaToSell;
        this.areaToList = data.areaToList;
        this.minimumLotSize = data.minimumLotSize ? data.minimumLotSize : 0;
        this.daysToAcceptPayment = data.daysToAcceptPayment;
        this.subTotal = data.subTotal;
        this.total = data.total;
        this.status = data.status;
        this.tokenAmount = data.tokenAmount;
        this.serviceChargesMethod = data.serviceChargesMethod;
        this.salesTax = data.salesTax;
        this.serviceCharges = data.serviceCharges;
        this.areaSold = data.areaSold ? data.areaSold : 0;
        // this.arePledged = data.arePledged ? ((data.arePledged * -1) > 0 ? data.arePledged * -1 : data.arePledged * -1) : 0;
        this.arePledged = (data&&data.arePledged) ? data.arePledged : 0;
        this.type = data.type ? data.type : 'sell';
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.walletAddress = data.walletAddress;
        this.orderCompletion = data.orderCompletion && data.orderCompletion > 0 ? Math.round(data.orderCompletion) : 0;
        this.areaLeft = data.areaLeft ? (data.areaLeft < 0 ? data.areaLeft * -1 : data.areaLeft) : 0;
        this.paymentMethods = data && data.orderPaymentMethods && data.orderPaymentMethods.length > 0 ? data.orderPaymentMethods : [];
        this.propertySymbol = data && data.propertySymbol ? data.propertySymbol : '';
        this.propertyName = data && data.propertyName ? data.propertyName : '';
        this.propertyLogo = data && data.propertyLogo ? data.propertyLogo : '';
        this.propertyConfig = data && data.propertyConfig ? data.propertyConfig : '';
        this.userOrders = data && data.userOrders ? data.userOrders : 0;
        this.buyRequestsReceieved = data && data.buyRequestReceieved ? data.buyRequestReceieved : 0;
        this.relativePath = data.relativePath ? data.relativePath : '';
        this.activeDeals = data.activeDeals?data.activeDeals:0;
        this.seller = { id: (data.sellerID ? data.sellerID : 0), nickName: (data.nickName ? data.nickName : data.walletAddress), profilePicture: '', userRegisteredAt: (data.userRegisteredAt ? data.userRegisteredAt : null), totalCompletedOrders: (data.userCompletedOrders ? data.userCompletedOrders : 0) }
        this.buyer = { id: (data.buyerID ? data.buyerID : 0), nickName: (data.nickName ? data.nickName : data.walletAddress), profilePicture: '' }
        this.views = data&&data.views?data.views : 0;
        this.propertyCategory = data && data.propertyCategory ? data.propertyCategory : null;
        this.propertyRentPerUnit = data && data.propertyRentPerUnit ? data.propertyRentPerUnit : 0;
        this.totalUnreadMessages = (data && data.totalUnreadMessages ? data.totalUnreadMessages : 0);
        this.inactiveAt = (data&&data.inactiveAt) ? data.inactiveAt : null;
        this.completedAt = (data&&data.completedAt) ? data.completedAt : null;
        this.completedDeals = (data&&data.completedDeals) ? data.completedDeals : 0;
        this.totalPaymentsNeedToConfirm = (data&&data.totalPaymentsNeedToConfirm) ? data.totalPaymentsNeedToConfirm : 0;
        this.serviceChargesAreaPercent = (data&&data.serviceChargesAreaPercent) ? data.serviceChargesAreaPercent : 0;
        this.totalActiveDeals = (data&&data.totalActiveDeals) ? data.totalActiveDeals : 0;
        this.totalCompletedDeals = (data&&data.totalCompletedDeals) ? data.totalCompletedDeals : 0;
        this.avgBuyersRating = (data&&data.avgBuyersRating!==null) ? data.avgBuyersRating ? data.avgBuyersRating : 0 : null;
    }

    getOrderPaymentMethod_internal(_methods, names, ids) {
        let _paymentMethod = []
        if (_methods && _methods.length > 0) {
            let p_mathods = _methods[0].orderPaymentMethodsID.split(',');
            let p_name = names.split(',');
            let p_id = ids.toString().split(',');
            for (let index = 0; index < p_mathods.length; index++) {
                let _account = { bankAccountID: p_id[index], bankName: p_name[index], bankAccountID: p_mathods[index], id: p_mathods[index] }
                _paymentMethod.push(new OrderPaymentMethod(_account));
            }
        }
        return _paymentMethod;
    }


    getOrderPaymentMethod(_methods, id) {
        _methods = _methods ? _methods : this.paymentMethods;

        let _paymentMethod = []
        if (_methods && _methods.length > 0) {
            let p_mathods = _methods[0].orderPaymentMethodsID.split(',');
            for (let index = 0; index < p_mathods.length; index++) {

                _paymentMethod.push(new OrderPaymentMethod(p_mathods[index]));
            }
        }
        return _paymentMethod;
    }

};

class OrderPaymentMethod {
    constructor(data) {
        this.Id = data.Id ? data.Id : 0;
        this.orderPaymentMethodsID = data.orderPaymentMethodsID;
        this.bankName = data.bankName;
        this.bankAccountID = data.BankaccountID;
        this.bankLogo = data.bankLogo ? data.bankLogo : '';
        this.accountNumber = data.accountNumber ? data.accountNumber : '';
    }
}

module.exports = { dealResponse,orderResponse, OrderPaymentMethod }
