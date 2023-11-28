const { check} = require('express-validator');


const validators = function(method){
	switch(method) {
		case 'investorsignup': {
			return [
				check('username', "username doesn't exists").exists(),
			    check('email', 'please provide email address').exists().isEmail(),
		        check('companyname','company name not provided').exists(),
		        check('password').exists().isLength({min: 5})
			]
		}

		case 'investorlogin': {
			return [
				check('email','please provide valid email address').exists().isEmail(),
				check('password','please provide your password').exists()

			]
		}

		case 'investorkycstep1': {
			return [
				check('username','please provide your username').exists(),
				check('email','please provide valide email address').exists().isEmail(),
				check('password','please provide your password').exists(),
				check('useraccessrole','please provide correct userrole').exists()
			]
		}

		case 'investorkycstep2': {
			return [
				check('firstname','please provide student name').exists(),
				check('fathername','please provide fathername').exists(),
				check('passingyear','please provide passing year').exists(),
				check('discipline','please provide discipline').exists(),
				check('batch','please provide batch').exists(),
				check('enrollmentnumber','please provide enrollment number').exists(),
				check('issuingorganization','please provide organization name').exists()
			]
		}

		case 'investorkycstep3': {
			return [
			   check('verificationtoken','please provide email address').exists()	

			]
        }
        


        case 'checkoutpage': {
			return [
			   check('verificationtoken','please provide email address').exists()	

			]
        }


	}
}




module.exports={validators};