const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors');
const Sentry = require('./utils/sentry');
var nodeCron = require('node-cron');
const app = express();
const responsemiddleware = require("./utils/response-middleware");
app.use(responsemiddleware);
const blockchainRoutes = require('./routes/blockchain-routes');
const projectRoutes = require('./routes/project-routes');
const transactionRoutes = require('./routes/transaction-routes');
const marketplaceRoutes = require('./routes/marketplace-routes');
const rentalDistributionRoutes = require('./routes/rental-distribution-routes');
const demarcationRoutes = require('./routes/demarcation-routes');
const peerToPeer = require('./routes/peer-to-peer-route');
const eidRoutes = require('./routes/dao-eidi-routes');
const genericRoutes = require('./routes/routes');
const morgan = require('morgan');
var winston = require('./winston');
const path = require('path');
var dotenv = require('dotenv');
var http = require('http');
const fs = require('fs');
const socket_io = require("socket.io");
// const { ChatService } = require("./services/shared/chat.service");
var dir = path.join(__dirname, 'public/template/asset');
var fcmService  = require("./services/fcm/fcm.service");
app.use(express.static(dir));

const { handleError } = require('./utils/error-handler');
const blockchainCronService = require('./services/blockchain/index');
const blockchain= require('blockchain');
const tronWeb = blockchain.sharedService.tronWeb;
dotenv.config();

// web3 connectivity

const Web3 = require('web3');
const { socketService } = require('./utils/socket.service');
const { notificationService } = require('./services/notification/notificationCenter');
const { fileRouter } = require('./routes/file.route');
const { reportRouter } = require('./routes/report-routes');
const options = {
  reconnect: {
    auto: true,
    delay: 5000, // ms
    maxAttempts: 5,
    onTimeout: false,
  },
};
let web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.infuraWebSocket, options));
let polygonWeb3 = new Web3(new Web3.providers.WebsocketProvider(process.env.polygonSocketProvider, options));


// Web3 subscription for both contracts to receive events

// web3.eth.subscribe('logs', {
//   address: ['0xf05f8ea0172cfff4df06b7b209e91ffdb66ea2bd', '0x92d78fe30800f3449330841cb75724b9e8ed5097','0xbbe3c8165311a05f69f40f49ad575d0c18c94a13', '0x0af9e7bf02c25fdb514c7f6c787df4de48641106'],
// }, function (error, result) {
//   if (error)
//     console.log("Websocket Error occurred", error);

// })
//   .on("data", function (transaction) {

//     blockchainCronService.updateUserBalance(transaction.transactionHash);
//   })


// tron Web subscription

// let tronContract = tronWeb.contract().at('TKNq5eQYgFcKrhHbJWKi5Pedi7ud5JBrUm').then(function(result){


// result && result.Transfer().watch((err, event) => {
//   if(err)
//     return console.error('Error with "Message" event:', err);
 
//     blockchainCronService.updateUserBalance(event.transactionHash);
// });
// })
// .catch(function(error){
//   console.log(error);
// })


// let tronBPRContract = tronWeb.contract().at('TYaUet6fZraRcTAMKF5cBVk2CFmCogicTS').then(function(result){


//   result && result.Transfer().watch((err, event) => {
//     if(err)
//       return console.error('Error with "Message" event:', err);
   
//       blockchainCronService.updateUserBalance(event.transactionHash);
//   });
//   })
//   .catch(function(error){
//     console.log(error);
//   })



//   polygonWeb3.eth.subscribe('logs', {
//     address: ['0x70639241b89f3214295ee774578a8afd32d55b8c'],
//   }, function (error, result) {
//     if (error)
//       console.log("Websocket Error occurred", error);
  
//   })
//     .on("data", function (transaction) {
  
//       blockchainCronService.updateUserBalance(transaction.transactionHash);
//     })
  



// Check web3 connectivity with server 

function checkEthConnectivity(){
  web3.eth.net.isListening()
    .then(function (result) {
      console.log("Connected", result);
    })
    .catch(function (error) {
      console.log("Attempting to reconnect", error);
      web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.infuraWebSocket, options));
    })
}


// Set interval to check connectivity after every 30 minutes
setInterval(checkEthConnectivity,60000);

app.use(cors());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: winston.stream }));
app.use(function(req, res, next) {
  res.setHeader('X-Frame-Options', 'sameorigin');
  next();
});
app.use(function (req, res, next) {

  if (process.env.maintenanceModeEnabled === "True" || process.env.maintenanceModeEnabled === "true") {

    res.send(503);
  }
  else
    next();

});

app.use(express.static('public'))

app.use(blockchainRoutes.blockchainRouter);
app.use(projectRoutes.projectRoutes);
app.use(transactionRoutes.transactionRoutes);
app.use(marketplaceRoutes.marketplaceRoutes);
app.use('/rentaldistribution',rentalDistributionRoutes.rentalDistributionRoutes);
app.use(demarcationRoutes.demarcationRoutes);
app.use("/peer-to-peer", peerToPeer.peerToPeer);
app.use("/dao-eidi", eidRoutes.eidRoutes);
app.use("/file", fileRouter);
app.use("/reports",reportRouter)
app.use(genericRoutes.genericRoutes);
app.use((err, req, res, next) => {
  let errObject = {};
  if (process.env.environment == 'prod' || process.env.environment == 'staging') {
    errObject.statusCode = err.statusCode,
      errObject.message = err.message
    errObject.stackTrace = err.stackTrace
  }

  else {
    errObject = err;
  }

  Sentry.captureException(err.stackTrace);
  handleError(errObject, res);
});


