class refferalDataResponse {
    constructor(data, userID) {
        let meObj = data.filter(x => x.userID == userID);
        this.me = meObj && meObj.length > 0 ? meObj[0] : null;
        this.topFive = data.filter(x => x.rank < 6);
    }
};

class refferalData {
    constructor(data) {
        this.userID = data.id ? data.id : 0;
        this.name = data && data.name ? data.name : data.name;
        this.createdAt = data && data.createdAt ? data.createdAt : '';
        this.signUps = data && data.signUps ? data.signUps : 0;
        this.leadsConverted = data && data.leadsConverted ? data.leadsConverted : 0;
        this.rank = 0;
        this.myRefferals = data.myRefferals ? data.myRefferals : null;
        this.processedRewards = data.processedRewards ? data.processedRewards:0;
    }
};

class userRefferalDataResponse {
    constructor(data, index) {
        this.rank = data[index].rank;
        this.referralCount = data[index].signUps;
        this.requiredRefferals = data[index - 1] ? (data[index - 1].signUps - data[index].signUps) : 0;
        this.NextRank = data[index - 1] ? data[index - 1].rank : data[index].rank;  
        this.myRefferals= data[index].myRefferals ? data[index].myRefferals:[];
        this.processedRewards=data[index].processedRewards
    }
};

module.exports = { refferalDataResponse, refferalData, userRefferalDataResponse }
