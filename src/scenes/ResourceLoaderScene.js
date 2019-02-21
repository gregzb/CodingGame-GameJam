import Phaser from 'phaser';

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
            progress.fillStyle(0x7f7f7f, 1);
            progress.fillRect(0, this.sys.game.config.height / 2, this.sys.game.config.width, 60);
            progress.fillStyle(0xffffff, 1);
            progress.fillRect(0, this.sys.game.config.height / 2, this.sys.game.config.width * value, 60);
        });

        // Register a load complete event to launch the title screen when all files are loaded
        this.load.on('complete', () => {
            // prepare all animations, defined in a separate file
            progress.destroy();
            this.scene.start('EditorScene');
        });

        // Tilemap with a lot of objects and tile-properties tricks
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/map2/newtestmap.json');

        /*this.load.spritesheet('tiles', 'assets/tilemaps/map2/Tileset.png', {
            frameWidth: 16,
            frameHeight: 16,
            spacing: 0
        });*/

        this.load.image('tiles', 'assets/tilemaps/map2/Tileset.png');

        this.load.atlas('player', 'assets/spritesheets/mortmort/spritesheet.png', 'assets/spritesheets/mortmort/spritesheet.json');

        this.load.image('editorUI', 'assets/images/EditorUI.png');

        this.load.bitmapFont('default', 'assets/fonts/font0/font0.png', 'assets/fonts/font0/font0.fnt');

        this.load.image('movementButton', 'assets/images/buttons/Movement.png');
        this.load.image('clockButton', 'assets/images/buttons/Clock.png');
        this.load.image('actionButton', 'assets/images/buttons/Action.png');
        this.load.image('attackButton', 'assets/images/buttons/Attack.png');

        this.load.image('movementBlock', 'assets/images/MovementBlock1Input.png');
    }
}

export default ResourceLoaderScene;
