import Phaser from 'phaser';
import Button from './Button';

export default class TextButton extends Button{

    constructor(config) {
        super(config);

        this.scene = config.scene;

        this.offsetX = config.offsetX;
        this.offsetY = config.offsetY;

        this.text = this.scene.add.bitmapText(this.x + this.offsetX, this.y + this.offsetY, "default", config.text, config.textSize, 1).setOrigin(0.5, 0);
        //super.setVisible(false);
    }

    update(time, delta) {
        super.updateButton(time, delta);
        this.text.x = this.x + this.offsetX;
        this.text.y = this.y + this.offsetY;
    }

    setVisible(visibility) {
        super.setVisible(visibility);
        this.text.setVisible(visibility);
    }

    setMask(mask) {
        super.setMask(mask);
        this.text.setMask(mask);
        return this;
    }
}