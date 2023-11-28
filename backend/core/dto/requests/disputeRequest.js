const { disputeStatus } = require("../../models/enums");

class disputeRequest {
    constructor(data) {
        this.id = data.id ? data.id : 0;
        this.category = data.category ? data.category : '';
        this.additionalDetails = data.additionalDetails ? data.additionalDetails : '';
        this.orderItemID = data.orderItemID ? data.orderItemID : 0;
        this.status = data.status ? data.status : disputeStatus.active;
        this.resolvedAt = data.resolvedAt ? data.resolvedAt : '';
        this.userId = data.userId ? data.userId : 0;
    }
}

exports.disputeRequest = disputeRequest;