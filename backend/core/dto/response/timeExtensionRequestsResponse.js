class timeExtensionRequestsResponse {
    constructor(data) {
      this.id = data ? data.id : 0;
      this.orderItemID = data ? data.orderItemID : 0;
      this.status = data ? data.status : null;
      this.acceptedAt = data ? data.acceptedAt : null;
      this.rejectedAt = data ? data.rejectedAt : null;
      this.createdAt = data ? data.createdAt : null;
      this.updatedAt = data ? data.updatedAt : null;
    }
  };
  
  module.exports = { timeExtensionRequestsResponse };
  