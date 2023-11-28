const core = require('core');
const { getBuyerOrderItemDetails } = require('core/dal/marketplace/ordersdb');
const { logActivity } = require('../../../services/shared/activity-logger');
const ActionCategory = require('../../../resources/enum-Action-Category');
const ActivityEvent = require('../../../resources/enum-ActivityLog-event');

async function creatExtendTimeRequest( req, res, next ) {
    let resp = new core.responseObject();
    const { orderItemID=null } = req.body;
    if( orderItemID ) {
        const orderDetail = await core.ordersDB.getOrder(orderId)
        const result = await core.orderTimeExtensionRequestsdb.extendTimeRequest(orderItemID);
        if( result ) {
            resp.setSuccess('time extension request created successsfully!');
            try{
                logActivity(
                    {
                        logName: "DAO Listings",
                        description: "Requested time extension against deal of "+orderDetail.data[0].minimumLotSize+" sq. ft. to "+req.decoded.legalName+" in "+orderDetail.data[0].propertyName,
                        subjectID: req.body.subjectID,
                        subjectType: "listings",
                        event: ActivityEvent.CREATED,
                        causerID: req.body.causerID,
                        causerType: "users",
                        properties: {
                            attributes: null,
                            old: null
                        },
                        source: null,
                        metadata:null
                    }
                    ,req)
            }catch(error){
                console.log(error)
            }
            return res.status(200).json(resp);
        } else {
            resp.setError('time extension request not created.');
            return res.status(200).json(resp);
        }
    } else {
        resp.setError('time extension request not created.');
        return res.status(200).json(resp);
    }
}

module.exports = {
    creatExtendTimeRequest
 };