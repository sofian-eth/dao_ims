const moment = require('moment');
var rp = require('request-promise');
const ordinalsSmall = ['th', 'st', 'nd', 'rd'];
const ordinalsCapital  = ['TH', 'ST', 'ND', 'RD'];
// var nodemailer = require('nodemailer');
const Email = require('email-templates');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();
// const sgMail = require("@sendgrid/mail");

// sgMail.setApiKey(process.env.sendGridKey);
// templates = {
//     confirm_account: "d-68c570dd120044d894e07566bf951964",
// };


const mailtransport = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: "OAuth2",
        user: "no-reply@elementsresidencia.com",
        serviceClient: '110990886530786928166',
        privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCg6RXthENXIOpE\ngyMUcj6HvRFGUmZgpwyrFBlSxZ8dwboPUUK4ykjsb8gN8qIYyTKERuYTO9Zaac4A\nGi5eFcQyPaqTxYIgsH55tHOMxwvH4FNPz8yXw9DoEgM96OaBqlMLBQ69lPI/B4+B\nU0gObcybyQIJ3TJj9QL542a1VjzCoNzz6e4TpjE3/CBBeewDD0xCQz4fvmGaPZnl\nv+eX33T6D2MqP+ynUYFud6xEm9DfVThK/APdIi953BWjjTYSwD14AC/58isijwim\nyQ/LNlbUCPYnlBaXsTIBDs3zrd5zdGIFKD+Yo2h4L84VgDc3AYgwyKGgOxAqxWGR\n5ak95qtjAgMBAAECggEAJXUc/aWEZ4vp/Pjp+aB+neqNUulrm6RHdqu/GV2XpL2s\nKlSoS4wLXb7Huzd4NHzhnZlDhcawJ2vp4Gw3zv8SJP/l7XBU0ndDeeFf5K2ROH4n\n5rRg1BNpVhybVJYa0qRroG0U+Vzq53FDHr/cTj+RGdK4/sLXMB2hC7q79gqVKlkZ\nbP8ckxDQy08m5ySW1jKS33Wof2qXgrl/WPgWWTKxd5VfKpx01sIrto5duac4n/uR\neDj2o9VHSaBetlcBesZoB9M3IHYD+laZvneAUqz3+eAp1rqM8Tvu5aWkvWw1ZvDg\nEKDnJmAqWr25A+p3mpC6tYFu0WhUOnyvss30uLzogQKBgQDXapmr0eyA8wUUgFqF\nOD9J1u/dB4jGe/aTmpLpuC41CfxLwDxnjax2UrdfdMiafI/ozWjfIH4T7wAoZsmP\npqOC31FT5S9BvHmX2kE5w4pqQVWncdo/2EGLtcCDJvNnfbds33lbFz95RwNXi9TT\nfIq1epaWctKdBecH6LUBJseYewKBgQC/ObLmiGFtNpoc90xFuMznZwVins1zsjIM\nSw0NsVx/h8mukjnDVaromI/ESX/xqsnZskqJm0iAgs9vvhPuE+q+Yodo+UonR0yL\nslUc35QeZXVcBLiRrws78qE2vwUOVRQ7VKbXfvxJfQTuypWVUEXe0rg2n8v2hRrb\nWPPaUZ+oOQKBgQCsupd6BJvFUhgytjDfPZjR1n0DGHV94gx3kqxWqA61DMq22vAU\ngK9XOUA8VGI+Lb8fBwYeU+mEhlH0E2dvvkjCOdr2kIDyDvTY5HMEpFyqkrThzRMZ\nuofkRNqWz3bA9zdLH24pslx9HIn7eu4unmCC4Ec7X9qtefwkhV4ODFBjXQKBgFxi\nVcoGbXtD++SunQy6IVRSc0mYCw4wMvm5cI8C9vst8QQD5SA3zSAeRKbCE6v/pREl\nj9k3Sim8CNelbx+AQ9LC60SN24NqcNK0z2XppjehMLfKGBlaBgVqTPSUCK9J70JS\nvWAzG1OtsKpk+Stv4rGqABFz1ig9WiJKsVTyRj4RAoGBALC6DGY2uPzN0WdqE3x+\np2zG4ZwqYnUv7VO9WZhtGCy61Aa6tcr0BtCznNOmA7KGyifDuPpS+OL7xBnYrXHg\nY3ORXrcLygO0lUsycyDLzGcQ7Th2QLCrNCnA40Xk+s51z2o9C5/X15Mo2BYxxNS9\noX/m0AereghH8wHjoneGbUAf\n-----END PRIVATE KEY-----\n',
    }
};




