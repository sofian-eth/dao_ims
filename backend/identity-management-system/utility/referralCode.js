const { users } = require("../models/index");

async function referralCode() {
  try {
    const code=Math.random().toString(36).slice(5)
    const user = await users.findOne({
        where: { refferalCode: code },
    });
    if(user){
        return referralCode()
    }
    else{
        return code;
    }
    
  } catch (error) {
  
    throw "Error in generating referral code";
  }
}

module.exports.referralCode = referralCode;
