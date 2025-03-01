import * as Phaser from "phaser";

export class BouncingBallScene extends Phaser.Scene {
    private potato: Phaser.Physics.Arcade.Sprite | null = null;
    private lives: number = 3;
    private livesText: Phaser.GameObjects.Text | null = null;
    private score: number = 0;
    private scoreText: Phaser.GameObjects.Text | null = null;
    private heartIcons: Phaser.GameObjects.Image[] = [];
    private isLosingLife: boolean = false;
    
    constructor() {
        super("BouncingBallScene");
    }
    
    init() {
        // Reset all game state variables
        this.lives = 3;
        this.score = 0;
        this.isLosingLife = false;
        
        // Clear any existing objects
        if (this.potato) {
            this.potato.destroy();
            this.potato = null;
        }
        
        if (this.scoreText) {
            this.scoreText.destroy();
            this.scoreText = null;
        }
        
        // Clear any existing heart icons
        this.heartIcons.forEach(heart => heart.destroy());
        this.heartIcons = [];
    }

    preload() {
        // Load the hell background image
        this.load.image('hell-background', '/assets/hell-image.jpg');
        
        // Create a potato shape as a texture
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        // Draw potato body (oval shape)
        graphics.fillStyle(0xbf8d30, 1); // Potato brown color
        graphics.fillEllipse(32, 32, 50, 40);
        
        // Add some potato "eyes" (small dark spots)
        graphics.fillStyle(0x6d4c0c, 1); // Darker brown
        graphics.fillCircle(20, 25, 3);
        graphics.fillCircle(40, 30, 3);
        graphics.fillCircle(30, 40, 3);
        
        // Generate the texture
        graphics.generateTexture("potato", 64, 64);
        
        // Create heart icon for lives
        const heartGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        heartGraphics.fillStyle(0xff0000, 1); // Red color
        heartGraphics.fillCircle(8, 8, 8); // Left circle
        heartGraphics.fillCircle(24, 8, 8); // Right circle
        heartGraphics.fillStyle(0xff0000, 1);
        heartGraphics.fillTriangle(0, 12, 32, 12, 16, 32); // Bottom triangle
        
        // Generate heart texture
        heartGraphics.generateTexture("heart", 32, 32);
        
        // Create fire particle texture
        const fireParticle = this.make.graphics({ x: 0, y: 0, add: false });
        
        // Create a simple fire particle with color fills
        fireParticle.fillStyle(0xffffff, 1); // White center
        fireParticle.fillCircle(8, 8, 2);
        
        fireParticle.fillStyle(0xfff700, 0.9); // Yellow
        fireParticle.fillCircle(8, 8, 4);
        
        fireParticle.fillStyle(0xff7a00, 0.8); // Orange
        fireParticle.fillCircle(8, 8, 6);
        
        fireParticle.fillStyle(0xff3700, 0.5); // Red-orange
        fireParticle.fillCircle(8, 8, 8);
        
        // Generate fire particle texture
        fireParticle.generateTexture('fire', 16, 16);
    }

    create() {
        // Add the hell background image
        const background = this.add.image(0, 0, 'hell-background');
        background.setOrigin(0, 0);
        
        // Scale the background to fit the game canvas
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        
        // Add a potato sprite
        this.potato = this.physics.add.sprite(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 100,
            "potato"
        );
        
        // Set the potato's physics properties
        if (this.potato) {
            // We'll handle bounds manually in the update method
            this.potato.setCollideWorldBounds(false);
            this.potato.setBounce(0.6); // Reduced bounce factor
            this.potato.setInteractive({ useHandCursor: true });
            
            // Add click/tap event to make the potato bounce
            this.potato.on("pointerdown", this.bouncePotato, this);
            
            // Add some initial velocity
            this.potato.setVelocity(Phaser.Math.Between(-200, 200), 0);
        }
        
        // Add score text in the top center
        this.scoreText = this.add.text(
            this.cameras.main.centerX,
            30,
            "Score: 0",
            {
                fontFamily: "Arial",
                fontSize: "24px",
                color: "#ffffff",
                fontStyle: "bold",
                align: "center",
            }
        ).setOrigin(0.5);
        
        // Add lives display in the top right
        this.createLivesDisplay();
        
        // Create fire at the bottom of the screen (now just a simple rectangle)
        this.createFireAnimation();
    }
    
