import React from 'react';

const NFTCard = ({ tokenId, tokenURI, onTransfer }) => {
  const handleTransfer = () => {
    if (onTransfer) {
      onTransfer(tokenId);
    } else {
      console.error('onTransfer is not a function');
    }
  };

  return (
    <div className="nft-card">
      <h3>NFT ID: {tokenId.toString()}</h3>
      <img src={tokenURI} alt={`NFT ${tokenId}`} />
      <button onClick={handleTransfer}>Transfer NFT</button>
    </div>
  );
};

export default NFTCard;
