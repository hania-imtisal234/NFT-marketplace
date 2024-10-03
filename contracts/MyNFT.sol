//SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

// contract MyNFT is ERC721URIStorage, Ownable {
//     uint256 private _tokenIdCounter;
 
//     // Mapping to track minted tokens for each user
//     mapping(address => uint256[]) private userMintedTokens;
    
   
//     constructor() ERC721("MyNFT", "NFT") Ownable() {
//         _tokenIdCounter = 0; 
//     }

//     function mintNFT(address recipient, string memory tokenURI) public returns (uint256) {
//         _tokenIdCounter++;
//         uint256 newItemId = _tokenIdCounter;

//         _mint(recipient, newItemId);
//         _setTokenURI(newItemId, tokenURI);
//         userMintedTokens[recipient].push(newItemId);

//         return newItemId;
//     }
    
//     // Function to get all minted tokens for a user
//     function getMintedTokens(address user) public view returns (uint256[] memory) {
//         return userMintedTokens[user];
//     }

     
//      function transferNFT(address to, uint256 tokenId) public {
//     require(_isApprovedOrOwner(msg.sender, tokenId), "Caller is not owner nor approved");
    
//     // Remove the token from the current owner's list
//     _removeTokenFromUserMintedTokens(msg.sender, tokenId);
    
//     // Transfer the token
//     safeTransferFrom(msg.sender, to, tokenId);
    
//     // Add the token to the new owner's list if they don't already own it
//     userMintedTokens[to].push(tokenId);
// }

//  function _removeTokenFromUserMintedTokens(address user, uint256 tokenId) internal {
//     uint256[] storage tokens = userMintedTokens[user];
//     for (uint256 i = 0; i < tokens.length; i++) {
//         if (tokens[i] == tokenId) {
//             // Replace the token to remove it
//             tokens[i] = tokens[tokens.length - 1];
//             tokens.pop(); // Remove the last element (which is now a duplicate)
//             break;
//         }
//     }
// }
// }

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
 
    // Mapping to track minted tokens for each user
    mapping(address => uint256[]) private userMintedTokens;
    
    // Array to track all minted tokens globally
    uint256[] private allMintedTokens;

    constructor() ERC721("MyNFT", "NFT") Ownable() {
        _tokenIdCounter = 0; 
    }

    // Minting function
    function mintNFT(address recipient, string memory tokenURI) public returns (uint256) {
        _tokenIdCounter++;
        uint256 newItemId = _tokenIdCounter;

        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        // Track minted tokens for the recipient
        userMintedTokens[recipient].push(newItemId);

        // Track all minted tokens
        allMintedTokens.push(newItemId);

        return newItemId;
    }

    // Function to get all minted tokens for a user
    function getMintedTokens(address user) public view returns (uint256[] memory) {
        return userMintedTokens[user];
    }

    // Function to transfer NFTs
    function transferNFT(address to, uint256 tokenId) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Caller is not owner nor approved");

        // Remove the token from the current owner's list
        _removeTokenFromUserMintedTokens(msg.sender, tokenId);

        // Transfer the token
        safeTransferFrom(msg.sender, to, tokenId);

        // Add the token to the new owner's list
        userMintedTokens[to].push(tokenId);
    }

    // Internal function to remove a token from the user's minted list
    function _removeTokenFromUserMintedTokens(address user, uint256 tokenId) internal {
        uint256[] storage tokens = userMintedTokens[user];
        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i] == tokenId) {
                tokens[i] = tokens[tokens.length - 1];
                tokens.pop(); // Remove the last element
                break;
            }
        }
    }

    // New function to get all minted tokens globally
    function getAllMintedTokens() public view returns (uint256[] memory) {
        return allMintedTokens;
    }
}
