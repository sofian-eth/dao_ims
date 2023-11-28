class socketService{

}
socketService.__io__ ;
socketService.emitNotification=function(userID,data = {}){
    socketService.__io__.emit(userID+"#notification",data);
}
socketService.dealChanged=function(dealId,data){
    socketService.__io__.emit(dealId+"#dealchanged",data);
}
module.exports = {socketService}