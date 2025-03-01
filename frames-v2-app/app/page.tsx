"use client";

import dynamic from "next/dynamic";
import App from "../components/game/App";

const Demo = dynamic(() => import("~/components/Demo"), {
    ssr: false,
});

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col p-4">
            <Demo />
            <App />
        </main>
    );
}
