// const express = require('express');
// let middleware = require('../utils/investor-middleware.js');
// const emailcheck = require('../utils/utils.js');
// var multer = require('multer')
// var storage = multer.memoryStorage()
// var upload = multer({ storage: storage,fileFilter: function (req, file, cb) {

//       var filetypes = /jpeg|jpg|png|pdf/;
//       var mimetype = filetypes.test(file.mimetype);
  
//       if (mimetype ) {
//         return cb(null, true);
//       }
//       cb("Error: File upload only supports the following filetypes - " + filetypes);
//     } })
// const router = express.Router();
// const publicroutes = express.Router();


// // New Controllers file

// const logincontroller = require('../Controllers/Investors/Auth/login.js');
// const emailconfirmationcontroller = require('../Controllers/Investors/Auth/emailconfirmation.js');
// const registercontroller = require('../Controllers/Investors/Auth/signup.js');
// const sessionrefresh = require('../Controllers/Investors/Auth/session.js');
// const passwordresetrequest = require('../Controllers/Investors/Auth/passwordresetlink.js');
// const investorkyc = require('../Controllers/Investors/kyc/kycinformation.js');
// const investorpersonal = require('../Controllers/Investors/Personal/personalinformation.js');
// const informationaboutinvestor = require('../Controllers/Investors/kyc/informationaboutinvestor.js');
// const kycdetails = require('../Controllers/Investors/kyc/kycdetails.js');
// const investorbalance = require('../Controllers/Investors/Balance/portfoliobalance.js');
// const allholders = require('../Controllers/Investors/Balance/allholder.js');
// const investorpayment = require('../Controllers/Investors/Payments/updatepaymentmethod.js');
// const investorpasschange = require('../Controllers/Investors/Auth/changepass.js');
// const profilestatus = require('../Controllers/Investors/kyc/kycstatus.js');
// const billingcontroller = require('../Controllers/Investors/Personal/billinginfo.js');
// const investorpaymentdetails = require('../Controllers/Investors/Payments/getinvestorpayment.js');
// const checkoutcontroller = require('../Controllers/Investors/Checkout/pledgearearequest.js');
// const investorhistory = require('../Controllers/Investors/Personal/transactionhistory.js');
// const explorer = require('../Controllers/Investors/Balance/explorer.js');
// const blockchainquery = require('../Controllers/Investors/Balance/blockchainquery.js');
// const signout = require('../Controllers/Investors/Auth/signout.js');
// const investortx = require('../Controllers/Investors/Transactions/transactions');
// const ticketdetails = require('../Controllers/Investors/Transactions/transactiondetails');
// const txdetails = require('../Controllers/Admin/Transactions/transactiondetails.js');
// const termscontroller = require('../Controllers/Investors/kyc/termscondition');
// const discountcontroller = require('../Controllers/Property/Funding/discount');
// const tradeattachment = require('../Controllers/Investors/Transactions/attachments');
// const securitysettingscontroller = require('../Controllers/Investors/security/settings');

// const propertycntrl = require('../Controllers/Property/index');

// const notificationcntrl = require('../Controllers/Investors/Personal/notification');
// const totpcntrl = require('../Controllers/Investors/security/totp');
// const filecntrl = require('../Controllers/Shared/files');
// const dashboardcntrl = require('../Controllers/Investors/Personal/dashboard');
// const { uploadfiles } = require('../utils/aws-utils.js');
// const marketplacecntrl = require('../Controllers/Investors/Marketplace/marketplace');
// const youtubeUtils = require('../utils/youtube');
// const sellOrder = require('../Controllers/Investors/Marketplace/sellOrders');
// const blockchainController = require('../utils/blockchain-utils');
// const blockchainUtils = require('../utils/blockchain-utils');


// publicroutes.post('/refreshaccesstoken', sessionrefresh.refreshsession);

// /**
//  * @swagger
//  *
//  * /emailchecktoken:
//  *   post:
//  *     description: Check email confirmation token
//  *     tags:
//  *       - Auth Routes . (These routes doesn't require Authorization tokens) 
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: token
//  *         description: email confirmation token.
//  *         in: formData
//  *         required: true
//  *         type: string
//  *         
//  *     responses:
//  *       200:
//  *         description: 200 ok status return with new access token
//  *       404:
//  *         description: Server error 
//  */



