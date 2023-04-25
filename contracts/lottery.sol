pragma solidity >=0.7.0 <0.9.0;

contract Lottery {
    address public manager;
    address payable[] public players;

    constructor() {
        manager = msg.sender;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function enter() public payable {
        require(msg.value > 0.1 ether, 'not enough ether');

        players.push(payable(msg.sender));
    }

    function generateRandomIndex() public onlyManager view returns (uint256) {
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % players.length;
        return randomNumber;
    }

    function pickWinner() public onlyManager {
        uint index = generateRandomIndex();
        players[index].transfer(address(this).balance);
        players = new address payable[](0);
    }

    modifier onlyManager() {
        require(msg.sender == manager, 'only admin can do this');
        _;
    }
}