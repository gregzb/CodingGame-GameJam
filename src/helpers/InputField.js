import Phaser from 'phaser';
import { timingSafeEqual } from 'crypto';

export default class InputField extends Phaser.GameObjects.Zone {
    constructor(scene, x, y, width, height, data) {
        super(scene, x, y, width, height);
        this.scene = scene;
        this.scene.add.existing(this);

        this.setInteractive({ useHandCursor: false });
        this.scene.input.setDraggable(this);

        this.parent = data.parent;
        this.validKeyList = data.validKeyList;

        this.pointerOver = false;

        this.inputText = this.scene.add.bitmapText(this.x, this.y, 'default', '', 40);
        this.inputText.setText(data.defaultText);

        this.editing = false;

        this.textCursor = this.scene.add.image(this.x + (this.inputText.getTextBounds().global.width), this.y, 'textCursor').setOrigin(0, 0).setScale(6);

        this.scene.input.keyboard.on('keydown', (event) => {
            if (this.editing) {
                if (this.validKeyList.includes(event.key)) {
                    const keyPressed = event.key;
                    this.inputText.setText(this.inputText.text + keyPressed);
                    this.inputText.setText(this.inputText.text.substring(0, 12));
                } else if (event.key === 'Backspace' || event.key === 'Delete') {
                    this.inputText.setText(this.inputText.text.substring(0, this.inputText.text.length - 1));
                }
            }

        });

        this.on('pointerover', (pointer, localX, localY, event) => {
            this.parent.disableInteractive();
            this.pointerOver = true;
        });
        this.on('pointerout', (pointer, event) => {
            this.parent.setInteractive();
            this.pointerOver = false;
        });
        this.on('pointerdown', (pointer, localX, localY, event, test) => {
        });
        this.on('pointerup', (pointer, localX, localY, event, test) => {
            for (const codeBlock of this.scene.blocks) {
                codeBlock.inputField.editing = false;
            }
            if (this.pointerOver) {
                this.editing = true;
            }
            event.stopPropagation();
        });
    }

    updateChildren() {
        this.textCursor.x = this.x + (this.inputText.getTextBounds().global.width);
        this.textCursor.y = this.y;
        this.inputText.x = this.x;
        this.inputText.y = this.y;
    }

    update(time, delta) {
        //Period is 0.5 seconds
        this.updateChildren();
        if (this.editing) {
            const period = 1000;
            this.textCursor.setVisible(time % period > period / 2);
        } else {
            this.textCursor.setVisible(false);
        }
    }
}