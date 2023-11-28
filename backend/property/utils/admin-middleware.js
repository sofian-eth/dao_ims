const path = require('path');
const dotenv = require('dotenv');
const winston = require('../winston.js');
var jwt = require('jsonwebtoken');


dotenv.config();



let checkToken = (req,res,next)=>{
	
	let token = req.headers['x-access-token'] || req.headers['authorization'] || req.headers['Authorization'];
   



	if (token) {
		jwt.verify(token,process.env.adminaccesstokensecret, (err,decoded) => {

			if (err) {
				
        		return res.sendStatus(401);
      } else {
        		req.decoded = decoded;
        		next();
      		}

		});
	} else {
    return res.sendStatus(401);
  }


};


module.exports = {
  checkToken: checkToken
}
