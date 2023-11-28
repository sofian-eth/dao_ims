const paymentObj = require('./orderItemPaymentResponse');
const paymentMethodObj = require('./paymentMethodResponse');
const moment = require("moment")
class orderItemDetailResponse {
    constructor(data) {
        this.id = data.id ? data.id : 0;
        this.areaPurchased = data.areaPurchased ? data.areaPurchased : 0;
        this.subTotal = data.subTotal ? data.subTotal : 0;
        this.pricePerSqFt = data.pricePerSqFt ? data.pricePerSqFt : 0;
        this.tax = data.tax ? data.tax : 0;
        this.serviceCharges = null;
        this.Total = data.Total ? data.Total : 0;
        this.tokenAmount = data.tokenAmount ? data.tokenAmount : false;
        this.status = data.status ? data.status : null;
        this.orderID = data.orderID ? data.orderID : 0;
        this.createdAt = data.createdAt ? data.createdAt : null;
        this.updatedAt = data.updatedAt ? data.updatedAt : null;
        this.dueDate = data.dueDate ? (data.dueDate > 0 ? data.dueDate : 0) : 0;
        this.days = data.days ? data.days : 0;
        this.timeExtensionRequired = data.timeExtensionRequired ? (data.timeExtensionRequired > 0 ? true : false) : false;
        this.paymentPending = data.paymentPending ? Math.round(data.paymentPending) : (data.Total ? Math.round(data.Total) : 0);
        this.seller = { id: (data.sellerID ? data.sellerID : 0), nickName: (data.seller ? data.seller : ''),firstName:(data.sellerFirstName ? data.sellerFirstName : ''),lastName:(data.sellerLastName ? data.sellerLastName : '') };
        this.buyer = { id: (data.buyerID ? data.buyerID : 0), nickName: (data.buyer ? data.buyer : ''),firstName:(data.buyerFirstName ? data.buyerFirstName : ''),lastName:(data.buyerLastName ? data.buyerLastName : '') };
        this.property = { name: data.propertyName ? data.propertyName : '', category: (data.propertyCategory ? data.propertyCategory : null), rentPerUnit: (data.propertyRentPerUnit ? data.propertyRentPerUnit : null), propertyLogo: (data.propertyLogo ? data.propertyLogo : null) };
        this.amountPaidTillDate = 0;
        this.amountRecievedTillDate = 0;
        this.payments = [];
        this.paymentMethods = this.getPaymentMethodsByObject(data.paymentMethodId, data.paymentMethodBankName, data.paymentMethodAccountTitle, data.paymentMethodAccountNumber, data.paymentMethodAccountIBAN, data.paymentMethodAccountBranch,data.paymentMethodBankLogo);
        this.dealBlockchainReference = data.dealBlockchainReference ? data.dealBlockchainReference : null;
        this.tradeactivityStatus = data.tradeactivityStatus ? data.tradeactivityStatus : null;
        this.tradeactivityConfirmationAt = data.tradeactivityConfirmationAt ? data.tradeactivityConfirmationAt : null;
        this.propertyBanks = [];
        this.disputes = [];
        this.showBankAccounts = data && data.showBankAccounts ? data.showBankAccounts : null;
        this.showBankAccountsBit = data && data.showBankAccountsBit ? data.showBankAccountsBit : 0;
        this.extendTimeRequests = data&&data.timeExtensionRequests ? data.timeExtensionRequests : [];
        this.extendedDays = data&&data.extendedDays ? data.extendedDays : 0;
        this.extendDueDate = new Date(this.dueDate);//.addDays(this.extendedDays);
        this.serviceAccountId = data && data.ServiceChargeAccountId ? data.ServiceChargeAccountId : 0;
        this.reviews = (data&&data.reviews) ? data.reviews : [];
    }

    getPaymentsByObject(_payments, _attachments) {
        let payments = [];
        for (let i = 0; i < _payments.length; i++) {
            let _paymentObj = new paymentObj.orderItemPaymentResponse(_payments[i]);
            if (_attachments[i] && _attachments[i].id) {
                fileHandler.getMediaAsync(_attachments[i]).then(resp => {
                    _paymentObj.setProof(resp);
                })
            }
            payments.push(_paymentObj);
        }
        return payments;
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
            _logos = _logos ? _logos.split(','): [];
            for (let i = 0; i < _ids.length; i++) {
                let paymObj = { id: _ids[i], name: _names[i], title: _titles[i], number: _numbers[i], ibans: _ibans[i], branch: _branches[i] ? _branches[i] : '',logo: _logos[i]?_logos[i]:'' }
                payments.push(new paymentMethodObj.paymentMethodResponse(paymObj))
            }
        }
        return payments;
    }
}

module.exports = { orderItemDetailResponse }
