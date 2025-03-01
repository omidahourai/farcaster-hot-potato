import * as Phaser from "phaser";

export class GameOverScene extends Phaser.Scene {
    private finalScore: number = 0;

    constructor() {
        super("GameOverScene");
    }
    
    preload() {
        // Load the hell background image
        this.load.image('hell-background', '/assets/hell-image.jpg');
    }

    init(data: { score: number }) {
        this.finalScore = data.score || 0;
    }

    create() {
        // Add the hell background image
        const background = this.add.image(0, 0, 'hell-background');
        background.setOrigin(0, 0);
        
        // Scale the background to fit the game canvas
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        
        // Add a semi-transparent overlay
        this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000,
            0.5
        );
        
        // Add game over text with glow effect
        const gameOverText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 80,
            "GAME OVER",
            {
                fontFamily: "Arial",
                fontSize: "48px",
                color: "#ff0000",
                fontStyle: "bold",
                align: "center",
            }
        ).setOrigin(0.5);
        
        // Add glow effect
        gameOverText.setShadow(0, 0, '#ff6666', 8, true, true);

        // Add final score text with golden color for emphasis
        this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            `Final Score: ${this.finalScore}`,
            {
                fontFamily: "Arial",
                fontSize: "28px",
                color: "#ffd700", // Golden color
                align: "center",
                fontStyle: "bold"
            }
        ).setOrigin(0.5);
        
        // Add instructions text
        this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 30,
            "Click the button below to save your score",
            {
                fontFamily: "Arial",
                fontSize: "16px",
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
            0x17101F // Green color
        ).setInteractive({ useHandCursor: true });

        // Add button text
        this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 80,
            "SUBMIT SCORE",
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
            playAgainButton.fillColor = 0x342841; // Darker green
        });

        playAgainButton.on("pointerout", () => {
            playAgainButton.fillColor = 0x17101F; // Back to original green
        });

        // Add click event to submit score and navigate to pass-potato page
        playAgainButton.on("pointerdown", () => {
            // Disable the button to prevent multiple clicks
            playAgainButton.disableInteractive();
            playAgainButton.fillColor = 0x888888; // Gray out the button
            
            // Add a loading indicator
            const loadingText = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY + 140,
                "Saving score...",
                {
                    fontFamily: "Arial",
                    fontSize: "16px",
                    color: "#ffffff",
                    align: "center",
                }
            ).setOrigin(0.5);
            
            // Save the score to localStorage for the next page
            localStorage.setItem('potatoGameScore', this.finalScore.toString());
            
            // Show success message
            loadingText.setText("Score saved! Redirecting...");
            
            // Navigate to the pass-potato page after a short delay
            this.time.delayedCall(1500, () => {
                // Stop all scenes
                this.scene.manager.scenes.forEach(scene => {
                    this.scene.stop(scene.scene.key);
                });
                
                // Redirect to the pass-potato page
                window.location.href = "/pass-potato";
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
