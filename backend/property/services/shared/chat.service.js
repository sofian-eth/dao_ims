// var jwt = require('jsonwebtoken');
// class ChatService{
//     /**
//      * @type {import("socket.io")}
//      */
//     static __IO__;
//     static socketList = [];
//     static start = function(){
//         const io = ChatService.__IO__;
//         // io.use(function(socket,next){
//         //     const q =socket.handshake.query;
//         //     if (socket.handshake.query.accessToken){
//         //         jwt.verify(socket.handshake.query.accessToken, process.env.DAO_ACCESS_TOKEN_SECRET, (err, decoded) => {
//         //             if(!err){
//         //                 socket.user = {
//         //                     id:decoded.id,
//         //                     itemId:q.itmeId,
//         //                     type:q.type
//         //                 };
//         //             }
//         //             // else{
//         //             //     let err  = new Error('Authentication error');
//         //             //     err.data = { type : 'authentication_error' };
//         //             //     err.message = "UnAuthorized";
//         //             //     next(err);
//         //             // }    
//         //         });
                
//         //     }
//         //     // else{
//         //     //     let err  = new Error('Authentication error');
//         //     //     err.data = { type : 'authentication_error' };
//         //     //     err.message = "UnAuthorized";
//         //     //     next(err);
//         //     // } 
//         //     next();
//         // });
       
//     }
//     constructor(){
//     }    
// }
// module.exports = {ChatService};