import Button from './Button.js';
import config from './buttonInfo.json';

export default class ButtonManager {
    constructor(scene) {
        this.config = config;
        this.buttons = [];
        for (let i = 0; i < config.buttons.length; i++) {
            const button = config.buttons[i];
            this.buttons.push(new Button({
                scene: scene, 
                x: config.initX + (config.offsetX * i), 
                y: config.initY + (config.offsetY * i), 
                texture: button.name, 
                resetCallback: () => this.resetActiveButtons()
            }).setOrigin(0,0));
        }

        this.buttons[1].isActive = true;
        this.buttons[1].updateButton();
    }

    resetActiveButtons() {
        this.buttons.forEach((element) => 
        {
            element.isActive = false;
            element.updateButton();
        });
    }

    getActiveButton() {
        return this.buttons.find((element) => element.isActive === true);
    }

    update(time, delta) {

    }
}