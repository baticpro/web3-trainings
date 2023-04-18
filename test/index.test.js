const assert = require('assert');
const ganache = require('ganache');
const Web3 = require('web3');
const contract = require('../compile');

const web3 = new Web3(ganache.provider());

let accounts = [];
let inbox;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    console.log(accounts);

    inbox = await new web3.eth.Contract(contract.Inbox.abi)
        .deploy({
            data: contract.Inbox.evm.bytecode.object, arguments: ['hello world!!!']
            })
        .send({
            from: accounts[0],
            gas: '1000000'
        });
});

describe('Inbox', () => {
   it('deploys a contract', () => {

   });
});