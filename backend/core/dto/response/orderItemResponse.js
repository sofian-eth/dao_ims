class orderItemsellResponse {
    constructor(data) {
        this.id = data.id ? data.id : 0;
        this.areaPurchased = data.areaPurchased ? data.areaPurchased : 0;
        this.subTotal = data.subTotal ? data.subTotal : 0;
        this.pricePerSqFt = data.pricePerSqFt ? data.pricePerSqFt : 0;
        this.tax = data.tax ? data.tax : 0;
        this.serviceCharges = data.serviceCharges ? data.serviceCharges : 0;
        this.Total = data.Total ? data.Total : 0;
        this.tokenAmount = data.tokenAmount ? data.tokenAmount : 0;
        this.status = data.status ? data.status : null;
        this.orderID = data.orderID ? data.orderID : 0;
        this.buyerID = data.buyerID ? data.buyerID : 0;
        this.createdAt = data.createdAt ? data.createdAt : null;
        this.updatedAt = data.updatedAt ? data.updatedAt : null;
    }
}

class orderItemBuyResponse {
    constructor(data) {
        this.id = data.id ? data.id : 0;
        this.propertyLogo = data && data.propertyLogo ? data.propertyLogo : '';
        this.propertySymbol = data && data.propertySymbol ? data.propertySymbol : '';
        this.total = data.total;
        this.pricePerSqFt = data.pricePerSqFt;
        this.tokenAmount = data.tokenAmount;
        this.tokenPaid = data.tokenPaid ? (data.tokenPaid == 'approved' ? true : false) : false;
        this.tokenPaymantStatus = data.tokenPaid ? data.tokenPaid : 'pending';
        this.serviceChargesPaid = data.serviceChargesPaid ? (data.serviceChargesPaid == 'approved' ? true : false) : false;
        this.serviceChargesPaymentStatus = data.serviceChargesPaid ? data.serviceChargesPaid : 'pending';
        this.amountPaid = data.amountPaid ? data.amountPaid : 0;
        this.remainingAmount = (this.total - this.amountPaid) > 0 ? this.total - this.amountPaid : 0;
        this.timeExtensionRequired = data.timeExtensionRequired ? true : false;
        this.areaToList = data.areaToList;
        this.daysDue = data.daysDue;
        this.status = data.status;
        this.relativePath = data.relativePath ? data.relativePath : '';
        this.buyer = { profilePicture: '' };
        this.buyerID = data.buyerID?data.buyerID:0;
        this.sellerID = data.sellerID?data.sellerID:0;
        this.createdAt = data.createdAt ? data.createdAt : null;
        this.updatedAt = data.updatedAt ? data.updatedAt : null;
        this.showBankAccounts = data && data.showBankAccounts ? data.showBankAccounts : null;
        this.areaPurchased = data && data.areaPurchased ? data.areaPurchased : 0;
        this.totalUnreadMessages = (data && data.totalUnreadMessages ? data.totalUnreadMessages : 0);
        this.cancelledReasons = data.cancelledReasons?data.cancelledReasons:'';
        this.cancelledAt = data.cancelledAt?data.cancelledAt:null;
        this.cancelledBy = data.cancelledBy?data.cancelledBy:null;
        this.amountReceieved = data.amountReceieved?data.amountReceieved:0;
        this.sellerNickName = (data&&data.sellerNickName)?data.sellerNickName:'';
        this.sellerWalletAddress = (data&&data.sellerWalletAddress)?data.sellerWalletAddress:'';
        this.reviews = (data&&data.reviews) ? data.reviews : null;
    }
}

class sellerOrderItemResponse {
    constructor(data) {
        this.id = data.id ? data.id : 0;
        this.propertyLogo = data && data.propertyLogo ? data.propertyLogo : '';
        this.propertySymbol = data && data.propertySymbol ? data.propertySymbol : '';
        this.timeExtensionRequired = data.timeExtensionRequired ? true : false;
        this.totalAmount = data.total ? data.total : 0;
        this.status = data.status ? data.status : '';
        this.pricePerSqFt = data.pricePerSqFt ? data.pricePerSqFt : 0;
        this.areaToSell = data.areaToSell ? data.areaToSell : 0;
        this.activeOrders = data.activeOrders ? data.activeOrders : 0;
        this.areaLocked = data.areaLocked ? data.areaLocked : 0;
        this.areaSold = data.areaSold ? data.areaSold : 0;
        this.relativePath = data.relativePath ? data.relativePath : '';
        this.buyer = { id: (data&&data.buyerID ? data.buyerID : 0), nickName: (data&&data.nickName ? data.nickName : null), profilePicture: '', walletAddress: (data&&data.walletAddress ? data.walletAddress : null) };
        this.serviceChargesPaymentStatus = data.serviceChargesPaid ? data.serviceChargesPaid : 'pending';
        this.serviceChargesPaid = data.serviceChargesPaid ? (data.serviceChargesPaid == 'approved' ? true : false) : false;
        this.createdAt = data.createdAt ? data.createdAt : null;
        this.updatedAt = data.updatedAt ? data.updatedAt : null;
        this.amountReceieved = data.amountReceieved ? data.amountReceieved : 0;
        this.tokenAmount = data.tokenAmount;
        this.tokenPaid = data.tokenPaid ? (data.tokenPaid == 'approved' ? true : false) : false;
        this.tokenPaymantStatus = data.tokenPaid ? data.tokenPaid : 'pending';
        this.daysDue = data.daysDue;
        this.showBankAccounts = data && data.showBankAccounts ? data.showBankAccounts : '';
        this.areaPurchased = data.areaPurchased ? data.areaPurchased : 0;
        this.totalUnreadMessages = (data && data.totalUnreadMessages ? data.totalUnreadMessages : 0);
        this.serviceChargesMethod = (data&&data.serviceChargesMethod) ? data.serviceChargesMethod : null;
        this.totalPaymentsNeedToConfirm = data.totalPaymentsNeedToConfirm?data.totalPaymentsNeedToConfirm:0;
        this.isTimeExtensionRequested = (data.isTimeExtensionRequested && data.isTimeExtensionRequested===1)?true:false;
        this.reviews = (data&&data.reviews) ? data.reviews : null;
        // this.paymentMethods = this.getPaymentMethodsByObject(data.paymentMethodId, data.paymentMethodBankName, data.paymentMethodAccountTitle, data.paymentMethodAccountNumber, data.paymentMethodAccountIBAN, data.paymentMethodAccountBranch);

    }

    // getPaymentMethodsByObject(_ids, _names, _titles, _numbers, _ibans, _branches) {
    //     let payments = [];
    //     if (_ids) {
    //         _ids = _ids.split(',');
    //         _names = _names ? _names.split(',') : [];
    //         _titles = _titles ? _titles.split(',') : [];
    //         _numbers = _numbers ? _numbers.split(',') : [];
    //         _ibans = _ibans ? _ibans.split(',') : [];
    //         _branches = _branches ? _branches.split(',') : [];
    //         for (let i = 0; i < _ids.length; i++) {
    //             let paymObj = { id: _ids[i], name: _names[i], title: _titles[i], number: _numbers[i], ibans: _ibans[i], branch: _branches[i] ? _branches[i] : '' }
    //             payments.push(new paymentMethodObj.paymentMethodResponse(paymObj))
    //         }
    //     }
    //     return payments;
    // }
}

module.exports = { orderItemsellResponse, orderItemBuyResponse, sellerOrderItemResponse }
