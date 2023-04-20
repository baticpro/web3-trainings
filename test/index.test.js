const assert = require('assert');
const ganache = require('ganache');
const Web3 = require('web3');
const contract = require('../compile');

const web3 = new Web3(ganache.provider());

let accounts = [];
let inbox;

const INIT_MESSAGE = 'hello world!!!';

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    //console.log(accounts);

    inbox = await new web3.eth.Contract(contract.Inbox.abi)
        .deploy({
            data: contract.Inbox.evm.bytecode.object, arguments: [INIT_MESSAGE]
        })
        .send({
            from: accounts[0],
            gas: '1000000'
        });
});

describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
    });

    it('correct message', async () => {
        const message = await inbox.methods.message().call();

        assert.strictEqual(message, INIT_MESSAGE);
    });

    it('can change the message', async () => {
        const testingMessage = 'testing message';
        await inbox.methods.setMessage(testingMessage).send({
            from: accounts[0],
        });
        const message = await inbox.methods.message().call();

        assert.strictEqual(message, testingMessage);
    });
});