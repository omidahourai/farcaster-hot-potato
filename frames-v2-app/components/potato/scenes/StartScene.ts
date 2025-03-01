import * as Phaser from "phaser";

export class StartScene extends Phaser.Scene {
    constructor() {
        super("StartScene");
    }
    
    preload() {
        // Load the hell background image
        this.load.image('hell-background', '/assets/hell-image.jpg');
    }

    create() {
        // Add the hell background image
        const background = this.add.image(0, 0, 'hell-background');
        background.setOrigin(0, 0);
        
        // Scale the background to fit the game canvas
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        
        // Add title text
        this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 80,
            "Hot Potato Game",
            {
                fontFamily: "Arial",
                fontSize: "32px",
                color: "#ffffff",
                fontStyle: "bold",
                align: "center",
            }
        ).setOrigin(0.5);

        // Add description text
        this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 20,
            "Click on the potato to make it bounce!",
            {
                fontFamily: "Arial",
                fontSize: "16px",
                color: "#ffffff",
                align: "center",
            }
        ).setOrigin(0.5);

        // Create a start button
        const startButton = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 60,
            200,
            50,
            0x4caf50 // Green color
        ).setInteractive({ useHandCursor: true });

        // Add button text
        this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 60,
            "START GAME",
            {
                fontFamily: "Arial",
                fontSize: "18px",
                color: "#ffffff",
                fontStyle: "bold",
                align: "center",
            }
        ).setOrigin(0.5);

        // Add hover effect
        startButton.on("pointerover", () => {
            startButton.fillColor = 0x388e3c; // Darker green
        });

        startButton.on("pointerout", () => {
            startButton.fillColor = 0x4caf50; // Back to original green
        });

        // Add click event to start the game
        startButton.on("pointerdown", () => {
            // Disable the button to prevent multiple clicks
            startButton.disableInteractive();
            startButton.fillColor = 0x888888; // Gray out the button
            
            // Add a loading indicator
            const loadingText = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY + 120,
                "Loading...",
                {
                    fontFamily: "Arial",
                    fontSize: "16px",
                    color: "#ffffff",
                    align: "center",
                }
            ).setOrigin(0.5);
            
            // Use a longer delay before scene transition to allow for cleanup
            this.time.delayedCall(500, () => {
                // Make sure the BouncingBallScene is stopped before starting it again
                this.scene.stop("BouncingBallScene");
                this.scene.start("BouncingBallScene");
            });
        });

        // Draw a small potato icon
        const graphics = this.make.graphics({ x: 0, y: 0 });
        
        // Draw potato body
        graphics.fillStyle(0xbf8d30, 1); // Potato brown color
        graphics.fillEllipse(0, 0, 50, 40);
        
        // Add potato "eyes"
        graphics.fillStyle(0x6d4c0c, 1); // Darker brown
        graphics.fillCircle(-12, -7, 3);
        graphics.fillCircle(8, -2, 3);
        graphics.fillCircle(-2, 8, 3);
        
        // Generate the texture if it doesn't exist
        if (!this.textures.exists("potato_icon")) {
            graphics.generateTexture("potato_icon", 50, 40);
        }
        
        // Add the potato icon to the scene
        const potatoIcon = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 130,
            "potato_icon"
        );
        
        // Add a simple animation to the potato icon
        this.tweens.add({
            targets: potatoIcon,
            y: this.cameras.main.centerY + 120,
            duration: 1000,
            ease: "Sine.easeInOut",
            yoyo: true,
            repeat: -1
        });
    }
}
