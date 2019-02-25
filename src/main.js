import Phaser from 'phaser';
import './styles/styles.css';
import ResourceLoaderScene from './scenes/ResourceLoaderScene';
import GameScene from './scenes/GameScene';
import EditorScene from './scenes/EditorScene';
import GameUIScene from './scenes/GameUIScene';

const config = {
    // For more settings see <https://github.com/photonstorm/phaser/blob/master/src/boot/Config.js>
    type: Phaser.WEBGL,
    pixelArt: true,
    roundPixels: true,
    parent: 'content',
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.ScaleModes.FIT
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 800
            },
            debug: false
            // debug: true,
            // debugShowBody: true,
            // debugShowStaticBody: true
        }
    },
    scene: [
        ResourceLoaderScene,
        GameScene,
        EditorScene,
        GameUIScene
    ]
};

const game = new Phaser.Game(config); // eslint-disable-line no-unused-vars
