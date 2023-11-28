const { QueryTypes } = require('sequelize');
const db = require('../../dbModels/index');
const { AreaUnitsRequest } = require('../../dto/requests/demarcatedRequests');
const { demarcatedOptions } = require('../../models/enums');
  
const getAreaCategoriesByPropertyID = async function(id, filters=null) {
    if(filters) {
        Object.keys(filters).forEach(key => {
            if( filters[key]===null ) {
                delete filters[key];
            }
        })
    }
    const propertyResult = await db.sequelize.query("SELECT property.propertyType FROM property WHERE property.id=?;", {replacements: [id], type: QueryTypes.SELECT});
    if( propertyResult && propertyResult.length > 0 ) {
        const property = propertyResult.pop();
        let result = null;
        if( property.propertyType==='HOMES' ) {
            result = await db.sequelize.query('call sp_demarcated_get_area_units(?,?)',{replacements:[id, (filters ? JSON.stringify(filters) : null)]});
            result = result.map(item => {
                if( Array.isArray(item.premiumCategories) ) {
                    const premiumCategoriesExceptPremium = item.premiumCategories.filter(item => item.slug!=='premium');
                    item.isPremium =  item.premiumCategories.length > premiumCategoriesExceptPremium.length ? 1 : 0;
                    item.premiumCategories = premiumCategoriesExceptPremium;
                } else {
                    item.isPremium = 0; 
                    item.premiumCategories = [];
                }
                return item;
            });
        } else {
            result = await db.sequelize.query('call sp_demarcated_area_categories(?,?)',{replacements:[id, (filters ? JSON.stringify(filters) : null)]});
        }
        if (result && result.length > 0) {
            return result;
        } else {
            return [];
        } 
    }
}

const getPropertyByUnitID = async function(id) {
    const propertyResult = await db.sequelize.query("SELECT property.* FROM demarcatedAreaUnits INNER JOIN property ON property.id=demarcatedAreaUnits.propertyID WHERE demarcatedAreaUnits.id=?;", {replacements: [id], type: QueryTypes.SELECT});
    if( propertyResult && propertyResult.length > 0 ) {
        return propertyResult.pop();
    } else {
        return null;
    }
}

const getAreaUnitByID = async function(id) {
    const result = await db.sequelize.query('call sp_demarcated_get_area_unit(?)',{replacements:[id]});
    if (result && result.length > 0) {
        return result[0];
    } else {
        return null;
    }   
}

const getHomesAreaUnitByID = async function(id) {
    const result = await db.sequelize.query('call sp_demarcated_get_area_unit_homes(?)',{replacements:[id]});
    if (result && result.length > 0) {
        return result[0];
    } else {
        return null;
    }   
}

/**
 * 
 * @param {AreaUnitsRequest} obj 
 */
const getAreaUnits = async function(obj){
    let queryParams = obj.params;
    const result = await db.sequelize.query('call sp_demarcated_get_area_units(?)',{replacements:[queryParams]});
    //console.log(result);
    if (result && result.length > 0) {
        return result;
    } else {
        return [];
    }
}



const subscribeUnit = async function(data,userId){
       const result  = await db.sequelize.query('select * from demarcatedAreaUnitsViews where userId=? and areaUnitId=?',{replacements:[userId,data.areaUnitId]});
 
       if(result && result[0].length > 0){
           return true;
       } else
       return await db.sequelize.query('insert into demarcatedAreaUnitsViews(userId,areaUnitId) values (?,?)',{replacements:[userId,data.areaUnitId]});



}

const fetchWatchCount = async function(data){
    let count = 0;
    const result  = await db.sequelize.query('select count(*) as count from demarcatedAreaUnitsViews where userId=? and areaUnitId=?',{replacements:[data.userId,data.areaUnitId]});
   
    if(result && result[0] ){
        
       return result[0][0].count;
    } else
    return count;
}

