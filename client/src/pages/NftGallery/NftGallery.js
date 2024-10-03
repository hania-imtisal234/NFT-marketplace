import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MyNFT from '../../contracts/MyNFT.json';
import './NftGallery.css';
import NFTCard from '../../components/NftCard/NFTcard';
import MintForm from '../../components/NftForm/NftForm';

const NftGallery = () => {
  const [account, setAccount] = useState('');
  const [mintedTokens, setMintedTokens] = useState([]);
  const [tokenURIs, setTokenURIs] = useState([]);

  useEffect(() => {
    const requestAccount = async () => {
      if (!window.ethereum) {
        alert('MetaMask is required to mint the NFT');
        return;
      }

      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        await fetchMintedTokens(accounts[0]); // Fetch tokens for the connected account
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
        alert('Failed to connect MetaMask. Check console for details.');
      }
    };

    requestAccount();
  }, []);

  // Fetch minted tokens for the user and set them in the state
  const fetchMintedTokens = async (user) => {
    if (!window.ethereum) {
      alert('MetaMask is required to fetch minted tokens');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractAddress = '0x645bb62Ca2735445efe1941e8Aa4b3aBB248327b';
      const contract = new ethers.Contract(contractAddress, MyNFT.abi, signer);

      // Fetch the list of minted tokens for the current user
      const tokens = await contract.getMintedTokens(user);
      setMintedTokens(tokens);

      // Fetch the token URIs for the minted tokens
      const uris = await Promise.all(tokens.map(async (tokenId) => {
        const tokenURI = await contract.tokenURI(tokenId);
        return tokenURI;
      }));

      setTokenURIs(uris);
    } catch (error) {
      console.error('Error fetching minted tokens:', error);
      alert('Failed to fetch minted tokens. Check console for details.');
    }
  };

  // Handle NFT minting
  const handleMintSubmit = async (ipfsLink) => {
    await mintNFT(ipfsLink);
  };

  const mintNFT = async (tokenURI) => {
    if (!window.ethereum) {
      alert('MetaMask is required to mint the NFT');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractAddress = '0x645bb62Ca2735445efe1941e8Aa4b3aBB248327b';
      const contract = new ethers.Contract(contractAddress, MyNFT.abi, signer);

      const tx = await contract.mintNFT(await signer.getAddress(), tokenURI);
      await tx.wait();

      alert('NFT successfully minted!');
      await fetchMintedTokens(await signer.getAddress()); // Refresh the tokens after minting
    } catch (error) {
      console.error('Error minting NFT:', error);
      alert('Failed to mint NFT. Check console for details.');
    }
  };

  // Handle NFT transfer
  const handleTransfer = async (tokenId) => {
    if (!window.ethereum) {
      alert('MetaMask is required to transfer the NFT');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractAddress = '0x645bb62Ca2735445efe1941e8Aa4b3aBB248327b';
      const contract = new ethers.Contract(contractAddress, MyNFT.abi, signer);

      const toAddress = prompt("Enter the address to transfer the NFT:");
      if (toAddress) {
        const tx = await contract.transferNFT(toAddress, tokenId);
        await tx.wait();
        alert('NFT successfully transferred!');

        // Refresh the token list for the current owner
        await fetchMintedTokens(await signer.getAddress());
        // Fetch tokens for the new owner to reflect updates if necessary
       // await fetchMintedTokens(toAddress);
    
      }
    } catch (error) {
      console.error('Error transferring NFT:', error);
      alert('Failed to transfer NFT. Check console for details.');
    }
  };

  return (
    <div className="mint-nft-form-container">
      <h1>NFT Marketplace</h1>
      <MintForm onSubmit={handleMintSubmit} />
      <h2>Minted Tokens:</h2>
      <div className="nft-gallery">
        {mintedTokens.map((tokenId, index) => (
          <NFTCard
            key={tokenId.toString()}
            tokenId={tokenId}
            tokenURI={tokenURIs[index]}
            onTransfer={handleTransfer}
          />
        ))}
      </div>
    </div>
  );
};

export default NftGallery;
