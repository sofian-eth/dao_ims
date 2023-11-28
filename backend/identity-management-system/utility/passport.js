const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config()
const FacebookStrategy = require('passport-facebook').Strategy;
const walletUtils = require('./wallet-address');
const membershipUtils = require('./membership-number');
const hubSpotUtils = require('./hubspot');
const { ErrorHandler } = require('../utility/error-handler');


const {users,accountactivity}= require('../models/index');
const core = require('core');
const axios = require('axios');
passport.serializeUser(function (user, done) {
    done(null, user)
})

passport.deserializeUser(function (user, done) {
    done(null, user)

})
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.DOMAIN_URL + "auth/google/callback",
    passReqToCallback: true
},
    async function (req,accessToken, refreshToken, profile, done) {
        
        let profilePictureObject = {};
     
        let userModel = await users.findOne({ where: { email: profile.emails[0].value } })
        if (userModel) {
            if(userModel.source!='google'){
                done(null,userModel)
            }
            else{
                let userUpdated = users.update({ googleID: profile.id }, {
                    where: {
    
                        email: profile.emails[0].value,
                        is_email_verified: true
                    }
                });
                let userLoginCount = await accountactivity.count({where: {
                    userID: userModel.dataValues.id,
                    subjectID: 1
                  }, raw:true});
              
                 
              
                  userModel.dataValues.loginCount = userLoginCount;
    
                return done(null, userModel);
            }
            
        } else {

            if(profile._json.picture) {
                let response = await axios.get(profile._json.picture,  { responseType: 'arraybuffer' });
                let buffer = Buffer.from(response.data,"utf-8");
                let imageSize = Buffer.byteLength(buffer);

                let mediaObject = {
                    originalFileName:'GoogleProfilePicture',
                    documentName:'profilepic',
                    size: imageSize
                };



            profilePictureObject = await core.fileuploader.uploadFilesAndAddToDB(buffer,mediaObject,'image/png');
            
            }

            const walletAddr = await walletUtils.walletAddress();
            const tronWalletAddr = await walletUtils.tronWalletAddressGenerator();
            const membershipID = await membershipUtils.membershipNumber('DAO');
            let newUser = await users.create({
                firstName: profile.displayName,
                legalName: profile.displayName,
                email: profile.emails[0].value,
                is_phonenumber_verified: false,
                is_email_verified: true,
                googleID: profile.id,
                walletAddress: walletAddr,
                membershipNumber: membershipID,
                source: "google",
                isBasicInfoAvailable: false,
                roleID: 1,
                is_kyc_approved: true,
                profilePicture: profilePictureObject ? profilePictureObject.mediaId : null,
                tronAddress: tronWalletAddr,
                device_token: '',
                showIntro:true
                  
            });


            //           hubSpotUtils.createContact({firstname:profile.displayName,email:profile.emails[0].value});

    

            return done(null, newUser);
        }
    }
));

// passport.use(new FacebookStrategy({
//     clientID: process.env.FACEBOOK_CLIENT_ID,
//     clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//     callbackURL: process.env.DOMAIN_URL + "auth/facebook/callback",
//     profileFields: ['id', 'emails', 'name']
// },
//     async function (accessToken, refreshToken, profile, done) {


//         let user = await User.findOne({ where: { email: profile.emails[0].value } })
//         if (user) {
//             let userUpdated = User.update({ facebookID: profile.id }, {
//                 where: {
//                     email: profile.emails[0].value,
//                     is_email_verified: true
//                 }
//             });
//             return done(null, user);
//         } else {


//             const walletAddr = await walletUtils.walletAddress();
//             const membershipID = await membershipUtils.membershipNumber('DAO');

//             let newUser = await User.create({
//                 firstName: profile.name.givenName,
//                 lastName: profile.name.familyName,
//                 email: profile.emails[0].value,
//                 is_phonenumber_verified: false,
//                 is_email_verified: true,
//                 facebookID: profile.id,
//                 walletAddress: walletAddr,
//                 membershipNumber: membershipID,
//                 source: "facebook",
//                 roleID: 1

//             });
//             //           hubSpotUtils.createContact({firstname:profile.displayName,email:profile.emails[0].value});
//             let userInformations = await userInformations.create({
//                 userID: newUser.id,
//                 is_kyc_approved: false
//             });

//             await portfoliobalance.create({
//                 userID: newUser.id,
//                 propertyID: 1,
//                 balance: 0
//             });

//             return done(null, newUser);
//         }
//     }
// ));
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.DOMAIN_URL + "auth/facebook/callback",
    profileFields: ['id', 'emails', 'name','photos']
},
    async function (req,accessToken, refreshToken, profile, done) {
        let profilePictureObject = {};
        let source = 'facebook';    
        let userModel = await users.findOne({ where: { email: profile.emails[0].value } })
        if (userModel) {
            if(userModel.source!=source){
                done(null,userModel)
            }
            else{
                let userUpdated = users.update({ facebookID: profile.id }, {
                    where: {
    
                        email: profile.emails[0].value,
                        is_email_verified: true
                    }
                });
                let userLoginCount = await accountactivity.count({where: {
                    userID: userModel.dataValues.id,
                    subjectID: 1
                  }, raw:true});
              
                 
              
                  userModel.dataValues.loginCount = userLoginCount;
    
                return done(null, userModel);

            }
            
        } else {

            if(profile.photos[0].value) {
                let response = await axios.get(profile.photos[0].value,  { responseType: 'arraybuffer' });
                let buffer = Buffer.from(response.data,"utf-8");
                let imageSize = Buffer.byteLength(buffer);

                let mediaObject = {
                    originalFileName:'FacebookProfilePicture',
                    documentName:'profilepic',
                    size: imageSize
                };



            profilePictureObject = await core.fileuploader.uploadFilesAndAddToDB(buffer,mediaObject,'image/png');
            
            }

            const walletAddr = await walletUtils.walletAddress();
            const tronWalletAddr = await walletUtils.tronWalletAddressGenerator();
            const membershipID = await membershipUtils.membershipNumber('DAO');
            let newUser = await users.create({
                firstName: profile.name.givenName,
                legalName: profile.name.familyName,
                email: profile.emails[0].value,
                is_phonenumber_verified: false,
                is_email_verified: true,
                facebookID: profile.id,
                walletAddress: walletAddr,
                membershipNumber: membershipID,
                source: source,
                isBasicInfoAvailable: false,
                roleID: 1,
                is_kyc_approved: true,
                profilePicture: profilePictureObject ? profilePictureObject.mediaId : null,
                tronAddress: tronWalletAddr,
                device_token: '',
                showIntro:true
                  
            });


            //           hubSpotUtils.createContact({firstname:profile.displayName,email:profile.emails[0].value});

    

            return done(null, newUser);
        }
    }
));
