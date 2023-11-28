const core = require('core');


const accumulateArea = async function(req,res,next) {
    let resp = new core.responseObject();
    const { id=0 } = req.params;
    const { area=0 } = req.body;
    let userID = req.decoded && req.decoded.id ? req.decoded.id : 0;
    const result = await core.demarcatedAreaUnitDB.userAssetAccumulatedArea(userID, id, area)
    try {
        if( result ) {
            resp.setSuccess('Area accumulated successfully!');
            resp.data = null;
            return res.status(200).json(resp);
        } else {
            resp.setError(e.toString());
            resp.data = null;
            return res.status(500).json(resp);
        }
    } catch(e) {
        resp.setError(e.toString());
        resp.data = null;
        return res.status(500).json(resp);
    }
}

module.exports = { accumulateArea };