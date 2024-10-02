// import { useState, useEffect } from 'react';
// import { ethers } from 'ethers';
// import MyNFT from './contracts/MyNFT.json'; 
// import './MintNFTForm.css'; 

// const MintNFTForm = () => {
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [ipfsLink, setIpfsLink] = useState('');
//   const [account, setAccount] = useState('');

  
//   useEffect(() => {
//     const requestAccount = async () => {
//       if (!window.ethereum) {
//         alert('MetaMask is required to mint the NFT');
//         return;
//       }

//       try {
//         const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//         setAccount(accounts[0]); 
//         console.log('Connected Account:', accounts[0]); 
        
//       } catch (error) {
//         console.error('Error connecting to MetaMask:', error);
//         alert('Failed to connect MetaMask. Check console for details.');
//       }
//     };

//     requestAccount();
//   }, []); 

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await mintNFT(ipfsLink);
//   };

//   const mintNFT = async (tokenURI) => {
//     if (!window.ethereum) {
//       alert('MetaMask is required to mint the NFT');
//       return;
//     }
  
//     try {
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const signer = provider.getSigner();
//       console.log('Signer:', await signer.getAddress()); // Log the signer address
  
//       // Replace with your contract's deployed address
//       const contractAddress = '0x6DA0F1BcdA02179858aD33f04A45a4316677fC27';
//       const contract = new ethers.Contract(contractAddress, MyNFT.abi, signer);
  
//       // Call the mint function
//       const tx = await contract.mintNFT(await signer.getAddress(), tokenURI);
//       await tx.wait();
  
//       alert('NFT successfully minted!');
//     } catch (error) {
//       console.error('Error minting NFT:', error);
//       alert('Failed to mint NFT. Check console for details.');
//     }
//   };
  
//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <label>Name:</label>
//         <input
//           type="text"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//         />
//       </div>
//       <div>
//         <label>Description:</label>
//         <textarea
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           required
//         />
//       </div>
//       <div>
//         <label>IPFS Image Link:</label>
//         <input
//           type="url"
//           value={ipfsLink}
//           onChange={(e) => setIpfsLink(e.target.value)}
//           required
//         />
//       </div>
//       <button type="submit">Mint NFT</button>
//     </form>
//   );
// };

// export default MintNFTForm;
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MyNFT from './contracts/MyNFT.json'; 
import './MintNFTForm.css'; 

const MintNFTForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ipfsLink, setIpfsLink] = useState('');
  const [account, setAccount] = useState('');
  const [mintedTokens, setMintedTokens] = useState([]);
  const [tokenURIs, setTokenURIs] = useState([]); // To store the token URIs for images

  useEffect(() => {
    const requestAccount = async () => {
      if (!window.ethereum) {
        alert('MetaMask is required to mint the NFT');
        return;
      }

      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]); 
        console.log('Connected Account:', accounts[0]); 
        await fetchMintedTokens(accounts[0]); // Fetch minted tokens for the connected account
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
        alert('Failed to connect MetaMask. Check console for details.');
      }
    };

    requestAccount();
  }, []); 

  const fetchMintedTokens = async (user) => {
    if (!window.ethereum) {
      alert('MetaMask is required to fetch minted tokens');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractAddress = '0xA63B385045a7c170e5183Cec047dBFDC519073d9';
      const contract = new ethers.Contract(contractAddress, MyNFT.abi, signer);

      const tokens = await contract.getMintedTokens(user);
      setMintedTokens(tokens);
      
      // Fetch token URIs for the minted tokens
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      console.log('Signer:', await signer.getAddress()); // Log the signer address
      const contractAddress = '0xA63B385045a7c170e5183Cec047dBFDC519073d9'; // Update with your contract address
      const contract = new ethers.Contract(contractAddress, MyNFT.abi, signer);

      // Call the mint function
      const tx = await contract.mintNFT(await signer.getAddress(), tokenURI);
      await tx.wait();

      alert('NFT successfully minted!');
      await fetchMintedTokens(await signer.getAddress()); // Refresh the minted tokens after minting
    } catch (error) {
      console.error('Error minting NFT:', error);
      alert('Failed to mint NFT. Check console for details.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>IPFS Image Link:</label>
          <input
            type="url"
            value={ipfsLink}
            onChange={(e) => setIpfsLink(e.target.value)}
            required
          />
        </div>
        <button type="submit">Mint NFT</button>
      </form>
      <h2>Minted Tokens:</h2>
      <ul>
        {mintedTokens.map((tokenId, index) => (
          <li key={tokenId.toString()}>
            Token ID: {tokenId.toString()} <br />
            <img src={tokenURIs[index]} alt={`NFT ${tokenId}`} style={{ width: '200px', height: 'auto' }} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MintNFTForm;
