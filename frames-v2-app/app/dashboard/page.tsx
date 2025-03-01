"use client";

import { useEffect, useState } from 'react';
import sdk, { type FrameContext } from '@farcaster/frame-sdk';
import axios from 'axios';
import { Potato } from '../../models/potato';
import { PotatoProvider } from '../../components/providers/PotatoProvider';
import PotatoSend from '../../components/PotatoSend';
import '../../styles/styles.css';

const BASE_RPC_URL = "https://base-rpc-url"; // Replace with the actual RPC URL for Base

export default function Home() {
  const [createdPotatoes, setCreatedPotatoes] = useState<Potato[]>([]);
  const [heldPotatoes, setHeldPotatoes] = useState<Potato[]>([]);
  const [user, setUser] = useState<string>('');
  const [fid, setFid] = useState<Number>(0);
  const [receivers, setReceivers] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('holding');
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext | null>(null);
  const [following, setFollowing] = useState<{ username: string; fid: number }[]>([]);

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
  }, [user]);

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

  const farmPotato = async () => {
    const response = await axios.post('/api/farm', { creator: user });
    setCreatedPotatoes([...createdPotatoes, response.data]);
    setHeldPotatoes([...heldPotatoes, response.data]);
  };

  const sendPotato = async (potatoId: string) => {
    try {
      const receiver = receivers[potatoId];
      const response = await axios.post('/api/send', { potatoId, sender: user, receiver });
      setHeldPotatoes(heldPotatoes.map((p) => (p.id === potatoId ? response.data : p)));
      setError(null); // Clear any previous errors
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.error);
      } else {
        console.error('Error sending potato:', error);
      }
    }
  };

  const handleReceiverChange = (potatoId: string, value: string) => {
    setReceivers((prevReceivers) => ({
      ...prevReceivers,
      [potatoId]: value,
    }));
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
            <button onClick={farmPotato} className="farm-button">Farm Potato</button>
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
                      onSend={() => sendPotato(potato.id)}
                      isHolding
                      following={following}
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
                    <PotatoSend key={potato.id} potato={potato} receiver="" onReceiverChange={() => {}} onSend={() => {}} isHolding={false} following={[]} />
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