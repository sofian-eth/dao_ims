const mileStoneModel = require('../../../Models/Property/getmilestones');
const milestoneDTO = require('../../../dto/milestone-model');
const  awsService = require('../../shared/media');
async function fetchRoundMilestones(req,res,next){
    try {
    } catch (err) {}
}

async function updateMilestoneProgress(req,res,next){
    try {
    } catch (err) {}
}


async function activeRoundMilestones(req,res,next){
    try {
    } catch (err) {}
}


async function projectMilestones(req,res,next){
    let err = {};
    try {
        let responseArr = [];
        let milestoneData = await mileStoneModel.projectMilestones(req.query.projectID);
       
        for (milestone of milestoneData){
            // let mediaUrl = '';
            // // if(milestone.mediaId)
            // //     mediaUrl = await awsService.getMediaTest(milestone.mediaId);
           // milestone.mediaUrl = mediaUrl;
            let response = new milestoneDTO.milestoneModel(milestone);
            responseArr.push(response);
        }
        

        return res.status(200).json({error:false,message:'',data:responseArr});

    } catch(error){
        console.log(error);
        err.statusCode = 400;
        err.message = "Error occurred in fetching funding project milestones ";
        err.stackTrace = error;
        next(err);
    }
}


module.exports.fetchRoundMilestones = fetchRoundMilestones;
module.exports.updateMilestoneProgress = updateMilestoneProgress;
module.exports.activeRoundMilestones  = activeRoundMilestones;
module.exports.projectMilestones = projectMilestones;
