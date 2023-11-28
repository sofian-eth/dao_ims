module.exports = {
  'transactionListingModal':function(data){
    this.ticketId =  data.ticketId;  
    this.projectName =  data.projectName;
    this.areaPledged =  data.areaPledged;
    this.totalAmount =   data.totalAmount;
    this.date =  data.Date;   
    this.paymentDeadline =  data.due_date;    
    this.status =  data.status;
    this.internalStatus =  data.internalStatus;
    this.sqftPrice = data.sqftPrice;
    this.roi = data.roi;
    this.forcasted = data.forcasted;
    this.transactionDate = data.transactionDate;
    this.propertyID = data.propertyID;
    this.roundName = data.roundName;
    this.medium = data.medium? data.medium: '';
    this.dealId = data.dealId? data.dealId: null;
    this.serviceDealId = data.serviceDealId? data.serviceDealId:null;
    this.type = data.type ? data.type : '';
    this.unitCode = data.unitCode ? data.unitCode : null;

  }
}

