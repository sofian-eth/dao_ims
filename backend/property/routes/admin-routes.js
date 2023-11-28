

// const express = require('express');
// const adminpublicroutes = express.Router();
// const adminroutes = express.Router();

// const adminmiddleware = require('../utils/admin-middleware.js');

// const logincontroller = require('../Controllers/Admin/Auth/login.js');
// const sessioncontroller = require('../Controllers/Admin/Auth/session.js');
// const getkyclist = require('../Controllers/Investors/kyc/getkyclist.js');
// const fetchkycfile = require('../Controllers/Investors/kyc/fetchkycfile.js');
// const updatestatuscontroller = require('../Controllers/Admin/kyc/updatestatus.js');
// const recentsignups = require('../Controllers/Admin/General/recentsignups.js');
// const pendinginvestors = require('../Controllers/Admin/kyc/pendingkyc.js');
// const txcontroller = require('../Controllers/Admin/Transactions/transactions');
// const txdetails = require('../Controllers/Admin/Transactions/transactiondetails.js');
// const tradeattachment = require('../Controllers/Admin/Transactions/attachment.js');
// const totaltokenscontroller = require('../Controllers/Admin/General/totaltokens.js');
// const circulationtokenscontroller = require('../Controllers/Admin/General/circulationtoken.js');
// const blockchaincontroller = require('../Controllers/Admin/Transactions/blockchaincontroller.js');
// const holderscontrollers = require('../Controllers/Admin/General/holders');
// const investorcontrollers = require('../Controllers/Admin/Investors/investors');
// const createinvestor = require('../Controllers/Admin/Investors/create-investor');
// const checkemailcontroller = require('../Controllers/Admin/Investors/checkemail');
// const investorpasswordcontroller = require('../Controllers/Admin/Investors/changepassword');
// const titlecontroller = require('../Controllers/Admin/Investors/fetchtitle');
// const adminusers = require('../Controllers/Admin/Auth/users');
// const tagcontroller = require('../Controllers/Admin/General/tags');


// const propertycntrl = require('../Controllers/Property/index');
// const filecntrl = require('../Controllers/Shared/files');
// const marketplacecntrl = require('../Controllers/Admin/marketplace/order');
// var multer = require('multer')
// var storage = multer.memoryStorage()
// var upload = multer({
//     storage: storage,
//     // limits: { fileSize: 500000 },
//     fileFilter: function (req, file, cb, res) {

//         var filetypes = /jpeg|jpg|png|pdf/;
//         var mimetype = filetypes.test(file.mimetype);

//         if (mimetype) {
//             return cb(null, true);
//         }
//         return cb(new Error("Error: File upload only supports image or pdf formats "));
//     }
// })


// const adminvalidators = require('../utils/admin-validations');

// /**
//  * @swagger
//  * tags:
//  *   name: Admin
//  *   description: Routes specific to admins
//  */

// /**
//  * @swagger
//  * path:
//  *  /login/:
//  *    post:
//  *      summary: Login admin user
//  *      tags: [Admin]
//  *      produces:
//  *        application/json
//  *      parameters:
//  *        - name: email
//  *          description: Email or username of admin
//  *          in: formData
//  *          required: true
//  *          type: string
//  *        - name: password
//  *          description: Password of admin
//  *          required: true
//  *          type: string
//  *      responses:
//  *        "200":
//  *          description: Returns with json response containing jwt token ,refresh token
//  *          content:
//  *            application/json:
//  *              schema:
//  *                type: object
//  *                properties:
//  *                   accesstoken:
//  *                       type: string
//  *                       description: jwt token
//  *                   refreshtoken:
//  *                       type: string
//  *                       description: refresh access token
//  *                   usertype:
//  *                       type: string
//  *                       description: user type 
//  */
// // adminpublicroutes.post('/login', adminvalidators.adminvalidators('adminlogin'), logincontroller.logincontroller);


// /**
//  * @swagger
//  * path:
//  *  /refreshaccesstoken/:
//  *    post:
//  *      summary: Refresh Access token
//  *      tags: [Admin]
//  *      produces:
//  *        application/json
//  *      parameters:
//  *        - name: sessionrefreshtoken
//  *          description: refresh access token of user to generate new valid session token
//  *          in: formData
//  *          required: true
//  *          type: string
//  *      responses:
//  *        "200":
//  *          description: Returns with json response containing jwt token ,refresh token
//  *          content:
//  *            application/json:
//  *              schema:
//  *                type: object
//  *                properties:
//  *                   accesstoken:
//  *                       type: string
//  *                       description: jwt token
//  *                   refreshtoken:
//  *                       type: string
//  *                       description: refresh access token
//  *                   usertype:
//  *                       type: string
//  *                       description: user type 
//  */

// // adminpublicroutes.post('/refreshaccesstoken', sessioncontroller.refreshsession);


