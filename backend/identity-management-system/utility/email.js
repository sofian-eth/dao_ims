
const Email = require('email-templates');
// const { GOOGLE_SERVICE_ID, GOOGLE_SERVICE_PRIVATE_KEY, EMAIL_ACCOUNT, DOMAIN_URL, SENDGRID_KEY } = require('./keys');
require('dotenv').config()
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_KEY);
templates = {
    confirm_account: "d-ac4689f12eb44f63994a192548f1db44",
    forgot_password: "d-9b8d658b248f43edb4ff9c5613db19c7",
    password_change_notification: "d-61d4132bd7334c45bba49d07f07c7330",
    email_change_notification: "d-47a504959501457b8987c13e06397025",
    create_password: "d-a840dbe918de4bd992046f116aec45e1"

};

const mailTransport = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: "OAuth2",
        user: process.env.EMAIL_ACCOUNT,
        serviceClient: process.env.GOOGLE_SERVICE_ID,
        privateKey: process.env.GOOGLE_SERVICE_PRIVATE_KEY,
    }
};

async function verifyEmail(data) {

    let emailVerificationLink = process.env.DOMAIN_URL + 'public/verifyEmail/' + data.emailVerificationToken;
    const msg = {
        to: data.email,
        from: 'noreply@daoproptech.com',
        templateId: templates['confirm_account'],
        subject: 'Account Confirmation',
        dynamic_template_data: {
            name: data.legalName,
            token: emailVerificationLink
        }
    };



    return sgMail
        .send(msg)
        .then(function (result) {
           
            return result;
        })
        .catch(function (error) {
           
            throw error;
        })
}




async function forgotEmail(legalName, resetUrl, toAddress) {
    let forgotPasswordLink = process.env.DOMAIN_URL + 'public/reset/' + resetUrl;
    const msg = {
        to: toAddress,
        from: 'noreply@daoproptech.com',
        templateId: templates['forgot_password'],
        subject: 'Password Reset',
        dynamic_template_data: {
            name: legalName,
            token: forgotPasswordLink
        }
    };



    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })


}


async function createPassword(legalName, resetUrl, toAddress) {
    let forgotPasswordLink = process.env.DOMAIN_URL + 'public/reset/' + resetUrl;
    const msg = {
        to: toAddress,
        from: 'noreply@daoproptech.com',
        templateId: templates['create_password'],
        subject: 'Password Reset',
        dynamic_template_data: {
            name: legalName,
            token: forgotPasswordLink
        }
    };



    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })


}


async function passwordChangeNotification(legalName, toAddress) {
    const msg = {
        to: toAddress,
        from: 'noreply@daoproptech.com',
        templateId: templates['password_change_notification'],
        subject: 'Account Security',
        dynamic_template_data: {
            name: legalName,
        }
    };



    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })


}


async function emailChangeNotification(legalName, toAddress) {
    const msg = {
        to: toAddress,
        from: 'noreply@daoproptech.com',
        templateId: templates['email_change_notification'],
        subject: 'Account Security',
        dynamic_template_data: {
            name: legalName,
        }
    };



    return sgMail
        .send(msg)
        .then(function (result) {
            return result;
        })
        .catch(function (error) {
            throw error;
        })


}





module.exports.verifyEmail = verifyEmail;
module.exports.forgotEmail = forgotEmail;
module.exports.passwordChangeNotification = passwordChangeNotification;
module.exports.emailChangeNotification = emailChangeNotification;
module.exports.createPassword = createPassword;