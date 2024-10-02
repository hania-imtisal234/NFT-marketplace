import React, { useState } from 'react';
import './NftForm.css'; 

const NftForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ipfsLink, setIpfsLink] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(ipfsLink);
  };

  return (
    <form className="mint-form" onSubmit={handleSubmit}>
      <h1>Mint Your NFT</h1>
      <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="form-textarea"
        />
      </div>
      <div className="form-group">
        <label>IPFS Image Link:</label>
        <input
          type="url"
          value={ipfsLink}
          onChange={(e) => setIpfsLink(e.target.value)}
          required
          className="form-input"
        />
      </div>
      <button type="submit" className="form-button">Mint NFT</button>
    </form>
  );
};

export default NftForm;
