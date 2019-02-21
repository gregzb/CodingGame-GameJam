import Phaser from 'phaser';

export default class CodeBlock extends Phaser.GameObjects.Image{
    constructor(scene, x, y, texture, data) {
        super(scene, x, y, texture);
        this.scene = scene;
        scene.add.existing(this);
        this.type = data.type;
        this.name = data.name;
        this.description = data.description;
        this.numInputs = data.numInputs;
        this.prefix = data.prefix;
        this.suffix = data.suffix;
        this.defaultX = data.defaultX;
        this.defaultY = data.defaultY;

        this.x = this.defaultX;
        this.y = this.defaultY;

        this.setInteractive({useHandCursor: true});
        scene.input.setDraggable(this);
        this.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY));

        console.log();

        this.prefixText = this.scene.add.bitmapText(this.x+25, this.y+10, 'default', this.prefix, 40);
        this.suffixText = this.scene.add.bitmapText(this.x+25, this.y+60, 'default', this.suffix, 40);

        // let graphics = this.scene.add.graphics();
        // graphics.clear();
        // graphics.fillStyle(0x7f7f7f, 1);
        // graphics.fillRect(this.x+18, this.y + 32, 158, 20);

        this.inputZone = this.scene.add.zone(this.x+18, this.y + 32, 158, 20).setOrigin(0,0);
        this.inputZone.setInteractive({useHandCursor: true});

        this.inputZone.on('pointerover', () => {
            this.disableInteractive();
        });
        this.inputZone.on('pointerout', () => {
            this.setInteractive();
        });
    }

    updateChildren() {
        this.prefixText.x = this.x + 25;
        this.prefixText.y = this.y + 10;
        this.suffixText.x = this.x + 25;
        this.suffixText.y = this.y + 60;
        this.inputZone.x = this.x + 18;
        this.inputZone.y = this.y + 32;
    }

    onDrag(pointer, dragX, dragY) {
        this.x = dragX;
        this.y = dragY;
        this.updateChildren();
    }

    update(time, delta) {

    }
}