import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// ABI for the HotPotato contract
const contractABI = [
  "function saveScore(uint256 score) public",
  "function getHighScores() public view returns (tuple(address player, uint256 score)[] memory)",
];

interface BlockchainScoreManagerProps {
  score: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const BlockchainScoreManager = ({ 
  score, 
  onSuccess, 
  onError 
}: BlockchainScoreManagerProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);

  const contractAddress = process.env.NEXT_PUBLIC_POTATO_CONTRACT_ADDRESS || '';

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Check if MetaMask is installed
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          // Request account access
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          
          // Check if any accounts were returned
          if (!accounts || accounts.length === 0) {
            throw new Error('No accounts found. Please create an account in MetaMask and try again.');
          }
          
          setIsConnecting(false);
          return true;
        } catch (requestError: any) {
          // Handle specific MetaMask errors
          if (requestError.code === 4001) {
            throw new Error('MetaMask connection was rejected. Please connect your wallet to continue.');
          } else if (requestError.message && requestError.message.includes('wallet must has at least one account')) {
            throw new Error('No accounts found in MetaMask. Please create an account and try again.');
          } else {
            throw requestError;
          }
        }
      } else {
        throw new Error('MetaMask is not installed. Please install it to use this feature.');
      }
    } catch (error: any) {
      console.error('Error connecting to wallet:', error);
      const errorMessage = error instanceof Error ? error.message : 
                          (error.message ? error.message : 'Unknown error connecting to wallet');
      setError(errorMessage);
      setIsConnecting(false);
      if (onError) onError(error instanceof Error ? error : new Error(errorMessage));
      return false;
    }
  };

  // Save score to local storage
  const saveScoreLocally = () => {
    try {
      // Get existing scores
      const existingScoresJson = localStorage.getItem('hotPotatoHighScores');
      let scores = existingScoresJson ? JSON.parse(existingScoresJson) : [];
      
      // Add new score
      scores.push({
        score,
        timestamp: new Date().toISOString(),
        // Add a random ID to simulate a wallet address
        address: 'local_' + Math.random().toString(36).substring(2, 15)
      });
      
      // Sort scores (highest first)
      scores.sort((a, b) => b.score - a.score);
      
      // Keep only top 10 scores
      scores = scores.slice(0, 10);
      
      // Save back to localStorage
      localStorage.setItem('hotPotatoHighScores', JSON.stringify(scores));
      
      return true;
    } catch (e) {
      console.error('Error saving score locally:', e);
      return false;
    }
  };

  const submitScore = async () => {
    setIsSubmitting(true);
    setError(null);
    setUsedFallback(false);

    try {
      // Connect to wallet first
      const connected = await connectWallet();
      if (!connected) {
        // If wallet connection fails, use fallback
        const savedLocally = saveScoreLocally();
        if (savedLocally) {
          setUsedFallback(true);
          setSuccess(true);
          if (onSuccess) onSuccess();
        }
        return;
      }

      // Create a provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Create contract instance
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Submit the score
      const tx = await contract.saveScore(score);
      await tx.wait();

      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error submitting score:', error);
      setError(error instanceof Error ? error.message : 'Unknown error submitting score');
      
      // Try fallback if blockchain submission fails
      const savedLocally = saveScoreLocally();
      if (savedLocally) {
        setUsedFallback(true);
        setSuccess(true);
        if (onSuccess) onSuccess();
      } else {
        if (onError) onError(error instanceof Error ? error : new Error('Unknown error'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      {error && (
        <div className="bg-red-900 text-white p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {success ? (
        <div className="bg-green-900 text-white p-3 rounded-md mb-4">
          {usedFallback 
            ? "Score saved locally! Blockchain submission was not available."
            : "Score successfully submitted to the blockchain!"}
        </div>
      ) : (
        <div>
        <button
          onClick={submitScore}
          disabled={isConnecting || isSubmitting}
          className={`w-full py-2 rounded-md font-bold ${
            isConnecting || isSubmitting
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-amber-500 hover:bg-amber-400 text-black'
          }`}
        >
          {isConnecting
            ? 'Connecting to Wallet...'
            : isSubmitting
            ? 'Submitting Score...'
            : 'Submit Score to Blockchain'}
        </button>
        <p className="text-xs text-gray-300 mt-2 text-center">
          Note: You need MetaMask installed with at least one account to use this feature.
        </p>
      </div>
      )}
    </div>
  );
};

// Type definition for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
