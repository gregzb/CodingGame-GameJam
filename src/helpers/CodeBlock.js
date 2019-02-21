import Phaser from 'phaser';
import InputField from './InputField.js';

export default class CodeBlock extends Phaser.GameObjects.Image {
    constructor(scene, data, shapes) {
        super(scene, data.defaultX, data.defaultY, shapes[data.shape].texture);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.setAllowGravity(false);

        this.blockType = data.type;
        this.name = data.name;
        this.description = data.description;
        this.prefix = data.prefix;
        this.suffix = data.suffix;
        this.defaultPos = new Phaser.Math.Vector2(data.defaultX, data.defaultY);
        this.setPosition(this.defaultPos.x, this.defaultPos.y);

        this.shape = shapes[data.shape];

        this.setInteractive({ useHandCursor: this.shape.draggable });
        scene.input.setDraggable(this);

        if (this.shape.draggable) {
            //this.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY));
            this.on('drag', (pointer, dragX, dragY) => this.onDrag(pointer, dragX, dragY));
            this.on('dragend', (pointer, dragX, dragY) => this.onDragEnd(pointer, dragX, dragY));
            //this.on('drop', (pointer, target) => this.onDrop(pointer, target));
        }

        this.prefixText = this.scene.add.bitmapText(this.x + 25, this.y + 10, 'default', this.prefix, 40);
        if (this.shape.hasOwnProperty('suffixOffsetX')) {
            this.suffixText = this.scene.add.bitmapText(this.x + 25, this.y + 60, 'default', this.suffix, 40);
        }
        if (this.shape.hasOwnProperty('inputOffsetX')) {
            this.inputField = new InputField(this.scene, this.x + 18, this.y + 32, 158, 23, { parent: this, defaultText: '1', validKeyList: '0123456789.'.split('') }).setOrigin(0, 0);
        }

        //console.log(this.getBounds());

        this.zone = this.scene.add.zone(this.x, this.y + this.height * 6 - 8 * 2, this.width * 6, 8 * 2).setDropZone().setOrigin(0, 0);
        this.scene.physics.world.enable(this.zone);
        this.zone.body.setAllowGravity(false);
        if (this.scene.registry.get('blockZones')) {
            this.scene.registry.set('blockZones', this.scene.registry.get('blockZones').concat(this.zone));
        } else {
            this.scene.registry.set('blockZones', [this.zone]);
        }

        //  Just a visual display of the drop zone
        this.graphics = this.scene.add.graphics();
        this.graphics.setVisible(false);
        this.graphics.lineStyle(2, 0xffff00);
        this.graphics.strokeRect(this.zone.x + this.zone.input.hitArea.x, this.zone.y + this.zone.input.hitArea.y, this.zone.input.hitArea.width, this.zone.input.hitArea.height);
    }

    updateChildren() {
        // this.prefixText.x = this.x + 25;
        // this.prefixText.y = this.y + 10;
        // this.suffixText.x = this.x + 25;
        // this.suffixText.y = this.y + 60;
        // this.inputField.x = this.x + 18;
        // this.inputField.y = this.y + 32;

        this.zone.x = this.x;
        this.zone.y = this.y + this.height * 6 - 8 * 2;
        this.graphics.clear();
        this.graphics.lineStyle(2, 0xffff00);
        this.graphics.strokeRect(this.zone.x + this.zone.input.hitArea.x, this.zone.y + this.zone.input.hitArea.y, this.zone.input.hitArea.width, this.zone.input.hitArea.height);

        this.prefixText.x = this.x + this.shape.prefixOffsetX;
        this.prefixText.y = this.y + this.shape.prefixOffsetY;

        if (this.shape.hasOwnProperty('suffixOffsetX')) {
            this.suffixText.x = this.x + this.shape.suffixOffsetX;
            this.suffixText.y = this.y + this.shape.suffixOffsetY;
        }
        if (this.shape.hasOwnProperty('inputOffsetX')) {
            this.inputField.x = this.x + this.shape.inputOffsetX;
            this.inputField.y = this.y + this.shape.inputOffsetY;
        }
    }

    onOverlap(object1, object2) {
        this.x = object2.x;
        this.y = object2.y;
        this.scene.addNewBlock();
        //console.log(this.x, this.y);
        //console.log(object2.x, object2.y);
        //console.log("fuck");
    }

    /*onDragStart(pointer, dragX, dragY) {
        this.overlaps = [];
        for (const zone of this.scene.registry.get('blockZones')) {
            this.overlaps.push(this.scene.physics.add.overlap(this, zone, (object1, object2) => this.onOverlap(object1, object2)));
        }
        this.x = dragX;
        this.y = dragY;
}*/

    onDrag(pointer, dragX, dragY) {
        this.x = dragX;
        this.y = dragY;
    }

    collideExtra(object1, object2) {
        if (object1 === this && object2.type === "Zone") {
            if (object2 !== this.zone) {
                return true;
            }
        }
        return false;
    }

    onDragEnd(pointer, dragX, dragY) {
        // console.log("ended");
        // console.log(this.scene.registry.get('blockZones'));
        // console.log(this);
        if (!this.scene.physics.overlap(this, this.scene.registry.get('blockZones'), (object1, object2) => this.onOverlap(object1, object2), (object1, object2) => this.collideExtra(object1, object2))) {
            //console.log("no overlaps");
            this.x = this.defaultPos.x;
            this.y = this.defaultPos.y;
        }

        // for (const zone of this.scene.registry.get('blockZones')) {
        //     console.log();
        // }
    }

    onDrop(pointer, target) {
        this.x = target.x;
        this.y = target.y;
    }

    update(time, delta) {
        this.updateChildren();
        if (this.shape.hasOwnProperty('inputOffsetX')) {
            this.inputField.update(time, delta);
        }
    }
}