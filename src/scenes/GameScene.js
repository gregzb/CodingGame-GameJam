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

        this.cam = this.cameras.main;

        console.log(0);
        this.map = this.make.tilemap({
            key: 'map'
        });
        console.log(1);
        this.tileset = this.map.addTilesetImage('MoreBlocks', 'tiles');
        console.log(2);
        this.groundLayer = this.map.createDynamicLayer('world', this.tileset, 0, 0);
        console.log(3);
        this.sys.animatedTiles.init(this.map);
        console.log(4);
        this.groundLayer.setCollisionByProperty({
            collide: true
        });
        console.log(5);

        //cam.centerOn(750,300);
        console.log(this.cam.scrollX + ", " + this.cam.scrollY);
        this.cam.setScroll(-300,0);
        this.cam.zoomTo(4, 0);
    }

    update(time, delta) {
        console.log(this.cam.scrollX);
        this.cam.scrollX += (0.1 * delta);
        this.cam.scrollX %= 1000;
    }
}

export default GameScene;
