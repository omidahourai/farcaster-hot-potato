import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class MainMenu extends Scene {
    logoTween: Phaser.Tweens.Tween | null = null;
    logo: Phaser.GameObjects.Image | null = null;

    constructor() {
        super("MainMenu");
    }

    create() {
        this.logo = this.add.image(200, 200, "logo").setDepth(100);

        this.add
            .text(100, 460, "Main Menu", {
                fontFamily: "Arial Black",
                fontSize: 18,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setDepth(100)
            .setOrigin(0.5);

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        if (this.logoTween) {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start("Game");
    }

    moveLogo(reactCallback: (position: { x: number; y: number }) => void) {
        if (this.logoTween) {
            if (this.logoTween.isPlaying()) {
                this.logoTween.pause();
            } else {
                this.logoTween.play();
            }
        } else {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: "Back.easeInOut" },
                y: { value: 80, duration: 1500, ease: "Sine.easeOut" },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (reactCallback) {
                        reactCallback({
                            x: Math.floor(this.logo?.x ?? 0),
                            y: Math.floor(this.logo?.y ?? 0),
                        });
                    }
                },
            });
        }
    }
}
