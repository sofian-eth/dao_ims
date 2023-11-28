const propertyModal = require("../../../Models/Property/information");
const propertyImagesModal = require("../../../Models/Property/propertyimages");
const propertyDocumentModal = require("../../../Models/Property/propertydocument");
const roundsModel = require("../../../Models/Property/getrounds");
const projectInformationDTO = require("../../../dto/project-information-model");

const propertyStats = require("../../../Models/Property/propertystats");
const bankInformationModel = require("../../../Models/Property/bank-information");
const areaSelectionMatrix = require("../../../Models/Property/area-selection-matrix");
const fundingRoundDetails = require("../../../Models/Property/fundingrounddetails");
const mediaService = require('../../../services/shared/media');
const areaHolderModel = require('../../../Models/Investor/PersonalInformation/holders');
const projectServiceAccount = require('../../../Models/Property/service-account');
const balanceModel = require('../../../Models/Investor/PersonalInformation/userportfolio');
const numberFormatterUtils = require('../../../utils/number-formatter');
const { logActivity } = require('../../shared/activity-logger');
const core = require('core');
const moment = require("moment");

const propertyCoreModel = require("core/dal/propertydb");

async function getRoundDetail(req, res, next){
  const projectID = parseInt(req.query.projectID);
  roundsModel.getRoundDetail(projectID).then(result =>{
    res.send(result[0][0])
  }).catch(error =>{
    res.send(error);
  });
}

