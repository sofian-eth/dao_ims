const { getAreaAvailableForUser } = require("../../dal/marketplace/ordersdb");
const {p2p2Popup,hidePopup,checkPortfolio,editRecipient,deleteRecipient, allProperties,getProperties,checkWalletAddress,sellerName,projectName, transferArea,transferAreaOwner,recentTransferArea,frequentRecipients,postFrequentRecipients,myArea,getReceiptData,checkOwner} = require("../../dal/peerToPeer/peerToPeer");

class transferAreaRequest{
    constructor(obj={}){
        this.walletAddress = obj.walletAddress?obj.walletAddress:"";
        this.project = obj.project?obj.project:"";
        this.area = obj.area?obj.area:"";
        this.userId = obj.userId?obj.userId:0;
        this.buyerId = obj.buyerId?obj.buyerId:0;
        this.ownerId = obj.ownerId?obj.ownerId:"";
        this.ownerCharges = obj.ownerCharges?obj.ownerCharges:"";
        this.tradeID = obj.tradeId?obj.tradeId:0;
        this.pageno = obj.pageno ? obj.pageno:1;
        this.pagesize = obj.pagesize ? obj.pagesize : 50;
        this.search = obj.search?obj.search:"";
        this.recipientId = obj.recipientId?obj.recipientId:0;
        this.recipientName = obj.recipientName?obj.recipientName:"";
        this.network = obj.network?obj.network:0;
        this.recipientId = obj.recipientId?obj.recipientId:0;
        this.chargesPaidBy = obj.chargesPaidBy?obj.chargesPaidBy:"";
        this.propertyId = obj.propertyId?obj.propertyId:0;
        this.chargesPaidBy = obj.chargesPaidBy?obj.chargesPaidBy:"";
        this.transferTo = obj.transferTo?obj.transferTo:0;
        this.serviceChargesPercet = obj.serviceChargesPercet?obj.serviceChargesPercet:0;
        this.receiverId = obj.receiverId?obj.receiverId:0;
        this.areaToOwner = obj.areaToOwner?obj.areaToOwner:0;
        this.areaToReceiver = obj.areaToReceiver?obj.areaToReceiver:0;
        this.p2pDetail = obj.p2pDetail?obj.p2pDetail:null;

        // area: 1
        // chargesPaidBy: "receiver"
        // network: "eth"
        // propertyId: 2
        // serviceCharges: 0.95
        // transferTo: 5
        /**
         * @returns {Boolean}
         */
        this.validate = ()=>{   
            if(this.walletAddress&&this.propertyId&&this.area){
                return true;
            }else{
                return false;
            }
        }
        this.validateAddressField = ()=>{     
            if(this.walletAddress){
                return true;
            }else{
                return false;
            }
        }

        /**
         * @returns {Boolean}
         */
        this.checkAreaAvailable = async () =>{
            const areaavailable = (await getAreaAvailableForUser(this.project,this.userId));
            console.log('areaavailable : ',areaavailable)
            return areaavailable>0;
        }

        /**
         * @returns {Boolean}
         */
        this.checkWalletAddress = () =>{
            return checkWalletAddress(this.walletAddress,this.userId);
        }
        this.getProperties = () =>{
            return getProperties(this.walletAddress);
        }
        this.allProperties = () =>{
            return allProperties();
        }
        this.sellerName = () =>{
            return sellerName(this.userId,this.network);
        }
        this.projectName = () =>{
            return projectName(this.userId,this.propertyId);
        }
        /****
         * 
         * propertyid area=> areaPledged , userId => sellerID =>walletAddres->buyer =>buyerID, Status => 2
         * 
         ****/
       
        this.transferArea = async () => {
            return await transferArea(this)
        }
        this.transferAreaOwner = async () => {
            return await transferAreaOwner(this)
        }
        
        this.recentTransferArea = async () => {
            return await recentTransferArea(this.userId,this.pageno,this.pagesize,this.search)
        }
        this.frequentRecipients = async () => {
            return await frequentRecipients(this.userId,this.pageno,this.pagesize,this.search)
        }
        this.postFrequentRecipients = async () => {
            return await postFrequentRecipients(obj)
        }
        this.myArea = async () => {
            return await myArea(this.userId)
        }
        this.getReceiptData = async () => {
            return await getReceiptData(this.tradeID)
        }
        this.hidePopup = async () => {
            return await hidePopup(this.userId)
        }
        this.deleteRecipient = async () => {
            return await deleteRecipient(obj)
        }
        this.editRecipient = async () => {
            return await editRecipient(obj)
        }
        this.checkOwner = async () => {
            return await checkOwner(this.propertyId)
        }
        this.p2p2Popup = async () => {
            return await p2p2Popup(this.userId)
        }
    }
    
    
}
module.exports = {transferAreaRequest};