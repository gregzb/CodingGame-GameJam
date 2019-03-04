import Phaser from 'phaser';
import Button from '../helpers/Button.js';
import TextButton from '../helpers/TextButton.js';
import ScrollBar from '../helpers/ScrollBar.js';

class MainMenuScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'MainMenuScene'
        });
    }

    create() {
        this.cam = this.cameras.main;

        this.currentState = "main";
        this.nextState = this.currentState;

        this.background = this.add.image(0, 0, "menuBackground").setOrigin(0, 0);

        this.title = this.add.image(this.cam.width / 2, -70, "titleImage").setOrigin(0.5, 0).setScale(4);

        this.levelScrollBar = new ScrollBar(this, {
            x: 510,
            y: 110,
            width: 20,
            height: 480,
            bgColor: 0x5f5f5f,
            fgColor: 0xcfcfcf,
            onScroll: (scrollAmount) => {
                console.log(scrollAmount);
                // const numBoardBlocks = this.blockManager.boardBlocks.length + 1;
                // if (Number.isFinite(scrollAmount)) {
                //     this.blockManager.startBlock.y = this.blockManager.startBlock.defaultPos.y - (this.scrollBar.value * (Phaser.Math.Clamp(numBoardBlocks - 6, 0, Infinity) * 14 * 6 + 7 * 6));
                // } else {
                //     this.blockManager.startBlock.y = this.blockManager.startBlock.defaultPos.y;
                // }
            }
        });

        this.levelMaskGraphics = this.make.graphics();
        this.levelMaskGraphics.fillStyle(0xffffff);
        this.levelMaskGraphics.beginPath();
        this.levelMaskGraphics.fillRect(0, 110, this.cam.width, this.cam.height);

        this.levelMask = this.levelMaskGraphics.createGeometryMask();

        this.levelScrollBar.setSize(0.5);

        this.mainButtons = [
            new TextButton({
                scene: this, 
                x: this.cam.width / 2, 
                y: 150, 
                texture: 'menuButton',
                canSetActive: false,
                offsetX: 0,
                offsetY: 25,
                text: "Play",
                textSize: 150,
                buttonPressed: (button) => this.buttonPressed(button)
            }).setOrigin(0.5, 0).setScale(7)
        ];

        this.levelButtons = [
            new Button({
                scene: this, 
                x: 0, 
                y: this.cam.height, 
                texture: 'backButton',
                canSetActive: false,
                buttonPressed: (button) => this.buttonPressed(button)
            }).setOrigin(0, 1).setScale(5)
        ];

        for (let i = 0; i < 10; i++) {
            this.levelButtons.push(new TextButton({
                scene: this, 
                x: this.cam.width / 2, 
                y: 110 + (16 * 6 * i + 10 * i), 
                texture: 'menuButton',
                canSetActive: false,
                offsetX: 0,
                offsetY: 30,
                text: "Level " + (i + 1),
                textSize: 85,
                buttonPressed: (button) => this.buttonPressed(button)
            }).setOrigin(0.5, 0).setScale(6).setMask(this.levelMask));
        }

    }

    buttonPressed(button) {
        console.log("A button was pressed");
        if (button.texture.key === "backButton") {
            if (this.currentState === "levelSelection") {
                this.nextState = "main";
            }
        }
        else if (button.text){
            if (button.text.text === "Play") {
                this.nextState = "levelSelection";
            }
        }
    }

    update(time, delta) {
        this.currentState = this.nextState;
        if (this.currentState === "main") {
            this.hideButtons();
            this.levelScrollBar.setVisible(false);
            this.mainButtons.forEach((button) => {
                button.setVisible(true);
                button.update(time, delta);
            });
        } else if (this.currentState === "levelSelection") {
            this.hideButtons();
            this.levelScrollBar.setVisible(true);
            this.levelScrollBar.update();
            this.levelButtons.forEach((button) => {
                button.setVisible(true);
                if (button.text) {
                    button.y = button.startY - (this.levelScrollBar.value * 580);
                }
                button.update(time, delta);
            });
        }
    }

    hideButtons() {
        this.mainButtons.forEach((button) => {
            button.setVisible(false);
        });
        this.levelButtons.forEach((button) => {
            button.setVisible(false);
        });
    }

    updateViewport() {
        
    }
}

export default MainMenuScene;
