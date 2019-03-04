import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles.min.js';
import Phaser from 'phaser';
import Player from '../sprites/Player';
import Level from '../helpers/Level';
import { throws } from 'assert';

class GameScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'GameScene'
        });
    }

    preload() {
        this.level = new Level(this);
    }

    create() {

        this.physics.world.TILE_BIAS = 32;

        //this.zoom = 3.5;
        this.initialZoom = 2.0;
        this.gameZoom = 3.5;

        this.cam = this.cameras.main;

        this.cam.roundPixels = true;
        this.cam.setViewport(600, 0, 200, 600);
        this.cam.zoomTo(this.initialZoom, 0);
        this.cam.setBackgroundColor(0x7fbfff);

        this.registry.set('updateViewport', () => this.updateViewport());

        this.level.init();

        const origStep = this.physics.world.step.bind(this.physics.world);
        this.physics.world.step = (delta) => {
            this.fixedUpdate(0, delta * 1000);
            origStep(delta);
        };
    }

    update(time, delta) {
        //this.playerSprite.updateSprite(this.keys, time, delta);
        // this.level.update(time, delta);
    }

    fixedUpdate(time, delta) {
        this.level.update(time, delta);
    }

    updateViewport() {
        this.cam.setViewport(this.registry.get('divider'), 0, 800-this.registry.get('divider'), 600);
    }
}

export default GameScene;