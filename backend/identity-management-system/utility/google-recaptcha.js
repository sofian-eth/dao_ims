require('dotenv').config();
const GOOGLE_CAPTCHA_PRIVATE_KEY = process.env.GOOGLE_SITE_PRIVATE_KEY;
const axios = require('axios');

async function verifyCaptchaToken(token){
    try {
        const params = new URLSearchParams();
        params.append('secret','6Lc49GobAAAAAMLNz-AS9Sd7PS7cpxiNM8Bki58G');
        params.append('response',token);
        const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}
        const googleResponse = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${GOOGLE_CAPTCHA_PRIVATE_KEY}&response=${token}`,
  {},
  {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
    },
  },);
        
        if(googleResponse.data.score == 0.0)
            return false;
        else 
            return true;    
    }    catch(error){
        throw error;

    } 

}

module.exports.verifyCaptchaToken = verifyCaptchaToken;