const getConversionAreaSnapshot = async function(id) {
    const result = await db.sequelize.query("call sp_demarcated_get_area_unit_conversion_snapshot(?)", {replacements: [id], type: QueryTypes.SELECT})
    if( result.length > 0 ) {
        // {
        //     "netArea":538.0,
        //     "deNetAreaPerParking": 128.0, 
        //     "deRequiredAreaPerParking": 75.0,
        //     "parkings": 1,
        //     "areaType":{
        //        "id":1,
        //        "name":"Residential Gross Premium",
        //        "netArea":31786.0,
        //        "isPremium":1,
        //        "propertyType":"RESIDENTIAL",
        //        "multiplyFactor":1.100000023841858
        //     },
        //     "circulations":[
        //        {
        //           "applyOn":[
        //              {
        //                 "id":1,
        //                 "name":"Residential Gross Premium",
        //                 "netArea":31786.0,
        //                 "isPremium":1,
        //                 "propertyType":"RESIDENTIAL",
        //                 "multiplyFactor":1.100000023841858
        //              }
        //           ],
        //           "applicator":{
        //              "id":3,
        //              "name":"Residential Circulation",
        //              "netArea":19852.0,
        //              "isPremium":0,
        //              "propertyType":null,
        //              "multiplyFactor":0.6499999761581421
        //           }
        //        },
        //        {
        //           "applyOn":[
        //              {
        //                 "id":2,
        //                 "name":"Residential Gross Non Premium",
        //                 "netArea":72186.0,
        //                 "isPremium":0,
        //                 "propertyType":"RESIDENTIAL",
        //                 "multiplyFactor":1.0
        //              }
        //           ],
        //           "applicator":{
        //              "id":4,
        //              "name":"Parking Net",
        //              "netArea":9769.0,
        //              "isPremium":0,
        //              "propertyType":null,
        //              "multiplyFactor":0.550000011920929
        //           }
        //        }
        //     ]
        //  }
        return result[0][0].areaUnitSnapshot;
    } else {
        return null;
    }
}

const updateStatus = async function(action, id,  userID, isPayRemainingAmountInCash=false) {
    const balanceResult = await db.sequelize.query("SELECT USER_PROPERTY_STATES(?, demarcatedAreaTypes.propertyID, 'PORTFOLIO_BALANCE') as portfolioBalance, property.demarcationConfig, demarcatedAreaTypes.propertyID FROM demarcatedAreaUnits INNER JOIN demarcatedAreaTypes ON demarcatedAreaTypes.id=demarcatedAreaUnits.demarcatedAreaTypeID INNER JOIN property ON property.id=demarcatedAreaTypes.propertyID WHERE demarcatedAreaUnits.id=? LIMIT 1;", {replacements: [userID, id], type: QueryTypes.SELECT});
    const balance = (balanceResult.length > 0) ? balanceResult[0].portfolioBalance : 0;
    const demarcationConfig = (balanceResult.length > 0) ? balanceResult[0].demarcationConfig : null;
    const propertyID = (balanceResult.length > 0) ? balanceResult[0].propertyID : 0;
    const reserved = await isReserved(id);
    if( !reserved ) {
        const snapshot = await getConversionAreaSnapshot(id);
        const netArea = snapshot ? snapshot.netArea : 0;
        const grossArea = (snapshot && snapshot.areaType) ? ((snapshot.netArea*snapshot.areaType.multiplyFactor) + snapshot.circulations.reduce((p, circulation) => {
            const accmulatedAreaApplyOn = circulation.applyOn.reduce((p, c) => p+c.netArea, 0);
            return p + (accmulatedAreaApplyOn > 0 ? (snapshot.netArea/accmulatedAreaApplyOn)*(circulation.applicator.netArea * circulation.applicator.multiplyFactor) : 0);
        }, 0) + (snapshot.deRequiredAreaPerParking*snapshot.parkings) ) : 0;
        const portfolioBalancePercentage = grossArea > 0 ? (balance/grossArea)*100 : 0;
        if( action==='book' && portfolioBalancePercentage >= demarcationConfig.bookingPercentage) {
            const area = (grossArea/100)*demarcationConfig.bookingPercentage;
            const remainingArea = grossArea-area;
            return bookAreaUnit(id , userID, balance, area, snapshot, isPayRemainingAmountInCash, remainingArea, grossArea, propertyID);
        } else if( action==='reserve' && portfolioBalancePercentage >= demarcationConfig.reservedPercentage ) {
            const area = (grossArea/100)*demarcationConfig.reservedPercentage;
            const remainingArea = grossArea-area;
            return reserveAreaUnit(id, userID, balance, area, snapshot, isPayRemainingAmountInCash, remainingArea, grossArea, propertyID);
        } else if( action==='watch' ) {
            const area = (grossArea/100)*demarcationConfig.watchingPercentage;
            return watchAreaUnit(id, userID, balance, area, snapshot, grossArea, propertyID);
        } else if( action==='book-fully' && portfolioBalancePercentage >= 100 ) {
            return bookFullyAreaUnit(id, userID, balance, grossArea, snapshot, grossArea, propertyID);
        } else {
            return false;
        }
    } else {
        throw 'UNIT_ALREADY_RESERVED';
    }
}

