const db = require('../../dbModels/index');
const { QueryTypes } = require("sequelize");

const responseObject = require('../../dto/response/response-model');
const { userReviewResponse } = require('../../dto/response/userReviewResponse');

const postReview = async function(_comment, _rating, _orderItems_id, _user_id) {
    const posted = await db.sequelize.query("CALL sp_post_marketplace_deal_reviews(:_comment, :_rating, :_orderItems_id, :_user_id)", {replacements: { _comment, _rating, _orderItems_id, _user_id } });
    if( posted && posted.length > 0 && posted[0] && posted[0].status==='true' ) {
        return posted[0].id;
    } else {
        return false;
    }
};

const approveReview = async function(reviewId, updatedComment=null) {
    if( updatedComment!==null ) {
        const updated = await db.sequelize.query(`UPDATE userReviews SET old_comment=userReviews.comment, userReviews.comment='${updatedComment}', userReviews.approvedAt=NOW(), userReviews.updatedAt=NOW() WHERE userReviews.id=${reviewId}`, { type: QueryTypes.UPDATE })
        return updated;
    } else {
        const updated = await db.sequelize.query(`UPDATE userReviews SET userReviews.approvedAt=NOW(), userReviews.updatedAt=NOW() WHERE userReviews.id=${reviewId}`, { type: QueryTypes.UPDATE })
        return updated;
    }
};

/**
 * 
 * @param {String} obj 
 * @returns {Promise<responseObject>}
 */
 async function getAllPendingReviews(id){
    let resp = new responseObject();
    try{
       
        let result = await db.sequelize.query(`select property.id, userReviews.orderItemsID, userReviews.id, reviewer.legalName as reviewerName, reviewee.legalName as revieweeName, userReviews.createdAt, userReviews.comment, userReviews.rating, userReviews.reviewedBy, userReviews.reviewedTo, userReviews.approvedAt from userReviews 
        join orderItems on userReviews.orderItemsID = orderItems.id 
        join orders on orderItems.orderID = orders.id 
        join property on orders.propertyID = property.id 
        INNER JOIN users reviewee ON reviewee.id=userReviews.reviewedTo 
        INNER JOIN users reviewer ON reviewer.id=userReviews.reviewedBy 
        where approvedAt is null AND property.id = ${id}
        `);
        resp.setSuccess("Reviews fetching successfully");
        const _result = [] = result[0]
        resp.data = _result.map(x => new userReviewResponse(x));
        console.log(resp.data)
        return resp
    }
    catch(error){
        console.log("ex", error);
        resp.setError(error.toString(), "Failed while fetching review");
        return resp;
    }

}

async function getReviewDetails(id) {
    const result = await db.sequelize.query(`SELECT userReviews.*,orderItems.buyerID, orders.sellerID, buyer.nickName as buyerName, seller.nickName as sellerName, orderItems.areaPurchased, property.name as propertyName, buyer.device_token as buyerDeviceToken, seller.device_token as sellerDeviceToken FROM userReviews INNER JOIN orderItems ON orderItems.id=userReviews.orderItemsID INNER JOIN orders ON orders.id=orderItems.orderID INNER JOIN users buyer ON buyer.id=orderItems.buyerID INNER JOIN users seller ON seller.id=orders.sellerID INNER JOIN property ON property.id=orders.propertyID WHERE userReviews.id=${id}`, { type: QueryTypes.SELECT });
    if( result && result.length > 0 ) {
        return result.pop();
    } else {
        return null;
    }
}

module.exports = {
    postReview,
    getAllPendingReviews,
    approveReview,
    getReviewDetails
};