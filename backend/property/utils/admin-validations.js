const { check,checkBody} = require('express-validator');


const adminvalidators = function(method){
	switch(method) {
		case 'adminlogin': {
			return [
				check('email', "username doesn't exists").not().isEmpty(),
			    check('pass', 'please provide email address').not().isEmpty(),
		       
			]
		}

		case 'addinvestor': {
			return [
				check('firstname','please provide valid email address').not().isEmpty(),
				check('middlename','please provide your password'),
				check('lastname','please provide your password'),
				check('email','please provide your password').not().isEmpty().isEmail(),
				check('password','please provide your password'),
				check('mobilephonenumber','please provide your password').not().isEmpty().isMobilePhone(),
				check('kycApproved','please provide your password').not().isEmpty(),
				check('passwordToggle','please provide your password').not().isEmpty()

			]
		}

		case 'approvetransaction': {
			return [
				check('username','please provide your username').exists(),
				check('email','please provide valide email address').exists().isEmail(),
				check('password','please provide your password').exists(),
				check('useraccessrole','please provide correct userrole').exists()
				
			]
		}


		case 'createtransaction': {
			return [
				check('sellerform.investor','please provide email address or telephone number of seller').not().isEmpty(),
				check('buyerform.investor','please provide email address or telephone number of buyer').not().isEmpty(),
				check('areaunits','please provide required amount to transact').not().isEmpty(),
				check('developRounds','please provide round ID ').not().isEmpty(),
				check('paymentdeadline','please provide payment deadline.').not().isEmpty(),
				check('paymentmode','please provide payment mode number').not().isEmpty()
				
			]
		}

		case 'transaction-details': {
			return [
				check('queuenumber','please provide transaction number').not().isEmpty()
			]
		}

		case 'lock-funds': {
			return [
				check('area','please provide area units to be locked').not().isEmpty(),
				check('enddate','please provide end date for development round').not().isEmpty(),
				check('marketprice','please provide market price for this round').not().isEmpty(),
				check('name','please provide name for development round').not().isEmpty(),
				check('sqftprice','please provide sqft rate for this round').not().isEmpty(),
				check('startdate','please provide start date for this round').not().isEmpty()
			]
		}

		case 'update-transaction': {
			return [
				check('password.password','please provide password').not().isEmpty(),
				check('formdata.areapledged','please provide area units').not().isEmpty(),
				check('formdata.paymentdate','please provide payment date').not().isEmpty(),
				check('formdata.paymentmode','please provide payment mode').not().isEmpty(),
				check('formdata.queuenumber','please provde queue number').not().isEmpty()
			]
		}


		case 'discard-transaction': {
			return [
				check('pass').not().isEmpty(),
				check('queuenumber').not().isEmpty()
			]
		}
	



	}
}




module.exports={adminvalidators};


