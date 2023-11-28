const sgMail = require('@sendgrid/mail');
require('dotenv').config()
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

const SendMail = async (to, subject, msg) => {

    const msgParams = {
        to: to,
        from: 'noreply@daoproptech.com',
        subject: subject,
        text: msg,
    };
    return await sgMail.send(msgParams);
}

module.exports.SendMail = SendMail;