var ethwallet = require('ethereumjs-wallet');
const hdWallet = require('tron-wallet-hd');
const utils=hdWallet.utils;
const keyStore = hdWallet.keyStore;
const dotenv = require('dotenv');
const {users}= require('../models/index');
dotenv.config();


async function walletAddress(){

var wallet = ethwallet.generate();
var publicKey = wallet.getAddressString();
  return publicKey;

}



async function tronWalletAddressGenerator(){
  const user = await users.findOne({
    order: [["id", "DESC"]],
    attributes: ["id"],
  },{raw:true});

   let newUserID = user.id + 1;
   console.log("New UserId",newUserID);
  const accounts =  await utils.getAccountAtIndex(process.env.tronMasterSeed,newUserID);
  console.log("Accounts",accounts);
  return accounts.address;
  
  
}

async function generateTronWalletForAllUser(){


 let allUsers  = await users.findAll();
 for(const user of allUsers){
    const accounts =  await utils.getAccountAtIndex(process.env.tronMasterSeed,user.id);
    console.log(accounts);
 
    let updateUser = await users.update({tronAddress:accounts.address}, {
      where: {
          id:user.id
      }
  });
  
  }
  
  
}


async function generateTronRandomSeed(){
  let seed = keyStore.generateRandomSeed();
  console.log("TRON Seed",seed);
}

module.exports.walletAddress = walletAddress;
module.exports.tronWalletAddressGenerator = tronWalletAddressGenerator;
module.exports.generateTronWalletForAllUser = generateTronWalletForAllUser;
module.exports.generateTronRandomSeed = generateTronRandomSeed;