import * as Phaser from "phaser";

export class GameOverScene extends Phaser.Scene {
    private finalScore: number = 0;

    constructor() {
        super("GameOverScene");
    }
    
    preload() {
        // No preloading needed
    }

    init(data: { score: number }) {
        this.finalScore = data.score || 0;
    }

    create() {
        // Add game over text
        this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 80,
            "GAME OVER",
            {
                fontFamily: "Arial",
                fontSize: "48px",
                color: "#ffffff",
                fontStyle: "bold",
                align: "center",
            }
        ).setOrigin(0.5);

        // Add final score text
        this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            `Final Score: ${this.finalScore}`,
            {
                fontFamily: "Arial",
                fontSize: "24px",
                color: "#ffffff",
                align: "center",
            }
        ).setOrigin(0.5);
 
        // Create a play again button
        const playAgainButton = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 80,
            200,
            50,
            0x4caf50 // Green color
        ).setInteractive({ useHandCursor: true });

        // Add button text
        this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 80,
            "PLAY AGAIN",
            {
                fontFamily: "Arial",
                fontSize: "18px",
                color: "#ffffff",
                fontStyle: "bold",
                align: "center",
            }
        ).setOrigin(0.5);

        // Add hover effect
        playAgainButton.on("pointerover", () => {
            playAgainButton.fillColor = 0x388e3c; // Darker green
        });

        playAgainButton.on("pointerout", () => {
            playAgainButton.fillColor = 0x4caf50; // Back to original green
        });

        // Add click event to restart the game
        playAgainButton.on("pointerdown", () => {
            // Disable the button to prevent multiple clicks
            playAgainButton.disableInteractive();
            playAgainButton.fillColor = 0x888888; // Gray out the button
            
            // Add a loading indicator
            const loadingText = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY + 140,
                "Loading...",
                {
                    fontFamily: "Arial",
                    fontSize: "16px",
                    color: "#ffffff",
                    align: "center",
                }
            ).setOrigin(0.5);
            
            // Add a delay before scene transition
            this.time.delayedCall(500, () => {
                this.scene.start("StartScene");
            });
        });

        // Add a sad potato icon
        const graphics = this.make.graphics({ x: 0, y: 0 });
        
        // Draw potato body
        graphics.fillStyle(0xbf8d30, 1); // Potato brown color
        graphics.fillEllipse(0, 0, 50, 40);
        
        // Add potato "eyes" (sad version)
        graphics.fillStyle(0x6d4c0c, 1); // Darker brown
        graphics.fillCircle(-12, -7, 3);
        graphics.fillCircle(8, -2, 3);
        
        // Add sad mouth
        graphics.lineStyle(3, 0x6d4c0c, 1);
        graphics.beginPath();
        graphics.arc(0, 10, 15, 0.8 * Math.PI, 0.2 * Math.PI, true);
        graphics.strokePath();
        
        // Generate the texture if it doesn't exist
        if (!this.textures.exists("sad_potato")) {
            graphics.generateTexture("sad_potato", 50, 40);
        }
        
        // Add the sad potato icon to the scene
        const sadPotato = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 150,
            "sad_potato"
        );
        
        // Add a simple animation to the sad potato
        this.tweens.add({
            targets: sadPotato,
            angle: 10,
            duration: 2000,
            ease: "Sine.easeInOut",
            yoyo: true,
            repeat: -1
        });
    }
}
