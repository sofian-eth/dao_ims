
const { QueryTypes } = require('sequelize');
const db = require('../../dbModels/index');
const { transferAreaRequest } = require('../../dto/requests/transferAreaRequest');

const peerToPeerDal = {};
/**
 * 
 * @param {String} walletAddress 
 * @param {Number} userId 
 * @returns {Boolean}
 */
peerToPeerDal.checkWalletAddress = async function (walletAddress,userId){
    let sql = "SELECT id as receiverId, legalName as receiverName, email as receiverEmail, phoneNumber as receiverPhoneNumber, createdAt FROM users where (walletAddress=? or tronAddress=?) and id!=?";
    const result = await db.sequelize.query(sql,{replacements:[walletAddress,walletAddress,userId],type:QueryTypes.SELECT});
    return result;
}
peerToPeerDal.getProperties = async function (walletAddress){
    let sql = "SELECT id, name, propertyLogo, propertySymbol,config FROM property";
    const result = await db.sequelize.query(sql,{replacements:[],type:QueryTypes.SELECT});
   let network = '';
    if(walletAddress.includes('0x')){
        network = 'eth';
    }
    if(walletAddress.includes('T')){
        network = 'trx';
    }
    let result2 = result.filter(x=>{
        // debugger
        if(x.config.blockchainConfiguration.network === network){
            x.config = x.config.blockchainConfiguration.network;
            return  x;
        }
    })
    
    return result2;
}
peerToPeerDal.hidePopup = async function (userId){
    let sql = "update users set isP2PPopupShow = ? where id=?";
    const result = await db.sequelize.query(sql,{replacements:[false,userId],type:QueryTypes.UPDATE});
    if(!result){
        return [];
    }
    return result;
}
peerToPeerDal.allProperties = async function (walletAddress){
    let sql = "SELECT id, name, propertyLogo, propertySymbol,config,json_extract(config,'$.serviceCharges.seller.peerToPeerRelations') as serviceCharges FROM property";
    const result = await db.sequelize.query(sql,{replacements:[],type:QueryTypes.SELECT});
    result.map(x=>{
        // debugger
            x.config = x.config.blockchainConfiguration.network;
    })
    
    return result;
}
peerToPeerDal.sellerName = async function (userId,network){
    let rawQuery;
    if(network==='eth' || network === 'polygon'){
       rawQuery = ', walletAddress as senderWalletAddress ';
    }
    if(network==='trx'){
      rawQuery = ', tronAddress as senderWalletAddress ';
    }
    let sql = `SELECT id, legalName as senderName, email as senderEmail ${rawQuery} FROM users where id=?`;
    const result = await db.sequelize.query(sql,{replacements:[userId,userId],type:QueryTypes.SELECT});
    return result;
}
peerToPeerDal.projectName = async function (userId,project){
    let sql = "SELECT name, propertyLogo, USER_PROPERTY_STATES(?, id, 'PORTFOLIO_BALANCE') as portfolio FROM property where id=?";
    const result = await db.sequelize.query(sql,{replacements:[userId,project],type:QueryTypes.SELECT});
    return result;
}

/**
 * 
 * @param {transferAreaRequest} model 
 */
peerToPeerDal.transferArea = async function(model){
    // debugger;    
    let sql = "CALL sp_transfer_area_double(:_buyerId1,:_buyerId2,:_propertyId,:_area1,:_area2,:_sellerId,:_p2pdetail);";
        const result = await db.sequelize.query(sql,{replacements:{
        _buyerId1:model.receiverId,
        _buyerId2:model.ownerId,
        _propertyId:model.propertyId,
        _area1:model.areaToReceiver,
        _area2:model.areaToOwner,
        _sellerId:model.userId,
        _p2pdetail:model.p2pDetail
    }});
            if(result.length>0&&result[0].RESULT=='DONE'){
                
            return {
                success:true,
                data:result[0].RESULT,
                id:result[0].userTradeID
                
            };
            }else{
            return {
                success:false,
                data:result,
            };
            }

    }
