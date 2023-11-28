const request = require('request');
const web3 = require('web3');
const path = require('path');
const fs = require('fs');
// const { SMART_CONTRACT_ADDRESS, ETHER_SCAN_API, ETHER_SCAN_API_URL, infuraProvider } = require('./keys');
require('dotenv').config()
const { transactionHistory } = require('../services/shared/common');
const rawContract = JSON.parse(fs.readFileSync(path.join(__dirname, './ErContract.json')));



const options = {
    reconnect: {
        auto: true,
        delay: 5000, // ms
        maxAttempts: 5,
        onTimeout: false
    }
};



function checkUserBalance(address) {
    let url = process.env.ETHER_SCAN_API_URL + 'api?module=account&action=tokenbalance&contractaddress=' + process.env.SMART_CONTRACT_ADDRESS + '&address=' + address + '&tag=latest&apikey=' + process.env.ETHER_SCAN_API;

    return new Promise(function (resolve, reject) {
        request.get({
            url: url,
            json: true,
            headers: { 'User-Agent': 'request' }
        }, (err, res, data) => {

            if (err) {

                reject('Error in fetching user balance');
            } else if (res.statusCode !== 200) {
                reject('Incorrect status code received');
            } else {
                if (data.result) {
                    resolve(data.result);
                }
                reject('Error in fetching user balance');
            }
        });

    })


}

async function userBalance(address) {


    let provider = new web3.providers.WebsocketProvider(process.env.infuraProvider, options);
    let web3js = new web3(provider);
    const contract = new web3js.eth.Contract(rawContract.abi, process.env.SMART_CONTRACT_ADDRESS);

    return new Promise(function (resolve, reject) {

        contract.methods.balances(address).call()
            .then(function (result) {
                console.log("User Balance", result);
                resolve(result);
            })
            .catch(function (error) {
                console.log("Web3 Error", web3);
                reject(error);
            });
    });



}


async function blockchainTransactionSend(address) {

    let provider = new web3.providers.WebsocketProvider(process.env.infuraProvider, options);
    let web3js = new web3(provider);
    const contract = new web3js.eth.Contract(rawContract.abi, process.env.SMART_CONTRACT_ADDRESS);


    return contract.getPastEvents('Transfer', {
        filter: { to: address }, // Using an array means OR: e.g. 20 or 23
        fromBlock: 0,
        toBlock: 'latest'
    }, function (error, events) {

        return events;
    })
        .then(function (events) {
            return events;
        })
        .catch(function (error) {
            throw 'error';
        })

}

async function blockchainTransactionReceive(address) {

    let provider = new web3.providers.WebsocketProvider(process.env.infuraProvider, options);
    let web3js = new web3(provider);
    const contract = new web3js.eth.Contract(rawContract.abi, process.env.SMART_CONTRACT_ADDRESS);


    return contract.getPastEvents('Transfer', {
        filter: { from: address }, // Using an array means OR: e.g. 20 or 23
        fromBlock: 0,
        toBlock: 'latest'
    }, function (error, events) {

        return events;
    })
        .then(function (events) {
            return events;
        })
        .catch(function (error) {
            throw 'error';
        })

}


async function circulationTokens() {

    let provider = new web3.providers.WebsocketProvider(process.env.infuraProvider, options);
    let web3js = new web3(provider);
    const contract = new web3js.eth.Contract(rawContract.abi, process.env.SMART_CONTRACT_ADDRESS);
    return new Promise(function (resolve, reject) {
        contract.methods.circulationsupply().call()
            .then(function (result) {
                resolve(result);
            })
            .catch(function (error) {
                reject(error);
            })
    })


};


async function tokenSupply() {

    let provider = new web3.providers.WebsocketProvider(process.env.infuraProvider, options);
    let web3js = new web3(provider);
    const contract = new web3js.eth.Contract(rawContract.abi, process.env.SMART_CONTRACT_ADDRESS);
    return new Promise(function (resolve, reject) {
        return contract.methods.totaltokens().call()
            .then(function (result) {
                resolve(result);
            })
            .catch(function (error) {
                reject(error);
            })


    });

}



module.exports.checkUserBalance = checkUserBalance;
module.exports.userBalance = userBalance;
module.exports.blockchainTransactionSend = blockchainTransactionSend;
module.exports.blockchainTransactionReceive = blockchainTransactionReceive;
module.exports.tokenSupply = tokenSupply;
module.exports.circulationTokens = circulationTokens;