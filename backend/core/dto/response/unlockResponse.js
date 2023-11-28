class unlockAreaResponse{
    constructor(obj={}){
        this.id = obj.id?obj.id:0;
        this.area = obj.area?obj.area:0;
        this.userId = obj.userId?obj.userId:0;
        this.reason = obj.reason?obj.reason:'';
        this.propertyId = obj.propertyId?obj.propertyId:0;
        this.approvedArea = obj.approvedArea?obj.approvedArea:0;
        this.legalName = obj.legalName?obj.legalName:'';
        this.name=obj.name?obj.name:'';
        this.propertySymbol=obj.propertySymbol?obj.propertySymbol:'';
        this.propertyLogo=obj.propertyLogo?obj.propertyLogo:'';
        this.firstName=obj.firstName?obj.firstName:'';
        this.lastName=obj.lastName?obj.lastName:'';
        this.nickName=obj.nickName?obj.nickName:'';
        this.status=obj.status?obj.status:'';
        this.createdAt = obj.createdAt?obj.createdAt:new Date();
        this.matureMarketplacePrice =obj.matureMarketplacePrice?obj.matureMarketplacePrice:0;
    }
}
class userUnlockAreaResponse{
    constructor(obj={}){
        this.id= obj.id?obj.id:0
        this.propertyId= obj.propertyId?obj.propertyId:0
        this.propertyLogo= obj.propertyLogo?obj.propertyLogo:""
        this.approvedArea= obj.approvedArea?obj.approvedArea:0
        this.name= obj.name?obj.name:""
        this.category= obj.category?obj.category:""
        this.salesAgreementLink= obj.salesAgreementLink?obj.salesAgreementLink:""
        this.termsLink= obj.termsLink?obj.termsLink:""
        this.totalSqft= obj.totalSqft?obj.totalSqft:0
        this.unlocked= obj.unlocked?obj.unlocked:0
        this.propertySymbol= obj.propertySymbol?obj.propertySymbol:0
        this.reqCount= obj.reqCount?obj.reqCount:0
        this.pendingRequestsArea = obj.pendingRequestsArea ? obj.pendingRequestsArea : 0;
        this.expectedDate = obj.expectedDate ? obj.expectedDate : null;
        this.currentRoundPricePerSqft = obj.currentRoundPricePerSqft ? obj.currentRoundPricePerSqft : 0,
        this.lastRoundPricePerSqft = obj.lastRoundPricePerSqft ? obj.lastRoundPricePerSqft : 0,
        this.propertyBanks = obj.propertyBanks ? obj.propertyBanks : [],
        this.reason = obj.reason?obj.reason:'',
        this.marketplaceThumbnail = obj.marketplaceThumbnail?obj.marketplaceThumbnail:null,
        this.lastAreaUnlockRequest = obj.lastAreaUnlockRequest?obj.lastAreaUnlockRequest:null,
        this.portfolioBalance = obj.portfolioBalance?obj.portfolioBalance:null,
        this.matureMarketplacePrice =obj.matureMarketplacePrice?obj.matureMarketplacePrice:null
    }
}

module.exports = {unlockAreaResponse,userUnlockAreaResponse}