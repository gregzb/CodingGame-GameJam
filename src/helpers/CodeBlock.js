import Phaser from 'phaser';
import InputField from './InputField.js';

export default class CodeBlock extends Phaser.GameObjects.Image {
    constructor(scene, data, shapes) {
        super(scene, data.defaultX, data.defaultY, shapes[data.shape].texture);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.setAllowGravity(false);

        this.command = data.command;

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

        this.previousBlock = null;
        this.nextBlock = null;

        if (this.shape.draggable) {
            this.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(pointer, dragX, dragY));
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

        this.zone = this.scene.add.zone(this.x, this.y + this.height * 6 - 8 * 2, this.width * 6, 8 * 4).setDropZone().setOrigin(0, 0);
        this.zone.block = this;
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
    
        this.onBoard = false;
        this.setOnBoard(data.onBoard, this.previousBlock);
    }

    setOnBoard(isOnBoard, prevBlock) {
        if (!(isOnBoard | false)) {
            this.onBoard = false;
            this.disableSnapZone();
            this.setPreviousBlock(null);
        } else {
            this.onBoard = true;
            if (!this.nextBlock) {
                this.enableSnapZone();
            }
            this.setPreviousBlock(prevBlock);
        }
    }

    setPreviousBlock(prevBlock) {
        if (prevBlock !== null) {
            prevBlock.nextBlock = this;
            prevBlock.disableSnapZone();
        } else if (this.previousBlock !== null){
            this.previousBlock.nextBlock = null;
            this.previousBlock.enableSnapZone();
        }
        this.previousBlock = prevBlock;
    }

    disableSnapZone() {
        this.scene.physics.world.disable(this.zone);
        this.graphics.setVisible(false);
    }

    enableSnapZone() {
        this.scene.physics.world.enable(this.zone);
        this.graphics.setVisible(true);
        this.graphics.setVisible(false);
    }

    updateChildren(time, delta) {

        if (this.nextBlock) {
            this.nextBlock.update(time, delta);
        }

        if (this.zone.scene) {
            this.zone.x = this.x;
            this.zone.y = this.y + this.height * 6 - 8 * 2;
        }

        if (this.graphics.scene) {
            this.graphics.clear();
            this.graphics.lineStyle(2, 0xffff00);
            this.graphics.strokeRect(this.zone.x + this.zone.input.hitArea.x, this.zone.y + this.zone.input.hitArea.y, this.zone.input.hitArea.width, this.zone.input.hitArea.height);
        }

        if (this.prefixText.scene) {
            this.prefixText.x = this.x + this.shape.prefixOffsetX;
            this.prefixText.y = this.y + this.shape.prefixOffsetY;
        }

        if (this.shape.hasOwnProperty('suffixOffsetX')) {
            this.suffixText.x = this.x + this.shape.suffixOffsetX;
            this.suffixText.y = this.y + this.shape.suffixOffsetY;
        }
        if (this.shape.hasOwnProperty('inputOffsetX')) {
            this.inputField.x = this.x + this.shape.inputOffsetX;
            this.inputField.y = this.y + this.shape.inputOffsetY;
            this.inputField.update(time, delta);
        }
    }

    onOverlap(object1, object2) {
        //May overlap many times, stop after the first one?
        this.x = object2.x;
        this.y = object2.y;
        this.setOnBoard(true, object2.block);
        if (!this.wasOnBoard) {
            this.scene.blockManager.boardBlocks.push(this);
            this.scene.blockManager.displayToolbarBlocks();
        }
    }

    onDragStart(pointer, dragX, dragY) {
        if (this.onBoard) {
            this.setOnBoard(false, null);
            this.wasOnBoard = true;
        }
    }

    onDrag(pointer, dragX, dragY) {
        this.x = dragX;
        this.y = dragY;
        //console.log(this.nextBlock);
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

        // if (this.shouldDestroy) {
        //     //console.log(this);
        //     this.destroy();
        //     //console.log(this);
        // }

        if (!this.scene.physics.overlap(this, this.scene.registry.get('blockZones'), (object1, object2) => this.onOverlap(object1, object2), (object1, object2) => this.collideExtra(object1, object2))) {
            if (this.wasOnBoard) {
                this.clearResources();
            }
            //dragging off then back on duplicates
            this.x = this.defaultPos.x;
            this.y = this.defaultPos.y;
        } else {
            this.wasOnBoard = false;
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
        this.updateChildren(time, delta);
        if (this.nextBlock) {
            this.nextBlock.x = this.x;
            this.nextBlock.y = this.y + this.height * 6 - 8 * 2;
        }
    }

    clearResources() {
        this.nextBlock && this.nextBlock.clearResources();
        this.zone && this.zone.destroy();
        this.graphics && this.graphics.destroy();
        this.inputField && this.inputField.clearResources();
        this.prefixText && this.prefixText.destroy();
        this.suffixText && this.suffixText.destroy();
        this.destroy();
    }
}