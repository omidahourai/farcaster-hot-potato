"use client";

import { useEffect, useRef } from "react";
import * as Phaser from "phaser";
import { BouncingBallScene } from "./scenes/BouncingBallScene";
import { StartScene } from "./scenes/StartScene";
import { GameOverScene } from "./scenes/GameOverScene";

const PotatoGame = () => {
    const gameRef = useRef<Phaser.Game | null>(null);

    useEffect(() => {
        // Configuration for our Phaser game
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 400,
            height: 400,
            parent: "phaser-container",
            backgroundColor: "#558b2f", // Darker green to make the fire more visible
            physics: {
                default: "arcade",
                arcade: {
                    gravity: { y: 600 }, // Doubled gravity to make potato less bouncy
                    debug: false
                }
            },
            scene: [StartScene, BouncingBallScene, GameOverScene],
            // Make sure the canvas is properly sized
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            }
        };

        // Create the game instance
        if (!gameRef.current) {
            gameRef.current = new Phaser.Game(config);
        }

        // Cleanup function to destroy the game when component unmounts
        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, []);

    return (
        <div className="w-full flex justify-center">
            <div id="phaser-container" className="border-2 border-gray-300 rounded-lg overflow-hidden w-[400px] h-[400px]"></div>
        </div>
    );
};

export default PotatoGame;