// Cron Job for ethereum balance
 nodeCron.schedule('*/10 * * * *', () => {
   blockchainCronService.blockchainEventChecker('eth');

 });



//  Cron job for tron balance
    nodeCron.schedule('*/10 * * * *', () => {
   blockchainCronService.blockchainEventChecker('trx');

 });


// CronJob for property balance update
 nodeCron.schedule('*/5 * * * *', () => {

      blockchainCronService.updateServiceAccountBalance();
        
    });

var server = http.createServer(app);
const io = socket_io(server, {
  cors: {
    origin: "*"
  }
});
socketList = [];
io.on("connection", (socket) => {
  const q = socket.handshake.query;
  if (socket.handshake.query.accessToken) {
    require("jsonwebtoken").verify(socket.handshake.query.accessToken, process.env.DAO_ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (!err) {
        socket.user = {
          id: decoded.id,
          itemId: q.itmeId,
          type: q.type,
          buyer: q.buyer,
          seller: q.seller
        };
        if (!socket.user) return;

        if (socketList.length > 0) {
          let index = socketList.findIndex(x => x.socket.user.id == socket.user.id);
          if (index > -1) {
            socketList.splice(index, 1);
          }
          socketList.push({
            socket
          });
        } else {
          socketList.push({
            socket
          });
        }

        // socket.emit(decoded.id,true);
        socketList.forEach((x,index,array)=>{//buyer
            let sellerExist = array.findIndex(y => y.socket.user.id == x.socket.user.seller);
            if(sellerExist==-1){
              return;
            }
            console.log('seller online');
            console.log(x.socket.user.buyer);
            x.socket.emit(x.socket.user.buyer+'',true);
 //seller
            let buyerExist = array.findIndex(y => y.socket.user.id == x.socket.user.buyer);
            if(buyerExist==-1){
              return;
            }
            console.log('buyer online');
            console.log(x.socket.user.seller);
            x.socket.emit(x.socket.user.seller+'',true);
        });
        socket.on("typing", (e) => {
          let lst = socketList.filter(x => x.socket.user.id == e.to.id);
          if (lst && lst.length > 0) {
            lst[0].socket.emit("typing", "...");
          }
        })
        socket.on("msg", (e) => {
          let lst = socketList.filter(x => x.socket.user.id == e.to.id);
          if (lst && lst.length > 0) {
            lst[0].socket.emit("msg", e);
          }
          fcmService.newChatMessage(e.to.id,e.message,e.orderItemId,e.senderType);
          // notificationService.chatMessage({to:e.to.id,from:e.from.id,area:0,propertyName:"",orderItemId:e.orderItemId});
        });

        socket.on("chatUserData",(data)=>{
          if(data){
            let indexofUser = socketList.findIndex(x => x.socket.user.id ==data.userID);
            if(indexofUser != -1){
              socketList[indexofUser].socket.user.buyer=data.buyer;
              socketList[indexofUser].socket.user.seller=data.seller;
              socketList[indexofUser].socket.user.itmeId=data.itmeId;
              socketList[indexofUser].socket.user.type=data.type;

            }
          }

        });
        socket.on("disconnect", () => {
          let index = socketList.findIndex(x => x.socket.user.id == socket.handshake.query.id);
          if (index > 0) {
            let user = socketList[index];
            socketList[index].emit(socketList[index], 'disconnect');
          }

          socketList.forEach((x,index,array)=>{
            if(q.type == '0' && x.socket.user.buyer == decoded.id+''){ //buyer
              let sellerExist = array.findIndex(y => y.socket.user.id == x.socket.user.seller);
              if(sellerExist==-1){
                return;
              }
              console.log('seller offline');
              console.log(x.socket.user.buyer);
              x.socket.emit(x.socket.user.buyer+'',false);
            }
            else if(q.type == '1' && x.socket.user.seller == decoded.id+''){ //seller
              let buyerExist = array.findIndex(y => y.socket.user.id == x.socket.user.buyer);
              if(buyerExist==-1){
                return;
              }
              console.log('buyer offline');
              console.log(x.socket.user.seller);
              x.socket.emit(x.socket.user.seller+'',false);
            }
          });



          if (index > -1) {
            socketList.splice(index, 1);
          }
          // socketList.forEach(x=>{
          //     x.socket.emit("userconnected", userList.map(u => {
          //         if (socketList.map(x => x.socket.userId).findIndex(x => x == u.userId) > -1) {
          //             u.status = "Online";
          //         }else{
          //             u.status = "offline";
          //         }
          //         return u;
          //     }));
          // })
        })
        // socketList.forEach(x=>{
        //     x.socket.emit("userconnected", userList.map(u => {
        //         if (socketList.map(x => x.socket.userId).findIndex(x => x == u.userId) > -1) {
        //             u.status = "Online";
        //         }
        //         return u;
        //     }));
        // })
      }

    });

    // socketList.forEach(x=>{
    //   if(x.socket.user.)
    // });

  }

})
io.on("errror", (e) => {
  console.log("error:= ", e);
})

// blockchain.balanceService.fetchTronTransactionReceipt('sasa');

socketService.__io__ = io;
Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}
server.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})


module.exports = app;
