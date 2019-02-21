import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles.min.js';
import Button from '../helpers/Button';
import Phaser from 'phaser';
import ButtonManager from '../helpers/ButtonManager';

import blockData from '../helpers/blockData.json';

class EditorScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'EditorScene'
        });
    }

    preload() {
        //this.load.scenePlugin('animatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles');
    }

    create() {

        this.zoom = 4;

        this.gameScene = this.scene.launch('GameScene');
        this.cam = this.cameras.main;

        this.cam.roundPixels = true;
        this.cam.setViewport(0, 0, 600, 600);

        this.cam.zoomTo(this.zoom, 0);

        //this.cam.scrollX = 300/this.zoom;

        this.background = this.add.image(300, 300, 'editorUI');

        let buttonManger = new ButtonManager(this);

        // this.actionButton = new Button({scene: this, x: 227, y: 227, texture: 'actionButton'});
        // this.actionButton.setOrigin(0, 0);

        // // this.actionButton = this.add.image(227, 227, 'actionButton').setOrigin(0,0).setInteractive();
        // // this.actionButton.on('pointerdown', () => this.buttonClicked('actionButton') );

        // this.clockButton = this.add.image(227, 227+19, 'clockButton').setOrigin(0,0).setInteractive();
        // this.clockButton.on('pointerdown', () => this.buttonClicked('clockButton') );
        /*this.text2 = this.add.bitmapText(227, 227, 'default', 'Yeet', 72);
        this.text2.setTintFill(0x503030);*/
        //this.text = this.add.bitmapText(225, 225, 'default', 'Yeet', 72);
        //this.text.setTintFill(0xff0000);
        //this.text.setTintFill(0xff0000);

        this.cam.startFollow(this.background);

        this.registry.set('divider', 600);

    }

    buttonClicked(button) {
        console.log("Button " + button + " was pressed");
    }

    update(time, delta) {
        if (this.input.mousePointer.position.x > 600 &&
            this.input.mousePointer.prevPosition.x < 600) {
            this.scaleSize(false);
        } else if (this.input.mousePointer.position.x < 200 &&
            this.input.mousePointer.prevPosition.x > 200) {
            this.scaleSize(true);
        }
        //console.log(this.registry.get('divider'));
    }

    scaleSize(large) {
        let cam = this.cam;
        if (large) {
            //this.cam.setViewport(0, 0, this.registry.get('divider'), 600);
            //this.background.position
            //this.tweens.existing(this.tweenToEditor);
            let tweenToEditor = this.tweens.add({
                targets: this.registry.list,
                props: {
                    divider: { value: function () { return 600; }, ease: 'Power1' }
                },
                duration: 600,
                yoyo: false,
                repeat: 0,
                onUpdate: () => {
                    cam.setViewport(0, 0, this.registry.get('divider'), 600);
                    this.registry.get('updateViewport')();
                }
            });
        } else {
            let tweenToGame = this.tweens.add({
                targets: this.registry.list,
                props: {
                    divider: { value: function () { return 200; }, ease: 'Power1' }
                },
                duration: 600,
                yoyo: false,
                repeat: 0,
                onUpdate: () => {
                    cam.setViewport(0, 0, this.registry.get('divider'), 600);
                    this.registry.get('updateViewport')();
                }
            });
        }
    }
}

export default EditorScene;
