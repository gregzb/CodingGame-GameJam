import Phaser from 'phaser';

export default class ScrollBar extends Phaser.GameObjects.Graphics {
    constructor(scene, config) {
        super(scene);
        this.scene = scene;
        this.scene.add.existing(this);

        //config should have x, y, width, height, scrollCallback from 0 to 1, colors
        this.config = config;

        //this.size = 1;
        this.hitArea = new Phaser.Geom.Rectangle(this.config.x + 4, this.config.y + 4, this.config.width - 8, this.config.height - 8);

        this.value = 0;

        this.scrollPart = this.scene.add.graphics();
        this.scrollPart.setInteractive({ 
            useHandCursor: true, 
            hitArea: this.hitArea,
            hitAreaCallback: (hitArea, x, y, gameObject) => {
                const rect1 = {
                    x: hitArea.x,
                    y: hitArea.y,
                    width: hitArea.width,
                    height: hitArea.height
                };
                const rect2 = {
                    x: x,
                    y: y,
                    width: 0,
                    height: 0
                };
                if (rect1.x < rect2.x + rect2.width &&
                    rect1.x + rect1.width > rect2.x &&
                    rect1.y < rect2.y + rect2.height &&
                    rect1.y + rect1.height > rect2.y) {
                     return true;
                 }
                 return false;
            },
            draggable: true
        });

        //console.log(this.hitArea.height);

        this.setSize(1);

        this.scrollPart.on('dragstart', (pointer, dragX, dragY) => {
            //console.log(dragX, dragY);
            //this.hitArea.y = pointer.position.y;
            //this.updateHitbox();
            this.startDrag = {
                x: this.hitArea.x,
                y: this.hitArea.y
            };
        });

        this.scrollPart.on('drag', (pointer, dragX, dragY) => {
            //console.log(this.hitArea.height);
            //console.log(dragX, dragY);
            //console.log(Object.assign({}, pointer));
            this.hitArea.y = Phaser.Math.Clamp(this.startDrag.y + dragY, this.config.y+4, this.config.y+4 + (this.config.height - 8) * (1-this.size));
            this.value = (this.hitArea.y - (this.config.y + 4)) / ((this.config.height - 8) * (1-this.size));
            this.config.onScroll(this.value);
            this.updateHitbox();
        });

        // this.displayOriginX = this.config.x;
        // this.displayOriginY = this.config.y;
        // this.scrollPart.displayOriginX = this.config.x + 4;
        // this.scrollPart.displayOriginY = this.config.y + 4;

        // this.scrollPart.on('pointerover', (pointer, x, y, event) => {
        //     console.log('pointer is over');
        //     this.setSize(0.5);
        // });
        //this.scene.input.setDraggable(this.scrollPart);

        //this.setInteractive({ useHandCursor: false });
        //this.scene.input.setDraggable(this);
    }

    setVisible(visible) {
        super.setVisible(visible);
        this.scrollPart.setVisible(visible);
    }

    setSize(newSize) {
        this.size = Phaser.Math.Clamp(newSize, 0, 1);
        this.hitArea.height = (this.config.height - 8) * this.size;
        this.updateHitbox();
    }

    updateHitbox() {
        this.scrollPart.setInteractive({hitArea: this.hitArea});
    }

    updateChildren() {
        this.scrollPart.clear();
        this.scrollPart.fillStyle(this.config.fgColor);
        //this.scrollPart.fillRoundedRect(this.config.x + 4, this.config.y + 4, this.config.width - 8, this.config.height - 8, 8);
        this.scrollPart.fillRoundedRect(this.hitArea.x, this.hitArea.y, this.hitArea.width, this.hitArea.height, 8);
        
    }

    update(time, delta) {
        //console.log(this.value);
        const newY = Phaser.Math.Clamp(this.hitArea.y, this.config.y+4, this.config.y+4 + (this.config.height - 8) * (1-this.size));
        if (Math.abs(newY - this.hitArea.y) > 0.00001) {
            this.hitArea.y = newY;
            this.value = (this.hitArea.y - (this.config.y + 4)) / ((this.config.height - 8) * (1-this.size));
            this.config.onScroll(this.value);
        }
        // console.log(this.value);
        // console.log(Math.abs((this.hitArea.y - (this.config.y + 4)) / ((this.config.height - 8) * (1-this.size)) - this.value));
        // if (Math.abs((this.hitArea.y - (this.config.y + 4)) / ((this.config.height - 8) * (1-this.size)) - this.value) > 0.00001) {
        //     this.value = (this.hitArea.y - (this.config.y + 4)) / ((this.config.height - 8) * (1-this.size));
        //     this.config.onScroll(this.value);
        // }

        this.clear();
        this.fillStyle(this.config.bgColor);
        this.fillRoundedRect(this.config.x, this.config.y, this.config.width, this.config.height, 10);
        this.updateChildren();
    }

    clearResources() {
        this.destroy();
    }
}