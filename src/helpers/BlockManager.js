import Button from './CodeBlock.js';
import blockData from './blockInfo.json';

export default class ButtonManager {
    constructor(scene) {
        this.config = config;
        this.buttons = [];
        for (let i = 0; i < config.buttons.length; i++) {
            const button = config.buttons[i];
            this.buttons.push(new Button({
                scene: scene, 
                x: config.initX + (config.offsetX * i * 4), 
                y: config.initY + (config.offsetY * i * 4), 
                texture: button.name, 
                resetCallback: () => this.resetActiveButtons()
            }).setOrigin(0,0).setScale(4));
        }

        this.buttons[0].isActive = true;
        this.buttons[0].updateButton();
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