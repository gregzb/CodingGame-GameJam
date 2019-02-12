import 'phaser';
import './styles/styles.css';
import ResourceLoaderScene from './scenes/ResourceLoaderScene';
import GameScene from './scenes/GameScene';

const config = {
    // For more settings see <https://github.com/photonstorm/phaser/blob/master/src/boot/Config.js>
    type: Phaser.WEBGL,
    pixelArt: true,
    roundPixels: true,
    parent: 'content',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 800
            },
            debug: false
        }
    },
    scene: [
        ResourceLoaderScene,
        GameScene
    ]
};

const game = new Phaser.Game(config); // eslint-disable-line no-unused-vars