// /**
//  * @swagger
//  *
//  * /investorhistory:
//  *   get:
//  *     description: Signout investor and expire session token
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - Investor Personal Api's (Require Authorization)
//  *     produces:
//  *       - application/json
//  *    
//  *         
//  *     responses:
//  *       200:
//  *         description: 200 ok
//  *       500:
//  *         description: Server error 
//  */

// router.get('/investorhistory', middleware.checkToken, investorhistory.getinvestorhistory);


// /**
//  * @swagger
//  *
//  * /personaldetails:
//  *   get:
//  *     description: Get Investor kyc details
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - Investor Personal Api's (Require Authorization)
//  *     produces:
//  *       - application/json
//  *    
//  *         
//  *     responses:
//  *       200:
//  *         description: Fetch Information successfully
//  *       500:
//  *         description: Server error 
//  */

// /**
// * @swagger
// *
// * /personaldetails:
// *   post:
// *     description: Update personal settings
// *     security:              # <--- ADD THIS
// *       - bearerAuth: []
// *     tags:
// *       - Investor Personal Api's (Require Authorization)
// *     produces:
// *       - application/json
// *     parameters:
// *       - name: email
// *         description: Update email settings
// *         in: formData
// *         required: true
// *         type: string   
// *    
// *         
// *     responses:
// *       200:
// *         description: Email updated successfully
// *       500:
// *         description: Server error 
// */

// // router.route('/personaldetails')
// //       .get(middleware.checkToken, investorpersonal.completeinfo)
// //       .post(middleware.checkToken, investorpersonal.updatesettings);

// /**
//  * @swagger
//  *
//  * /me:
//  *   get:
//  *     description: Get firstname ofinvestor to display in dashboard  
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - Investor Personal Api's (Require Authorization)
//  *     produces:
//  *       - application/json
//  *    
//  *         
//  *     responses:
//  *       200:
//  *         description: Fetch Information successfully
//  *       500:
//  *         description: Server error 
//  */
// //router.get('/me', middleware.checkToken, investorpersonal.getinfoaboutinvestor);
// /**
//  * @swagger
//  *
//  * /myemail:
//  *   get:
//  *     description: Get email and primary phonenumber of investor
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - Investor Personal Api's (Require Authorization)
//  *     produces:
//  *       - application/json
//  *    
//  *         
//  *     responses:
//  *       200:
//  *         description: Fetch Information successfully
//  *       500:
//  *         description: Server error 
//  */
// //router.get('/myemail', middleware.checkToken, informationaboutinvestor.getemailaboutinvestor);
// /**
//  * @swagger
//  *
//  * /getuserbalance:
//  *   get:
//  *     description: Get investor balance directly from blockchain smart contract
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - Investor Personal Api's (Require Authorization)
//  *     produces:
//  *       - application/json
//  *    
//  *         
//  *     responses:
//  *       200:
//  *         description: Fetch Information successfully
//  *       500:
//  *         description: Server error 
//  */
// //router.get('/getuserbalance', middleware.checkToken, investorbalance.blockchainbalance);
// /**
//  * @swagger
//  *
//  * /getholderbalance:
//  *   get:
//  *     description: Get holder balance from local db
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - Investor Personal Api's (Require Authorization)
//  *     produces:
//  *       - application/json
//  *    
//  *         
//  *     responses:
//  *       200:
//  *         description: Fetch Information successfully
//  *       500:
//  *         description: Server error 
//  */
// //router.get('/getholderbalance', allholders.getholderbalance);
// /**
//  * @swagger
//  *
//  * /explorer:
//  *   get:
//  *     description: Show transactions which are approved on blockchain
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - General Api's (Require Authorization)
//  *     produces:
//  *       - application/json
//  *    
//  *         
//  *     responses:
//  *       200:
//  *         description: Fetch Information successfully
//  *       500:
//  *         description: Server error 
//  */
// //router.get('/explorer', middleware.checkToken, explorer.explorer);
// /**
//  * @swagger
//  *
//  * /totalarea:
//  *   get:
//  *     description: Fetch total property area from blockchain
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - General Api's (Require Authorization)
//  *     produces:
//  *       - application/json
//  *    
//  *         
//  *     responses:
//  *       200:
//  *         description: Fetch Information successfully
//  *       500:
//  *         description: Server error 
//  */
// router.get('/totalarea', blockchainquery.totaltokens);
// /**
//  * @swagger
//  *
//  * /circulationarea:
//  *   get:
//  *     description: Fetch circulation area from blockchain
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - General Api's (Require Authorization)
//  *     produces:
//  *       - application/json
//  *    
//  *         
//  *     responses:
//  *       200:
//  *         description: Fetch Information successfully
//  *       500:
//  *         description: Server error 
//  */
// router.get('/circulationarea', blockchainquery.circulationtokens);



