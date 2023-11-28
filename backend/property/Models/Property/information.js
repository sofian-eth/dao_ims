
const db = require('../db.js');
const knex = db.knex;
const statusEnum = require('../../resources/statusEnum');
async function projectView(userID, propertyID){

    // console.log("User ID",userID);
    // console.log("Property ID",propertyID);
    return knex('propertyViews')
    .where({'viewId': userID})
    .where({'propertyId': propertyID})
    .select('*')
    .then(function(result){
        if(result.length)
            return true;
        else 
            return false;    
    }).catch(function(error){
        throw error;
    })
}

async function insertProjectView(userID, propertyID){
    return knex('propertyViews')
    .insert({viewId: userID, propertyId : propertyID, isInterested:true, createdAt: new Date(), updatedAt: new Date()})
    .then(function(result){
      return result;  
    })
    .catch(function(error){
        throw error;
    })
}
async function projectViewCount(propertyID){
    return knex('propertyViews')
    .count('propertyId', {as: 'totalViews'})
    .where({propertyId :propertyID})
    .then(function(result){
        if(result.length){
            return result[0];  
        }
    })
    .catch(function(error){
        throw error;
    })

}
async function projectScore(projectID){
    return knex('propertyScores as s')
    .join('scoreEnums as e','s.scoreID','=','e.id')
    .join('property as p','s.propertyID','=','p.id')
    .where({'s.propertyID': projectID,'p.status':statusEnum.active})
    .select('s.percentage as projectScorePercentage','e.name as projectScoreName','e.description as projectScoreDescription')
        .then(function(result){
            let response = result;
          
            return response;
        })
        .catch(function(error){
            throw error;
        })

}
async function projectRisk(projectID){
    return knex('propertyRisks as r')
    .join('riskEnums as e','r.riskID','=','e.id')
    .where({'r.propertyID': projectID})
    .select('e.name as riskName')
        .then(function(result){
            let response = result;
           
            return response;
        })
        .catch(function(error){
            throw error;
        })

}
async function projectMatrix(projectID){
    return knex('propertyselectionmatrixenum as m')
    .join('areamatrixenum as e','m.areaMatrixID','=','e.id')
    .join('property as p','m.propertyID','=','p.id')
    .where({'m.propertyID': projectID,'p.status':statusEnum.active})
    .select('e.name')
        .then(function(result){
            let response = result;
            if(result.length)
                response = result;
            return response;
        })
        .catch(function(error){
            throw error;
        })

}
async function projectInformation(projectID){
    let sqlQuery = `select p.id, p.name, p.description, p.category,p.viewPlan,p.planDescription,
     p.location, p.totalSqft, p.coverPhoto, p.propertySymbol,
     p.blockchainMainContract, p.salesAgreementLink, p.termsLink,
     s.name as status,p.longDescription,p.daoScore,p.reviewCount,
     p.rating,p.locationPoints,p.locationDescription,p.philosophyTitle,
     p.philosophyDescription,p.premiumFeatures,p.youtubeFeed,p.propertyLogo, p.handbookUrl, p.propertyNearBy,
     JSON_UNQUOTE(p.config-> "$.blockchainConfiguration.network") 
     as blockchainNetwork,p.isDemarcated, GET_PROJECT_COMPLETION(?) as 
     completedPercentage from property as p inner join statusenum as s
      on p.statusID=s.id  where p.id=? and p.status=?`;
  
    return knex.raw(sqlQuery,[projectID,projectID,statusEnum.active])
    // return knex('developmentrounds as d').where('d.propertyID','=',projectID)
    //     .join('statusenum as s', 'd.statusID', '=', 's.id')
    //     .join('property as p','d.propertyID','=','p.id')
    //     .select(`d.id, s.name, d.roundName, d.roundDetails, d.startDate, d.endDate, d.funds, d.pricePerSqft, d.lockFundsTx, d.unlockFundsTx, d.discounts,JSON_UNQUOTE(p.config-> "$.blockchainConfiguration.network") as blockchainNetwork`,`JSON_UNQUOTE(p.config-> "$.blockchainConfiguration.mainNetExplorerUrl") as mainNetExplorerUrl,JSON_UNQUOTE(p.config-> "$.blockchainConfiguration.testNetExplorerUrl") as testNetExplorerUrl `)
        .then(function (result) {
            console.log(result);

            return result[0][0];
        })
        .catch(function (error) {
            throw error;
        })


    // return knex('property as p')
    // .join('statusenum as s','p.statusID','=','s.id')
    // .where({'p.id': projectID,'p.status':statusEnum.active})
    // .select('p.id','p.name','p.description','p.location','p.totalSqft','p.coverPhoto','p.propertySymbol','p.blockchainMainContract','p.salesAgreementLink','p.termsLink','s.name as status','p.longDescription','p.daoScore','p.reviewCount','p.rating','p.locationPoints','p.locationDescription','p.philosophyTitle','p.philosophyDescription','p.premiumFeatures','p.youtubeFeed','p.propertyLogo')
    //     .then(function(result){
    //         let response = result;
    //         if(result.length)
    //             response = result[0];
    //         return response;
    //     })
    //     .catch(function(error){
    //         throw error;
    //     })

}
async function projectTradeTableInfo(projectID){

    return knex('tradeactivity as t')
    .where({'t.propertyID': projectID})
    .select('t.*')    
    .then(function(result){
            let response = result;
            if(result.length)
                response = result[0];
            return response;
        })
        .catch(function(error){
            throw error;
        })

}

