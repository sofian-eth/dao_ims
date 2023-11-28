
const projectInformationModel = require('../../../Models/Property/information');

const youtubeFeedService = require('../../../utils/youtube');
async function youtubeFeed(req,res,next){
    let err={};
    try {
        let projectID = req.query.id || 1;
        let data = {};
      

        let projectInformation = await projectInformationModel.projectInformation(projectID);
        data.youtubeFeed = projectInformation.youtubeFeed;
        let youtubeFeed = await youtubeFeedService.fetchVideos(data.youtubeFeed);
      
        return res.status(200).json({error:false,message:'',data:youtubeFeed});

    } catch (error){
     
        err.statusCode = 400;
        err.message = "Error occurred in fetching playlist";
        err.stackTrace = error;
        next(err);
    }

}

module.exports.youtubeFeed = youtubeFeed;