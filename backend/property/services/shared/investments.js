
const calculateEarnedROI = function(currentAmount, investedAmount, monthsDiff) {
    return monthsDiff!=0 && investedAmount!=0 ? (((((currentAmount-investedAmount)/investedAmount)*100)/monthsDiff)*12).toFixed(2) : 0;
};

const calculateForecastedROI = function(finalRoundMarketPrice, areaPledged, investedAmount) {
    return investedAmount!=0 ? ((((((finalRoundMarketPrice*areaPledged)-investedAmount)/investedAmount)*100))).toFixed(2) : 0;
};

module.exports = { 
    calculateEarnedROI,
    calculateForecastedROI,
 };