peerToPeerDal.transferAreaOwner = async function(model){

    let sql = "CALL sp_transfer_area(:_walletAddress,:_propertyId,:_area,:_sellerId);";
    const result = await db.sequelize.query(sql,{replacements:{
        _walletAddress:model.ownerWalletAddress,
        _propertyId:model.project,
        _area:model.ownerCharges,
        _sellerId:model.userId}});
        if(result.length>0){
            return {
                success:true,
                data:result
            };
        }else{
            return {
                success:false,
                data:result
            };
        }
    }

    
    peerToPeerDal.recentTransferArea = async function(userId){
       try{ 
        //    debugger
        let pageNo = 1;
        let pageSize = 50;
        let search = '';
        if(arguments.length>0){
            pageNo=arguments[1]?arguments[1]:1;
            pageSize=arguments[2]?arguments[2]:50;
            search= arguments[3]?arguments[3]:'';
        }
        let sql = `select t.id, t.internalStatus as status,t.areaPledged as area,t.createdAt as age,t.p2pdetail, t.blockchainReference,\
        p.propertySymbol as projectSymbol, p.propertyLogo as projectLogo,p.name as projectName, \
        u.legalName as receiverName, us.phoneNumber as senderNumber, u.phoneNumber as receiverNumber, \
         us.legalName as senderName,t.sellerID as senderId,t.buyerID as receiverId, \
         u.walletAddress as receiverEthAddress,us.walletAddress as senderEthAddress, \
         u.tronAddress as receiverTronAddress,us.tronAddress as senderTronAddress,p.config  from tradeactivity as t\
        INNER JOIN developmentrounds as d on d.id = t.roundID \
        INNER JOIN property as p on p.id = t.propertyID    \
        INNER JOIN statusenum as s on s.id = t.statusID    \
        INNER JOIN users as u on u.id = t.buyerID    \
        INNER JOIN users as us on us.id = t.sellerID    \
        where (t.buyerID = ? OR t.sellerID=?) AND t.medium = ? AND (p.propertySymbol like ? OR  u.legalName like ?) AND t.buyerID != p.serviceChargesAccountID  ORDER BY t.id DESC limit ? offset ?`;
        // AND t.buyerID != p.serviceChargesAccountID
        
        // let sql = `select t.blockchainReference , t.internalStatus as blockchainStatus, t.id,t.sellerID as senderId,t.buyerID as buyerId,t.areaPledged as transferdArea,t.statusID,t.createdAt,\
        // p.id as projectId, p.name as projectName ,p.propertySymbol as projectSymbol, p.marketplaceThumbnail as projectImage, \
        // u.legalName as buyerName,us.legalName as senderName, \
        //  u.walletAddress as buyerWalletAddress,us.walletAddress as senderWalletAddress, \
        //  t.sqftPrice * t.areaPledged as worth from tradeactivity as t \
        // INNER JOIN developmentrounds as d on d.id = t.roundID \
        // INNER JOIN property as p on p.id = t.propertyID    \
        // INNER JOIN statusenum as s on s.id = t.statusID    \
        // INNER JOIN users as u on u.id = t.buyerID    \
        // INNER JOIN users as us on us.id = t.sellerID    \
        // where (t.buyerID = ? OR t.sellerID=?) AND t.medium = ? AND t.buyerID != p.serviceChargesAccountID ORDER BY t.id DESC limit ? offset ?`;
        
        const result = await db.sequelize.query(sql,
            { replacements: [userId,userId,'Peer_To_Peer',`%${search}%`,`%${search}%`,pageSize,(pageNo-1)*pageSize],type:QueryTypes.SELECT })
            let recentTransfer = [];
            // debugger
            result.map(x=>{
                if (userId == x.senderId) {
                    x.type = 'Transferred'
                }
                if (userId == x.receiverId) {
                    x.type = 'Received'
                }
                // x.config = JSON.parse(x.config)
                // debugger
                x.mainNetUrl = x.config.blockchainConfiguration.mainNetUrl
                x.config = x.config.blockchainConfiguration.network
                if(x.config === 'eth'){
                    x.senderWalletAddress = x.senderEthAddress;
                    x.receiverWalletAddress = x.receiverEthAddress;
                }
                if(x.config === 'trx'){
                    x.senderWalletAddress = x.senderTronAddress;
                    x.receiverWalletAddress = x.receiverTronAddress;
                }
                
            })
            recentTransfer = result.map(({senderEthAddress,receiverEthAddress,senderTronAddress,receiverTronAddress, ...x})=>{
              return x;  
            })
        return recentTransfer;
        }
        catch(e){
            console.log(e)
        }  
    }
    peerToPeerDal.frequentRecipients = async function(userId){
        
        let pageNo = 1;
        let pageSize = 50;
        let search = '';
        if(arguments.length>0){
            pageNo=arguments[1]?arguments[1]:1;
            pageSize=arguments[2]?arguments[2]:50;
            search= arguments[3]?arguments[3]:'';
        }
        let query = `select r.id, r.recipientId, r.recipientName as recipientNickName, r.network, u.legalName as recipientName, 
        u.phoneNumber as recipientPhoneNumber, IF(r.network = 'eth', u.walletAddress , u.tronAddress) as walletAddress, 
        (select p.propertyLogo from tradeactivity as t left join property as p on p.id = t.propertyID where sellerID=r.userId and buyerID = r.recipientId and medium='Peer_To_Peer' order by t.id desc limit 1 ) as lastPropertyLogo,
        (select createdAt from tradeactivity where sellerID=r.userId and buyerID = r.recipientId and medium='Peer_To_Peer' order by id desc limit 1 ) as lastPropertyTime 
        from usersRecipient as r  left join users as u on u.id = r.recipientId 
        where r.userId =? and r.recipientId !=? and isDeleted = 0 and (u.legalName like ? ) limit ? offset ?`;
        const queryResult = await db.sequelize.query(query,
            { replacements: [userId,userId,`%${search}%`,pageSize,(pageNo-1)*pageSize],type:QueryTypes.SELECT })
            if(queryResult.length == 0){
                return [];
            }
            return queryResult;
            
        //     queryResult.forEach(r=>{
        //       rawQuery = 'walletAddress'
        //     }
        //     if(queryResult.network === 'trx'){
        //         rawQuery = 'tronAddress as walletAddress'
        //     }
        //     let sql = `select id as recipientId, legalName as recipientName, phoneNumber as recipientNumber, ${rawQuery} where id=?`;
        // const result = await db.sequelize.query(sql,
        //         return {};
        //     if(getProperties.length == 0){
        //     getProperties.filter(x=>{
        //         }
            

    //     let sql="select  u.id as buyerID, u.legalName as buyerName, u.walletAddress as buyerWalletAddress,u.tronAddress, \
    //     p.id as propertyId, p.name as propertyName, p.marketplaceThumbnail as propertyLogo, p.propertySymbol ,p.config as blockchainNetwork from usersRecipient as r \
    //     INNER JOIN users as u on u.id = r.recipientId  \
    //     INNER JOIN property as p on p.id = r.propertyId where r.userId=? AND r.recipientId !=? ORDER BY r.id DESC LIMIT 5 \
    //     "
    //     const result = await db.sequelize.query(sql,
    //         { replacements: [userId,userId],type:QueryTypes.SELECT })
    //         if(result){
    //             result.forEach(x => {
    //                 if(x.blockchainNetwork.blockchainConfiguration.network){
    //                     x.blockchainNetwork =x.blockchainNetwork.blockchainConfiguration.network;
    //                 }
    //             });
    //         }
    //         return result;
            
    }

    peerToPeerDal.getReceiptData = async function(tradeID){
            let tradeId =tradeID;
            let sql = 'select t.blockchainReference , t.id as queueNumber, t.createdAt, t.p2pDetail,\
             t.transactionConfirmationTime as transferDate, t.areaPledged, t.sellerID,\
              t.buyerID, t.roundID, t.propertyID,d.pricePerSqft,t.areaPledged, t.internalStatus,\
            s.legalName as sellerName, s.walletAddress as sellerWalletAddress, s.tronAddress as sellerTronAddress \
            , s.email as sellerEmail,\
            b.legalName as buyerName, b.walletAddress as buyerWalletAddress, b.tronAddress as buyerTronAddress, b.email as buyerEmail, \
            p.name as propertyName, p.category,p.propertyLogo,p.config, \
            d.roundName, d.pricePerSqft * t.areaPledged as currentWorth  from tradeactivity as t \
            INNER JOIN developmentrounds as d on d.id = t.roundID \
            INNER JOIN users as s on s.id = t.sellerID \
            INNER JOIN users as b on b.id = t.buyerID \
            INNER JOIN property as p on p.id = t.propertyID \
            where t.id = ?';
        const result = await db.sequelize.query(sql,
            { replacements: [tradeId],type:QueryTypes.SELECT })
            return result;

    }

    peerToPeerDal.postFrequentRecipients = async function(obj){
        console.log(obj)
            let sqlCheck = 'select * from usersRecipient where userId =? AND recipientId = ? And network=? AND isDeleted is not true';
            const result1 = await db.sequelize.query(sqlCheck,
                { replacements: [obj.userId,obj.recipientId,obj.network],type:QueryTypes.SELECT })
                if(result1.length == 0){
                    let sql = `insert into usersRecipient(userId, recipientId,recipientName,network)
                    values('${obj.userId}','${obj.recipientId}','${obj.recipientName}','${obj.network}');`;
                    const result2 = await db.sequelize.query(sql)
                    if( result2.length == 0){
                        return {result : [],message:'Unable to add recipient'};
                    }
                        return {result : result2,message:'Recipient added successfully.'};
                }else{
                    return {result : [],message:'Recipient already exsist.'};
                }

            
    }
    // peerToPeerDal.postFrequentRecipients = async function(userID,buyerID,projectID){
    //         let sqlCheck = 'select * from usersRecipient where userId =? AND recipientId = ? And propertyId=?'
    //         const result1 = await db.sequelize.query(sqlCheck,
    //             { replacements: [userID,buyerID,projectID],type:QueryTypes.SELECT })
    //             if(result1.length == 0){
    //                 let sql = `insert into usersRecipient(userId, recipientId,propertyId)
    //                 values('${userID}','${buyerID}','${projectID}');`;
    //                 const result2 = await db.sequelize.query(sql)
    //                     return result2;
    //             }else{
    //                 return result1;
    //             }

            
    // }
    // peerToPeerDal.myArea = async function(userID){
    //     let sql = "CALL sp_get_user_projects_sell_area(:_user_id);";
    // const result = await db.sequelize.query(sql,{replacements:{
    //     _user_id:userID}});
    //         return result;
         
    // }
    peerToPeerDal.myArea = async function(userId){
        // debugger
        let sql = "select id as propertyId, name as propertyName, propertySymbol, propertyLogo, config as network, \
         USER_PROPERTY_STATES(?, id, 'PORTFOLIO_BALANCE') as area,json_extract(config,'$.serviceCharges.seller.peerToPeerRelations') as serviceCharges \
        from property where USER_PROPERTY_STATES(?, id, 'PORTFOLIO_BALANCE') != 0 ";
    const result = await db.sequelize.query(sql,{replacements:[userId, userId],type:QueryTypes.SELECT});
        if(result.length == 0){
            return [];
        }
     result.map(x=>{
            x.network = x.network.blockchainConfiguration.network;
        })
        return result;
         
    }
    peerToPeerDal.checkOwner = async function(projectId){
        let sql = 'select p.serviceChargesAccountID as ownerID , u.walletAddress as ownerWalletAddress from property as p \
        INNER JOIN users as u on u.id = p.ownerID\
          where p.id =?';
        const result = await db.sequelize.query(sql,
            {replacements: [projectId],type:QueryTypes.SELECT })
                return result;
            
    }
    peerToPeerDal.deleteRecipient = async function(obj){
        let sql = 'update usersRecipient set isDeleted = ? where id = ?';
        const result = await db.sequelize.query(sql,
            {replacements: [1,obj.recipientId],type: QueryTypes.UPDATE })
                return result;
            
    }
    peerToPeerDal.editRecipient = async function(obj){
        let sql = 'update usersRecipient set recipientName = ? where id = ?';
        const result = await db.sequelize.query(sql,
            {replacements: [obj.recipientName,obj.recipientId],type: QueryTypes.UPDATE })
                return result;
            
    }
    peerToPeerDal.p2p2Popup = async function(userId){
        let sql = 'select isP2PPopupShow from users where id =? ';
        const result = await db.sequelize.query(sql,{replacements:[userId],type:QueryTypes.SELECT});
        if(result.length == 0){
            return [];
        }
        return result;  
    }

module.exports = peerToPeerDal;