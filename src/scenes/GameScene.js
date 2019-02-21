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

        this.zoom = 4;

        this.registry.set('updateViewport', () => this.updateViewport());

        this.cam = this.cameras.main;

        this.cam.roundPixels = true;
        this.cam.setViewport(600, 0, 200, 600);

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
        this.physics.world.bounds.height = this.groundLayer.height * 2;
        this.physics.world.bounds.y -= 100;

        /*const debugGraphics = this.add.graphics().setAlpha(0.6);
        this.groundLayer.renderDebug(debugGraphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        });*/

        //this.physics.world.resume();

        this.keys = {
            jump: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            jump2: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            //fire: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        };


        this.playerSprite = new Player({ scene: this, x: 0, y: -100, texture: 'player', frame: 'MortMortSprite-1.png' });

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
        this.cam.zoomTo(this.zoom, 0);
        //this.cam.zoomTo(1, 0);
        this.cam.setBackgroundColor(0x7fbfff);

        // This will watch the player and worldLayer every frame to check for collisions
        this.physics.add.collider(this.playerSprite, this.groundLayer);

        this.cam.centerOn(0, 0);
        this.cam.startFollow(this.playerSprite, true, 0.25, 0.25);
    }

    update(time, delta) {
        this.playerSprite.updateSprite(this.keys, time, delta);
    }

    updateViewport() {
        this.cam.setViewport(this.registry.get('divider'), 0, 800-this.registry.get('divider'), 600);
    }
}

export default GameScene;
