const core = require("../..");

class unlockAreaRequest{
    constructor(obj={}){
        this.id = obj.id?obj.id:0;
        this.area = obj.area?obj.area:0;
        this.userId = obj.userId?obj.userId:0;
        this.propertyId = obj.propertyId?obj.propertyId:0;
        this.reason = obj.reason?obj.reason:null
    }
    /**
     * 
     * @returns {Boolean}
     */
    validate(){
        return (this.area&&this.userId&&this.propertyId);
    }
    /**
     * 
     * @returns {Promise<responseObject>}
     */
    async save(){
        return await core.ordersDB.requestAreaUnlock({...this});
    }
    /**
     * 
     * @param {String} type 
     * @returns 
     */
    async getAllRequests(id,type = "all"||"pending"){
        return await core.ordersDB.getAllRequests(id,type);
    }
    /**
     * 
     * @param {String} type 
     * @returns 
     */
    async getAllPendingReviews(id){
        await core.userReviewsDB.getAllPendingReviews(id).then(x=>{
            return x;
        });
    }

    async changeRequestStatus(id,resp,area){        
        return await core.ordersDB.changeRequestStatus(id,(resp==1?"approved":"rejected"),area);
    }
    
}
class userUnlockAreaRequest{
    constructor(obj={}){
        this.userId = obj.userId?obj.userId:0;
    }
        /**
     * 
     * @returns {Promise<responseObject>}
     */
    async getUserProjectUnlockedArea(){
        return await core.ordersDB.getUserProjectUnlockedArea(this.userId);
    }
}
module.exports = { unlockAreaRequest,userUnlockAreaRequest };