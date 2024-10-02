// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
 
    // Mapping to track minted tokens for each user
    mapping(address => uint256[]) private userMintedTokens;
    
    // Constructor that initializes the ERC721 contract and sets the owner
    constructor() ERC721("MyNFT", "NFT") Ownable() {
        _tokenIdCounter = 0; 
    }

    function mintNFT(address recipient, string memory tokenURI) public onlyOwner returns (uint256) {
        _tokenIdCounter++;
        uint256 newItemId = _tokenIdCounter;

        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        userMintedTokens[recipient].push(newItemId);

        return newItemId;
    }
    
    // Function to get all minted tokens for a user
    function getMintedTokens(address user) public view returns (uint256[] memory) {
        return userMintedTokens[user];
    }
}

