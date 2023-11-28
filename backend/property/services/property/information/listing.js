const propertyModal = require("../../../Models/Property/information");
const projectListingModel = require('../../../Models/Property/listing');
const projectStatsModel = require('../../../Models/Property/propertystats');
const projectRound = require('../../../Models/Property/getrounds');
const blockchainModule = require('blockchain');
const areaUtilMatrix = require('../../../utils/area-unit-conversion');
const projectResponseModel = require('../../../dto/project-information-model');
const roundsModel = require("../../../Models/Property/getrounds");
const fundingRoundDetails = require("../../../Models/Property/fundingrounddetails");
const { active } = require("../../../resources/statusEnum");
const projectServiceAccount = require('../../../Models/Property/service-account');
const balanceModel =require('../../../Models/Investor/PersonalInformation/userportfolio');
const numberFormatterUtils = require('../../../utils/number-formatter');
const { logActivity } = require('../../shared/activity-logger');
const core = require('core');
const { generateSignedUrl } = require("../../../utils/aws-utils");

async function projectListing(req,res,next){
    let err = {};
    let userId= req.decoded.id;
    try {
    let projects = await projectListingModel.projectListing(userId);
    let responseArr = [];
   
    for(const element of projects){
        if(element.category == core.enums.PropertyCategory.developmental)
            {
                let activeRound = await projectRound.activeRoundPricing(element.id);
                let projectCompletion = await projectRound.completedRound(element.id);
                let activeRoundData = await roundsModel.activeRoundPricing(element.id);
                element.activeRound = activeRound.roundName;
                element.endDate = activeRound.displayEndDate;
                
                if(activeRoundData.id){
                    let activeRoundAreaDetails = await roundsModel.fetchActiveRoundAreaInfo(element.id,activeRoundData.id);
                    activeRoundAreaDetails=activeRoundAreaDetails.data[0];
                    element.totalAreaLocked =activeRoundAreaDetails.totalArealocked;
                    element.totalFundInRound = activeRoundAreaDetails.funds;
                    element.totalAreaPledgedInRound = activeRoundAreaDetails.totalAreapledged;
                }
                


                element.roundPrice = activeRoundData.pricePerSqft;
                element.discount = Math.floor((activeRound.pricePerSqft/activeRound.marketPrice)*100);
                element.marketPrice = activeRoundData.marketPrice;
                element.totalFunds = activeRoundData.funds;
                element.completion = projectCompletion.completedRound+1;

            }

         if (element.category == core.enums.PropertyCategory.mature)
         {
             let propertyStakeHolders = await core.propertyDB.getPropertyStakeholder(element.id);
             let maturePropertyDetail =  await core.propertyDB.getPropertyDetail(element.id,core.enums.PropertyCategory.mature);
             element.propertyStakeHolders = propertyStakeHolders;
             element.rentalYield = maturePropertyDetail.rentalYield ? maturePropertyDetail.rentalYield : 0;
             element.rentalDisbursementDay = maturePropertyDetail.rentalDisbursementDay ? maturePropertyDetail.rentalDisbursementDay : 0;
             element.rentCredit = maturePropertyDetail.maxRentCreditsPerUnit ? maturePropertyDetail.maxRentCreditsPerUnit : 0;
             element.rentDisbursementDuration = maturePropertyDetail.rentDisbursementDuration ? maturePropertyDetail.rentDisbursementDuration : 0;
             element.rentIncrementPercentage = maturePropertyDetail.rentIncrementPercentage ? maturePropertyDetail.rentIncrementPercentage :0;
             element.rentPerUnit = maturePropertyDetail.current_rent ? maturePropertyDetail.current_rent : 0;
             element.current_rent = maturePropertyDetail.current_rent ? maturePropertyDetail.current_rent : 0;
             element.current_price = maturePropertyDetail.current_price ? maturePropertyDetail.current_price : 0;
             element.total_area_listed = maturePropertyDetail.total_area_listed ? maturePropertyDetail.total_area_listed : 0;
        }   
        const propertyStats = await propertyModal.getStats(element.id);
        element.projectCompletionPercent = propertyStats ? propertyStats.data[0].percentage : null;
        let projectViews = await propertyModal.projectViewCount(element.id);
        
        let circulationArea =0;
        element.circulationArea = areaUtilMatrix.convertToSqft(circulationArea);
        let serviceAccountId = await projectServiceAccount.propertyServiceAccount(element.id);
     
        element.areaLeft = await balanceModel.userBalance(serviceAccountId.ownerID,element.id);
        element.areaLeft = numberFormatterUtils.checkNegativeValue(element.areaLeft);
        let projectStats = await projectStatsModel.propertyStats(element.id);
        let totalProjectInvestors = await projectStatsModel.totalInvestors(element.id);
        element.investors = totalProjectInvestors.investorCount;
        element.peopleViewing = projectViews.totalViews || 100;
        element.minimumInvestment = element.minInvestment;
        element.minArea = projectStats.minArea || 1000;
        element.maxArea = projectStats.maxArea || 10000;
        element.completionYear = projectStats.completionArea || 2024;
        element.minimumInvestment = projectStats.minInvestment;
        
        element.type = projectStats.propertytype;
        // element.type = propertyStats ? propertyStats.data[0].propertytype : null;
        element.listingIcon = element.listingIcon ? element.listingIcon : 'apartment';
        
        // let soldArea = numberFormatterUtils.checkNegativeValue( activeRoundData.funds - element.areaLeft); 
        element.areaLeftPercentage = numberFormatterUtils.checkMaximumPercentage(Math.ceil((element.areaLeft/element.totalFunds)*100));


        element.galleryImges = await core.propertyDB.propertyGalleryImges(element.id);
        element.total_transactions =  await core.propertyDB.totalTranscations(element.id);

        let response = new projectResponseModel.projectInformationModel(element);

        responseArr.push(response);
    }


    return res.status(200).json({error:false, message: "",data: responseArr});
    }
    catch(error){
       console.log(error);
        err.statusCode = 400;
        err.message = "Error occurred in fetching projects";
        err.stackTrace = error;
        next(err);
    }

}


async function propertyReminder(req,res,next){
    let err = {};
    try {
        let userId= req.decoded.id;
        const propertyInfo = await  core.propertyDB.getPropertyInformation(req.body.propertyId); 
        let propertyReminder = await core.propertyDB.propertyReminder(req.body.propertyId,userId);
        if(propertyInfo){
            logActivity(
                {
                    logName:  "Manage Property",
                    description:  "Saved a reminder for next round opening in "+propertyInfo.name,
                    subjectID: res.id,
                    subjectType: "propertyReminder",
                    event: "Saved",
                    causerID: req.decoded.id,
                    causerType: "users",
                    properties: {
                        attributes: {
                            userId: req.decoded.id,
                            propertyName: propertyInfo.name,
                            propertyId: propertyInfo.id
                        },
                        old: null
                    },
                    source: null,
                    metadata:null
                }
                ,req)
        }

        return res.status(201).json({error:true,message: "Reminder saved",data:''});

    } catch(error){
      
        err.statusCode = 400;
        err.message = "Error occurred in saving";
        err.stackTrace = error;
        next(err);
    }
}
module.exports.projectListing = projectListing;
module.exports.propertyReminder = propertyReminder;