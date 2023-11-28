const core = require('core');
const { notificationService } = require('../../../services/notification/notificationCenter');
const { logActivity } = require('../../../services/shared/activity-logger');
const fcmService = require('./../../../services/fcm/fcm.service');
const { getDealDetail } = require('core/dal/marketplace/ordersdb');
const ActionCategory = require('../../../resources/enum-Action-Category');
const ActivityEvent = require('../../../resources/enum-ActivityLog-event');

async function postDealReview( req, res, next ) {
    const { comment='', rating=0, orderItemID=0 } = req.body;
    const userID = req.decoded && req.decoded.id;
    const resp = new core.responseObject();
    let orderDetail = await core.ordersDB.getDealDetail(orderItemID);
    if( userID ) {
        try {
            const reviewId = await core.userReviewsDB.postReview(comment, rating, orderItemID, userID);
            notificationService.marketplaceReview(orderItemID);
            if( reviewId ) {
                 
                logActivity(
                    {
                            logName: ActionCategory.MARKETPLACE,
                            description: "Posted a review against deal of "+orderDetail.areaToSell+" sq. ft. to "+req.decoded.legalName+" in "+orderDetail.propertyName,
                            subjectID: reviewId,
                            subjectType: "userReviews",
                            event: ActivityEvent.ADDED,
                            causerID: userID,
                            causerType: "users",
                            properties: {
                                attributes:{
                                    dispID: orderItemID,
                                    orderItem:orderItemID},
                                old: null
                            },
                            source: null,
                            metadata:null
                        }
                        ,req)
                resp.setSuccess('Review posted successfully!');
                resp.data = { id: reviewId };
                return res.status(201).json(resp);
            } else {
                resp.setError('Please try again!');
                resp.data = null;
                return res.status(500).json(resp);
            }
        } catch(e) {
            resp.setError(e.toString());
            resp.data = null;
            return res.status(500).json(resp);
        }
    } else {
        resp.setError('Unauthorized!');
        resp.data = null;
        return res.status(401).json(resp);
    }
}
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */

 async function fetchAllPendingReviews(req, res, next) {

    let sendData;
    try {
        const results = await core.userReviewsDB.getAllPendingReviews(req.query.id,"all");
         
        res.Success(results.data,"SUCCESS");
        sendData=results.data
        console.log("Result : "+results)
        
    } catch (e) {
        res.Error(e.toString(), 'REQUEST_ERROR');
    }
    return sendData;
     
}

async function approveUserReviews(req, res, next) {
    const { updatedComment=null } = req.body;
    const { id: reviewId=0 } = req.params;
    const userID = req.decoded && req.decoded.id;
    const resp = new core.responseObject();
    if( userID ) {
        try {
            const result = await core.userReviewsDB.approveReview(reviewId, updatedComment);
            if( result ) {
                const reviewDetail = await core.userReviewsDB.getReviewDetails(reviewId)
                if(reviewDetail) {
                    notificationService.userReviewsApproved({
                        area: reviewDetail.areaPurchased,
                        propertyName: reviewDetail.propertyName,
                        from: reviewDetail.reviewedBy,
                        fromName: (reviewDetail.reviewedBy===reviewDetail.buyerID ? reviewDetail.buyerName : reviewDetail.sellerName),
                        to: reviewDetail.reviewedTo,
                        userType: (reviewDetail.reviewedTo===reviewDetail.buyerID ? 'BUYER' : 'SELLER'),
                        orderItemsID: reviewDetail.orderItemsID
                    });
                    fcmService.userReviewsApproved(reviewDetail)
                }
                resp.setSuccess('Review updated successfully!');
                resp.data = result;
                return res.status(201).json(resp);
            } else {
                resp.setError('Please try again!');
                resp.data = null;
                return res.status(500).json(resp);
            }
        } catch(e) {
            resp.setError(e.toString());
            resp.data = null;
            return res.status(500).json(resp);
        }
    } else {
        resp.setError('Unauthorized!');
        resp.data = null;
        return res.status(401).json(resp);
    }
}

module.exports = {
    postDealReview,
    fetchAllPendingReviews,
    approveUserReviews,
};