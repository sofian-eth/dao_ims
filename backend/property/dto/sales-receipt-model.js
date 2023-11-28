
const utility = require('../utils/utils');
const moment = require('moment');

module.exports={
    "salesReceipt": function(data){
            this.site_url = process.env.ASSETS_URL, //data.assetUrl,
           //this.site_url = "http://localhost:8081/assets"
            this.daoID = data.userId,
            this.queuenumber =  data.queueNumber || data.queuenumber,
            this.status =  (data.status=="verified" || data.status=="pending") ? "pending" : (data.status=="locked") ? "confirmed" : (data.status=="discard") ? "discarded": (data.status=="approved") ? "In Progress":"",
            this.status_class =  (data.status=="approved")?"InProgress":this.status,
            this.dueDate = moment(data.dueDate,'MMM DD,YYYY').format('MMM DD,YYYY'),
            this.id = data.projectID,
            this.projectName = data.name,
            this.areaPledged = utility.thousandseparator(data.areaPledged),
            this.round = data.roundName,
            this.sqftPrice = utility.currencyformat(data.roundPrice),
            this.amount = utility.currencyformat(data.totalCost),
            this.name = data?.agentLegalName
            this.contactNo =  data?.agentPhoneNumber,
            this.email = data?.agentEmail ,
            this.noOfBanks = 2,
            this.subTotal = utility.currencyformat(data.totalCost),
            this.advanceTax = utility.currencyformat(data.totalTaxCost),
            this.total = utility.currencyformat(data.totalCost + data.totalTaxCost),
            this.amountPaid = utility.currencyformat((data.payDate) ? data.totalCost : 0),
            this.balance = utility.currencyformat(data.totalCost + data.totalTaxCost),
            this.paymentInfo = {
                bankInfo: data?.banks
            }
    }
}