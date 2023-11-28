const db = require('../dbModels/index');
const responseObject = require('../dto/response/response-model');
const propertyResponse = require('../dto/response/propertyResponse');
const bankAccountResponse = require('../dto/response/bankAccountResponse');
const { QueryTypes } = require('sequelize');

const getProperties = async function (id, category) {
    let resp = new responseObject();
    let _data = [];
    try {
        let sql;
        if(category)
        sql = `SELECT *, PROPERTY_STATS(p.id, 'CURRENT_RATE') as currentRate FROM property as p inner join propertystats as ps on ps.propertyID=p.id WHERE p.category=? and (p.propertyAccessType='PUBLIC' OR p.id IN (SELECT user_property.property_id FROM user_property WHERE user_property.user_id=?))`;
        else
        sql = `SELECT *, PROPERTY_STATS(p.id, 'CURRENT_RATE') as currentRate FROM property as p inner join propertystats as ps on ps.propertyID=p.id and (p.propertyAccessType='PUBLIC' OR p.id IN (SELECT user_property.property_id FROM user_property WHERE user_property.user_id=?))`;
        let _properties = await db.sequelize.query(sql,{replacements:(category ? [category, id] : [id])})
        if (_properties) {
            await _properties[0].reduce(async (memo, _property) => {
                await memo;
                let item = new propertyResponse.propertyResponse(_property, id);
                // portfolio balance
                let _propertyportfolio = await db.sequelize.query("select * from portfoliobalance where propertyID=? and userID <> ?",{replacements:[_property.id,_property.ownerID]});
                item.propertyInvestors = _propertyportfolio && _propertyportfolio.length > 0 ? _propertyportfolio[0].length : 0;

                // rounds infor
                let _propertyRounds = await db.sequelize.query("select * from developmentrounds where propertyID=? ",{replacements:[_property.id]});
                let _rounds = item.getRoundsInfoByProperty(_propertyRounds[0]);
                item.propertyCurrentRound = _rounds.currentRound ? _rounds.currentRound.replace('Funding', '') : 0; // statusID == 8
                item.propertyRounds = _rounds.totalRounds; // total count
                item.propertyCurrentRoundPrice = _rounds.currentRoundPrice ? _rounds.currentRoundPrice : 0;
                item.nextRoundPrice = _rounds.nextRoundPrice ? _rounds.nextRoundPrice : 0;

                //orders
                let _orders = await db.sequelize.query("select * from orders where propertyID= :pid and isActive=1 and status='active'",{replacements:{'pid':_property.id}});
                _orders = _orders[0];
                item.propertyListingin7days = _orders && _orders.length > 0 ? item.setLast7DaysOrders(_orders) : 0;
                item.lastPropertySoldArea = _orders && _orders.length > 0 ? item.getLastOrderArea(_orders) : 0;
                item.propertyTotalOrders = _orders && _orders.length > 0 ? _orders.length : 0;
                item.propertyOrdersPricesList = _orders && _orders.length > 0 ? _orders.map(order => order.pricePerSqFt) : [];
                item.currentRate = _property.currentRate;
                _data.push(item);

                // Fetch Area Available for sale
                if (id > 0) {
                    const result = await db.sequelize.query("select * from userArea where userID=:uid and propertyID=:pid", {
                        replacements: {
                            uid: id,
                            pid: _property.id
                        },
                        type: QueryTypes.SELECT
                    });
                    if (result && result.length > 0) {
                        item.areaAvailable = result[0].area;
                    } else {
                        item.areaAvailable = 0;
                    }
                    // let _availableArea = await db.sequelize.query('CALL sp_get_property_available_for_sale (:_property_id, :_user_id)', { replacements: { _property_id: _property.id, _user_id: id } });
                    // _availableArea = _availableArea[0];
                    // item.areaAvailable = item.getAreaAvailableForSale(_availableArea);
                }
            }, undefined);
            resp.setSuccess("order fetched");
            resp.data = _data;
        } else {
            resp.setError(_orders.toString(), "ORDERS_NOT_FETCHED");
        }
    } catch (ex) {
        console.log(ex);
        resp.setError(ex.toString(), "Properties_NOT_FETCHED");
    }
    return resp;
}
/**
 * 
 * @param {Number} id 
 * @returns {Promise<any>}
 */
const getPropertyConfig = async function (id) {
    let sql = "select config from property where id =?";
    let _properties = await db.sequelize.query(sql, {
        replacements:[id],
        type: QueryTypes.SELECT
    });
    return _properties[0].config;
}


const getPropertyInformation = async function (id) {
    let sql = "select * from property where id =?";
    let _properties = await db.sequelize.query(sql, {
        replacements:[id],
        type: QueryTypes.SELECT
    });
    return _properties[0];
}

/**
 * 
 * @param {Number} id 
 * @returns {Promise<any>}
 */
