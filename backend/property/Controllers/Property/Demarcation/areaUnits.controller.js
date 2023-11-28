const core = require('core');
const mediaService = require('../../../services/shared/media');
const constants = require('../../../resources/constants');
const { logActivity } = require('../../../services/shared/activity-logger');
const ActionCategory = require('../../../resources/enum-Action-Category');
const ActivityEvent = require('../../../resources/enum-ActivityLog-event');
const fcmService = require('../../../services/fcm/fcm.service.js');
const slackNotification = require('../../../utils/slack-notification');
const userInformation = require('../../../Models/Property/user-information');
const projectInformationModel = require('../../../Models/Property/information');
const get = async function(req, res, next) {
    let resp = new core.responseObject();
    const { page=1, size=10, propertyID=0, unitStatus=null, areaSpaceType=null, premiumCategory=null, spaceType=null, isPremium=null, floor=null, beds=null, unitNumber=null, sort=null, livingArea=null, areaType=null } = req.query;
    try {
        const filters = {
            spaceType,
            areaSpaceType: (areaSpaceType!==null ? Number(areaSpaceType) : null),
            isPremium: (isPremium!==null ? Number(isPremium) : null),
            premiumCategory: premiumCategory,
            floor: (floor!==null ? Number(floor) : null),
            unitStatus,
            beds,
            unitNumber,
            sort,
            livingArea,
            page,
            size,
            areaType
        };
        const data = await core.demarcatedAreaUnitDB.getAreaCategoriesByPropertyID(propertyID, filters);
      
        if( Array.isArray(data) ) {
            resp.data = data.map(item => {
               
                return {
                    areaUnitID: item.areaUnitID,
                    // name: item.spaceType ? constants.DEMARCATED_UNIT_SPACE_TYPE[item.spaceType] : item.name,
                    name: item.name,
                    isPremium: item.isPremium,
                    code: item.code,
                    floor: item.floorNumber,
                    status: item.unitStatuses,
                    assetStatus: item.assetStatus,
                    netArea: item.netArea,
                    grossArea: item.grossArea,
                    currentRate :  item.current_rate,
                    endRate: item.endRate,
                    amenities: item.unitAmenities,
                    // category: item.category,
                    areaTypeID: item.areaTypeID,
                    noOfParkings: item.parkings,
                    propertyType: item.propertyType,
                    category : constants.DEMARCATED_UNIT_SPACE_TYPE[item.spaceType],
                    multiplyFactor: item.multiplyFactor,
                    premiumCategories: item.premiumCategories ? item.premiumCategories : [],
                    views: item.views,
                    premiumCategory: item.premiumCategory,
                    endMarketRate: item.endMarketRate,
                };
            });
        } else {
            resp.data = [];
        }
        resp.setSuccess('Area units fetched successfully!');
        return res.status(200).json(resp);
    } catch(e) {
        resp.setError(e.toString());
        resp.data = null;
        return res.status(500).json(resp);
    }
}

const dashboardDemarcatedUnits = async function(req,res,next){
    let resp = new core.responseObject();
    try {
        const data = await core.demarcatedAreaUnitDB.getDashboardDemarcatedAreaUnits();
        resp.data = data;
        resp.setSuccess('Area units fetched successfully!');
        return res.status(200).json(resp);
    } catch(e) {
        console.log(e);
        resp.setError(e.toString());
        resp.data = null;
        return res.status(500).json(resp);
    }
}


const subscribeUnit = async function(req,res,next){
    let resp = new core.responseObject();
    try {
        const data = await core.demarcatedAreaUnitDB.subscribeUnit(req.body,req.decoded.id);
        // if(data)
        resp.setSuccess('Subscribe to unit successfully');
        return res.status(200).json(resp);

    } catch(e) {
        console.log(e);
        resp.setError(e.toString());
        resp.data = null;
        return res.status(500).json(resp);
    }
}

