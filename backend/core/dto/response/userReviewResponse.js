class userReviewResponse {
    constructor(data) {
        this.id = (data&&data.id) ? data.id : 0;
        this.comment = (data&&data.comment) ? data.comment : '';
        this.rating = (data&&data.rating) ? data.rating : 0;
        this.orderItemsID = (data&&data.orderItemsID) ? data.orderItemsID : 0;
        this.reviewer = {id: (data&&data.reviewerID ? data.reviewerID : ''), name: (data&&data.reviewerName ? data.reviewerName : '')};
        this.reviewee = {id: (data&&data.revieweeID ? data.revieweeID : ''), name: (data&&data.revieweeName ? data.revieweeName : '')};
        this.source = (data&&data.source) ? data.source : null;
        this.publishedAt = (data&&data.publishedAt) ? data.publishedAt : null;
        this.createdAt = (data&&data.createdAt) ? data.createdAt : null;
        this.updatedAt = (data&&data.updatedAt) ? data.updatedAt : null;
        this.approvedAt = (data&&data.approvedAt) ? data.approvedAt : null;
        this.reviewUserType = (data&&data.reviewUserType) ? data.reviewUserType : null;
    }
}

module.exports = { userReviewResponse };