const isReserved = async function(id) {
    const result = await db.sequelize.query("SELECT DEMARCATED_UNIT_STATUS(?) as status;", {replacements: [id], type: QueryTypes.SELECT});
    if( result.length > 0 ) {
        if( result[0].status!=='AVAILABLE' ) {
            return true;
        } else {
            return false;
        }
    } else {
        throw 'Please try again!';
    }
}

const getDevelopmentRound = async function(propertyID) {
    const result = await db.sequelize.query('SELECT * FROM developmentrounds WHERE developmentrounds.propertyID=? AND IF((SELECT portfoliobalance.balance FROM property inner join portfoliobalance ON portfoliobalance.userID=property.ownerID AND portfoliobalance.propertyID=property.id WHERE property.id=? LIMIT 1) <=10, developmentrounds.statusID=9, developmentrounds.statusID=8) ORDER BY developmentrounds.roundNumber ASC LIMIT 1', {replacements: [propertyID, propertyID], type: QueryTypes.SELECT});
    if( result.length > 0 ) {
        return result[0];
    } else {
        throw 'Please try again!';
    }
};

const reserveAreaUnit = async function(id,  userID, userBalance, areaToBeReduct, areaConversionSnapshot, isPayRemainingAmountInCash, remainingArea, grossArea, propertyID) {
        const transaction = await db.sequelize.transaction();
        try {
            const developmentround = await getDevelopmentRound(propertyID);
            const userAsset = await db.sequelize.query('INSERT INTO demarcatedUserAssets(userID, areaUnitID, `status`, conversionAreaSnapshot, grossArea, userDeductedArea) VALUES (?, ?, ?, ?, ?, ?)', {replacements: [userID, id, 'RESERVED', (areaConversionSnapshot ? JSON.stringify(areaConversionSnapshot) : null), grossArea, areaToBeReduct], transaction});
            await db.sequelize.query('INSERT INTO demarcatedUserAssetTransactions(userAssetID, area, `status`) VALUES (?,?,?);', {replacements: [userAsset[0], areaToBeReduct, 'LOCKED'], transaction});
            if( isPayRemainingAmountInCash && remainingArea>0 ) {
                let transactionResult = await db.sequelize.query("INSERT INTO tradeactivity(sellerID, buyerID, roundID, areaPledged, totalPrice, propertyID, sqftPrice, statusID, createdAt, updatedAt, `medium`, internalStatus, paymentDate, paymentMode) SELECT property.ownerID, ?, ?, ?, ?*?, property.id, ?, 2, NOW(), NOW(), 'DEMARCATION', 'pending', DATE_ADD(NOW(), INTERVAL 7 DAY), 1 FROM property INNER JOIN developmentrounds ON developmentrounds.propertyID=property.id AND developmentrounds.statusID=8 WHERE property.id=? LIMIT 1", {replacements: [userID, developmentround.id, remainingArea, remainingArea, developmentround.pricePerSqft, developmentround.pricePerSqft, propertyID], transaction});
                await db.sequelize.query("UPDATE tradeactivity SET queueNumber=? WHERE id=?", {replacements: [transactionResult[0], transactionResult[0]], transaction});
                await db.sequelize.query('INSERT INTO demarcatedUserAssetTransactions(userAssetID, area, `status`, tradeActivityID) VALUES (?,?,?,?);', {replacements: [userAsset[0], remainingArea, 'PENDING', transactionResult[0]], transaction});
            }
            await transaction.commit();
            return true;
        } catch(e) {
            await transaction.rollback();
            throw e.toString();
        }
}

