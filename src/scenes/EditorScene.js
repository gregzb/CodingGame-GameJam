import AnimatedTiles from "phaser-animated-tiles/dist/AnimatedTiles.min.js";
import Button from "../helpers/Button";
import Phaser from "phaser";
import ButtonManager from "../helpers/ButtonManager";

import blockData from "../helpers/blockData.json";
import CodeBlock from "../helpers/CodeBlock";
import CodeBlockManager from "../helpers/CodeBlockManager";
import ScrollBar from "../helpers/ScrollBar";

class EditorScene extends Phaser.Scene {
    constructor(config) {
        super({
            key: "EditorScene"
        });
        //console.log(config);
    }

    preload() {
        //this.load.scenePlugin('animatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles');
    }

    create(config) {

        //console.log(config);

        //this.physics.world.TILE_BIAS = 32;
        //this.physics.world.setFPS(1);

        //this.scale.setParentSize(800, 600);

        this.zoom = 1;

        this.gameScene = this.scene.launch("GameScene", config);
        this.gameUIScene = this.scene.launch("GameUIScene", config);
        this.cam = this.cameras.main;

        this.cam.roundPixels = true;
        this.cam.setViewport(0, 0, 600, 600);

        this.cam.zoomTo(this.zoom, 0);

        //this.cam.scrollX = 300/this.zoom;

        this.background = this.add.image(300, 300, "editorUI").setScale(4);

        this.buttonManger = new ButtonManager(this);

        //this.blocks = [];
        //this.codeBlock2 = new CodeBlock(this, blockData.blockData.Misc.startGame, blockData.blockShapes).setOrigin(0,0).setScale(6);
        //this.addNewBlock();
        this.blockManager = new CodeBlockManager(this);

        const savedBoardBlocks = this.registry.get('blocksLevel' + config.level);
        //console.log(savedBoardBlocks);
        if (savedBoardBlocks) {
            console.log(savedBoardBlocks);
            savedBoardBlocks.forEach((block, index) => {
                const newCodeBlock = new CodeBlock(this, block.blockData, block.blockShapes, this.blockManager).setOrigin(0,0).setScale(6);

                if (index === 0) {
                    newCodeBlock.previousBlock = this.blockManager.startBlock;
                } else {
                    newCodeBlock.previousBlock = this.blockManager.boardBlocks[index - 1];
                }
                newCodeBlock.onBoard = block.onBoard;
                newCodeBlock.wasOnBoard = block.wasOnBoard;

                newCodeBlock.x = block.x;
                newCodeBlock.y = block.y;
                
                this.blockManager.boardBlocks.push(newCodeBlock);
            });

            this.blockManager.boardBlocks.forEach((block, index) => {
                if (index === this.blockManager.boardBlocks.length - 1) {
                    block.nextBlock = null;
                    block.enableSnapZone();
                } else {
                    block.nextBlock = this.blockManager.boardBlocks[index+1];
                }
            });

            this.blockManager.startBlock.nextBlock = this.blockManager.boardBlocks[0];
        }






        this.scrollBar = new ScrollBar(this, {
            x: 560,
            y: 30,
            width: 20,
            height: 540,
            bgColor: 0x5f5f5f,
            fgColor: 0xcfcfcf,
            onScroll: (scrollAmount) => {
                //console.log(scrollAmount);
                const numBoardBlocks = this.blockManager.boardBlocks.length + 1;
                if (Number.isFinite(scrollAmount)) {
                    this.blockManager.startBlock.y = this.blockManager.startBlock.defaultPos.y - (this.scrollBar.value * (Phaser.Math.Clamp(numBoardBlocks - 6, 0, Infinity) * 14 * 6 + 7 * 6));
                } else {
                    this.blockManager.startBlock.y = this.blockManager.startBlock.defaultPos.y;
                }
            }
        });

        this.backButton = new Button({
            scene: this, 
            x: 0, 
            y: this.cam.height, 
            texture: 'backButton',
            canSetActive: false,
            buttonPressed: (button) => this.buttonPressed(button)
        }).setOrigin(0, 1).setScale(5);

        this.input.on("pointerdown", () => {
            for (const codeBlock of this.blockManager.allBlocks()) {
                if (codeBlock.inputField) {
                    codeBlock.inputField.editing = false;
                }
            }
        });

        this.registry.set("divider", 600);
        this.registry.set("editorActive", true);

    }

    buttonPressed(button) {
        this.sound.play('pop1', {volume: 0.2});
        if (button.texture.key === "backButton") {
            this.scene.stop("GameUIScene");
            this.scene.stop("GameScene");
            this.scene.start("MainMenuScene");
        }
        //console.log("Button " + button + " was pressed");
    }

    update(time, delta) {

        this.scrollBar.update();

        const numBoardBlocks = this.blockManager.boardBlocks.length + 1;
        this.scrollBar.setSize(1 - Phaser.Math.Clamp((numBoardBlocks-6) / numBoardBlocks, 0, 1));
        this.blockManager.update(time, delta);
        if (this.registry.get("divider") > 599) {
            this.registry.set("editorActive", true);
        } else if (this.registry.get("divider") < 201) {
            this.registry.set("editorActive", false);
            for (const codeBlock of this.blockManager.allBlocks()) {
                if (codeBlock.inputField) {
                    codeBlock.inputField.editing = false;
                }
            }
        }
        if (
            this.input.activePointer.position.x > 600 &&
            this.input.activePointer.prevPosition.x < 600
        ) {
            this.scaleSize(false);
        } else if (
            this.input.activePointer.position.x < 200 &&
            this.input.activePointer.prevPosition.x > 200
        ) {
            this.scaleSize(true);
        }
    }

    scaleSize(large) {
        let cam = this.cam;
        if (large) {
            let tweenToEditor = this.tweens.add({
                targets: this.registry.list,
                props: {
                    divider: {
                        value: function() {
                            return 600;
                        },
                        ease: "Power1"
                    }
                },
                duration: 600,
                yoyo: false,
                repeat: 0,
                onUpdate: () => {
                    cam.setViewport(0, 0, this.registry.get("divider"), 600);
                    this.registry.get("updateViewport")();
                    this.registry.get("updateUIViewport")();
                }
            });
        } else {
            let tweenToGame = this.tweens.add({
                targets: this.registry.list,
                props: {
                    divider: {
                        value: function() {
                            return 200;
                        },
                        ease: "Power1"
                    }
                },
                duration: 600,
                yoyo: false,
                repeat: 0,
                onUpdate: () => {
                    cam.setViewport(0, 0, this.registry.get("divider"), 600);
                    this.registry.get("updateViewport")();
                    this.registry.get("updateUIViewport")();
                }
            });
        }
    }
}

export default EditorScene;
