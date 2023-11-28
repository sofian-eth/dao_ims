class chatResponse {
    constructor(data){
        this.orderItemId = data.orderItemId ? data.orderItemId : null,
        this.from =  {
            id: data.from ? data.from.id : null,
            nickName: data.from ? data.from.nickName : null,
            profilePicture: data.from ? data.from.profilePicture: null
        },
        this.to = {
            id: data.to ? data.to.id : null,
            nickName: data.to ? data.to.nickName : null,
            profilePicture: data.to ? data.to.profilePicture: null
        },
        this.media ={
            mediaID:data.mediaID,
            originalFileName:data.originalFileName,
            fileName:data.fileName,
            relativePath:data.relativePath,
            documentId:data.documentId,
            extension:data.extension,
            size:data.size
        }
        this.message = data.message ? data.message : null,
        this.timestamp = data.timestamp ? data.timestamp : null
        this.readBit = data.readBit == 1 ? true : false
    }
}

//  

module.exports.chatResponse = chatResponse;