const bookAreaUnit = async function(id,  userID, userBalance, areaToBeReduct, areaConversionSnapshot, isPayRemainingAmountInCash, remainingArea, grossArea, propertyID) {
        const transaction = await db.sequelize.transaction();
        try {
            const developmentround = await getDevelopmentRound(propertyID);
            const userAsset = await db.sequelize.query('INSERT INTO demarcatedUserAssets(userID, areaUnitID, `status`, conversionAreaSnapshot, grossArea, userDeductedArea) VALUES (?, ?, ?, ?, ?, ?)', {replacements: [userID, id, 'BOOKED', (areaConversionSnapshot ? JSON.stringify(areaConversionSnapshot) : null), grossArea, areaToBeReduct], transaction});
            const userAssetTransaction = await db.sequelize.query('INSERT INTO demarcatedUserAssetTransactions(userAssetID, area, `status`) VALUES (?,?,?);', {replacements: [userAsset[0], areaToBeReduct, 'LOCKED'], transaction});
            if( isPayRemainingAmountInCash && remainingArea>0 ) {
                let transactionResult = await db.sequelize.query("INSERT INTO tradeactivity(sellerID, buyerID, roundID, areaPledged, totalPrice, propertyID, sqftPrice, statusID, createdAt, updatedAt, `medium`, internalStatus, paymentDate, paymentMode) SELECT property.ownerID, ?, ?, ?, ?*?, property.id, ?, 2, NOW(), NOW(), 'DEMARCATION', 'pending', DATE_ADD(NOW(), INTERVAL 7 DAY), 1 FROM property WHERE property.id=? LIMIT 1", {replacements: [userID, developmentround.id, remainingArea, remainingArea, developmentround.pricePerSqft, developmentround.pricePerSqft, propertyID], transaction});
                await db.sequelize.query("UPDATE tradeactivity SET queueNumber=? WHERE id=?", {replacements: [transactionResult[0], transactionResult[0]], transaction});
                await db.sequelize.query('INSERT INTO demarcatedUserAssetTransactions(userAssetID, area, `status`, tradeActivityID) VALUES (?,?,?,?);', {replacements: [userAsset[0], remainingArea, 'PENDING', transactionResult[0]], transaction});
            }
            await transaction.commit();
            return true;
        } catch(e) {
            await transaction.rollback();
            throw e.toString();
        }
}

const bookFullyAreaUnit = async function(id,  userID, userBalance, areaToBeReduct, areaConversionSnapshot, grossArea, propertyID) {
    const transaction = await db.sequelize.transaction();
        try {
            const userAsset = await db.sequelize.query('INSERT INTO demarcatedUserAssets(userID, areaUnitID, `status`, conversionAreaSnapshot, grossArea, userDeductedArea) VALUES (?, ?, ?, ?, ?, ?)', {replacements: [userID, id, 'BOOKED', (areaConversionSnapshot ? JSON.stringify(areaConversionSnapshot) : null), grossArea, areaToBeReduct], transaction});
            const userAssetTransaction = await db.sequelize.query('INSERT INTO demarcatedUserAssetTransactions(userAssetID, area, `status`) VALUES (?,?,?);', {replacements: [userAsset[0], areaToBeReduct, 'LOCKED'], transaction});
            await transaction.commit();
            return true;
        } catch(e) {
            await transaction.rollback();
            throw e.toString();
        }
}

