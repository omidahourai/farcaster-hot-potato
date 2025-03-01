"use client";

import dynamic from "next/dynamic";

// Use dynamic import to avoid SSR issues with Phaser
const PotatoGame = dynamic(() => import("~/components/potato/PotatoGame"), {
    ssr: false,
});

export default function PotatoPage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold mb-4">Hot Potato!</h1>
            <p className="text-xl mb-4">Click the potato to make it bounce</p>
            <div className="w-full max-w-[400px]">
                <PotatoGame />
            </div>
        </main>
    );
}