const createDemarcatedInvestmentPlan = async function(req,res,next){
    let resp = new core.responseObject();
    
    try {
        let dataRecieved=req.body.compiledData;
        let count=1;
        if(dataRecieved.installments && dataRecieved.installments.length>0){
            dataRecieved.installments.forEach(x=>{
                x.installmentNumber=count;
                count++
            })

        }
        dataRecieved.bookedBy=req.decoded.id;
        let _userInfo = await userInformation.userbasicInfo(req.decoded.id); 
        let propertyData = await   projectInformationModel.projectInformation(dataRecieved.propertyID);
     
        const data = await core.demarcatedInvestmentPlansDB.createInvestmentPlan(dataRecieved,req.decoded.id);
        slackNotification.demarcatedAreaPledgeNotification(
            {
            email: _userInfo.email,
            name: _userInfo.legalName,
            project: propertyData.name,
            type: dataRecieved.spaceType,
            areaPledged : dataRecieved.initialInvestmentArea
            }
        );
        // if(data)
        resp.setSuccess('Investment Plan Created Successfully');
        return res.status(200).json(resp);

    } catch(e) {
        console.log(e);
        resp.setError(e.toString());
        resp.data = null;
        return res.status(500).json(resp);
    }
}

const getByID = async function(req, res, next) {
    let resp = new core.responseObject();
    const {id=0} = req.params;
    let projectImageGallery=[];
    try {

        const property = await core.demarcatedAreaUnitDB.getPropertyByUnitID(id);
        if( property ) {

            if( property.propertyType==='HOMES' ) {

                const data = await core.demarcatedAreaUnitDB.getHomesAreaUnitByID(id);
                const totalWatched = await core.demarcatedAreaUnitDB.fetchWatchCount({userId:req.decoded.id,areaUnitId:id});
                const userPortfolioBalance = await core.userDB.userPortfolioBalance(req.decoded.id,data.propertyId);
                const gallery = await core.demarcatedAreaUnitDB.demarcatedUnitGallery(id);
                for (image of gallery){
                
                    let mediaUrl = await mediaService.getMediaTest(image.mediaID);
                    projectImageGallery.push(mediaUrl);
                }
                if( data ) {
                    resp.data = {
                        id: data.id,
                        name: data.name,
                        category: data.name,
                        code: data.code,
                        grossArea: data.grossArea,
                        carpetArea: data.carpetArea,
                        totalWatched: totalWatched,
                        description: data.description,
                        noOfParkings: data.parkings,
                        propertyName : data.propertyName,
                        propertyLogo : data.propertyLogo,
                        gallery: projectImageGallery,
                        premiumCategories: data.premiumCategories,
                        isPremium: (data.premiumCategories && Array.isArray(data.premiumCategories)) ? (data.premiumCategories.filter(cat => cat.slug==='premium').length > 0 ? 1 : 0) : 0,
                        rental: {
                            rentStartAt: data.operationStartAt,
                            rent: data.current_rents,
                            rentIncrementPercentage: data.rentIncrementPercentage,
                            incrementDuration: data.incrementDuration,
                        },
                        propertyCompletionAt: data.propertyCompletionAt,
                        currentRoundRate: data.current_rate,
                        currentMarketPrice : data.currentMarketPrice,
                        areaOwned: userPortfolioBalance.balance,
                        propertyType: data.propertyType,
                        furnishStatus: data.furnishStatus,
                        unitAmenities: data.unitAmenities,
                        lastRate: data.lastRate,
                        virtualTourUrl: data.virtualTourUrl,
                        unitStatus: data.unitStatus,
                        currentRoundDeadline : data.currentRoundDeadline,
                        demarcatedAreaSpaceTypeName: data.demarcatedAreaSpaceTypeName,
                        areaBreakDown: data.areaBreakDown,
                        premiumCategory: data.premiumCategory,
                        endMarketRate: data.endMarketRate,
                        currentRoundID: data.currentRoundID,
                        floorPlan: data.floorPlan,
                        propertyType: property.propertyType

                    };

                } else {
                    resp.setError('Unit not fetched');
                    resp.data = null;
                    return res.status(500).json(resp);
                }

            } else {

                const data = await core.demarcatedAreaUnitDB.getAreaUnitByID(id);
                const totalWatched = await core.demarcatedAreaUnitDB.fetchWatchCount({userId:req.decoded.id,areaUnitId:id});
                const userPortfolioBalance = await core.userDB.userPortfolioBalance(req.decoded.id,data.propertyId);
                const gallery = await core.demarcatedAreaUnitDB.demarcatedUnitGallery(id);
                for (image of gallery){
                
                    let mediaUrl = await mediaService.getMediaTest(image.mediaID);
                    projectImageGallery.push(mediaUrl);
                }

                if( data ) {
                    let circulation = null ;
                    let parking = null;
                    if( Array.isArray(data.circulations) ) {
                        data.circulations.forEach(item => {
                            if( item.circulationCategory==='CIRCULATION' ) {
                                circulation = item;
                            }
                        })
                    }
                    resp.data = {
                        id: data.id,
                        name: data.name,
                        category: constants.DEMARCATED_UNIT_SPACE_TYPE[data.spaceType],
                        grossArea: data.grossArea,
                        carpetArea: data.carpetArea,
                        totalWatched: totalWatched,
                        code: data.code,
                        description: data.description,
                        parkingRequiredArea: data.parkingRequiredArea,
                        parkingNetArea: data.parkingNetArea, 
                        noOfParkings: data.parkings,
                        circulation,
                        multiplyFactor: data.multiplyFactor,
                        propertyName : data.propertyName,
                        propertyLogo : data.propertyLogo,
                        gallery: projectImageGallery,
                        isPremium: data.isPremium,
                        rental: {
                            rentStartAt: data.operationStartAt,
                            rent: data.current_rents,
                            rentIncrementPercentage: data.rentIncrementPercentage,
                            incrementDuration: data.incrementDuration,
                        },
                        propertyCompletionAt: data.propertyCompletionAt,
                        currentRoundRate: data.current_rate,
                        areaOwned: userPortfolioBalance.balance,
                        propertyType: data.propertyType,
                        furnishStatus: data.furnishStatus,
                        unitAmenities: data.unitAmenities,
                        lastRate: data.lastRate,
                        virtualTourUrl: data.virtualTourUrl,
                        unitStatus: data.unitStatus,
                        premiumCategory: data.premiumCategory,
                        endMarketRate: data.endMarketRate,
                        currentRoundID: data.currentRoundID,
                        floorPlan: data.floorPlan,
                        propertyType: property.propertyType
                    }
                }

            }

        } else {
            resp.setError('property not fetched');
            resp.data = null;
            return res.status(500).json(resp);
        }
        resp.setSuccess('Area unit fetched successfully!');
        return res.status(200).json(resp);
    } catch(e) {

        resp.setError(e.toString());
        resp.data = null;
        return res.status(500).json(resp);
    }
}
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
const getAreaUnits= async function(req, res, next) {
try {
    req.query.unit_type='RESIDENTIAL';
    const resqueryData = new core.RequestModels.AreaUnitsRequest(req.query)
    req.query.unit_type='COMMERCIAL';
    const comqueryData = new core.RequestModels.AreaUnitsRequest(req.query);    
    const resdata = await core.demarcatedAreaUnitDB.getAreaUnits(resqueryData);   
 
    const comdata = await core.demarcatedAreaUnitDB.getAreaUnits(comqueryData);

 
    if(resdata&&resdata.length>0){
        for (let i = 0; i < resdata.length; i++) {
            const el= resdata[i];
            delete el.sequence;
            el.category= constants.DEMARCATED_UNIT_SPACE_TYPE[el.spaceType];
            if(el.amenities){
                el.amenities = JSON.parse(el.amenities);
            }
            
        }
    }
    if(comdata&&comdata.length>0){
        for (let i = 0; i < comdata.length; i++) {
            const el= comdata[i];
            delete el.sequence;
            el.category= constants.DEMARCATED_UNIT_SPACE_TYPE[el.spaceType];
            if(el.amenities){
                el.amenities = JSON.parse(el.amenities);
            }
            
        }
    }
    res.Ok({"RESIDENTIAL":resdata,"COMMERCIAL":comdata});
} catch (error) {
    throw error;
}
}

