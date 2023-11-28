const blockchainUtils = require('../../utility/blockchain-query');
const areaUtils = require('../../utility/area-conversion');
async function elementsTotalSupply(req, res, next) {
    let err = {};
    try {
        const elementsTotalArea = await blockchainUtils.tokenSupply();
        const elementsArea = await areaUtils.convertToSqft(elementsTotalArea);

        return res.status(200).json({ error: false, message: '', data: elementsArea });
    } catch (error) {

        err.statusCode = 400;
        err.message = 'Error occurred in fetching total Supply';
        err.stackTrace = error;
        next(err);
    }

}


async function elementsCirculationSupply(req, res, next) {
    let err = {};
    try {
        let elementsCirculationArea = await blockchainUtils.circulationTokens();
        let finalCirculationArea = await areaUtils.convertToSqft(elementsCirculationArea);

        return res.status(200).json({ error: false, message: '', data: finalCirculationArea });
    } catch (error) {
      
        err.statusCode = 400;
        err.message = 'Error occurred in fetching circulation Supply';
        err.stackTrace = error;
        next(err);
    }

}


module.exports.elementsTotalSupply = elementsTotalSupply;
module.exports.elementsCirculationSupply = elementsCirculationSupply;