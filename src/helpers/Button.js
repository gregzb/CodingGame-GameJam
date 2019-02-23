import Phaser from 'phaser';

export default class Button extends Phaser.GameObjects.Image{

    constructor(config) {
        super(config.scene, config.x, config.y, config.texture);
        this.buttonPressed = config.buttonPressed;
        config.scene.add.existing(this);
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
        this.isClicked = true;
        this.updateButton();
    }
}