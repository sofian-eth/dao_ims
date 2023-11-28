module.exports = {
    'projectInformationModel': function (data) {
  
    this.projectID = data.id;    
    this.projectName = data.name ; 
    this.projectDescription = data.description ;
    this.projectLongDescription = data.longDescription;

    this.totalRound = data.fundingRounds ;
    this.completedRound = data.completion ;
    this.minArea = data.minArea ;
    this.maxArea = data.maxArea ;
    this.maxSellableArea = data.maxSellableArea;
    this.areaLeft = Math.floor(data.areaLeft);
    this.areaLeftPerc = data.areaLeftPercentage ;
    this.roundPrice = data.roundPrice ;
    this.marketPrice = data.marketPrice ;
    this.activeDiscount = Math.floor(data.discount) ;
    this.projectLocation = data.location ;
    this.projectLocationDescription = data.locationDescription;
    this.latitude = data.latitude;
    this.longitude = data.longitude;

    // this.totalInvestors = data.investors ;
    this.projectRating = data.rating;
    this.type = data.type;
    this.completionYear = data.completionYear;
    this.daoScore = data.daoScore;
    this.reviewCount = data.reviewCount;
    this.peopleViewing = data.peopleViewing;
    this.minimumInvestment = data.minimumInvestment;
    this.coverPhoto = data.coverPhoto;
    this.activeRoundName = data.activeRound;
    this.imageGallery = data.imageGallery;
    this.videoGallery = data.videoGallery;
    this.status = data.status;
    this.documents = data.documents;
    this.completionPercent = data.projectCompletionPercent;
    this.youtubeFeed = data.youtubeFeed;
    this.bankInformation = data.bankInformation;
    this.areaSelection = data.areaSelection; 
    this.totalFunds = data.totalFunds;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.areaPledged = data.areaPledged;
    this.overPledged = data.overPledged;
    this.salesAgreement = data.salesAgreement;
    this.termServices = data.termServices;
    this.projectImageGallery = data.projectImageGallery;
    this.projectVideoGallery = data.projectVideoGallery;     
    this.projectScore = data.projectScore;     
       
    this.philosophyTitle = data.philosophyTitle;     
    this.philosophyDescription = data.philosophyDescription;     
    this.risk = data.risk;     
    this.matrixName = data.matrixName;     
    this.premiumFeatures = data.premiumFeatures;
    this.playlistID = data.playlistID;
    this.lockedAreaPercentage = data.lockedAreaPercentage;
    this.propertyLogo = data.propertyLogo;
    this.reserveArea = data.reserveArea;
    this.currentRoundCount = data.currentRoundCount;
    this.areaIOwn = data.areaIOwn;
    this.listingIcon =data.listingIcon;
    this.projectCategory = data.category ? data.category : 'development'
    this.rentalYield = data.rentalYield ? data.rentalYield : 0,
    this.rentalDisbursementDay = data.rentalDisbursementDay ? data.rentalDisbursementDay : 0,
    this.rentCredit = data.maxRentCreditsPerUnit ? data.maxRentCreditsPerUnit : 0,
    this.rentDisbursementDuration = data.rentDisbursementDuration ? data.rentDisbursementDuration : 0,
    this.rentIncrementPercentage = data.rentIncrementPercentage ? data.rentIncrementPercentage :0,
    this.rentPerUnit = data.current_rent ? data.current_rent : 0,
    this.activeOrder = data.activeOrders ? data.activeOrders :0,
    this.totalMarketplaceAreaListed = data.total_area_listed ? data.total_area_listed :0,
    this.occupancyPercentage = data.occupancyPercentage ? data.occupancyPercentage : 0,
    this.netRentalReturn = data.netRentalReturn ? data.netRentalReturn :0,
    this.propertyStakeHolders = data.propertyStakeHolders ? data.propertyStakeHolders : null,
    this.marketplaceRate = data.current_price ? data.current_price : 0
    this.operationStartDate = data.operationStartAt ? data.operationStartAt : null,
    this.projectCompletionDate = data.launchDate ? data.launchDate : null,
    this.maxRentPerUnit = data.maxRentPerUnit ? data.maxRentPerUnit : 0,
    this.incrementDuration = data.incrementDuration ? data.incrementDuration : 0;  
    this.totalInvestors = data.total_investors ?  data.total_investors : data.investors ? data.investors : 0;
    this.totalTransactions = data.total_transactions ? data.total_transactions : 0;  
    this.highestHolderArea = data.highest_holder_area ? data.highest_holder_area : 0;
    this.historicPropertyWorths = data.historicPropertyWorths ? data.historicPropertyWorths : [];
    this.totalProjectArea = data.totalSqft ? data.totalSqft : 0;
    this.facebookLink = data.facebookLink ? data.facebookLink : null;
    this.instagramLink = data.instagramLink ? data.instagramLink : null;
    this.linkedinLink = data.linkedinLink ? data.linkedinLink : null;
    this.websiteUrl = data.websiteUrl ? data.websiteUrl : null;
    this.marketplaceViews = data.marketplaceViews ;
    this.lastRentIncrementAt = data.lastRentIncrementAt ? data.lastRentIncrementAt : null;
    this.baseMarketplaceRate = data.baseMarketplaceRate ? data.baseMarketplaceRate : 0;
    this.rentLockingDay = data.rentLockingDay ? data.rentLockingDay : null;
    this.worthIncrementPercentage = data.worthIncrementPercentage ? data.worthIncrementPercentage : 0;
    this.galleryImges = data.galleryImges ? data.galleryImges : [];
    this.isDemarcated = data.isDemarcated ? data.isDemarcated : 0;
    this.totalAreaLocked = data.totalAreaLocked ? data.totalAreaLocked : 0;
    this.totalFundInRound = data.totalFundInRound ? data.totalFundInRound : 0;
    this.totalAreaPledgedInRound = data?.totalAreaPledgedInRound;
    this.rfqs = data.rfqs ? data.rfqs : [];
    this.propertyIntro = data.propertyIntro ? data.propertyIntro : '';
    this.propertyAccessType = data.propertyAccessType ? data.propertyAccessType : null;
    this.isUserAllowed = data.isUserAllowed ? true : false;
    this.userRequestLastStatus = data.userRequestLastStatus ? data.userRequestLastStatus : null;
    this.subTitle = data.subTitle ? data.subTitle : null;
    this.propertyAccessRequestIsRead = data.propertyAccessRequestIsRead ? true : false;
    this.handbookUrl = data.handbookUrl;
    this.propertyNearBy = data.propertyNearBy;
    this.viewPlan = data.viewPlan;
    this.planDescription = data.planDescription;
    
},
};