// /**
//  * @swagger
//  * path:
//  *  /recentsignups/:
//  *    get:
//  *      summary: Fetch recent signups by investor
//  *      tags: [Admin]
//  *      responses:
//  *        "200":
//  *          description: Returns with json response containing array of recent signups
//  *          content:
//  *            application/json:
//  *              schema:
//  *                type: object
//  *                properties:
//  *                   membershipid:
//  *                       type: string
//  *                       description: Membership id
//  *                   username:
//  *                       type: string
//  *                       description: Investor Username
//  *                   email:
//  *                       type: string
//  *                       description: Investor Email Address
//  *                   primarymobilenumber:
//  *                       type: string
//  *                       description: Investor Phone number
//  *                   created_at:
//  *                     type: string
//  *                     description: Account creation date
//  *                   statusname: 
//  *                     type: string
//  *                     description: Investor profile status
//  */

// //adminroutes.get('/recentsignups', adminmiddleware.checkToken, recentsignups.recentsignupsdb);

// /**
//  * @swagger
//  * path:
//  *  /getpendinginvestors/:
//  *    get:
//  *      summary: List all ivnestors whose kyc is in pending stage
//  *      tags: [Admin]
//  *      responses:
//  *        "200":
//  *          description: Returns with json response containing array of kyc lists
//  *          content:  
//  *            application/json:
//  *              schema:
//  *                type: object
//  *                properties:
//  *                   id:
//  *                       type: string
//  *                       description: kyc id
//  *                   legalname:
//  *                       type: string
//  *                       description: Investor legal name as per NIC
//  *                   dateofbirth:
//  *                       type: string
//  *                       description: Investor date of birth as per NIC
//  *                   country:
//  *                       type: string
//  *                       description: Investor country as per NIC
//  *                   city:
//  *                     type: string
//  *                     description: Investor city as per NIC
//  *                   province: 
//  *                     type: string
//  *                     description: Investor province as per NIC
//  *                   address:
//  *                     type: string
//  *                     description: Investor residential address as per NIC
//  *                   documenturl:
//  *                     type: string
//  *                     description: Hashed url of document submitted
//  *                   statusname:
//  *                     type: string
//  *                     description: status of investor
//  */

// // adminroutes.get('/getpendinginvestors', adminmiddleware.checkToken, pendinginvestors.pendinginvestorkyc);


// /**
//  * @swagger
//  * path:
//  *  /transactions/:
//  *    get:
//  *      summary: List all transactions
//  *      tags: [Admin]
//  *      responses:
//  *        "200":
//  *          description: Returns with json response containing array of transactions
//  *          content:
//  *            application/json:
//  *              schema:
//  *                type: object
//  *                properties:
//  *                   email:
//  *                       type: string
//  *                       description: Email of transaction issuance
//  *                   primarymobilenumber:
//  *                       type: string
//  *                       description: Phone number of investor
//  *                   areapledged:
//  *                       type: number
//  *                       description: Area units pledged
//  *                   sqftprice:
//  *                       type: number
//  *                       description: Sqft Price
//  *                   totalprice:
//  *                     type: number
//  *                     description: total cost of transactions
//  *                   paymentdate: 
//  *                     type: string
//  *                     description: Payment deadline date
//  *                   queuenumber:
//  *                     type: string
//  *                     description: Queue number 

//  */



// adminroutes.get('/transactions', adminmiddleware.checkToken, txcontroller.listtransaction);

// /**
//  * @swagger
//  * path:
//  *  /tags/:
//  *    get:
//  *      summary: Get all tags
//  *      tags: [Admin]
//  *      responses:
//  *        "200":
//  *          description: Returns with json response containing tags
//  *          content:
//  *            application/json:
//  *              schema:
//  *                type: object
//  *                properties:
//  *                   tagname:
//  *                       type: string
//  *                       description: tagname

//  */

// // adminroutes.get('/tags');



// /**
// * @swagger
// * path:
// *  /updates/:
// *    post:
// *      summary: Post property updates
// *      tags: [Admin]
// *      produces:
// *        application/json
// *      parameters:
// *        - name: title
// *          description: Title of property update
// *          in: formData
// *          required: true
// *          type: string
// *        - name: descriptions
// *          description: Update description
// *          in: formData
// *          required: true
// *          type: string
// * 
// *        - name: tags
// *          description: property tags
// *          in: formData
// *          required: true
// *          type: string
// *       
// *      responses:
// *        200:
// *          description: successful
// */

// adminroutes.route('/updates')
//     .get()
//     .post()
// //adminroutes.post('/adduser',addusercontroller.adduser);




// // adminroutes.get('/getinvestorkyc', adminmiddleware.checkToken, getkyclist.getinvestorkyclist);

// // adminroutes.post('/getkycfile', adminmiddleware.checkToken, fetchkycfile.fetchkycfile);
// // adminroutes.post('/updatekycstatus', adminmiddleware.checkToken, updatestatuscontroller.updatekycstatus);

// adminroutes.post('/addattachment', adminmiddleware.checkToken, upload.any(), tradeattachment.attachments);

// // adminroutes.post('/addinvestor', adminvalidators.adminvalidators('addinvestor'), createinvestor.createinvestorcontroller);

