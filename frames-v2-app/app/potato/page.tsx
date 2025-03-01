"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useCallback } from "react";
import sdk from "@farcaster/frame-sdk";

// Use dynamic import to avoid SSR issues with Phaser
const PotatoGame = dynamic(() => import("~/components/potato/PotatoGame"), {
    ssr: false,
});

export default function PotatoPage() {
    const [isSDKLoaded, setIsSDKLoaded] = useState(false);
    const [context, setContext] = useState<any>();

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

    const close = useCallback(() => {
        sdk.actions.close();
    }, []);

    if (!isSDKLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="flex flex-col items-center mb-4">
                <h1 className="text-2xl font-bold mb-2">Hot Potato Game</h1>
                <p className="text-xl mb-4">Click the potato to make it bounce!</p>
                <button 
                    onClick={close}
                    className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                    Close Frame
                </button>
            </div>
            <div className="w-full max-w-[400px]">
                <PotatoGame />
            </div>
        </main>
    );
}