const watchAreaUnit = async function(id,  userID, userBalance, areaToBeReduct, areaConversionSnapshot, grossArea, propertyID) {
        const transaction = await db.sequelize.transaction();
        try {
            const developmentround = await getDevelopmentRound(propertyID);
            if( userBalance < areaToBeReduct ) {
                // const tradeactivityResult = await db.sequelize.query('');
                // console.log("portfolio balance is less");
                const area = areaToBeReduct-userBalance;
                const userAsset = await db.sequelize.query('INSERT INTO demarcatedUserAssets(userID, areaUnitID, `status`, conversionAreaSnapshot, grossArea, userDeductedArea) VALUES (?, ?, ?, ?, ?, ?)', {replacements: [userID, id, 'WATCHED', (areaConversionSnapshot ? JSON.stringify(areaConversionSnapshot) : null), grossArea, (userBalance > 0 ? userBalance : 0)], transaction});
                if( userBalance > 0 ) {
                    await db.sequelize.query('INSERT INTO demarcatedUserAssetTransactions(userAssetID, area, `status`) VALUES (?,?,?);', {replacements: [userAsset[0], userBalance, 'LOCKED'], transaction});
                }
                let transactionResult = await db.sequelize.query("INSERT INTO tradeactivity(sellerID, buyerID, roundID, areaPledged, totalPrice, propertyID, sqftPrice, statusID, createdAt, updatedAt, `medium`, internalStatus, paymentDate, paymentMode) SELECT property.ownerID, ?, ?, ?, ?*?, property.id, ?, 2, NOW(), NOW(), 'DEMARCATION', 'pending', DATE_ADD(NOW(), INTERVAL 7 DAY), 1 FROM property WHERE property.id=? LIMIT 1", {replacements: [userID, developmentround.id ,area, area, developmentround.pricePerSqft, developmentround.pricePerSqft, propertyID], transaction});
                await db.sequelize.query("UPDATE tradeactivity SET queueNumber=? WHERE id=?", {replacements: [transactionResult[0], transactionResult[0]], transaction});
                await db.sequelize.query('INSERT INTO demarcatedUserAssetTransactions(userAssetID, area, `status`, tradeActivityID) VALUES (?,?,?,?);', {replacements: [userAsset[0], area, 'PENDING', transactionResult[0]], transaction});
            } else {
                const userAsset = await db.sequelize.query('INSERT INTO demarcatedUserAssets(userID, areaUnitID, `status`, conversionAreaSnapshot, grossArea, userDeductedArea) VALUES (?, ?, ?, ?, ?, ?)', {replacements: [userID, id, 'WATCHED', (areaConversionSnapshot ? JSON.stringify(areaConversionSnapshot) : null), grossArea, areaToBeReduct], transaction});
                const userAssetTransaction = await db.sequelize.query('INSERT INTO demarcatedUserAssetTransactions(userAssetID, area, `status`) VALUES (?,?,?);', {replacements: [userAsset[0], areaToBeReduct, 'LOCKED'], transaction});
            }
            await transaction.commit();
            return true;
        } catch(e) {
            await transaction.rollback();
            throw e.toString();
        }
        
}



const demarcatedUnitGallery = async function(unitId){
    let sql = "select dg.mediaID,m.fileName,m.originalFileName,m.relativePath,m.size,m.extension,m.isImage from demarcatedAreaUnitAttachments dg join media m on dg.mediaID=m.id where dg.areaUnitID=?";
    let galleryImges = await db.sequelize.query(sql,{
        replacements:[unitId],
    },{type: QueryTypes.SELECT});

    return (galleryImges && galleryImges.length > 0) ? galleryImges[0] : null;

}

const getGrossArea = function(conversionAreaSnapshot) {
    if( conversionAreaSnapshot && conversionAreaSnapshot.netArea && conversionAreaSnapshot.areaType && Array.isArray(conversionAreaSnapshot.circulations) ) {
        const netArea = conversionAreaSnapshot.netArea;
        const multiplyFactor = conversionAreaSnapshot.areaType.multiplyFactor ? conversionAreaSnapshot.areaType.multiplyFactor : 1;
        const circulations =  conversionAreaSnapshot.circulations;
        const propertyRequiredParkingArea = conversionAreaSnapshot.deRequiredAreaPerParking || 0;
        const parkings = conversionAreaSnapshot.parkings || 0;

        let grossArea = (netArea*multiplyFactor) 
                        + circulations.reduce((p, c) => {
                            const accumulatedArea = c.applyOn.reduce((p1, c1) => p1+c1.netArea, 0);
                            const applicatorRequiredArea = c.applicator.netArea*c.applicator.multiplyFactor;
                            return p + (accumulatedArea > 0 ? (netArea/accumulatedArea)*applicatorRequiredArea : 0);
                        }, 0) + (propertyRequiredParkingArea*parkings);
        return grossArea;
        
    } else {
        return null;
    }
}

const getAreaUnitsByUser = async function(usersID) {
    const result = await db.sequelize.query('call sp_demarcated_get_user_area_units(?)',{replacements:[usersID]});
    if (result && result.length > 0) {
        return result;
        // return Array.isArray(result) ? result.map(item => {
        //     item.grossArea = getGrossArea(item.conversionAreaSnapshot);
        //     return item;
        // }) : [];
    } else {
        return [];
    }
}

const userAssetAccumulatedArea = async function(userID, assetID, area) {
    console.log("userID, assetID, area", userID, assetID, area);
    const transaction = await db.sequelize.transaction();
    try {
        await db.sequelize.query('INSERT INTO demarcatedUserAssetTransactions(userAssetID, area, `status`) VALUES (?,?,?);', {replacements: [assetID, area, 'LOCKED'], transaction});
        await db.sequelize.query('UPDATE demarcatedUserAssets SET userDeductedArea=userDeductedArea+? WHERE id=?;', {replacements: [area, assetID], transaction})
        await transaction.commit();
        return true;
    } catch(e) {
        await transaction.rollback();
        throw e.toString();
    }
}

