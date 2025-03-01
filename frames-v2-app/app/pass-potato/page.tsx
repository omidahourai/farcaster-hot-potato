"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { BlockchainScoreManager } from '@/components/potato/BlockchainScoreManager';
import { HighScores } from '@/components/potato/HighScores';

export default function PassPotatoPage() {
    const [score, setScore] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Get the score from localStorage if it exists
        const savedScore = localStorage.getItem('potatoGameScore');
        if (savedScore) {
            setScore(parseInt(savedScore, 10));
        }
        setIsLoading(false);
    }, []);

    const goToDashboard = () => {
        router.push('/dashboard');
    };

    const playAgain = () => {
        router.push('/potato');
    };

    if (isLoading) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#17101F] text-white">
                <div className="text-2xl">Loading...</div>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#17101F] text-white">
            <div className="max-w-xl w-full bg-[#342841] p-8 rounded-lg shadow-lg">
                <div className="flex justify-center mb-4">
                    <div className="relative w-20 h-20">
                        <img 
                            src="/potato.png" 
                            alt="Hot Potato" 
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>
                
                <h1 className="text-3xl font-bold mb-6 text-center">Pass the Potato!</h1>
                
                {score !== null ? (
                    <div className="bg-[#231830] p-4 rounded-lg mb-6">
                        <p className="text-xl text-center">
                            Your score: <span className="font-bold text-amber-400 text-2xl">{score}</span>
                        </p>
                        {score > 50 && (
                            <p className="text-center mt-2 text-green-400">Amazing score! 🔥</p>
                        )}
                        {score > 20 && score <= 50 && (
                            <p className="text-center mt-2 text-blue-400">Great job! 👍</p>
                        )}
                        {score <= 20 && (
                            <p className="text-center mt-2 text-amber-400">Keep practicing! 💪</p>
                        )}
                    </div>
                ) : (
                    <p className="text-xl mb-6 text-center text-red-400">
                        No score found. Try playing the game again!
                    </p>
                )}
                
                <p className="text-lg mb-6 text-center">
                    Your score has been saved locally! You can submit it to the blockchain or pass the hot potato to someone else.
                </p>
                
                {score !== null && (
                    <div className="mb-6">
                        <BlockchainScoreManager 
                            score={score} 
                            onSuccess={() => {
                                // Maybe show a success message or confetti
                            }}
                            onError={(error) => {
                                console.error('Error from blockchain component:', error);
                                // Handle error if needed
                            }}
                        />
                    </div>
                )}
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button 
                        onClick={goToDashboard}
                        className="px-6 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition-colors"
                    >
                        Go to Dashboard
                    </button>
                    <button 
                        onClick={playAgain}
                        className="px-6 py-3 bg-[#17101F] text-white font-bold rounded-lg hover:bg-[#231830] transition-colors border border-amber-500"
                    >
                        Play Again
                    </button>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-700">
                    <HighScores maxScores={5} showLocal={true} />
                </div>
            </div>
        </main>
    );
}
