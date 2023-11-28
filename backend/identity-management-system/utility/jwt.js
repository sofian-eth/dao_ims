const jwt = require("jsonwebtoken");
// const { INVESTOR_ACCESS_TOKEN_SECRET, INVESTOR_REFRESH_TOKEN_SECRET,ADMIN_ACCESS_TOKEN_SECRET,ADMIN_REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY,DAO_ACCESS_TOKEN_SECRET,DAO_REFRESH_TOKEN_SECRET } = require('./keys');
require("dotenv").config();

async function oldSessionToken(dataObject) {
  var accessTokenSecret;
  var refreshTokenSecret;

  if (dataObject.roleID == 1) {
    accessTokenSecret = process.env.INVESTOR_ACCESS_TOKEN_SECRET;
    refreshTokenSecret = process.env.INVESTOR_REFRESH_TOKEN_SECRET;
  }

  if (dataObject.roleID == 2) {
    accessTokenSecret = process.env.ADMIN_ACCESS_TOKEN_SECRET;
    refreshTokenSecret = process.env.ADMIN_REFRESH_TOKEN_SECRET;
  }
  accessToken = jwt.sign(dataObject, accessTokenSecret, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
  refreshToken = jwt.sign({}, refreshTokenSecret, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });

  var sessionTokens = {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };

  return sessionTokens;
}

async function sessionToken(dataObject) {
  var accessTokenSecret;
  var refreshTokenSecret;

  accessToken = jwt.sign(dataObject, process.env.DAO_ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
  refreshToken = jwt.sign({}, process.env.DAO_REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });

  var sessionTokens = {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };

  return sessionTokens;
}

async function refreshToken() {}

async function generateVerificationUrl() {
  let verificationToken = jwt.sign(
    {},
    process.env.EMAIL_VERIFICATION_TOKEN_SECRET,
    {
      expiresIn: process.env.EMAIL_VERIFICATION_TOKEN_EXPIRY,
    }
  );

  return verificationToken;
}

async function verifyVerificationToken(code) {
  jwt.verify(
    code,
    process.env.EMAIL_VERIFICATION_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        return res.sendStatus(401);
      } else {
        return;
      }
    }
  );
}
async function switchToAdminToken(data){
  let verificationToken = jwt.sign(
    data,
    process.env.ADMIN2_ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ADMIN2_TOKEN_EXPIRY,
    }
  );
  return verificationToken;
}

module.exports.sessionToken = sessionToken;
module.exports.refreshToken = refreshToken;
module.exports.oldSessionToken = oldSessionToken;
module.exports.generateVerificationUrl = generateVerificationUrl;
module.exports.verifyVerificationToken = verifyVerificationToken;
module.exports.switchToAdminToken = switchToAdminToken;
