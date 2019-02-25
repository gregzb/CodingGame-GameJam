import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles.min.js';
import Phaser from 'phaser';
import Player from '../sprites/Player';
import Level from '../helpers/Level';

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

        this.physics.world.setFPS(9);

        this.zoom = 3.5;

        this.cam = this.cameras.main;

        this.cam.roundPixels = true;
        this.cam.setViewport(600, 0, 200, 600);
        this.cam.zoomTo(this.zoom, 0);
        this.cam.setBackgroundColor(0x7fbfff);

        this.registry.set('updateViewport', () => this.updateViewport());

        this.level.init();
    }

    update(time, delta) {
        //this.playerSprite.updateSprite(this.keys, time, delta);
        this.level.update(time, delta);
    }

    updateViewport() {
        this.cam.setViewport(this.registry.get('divider'), 0, 800-this.registry.get('divider'), 600);
    }
}

export default GameScene;