import Phaser from "phaser";
import Player from "../sprites/Player";
import AnimatedTiles from "phaser-animated-tiles/dist/AnimatedTiles.min.js";

export default class Level {
    constructor(scene, data) {
        this.scene = scene;

        //data may include key, tilesetImageKey, tileSetKey
        this.data = data;

        this.scene.load.scenePlugin(
            "animatedTiles",
            AnimatedTiles,
            "animatedTiles",
            "animatedTiles"
        );

        this.scene.registry.set("levelRef", this);

        //this.startTicks = 0;
        this.currentTicks = 0;
    }

    getScore() {
        return 1000;
    }

    init(config) {
        this.level = config.level;

        this.map = this.scene.make.tilemap({
            key: "map" + config.level
        });
        this.tileset = this.map.addTilesetImage("Tileset", "tiles");
        this.winset = this.map.addTilesetImage("spritesheet", "win");
        this.groundLayer = this.map.createStaticLayer(
            "Land",
            this.tileset,
            0,
            0
        );
        this.otherLayer = this.map.createDynamicLayer(
            "Goal",
            this.winset,
            0,
            0
        );

        //this.objectLayer = this.map.getObjectLayer('enemies');

        this.groundLayer.setCollisionBetween(0, 100);

        //this.otherLayer.setCollisionBetween(0, 100);

        //console.log(this.scene.sys.animatedTiles);

        this.scene.sys.animatedTiles.init(this.map);

        // Probably not the correct way of doing this:
        this.scene.physics.world.bounds.width = this.groundLayer.width;
        this.scene.physics.world.bounds.height = this.groundLayer.height * 2;
        this.scene.physics.world.bounds.y -= 100;

        this.keys = {
            jump: this.scene.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.W
            ),
            jump2: this.scene.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.SPACE
            ),
            //fire: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
            left: this.scene.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.A
            ),
            right: this.scene.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.D
            ),
            down: this.scene.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.S
            )
        };

        this.playerSprite = new Player({
            scene: this.scene,
            x: 0,
            y: 0,
            texture: "player",
            frame: "MortMortSprite-1.png"
        });

        let playerAnimations = {
            idle: this.scene.anims.generateFrameNames("player", {
                start: 1,
                end: 1,
                zeroPad: 0,
                prefix: "MortMortSprite-",
                suffix: ".png"
            }),
            jump: this.scene.anims.generateFrameNames("player", {
                start: 2,
                end: 2,
                zeroPad: 0,
                prefix: "MortMortSprite-",
                suffix: ".png"
            }),
            dash: this.scene.anims.generateFrameNames("player", {
                start: 3,
                end: 3,
                zeroPad: 0,
                prefix: "MortMortSprite-",
                suffix: ".png"
            }),
            run: this.scene.anims.generateFrameNames("player", {
                start: 4,
                end: 9,
                zeroPad: 0,
                prefix: "MortMortSprite-",
                suffix: ".png"
            })
        };
        this.scene.anims.create({
            key: "idle",
            frames: playerAnimations.idle,
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: "jump",
            frames: playerAnimations.jump,
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: "dash",
            frames: playerAnimations.dash,
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: "run",
            frames: playerAnimations.run,
            frameRate: 10,
            repeat: -1
        });
        this.playerSprite.anims.play("idle");

        // This will watch the player and worldLayer every frame to check for collisions
        this.scene.physics.add.collider(this.playerSprite, this.groundLayer);
        //this.scene.physics.add.overlap(this.playerSprite, this.otherLayer, (object1, object2) => this.onWin(object1, object2));

        this.objectLayer = this.map.getObjectLayer("levelInfo");
        const objects = this.objectLayer.objects;
        objects.forEach(object => {
            if (object.name === "SpawnPoint") {
                this.playerSprite.x = object.x;
                this.playerSprite.y = object.y;
                this.playerSprite.startPosX = object.x;
                this.playerSprite.startPosY = object.y;
            } else if (object.name === "GoalArea") {
                const winZone = this.scene.add
                    .zone(object.x, object.y, object.width, object.height)
                    .setOrigin(0, 0);
                this.scene.physics.world.enable(winZone);
                winZone.body.setAllowGravity(false);

                this.scene.physics.add.overlap(
                    this.playerSprite,
                    winZone,
                    (object1, object2) => this.onWin(object1, object2)
                );
            }
        });

        //this.scene.cam.centerOn(0, 0);
        this.scene.cam.startFollow(this.playerSprite, true, 0.25, 0.25);

        this.startingBlock = this.scene.scene.get(
            "EditorScene"
        ).blockManager.startBlock;
        this.currentBlock = this.startingBlock;

        this.executing = false;
        this.waitingTime = 0;

        this.hasWon = false;

        //this.dashed = false;
    }

    onWin(object1, object2) {
        if (!this.hasWon) {
            const unlockedLevels = this.scene.registry.get("unlockedLevels");
            this.scene.registry.set("unlockedLevels", Math.max(this.level + 2, unlockedLevels));
            this.executing = false;
            this.playerSprite.input = {
                right: false,
                left: false,
                jump: false
            };
            const gameUIScene = this.scene.scene.get("GameUIScene");
            gameUIScene.setWinVisible(true);
            this.hasWon = true;
        }
    }

    update(time, delta) {
        //console.log(delta * 1000);
        //console.log("executeLOL\n\n\n\n\n\n\n\n");
        //console.log(this.zone);

        //console.log(this.executing, this.waitingTime);

        this.waitingTime -= delta;

        //console.log(delta);

        if (this.executing && this.waitingTime <= 0) {
            //console.log("executeLOL\n\n\n\n\n\n\n\n");
            console.log("inside");
            this.currentBlock = this.currentBlock.nextBlock;
            if (this.currentBlock !== null) {
                const func = this.currentBlock.command;

                let args = [];
                if (this.currentBlock.inputField) {
                    const inputNum = Number.parseFloat(
                        this.currentBlock.inputField.inputText.text
                    );
                    if (Number.isFinite(inputNum)) {
                        args.push(inputNum);
                    } else {
                        args.push(0);
                    }
                }

                console.log(func + ": " + args.toString());

                this[func].apply(this, args);
            } else {
                this.executing = false;
            }
        } else if (!this.executing) {
            this.scene.cam.zoomTo(this.scene.initialZoom, 500, "Power2", true);
        }

        this.playerSprite.updateSprite(this.keys, time, delta);
        //console.log("yeet");

        //this.playerSprite.changeDirection();
        //this.playerSprite.moveForward();
        //this.playerSprite.stopMoving();
        //this.playerSprite.extJump();
        //console.log(this.playerSprite.x, this.playerSprite.y);

        //console.log(Object.assign({}, this.playerSprite.body.velocity));
        // if (!this.dashed && time > 2000) {
        //     this.dashed = true;
        //     this.playerSprite.dash();
        // }
    }

    moveForward() {
        this.playerSprite.moveForward();
        console.log("yurt");
    }

    stopMoving() {
        this.playerSprite.stopMoving();
    }

    jump() {
        this.playerSprite.extJump();
    }

    dash() {
        this.playerSprite.dash();
    }

    changeDirection() {
        this.playerSprite.changeDirection();
    }

    delay(amount) {
        //console.log("Delated: " + amount);
        this.waitingTime = amount * 1000;
    }

    doNothing() {}

    executeInstructions() {
        this.stopInstructions();
        this.currentBlock = this.startingBlock;
        this.executing = true;
        this.currentTicks = 0;

        this.scene.cam.zoomTo(this.scene.gameZoom, 500, "Power2", true);

        //this.waitingTime = 500;
        //console.log(this);
        // console.log("executeLOL\n\n\n\n\n\n\n\n");
    }

    stopInstructions() {
        const gameUIScene = this.scene.scene.get("GameUIScene");
        gameUIScene.setWinVisible(false);
        this.hasWon = false;
        this.executing = false;
        this.waitingTime = 500;

        this.playerSprite.input = {
            right: false,
            left: false,
            jump: false
        };

        this.playerSprite.x = this.playerSprite.startPosX;
        this.playerSprite.y = this.playerSprite.startPosY;

        this.playerSprite.body.setAcceleration(0, 0);
        this.playerSprite.body.velocity.x = 0;
        this.playerSprite.body.velocity.y = 0;

        this.playerSprite.flipX = this.playerSprite.nextFlipX = this.playerSprite.prevFlipX = false;
        this.playerSprite.movingRight = true;

        this.scene.cam.zoomTo(this.scene.initialZoom, 500, "Power2", true);
    }

    clearResources() {}
}
