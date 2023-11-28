const { orderStatus } = require("../../models/enums");
const propertyCoreModel = require("../../dal/propertydb");
const core = require("../..");
class createOrderRequest {
    constructor(data) {
        this.id = data.id ? data.id : 0;
        this.sellerID = data.sellerID;
        this.propertyID = data.propertyID;
        this.pricePerSqFt = data.pricePerSqFt;
        this.areaToSell = data.areaToSell;
        this.areaToList = data.areaToList;
        this.minimumLotSize = data.minimumLotSize;
        this.daysToAcceptPayment = data.daysToAcceptPayment;
        this.subTotal = data.subTotal;
        this.total = data.total;
        this.category = data.category;
        /*
        ENUM
        open - available to buy / bid on marketplace
        closed - order fulfilled - blockchain request confirmed / sent
        disputed - in a dispute
        processing - admin approving (should be directly approved) or sending to blockchain
        awaiting - Listing/Order is waiting for payment confirmation from buyer
        */
        this.status = orderStatus.active;
        this.tokenAmount = data.tokenAmount;
        /*
        ENUM
        bank - servcie charges will be paid via bank - cash
        area - service charges will be paid as area deduction
        */
        this.serviceChargesMethod = data.serviceChargesMethod;

        this.salesTax = data.salesTax;
        this.serviceCharges = 0;
        // this.calculateServiceCharges();

        this.type = data.type;
        this.serviceChargesAreaPercent = 0;
        //this.errors = this.validateRequest();
    }
    async validateRequest() {
        let invalids = [];
        let properties = (await propertyCoreModel.getProperties(this.sellerID, "development"));
        if(this.category =="mature"){
            let matureproperties = (await propertyCoreModel.getProperties(this.sellerID, "mature"));
            properties.data = properties.data.concat(matureproperties.data);
        }
        if(this.category !="mature"){
        const property = properties.data.filter(x => x.id == this.propertyID)[0];
        const result = await core.ordersDB.getUserProjectUnlockedArea(this.sellerID);
        if ( result.success ) {
            const filterProperty =  (result.data && Array.isArray(result.data) ?  result.data.filter(p => p.propertyId === property.id).pop() : null);
            console.log("filterProperty", filterProperty);
            property.areaAvailable = filterProperty ? filterProperty.unlocked : property.areaAvailable;
        }
        const minRateFromPreviousRoundPercentage = (property.configurations && property.configurations.minRateFromPreviousRoundPercentage) ? property.configurations.minRateFromPreviousRoundPercentage : 0;
        const minimumPrice = property.propertyCurrentRoundPrice + (property.propertyCurrentRoundPrice/100)*minRateFromPreviousRoundPercentage;
        if (this.pricePerSqFt < minimumPrice || this.pricePerSqFt > property.nextRoundPrice) {
            invalids.push(
                {
                    "Message": "You can only set a price between current and next round"
                }
            );
        }
        const config = property.configurations;
        const minArea = Number((((property.areaAvailable) * config.minAreaToSell) / 100).toFixed(2));
        if (this.areaToSell < minArea || this.areaToSell > property.areaAvailable) {
            invalids.push(
                {
                    "Message": `SELECT AREA TO SELL FROM ${minArea} - ${property.areaAvailable} RANGE`
                }
            );
        }
        if (this.minimumLotSize < 1 || this.minimumLotSize > this.areaToSell) {
            invalids.push(
                {
                    "Message": "You can only set a value between 1 and " + this.areaToSell
                }
            );
        }
        if (this.daysToAcceptPayment < 14 || this.daysToAcceptPayment > 28) {
            invalids.push(
                {
                    "Message": `SELECT FROM 14-28 RANGE`
                }
            );
        }
        if (this.tokenAmount < 1 || this.tokenAmount > 25) {
            invalids.push(
                {
                    "Message": `SELECT FROM 1 - 25 RANGE`
                }
            );
        }
    }
        return invalids;
    }
    calculateArea() {
        if (this.areaToSell && this.pricePerSqFt) {
            return (this.areaToSell * this.pricePerSqFt);
        } else {
            return 0;
        }
    }

    validateAreaServiceCharges() {
        if (this.serviceChargesMethod == 'area') {
            return this.areaToSell == this.areaToList;
        }
        return true;
    }

    getOrderPaymentMethod(_methods, id) {
        console.log("_methods", _methods);
        _methods = _methods ? _methods : this.paymentMethods;
        let _paymentMethod = []
        for (let index = 0; index < _methods.length; index++) {
            let _orderPaymentMethod = {
                "orderID": id ? id : this.Id,
                "BankaccountID": _methods[index]
            };
            _paymentMethod.push(new OrderPaymentMethod(_orderPaymentMethod));
        }
        return _paymentMethod;
    }

    validateCreateRequest() {
        if (this.calculateArea() == 0) {
            return {
                success: false,
                errorCode: 'AREA_NOT_VALID',
                message: 'Area to sell must not be 0 (zero).',
            }
        }

        if (this.serviceChargesMethod == 'area' && this.validateAreaServiceCharges()) {
            return {
                success: false,
                errorCode: 'SELLAREA_MISMATCH_AREATOLIST',
                message: 'Area to sell and area to list cannot be same when service charges are to deducted from area.',
            }
        }

    }

    async calculateServiceCharges() {
        try {
            let ret = this.serviceCharges;
            await propertyCoreModel.getPropertyConfig(this.propertyID).then(x => {
                const config = x.serviceCharges.seller;
                if (this.serviceChargesMethod == "area") {
                    this.serviceCharges = (Number(config.fixed) / Number(this.pricePerSqFt)) + (Number(config.percentage) * Number(this.areaToSell) / 100);
                }
                if (this.serviceChargesMethod != "area") {
                    this.serviceCharges = (Number(config.fixed)) + (Number(config.percentage) * Number(this.areaToSell) / 100);
                }
                this.serviceChargesAreaPercent = config.percentage;
                ret = this.serviceCharges;
            });
            return ret;
        } catch (ex) {
            console.log('error method: calculateServiceCharges', ex.toString());
        }
    }

};

class OrderPaymentMethod {
    constructor(data) {
        this.Id = data.Id ? data.Id : 0;
        this.orderID = data.orderID;
        this.BankaccountID = data.BankaccountID;
    }
}

module.exports = { createOrderRequest, OrderPaymentMethod }