const updateStatus = async function(req, res, next) {
    let resp = new core.responseObject();
    let userID = req.decoded && req.decoded.id ? req.decoded.id : 0;
    const {action=null, id= 0} = req.params;  // book, reserve, watch
    const { isPayRemainingAmountInCash=false } = req.body; // initialPayArea in percentage
    if( action && ['reserve','book','watch','book-fully'].includes(action) ) {
        try {
            const data = await core.demarcatedAreaUnitDB.updateStatus(action, id, userID, isPayRemainingAmountInCash);
            resp.setSuccess('updated successfuly!');
            return res.status(200).json(resp);
        } catch(e) {
            console.log("e", e);
            resp.setError(e.toString());
            resp.data = null;
            return res.status(500).json(resp);
        }
    } else {
        resp.setError('Not Found');
        resp.data = null;
        return res.status(404).json(resp);
    }
};

const setUserDemarcatedUnitPlan = async function(req, res, next) {
    let resp = new core.responseObject();
    let userID = req.decoded && req.decoded.id ? req.decoded.id : 0;
    const {id= 0} = req.params;  // book, reserve, watch
    const { planID=0 } = req.body;
    if( planID!=0 ) {
        try {
            const result = await core.demarcatedAreaUnitDB.buyProperyUnit(id, userID, planID);
            if(result){
                resp.setSuccess('updated successfuly!');
                resp.data=0;
                const data = await core.demarcatedAreaUnitDB.getPropertyByUnitID(id);
                logActivity(
                    {
                        logName: ActionCategory.PROJECTS,
                        description: "Pledged an entire unit of 1 bed room in "+data.name,
                        subjectID: parseInt(req.decoded.id),
                        subjectType: "users",
                        event: ActivityEvent.CREATED,
                        properties: {
                            attributes: {
                                unitId: id,
                                propertyId: data.id,
                                propertyName: data.name,
                            },
                            old: null
                        },
                        source: null,
                        metadata:null
                    },req)
                let propertyData = await core.propertyDB.getPropertyInformation(data.id);
                fcmService.purchaseEntireUnitNotification(req.decoded, propertyData )
                return res.status(200).json(resp);
            } else {
                resp.setError('Please try again!');
                resp.data = null;
                return res.status(500).json(resp);
            }
        } catch(e) {
            console.log("e", e);
            resp.setError(e.toString());
            resp.data = null;
            return res.status(500).json(resp);
        }
    } else {
        resp.setError('Not Found');
        resp.data = null;
        return res.status(404).json(resp);
    }
};