async function projectDetail(req, res, next) {
  let err = {};
  let data = {};
  data.projectRating = "4";
  data.projectScore = "800/1000";
  data.totalInvestor = "50";
  data.projectCompletionPercent;
  data.youtubeFeed = [];
  let {projectID, excludeTransacID=0,roundID,roundStatus} = req.query;
  let userID = req.decoded.id ;

  let todaysDate = moment();
  let projectVideoGallery=[];
  let projectImageGallery=[];


  try {

    // Project Detail
    let projectDetail = await propertyModal.projectInformation(projectID, true);
    // Fetch only if project information is active

    if( projectDetail && projectDetail.category && projectDetail.category==="mature" ) {
      return res
      .status(404)
      .json({ error: true, message: "", data: { errorCode: 'ACCESSING_MATURE_PROPERTY' } });
    }
  
    if(projectDetail || projectDetail.length) {
          if(roundID == undefined || roundID == '0'){
            roundID = await roundsModel.getActiveRoundID(projectID);
          }

          let projectMatrixDetail = await propertyModal.projectMatrix(projectID);
          let projectRiskDetail = await propertyModal.projectRisk(projectID);
          let projectScoreDetail = await propertyModal.projectScore(projectID);
          

          let projectImageId = await propertyImagesModal.projectImages(projectID);
          let totalInvestors = await areaHolderModel.totalInvestors(projectID);
          let serviceAccountId = await projectServiceAccount.propertyServiceAccount(projectID);


          for (image of projectImageId){
          
            let mediaUrl = await mediaService.getMediaTest(image.mediaID);
            projectImageGallery.push(mediaUrl);
          }


          let projectVideoId = await propertyImagesModal.projectVideos(projectID);
          for (video of projectVideoId){
            let videoUrl = 'https://www.youtube.com/embed/'+video.videoid;
            projectVideoGallery.push(videoUrl);
          }
          let projectDocument = await propertyDocumentModal.projectDocument(
            projectID
          );


          let activeRoundData = await roundsModel.activeRoundPricing(projectID,roundID);
          let completedRound = await roundsModel.completedRound(projectID);
          let fundingRounds = await roundsModel.totalFundingRounds(projectID);
          data.completion = completedRound.completedRound+1;
          data.fundingRounds = fundingRounds.fundingRounds;

          data.projectCompletionPercent = projectDetail.completedPercentage;
          data.roundPrice = activeRoundData.pricePerSqft;
          data.activeRound = activeRoundData.roundName;
          data.marketPrice = activeRoundData.marketPrice;
          data.totalFunds = activeRoundData.funds;
          data.startDate = activeRoundData.displayStartDate;
          data.endDate= activeRoundData.displayEndDate;

          data.discount = Math.floor((data.roundPrice / data.marketPrice) * 100);
          data.discount = 100 - data.discount;



          data.currentRoundCount = await roundsModel.currentRoundCount(projectID,roundID);
          
          //  Area Left and Area Locked Logic
          let areaLeft = 0;
          if(roundStatus == 'Active'){
            areaLeft = await balanceModel.userBalance(serviceAccountId.ownerID,projectID);
          }else{
            let areaPurchase = await roundsModel.roundAreaPurchase(projectID,roundID);
            areaLeft = data.totalFunds - areaPurchase;
          }
          areaLeft = numberFormatterUtils.checkNegativeValue(areaLeft);
          let soldArea = numberFormatterUtils.checkNegativeValue(data.totalFunds - areaLeft);
          
          data.lockedAreaPercentage = numberFormatterUtils.checkMaximumPercentage(Math.round((soldArea/data.totalFunds)*100));  

          // Area Stats
          let pendingPledge = await fundingRoundDetails.pendingPledges(projectID,roundID);
          let reserveArea = await roundsModel.reserveArea(projectID,roundID);
          data.areaIOwn  = await roundsModel.areaIOwn(projectID,userID);
          data.reserveArea = reserveArea;

          data.areaLeft = areaLeft;
          data.areaLeftPercentage = numberFormatterUtils.checkMaximumPercentage(Math.floor((data.areaLeft/data.totalFunds)*100)); 
          data.maxArea = areaLeft;
          data.areaPledged = pendingPledge[0].pendingPledges ? pendingPledge[0].pendingPledges:0;
          data.overPledged = Math.abs(data.areaPledged - data.areaLeft);


          // Project Stats
          let projectStats = await propertyStats.propertyStats(projectID);
          data.minArea = projectStats.minArea || 1000;
          if(data.maxArea > projectStats.maxArea)
            data.maxSellableArea =projectStats.maxArea;
          else
            data.maxSellableArea = data.maxArea;

          


          let bankInformation = await bankInformationModel.bankInformation(projectID);
          let areaSelection = await areaSelectionMatrix.getMinimumAreaDemarcatedUnits(
            projectID
          );
          data.id = projectDetail.id;
          data.name = projectDetail.name;
          data.description = projectDetail.description;
          data.longDescription = projectDetail.longDescription;
          data.location = projectDetail.location;
          console.log("Location ",projectDetail.locationPoints);
          data.latitude = projectDetail.locationPoints ? projectDetail.locationPoints.x : null;
          data.longitude = projectDetail.locationPoints ? projectDetail.locationPoints.y : null;
          data.coverPhoto = projectDetail.coverPhoto;
          data.propertyLogo = projectDetail.propertyLogo;
          data.locationDescription = projectDetail.locationDescription;
          data.status = projectDetail.status;
          data.imageGallery = projectImageGallery;
          data.videoGallery = projectVideoGallery;
          data.documents = projectDocument;
          data.salesAgreement = projectDetail.salesAgreementLink;
          data.termServices = projectDetail.termsLink;
          data.projectScore = projectScoreDetail;
        
          data.philosophyTitle = projectDetail.philosophyTitle;
          data.philosophyDescription = projectDetail.philosophyDescription;
          data.risk = projectRiskDetail;
          data.matrixName = projectMatrixDetail;
          data.premiumFeatures = projectDetail.premiumFeatures;
          data.playlistID = projectDetail.youtubeFeed;
          
        

        

        
        
        
          // (total-funds - area locked)/total-funds

          
        
          data.rating = projectDetail.rating;
          data.daoScore = projectDetail.daoScore;
          data.investors = totalInvestors;
          data.reviewCount = projectDetail.reviewCount;
          data.peopleViewing = 100;
        
        
          
          data.completionYear = projectStats.completionArea || 2023;
          data.minimumInvestment = projectStats.minInvestment;
          data.type = projectStats.type;

          data.bankInformation = bankInformation;
          data.areaSelection = areaSelection;
          data.isDemarcated = projectDetail.isDemarcated;
          data.handbookUrl = projectDetail.handbookUrl;
          data.propertyNearBy = projectDetail.propertyNearBy;
          data.viewPlan = projectDetail.viewPlan;
          data.planDescription = projectDetail.planDescription;
  } 


    let responseObject = new projectInformationDTO.projectInformationModel(
      data
    );
    try{
        core.propertyDB.readPropertyRequest(projectID,userID);

      //debugger
      logActivity(
        {
          logName: "Manage Property",
          description: "Viewed property details for "+data.name,
          subjectID: projectDetail.id,
          subjectType: "property",
          event: "Viewed",
          causerID: userID,
          causerType: "users",
          properties: {
              attributes: {
                projectId : data.id,
                projectName : data.name,
                totalSqFt : data.totalSqFt,
              },
              old: null
          },
          source: null,
          metadata:null
      }
      ,req)
    }catch(error){
      console.log(error)
    }
    return res
      .status(200)
      .json({ error: false, message: "", data: responseObject });
  } catch (error) {
    console.log(error);
    err.statusCode = 400;
    err.message = "Error occurred in fetching project details";
    err.stackTrace = error;
    next(err);
  }
}

async function matureProjectDetail(req,res,next){
  let err = {};
  try {
    let projectImageGallery = [];
    let projectVideoGallery = [];
    let data = {};
    let userID = req.decoded.id ;
   
    let {projectID, projectCategory} = req.query;
    let propertyDetail =  await core.propertyDB.getPropertyDetail(projectID,projectCategory);
  
    let propertyStakeHolders = await core.propertyDB.getPropertyStakeholder(projectID);


   
    
    
    let projectImageId = await propertyImagesModal.projectImages(projectID);
    for (image of projectImageId){
          
      let mediaUrl = await mediaService.getMediaTest(image.mediaID);
      projectImageGallery.push(mediaUrl);
    }

    data =  propertyDetail;

    data.latitude = propertyDetail.locationPoints ? propertyDetail.locationPoints.coordinates[0] : null;
    data.longitude = propertyDetail.locationPoints ? propertyDetail.locationPoints.coordinates[1] : null;

    let projectVideoId = await propertyImagesModal.projectVideos(projectID);
    for (video of projectVideoId){
      let videoUrl = 'https://www.youtube.com/embed/'+video.videoid;
      projectVideoGallery.push(videoUrl);
    }

    data.imageGallery = projectImageGallery;
    data.videoGallery = projectVideoGallery;
    data.propertyStakeHolders = propertyStakeHolders;
    let responseObject = new projectInformationDTO.projectInformationModel(
      data
    );
    core.propertyDB.readPropertyRequest(projectID,userID);
    return res
    .status(200)
    .json({ error: false, message: "", data: responseObject });

  } catch(error){
    console.log(error);
    err.statusCode = 400;
    err.message = "Error occurred in fetching project detail";
    err.stackTrace = error;
    next(err);
  }
}