// const sendemail = function (data) {
//     const msg = {
//         to: data.email,
//         from: "no-reply@elementsresidencia.com",
//         templateId: templates[data.templateName],
//         dynamic_template_data: {
//             name: data.name,
//             token: data.token
//         }
//     };



//     return sgMail
//         .send(msg)
//         .then(function (result) {
//             return result;
//         })
//         .catch(function (error) {
//             throw error;
//         })
// }



// const forgotemail = function (data, toaddress) {

//     const email = new Email({
//         message: {
//             from: "no-reply@elementsresidencia.com",
//             subject: "Reset your password",
//             to: toaddress,
//         },
//         send: true,
//         preview: false,
//         transport: mailtransport
//     }
//     );
//     return email.send({
//         template: 'ForgotPassword',
//         message: {
//             to: toaddress
//         },
//         locals: {
//             name: data.firstname,
//             link: data.passreseturl
//         }
//     })
//         .then(function (result) {
//             return result;
//         })
//         .catch(function (error) {
//             throw error;
//         })

// }


// const profileupdate = function (firstname, toaddress) {

//     const email = new Email({
//         message: {
//             from: "no-reply@elementsresidencia.com",
//             subject: "Profile Approval",
//             to: toaddress,
//         },
//         send: true,
//         preview: false,
//         transport: mailtransport
//     }
//     );
//     return email.send({
//         template: 'ProfileApproval',
//         message: {
//             to: toaddress
//         },
//         locals: {
//             name: firstname,
//         }
//     })
//         .then(function (result) {
//             return result;
//         })
//         .catch(function (error) {
//             throw error;
//         })


// }


// const queuemessage = function (request) {

//     const email = new Email({
//         message: {
//             from: "no-reply@elementsresidencia.com",
//             subject: "Area Pledge",
//             to: request.investoremail,
//         },
//         send: true,
//         preview: false,
//         transport: mailtransport
//     }
//     );
//     return email.send({
//         template: 'AreaPledge',
//         message: {
//             to: request.investoremail
//         },
//         locals: {
//             name: request.firstname,
//             projectname: request.projectname,
//             sqft: request.areaunits,
//             fundinground: request.devround,
//             sqftprice: request.currentprice,
//             discount: request.discount,
//             costprice: request.marketprice,

//         }
//     })
//         .then(function (result) {
//             return result;
//         })
//         .catch(function (error) {
//             throw error;
//         })

// }

const currencyformat = function (number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PKR',
    }).format(number);
}

const thousandseparator = function (x) {
    if (Number(x))
        return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    else
        return x;
}

const dateformater = function (date_string, format ) {
    if(!format)
        format = 'MM/DD/YYYY';
    console.log("Update Format",format);
    return moment(new Date(date_string)).format(format)
}

const fetchLocationFromIP = function(ipAddress) {
        const localhostIpAddresses = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];
        return rp(`http://ip-api.com/json/${ipAddress && (!localhostIpAddresses.includes(ipAddress)) ? ipAddress : ''}`)
                .then(function (res) {
                    const result = JSON.parse(res);
                    console.log("Location resutl", result);
                    if( result.status==='success' ){ 
                        const { country=null, regionName=null, city=null, zip=null } = result;
                        return {
                            country,
                            regionName,
                            city,
                            zip
                        };
                    } else {
                        return null;
                    }
                });

}

const moneyTransform = function(input,roundOf = false){
    let suffixes = ['K', 'M', 'B', 'T', 'q', 'Q', 's', 'S'];
    if (Number.isNaN(input)) {
        return null;
    }

    if (input < 0) {
        return 0;
    }

    if (roundOf) {
        input = Math.round(input);
    }

    if (input < 1000) {
        return (Number(input) === input && input % 1 !== 0) ? input.toFixed(2) : input;
    }

    const exp = Math.floor(Math.log(input) / Math.log(1000));
    return (input / Math.pow(1000, exp)).toFixed(1) + suffixes[exp - 1] ;

}

const ordinal=function(n, isCapital = false, keepNumber = true){
    n = parseInt((''+n).replace(/[^0-9]/g,''));
    const v = n % 100;
    const ordinals = isCapital ? ordinalsCapital :  ordinalsSmall;
    return (keepNumber ? n : '') + (ordinals[(v - 20) % 10] || ordinals[v] || ordinals[0]);
    
}



module.exports = { currencyformat, thousandseparator, dateformater, fetchLocationFromIP, moneyTransform,ordinal };