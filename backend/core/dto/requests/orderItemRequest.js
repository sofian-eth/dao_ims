const { orderStatus } = require("../../models/enums");

class orderItemRequest {
    constructor(data) {
        this.id = data.id ? data.id : 0;
        this.areaPurchased = data.areaPurchased ? data.areaPurchased : 0;
        this.subTotal = data.subTotal ? data.subTotal : 0;
        this.tax = data.tax ? data.tax : 0;
        this.serviceCharges = data.serviceCharges ? data.serviceCharges : 0;
        this.Total = data.Total ? data.Total : 0;
        this.tokenAmount = data.tokenAmount ? data.tokenAmount : 0;
        this.status = data.status ? data.status : orderStatus.active;
        this.orderID = data.orderID ? data.orderID : 0;
        this.buyerID = data.buyerID ? data.buyerID : 0;
    }

    validateFields() {
        if (!(this.orderID && this.areaPurchased && this.areaPurchased > 0 && this.buyerID && this.buyerID > 0)) {
            return {
                success: false,
                data: "All fields are required."
            };
        } else {
            return {
                success: true,
                data: "Success"
            };
        }
    }

    async calculateServiceCharges(serviceChargesMethod, _config, pricePerSqFt, areaToSell, forUserType="seller") {
        try {
            let ret = this.serviceCharges;
            const config = forUserType==='buyer' ? (_config && _config.serviceCharges ? _config.serviceCharges.buyer : null) : (_config && _config.serviceCharges ? _config.serviceCharges.seller : null);
            if (serviceChargesMethod == "area" && config)
                this.serviceCharges = (Number(config.fixed) / Number(pricePerSqFt)) + (Number(config.percentage) * Number(areaToSell) / 100);
            if (serviceChargesMethod != "area" && config)
                this.serviceCharges = (Number(config.fixed)) + (Number(pricePerSqFt) * (Number(config.percentage) * Number(areaToSell) / 100));
            ret = this.serviceCharges;
            return ret;
        } catch (ex) {
            console.log('error method-orderItem: calculateServiceCharges', ex.toString());
        }
    }
}
exports.orderItemRequest = orderItemRequest;