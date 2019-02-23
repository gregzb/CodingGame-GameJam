import Button from './Button.js';
import config from './buttonInfo.json';

export default class ButtonManager {
    constructor(scene) {
        this.scene = scene;
        this.config = config;
        this.buttons = [];
        for (let i = 0; i < config.buttons.length; i++) {
            const button = config.buttons[i];
            this.buttons.push(new Button({
                scene: scene, 
                x: config.initX + (config.offsetX * i * 4), 
                y: config.initY + (config.offsetY * i * 4), 
                texture: button.name,
                canSetActive: true,
                buttonPressed: (button) => this.buttonPressed(button)
            }).setOrigin(0,0).setScale(4));
        }

        this.buttons[0].isActive = true;
        this.buttons[0].updateButton();

        this.nameDict = {
            "movementButton": "Movement",
            "clockButton": "Control",
            "actionButton": "Action",
            "attackButton": "Attack"
        };
    }

    resetActiveButtons() {
        this.buttons.forEach((element) => 
        {
            element.isActive = false;
            element.updateButton();
        });
    }

    buttonPressed(button) {
        this.resetActiveButtons();
        this.scene.blockManager.setToolbar(this.nameDict[button.texture.key]);
    }

    getActiveButton() {
        return this.buttons.find((element) => element.isActive === true);
    }

    update(time, delta) {

    }
}