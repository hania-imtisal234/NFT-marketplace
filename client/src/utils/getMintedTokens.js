const Web3 = require('web3');
const contractABI = require('../contracts/MyNFT.json'); // Replace with the actual path to your contract's ABI JSON file

async function getMintedTokens(userAddress) {
    const web3 = new Web3('http://localhost:8545');

    // Get the contract instance
    const contractAddress = '0x6DA0F1BcdA02179858aD33f04A45a4316677fC27';
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    try {
        const tokenIds = await contract.methods.getMintedTokens(userAddress).call();

        // Call the contract's tokenURI function for each token and store the results
        const tokenUris = [];
        for (const tokenId of tokenIds) {
            const tokenUri = await contract.methods.tokenURI(tokenId).call();

            // Fetch the image URL from the token's JSON
            const response = await fetch(tokenUri);
            const data = await response.json();
            const imageUrl = data.image;

            tokenUris.push({ uri: tokenUri, image: imageUrl });
        }

        // Return the array of token URIs and image URLs
        return tokenUris;
    } catch (error) {
        console.error('Error retrieving minted tokens:', error);
        return [];
    }
}

// Usage example

export default getMintedTokens;