// /**
//  * @swagger
//  *
//  * /acceptterms:
//  *   post:
//  *     description: Investor submit kyc information via this endpoint
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - KYC Api's (Require Authorization)
//  *     
//  *     parameters:
//  *       - name: agreed
//  *         description: Aggrements.
//  *         in: formData
//  *         required: true
//  *         type: boolean

//  *           
//  *         
//  *     responses:
//  *       200:
//  *         description: 200 ok
//  *       500:
//  *         description: Server error 
//  */

// /**
// * @swagger
// *
// * /acceptterms:
// *   get:
// *     description: Get investor terms status
// *     security:              # <--- ADD THIS
// *       - bearerAuth: []
// *     tags:
// *       - KYC Api's (Require Authorization)
// *     
 
// *         
// *     responses:
// *       200:
// *         description: 200 ok
// *       500:
// *         description: Server error 
// */

// // router.route('/acceptterms',middleware.checkToken)
// //       .post(termscontroller.updatetermsandconditions) 
// //       .get(termscontroller.getterms) 

// // router.post('/acceptterms', middleware.checkToken, termscontroller.updatetermsandconditions);
// // router.get('/acceptterms', middleware.checkToken, termscontroller.getterms);




// /**
//  * @swagger
//  *
//  * /profilestatus:
//  *   get:
//  *     description: fetch profile status of investor
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - KYC Api's (Require Authorization)
//  *     produces:
//  *       - application/json
//  *    
//  *         
//  *     responses:
//  *       200:
//  *         description: Fetch Information successfully
//  *       500:
//  *         description: Server error 
//  */


// router.get('/profilestatus', middleware.checkToken, profilestatus.checkprofilestatus);


// // Update investor payment mode

// /**
//  * @swagger
//  *
//  * /getpaymentmode:
//  *   get:
//  *     description: get payment mode of investor
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - Investor Personal Api's (Require Authorization)
//  *     produces:
//  *       - application/json
//  *    
//  *         
//  *     responses:
//  *       200:
//  *         description: 200 ok 
//  *       500:
//  *         description: Server error 
//  */

// //router.get('/getpaymentmode', middleware.checkToken, investorpaymentdetails.getpaymentmode);
// /**
//  * @swagger
//  *
//  * /updatepayment:
//  *   post:
//  *     description: Update Investor payment method
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - Investor Personal Api's (Require Authorization)
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: paymentoption
//  *         description: payment option   
//  *         in: formData        
//  *         required: true
//  *         
//  *     responses:
//  *       200:
//  *         description: 200 ok
//  *       404:
//  *         description: Not found
//  */
// //router.post('/updatepayment', middleware.checkToken, investorpayment.updatepayment);

// // Investor pledge form api's 

// /**
//  * @swagger
//  *
//  * /pledgearea:
//  *   post:
//  *     description: Post buy request
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - Investor Personal Api's (Require Authorization)
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: agentcode
//  *         description: Agent Code   
//  *         in: formData        
//  *         required: false
//  *       - name: purchasedarea
//  *         description: Purchased Area
//  *         in: formData
//  *         required: true
//  *       - name: billingAddress
//  *         description: billing Address of Investor         
//  *         in: formData
//  *         required: true
//  *  
//  *     responses:
//  *       200:
//  *         description: 200 ok
//  *       500:
//  *         description: Server error 
//  */


