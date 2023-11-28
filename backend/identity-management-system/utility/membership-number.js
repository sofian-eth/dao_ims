const { users } = require("../models/index");

async function membershipNumber(prefix) {
  try {
    const user = await users.findOne({
      order: [["id", "DESC"]],
      attributes: ["id"],
    });

     let newUserID = user.dataValues.id + 1;
   // let newUserID = 1;
    let membershipNumber = prefix + "-" + newUserID;
    return membershipNumber;
  } catch (error) {
  
    throw "Error in generating membership number";
  }
}

module.exports.membershipNumber = membershipNumber;