const getPlanByID = async function(planID) {
    const result  = await db.sequelize.query('SELECT * FROM demarcatedAreaUnitPlans WHERE id=?;', {replacements: [planID], type: QueryTypes.SELECT});
    if( result.length > 0 ) {
        return result[0];
    } else {
        throw 'Plan not fetched!';
    }
}

const getUserUnitRelatedData = async function(userID, unitID) {
    const result  = await db.sequelize.query("SELECT USER_PROPERTY_STATES(?, demarcatedAreaUnits.propertyID, 'PORTFOLIO_BALANCE') as portfolioBalance, demarcatedAreaUnits.propertyID FROM demarcatedAreaUnits INNER JOIN property ON property.id=demarcatedAreaUnits.propertyID WHERE demarcatedAreaUnits.id=?;", {replacements: [userID, unitID], type: QueryTypes.SELECT});
    if( result.length > 0 ) {
        return result[0];
    } else {
        throw 'user not fetched!';
    }
}

const processBuyPropertyUnit = async function(id, userID, plan) {
    const transaction = await db.sequelize.transaction();
    try {
        let data = null;
        const property = await getPropertyByUnitID(id);
        if( property ) {
            if( property.propertyType==='HOMES' ) {
                data = await getHomesAreaUnitByID(id);
            } else {
                data = await getAreaUnitByID(id)
            }
            if( data ) {
                const userData = await getUserUnitRelatedData(userID, id);
                const userBalance = userData.portfolioBalance;
                const planArea = Number(((data.grossArea/100)*plan.percentage).toFixed(2));
                let freezArea = 0;
                let pledgeArea = 0;
                if( userBalance >= planArea ) {
                    if( userBalance>data.grossArea ) {
                        freezArea = data.grossArea;
                        pledgeArea = 0;
                    } else {
                        freezArea = userBalance;
                        pledgeArea = 0;
                    }
                } else {
                    freezArea = userBalance;
                    pledgeArea = planArea-freezArea;
                }
                const areaConversionSnapshot = await getConversionAreaSnapshot(id);
                const developmentround = await getDevelopmentRound(userData.propertyID);
                let clientID = await fetchCLientID(userID)
                clientID=clientID.clientID
                const userAsset = await db.sequelize.query('INSERT INTO demarcatedUserAssets(userID, areaUnitID, `status`, conversionAreaSnapshot, grossArea, userDeductedArea, areaUnitPlanID) VALUES (?, ?, ?, ?, ?, ?, ?)', {replacements: [userID, id, plan.unitStatus, (areaConversionSnapshot ? JSON.stringify(areaConversionSnapshot) : null), data.grossArea, (freezArea > 0 ? userBalance : 0), plan.id], transaction});
                if( freezArea > 0 ) {
                    await db.sequelize.query('INSERT INTO demarcatedUserAssetTransactions(userAssetID, area, `status`) VALUES (?,?,?);', {replacements: [userAsset[0], freezArea, 'LOCKED'], transaction});
                }
                if( pledgeArea > 0 ) {
                    let transactionResult = await db.sequelize.query("INSERT INTO tradeactivity(sellerID, buyerID, roundID, areaPledged, totalPrice, propertyID, sqftPrice, statusID, createdAt, updatedAt, `medium`, internalStatus, paymentDate, paymentMode,clientID) SELECT property.ownerID, ?, ?, ?, ?*?, property.id, ?, 2, NOW(), NOW(), 'DEMARCATION', 'pending', DATE_ADD(NOW(), INTERVAL 7 DAY), 1,? FROM property WHERE property.id=? LIMIT 1", {replacements: [userID, developmentround.id ,pledgeArea, pledgeArea, developmentround.pricePerSqft, developmentround.pricePerSqft,clientID, userData.propertyID], transaction});
                    await db.sequelize.query("UPDATE tradeactivity SET queueNumber=? WHERE id=?", {replacements: [transactionResult[0], transactionResult[0]], transaction});
                    await db.sequelize.query('INSERT INTO demarcatedUserAssetTransactions(userAssetID, area, `status`, tradeActivityID) VALUES (?,?,?,?);', {replacements: [userAsset[0], pledgeArea, 'PENDING', transactionResult[0]], transaction});
                    await db.sequelize.query('UPDATE demarcatedUserAssets SET planTradeActvityID=? WHERE id=?', {replacements: [transactionResult[0], userAsset[0]], transaction})
                }
                await transaction.commit();
                return true;
            } else {
                throw 'Area Unit not found';
            }
        } else {
            throw 'Proprty not found!';
        }
    } catch(e) {
        await transaction.rollback();
        throw e.toString();
    }
}
const fetchCLientID = async function (id){
    const result  = await db.sequelize.query('select clientID from users where  id=?',{replacements:[id]});
   
    if(result && result[0] ){
        
       return result[0][0];
    } else
    return {clientID:null};

}

