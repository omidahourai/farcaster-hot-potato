"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PassPotatoPage() {
    const [score, setScore] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Get the score from localStorage if it exists
        const savedScore = localStorage.getItem('potatoGameScore');
        if (savedScore) {
            setScore(parseInt(savedScore, 10));
        }
    }, []);

    const goToDashboard = () => {
        router.push('/dashboard');
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#17101F] text-white">
            <div className="max-w-md w-full bg-[#342841] p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-6 text-center">Pass the Potato!</h1>
                
                {score !== null && (
                    <p className="text-xl mb-6 text-center">
                        Your score: <span className="font-bold text-amber-400">{score}</span>
                    </p>
                )}
                
                <p className="text-lg mb-6 text-center">
                    Your score has been saved! Now it's time to pass the hot potato to someone else.
                </p>
                
                <div className="flex justify-center">
                    <button 
                        onClick={goToDashboard}
                        className="px-6 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition-colors"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </main>
    );
}
