const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
module.exports = {
  networks: {
    inf_AirBnb_sepolia: {
      network_id: 4,
      gasPrice: 100000000000,
      provider: new HDWalletProvider(fs.readFileSync('15c86e97ac734a719d4c77fe7e8392c3', 'utf-8'), "https://sepolia.infura.io/v3/15c86e97ac734a719d4c77fe7e8392c3")
    }
  },
  mocha: {},
  compilers: {
    solc: {
      version: "0.8.16"
    }
  }
};