const fundingRoundForInstallmentPlan = async function(req,res,next){

    let resp = new core.responseObject();
    try {
        

        let data = await core.propertyDB.propertyFundingRound(req.query.propertyId);
        resp.data = data;
        resp.setSuccess('Data fetched successfully!');
        return res.status(200).json(resp);
        // return data;

    } catch (e) {
        console.log(e);
        resp.setError(e.toString());
        resp.data = null;
        return res.status(500).json(resp);
    }
}


const fetchUserPortfolioBalance = async function(req,res,next){
    let resp = new core.responseObject();
    try {
        const userPortfolioBalance = await core.userDB.userPortfolioBalance(req.decoded.id,req.query.propertyId);
        resp.data = userPortfolioBalance;
        resp.setSuccess('Data fetched successfully!');
        return res.status(200).json(resp);
    } catch (e) {
        console.log(e);
        resp.setError(e.toString());
        resp.data = null;
        return res.status(500).json(resp);
    }

}

const getMyAreaUnits = async function(req,res,next) {
    let resp = new core.responseObject();
    let userID = req.decoded && req.decoded.id ? req.decoded.id : 0;
    try {
        const areaUnits = await core.demarcatedAreaUnitDB.getAreaUnitsByUser(userID);
        if( Array.isArray(areaUnits) ) {
            resp.data = areaUnits.map(unit => {
                return {
                    id: unit.id,
                    userAssetID: unit.userAssetID,
                    userAssetStatus: unit.userAssetStatus, 
                    conversionAreaSnapshot: unit.conversionAreaSnapshot, 
                    name: unit.name, 
                    spaceType: unit.spaceType, 
                    netArea: unit.netArea, 
                    floorNumber: unit.floorNumber, 
                    description: unit.description, 
                    code: unit.code, 
                    unitAmenities: unit.unitAmenities, 
                    propertyType: unit.propertyType, 
                    isPremium: unit.isPremium, 
                    userPortfolioBalance: unit.userPortfolioBalance,
                    propertyName: unit.propertyName,
                    propertyLogo: unit.propertyLogo,
                    propertyCompletionAt: unit.propertyCompletionAt,
                    grossArea: unit.grossArea,
                    currentRoundRate: unit.currentRoundRate,
                    demarcatedArea: unit.demarcatedArea,
                    demarcationConfig: unit.demarcationConfig,
                    planName: unit.planName,
                    planPercentage: unit.planPercentage,
                    planDescription: unit.planDescription,
                    premiumCategory: unit.premiumCategory,
                    demarcationPropertyType: unit.demarcationPropertyType,
                    unitAttachments: unit.unitAttachments,
                };
            });
        } else {
            resp.data = [];
        }
        resp.setSuccess('Area units fetched successfully!');
        return res.status(200).json(resp);
    } catch(e) {
        resp.setError(e.toString());
        resp.data = null;
        return res.status(500).json(resp);
    }
}