// router.post('/pledgearea', middleware.checkToken, checkoutcontroller.pledgearea);

// /**
//  * @swagger
//  *
//  * /getbillinginfo:
//  *   get:
//  *     description: get existing billing information of investor at checkout page
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - Checkout Api's (Require Authorization)
//  *     produces:
//  *       - application/json
//  *    
//  *         
//  *     responses:
//  *       200:
//  *         description: 200 ok with billing info
//  *       500:
//  *         description: Server error 
//  */

// //router.get('/getbillinginfo', middleware.checkToken, billingcontroller.getbillinginfo);


// /**
//  * @swagger
//  *
//  * /mytransactions:
//  *   get:
//  *     description: Get investor personal transactions
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - Investor Personal Api's (Require Authorization)
//  *     produces:
//  *       - application/json
//  *    
//  *         
//  *     responses:
//  *       200:
//  *         description: 200 ok with transaction lists
//  *       500:
//  *         description: Server error 
//  */

// router.get('/mytransactions', middleware.checkToken, investortx.transactions);
// /**
//  * @swagger
//  *
//  * /transactiondetails:
//  *   post:
//  *     description: Get details of specific transaction
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - Investor Personal Api's (Require Authorization)
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: queuenumber
//  *         in: formData
//  *         required: true 
//  *    
//  *         
//  *     responses:
//  *       200:
//  *         description: 200 ok with tx details
//  *       500:
//  *         description: Server error 
//  */
// router.post('/transactiondetails', middleware.checkToken, ticketdetails.txdetailscontroller);

// /**
//  * @swagger
//  *
//  * /gettxattachment:
//  *   post:
//  *     description: Get transaction attachments for any specific transaction
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - Investor Personal Api's (Require Authorization)
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: keyname
//  *         in: formData
//  *         required: true 
//  *    
//  *         
//  *     responses:
//  *       200:
//  *         description: 200 ok with attachment details
//  *       500:
//  *         description: Server error 
//  */
// router.post('/gettxattachment', middleware.checkToken, txdetails.txattachments);

// // Property Api's


// /**
//  * @swagger
//  *
//  * /getpropertyprice:
//  *   get:
//  *     description: Get latest property price
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - Investor Personal Api's (Require Authorization)
//  *     produces:
//  *       - application/json

//  *     responses:
//  *       200:
//  *         description: 200 ok with property price
//  *       500:
//  *         description: Server error 
//  */

// router.get('/getpropertyprice', middleware.checkToken, propertycntrl.getpropertyprice);

// /**
//  * @swagger
//  *
//  * /getpropertytaxes:
//  *   get:
//  *     description: Get all property taxes
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - Property Api's (Require Authorization)
//  *     produces:
//  *       - application/json

//  *     responses:
//  *       200:
//  *         description: 200 ok with property taxes
//  *       500:
//  *         description: Server error 
//  */

// router.get('/getpropertytaxes', middleware.checkToken, propertycntrl.getpropertytaxes);

// /**
//  * @swagger
//  *
//  * /changepassword:
//  *   post:
//  *     description: Change investor password
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - Property Api's (Require Authorization)
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: currentpassword
//  *         in: formData  
//  *         required: true
//  *       - name: newpassword
//  *         in: formData
//  *         required: true
//  *             
//  *     responses:
//  *       200:
//  *         description: 200 ok status
//  *       500:
//  *         description: Server error 
//  */

// //router.post('/changepassword', middleware.checkToken, investorpasschange.changepassword);


// /**
//  * @swagger
//  *
//  * /getpropertymilestones:
//  *   get:
//  *     description: Get milestones of current development rounds
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - Investor Personal Api's (Require Authorization)
//  *     produces:
//  *       - application/json

//  *     responses:
//  *       200:
//  *         description: 200 ok with milestone details
//  *       500:
//  *         description: Server error 
//  */


// router.get('/getpropertymilestones', propertycntrl.getroundmilestones);

// /**
//  * @swagger
//  *
//  * /getfundingroundsummary:
//  *   get:
//  *     description: Get details of active funding round and upcoming funding rounds
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - Property Api's (Require Authorization)
//  *     produces:
//  *       - application/json

