const assert = require('assert');
const ganache = require('ganache');
const Web3 = require('web3');
const contract = require('../compile-lottery');

const web3 = new Web3(ganache.provider());

let accounts = [];
let lotteryContract;

before(async () => {
    accounts = await web3.eth.getAccounts();
    //console.log(accounts);

    lotteryContract = await new web3.eth.Contract(contract.Lottery.abi)
        .deploy({
            data: contract.Lottery.evm.bytecode.object, arguments: []
        })
        .send({
            from: accounts[0],
            gas: '1000000'
        });
});

describe('Lottery', () => {
    it('deploys a contract', () => {
        assert.ok(lotteryContract.options.address);
    });

    it('account 1 enters', async () => {
        await lotteryContract.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('1', 'ether')
        });

        const players = await lotteryContract.methods.getPlayers().call();
        assert.strictEqual(players.length, 1);
    });

    it('account 2 enters', async () => {
        await lotteryContract.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('1', 'ether')
        });

        const players = await lotteryContract.methods.getPlayers().call();
        assert.strictEqual(players.length, 2);
    });

    it('pick winner only admin', async () => {
        try {
            await lotteryContract.methods.pickWinner().send({
                from: accounts[2],
            });
        }catch (e) {
            assert.ok(e);
        }
    });

    it('pick winner', async () => {
        const playersBeforeWin = await lotteryContract.methods.getPlayers().call();

        await lotteryContract.methods.pickWinner().send({
            from: accounts[0],
        });

        let hasWinner = false;
        for (var p of playersBeforeWin) {
            const b = await web3.eth.getBalance(p);
            if(Number(b) - 999 > 1.8) {
                hasWinner = true;
            }
        }

        assert.ok(hasWinner);

        const players = await lotteryContract.methods.getPlayers().call();
        assert.strictEqual(players.length, 0);
    });
});