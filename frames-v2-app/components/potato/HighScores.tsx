import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// ABI for the HotPotato contract
const contractABI = [
  "function getHighScores() public view returns (tuple(address player, uint256 score)[] memory)",
];

interface HighScore {
  player: string;
  score: number;
  isLocal?: boolean;
}

interface HighScoresProps {
  maxScores?: number;
  showLocal?: boolean;
}

export const HighScores = ({ 
  maxScores = 10,
  showLocal = true
}: HighScoresProps) => {
  const [scores, setScores] = useState<HighScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const contractAddress = process.env.NEXT_PUBLIC_POTATO_CONTRACT_ADDRESS || '';

  // Format address for display
  const formatAddress = (address: string) => {
    if (address.startsWith('local_')) {
      return 'Local Player';
    }
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Get local high scores
  const getLocalScores = (): HighScore[] => {
    try {
      const localScoresJson = localStorage.getItem('hotPotatoHighScores');
      if (!localScoresJson) return [];
      
      const localScores = JSON.parse(localScoresJson);
      return localScores.map((score: any) => ({
        player: score.address,
        score: score.score,
        isLocal: true
      }));
    } catch (e) {
      console.error('Error getting local scores:', e);
      return [];
    }
  };

  // Load scores from blockchain and local storage
  const loadScores = async () => {
    setIsLoading(true);
    setError(null);
    
    let combinedScores: HighScore[] = [];
    
    // Get local scores if enabled
    if (showLocal) {
      const localScores = getLocalScores();
      combinedScores = [...localScores];
    }
    
    // Try to get blockchain scores
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new (ethers as any).providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        
        const blockchainScores = await contract.getHighScores();
        
        // Add blockchain scores to combined scores
        blockchainScores.forEach((score: any) => {
          combinedScores.push({
            player: score.player,
            score: score.score.toNumber(),
            isLocal: false
          });
        });
      }
    } catch (e) {
      console.error('Error loading blockchain scores:', e);
      // Don't set error if we have local scores
      if (combinedScores.length === 0) {
        setError('Could not load blockchain scores. Make sure you have MetaMask installed.');
      }
    }
    
    // Sort combined scores (highest first)
    combinedScores.sort((a, b) => b.score - a.score);
    
    // Limit to maxScores
    combinedScores = combinedScores.slice(0, maxScores);
    
    setScores(combinedScores);
    setIsLoading(false);
  };

  useEffect(() => {
    loadScores();
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4 text-center">High Scores</h2>
      
      {isLoading ? (
        <div className="text-center py-4">Loading scores...</div>
      ) : error ? (
        <div className="bg-red-900 text-white p-3 rounded-md mb-4">
          {error}
        </div>
      ) : scores.length === 0 ? (
        <div className="text-center py-4">No scores yet. Be the first!</div>
      ) : (
        <div className="bg-[#231830] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-2 px-4 text-left">#</th>
                <th className="py-2 px-4 text-left">Player</th>
                <th className="py-2 px-4 text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, index) => (
                <tr 
                  key={`${score.player}-${index}`}
                  className={`border-b border-gray-700 ${score.isLocal ? 'bg-amber-900 bg-opacity-20' : ''}`}
                >
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">
                    {formatAddress(score.player)}
                    {score.isLocal && (
                      <span className="ml-2 text-xs bg-amber-500 text-black px-1 rounded">Local</span>
                    )}
                  </td>
                  <td className="py-2 px-4 text-right font-bold">{score.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-4 text-center">
        <button 
          onClick={loadScores}
          className="px-4 py-2 bg-[#17101F] text-white text-sm rounded-md hover:bg-[#231830] transition-colors border border-amber-500"
        >
          Refresh Scores
        </button>
      </div>
    </div>
  );
};
