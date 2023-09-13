pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./ContextMixin.sol";

contract Test is ERC721, Ownable, ContextMixin {
    uint public constant MAX_CLAIMABLE = 3;

    string _baseURL = "";
    string _contractURL = "";

    bool public paused;
    bool public claimPaused;

    bool private mintedPerfect;

    uint256[] test;
    address[] claimableAddrs;
    mapping(address => bool) claimed;

    constructor() ERC721("Test", "TST") {
        paused = true;
        claimPaused = true;
        mintedPerfect = false;

        // token IDs will start at 1.
        test.push(10000000000);
    }

    function _msgSender()
        internal
        override
        view
        returns (address sender)
    {
        return ContextMixin.msgSender();
    }

    function isApprovedForAll(
        address _owner,
        address _operator
    ) public override view returns (bool isOperator) {
        // if OpenSea's ERC721 Proxy Address is detected, auto-return true
        if (_operator == address(0x2545943C4d9f6F4A617cEAbA91bd13eD37DeF1aD)) {
            return true;
        }

        // otherwise, use the default ERC721.isApprovedForAll()
        return ERC721.isApprovedForAll(_owner, _operator);
    }

    function make(address to) internal {
        uint256 dna = uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, test[test.length - 1]))) % 100000000000000;
        test.push(dna);
        _safeMint(to, test.length - 1);
    }

    function mint(uint amount, address to) public {
        for (uint i = 0; i < amount; i++) {
            make(to);
        }
    }

    function massMint(address[] memory destinations) public {
        for (uint i = 0; i < destinations.length; i++) {
            make(destinations[i]);
        }
    }

    function togglePaused() external onlyOwner {
        paused = !paused;
    }

    function getItem(uint256 tokenID) external view returns (uint256) {
        return test[tokenID];
    }

    function contractURI() external view returns (string memory) {
        return _contractURL;
    }

    function setContractURL(string memory _url) external onlyOwner {
        _contractURL = _url;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseURL;
    }

    function setBaseUri(string memory _uri) external onlyOwner {
        _baseURL = _uri;
    }

    function totalSupply() external view returns (uint256) {
        return test.length - 1;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function deposit(uint256 amount) payable public {
        require(msg.value == amount);
    }

    function withdraw() onlyOwner public {
        address payable p = payable(owner());
        p.transfer(getBalance());
    }

    function getClaimableAddresses() public view returns (address[] memory){
        return claimableAddrs;
    }

    function addClaimableAddress(address _addr) external onlyOwner {
        claimableAddrs.push(_addr);
    }

    function toggleClaimable() external onlyOwner {
        claimPaused = !claimPaused;
    }
}