// adminroutes.post('/transactiondetails', adminmiddleware.checkToken, adminvalidators.adminvalidators('transaction-details'), txdetails.transactiondetails);

// adminroutes.post('/gettxattachment', adminmiddleware.checkToken, txdetails.txattachments);

// adminroutes.get('/totaltokens', adminmiddleware.checkToken, totaltokenscontroller.totaltokens);
// adminroutes.get('/totalcirculationtokens', adminmiddleware.checkToken, circulationtokenscontroller.circulationtokens);
// //adminroutes.post('/investorbalance');
// adminroutes.post('/blockchaintx', adminmiddleware.checkToken, blockchaincontroller.blockchaincontroller);
// adminroutes.get('/blockchainbalance', adminmiddleware.checkToken, blockchaincontroller.userbalance);
// adminroutes.post('/lockfunds', adminmiddleware.checkToken, adminvalidators.adminvalidators('lock-funds'), propertycntrl.devrounds);
// adminroutes.get('/getdevrounds', adminmiddleware.checkToken, propertycntrl.getrounds);
// adminroutes.route('/milestones')
//     .get(adminmiddleware.checkToken, propertycntrl.getmilestones)
//     .post(adminmiddleware.checkToken, propertycntrl.addmilestones)
//     .put(adminmiddleware.checkToken, propertycntrl.updatemilestones)


// adminroutes.route('/propertystats')
//     .get(adminmiddleware.checkToken, propertycntrl.getpropertystats)
//     .post(adminmiddleware.checkToken, propertycntrl.updatepropertystats)


// adminroutes.route('/property')
//     .get(adminmiddleware.checkToken, propertycntrl.propertyinfo)
//     .post(adminmiddleware.checkToken, propertycntrl.updatepropertyinfo)

// adminroutes.post('/unlockfunds', adminmiddleware.checkToken, propertycntrl.unlockfunds);

// //adminroutes.get('/test',bcutils.userbalance);
// adminroutes.get('/balancesync');
// //adminroutes.get('/holders',holderscontrollers.holdercontroller);

// adminroutes.route('/holders')
//     .get(adminmiddleware.checkToken, holderscontrollers.holdercontroller)
//     .post(adminmiddleware.checkToken, holderscontrollers.updateholderbalance);




// adminroutes.get('/investors', adminmiddleware.checkToken, investorcontrollers.investorcontrollers);
// adminroutes.post('/checkinvestoremail', adminmiddleware.checkToken, checkemailcontroller.checkemailcontroller);

// adminroutes.post('/changeinvestorpass', adminmiddleware.checkToken, investorpasswordcontroller.changepassword);
// adminroutes.post('/fetchtitle', adminmiddleware.checkToken, titlecontroller.fetchtitlecontroller);
// adminroutes.post('/createtransaction', adminmiddleware.checkToken, adminvalidators.adminvalidators('createtransaction'), txcontroller.createTransaction);
// adminroutes.post('/updatetransactions', adminmiddleware.checkToken, adminmiddleware.checkToken, adminvalidators.adminvalidators('update-transaction'), txcontroller.updatetx);
// adminroutes.post('/discardtransaction', adminmiddleware.checkToken, adminvalidators.adminvalidators('discard-transaction'), txcontroller.discardtx);
// //adminroutes.post('/')

// adminroutes.route('/usermanagment')
//     .get(adminmiddleware.checkToken, adminusers.users)
//     .post(adminmiddleware.checkToken, adminusers.adduser);

// adminroutes.route('/updates')
//     .get(adminmiddleware.checkToken, propertycntrl.getupdates)
//     .post(adminmiddleware.checkToken, propertycntrl.createupdate);


// adminroutes.post('/removeuser', adminmiddleware.checkToken, adminusers.removeusers);

// // adminroutes.get('/tags', adminmiddleware.checkToken, tagcontroller.tags);

// adminroutes.route('/pricehistory')
//     .get(adminmiddleware.checkToken, propertycntrl.pricehistorycontroller)
//     .post(adminmiddleware.checkToken, propertycntrl.updatepricehistory);



// adminroutes.route('/files')
//     .get(adminmiddleware.checkToken, filecntrl.getfile)
//     .post(adminmiddleware.checkToken, upload.any(), filecntrl.uploadfile);


// adminroutes.get('/document/url', adminmiddleware.checkToken, filecntrl.signedurl);


// adminroutes.route('/document')
//     .get(adminmiddleware.checkToken, propertycntrl.getdocument)
//     .post(adminmiddleware.checkToken, propertycntrl.adddocument);

// adminroutes.get('/documents', adminmiddleware.checkToken, propertycntrl.alldocument);

// adminroutes.route('/orders')
//     .get(marketplacecntrl.openorders)
//     .post()

// adminroutes.post('/trade-attachments', adminmiddleware.checkToken, filecntrl.tradeAttachments);
// adminroutes.post('/remove/trade-document', filecntrl.removeTradeAttachments);
// module.exports = { adminpublicroutes, adminroutes };

