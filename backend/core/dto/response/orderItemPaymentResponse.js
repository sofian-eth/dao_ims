class orderItemPaymentResponse {
    constructor(data) {
        this.id = data.id ? data.id : 0;
        this.amount = data.amount ? data.amount : 0;
        this.status = data.status ? data.status : null;
        this.type = data.type ? data.type : 'other';
        this.createdAt = data.createdAt ? data.createdAt : null;
        this.updatedAt = data.updatedAt ? data.updatedAt : null;
        this.paidDate = data.paidDate ? data.paidDate : null;
        this.bankName = data.bankName ? data.bankName : '';
        this.bankLogo = data.bankLogo?data.bankLogo:null;
        this.accountNumber = data.accountNumber?data.accountNumber:null;
        this.proof = data.proof ? data.proof : [];
        // service Charges specific
        this.serviceChargesMethod = data.serviceChargesMethod ? data.serviceChargesMethod : 'area';
        this.area = data.area ? data.area : 0;
        this.percentageArea = data.percentageArea ? data.percentageArea : 0;
    }

    setProof(_proofObject){
        this.proof.push(new paymentProofResponse(_proofObject));
    }
}

class paymentProofResponse {
    constructor(data) {
        this.url = data ? data.url : '';
        this.fileName = data ? data.originalFileName : '';
        this.fileSize = data ? data.size : 0;
        this.fileType = data ?data.extension : '.jpg';
    }
}

module.exports = { orderItemPaymentResponse }
