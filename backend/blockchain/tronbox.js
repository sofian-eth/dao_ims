const web3 = require('web3');
const fs = require('fs');




const options = {
	reconnect: {
		auto: true,
		delay: 5000, // ms
		maxAttempts: 5,
		onTimeout: false
	}
};

var provider = new web3.providers.WebsocketProvider('wss://175.41.167.183/ws', options);

var web3js = new web3(provider);
var dataDir = fs.readFileSync(".tronKey").toString().trim();
var decrypted = web3js.eth.accounts.wallet.decrypt([dataDir], 'D@OTron2021$');
let privateKey = decrypted[0].privateKey;
let formattedPrivateKey = privateKey.substring(2,66);

module.exports = {
  networks: {
    mainnet: {

      privateKey: formattedPrivateKey,
      userFeePercentage: 50,
      feeLimit: 1e9,
      fullHost: 'https://api.trongrid.io',
      network_id: '1'
    },
    shasta: {
      privateKey: formattedPrivateKey,
      userFeePercentage: 50,
      feeLimit: 1e9,
      fullHost: 'https://api.shasta.trongrid.io',
      // solidityNode: 'https://api.shasta.trongrid.io',
      // eventServer: 'https://api.shasta.trongrid.io',
      network_id: '*'
    },
    nile: {
      privateKey: process.env.PRIVATE_KEY_NILE,
      userFeePercentage: 100,
      feeLimit: 1e8,
      fullHost: 'https://api.nileex.io',
      network_id: '3'
    },
    development: {
      // For trontools/quickstart docker image
      privateKey: 'da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0',
      userFeePercentage: 0,
      feeLimit: 1e8,
      fullHost: 'http://127.0.0.1:',
      network_id: '9'
    },
    compilers: {
      solc: {
        version: '0.7.0'
      }
    }
  }
}
