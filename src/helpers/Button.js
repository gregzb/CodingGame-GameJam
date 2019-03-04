import Phaser from 'phaser';
import { timingSafeEqual } from 'crypto';

export default class Button extends Phaser.GameObjects.Image{

    constructor(config) {
        if (config.frame) {
            super(config.scene, config.x, config.y, config.texture, config.frame);
        } else {
            super(config.scene, config.x, config.y, config.texture);
        }

        this.startX = this.x;
        this.startY = this.y;

        this.buttonPressed = config.buttonPressed;
        config.scene.add.existing(this);

        this.scene = config.scene;

        this.setInteractive({useHandCursor: true});
        this.on('pointerover', () => this.onPointerOver());
        this.on('pointerout', () => this.onPointerOut());
        this.on('pointerup', () => this.onPointerUp());
        this.on('pointerdown', () => this.onPointerDown());

        this.canSetActive = config.canSetActive | false;

        this.isHovered = false;
        this.isClicked = false;
        this.isActive = false;
    }

    updateButton() {
        // if (!this.withinMask()) {
        //     console.log (this.y, this.height);
        //     this.isHovered = false;
        //     this.isClicked = false;
        //     this.isActive = false;
        //     console.log("wont render");
        // }

        const pointer = this.scene.input.activePointer;

        if (pointer.y < 110) {
            this.disableInteractive();
        } else {
            this.setInteractive();
        }

        if (this.isActive) {
            this.setTint(0xafffaf);
        } else if (this.isClicked) {
            this.setTint(0x7f7f7f);
        } else if (this.isHovered) {
            this.setTint(0xcfcfcf);
        } else {
            this.setTint(0xffffff);
        }
    }

    withinMask() {
        if (this.y + this.height * 6 < 110) {
            return false;
        }
        return true;
    }

    onPointerOver() {
        this.isHovered = true;
        this.updateButton();
    }

    onPointerOut() {
        this.isHovered = false;
        this.isClicked = false;
        this.updateButton();
    }

    onPointerUp() {
        if (this.isClicked && this.isHovered) {
            this.buttonPressed(this);
            if (this.canSetActive) {
                this.isActive = true;
            }
        }
        this.isClicked = false;
        this.updateButton();
    }

    onPointerDown() {
        //this.scene.registry.get("removeKeyboard")();
        this.isClicked = true;
        this.updateButton();
    }
}