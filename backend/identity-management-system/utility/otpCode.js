const twilio = require('twilio')
(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
require('dotenv').config()
const {ErrorHandler} = require('./error-handler');
const PhoneLib = require("google-libphonenumber").PhoneNumberUtil.getInstance();
const PNF = require('google-libphonenumber').PhoneNumberFormat;
async function sendWelcomeMsg(phoneNumber,name) {
    let rawNumber = PhoneLib.parseAndKeepRawInput(phoneNumber, "pk");
    
    // let number = PhoneLib.format(rawNumber, PNF.INTERNATIONAL);
    // number = number.replace(/\s/g, "");
    // let msg = "Welcome "+name+", You've successfully made your first pledge for Urban Dwellings. You can use the link we've sent to you via email to see your pledge details on our platform.";
    // return twilio.messages.create({
    //     from: '+14013755301',
    //     to: number,
    //     body: msg
    //   })
    //     .then(function (result) {
    //         console.log("Result",result);
    //         return result;
    //     })
    //     .catch(function (error) {
    //          console.log("Error",error);   
    //         throw 'Error in sending sms';
    //     })
    return true;

};

async function sendSMS(phonenumber) {

    return twilio.verify
        .services(process.env.TWILIO_SERVICE_ID)
        .verifications
        .create({
            to: phonenumber,
            channel: 'sms'
        })
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            
            throw error;
        })

};


async function codeVerification(phonenumber, code) {
   console.log("Phone Number",phonenumber);
   console.log("Code",code);
    return twilio.verify
        .services(process.env.TWILIO_SERVICE_ID)
        .verificationChecks
        .create({
            to: phonenumber,
            code: code
        })
        .then(function (result) {
            console.log("twilio",result);
            if (result.valid == false)
                throw 'Invalid Code';
            return result;
        })
        .catch(function (error) {
            console.log(error);
            throw error;
        })

}



module.exports.sendSMS = sendSMS;
module.exports.codeVerification = codeVerification;
module.exports.sendWelcomeMsg = sendWelcomeMsg;