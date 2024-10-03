import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import MyNFT from '../../contracts/MyNFT.json'; // ABI of your contract

const contractAddress = '0x645bb62Ca2735445efe1941e8Aa4b3aBB248327b'; // Replace with your deployed contract address

const NftMarketplace = () => {
  const [allMintedTokens, setAllMintedTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllMintedTokens = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(contractAddress, MyNFT.abi, signer);
          
          // Fetch all minted NFTs
          const tokens = await contract.getAllMintedTokens();
          
          // Convert BigNumber tokens to regular strings
          const formattedTokens = tokens.map(token => token.toString());
          setAllMintedTokens(formattedTokens);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching all minted NFTs:", error);
          setLoading(false);
        }
      } else {
        console.error("Ethereum object not found. Please install MetaMask.");
        setLoading(false);
      }
    };

    loadAllMintedTokens();
  }, []);

  return (
    <div>
      <h1>All Minted NFTs Collection</h1>
      {loading ? (
        <p>Loading NFTs...</p>
      ) : allMintedTokens.length > 0 ? (
        <div className="nft-grid">
          {allMintedTokens.map((tokenId) => (
            <NFTCard key={tokenId} tokenId={tokenId} />
          ))}
        </div>
      ) : (
        <p>No NFTs minted yet.</p>
      )}
    </div>
  );
};

// NFTCard component to display each NFT
const NFTCard = ({ tokenId }) => {
  const [tokenURI, setTokenURI] = useState('');

  useEffect(() => {
    const loadTokenURI = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(contractAddress, MyNFT.abi, signer);
          
          // Fetch the token URI for the tokenId
          const uri = await contract.tokenURI(tokenId);
          setTokenURI(uri);
        } catch (error) {
          console.error("Error fetching token URI:", error);
        }
      }
    };

    loadTokenURI();
  }, [tokenId]);

  return (
    <div className="nft-card">
      <h3>NFT #{tokenId}</h3>
      {tokenURI ? (
        <img src={tokenURI} alt={`NFT ${tokenId}`} style={{ width: '200px', height: '200px' }} />
      ) : (
        <p>Loading NFT image...</p>
      )}
    </div>
  );
};

export default NftMarketplace;
