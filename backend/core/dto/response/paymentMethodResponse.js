class paymentMethodResponse {
    constructor(data) {
        const { id=0, name=null, title=null, number=null, ibans=null, branch=null,logo=null } = data;
        this.id = id;
        this.name = name;
        this.title = title;
        this.number = number;
        this.ibans = ibans;
        this.branch = branch;
        this.bankLogo = logo;
    }
}

module.exports = { paymentMethodResponse }
