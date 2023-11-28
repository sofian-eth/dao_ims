const { knex } = require("core/models/db")


const getInvestmentReportCountSP = function(userID,projectID,startDate,endDate){

    return knex.transaction(trx => {
        return knex.raw(
          'call sp_report_get_active_investments_count(?)',
          [[userID,projectID,startDate,endDate]]
        )
      })
      .then(function(result) {
        return result;
      })
      .catch((error)=>{
        console.log(error)
      })
} 


const getInvestmentSummaryBreakDown = function(userID){

    return knex.transaction(trx => {
        return knex.raw(
          'call sp_report_get_investment_summary_breakdown(?)',
          [userID]
        )
      })
      .then(function(result) {
        return result;
      })
      .catch((error)=>{
        console.log(error)
      })
} 


module.exports = { 
  getInvestmentReportCountSP, 
  getInvestmentSummaryBreakDown
};