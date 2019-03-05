import Phaser from 'phaser';
import Button from '../helpers/Button.js';
import { throws } from 'assert';
import TextButton from '../helpers/TextButton.js';

class GameScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'GameUIScene'
        });
    }

    create(config) {
        this.registry.set('updateUIViewport', () => this.updateViewport());
        this.cam = this.cameras.main;

        this.level = config.level;
        //this.cam.scrollX = this.cam.width/2;
        //this.cam.scrollY = this.cam.height/2;

        this.hasUpdated = false;

        this.levelRef = this.registry.get('levelRef');

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

        //this.timer = this.add.bitmapText(10 + 7 * 6 * 2 + 10 * 2, 10, "default", "", 1000, 1);
        this.timer = this.add.bitmapText(10 + 7 * 6 * 2 + 10 * 2 + 10, 10, "default", "999", 120, 1);

        //this.messageBox = this.add.image(this.cam.width/2, this.cam.height/2, 'bigMessageBox');
        //this.messageBox = this.add.image(this.cam.width/2, this.cam.height/2, 'bigMessageBox');
        this.levelEndContainer = this.add.container(0, 0);
        this.levelEndContainer.add(this.add.image(300, 300, 'bigMessageBox').setScale(15).setAlpha(0.95));
        this.levelEndContainer.add(this.add.bitmapText(300, 100, "default", "Level " + (this.level + 1) + "\nComplete", 100, 1).setOrigin(0.5, 0).setTintFill(0x082e59));
        this.levelEndContainer.add(this.add.bitmapText(300, 240, "default", "Time: " + (Math.round(this.levelRef.maxTime - this.levelRef.remainingTime).toFixed(1) + "s"), 100, 1).setOrigin(0.5, 0).setTintFill(0x176ed1));
        this.levelEndContainer.add(this.add.bitmapText(300, 310, "default", "Score: " + this.levelRef.getScore(), 110, 1).setOrigin(0.5, 0).setTintFill(0x176ed1));
        this.levelEndContainer.add(new TextButton({
            scene: this, 
            x: 200, 
            y: 400, 
            texture: 'menuButton',
            canSetActive: false,
            offsetX: 0,
            offsetY: 7,
            text: "Main\nMenu",
            textSize: 60,
            buttonPressed: (button) => this.buttonPressed(button)
        }).setOrigin(0.5, 0).setScale(5));
        this.levelEndContainer.add(new TextButton({
            scene: this, 
            x: 400, 
            y: 400, 
            texture: 'menuButton',
            canSetActive: false,
            offsetX: 0,
            offsetY: 7,
            text: "Try\nAgain",
            textSize: 60,
            buttonPressed: (button) => this.buttonPressed(button)
        }).setOrigin(0.5, 0).setScale(5));

        this.setWinVisible(false);
    }

    setTimerText(text) {
        this.timer.text = text;
    }

    setWinVisible(visible) {
        this.levelEndContainer.setVisible(visible);
        [4, 5].forEach(num => this.levelEndContainer.getAt(num).setVisible(visible));
    }

    buttonPressed(button) {
        //console.log(button.texture.key + " pressed");
        this.sound.play('pop1', {volume: 0.15});
        const gameScene = this.scene.get("GameScene");
        if (button.texture.key === "greenFlag") {
            gameScene.level.executeInstructions();
        } else if (button.texture.key === "stopSign") {
            gameScene.level.stopInstructions();
        } else if (button.text) {
            console.log(button.text.text);
            if (button.text.text === "Main\nMenu") {
                this.scene.stop("GameScene");
                this.scene.stop("EditorScene");
                this.scene.start("MainMenuScene");
            } else if (button.text.text === "Try\nAgain") {
                this.levelRef.stopInstructions();
                this.setWinVisible(false);
            }
        }
    }

    update(time, delta) {
        if (!this.hasUpdated) {
            this.hasUpdated = true;
            this.updateViewport();
        }
        this.levelEndContainer.getAt(2).text = "Time: " + (this.levelRef.maxTime - this.levelRef.remainingTime).toFixed(1) + "s";
        this.levelEndContainer.getAt(3).text = "Score: " + this.levelRef.getScore().toFixed(1);
        // this.messageBox.x = this.cam.width/2;
        // this.messageBox.y = this.cam.height/2;
        //console.log(Object.assign({}, this.cam.worldView));
    }

    updateViewport() {
        this.cam.setViewport(this.registry.get('divider'), 0, 800-this.registry.get('divider'), 600);
    }
}

export default GameScene;
