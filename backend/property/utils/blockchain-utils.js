const web3 = require('web3');

const path = require('path');
const fs = require('fs');
const Tx = require('ethereumjs-tx');
// const updatebalancedb = require('../Models/Admins/Transactions/updatebalance.js');
// const masterbalanceupdate = require('../Models/Admins/DevRounds/updatemasterbalance');
const dotenv = require('dotenv');
const areaConversionUtils = require('./area-unit-conversion');
// const blockchainModule= require('blockchain');
dotenv.config();


var walletFile = fs.readFileSync(path.join(__dirname, '../BlockchainModule/.testkey')).toString().trim();

var masterwalletpublickey = process.env.daopublicaddress;

var wsscocketprovider = process.env.infuranode;
var parentcontractaddress = process.env.maincontractaddress;
const options = {
	reconnect: {
		auto: true,
		delay: 5000, // ms
		maxAttempts: 5,
		onTimeout: false
	}
};
var provider = new web3.providers.WebsocketProvider(wsscocketprovider, options);

var web3js = new web3(provider);

provider.on('error', e => {
	
	provider = new web3.providers.WebsocketProvider(wsscocketprovider, options);
});
provider.on('end', e => {
	
	provider = new web3.providers.WebsocketProvider(wsscocketprovider, options);

	provider.on('connect', function () {
	});

	web3js.setProvider(provider);
});






const rawcontract = JSON.parse(fs.readFileSync(path.join(__dirname, '../BlockchainModule/build/contracts/ErContract.json')));
const contractabi = JSON.stringify(rawcontract.abi);

const contract = new web3js.eth.Contract(rawcontract.abi, parentcontractaddress);







const gettotaltokens = function () {


	return contract.methods.totaltokens().call()
		.then(function (result) {
			return areaConversionUtils.convertToSqft(result);
		})
		.then(function (result) {
			return result;
		})
		.catch(function (error) {
			throw error;
		})

}








const circulationtokens = function () {

	return contract.methods.circulationsupply().call()
		.then(function (result) {
			return areaConversionUtils.convertToSqft(result);
		})
		.then(function (result) {
			return result;
		})
		.catch(function (error) {
			throw error;
		})
};


const blockchaintx = function (body) {




	var transfer = contract.methods.transferFrom(body.selleraddress, body.buyeraddress, body.area);
	var encodeABI = transfer.encodeABI();
	return new Promise(function (resolve, reject) {
		transactionobject(encodeABI, body.walletPwd)
			.then(function (transactionobject) {
				var transactionid = transactionobject[0];
				var signedtransaction = transactionobject[1];

				return sendtransactiontoblockchain(signedtransaction);

			})
			.then(function (transactionid) {
				resolve(transactionid);
			})
			.catch(function (error) {
				reject(error);

			})

	});


}

var sendtransactiontoblockchain = function (signedtransaction) {

	var signedtx = signedtransaction;

	return new Promise(function (resolve, reject) {
		web3js.eth.sendSignedTransaction(signedtx, function (err, hash) {
			if (err)
				reject(err);
			if (!err) {

				resolve(hash);
			}

		})

	});
}



var transactionobject = function (encodeabi, walletPassword) {


	var count;
	var finalgasprice = 30 * 1000000000;
	var gasLimitValue;
	var privateKey;

	return new Promise(function (resolve, reject) {
		fetchPrivateKey(walletPassword)
			.then(function (result) {
				privateKey = Buffer.from(result.substring(2, 66), 'hex');
				return gasLimit();
			})
			.then(function (result) {

				gasLimitValue = result.gasLimit;
				return web3js.eth.getTransactionCount(masterwalletpublickey, 'pending');
			})
			.then(function (v) {
				count = v;

				const rawTransaction = {
					"nonce": count,
					"from": masterwalletpublickey,
					"to": parentcontractaddress,
					"value": 0,
					"gasPrice": finalgasprice,
					"gas": gasLimitValue,
					"data": encodeabi,
					"chainId": 3
				};

				var transaction = new Tx(rawTransaction);
				transaction.sign(privateKey);
				var signedtx = '0x' + transaction.serialize().toString('hex');
				var transactionidfinal = new Tx(signedtx).hash().toString('hex');
				var transactionidfinaldated = '0x' + transactionidfinal;
				var transactionarray = [transactionidfinaldated, signedtx];

				resolve(transactionarray);
			})
			.catch(function (error) {
				
				reject('Sending transaction to blockchain failed.');
			});

	});

}

