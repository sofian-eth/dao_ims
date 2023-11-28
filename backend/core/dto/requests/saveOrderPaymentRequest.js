class saveOrderPaymentRequest {
    constructor(data){
        this.id = data.id ? data.id : 0;
        this.amount = data.amount ? data.amount : 0;
        this.parentID = data.parentID ? data.parentID : 0;
        this.paidDate = data.paidDate ? data.paidDate : '';
        this.paymentMethod = data.paymentMethod ? data.paymentMethod : '';
        this.media = data.media ? data.media : [];
        /*
        ENUM
        pending - available to buy / bid on marketplace
        paid - order fulfilled - blockchain request confirmed / sent        
        approved - admin approving (should be directly approved) or sending to blockchain
        disputed - in a dispute
        reversed - Listing/Order is waiting for payment confirmation from buyer
        discarded - in a dispute
        */
        this.status = data.status ? data.status : 'pending';

        /*
        ENUM
        token - available to buy / bid on marketplace
        serviccharges - order fulfilled - blockchain request confirmed / sent        
        others - admin approving (should be directly approved) or sending to blockchain
        */
        this.type = data.type ? data.type : 'token';
    }
   
};

module.exports = {saveOrderPaymentRequest}
  