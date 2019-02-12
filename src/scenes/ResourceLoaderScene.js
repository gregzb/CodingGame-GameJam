class ResourceLoaderScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'ResourceLoaderScene'
        });
    }
    preload() {
        const progress = this.add.graphics();

        // Register a load progress event to show a load bar
        this.load.on('progress', (value) => {
            progress.clear();
            progress.fillStyle(0xffffff, 1);
            progress.fillRect(0, this.sys.game.config.height / 2, this.sys.game.config.width * value, 60);
        });

        // Register a load complete event to launch the title screen when all files are loaded
        this.load.on('complete', () => {
            // prepare all animations, defined in a separate file
            progress.destroy();
            this.scene.start('GameScene');
        });

        // Tilemap with a lot of objects and tile-properties tricks
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/map1/map1.json');

        this.load.spritesheet('tiles', 'assets/tilemaps/map1/TileSet2.png', {
            frameWidth: 16,
            frameHeight: 16,
            spacing: 0
        });
        }
}

export default ResourceLoaderScene;
