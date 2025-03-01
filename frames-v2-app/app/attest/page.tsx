"use client";

import { useEffect, useState, useCallback } from "react";
import sdk, { type FrameContext } from "@farcaster/frame-sdk";
import { useAccount, useSendTransaction, useWaitForTransactionReceipt, useConnect, useDisconnect } from "wagmi";
import { config } from "~/components/providers/WagmiProvider";
import { Button } from "~/components/ui/Button";
import { truncateAddress } from "~/lib/truncateAddress";
import Head from "next/head";

// This is a client component, so we can't export metadata directly
// Instead, we'll use the Head component to add the frame metadata
export default function AttestPage() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();
  const { address, isConnected } = useAccount();
  const [randomString, setRandomString] = useState("");
  const [txHash, setTxHash] = useState<string | null>(null);
  
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const { sendTransaction, error: sendTxError, isError: isSendTxError, isPending: isSendTxPending } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
  });

  // Initialize Farcaster Frame SDK
  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context);
      sdk.actions.ready();
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  // Generate a random 12-character string
  useEffect(() => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < 12; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    setRandomString(result);
  }, []);

  // Function to post to smart contract
  const attestToContract = useCallback(() => {
    if (!isConnected || !address) return;
    
    // Example smart contract interaction
    // Replace with your actual contract address and data
    sendTransaction(
      {
        to: "0x4bBFD120d9f352A0BEd7a014bd67913a2007a878", // Replace with your contract address
        data: "0x9846cd9e" + randomString, // Replace with your actual contract method and data
      },
      {
        onSuccess: (hash) => {
          setTxHash(hash);
        },
      }
    );
  }, [sendTransaction, isConnected, address, randomString]);

  const renderError = (error: Error | null) => {
    if (!error) return null;
    return <div className="text-red-500 text-xs mt-1">{error.message}</div>;
  };

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen flex flex-col p-4">
      {/* Add frame metadata using Head component */}
      <Head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://frames-v2-demo.vercel.app/api/og?title=Attest" />
        <meta property="fc:frame:button:1" content="Connect Wallet" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta property="fc:frame:post_url" content="https://frames-v2-demo.vercel.app/api/attest" />
      </Head>
      <div className="w-[300px] mx-auto py-4 px-2">
        <h1 className="text-2xl font-bold text-center mb-4">Attestation Page</h1>

        <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Your Information</h2>
          
          {address ? (
            <div className="mb-4">
              <div className="text-sm font-semibold">Wallet Address:</div>
              <div className="font-mono text-xs break-all">{truncateAddress(address)}</div>
            </div>
          ) : (
            <div className="mb-4">
              <div className="text-yellow-500 mb-2">Wallet not connected</div>
              <Button onClick={() => isConnected ? disconnect() : connect({ connector: config.connectors[0] })}>
                {isConnected ? "Disconnect" : "Connect Wallet"}
              </Button>
            </div>
          )}

          <div className="mb-4">
            <div className="text-sm font-semibold">Random String:</div>
            <div className="font-mono text-xs break-all bg-gray-200 dark:bg-gray-700 p-2 rounded">{randomString}</div>
          </div>
        </div>

        <div className="mb-6">
          <Button 
            onClick={attestToContract} 
            disabled={!isConnected || isSendTxPending} 
            isLoading={isSendTxPending}
          >
            Attest to Smart Contract
          </Button>
          {isSendTxError && renderError(sendTxError)}
        </div>

        {txHash && (
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h3 className="font-bold mb-2">Transaction Status</h3>
            <div className="text-xs">
              <div className="mb-1">Hash: {truncateAddress(txHash)}</div>
              <div className="mb-1">Status: 
                {isConfirming ? (
                  <span className="text-yellow-500">Confirming...</span>
                ) : isConfirmed ? (
                  <span className="text-green-500">Confirmed!</span>
                ) : (
                  <span className="text-blue-500">Pending</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
