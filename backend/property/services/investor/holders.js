

const areaHolderModel = require('../../Models/Investor/PersonalInformation/holders');


async function areaHolders(req,res,next){
    let err={};
    try {
        let pageNo = req.query.offset || 0;
        let recordSize = parseInt(req.query.size* pageNo) || 10;

        let areaHoldersData = await areaHolderModel.areaHolders(pageNo,recordSize);
        return res.status(200).json({error:false,message:'',data:areaHoldersData});


    } catch(error){
        console.log(error);
        err.statusCode = 400;
        err.message = "Error occurred in holder API";
        err.stackTrace = error;
        next(err);
        
    }
}



module.exports.areaHolders = areaHolders;