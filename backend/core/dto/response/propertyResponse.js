class propertyResponse {
    constructor(property, userID = 0) {
        //property data
        this.id = property.id;
        this.propertyLogo = property.propertyLogo;
        this.propertyName = property.name;
        this.propertyDescription = property.description;
        this.propertyAdress = property.location;
        this.propertyType = property.type ? property.type : '-';
        this.propertySymbol = property.propertySymbol;
        this.propertyTermsLink = property.termsLink;
        this.daoScore = property.daoScore;
        this.ownerID = property.ownerID;
        this.philosophyTitle = property.philosophyTitle;
        this.rating = property.rating;
        this.type = property.propertytype ? property.propertytype : '';
        this.category = property.category ? property.category : 'development';
        this.configurations = property.config ? property.config : null;
        this.areaAvailable = property.areaAvailable ? property.areaAvailable : 0;

        this.propertyInvestors = [];
        this.propertyCurrentRound = 0;
        this.propertyRounds = 0;
        this.propertyCurrentRoundPrice = 0;
        this.nextRoundPrice = 0;

        this.propertyListingin7days = 0;
        this.lastPropertySoldArea = 0;
        this.propertyTotalOrders = 0;
        this.propertyOrdersPricesList = 0;
        this.PropertyAreaPurchasedByCurrentUser = 0;

        // mature proeprty additional fields
        this.rentPerUnit = property.rentPerUnit ? property.rentPerUnit : 0;
        this.rentIncrementPercentage = property.rentIncrementPercentage ? property.rentIncrementPercentage : 0;
        this.incrementDuration = property.incrementDuration ? property.incrementDuration : null;
        this.rentalDisbursementDay = property.rentalDisbursementDay ? property.rentalDisbursementDay : null;
        this.occupancyStatusPercentage = property.occupancyStatusPercentage ? property.occupancyStatusPercentage : 0;
    }

    getTotalInvestors(_portfolioBalances, serviceAccountId) {
        return _portfolioBalances.filter(x => x.userID != serviceAccountId).length;
    }

    getTotalInvestmentForUser(_portfolioBalances, userID) {
        return _portfolioBalances.filter(x => x.userID == userID).reduce((pb1, pb2) => pb1.balance + pb2.balance);
    }

    getRoundsInfoByProperty(developmentrounds) {
        let ret = { 'currentRound': 0, 'totalRounds': 0, 'currentRoundPrice': 0, 'nextRoundPrice': 0 }
        if (developmentrounds && developmentrounds.length > 0) {
            ret.totalRounds = developmentrounds.length;
            let RoundIndex = developmentrounds.findIndex(x => x.statusID == 8);
            if (RoundIndex > -1) {
                let roundInfo = developmentrounds[RoundIndex];
                ret.nextRoundPrice = RoundIndex >= developmentrounds.length ? developmentrounds[RoundIndex].pricePerSqft : (developmentrounds[(RoundIndex + 1)] ? developmentrounds[(RoundIndex + 1)].pricePerSqft : developmentrounds[RoundIndex].pricePerSqft);
                if (roundInfo) {
                    ret.currentRound = roundInfo.roundName;
                    ret.currentRoundPrice = roundInfo.pricePerSqft;
                }
            }
        }
        return ret;
    }

    setLast7DaysOrders(_orders) {
        var d = new Date();
        d.setDate(d.getDate() - 8);
        return _orders.filter(x => new Date(x.createdAt).getTime() > new Date(d).getTime() && x.propertyID == this.id).length;
    }

    getLastOrderArea(_orders) {
        return _orders[0].areaToSell;
    }

    setPropertyStatsFromData(result) {
        //property data
        //result = dataItem[0]["dataItem"];
        //console.log('setPropertyStatsFromData', result.dataItem.);
        this.id = result.dataItem.id;
        this.propertyName = result.dataItem.propertyName;
        this.propertyDescription = result.dataItem.propertyDescription;
        this.propertyAdress = result.dataItem.propertyAdress;
        this.propertyType = result.dataItem.propertyType;
        this.propertySymbol = result.dataItem.propertySymbol;
        this.propertyTermsLink = result.dataItem.propertyTermsLink;
        this.daoScore = result.dataItem.daoScore;
        this.philosophyTitle = result.dataItem.philosophyTitle;
        this.rating = result.dataItem.rating;
        this.propertyInvestors = result.dataItem.propertyInvestors;
        this.propertyCurrentRound = result.dataItem.propertyCurrentRound;
        this.propertyRounds = result.dataItem.propertyRounds;
        this.propertyCurrentRoundPrice = result.dataItem.propertyCurrentRoundPrice;
        this.propertyListingin7days = result.dataItem.propertyListingin7days;
    }

    getAreaAvailableForSale(_availableArea) {
        let arePurchased = _availableArea && _availableArea.totalAreaPledged ? _availableArea.totalAreaPledged : 0;
        let totalAreaSold = _availableArea && _availableArea.totalAreaSold ? _availableArea.totalAreaSold : 0;
        return ((arePurchased - totalAreaSold) < 0 ? 0 : (arePurchased - totalAreaSold));
    }



    // fetch property Gallery
    // update property Gallery
    // Fetch property documents
    // update property documents


    //fetch property milestones
    // add property milestones 
    // update property milestone progress


    // fetch property taxes
    // update property taxes

    //fetch active round details
    //fetch property bank information
    // update property bank information

    // fetch property service account details

    // calculate current discount based on price


};

module.exports = { propertyResponse }
