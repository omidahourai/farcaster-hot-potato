import React, { useState } from 'react';
import { Potato } from '@/models/potato';

interface CardProps {
  potato: Potato;
  receiver: string;
  onReceiverChange: (potatoId: string, value: string) => void;
  onSend: () => void;
  isHolding: boolean;
  following: { username: string; fid: number }[];
  onButtonClick: () => void; // Add this prop for the button click handler
}

const PotatoSend: React.FC<CardProps> = ({ potato, receiver, onReceiverChange, onSend, isHolding, following, onButtonClick }) => {
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [filteredFollowers, setFilteredFollowers] = useState(following);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onReceiverChange(potato.id, value);
    setDropdownVisible(true);

    // Filter followers based on input value
    const filtered = following.filter((user) =>
      user.username.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredFollowers(filtered);
  };

  const handleReceiverChange = (value: string) => {
    onReceiverChange(potato.id, value);
    setDropdownVisible(false);
  };

  return (
    <div className="card">
    <div className="card-header">
      <h3>{potato.creator}'s Potato</h3>
      <img
        src="/potato.png" // Path to the potato image in the public directory
        alt="Potato"
        className="potato-button"
        onClick={onButtonClick}
      />
    </div>
      {isHolding && (
        <div className="dropdown">
          <input
            type="text"
            placeholder="Select a receiver"
            value={receiver}
            onChange={handleInputChange}
            className="dropdown-input"
            onFocus={() => setDropdownVisible(true)}
            onBlur={() => setTimeout(() => setDropdownVisible(false), 200)} // Delay to allow click event
          />
          {dropdownVisible && filteredFollowers.length > 0 && (
            <div className="dropdown-content">
              {filteredFollowers.map((user: { username: string; fid: number }) => (
                <div
                  key={user.fid}
                  className="dropdown-item"
                  onClick={() => handleReceiverChange(user.username)}
                >
                  {user.username}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <button onClick={onSend} className="send-button">Send Potato</button>
    </div>
  );
};

export default PotatoSend;