// const buyHomesProperty = async function(id, userID, plan) {
//     const data = await core.demarcatedAreaUnitDB.getHomesAreaUnitByID(id);
//     if( data ) {
//         const userData = await getUserUnitRelatedData(userID, id);
//         const userBalance = userData.portfolioBalance;
//         const planArea = Number(((data.grossArea/100)*plan.percentage).toFixed(2));
//         let freezArea = 0;
//         let pledgeArea = 0;
//         if( userBalance >= planArea ) {
//             freezArea = planArea;
//             pledgeArea = 0;
//         } else {
//             freezArea = userBalance;
//             pledgeArea = planArea-freezArea;
//         }
//         const snapshot = getConversionAreaSnapshot(id);

//     } else {

//     }
// }

const buyProperyUnit = async function(id, userID, planID) {
    const plan = await getPlanByID(planID);
    if( plan ) {
        const reserved = await isReserved(id);
        if(!reserved) {
            return processBuyPropertyUnit(id, userID, plan);
            // const property = await core.demarcatedAreaUnitDB.getPropertyByUnitID(id);
            // if( property ) {
            //     if( property.propertyType==='HOMES' ) {
            //         return buyHomesProperty(id, userID, plan);
            //     } else {
            //         return buyBuildingProperty(id, userID, plan);
            //     }

            // } else {

            // }
        } else {
            throw 'Unit is already reserved!'
        }
    } else {
        throw 'Plan not found!'
    }
    
}


const fetchDemarcationViews = async function (unitId){
    let count = 0;
    const result  = await db.sequelize.query('select count(*) as count from demarcatedAreaUnitsViews where  areaUnitId=?',{replacements:[unitId]});
   
    if(result && result[0] ){
        
       return result[0][0].count;
    } else
    return count;

}


const getAreaUnitsByRange = async function(obj){
    
    let type = demarcatedOptions[obj.apartmentType];
    const result = await db.sequelize.query('call sp_demarcated_unit_based_on_price_range(?,?,?)',{replacements:[obj.propertyId,obj.maxInvestment,type]});
    //console.log(result);
    if (result && result.length > 0) {
        return result;
    } else {
        return [];
    }
}

const getDashboardDemarcatedAreaUnits = async function() {
    const result = await db.sequelize.query('call sp_get_dashboard_demarcated_units()');
    if( result && result.length>0 ) {
        return result;
    } else {
        return [];
    }
}


const getProjectsArea = async function(userId){
    const result = await db.sequelize.query('call sp_dashboard_project_listing(?)',{replacements:[userId]});
    if(result && result.length >0){
        return result;

    }else {
        return [];

    }
}


module.exports.getAreaCategoriesByPropertyID  = getAreaCategoriesByPropertyID;
module.exports.getAreaUnitByID = getAreaUnitByID;
module.exports.subscribeUnit = subscribeUnit;
module.exports.fetchWatchCount = fetchWatchCount;
module.exports.getAreaUnits = getAreaUnits;
module.exports.updateStatus = updateStatus;
module.exports.demarcatedUnitGallery = demarcatedUnitGallery;
module.exports.getAreaUnitsByUser = getAreaUnitsByUser;
module.exports.userAssetAccumulatedArea = userAssetAccumulatedArea;
module.exports.getHomesAreaUnitByID = getHomesAreaUnitByID;
module.exports.getPropertyByUnitID = getPropertyByUnitID;
module.exports.buyProperyUnit = buyProperyUnit;
module.exports.fetchDemarcationViews = fetchDemarcationViews;
module.exports.getAreaUnitsByRange = getAreaUnitsByRange;
module.exports.getDashboardDemarcatedAreaUnits = getDashboardDemarcatedAreaUnits;
module.exports.getProjectsArea =  getProjectsArea;