    update() {
        if (this.potato && !this.isLosingLife) {
            // Check if potato has fallen into the fire (about 50px from bottom)
            if (this.potato.y > this.cameras.main.height - 50) {
                // Add a cooking effect before losing a life
                this.cookPotato();
                return;
            }
            
            // Keep potato within bounds on left, right, and top
            // Left boundary
            if (this.potato.x < this.potato.width / 2) {
                this.potato.x = this.potato.width / 2;
                this.potato.setVelocityX(Math.abs(this.potato.body.velocity.x)); // Bounce back
            }
            
            // Right boundary
            if (this.potato.x > this.cameras.main.width - this.potato.width / 2) {
                this.potato.x = this.cameras.main.width - this.potato.width / 2;
                this.potato.setVelocityX(-Math.abs(this.potato.body.velocity.x)); // Bounce back
            }
            
            // Top boundary
            if (this.potato.y < this.potato.height / 2) {
                this.potato.y = this.potato.height / 2;
                this.potato.setVelocityY(Math.abs(this.potato.body.velocity.y)); // Bounce back
            }
        }
    }
    
    createLivesDisplay() {
        // Clear any existing heart icons
        this.heartIcons.forEach(heart => heart.destroy());
        this.heartIcons = [];
        
        // Create heart icons for each life
        for (let i = 0; i < this.lives; i++) {
            const heart = this.add.image(
                this.cameras.main.width - 30 - (i * 35),
                30,
                "heart"
            ).setScale(0.8);
            this.heartIcons.push(heart);
        }
    }
    
