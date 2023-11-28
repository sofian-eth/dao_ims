const db = require('../../dbModels/index');
const chatResponseObject = require('../../dto/response/chatResponse');
const responseObject = require('../../dto/response/response-model');
const chatRequestDTO = require('../../dto/requests/createChatRequest');
const {QueryTypes} = require('sequelize');
const fileModule = require('../../helper/fileuploader');
const fileHandler = require('../../helper/fileuploader');




const fetchChat = async function(requestData){   
 let resp = new responseObject();
 let _data = [];

 try {
 let sqlQuery = `select c.readBit,c.senderId,c.receiverId,c.message,c.createdAt as timestamp,c.mediaID,s.nickName as senderNickName,ms.relativePath as senderProfilePicture,r.nickName as receiverNickName,mr.relativePath as receiverProfilePicture,ot.id as orderItemId,mi.*  from chat as c inner join orderItems as ot on c.orderItemId=ot.id inner join orders as o on ot.orderId=o.id inner join users as s on c.senderId=s.id inner join users as r on c.receiverId = r.id left join media as ms on s.profilePicture=ms.id left join media as mr on r.profilePicture=mr.id left join media as mi on c.mediaID=mi.id where ot.id=? and (c.senderId =? OR c.receiverId =?)`;
 console.log("sqlQuery", sqlQuery); 
 _chats = await db.sequelize.query(sqlQuery,{replacements:[requestData.orderItemId,requestData.userId,requestData.userId]});
  if(_chats && _chats[0].length > 0){
  
        let senderProfilePictureUrl = await fileModule.getMediaAsync(_chats[0][0].senderProfilePicture);
        let receiverProfilePictureUrl = await fileModule.getMediaAsync(_chats[0][0].receiverProfilePicture);
        //let _Chats = chats[0];
        // _chats[0].forEach(element => {
            for (const element of _chats[0]) {
            element.userId = requestData.userId;
            if(element.senderId == requestData.userId) {
                element.from = {
                  id: requestData.userId,
                  nickName: element.senderNickName,
                  profilePicture: await fileModule.getMediaAsync(element.senderProfilePicture)
                  };
                element.to ={ 
                id: element.receiverId,
                nickName: element.receiverNickName,
                profilePicture:await fileModule.getMediaAsync(element.receiverProfilePicture)
                
                };
                element.media={
                    mediaID:element.mediaID,
                    originalFileName:element.originalFileName,
                    fileName:element.fileName,
                    relativePath:element.relativePath,
                    documentId:element.documentId,
                    extension:element.extension,
                    size:element.size,
                }
            }
            else
              {
                  element.to  = {
                        id: requestData.userId,
                         nickName: element.receiverNickName,
                        profilePicture: await fileModule.getMediaAsync(element.receiverProfilePicture)
                  };
                  element.from  = {
                      id: element.senderId,
                      nickName: element.senderNickName,
                      profilePicture: await fileModule.getMediaAsync(element.senderProfilePicture)
                  };
                  element.media={
                    mediaID:element.mediaID,
                    originalFileName:element.originalFileName,
                    fileName:element.fileName,
                    relativePath:element.relativePath,
                    documentId:element.documentId,
                    extension:element.extension,
                    size:element.size
                }
              } 
             
             let item = new chatResponseObject.chatResponse(element);
         
             _data.push(item);
        };
           


       
  }
 } catch(err){
     resp.setError(err.toString(), "CHATS_NOT_FOUND");
 }

  resp.data = _data;
  return resp;
}


const saveChatMessage = async function(_data){
   let resp = new responseObject();
    try {
        console.log("ssafafa",_data)
        let senderId;
        let receiverId;
        let sqlQuery;
        console.log("mymedia",_data)
        let _chatData={};
        _chatData.orderItemId = _data.orderItemId;
        _chatData.message = _data.message;
        _chatData.mediaId = _data.mediaId;
        switch (_data.senderType){
            case 0:
                sqlQuery = `SELECT orders.sellerID FROM orderItems inner join orders on orderItems.orderID = orders.id where orderItems.id=? and orderItems.buyerId =?;`;
                _userId = await db.sequelize.query(sqlQuery,{replacements:[_data.orderItemId,_data.userId] ,type: QueryTypes.SELECT });
                console.log("newdata",_userId)
                _chatData.senderId = _data.userId;
                _chatData.receiverId = _userId[0].sellerID;
                break;
            case 1:
                sqlQuery = `SELECT orderItems.buyerID FROM orderItems inner join orders on orderItems.orderID = orders.id where orderItems.id=? and orders.sellerId = ? ;`; 
                _userId =  await db.sequelize.query(sqlQuery,{replacements:[_data.orderItemId,_data.userId] , type: QueryTypes.SELECT });
                console.log("newdata",_userId)
                _chatData.senderId = _data.userId;
                _chatData.receiverId = _userId[0].buyerID;
                break;    
        
            }
            console.log("media",_chatData)
        resp.data = await db.sequelize.models.chat.create(new chatRequestDTO.chatRequestModal(_chatData));
        console.log("rssss",resp)
        
    } catch (ex) {
     
        resp.setError(ex.toString(), "MESSAGE_NOT_SAVED");
    }
    return resp;
}
const markMsgRead = async function(_data){
   let resp = new responseObject();
    try {
       
        let senderId;
        let receiverId;
        let sqlQuery;

        let _chatData={};
        _chatData.orderItemId = _data.orderItemId;
        _chatData.message = _data.message;
        sqlQuery = `update chat set readBit=true where senderId = ? and receiverId = ?;`;
        await db.sequelize.query(sqlQuery,{replacements:[_data.from.id,_data.to.id], type: QueryTypes.UPDATE });
        resp.data = [];
        
    } catch (ex) {
     
        resp.setError(ex.toString(), "MESSAGE_NOT_SAVED");
    }
    return resp;
}

/**
 * 
 * @param {Number} item_id 
 */
 async function getChatUsers(item_id) {
    const result = await db.sequelize.query('call sp_get_chat_users(?)',{replacements:[item_id]});
    if (result && result.length > 0) {
        let returnData = {
            seller: {
                id: result[0]["@sellerId"],
                name: result[0]["@sellerFName"] + " " + result[0]["@sellerLName"],
                nickName: result[0]["@sellerNName"],
                profilePicture: await fileHandler.getMediaAsync(result[0]["@sellerProfile"])
            },
            buyer: {
                id: result[0]["@buyerId"],
                name: result[0]["@buyerFName"] + " " + result[0]["@buyerLName"],
                nickName: result[0]["@buyerNName"],
                profilePicture: await fileHandler.getMediaAsync(result[0]["@buyerProfile"])
            }
        }
        return {
            success: true,
            data: returnData
        }
    }
    return {
        success: false,
        data: {}
    };
}



module.exports.fetchChat  = fetchChat;
module.exports.saveChatMessage = saveChatMessage;
module.exports.getChatUsers = getChatUsers;
module.exports.markMsgRead = markMsgRead;