//  *     responses:
//  *       200:
//  *         description: 200 ok with summary
//  *       500:
//  *         description: Server error 
//  */


// router.get('/getfundingroundsummary', propertycntrl.getfundingroundsummary);

// /**
//  * @swagger
//  *
//  * /propertystats:
//  *   get:
//  *     description: Get property stats and details
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - Property Api's (Require Authorization)
//  *     produces:
//  *       - application/json

//  *     responses:
//  *       200:
//  *         description: 200 ok with property stats
//  *       500:
//  *         description: Server error 
//  */

// router.get('/propertystats', propertycntrl.getpropertystats);

// /**
//  * @swagger
//  *
//  * /propertyinfo:
//  *   get:
//  *     description: Get property info like details
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - Property Api's (Require Authorization)
//  *     produces:
//  *       - application/json

//  *     responses:
//  *       200:
//  *         description: 200 ok with proeprty info
//  *       500:
//  *         description: Server error 
//  */


// router.get('/propertyinfo', propertycntrl.propertyinfo);


// /**
//  * @swagger
//  *
//  * /blockchainareasold:
//  *   get:
//  *     description: fetch how much area is sold on blockchain
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - Property Api's (Require Authorization)
//  *     produces:
//  *       - application/json

//  *     responses:
//  *       200:
//  *         description: 200 ok with blockchain area sold
//  *       500:
//  *         description: Server error 
//  */

// router.get('/blockchainareasold', middleware.checkToken, blockchainquery.blockhainareasold);

// /**
//  * @swagger
//  *
//  * /devrounds:
//  *   get:
//  *     description: Fetch dev round details
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - Property Api's (Require Authorization)
//  *     produces:
//  *       - application/json

//  *     responses:
//  *       200:
//  *         description: 200 ok with dev round details
//  *       500:
//  *         description: Server error 
//  */


// router.get('/devrounds', propertycntrl.investorgetrounds);

// /**
//  * @swagger
//  *
//  * /txsearch:
//  *   get:
//  *     description: search tx details according to paramters
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - Investor Personal Api's (Require Authorization)
//  *     parameters:
//  *       - in: query
//  *         name: order
//  *         schema: 
//  *           type: string
//  *         description: Sort transaction according to newest or oldest
//  *       - in: query
//  *         name: operations
//  *         schema:
//  *           type: string
//  *         description: Sort transactiona according to order type (buy or sell)  
//  *     produces:
//  *       - application/json

//  *     responses:
//  *       200:
//  *         description: 200 ok with dev round details
//  *       500:
//  *         description: Server error 
//  */

// router.get('/txsearch', middleware.checkToken, investortx.searchtransactions);

// /**
//  * @swagger
//  *
//  * /investmentcalculator:
//  *   get:
//  *     description: Calculate profit/loss of investor investments
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - Investor Personal Api's (Require Authorization)
//  *     produces:
//  *       - application/json

//  *     responses:
//  *       200:
//  *         description: 200 ok with dev round details
//  *       500:
//  *         description: Server error 
//  */


// router.get('/investmentcalculator', middleware.checkToken, investorbalance.investmentvalue);

// /**
//  * @swagger
//  *
//  * /activeprice:
//  *   get:
//  *     description: Fetch current active price of development round
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - Investor Personal Api's (Require Authorization)
//  *     produces:
//  *       - application/json

//  *     responses:
//  *       200:
//  *         description: 200 ok with current price
//  *       500:
//  *         description: Server error 
//  */

// router.get('/activeprice', middleware.checkToken, propertycntrl.price);


// /**
//  * @swagger
//  *
//  * /propdiscount:
//  *   get:
//  *     description: Fetch current discount value applied to active development round
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - Investor Personal Api's (Require Authorization)
//  *     produces:
//  *       - application/json

//  *     responses:
//  *       200:
//  *         description: 200 ok with discount value
//  *       500:
//  *         description: Server error 
//  */

// router.get('/propdiscount', middleware.checkToken, discountcontroller.discountprice);


