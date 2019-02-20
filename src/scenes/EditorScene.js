import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles.min.js';
import Phaser from 'phaser';

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

        this.cam.startFollow(this.background);

        this.registry.set('divider', 600);

    }

    update(time, delta) {
        if (this.input.mousePointer.position.x > 600 &&
            this.input.mousePointer.prevPosition.x < 600) {
            this.scaleSize(false);
        } else if (this.input.mousePointer.position.x < 200 &&
            this.input.mousePointer.prevPosition.x > 200) {
            this.scaleSize(true);
        }
        console.log(this.registry.get('divider'));
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
