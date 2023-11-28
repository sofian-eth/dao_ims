module.exports = {
    'chatRequestModal':function(data){
        this.orderItemId = data ? data.orderItemId : 0,
        this.message = data ? data.message : null,
        this.senderId = data ?  data.senderId : 0,
        this.receiverId = data ? data.receiverId : 0,
        this.readBit = data && data.readBit ? data.readBit : 0,
        this.mediaId = data ? data.mediaId : 0
    }//changes
  }
  
  
  