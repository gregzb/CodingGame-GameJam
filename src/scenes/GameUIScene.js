import Phaser from 'phaser';
import Button from '../helpers/Button.js';
import { throws } from 'assert';

class GameScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'GameUIScene'
        });
    }

    create() {
        this.registry.set('updateUIViewport', () => this.updateViewport());
        this.cam = this.cameras.main;
        //this.cam.scrollX = this.cam.width/2;
        //this.cam.scrollY = this.cam.height/2;

        this.hasUpdated = false;

        //this.greenFlag = this.add.image(this.cam.centerX, this.cam.centerY, 'greenFlag').setOrigin(0,0).setScale(10);
        this.startButton = new Button({
            scene: this, 
            x: 10, 
            y: 10, 
            texture: 'greenFlag',
            canSetActive: false,
            buttonPressed: (button) => this.buttonPressed(button)
        }).setOrigin(0,0).setScale(6);

        this.stopButton = new Button({
            scene: this, 
            x: 10 + 7 * 6 + 10, 
            y: 10, 
            texture: 'stopSign',
            canSetActive: false,
            buttonPressed: (button) => this.buttonPressed(button)
        }).setOrigin(0,0).setScale(6);
    }

    buttonPressed(button) {
        //console.log(button.texture.key + " pressed");
        const gameScene = this.scene.get("GameScene");
        if (button.texture.key === "greenFlag") {
            gameScene.level.executeInstructions();
        } else if (button.texture.key === "stopSign") {
            gameScene.level.stopInstructions();
        }
    }

    update(time, delta) {
        if (!this.hasUpdated) {
            this.hasUpdated = true;
            this.updateViewport();
        }
        //console.log(Object.assign({}, this.cam.worldView));
    }

    updateViewport() {
        this.cam.setViewport(this.registry.get('divider'), 0, 800-this.registry.get('divider'), 600);
    }
}

export default GameScene;
