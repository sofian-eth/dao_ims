

const otpCode = require('../../utility/otpCode');
const walletUtils = require('../../utility/wallet-address');
const membershipUtils = require('../../utility/membership-number');
const portFolioBalanceModel = require('../../models/PortfolioBalance');
const hubSpotUtils = require('../../utility/hubspot');


const { validateChangeEmail, validateTwilio } = require('../../utility/validators');

const {users,phonelookup} = require('../../models/index');


async function signupPhone(req, res, next) {
    let err = {};


    try {
        const { errors, isValid } = validateTwilio(req.body);
        if (!isValid) {
            throw errors.phoneNumber;
        }

        let isPhoneExisting = await users.findOne({ where: { phoneNumber: req.body.phoneNumber } });
        if (isPhoneExisting && isPhoneExisting.is_phonenumber_verified == true) {

            let twilioResponse = await otpCode.sendSMS(req.body.phoneNumber);

            let userUpdated = await users.update({ smsID: twilioResponse.sid }, {
                where: {
                    id: isPhoneExisting.id
                }
            });
            return res.status(200).json({ error: false, message: "Code sent" })

        }



        let twilioResponse = await otpCode.sendSMS(req.body.phoneNumber);
        if (!twilioResponse)
            throw 'An error occurred in sending sms.Please try again later!';
        let newPhoneEntry = await phonelookup.create({
            phoneNumber: req.body.phoneNumber,
            smsID: twilioResponse.sid
        });

        return res.status(200).json({ error: false, message: "user created" });

    }

    catch (error) {
        err.statusCode = 400;
        err.message = "Error occurred in validating phone number";
        err.stackTrace = error;
        next(err);

    }


}







module.exports.signupPhone = signupPhone;