module.exports = {
    'fundingRoundModel': function (data) {
        this.roundID = data.id;
        this.roundName = data.roundName;
        this.roundStartDate = data.startDate;
        this.roundEndDate = data.endDate;
        this.totalFunds = data.totalFunds;
        this.locked = data.locked;
        this.areaRemaining = data.areaRemaining;
        this.roundPrice = data.roundPrice;
        this.marketPrice = data.marketPrice;
        this.roundNumber = data.roundNumber;
        this.totalRound = data.totalRound;
        this.status = data.status;
        this.discount = data.discount;
        

        
   }   
};





