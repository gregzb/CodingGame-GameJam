import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles.min.js';
import Phaser from 'phaser';
import Player from '../sprites/Player';

class GameScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'GameScene'
        });
    }

    preload() {
        this.load.scenePlugin('animatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles');
    }

    create() {

        this.cam = this.cameras.main;

        this.map = this.make.tilemap({
            key: 'map'
        });
        //this.map.setCollision(1);
        this.tileset = this.map.addTilesetImage('Tileset', 'tiles');
        this.groundLayer = this.map.createDynamicLayer('Land', this.tileset, 0, 0);

        this.groundLayer.setCollisionBetween(0, 100);

        this.sys.animatedTiles.init(this.map);

        // Probably not the correct way of doing this:
        this.physics.world.bounds.width = this.groundLayer.width;

        this.physics.world.TILE_BIAS = 96;

        this.physics.world.resume();

        this.keys = {
            jump: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            jump2: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            //fire: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        };

        //cam.centerOn(750,300);
        //this.cam.setScroll(-300,0);

        this.playerSprite = new Player({ scene: this, x: 50, y: -100, texture: 'player', frame: 'MortMortSprite-1.png' });

        //this.camTarget = this.add.zone(this.playerSprite.x, this.playerSprite.y, 1, 1);
        //this.playerSprite.setScale(1, 1);
        let playerAnimations = {
            idle: this.anims.generateFrameNames('player', {
                start: 1, end: 1, zeroPad: 0,
                prefix: 'MortMortSprite-', suffix: '.png'
            }),
            jump: this.anims.generateFrameNames('player', {
                start: 2, end: 2, zeroPad: 0,
                prefix: 'MortMortSprite-', suffix: '.png'
            }),
            dash: this.anims.generateFrameNames('player', {
                start: 3, end: 3, zeroPad: 0,
                prefix: 'MortMortSprite-', suffix: '.png'
            }),
            run: this.anims.generateFrameNames('player', {
                start: 4, end: 9, zeroPad: 0,
                prefix: 'MortMortSprite-', suffix: '.png'
            })
        };
        this.anims.create({ key: 'idle', frames: playerAnimations.idle, frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'jump', frames: playerAnimations.jump, frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'dash', frames: playerAnimations.dash, frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'run', frames: playerAnimations.run, frameRate: 10, repeat: -1 });
        this.playerSprite.anims.play('idle');
        this.cam.zoomTo(4, 0);
        //this.cam.zoomTo(1, 0);
        this.cam.setBackgroundColor(0x7fbfff);

        this.cam.centerOn(0, 0);
        this.cam.startFollow(this.playerSprite, true, 0.25, 0.25);
    }

    update(time, delta) {
        this.playerSprite.updateSprite(this.keys, time, delta);
        this.physics.collide(this.playerSprite, this.groundLayer, this.playerCollision);



        /*if (this.cam.scrollX > 600) {
            this.cam.scrollX = -300;
            this.playerSprite.x = 100;
            this.playerSprite.y = 0;
            this.playerSprite.body.velocity = new Phaser.Math.Vector2(250,0);
        }*/
    }

    playerCollision(obj1, obj2) {
        let objs = [obj1, obj2];

        for (const obj of objs) {
            if (obj.type === "Sprite") {
                if (obj.body.blocked.down) {
                    if (obj.jumping) {
                        if (obj.running) {
                            obj.anims.play("run");
                        } else {
                            obj.anims.play("idle");
                        }
                    }
                    obj.jumping = false;
                }
            }
        }
    }
}

export default GameScene;
