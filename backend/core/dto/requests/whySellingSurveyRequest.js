class whySellingSurveyRequest {
    constructor(data, userid = 0){
        this.id = data.id ? data.id : 0;
        this.sellerID = userid > 0 ? userid : data.sellerID;
        this.reason = data.reason;
        this.requireDiscussion = data.requireDiscussion;
    }   
};

module.exports = { whySellingSurveyRequest }
  