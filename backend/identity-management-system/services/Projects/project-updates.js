const youtubeFeed = require('../../utility/youtube');

async function fetchYoutubeUpdates(req, res, next) {
    try {
        const youtubeFeedData = await youtubeFeed.fetchElementsUpdate();
        return res.status(200).json({ error: false, message: '', data: youtubeFeedData });
    } catch (error) {
       
        let err = {};
        err.statusCode = 400;
        err.message = error;
        err.stackTrace = error;
        next(err);
    }
}


module.exports.fetchYoutubeUpdates = fetchYoutubeUpdates;