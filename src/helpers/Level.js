import Phaser from 'phaser';
import Player from '../sprites/Player';
import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles.min.js';
import { throws } from 'assert';

export default class Level {
    constructor(scene, data) {
        this.scene = scene;

        //data may include key, tilesetImageKey, tileSetKey
        this.data = data;

        this.scene.load.scenePlugin('animatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles');

        //this.startTicks = 0;
        this.currentTicks = 0;
    }

    init() {
        this.map = this.scene.make.tilemap({
            key: 'map'
        });
        this.tileset = this.map.addTilesetImage('Tileset', 'tiles');
        this.groundLayer = this.map.createDynamicLayer('Land', this.tileset, 0, 0);

        this.groundLayer.setCollisionBetween(0, 100);

        this.scene.sys.animatedTiles.init(this.map);

        // Probably not the correct way of doing this:
        this.scene.physics.world.bounds.width = this.groundLayer.width;
        this.scene.physics.world.bounds.height = this.groundLayer.height * 2;
        this.scene.physics.world.bounds.y -= 100;

        this.keys = {
            jump: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            jump2: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            //fire: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
            left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            down: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        };

        this.playerSprite = new Player({ scene: this.scene, x: 0, y: 0, texture: 'player', frame: 'MortMortSprite-1.png' });

        let playerAnimations = {
            idle: this.scene.anims.generateFrameNames('player', {
                start: 1, end: 1, zeroPad: 0,
                prefix: 'MortMortSprite-', suffix: '.png'
            }),
            jump: this.scene.anims.generateFrameNames('player', {
                start: 2, end: 2, zeroPad: 0,
                prefix: 'MortMortSprite-', suffix: '.png'
            }),
            dash: this.scene.anims.generateFrameNames('player', {
                start: 3, end: 3, zeroPad: 0,
                prefix: 'MortMortSprite-', suffix: '.png'
            }),
            run: this.scene.anims.generateFrameNames('player', {
                start: 4, end: 9, zeroPad: 0,
                prefix: 'MortMortSprite-', suffix: '.png'
            })
        };
        this.scene.anims.create({ key: 'idle', frames: playerAnimations.idle, frameRate: 10, repeat: -1 });
        this.scene.anims.create({ key: 'jump', frames: playerAnimations.jump, frameRate: 10, repeat: -1 });
        this.scene.anims.create({ key: 'dash', frames: playerAnimations.dash, frameRate: 10, repeat: -1 });
        this.scene.anims.create({ key: 'run', frames: playerAnimations.run, frameRate: 10, repeat: -1 });
        this.playerSprite.anims.play('idle');

        // This will watch the player and worldLayer every frame to check for collisions
        this.scene.physics.add.collider(this.playerSprite, this.groundLayer);

        //this.scene.cam.centerOn(0, 0);
        this.scene.cam.startFollow(this.playerSprite, true, 0.25, 0.25);

        this.startingBlock = this.scene.scene.get("EditorScene").blockManager.startBlock;
        this.currentBlock = this.startingBlock;

        this.executing = false;
        this.waitingTime = 0;

        //this.dashed = false;
    }

    update(time, delta) {
        this.waitingTime -= delta;
        if (this.executing && this.waitingTime <= 0) {
            this.currentBlock = this.currentBlock.nextBlock;
            if (this.currentBlock !== null) {
                const func = this.currentBlock.command;

                console.log(func);

                let args = [];
                if (this.currentBlock.inputField) {
                    args.push(Number.parseFloat(this.currentBlock.inputField.inputText.text));
                }

                this[func].apply(this, args);
            } else {
                this.executing = false;
            }
        }

        if (this.playerSprite.body.velocity.x === 0 && this.playerSprite.body.velocity.y === 0) {
            //console.log(this.currentTicks);
            console.log(" ");
        } else {
            console.log(this.scene.physics.world.stepsLastFrame);
            this.currentTicks += this.scene.physics.world.stepsLastFrame;
        }

        this.playerSprite.updateSprite(this.keys, time, delta);


        //this.playerSprite.changeDirection();
        //this.playerSprite.moveForward();
        //this.playerSprite.stopMoving();
        //this.playerSprite.extJump();
        //console.log(this.playerSprite.x, this.playerSprite.y);

        //console.log(Object.assign({}, this.playerSprite.body.velocity));
        // if (!this.dashed && time > 2000) {
        //     this.dashed = true;
        //     this.playerSprite.dash();
        // }
    }

    moveForward() {
        this.playerSprite.moveForward();
    }

    stopMoving() {
        this.playerSprite.stopMoving();
    }

    jump() {
        this.playerSprite.extJump();
    }

    dash() {
        this.playerSprite.dash();
    }

    delay(amount) {
        //console.log("Delated: " + amount);
        this.waitingTime = amount * 1000;
    }

    doNothing() {

    }

    executeInstructions() {
        this.stopInstructions();
        this.currentBlock = this.startingBlock;
        this.executing = true;
        this.currentTicks = 0;
    }

    stopInstructions() {
        this.executing = false;
        this.waitingTime = 500;

        this.playerSprite.input = {
            right: false,
            left: false,
            jump: false,
        };

        this.playerSprite.x = this.playerSprite.startPosX;
        this.playerSprite.y = this.playerSprite.startPosY;

        this.playerSprite.body.setAcceleration(0, 0);
        this.playerSprite.body.velocity.x = 0;
        this.playerSprite.body.velocity.y = 0;
    }

    clearResources() {

    }
}