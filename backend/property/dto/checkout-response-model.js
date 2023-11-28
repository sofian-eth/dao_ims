module.exports = {
    'checkoutResponseModel':function(data){
      this.ticketNo =  data.ticketNo;  
      this.projectName =  data.projectName;
      this.status = data.status;
      this.paymentDate = data.paymentDate;
      this.completedRound = data.completedRound;
      this.totalRound = data.totalRound;
      this.areaPledge = data.areaPledge;
      this.totalCost = Math.round(data.totalCost);
      this.salesAgentName = data.salesAgentName;
      this.salesAgentEmail = data.salesAgentEmail;
      this.currentDate = data.currentDate; 
  },
};
  
   