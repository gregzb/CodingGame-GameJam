import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles.min.js';

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
        this.map = this.make.tilemap({
            key: 'map'
        });
        this.tileset = this.map.addTilesetImage('MyFirstWorld', 'tiles');
        this.groundLayer = this.map.createDynamicLayer('world', this.tileset, 0, 0);
        this.sys.animatedTiles.init(this.map);
    }
}

export default GameScene;
