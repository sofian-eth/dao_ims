//const projectModel = require('../../models/DevelopmentRounds');
const {developmentrounds} = require('../../models/index');
const { Op, QueryTypes } = require("sequelize");

async function elementsActiveRound(req, res, next) {
    
    let err = {};
 
    try {
        let rawProjectRoundQuery = "select d.roundName,d.pricePerSqft from developmentrounds as d inner join statusenum as s on s.id = d.statusID where s.name='Active';";
        const activeRoundDetails = await sequelize.query(rawProjectRoundQuery, { type: QueryTypes.SELECT });
        return res.status(200).json({ error: false, message: '', data: activeRoundDetails });
    } catch (error) {
        err.statusCode = 400;
        err.message = 'Error occurred in fetching active round pricing';
        err.stackTrace = error;
        next(err);
    }
}


module.exports.elementsActiveRound = elementsActiveRound;