    cookPotato() {
        if (!this.potato || this.isLosingLife) return;
        
        // Set the flag to prevent multiple life losses
        this.isLosingLife = true;
        
        // Disable interaction while cooking
        this.potato.disableInteractive();
        
        // Just tint the potato red briefly to indicate it's being cooked
        this.tweens.add({
            targets: this.potato,
            tint: 0xff0000, // Red tint
            duration: 200,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                // Tint to darker brown to indicate cooking
                this.tweens.add({
                    targets: this.potato,
                    tint: 0x663300, // Darker brown (cooked potato)
                    duration: 200,
                    onComplete: () => {
                        // Lose a life immediately
                        this.loseLife();
                    }
                });
            }
        });
    }
    
    createFireAnimation() {
        const screenWidth = this.cameras.main.width;
        
        // Create a more visible fire with the background
        // Add a glow effect
        const fireGlow = this.add.rectangle(
            screenWidth / 2,
            this.cameras.main.height - 20,
            screenWidth,
            40,
            0xff5500
        ).setAlpha(0.4);
        
        // Main fire
        const fireBase = this.add.rectangle(
            screenWidth / 2,
            this.cameras.main.height - 15,
            screenWidth,
            30,
            0xff3700
        ).setAlpha(0.8);
        
        // Add a darker base
        const fireBaseDark = this.add.rectangle(
            screenWidth / 2,
            this.cameras.main.height - 5,
            screenWidth,
            10,
            0xaa0000
        ).setAlpha(0.9);
        
        // Add simple fire animation using tweens
        this.tweens.add({
            targets: [fireBase, fireGlow],
            alpha: '-=0.2',
            yoyo: true,
            repeat: -1,
            duration: 500,
            ease: 'Sine.easeInOut'
        });
    }
    
    loseLife() {
        // Decrease lives
        this.lives--;
        
        // Update lives display
        this.createLivesDisplay();
        
        // Check if game over
        if (this.lives <= 0) {
            // Game over - add a loading text
            const loadingText = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                "Game Over...",
                {
                    fontFamily: "Arial",
                    fontSize: "24px",
                    color: "#ffffff",
                    align: "center",
                }
            ).setOrigin(0.5);
            
            // Add a delay before transitioning to game over scene
            this.time.delayedCall(300, () => {
                this.scene.start("GameOverScene", { score: this.score });
            });
        } else {
            // Reset potato position for next life
            if (this.potato) {
                this.potato.destroy();
                this.potato = null;
            }
            
            // Show restart button
            this.showRestartButton();
        }
        
        // Reset the flag when the life loss process is complete
        this.isLosingLife = false;
    }
    
    showRestartButton() {
        // Create a continue button - position it above the fire
        const continueButton = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 30, // Move up a bit to be clearly above the fire
            240,
            50,
            0x17101F // Green color
        ).setInteractive({ useHandCursor: true });
        
        // Add button text
        const buttonText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 30, // Match button position
            `CONTINUE (${this.lives} LIVES LEFT)`,
            {
                fontFamily: "Arial",
                fontSize: "16px",
                color: "#ffffff",
                fontStyle: "bold",
                align: "center",
            }
        ).setOrigin(0.5);
        
        // Add hover effect
        continueButton.on("pointerover", () => {
            continueButton.fillColor = 0x342841; // Darker green
        });
        
        continueButton.on("pointerout", () => {
            continueButton.fillColor = 0x17101F; // Back to original green
        });
        
        // Add click event to restart the level
        continueButton.on("pointerdown", () => {
            // Disable the button to prevent multiple clicks
            continueButton.disableInteractive();
            continueButton.fillColor = 0x888888; // Gray out the button
            
            // Add a loading indicator
            const loadingText = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY + 20,
                "Loading...",
                {
                    fontFamily: "Arial",
                    fontSize: "16px",
                    color: "#ffffff",
                    align: "center",
                }
            ).setOrigin(0.5);
            
            // Add a delay before creating the new potato
            this.time.delayedCall(300, () => {
                // Remove the button, text, and loading text
                continueButton.destroy();
                buttonText.destroy();
                loadingText.destroy();
                
                // Create a new potato
                this.potato = this.physics.add.sprite(
                    this.cameras.main.centerX,
                    this.cameras.main.centerY - 100,
                    "potato"
                );
                
                // Set the potato's physics properties
                if (this.potato) {
                    this.potato.setCollideWorldBounds(false);
                    this.potato.setBounce(0.6);
                    this.potato.setInteractive({ useHandCursor: true });
                    this.potato.on("pointerdown", this.bouncePotato, this);
                    
                    // Give a gentle initial velocity
                    const initialVelocityX = Phaser.Math.Between(-100, 100);
                    this.potato.setVelocity(initialVelocityX, 0);
                }
            });
        });
    }
    
    bouncePotato() {
        if (this.potato) {
            // Apply an upward impulse
            this.potato.setVelocityY(-500); // Increased initial jump to compensate for higher gravity
            
            // Add some random horizontal velocity
            this.potato.setVelocityX(Phaser.Math.Between(-200, 200));
            
            // Add a little spin for visual effect
            this.tweens.add({
                targets: this.potato,
                angle: this.potato.angle + 360,
                duration: 600,
                ease: "Cubic.easeOut"
            });
            
            // Increment the score
            this.score++;
            
            // Update the score text
            if (this.scoreText) {
                this.scoreText.setText(`Score: ${this.score}`);
            }
        }
    }
    
    resetPotato() {
        // Destroy the current potato if it exists
        if (this.potato) {
            this.potato.destroy();
            this.potato = null;
        }
        
        // Create a new potato
        this.potato = this.physics.add.sprite(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 100,
            "potato"
        );
        
        // Set the potato's physics properties
        if (this.potato) {
            this.potato.setCollideWorldBounds(false);
            this.potato.setBounce(0.6);
            this.potato.setInteractive({ useHandCursor: true });
            this.potato.on("pointerdown", this.bouncePotato, this);
            
            // Give a gentle initial velocity
            const initialVelocityX = Phaser.Math.Between(-100, 100);
            this.potato.setVelocity(initialVelocityX, 0);
        }
    }
}
