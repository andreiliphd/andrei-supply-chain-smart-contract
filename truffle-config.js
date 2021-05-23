const HDWallet = require('truffle-hdwallet-provider');
const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*", // Match any network id
      gas: 996721975,
      //gasPrice: 5e9,

    },
    ganache: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
    },
    rinkeby: {
      provider: function() {
        return new HDWallet(mnemonic, "https://rinkeby.infura.io/v3/499c890b39814c958d31eaa3510fdfee");
      },
      network_id: '4',
      gas: 4500000,
      gasPrice: 10000000000,
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};