const getPropertyBanks = async function (id) {
    let _data = [];
    let sql = "select * from bankinformationenum where propertyID = ?";
    let _propertyBanks = await db.sequelize.query(sql, {
        replacements:[id],
        type: QueryTypes.SELECT
    });

    if(_propertyBanks && _propertyBanks.length > 0) {
        _propertyBanks.forEach(element => {
            element.bankLogo = element.logo;
            element.iban = element.IBAN;
            _data.push(new bankAccountResponse.bankAccountResponse(element));
        });
    }
    return _data;
}


const getPropertyDetail = async function(id,category){
    let _data = [];
    let sql = "call sp_get_property_detail(?,?)";
    let _propertyDetail = await db.sequelize.query(sql,{
        replacements:[id,category],
    }, {type: QueryTypes.SELECT});
    return (_propertyDetail && _propertyDetail.length > 0) ? _propertyDetail[0] : null;    

    // const data = (_propertyDetail && _propertyDetail.length > 0) ? _propertyDetail[0] : null; 
    // if( data ) {
    //     const historicPropertyWorths = await db.sequelize.query("SELECT * FROM propertyHistoricWorths WHERE propertyHistoricWorths.propertyID="+id, {type: QueryTypes.SELECT})
    //     data.historicPropertyWorths = historicPropertyWorths;
    //     const propertyType = await db.sequelize.query("select propertytype from propertystats where propertyID=?",{replacements:[id],type:QueryTypes.SELECT});
    //     data.type = propertyType ? propertyType[0].propertytype:'appartment' ;
    // }   
    // return data;
}

const propertyGalleryImges = async function(propertyID){
    let sql = "select * from propertygallery pg join media m on pg.mediaID=m.id where pg.propertyID=? and pg.isDeleted is not true order by pg.id desc";
    let galleryImges = await db.sequelize.query(sql,{
        replacements:[propertyID],
    },{type: QueryTypes.SELECT});

    return (galleryImges && galleryImges.length > 0) ? galleryImges[0] : null;

}


const totalTranscations = async function(propertyID){
  
    let sql = `select count(id) as totalTransaction from tradeactivity where propertyID=? and statusID in(3,14);`;
    let totalTransaction = await db.sequelize.query(sql,{
        replacements:[propertyID],
    },{type: QueryTypes.SELECT});
    return (totalTransaction && totalTransaction.length > 0)? totalTransaction[0][0].totalTransaction : 0;

}


const getPropertyStakeholder = async function(id){
  
    let sql = "select ps.name,ps.thumbnailImage,ps.type,ps.createdAt,ps.website,pps.type from property_propertyStakeholders as pps inner join propertyStakeholders as ps on pps.propertyStakeholderID = ps.id where pps.propertyID=?";
    let propertyStakeHolders = await db.sequelize.query(sql,{
        replacements:[id],
    },{type: QueryTypes.SELECT});

    return (propertyStakeHolders && propertyStakeHolders.length > 0)? propertyStakeHolders[0] : null;

}


const propertyReminder = async function(propertyId,userId){
    let fetchRecord = "select userID,propertyID from propertyReminder where propertyID=? and userID=?";
    let propertyReminderRecord = await db.sequelize.query(fetchRecord,{replacements:[propertyId,userId]});
    if(propertyReminderRecord && propertyReminderRecord.length > 0 && propertyReminderRecord[0].length > 0)
        return true;
    
    let sql = "insert into propertyReminder(propertyID,userID,createdAt,updatedAt) values (?,?,?,?)";
    let createdAt, updatedAt;
    createdAt=new Date(Date.now())
    updatedAt=new Date(Date.now())
    let insertRecord = await db.sequelize.query(sql,{replacements:[propertyId,userId,createdAt,updatedAt]});
    return true;    

}


const propertyFundingRound = async function(propertyId){
    let fetchRecord = "select id,roundName,displayStartDate,displayEndDate,pricePerSqft,roundNumber, developmentrounds.marketPrice from developmentrounds where propertyID=? and statusID=9 ORDER BY developmentrounds.roundNumber ASC;";
    let propertyFundingRound = await db.sequelize.query(fetchRecord,{replacements:[propertyId]});
    if(propertyFundingRound && propertyFundingRound.length > 0 && propertyFundingRound[0].length > 0)
        return propertyFundingRound[0];

    else
        return;
}

const addPropertyRequest = async function(propertyID, userID) {
    let data = await db.sequelize.query("call sp_create_property_access_request(?,?)",{replacements: [parseInt(propertyID), parseInt(userID)]});
    if( data && data.length>0 ) {
        return data[0];
    } else {
        return {status: 0};
    }
}

const readPropertyRequest = async function(propertyID, userID) {
    return db.sequelize.query("UPDATE propertyAccessRequests SET propertyAccessRequests.isRead=1 WHERE propertyAccessRequests.propertyID=? AND propertyAccessRequests.userID=?;", {replacements: [propertyID, userID]});
}

module.exports = { getProperties, getPropertyConfig, getPropertyBanks,getPropertyInformation,getPropertyDetail ,getPropertyStakeholder,propertyReminder,propertyGalleryImges,propertyFundingRound,totalTranscations, addPropertyRequest, readPropertyRequest};