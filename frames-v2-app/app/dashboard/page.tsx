"use client";

import { useEffect, useState } from 'react';
import sdk from '@farcaster/frame-sdk';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { Potato } from '../../models/potato';
import { PotatoProvider } from '../../components/providers/PotatoProvider';
import PotatoSend from '../../components/PotatoSend';
import '../../styles/styles.css';
import HotPotatoJson from '../../../foundry/out/HotPotato.sol/HotPotato.json';
const abi = HotPotatoJson.abi;

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your contract address

export default function Home() {
  const [createdPotatoes, setCreatedPotatoes] = useState<Potato[]>([]);
  const [heldPotatoes, setHeldPotatoes] = useState<Potato[]>([]);
  const [user, setUser] = useState<string>('');
  const [fid, setFid] = useState<number>(0);
  const [receivers, setReceivers] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('holding');
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<any | null>(null);
  const [following, setFollowing] = useState<{ username: string; fid: number }[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (user) {
      // Fetch user's potatoes
      axios.get(`/api/user-potatoes?user=${user}`).then((response) => {
        setCreatedPotatoes(response.data.createdPotatoes);
        setHeldPotatoes(response.data.heldPotatoes);
      });

      axios.get(`/api/user-fid?username=${user}`).then((response) => {
        setFid(response.data);
        return axios.get(`/api/following?fid=${response.data}`);
      }).then((response) => {
        setFollowing(response.data);
        console.log(response.data);
      }).catch((error) => {
        console.error('Error fetching data:', error);
      });
      console.log(fid);
    }
  }, [user, fid]);

  useEffect(() => {
    const load = async () => {
      const ctx = await sdk.context;
      setContext(ctx);
      sdk.actions.ready();
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  useEffect(() => {
    if (context && context.user && context.user.username) {
      setUser(context.user.username);
    }
  }, [context]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  const farmPotato = () => {
    // Navigate to the potato game instead of farming a potato
    router.push('/potato');
  };

  // const sendPotato = async (potatoId: string) => {
  //   try {
  //     const receiver = receivers[potatoId];
  //     const response = await axios.post('/api/send', { potatoId, sender: user, receiver });
  //     setHeldPotatoes(heldPotatoes.map((p) => (p.id === potatoId ? response.data : p)));
  //     setError(null); // Clear any previous errors
  //   } catch (error) {
  //     if (axios.isAxiosError(error) && error.response) {
  //       setError(error.response.data.error);
  //     } else {
  //       console.error('Error sending potato:', error);
  //     }
  //   }
  // };

  const handleReceiverChange = (potatoId: string, value: string) => {
    setReceivers((prevReceivers) => ({
      ...prevReceivers,
      [potatoId]: value,
    }));
  };

  const passPotato = async (senderFid: number, senderAddress: string, receiverFid: number, receiverAddress: string) => {
    try {
      const ethereum = (window as any).ethereum;
      if (!ethereum) {
        alert('Please install MetaMask!');
        return;
      }
      await ethereum.request({ method: 'eth_requestAccounts' });

      // Create a provider and signer
      const provider = new Web3Provider(ethereum);
      const signer = provider.getSigner();

      // Create a contract instance
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer as any);
      receiverAddress = "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720";
      senderAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
      receiverFid = 1;
      console.log('Passing potato:', senderFid, senderAddress, receiverFid, receiverAddress);
      // Call the passPotato function
      const tx = await contract.passPotato(senderFid, senderAddress, receiverFid, receiverAddress);

      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      console.log('Transaction Hash:', receipt.transactionHash);
      alert('Potato passed successfully!');
    } catch (error) {
      console.error('Error passing potato:', error);
      alert('Failed to pass potato');
    }
  };

  return (
    <div className="container">
      <PotatoProvider>
        <h1>Hot Potato Game</h1>
        {user && (
          <>
            <input
              type="text"
              placeholder="Enter your name"
              value={user}
              readOnly
              className="user-input"
            />
            <button onClick={farmPotato} className="farm-button">Play Hot Potato Game</button>
            {error && <p className="error">{error}</p>}
            <div className="tabs">
              <div
                className={`tab ${activeTab === 'holding' ? 'active' : ''}`}
                onClick={() => setActiveTab('holding')}
              >
                Potatoes You Are Holding
              </div>
              <div
                className={`tab ${activeTab === 'created' ? 'active' : ''}`}
                onClick={() => setActiveTab('created')}
              >
                Potatoes You Have Created
              </div>
            </div>
            {activeTab === 'holding' && (
              <div>
                <h2>Potatoes You Are Holding</h2>
                <div>
                  {heldPotatoes.map((potato) => (
                    <PotatoSend
                      key={potato.id}
                      potato={potato}
                      receiver={receivers[potato.id] || ''}
                      onReceiverChange={handleReceiverChange}
                      onSend={() => passPotato(fid, user, parseInt(receivers[potato.id]), '')}
                      isHolding={true}
                      following={following}
                      onButtonClick={() => void 0}
                    />
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'created' && (
              <div>
                <h2>Potatoes You Have Created</h2>
                <div>
                  {createdPotatoes.map((potato) => (
                    <PotatoSend key={potato.id} potato={potato} receiver="" onReceiverChange={() => {}} onSend={() => {}} isHolding={false} following={[]} onButtonClick={() => void 0}/>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </PotatoProvider>
    </div>
  );
}