const addDemarcatedViews = async function(req,res,next){
    let resp = new core.responseObject();
    let userID = req.decoded && req.decoded.id ? req.decoded.id : 0;
    try {

    } catch(e) {
        resp.setError(e.toString());
        resp.data = null;
        return res.status(500).json(resp);
    }
}

const fetchDemarcatedUnitByPriceRange = async function(req,res,next){
    let resp = new core.responseObject();
    let obj={};
    obj.propertyId = req.body.propertyId;
    obj.maxInvestment = req.body.maxInvestment;
    obj.apartmentType = req.body.apartmentType;
   
    try {

        const areaUnits = await core.demarcatedAreaUnitDB.getAreaUnitsByRange(obj);
        console.log("Area units",areaUnits);
        resp.data = areaUnits;
        resp.setSuccess('Area units fetched successfully!');
        return res.status(200).json(resp);
    } catch(e) {
        resp.setError(e.toString());
        resp.data = null;
        return res.status(500).json(resp);
    }
}


const fetchAreaUnits = async function (req,res,next){
    let resp = new core.responseObject();
    let userId= req.decoded.id;
    try {
        const projectListing = await core.demarcatedAreaUnitDB.getProjectsArea(userId);
      
        resp.data = projectListing;
        resp.setSuccess('Area units fetched successfully!');
        return res.status(200).json(resp);
    }   catch(e){
        resp.setError(e.toString());
        resp.data = null;
        return res.status(500).json(resp);
    } 
}
module.exports = { get,createDemarcatedInvestmentPlan, getByID,getAreaUnits, updateStatus, subscribeUnit,fundingRoundForInstallmentPlan ,fetchUserPortfolioBalance, getMyAreaUnits, setUserDemarcatedUnitPlan,fetchDemarcatedUnitByPriceRange,dashboardDemarcatedUnits,fetchAreaUnits};