async function projectView(req,res,next){
let err = {};
  try{
    let userID = req.decoded.id ;
    let addView;
    let propertyID = req.query.propertyId ;
  
    isUserInterested = await propertyModal.projectView(userID, propertyID);
 
    if(!isUserInterested){
      addView = await propertyModal.insertProjectView(userID, propertyID)
    }

      return res
        .status(200)
        .json({ error: false, message: "Property View Added Successfully"});
      
 
  }catch(error){
    err.statusCode = 400;
    err.message = "Error occurred in fetching project Views";
    err.stackTrace = error;
    next(err);
  }

}

async function projectViewDetail(req,res,next){

  let err = {};
  try{
  let propertyID = req.body.propertyID
  let projectViewCount = await propertyModal.projectViewCount(propertyID);
    return res.status(200).json({ error: false, message: "",data:projectViewCount});
  }catch(error){
    err.statusCode = 400;
    err.message = "Error occurred in fetching Total project Views";
    err.stackTrace = error;
    next(err);
  }
}

async function projectActiveInvestments(req,res,next){

let err = {};

try{
  // let userID = 260 ;
  let userID = req.decoded.id ;
  let investmentCurrentValue = 0;
  let activeRounds;
  let projectImages;
  let netPledgedArea;
  let netPledgedPrice;

  let activeInvestments = await propertyModal.activeInvestments(userID)
  let activeInvestmentsSeller = await propertyModal.sellerActiveInvestments(userID)
  
  for(var i = 0 ; i < activeInvestments.length ; i++){
    
    activeRounds = await propertyModal.activeRoundsDetail(userID,activeInvestments[i].propertyID)
    projectImages = await propertyImagesModal.projectImages(activeInvestments[i].propertyID);
 
    investmentCurrentValue = activeInvestments[i].totalPledgedArea * activeRounds.activeRoundPricePerSqft;
    
    netPledgedArea = activeInvestments[i].totalPledgedArea -  activeInvestmentsSeller[i].totalPledgedArea
    netPledgedPrice = activeInvestments[i].totalPledgedPrice -  activeInvestmentsSeller[i].totalPledgedPrice

    activeInvestments[i].sellerTotalPledgedPrice = activeInvestmentsSeller[i].totalPledgedPrice ;
    activeInvestments[i].sellerTotalPledgedArea = activeInvestmentsSeller[i].totalPledgedArea ;
    activeInvestments[i].activeRoundName = activeRounds.activeRoundName ;
    activeInvestments[i].activeRoundPricePerSqft = activeRounds.activeRoundPricePerSqft ;
    activeInvestments[i].investmentCurrentValue = investmentCurrentValue ;
    activeInvestments[i].totalRounds = activeRounds.totalRounds ;
    activeInvestments[i].projectImages = projectImages.imageURL ;
    activeInvestments[i].netPledgedArea = netPledgedArea ;
    activeInvestments[i].netPledgedPrice = netPledgedPrice ;
 
  }    
  return res
  .status(200)
  .json({ error: false, message: "",data:activeInvestments});
  
}catch(error){
  err.statusCode = 400;
  err.message = "Error occurred in fetching Detail";
  err.stackTrace = error;
  next(err);
}
}

async function getStats(req, res, next) {
  try {
    if (!req.params.propertyid)
      return res.NotAcceptable({}, "Property id required.");
    const result = await propertyModal.getStats(req.params.propertyid);
    (result.success&&result.success===true)?res.Ok(result.data[0]):res.BadRequest();
  } catch (err) {
    console.log(err);
    res.InternalServerError(err);
  }
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
async function getPropertyConfig(req,res,next){
  try {
    const propertyId = req.params.id;
    const result = await propertyCoreModel.getPropertyConfig(propertyId);
    res.Success(result,"SUCCESS");
  } catch (e) {
    res.Error(e.toString(),"INTERNAL_SERVER_ERROR")
  }
}




module.exports.projectActiveInvestments = projectActiveInvestments;
module.exports.projectViewDetail = projectViewDetail;
module.exports.projectView = projectView;
module.exports.projectDetail = projectDetail;
module.exports.getStats = getStats;
module.exports.getRoundDetail = getRoundDetail;
module.exports.getPropertyConfig = getPropertyConfig;
module.exports.matureProjectDetail = matureProjectDetail;
//module.exports.youtubeFeed = youtubeFeed;
