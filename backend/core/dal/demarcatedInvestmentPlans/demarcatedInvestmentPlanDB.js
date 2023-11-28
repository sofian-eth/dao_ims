const { QueryTypes } = require('sequelize');
const db = require('../../dbModels/index');


const createInvestmentPlan = async function(compiledInvestmentPlan,userID) {


    const transaction = await db.sequelize.transaction();
    try {
        let lastInsertedTradeActivityID=await db.sequelize.query(`select  id from tradeactivity order by id desc limit 1;`,{ type: QueryTypes.SELECT })
        lastInsertedTradeActivityID=lastInsertedTradeActivityID[0].id
        let lastDemarcatedUserAssetID=await db.sequelize.query(`select  id from demarcatedUserAssets order by id desc limit 1;`,{ type: QueryTypes.SELECT })
        lastDemarcatedUserAssetID=lastDemarcatedUserAssetID[0].id
        let insertionID=await db.sequelize.query('call sp_demarcated_add_investment_plan(?)', {replacements: [[
                        parseInt(compiledInvestmentPlan.propertyID),
                        compiledInvestmentPlan.entryRoundID,compiledInvestmentPlan.exitRoundID,
                        new Date(),new Date(),compiledInvestmentPlan.initialInvestmentAmount,
                        compiledInvestmentPlan.installmentType,compiledInvestmentPlan.totalCostOfOwnership,
                        compiledInvestmentPlan.bookedBy,
                        compiledInvestmentPlan.downPaymentPercentage,
                        JSON.stringify(compiledInvestmentPlan.unitPremiumCategory),compiledInvestmentPlan.spaceType,
                        lastDemarcatedUserAssetID
                    ]], transaction});
        insertionID=insertionID[0].investmentPlanID;
        for(let i=0;i<compiledInvestmentPlan.installments.length;i++){
            let installment=compiledInvestmentPlan.installments[i];
            await db.sequelize.query(`INSERT INTO demarcatedInvestorInstallments(demarcatedInvestmentPlanID, developmentRoundID, installmentArea, pricePerSqft, installmentNumber, installmentDueDate, createdAt, updatedAt)  
            VALUES (?,?,?,?,?,?,?,?)`, 
            {replacements: [insertionID,installment.roundID,installment.areaRequired,installment.pricePerSqft,installment.installmentNumber,installment.endDate,new Date(),new Date() ],transaction})
        }
        
        await transaction.commit();
        return true;
    } catch(e) {
        await transaction.rollback();
        throw e.toString();
    }
}

module.exports.createInvestmentPlan =createInvestmentPlan