const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
require('dotenv').config();
const contract = require('./compile');

const apiKey = process.env['INFURA_API_KEY'];
const phrase = process.env['MNEMONIK_PHRASE'];

// 0xb8a590569d6FEdCeAdfB71eA0d2aE5da5C3c5c1A


const provider = new HDWalletProvider({
    mnemonic: phrase,
    providerOrUrl: 'https://sepolia.infura.io/v3/' + apiKey
});
const web3 = new Web3(provider);

(async () => {
    const accounts = await web3.eth.getAccounts();

    console.log(await web3.eth.getBalance(accounts[0]));

    let inbox = await new web3.eth.Contract(contract.Inbox.abi)
        .deploy({
            data: contract.Inbox.evm.bytecode.object, arguments: ['hello world']
        })
        .send({
            from: accounts[0],
            gas: '1000000'
        });

    //console.log(inbox);
    // console.log(await  inbox.estimateGas() );
})();