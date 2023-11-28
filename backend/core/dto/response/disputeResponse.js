class disputeResponse {
  constructor(data) {
    this.id = data ? data.id : 0;
    this.category = data ? data.category : 0;
    this.additionalDetails = data ? data.additionDetails : '';
    this.orderItemID = data ? data.orderItemID : 0;
    this.status = data ? data.status : '';
    this.resolvedAt = data.resolvedAt ? data.resolvedAt : null;
    this.createdAt = data.createdAt ? data.createdAt : null;
    this.updatedAt = data.updatedAt ? data.createdAt : null;
    this.userId = data.userId ? data.userId : null;
  }
};

module.exports = { disputeResponse };