// /**
//  * @swagger
//  *
//  * /completedrounds:
//  *   get:
//  *     description: Fetch completed rounds
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - Investor Personal Api's (Require Authorization)
//  *     produces:
//  *       - application/json

//  *     responses:
//  *       200:
//  *         description: 200 ok with numeric value of completed rounds
//  *       500:
//  *         description: Server error 
//  */

// //router.get('/completedrounds', propertycntrl.completedrounds);


// router.post('/addattachment', upload.any(), middleware.checkToken, tradeattachment.addattachments);

// /**
//  * @swagger
//  *
//  * /securitysettings:
//  *   get:
//  *     description: Fetch profile settings
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - Investor Personal Api's (Require Authorization)
//  *     produces:
//  *       - application/json

//  *     responses:
//  *       200:
//  *         description: 200 ok with json data 
//  *       500:
//  *         description: Server error 
//  */


// /**
// * @swagger
// *
// * /securitysettings:
// *   post:
// *     description: Fetch profile settings
// *     security:              # <--- ADD THIS
// *       - bearerAuth: []
// *     tags:
// *       - Investor Personal Api's (Require Authorization)
// *     produces:
// *       - application/json

// *     responses:
// *       200:
// *         description: 200 ok with json data 
// *       500:
// *         description: Server error 
// */


// // router.route('/securitysettings')
// //       .get(middleware.checkToken, securitysettingscontroller.profilesettings)
// //       .post(middleware.checkToken, securitysettingscontroller.updatesettings)




// // router.post('/enable-totp', middleware.checkToken, totpcntrl.enabletotp);
// // router.post('/verify-totp', middleware.checkToken, totpcntrl.verifytotp);
// // router.get('/mfa-status', middleware.checkToken, totpcntrl.mfastatus);
// // router.post('/check-mfa', middleware.checkToken, logincontroller.check_mfa);

// /**
//  * @swagger
//  *
//  * /documents:
//  *   get:
//  *     description: Fetch all documents with title and document url
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - Investor Personal Api's (Require Authorization)
//  *     produces:
//  *       - application/json

//  *     responses:
//  *       200:
//  *         description: 200 ok json data
//  *       500:
//  *         description: Server error 
//  */

// router.get('/documents', middleware.checkToken, propertycntrl.alldocument);

// /**
//  * @swagger
//  *
//  * /document/url:
//  *   get:
//  *     description: Get Signed url of specific document
//  *     security:              # <--- ADD THIS
//  *       - bearerAuth: []
//  *     tags:
//  *       - Investor Personal Api's (Require Authorization)
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - in: query
//  *         name: document
//  *         schema: 
//  *           type: string
//  *         description: document_id or document_url

//  *     responses:
//  *       200:
//  *         description: 200 ok json data
//  *       500:
//  *         description: Server error 
//  */

// router.get('/document/url', middleware.checkToken, filecntrl.signedurl);

// router.get('/dashboard', middleware.checkToken, dashboardcntrl.DashboardController);


// // router.get('/updates', middleware.checkToken, propertycntrl.getupdates);
// // router.get('/project-updates', youtubeUtils.fetchVideos);

// // router.route('/sell')
// //       .get(marketplacecntrl.GetOrders)
// //       .post( marketplacecntrl.sellRequest);

// router.get('/sell/list', marketplacecntrl.GetOrders);
// router.post('/sell', middleware.checkToken, marketplacecntrl.sellRequest);
// router.get('/order/:id', marketplacecntrl.GetOrderDetail);



// router.route('/bid')
//       .post(middleware.checkToken, marketplacecntrl.BidOrder);


// router.get('/active-round', middleware.checkToken, propertycntrl.activeRound);
// router.get('/sell-orders', middleware.checkToken, sellOrder.fetchOrders);
// router.post('/cancel-orders', middleware.checkToken, sellOrder.removeOrder);
// router.get('/fetchtokens',blockchainUtils.testtoken);
// //router.get('/gas-limit', blockchainController.testLedgerConnection);
// router.route('/files')
//     .get(middleware.checkToken, filecntrl.getfile)
//     .post(middleware.checkToken, upload.any(), filecntrl.uploadfile);
// module.exports = { publicroutes, router };


