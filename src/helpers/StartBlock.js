import Phaser from 'phaser';
import InputField from './InputField.js';
import CodeBlock from './CodeBlock.js';

export default class ActionBlock extends CodeBlock{
    constructor(scene, x, y, texture, data) {
        super(scene, x, y, texture, data);
        //this.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY));

        this.prefixText = this.scene.add.bitmapText(this.x+25, this.y+10, 'default', this.prefix, 40);
        this.suffixText = this.scene.add.bitmapText(this.x+25, this.y+60, 'default', this.suffix, 40);

        // let graphics = this.scene.add.graphics();
        // graphics.clear();
        // graphics.fillStyle(0x7f7f7f, 1);
        // graphics.fillRect(this.x+18, this.y + 32, 158, 20);

        // this.inputZone = this.scene.add.zone(this.x+18, this.y + 32, 158, 20).setOrigin(0,0);
        // this.inputZone.setInteractive({useHandCursor: false});

        // this.inputZone.on('pointerover', () => {
        //     this.disableInteractive();
        // });
        // this.inputZone.on('pointerout', () => {
        //     this.setInteractive();
        // });

        this.inputField = new InputField(this.scene, this.x+18, this.y + 32, 158, 23, {parent: this}).setOrigin(0,0);
    }

    updateChildren() {
        this.prefixText.x = this.x + 25;
        this.prefixText.y = this.y + 10;
        this.suffixText.x = this.x + 25;
        this.suffixText.y = this.y + 60;
        this.inputField.x = this.x + 18;
        this.inputField.y = this.y + 32;
    }

    onDrag(pointer, dragX, dragY) {
        this.x = dragX;
        this.y = dragY;
        this.updateChildren();
    }

    update(time, delta) {
        this.inputField.update(time, delta);
    }
}