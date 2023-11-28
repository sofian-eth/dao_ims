const { getDeviceToken, uploadReceiptNotification } = require("../../utility/fcm.util");
const core = require("core");
const fcmService = {
    signUpNotification: async function(email){
        try {
            let t1 = await getDeviceToken();
            if(t1.length>0 && t1[0].length>0) {
                tokens = t1[0][0];
                tokens.forEach(item => {
                    if( item.device_token!=null && item.device_token!='null' && item.device_token!='' ) {
                        uploadReceiptNotification("New Sign Up created ", "New user has signed up on investment portal with email "+email, item.device_token);
                    }
                });
            }
            return;
        } catch(e) {
            console.log(e);
        }
    },

}

module.exports = fcmService;