async function sellerActiveInvestments(userID){

    return knex('tradeactivity as t')
    .join('statusenum as s','t.statusID','=','s.id')
    .join('developmentrounds as d','t.roundID','=','d.id')
    .join('property as p','d.propertyID','=','p.id')
    .where({'s.name': 'locked'})
    .where({'t.sellerID': userID})
    .groupBy('d.propertyID')
    .sum({ totalPledgedArea: 't.areaPledged' })
    .sum({ totalPledgedPrice: 't.totalPrice' })
    .select('d.propertyID')
    .then(function(result){
        // let response = result;
        // if(result.length)
        //     response = result[0];
        return result;
    })
    .catch(function(error){
        throw error;
        })
        
    }
async function activeInvestments(userID){

    return knex('tradeactivity as t')
    .join('statusenum as s','t.statusID','=','s.id')
    .join('developmentrounds as d','t.roundID','=','d.id')
    .join('property as p','d.propertyID','=','p.id')
    .where({'s.name': 'locked'})
    .where({'t.buyerID': userID})
    .where({'p.status':statusEnum.active})
    .groupBy('d.propertyID')
    .sum({ totalPledgedArea: 't.areaPledged' })
    .sum({ totalPledgedPrice: 't.totalPrice' })
    .select('d.propertyID')
    .then(function(result){
        // let response = result;
        // if(result.length)
        //     response = result[0];
        return result;
    })
    .catch(function(error){
        throw error;
        })
        
    }
    
    async function activeRoundsDetail(userID,propertyID){
    return knex('developmentrounds as d')
    .join('statusenum as s','d.statusID','=','s.id')
    .join('propertystats as st','d.propertyID','=','st.propertyID')
    .where({'d.propertyID': propertyID,'p.status':statusEnum.active})
    .where({'s.name': 'Active'})
    .select('st.fundingRounds as totalRounds','d.roundName as activeRoundName','d.pricePerSqft  as activeRoundPricePerSqft')
        .then(function(result){
           
            return result[0];
        })
        .catch(function(error){
            throw error;
        })

}

async function developmentUpdates(propertyID){
    return knex('property')
    .where({id:propertyID})
    .select('developmentUpdate')
    .then(function(result){
        return result;
    })
    .catch(function(error){
        throw error;
    })
}


async function youtubeFeed(propertyID){
    return knex('property')
    .where({id: propertyID})
    .select('youtubeFeed')
    .then(function(result){
        return result;
    })
    .catch(function(error){
        throw error;
    })

};

async function pledgeAreaStats(propertyID){
    return knex('tradeactivity')
        .sum('areaPledged')
        .where({statusID:2,propertyID:propertyID})

        .then(function(result){
            return result;
        })
        .catch(function(error){
            throw error;
        })
}

async function getStats (projectId) {
    console.log(projectId);
    return new Promise((resolve,reject)=>{
        knex.raw('CALL `sp_get_project_stats`(?);',[projectId]).then(x=>{
            console.log(x);
            if(x.length>0&&x[0].length>0&&x[0][0].length>0){
                resolve({
                    success:true,
                    data:x[0][0]
                });
            }else{
                resolve({
                    success:false,
                    data:x
                });
            }
            
        }).catch(x=>{
            resolve({
                success:false,
                data:x
            });
        })
    })
}
module.exports.sellerActiveInvestments = sellerActiveInvestments;
module.exports.activeRoundsDetail = activeRoundsDetail;
module.exports.activeInvestments = activeInvestments;
module.exports.projectViewCount = projectViewCount;
module.exports.insertProjectView = insertProjectView;
module.exports.projectView = projectView;
module.exports.projectInformation = projectInformation;
module.exports.developmentUpdates = developmentUpdates;
module.exports.youtubeFeed =youtubeFeed;
module.exports.projectScore =projectScore;
module.exports.projectRisk =projectRisk;
module.exports.projectMatrix =projectMatrix;
module.exports.projectTradeTableInfo =projectTradeTableInfo;
module.exports.pledgeAreaStats = pledgeAreaStats;
module.exports.getStats = getStats;