const userbalance = function () {
	return new Promise(function (resolve, reject) {

		contract.methods.balances(masterwalletpublickey).call()
			.then(function (result) {
				return areaConversionUtils.convertToSqft(result);
			})
			.then(function (result) {
				resolve(result);
			})
			.catch(function (error) {
				reject(error);
			});
	});

}

const investorbalance = function (address) {

	return new Promise(function (resolve, reject) {

		contract.methods.balances(address).call()
			.then(function (result) {
				return areaConversionUtils.convertToSqft(result);
			})
			.then(function (result) {
				resolve(result);
			})
			.catch(function (error) {

				reject(error);
			});
	});



}



const lockfunds = function (data) {

	var sd = new Date(data.startdate);
	var starttimestamp = Math.floor(new Date(data.startdate).getTime() / 1000);
	var endtimestamp = Math.floor(new Date(data.enddate).getTime() / 1000);

	var transfer = contract.methods.developmentRounds(data.name, data.sutarUnits, starttimestamp, endtimestamp);
	var encodeABI = transfer.encodeABI();
	return new Promise(function (resolve, reject) {
		transactionobject(encodeABI, process.env.walletPassword)
			.then(function (transactionobject) {
				var transactionid = transactionobject[0];
				var signedtransaction = transactionobject[1];

				return sendtransactiontoblockchain(signedtransaction);

			})
			.then(function (transactionid) {

				var jsonobject = {
					starttimestamp: starttimestamp,
					endtimestamp: endtimestamp,
					txid: transactionid
				}

				resolve(jsonobject);
			})
			.catch(function (error) {
				reject(error);

			})

	});



}


const unlockfunds = function (data,walletPassword) {

	var transfer = contract.methods.releasefunds(data);
	var encodeABI = transfer.encodeABI();
	return new Promise(function (resolve, reject) {
		transactionobject(encodeABI, walletPassword)
			.then(function (transactionobject) {
				var transactionid = transactionobject[0];
				var signedtransaction = transactionobject[1];

				return sendtransactiontoblockchain(signedtransaction);

			})
			.then(function (transactionid) {
				resolve(transactionid);
			})
			.catch(function (error) {

				reject(error);

			})

	});



}


function gasLimit() {
	return web3js.eth.getBlock("latest", false, (error, result) => {
		if (error)
			throw 'Error in fetching gas limit';
		return result.gasLimit
	});

}

function fetchPrivateKey(accountPassword) {

	return new Promise(function (resolve, reject) {
		if(!web3js.eth.accounts.wallet.decrypt([walletFile], accountPassword)){
		
			reject ("Invalid Password");
		}
		if(web3js.eth.accounts.wallet.decrypt([walletFile], accountPassword) instanceof Error){
			reject ("Invalid Password");
		}
		
		let decrypted = web3js.eth.accounts.wallet.decrypt([walletFile], accountPassword);
		resolve(decrypted[0].privateKey);

		

	})



}


const testtoken = function (req, res) {


	return contract.methods.totaltokens().call()

		.then(function (result) {
			res.send(result)
		})
		.catch(function (error) {
			res.send('error');
		})

}


// async function blockchainTest(req,res){
// 	let test = await blockchainModule();
// 	console.log(test);
// } 

module.exports = { gettotaltokens, circulationtokens, blockchaintx, userbalance, lockfunds, unlockfunds, investorbalance, testtoken };

