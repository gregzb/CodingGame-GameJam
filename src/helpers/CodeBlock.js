import Phaser from 'phaser';

export default class CodeBlock extends Phaser.GameObjects.Image{
    constructor(scene, x, y, texture, data) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        this.type = data.type;
        this.name = data.name;
        this.description = data.description;
        this.numInputs = data.numInputs;
        this.prefix = data.prefix;
        this.suffix = data.suffix;

        scene.input.on('drag', (pointer, gameObject, dragX, dragY) => this.onDrag(pointer, gameObject, dragX, dragY));
    }

    onDrag(pointer, gameObject, dragX, dragY) {
        if (gameObject === this) {
            this.x = dragX;
            this.y = dragY;
        }
    }

    update(time, delta) {

    }
}