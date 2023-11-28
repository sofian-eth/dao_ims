module.exports = {
    'userDashboardModel':function(data){
      this.actualInvestmentValue =  data.actualInvestmentValue;
      this.currentInvestmentValue =  data.currentInvestmentValue;  
      this.totalAreaPurchased =  data.totalAreaUnits;
      this.futureProjection = data.futureProjections;

      this.currentValue =   data.currentValue;
      this.investorStats = data.investorStats;
      this.activeInvestments = data.activeInvestments;
      this.personalInformation = data.personalInformation ;
      this.investmentValueIncreasePercentage = data.investmentValueIncreasePercentage;
      this.futureProjectionsPercentage = data.futureProjectionsPercentage;
      this.reminders = data.reminders;
      this.graphValues = data.graphValues;
      this.investmentRoundIncreasePercentage = data.investmentRoundIncreasePercentage,
      this.estimatedProjectCompletionValue = data.estimatedProjectCompletionValue,
      this.estimatedMarketCompletionValue = data.estimatedMarketCompletionValue,
      this.estimation = data.estimation
      this._estimation = data._estimation
      this.reserveInvestment = data.reserveInvestment
      this.demarcatedUnits = (data.demarcatedUnits && Array.isArray(data.demarcatedUnits)) ? data.demarcatedUnits : []
      this.eidiReceiver = (data.eidiReceived && Array.isArray(data.eidiReceived)) ? data.eidiReceived : []
    }
  }
  
