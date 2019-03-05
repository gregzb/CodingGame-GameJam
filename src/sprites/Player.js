import Phaser from "phaser";

export default class Player extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.texture, config.frame);
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);
        this.alive = true;

        //this.body.allowGravity = false;

        this.body.setCollideWorldBounds(true);

        this.body.setSize(16, 17);
        this.body.offset.set(4, 7);

        this.acceleration = 400;

        this.body.maxVelocity.x = 150;
        this.body.maxVelocity.y = 500;

        this.running = false;
        this.prevRunning = this.running;
        this.jumping = false;
        this.onGround = this.body.blocked.down;
        this.prevGround = this.onGround;
        this.prevFlipX = this.flipX;
        this.nextFlipX = this.flipX;
        this.prevInput = {};

        this.startPosX = this.x;
        this.startPosY = this.y;

        this.input = {
            right: false,
            left: false,
            jump: false
        };

        this.movingRight = true;

        this.tempSprites = [];
        this.prevVelocity = this.body.velocity;

        this.footstepSound = this.scene.sound.add('footstep', {volume: 0.15, loop: true, rate: 1.4});
    }

    updateSprite(keys, time, delta) {

        //console.log("velocity", this.body.velocity);

        //console.log(this.nextFlipX);

        for (const tempSprite of this.tempSprites) {
            if (tempSprite.currentAlpha <= 0) {
                this.tempSprites.shift();
                tempSprite.destroy();
            }
            const dtSec = delta/1000;
            tempSprite.currentAlpha -= dtSec * 5;
            tempSprite.setAlpha(tempSprite.currentAlpha);
        }

        //this.input = this.getInput(keys);
        if (!this.prevInput) {
            this.prevInput = this.input;
        }

        //this.flipX = this.nextFlipX;

        this.onGround = this.body.blocked.down;

        if (this.body.maxVelocity.x > 150) {
            this.body.maxVelocity.x *= 0.75 * delta * 0.06;
        } else {
            this.body.maxVelocity.x = 150;
        }

        //console.log(this.input);

        if (this.input.right) {
            this.body.setAccelerationX(this.acceleration);
        } else if (this.input.left) {
            this.body.setAccelerationX(-this.acceleration);
        } else {
            this.body.velocity.x *= 0.75;
            if (Math.abs(this.body.velocity.x) < 0.5) {
                this.body.velocity.x = 0;
            }
            this.body.setAccelerationX(0);
        }

        this.running = Math.abs(this.body.velocity.x) > 1;

        this.jump(this.input.jump && !this.prevInput.jump);

        if (!this.onGround) {
            this.anims.play("jump");
        } else {
            if (
                (this.running && !this.prevRunning) ||
                (this.onGround && !this.prevGround)
            ) {
                this.anims.play("run");
            } else if (!this.running) {
                this.anims.play("idle");
            }
        }

        if (this.body.velocity.x > 150) {
            let temp = new Player({
                scene: this.scene,
                x: this.x,
                y: this.y,
                texture: "player",
                frame: "MortMortSprite-3.png"
            });
            this.scene.physics.world.disable(temp);
            temp.currentAlpha = 0.75;
            temp.setAlpha(temp.currentAlpha);
            temp.parent = this;
            temp.setTint(0xb2ddff);
            this.tempSprites.push(temp);

            this.anims.play("dash");
        }

        if (this.body.velocity.x >= 10 && this.body.velocity.x <= 150 && (this.prevVelocity.x < 10 || this.prevVelocity.x > 150)) {
            this.footstepSound.play();
        } else if (this.body.velocity.x < 10 || this.body.velocity.x > 150) {
            this.footstepSound.stop();
        }

        this.flipX = this.body.velocity.x === 0 ? this.prevFlipX : this.body.velocity.x < 0;

        this.prevRunning = this.running;
        this.prevGround = this.onGround;
        this.prevFlipX = this.flipX;
        this.prevInput = Object.assign({}, this.input);

        this.prevVelocity = Object.assign({}, this.body.velocity);

        //Game control part
        //this.prevInput.jump = false;
    }

    jump(jumpDown) {
        //console.log(jumpDown);
        if (jumpDown && !this.jumping && this.onGround) {
            this.jumping = true;

            //Game control part
            this.input.jump = false;

            this.body.acceleration.y = -1000;
            this.body.setVelocityY(-300);
            //console.log("Jumped");
        } else {
            this.body.acceleration.y = 0;
            if (this.body.blocked.down) {
                this.jumping = false;
            }
        }
    }

    moveForward() {
        if (this.input.right || this.input.left) {
            return;
        }
        this.input.right = this.movingRight;
        this.input.left = !this.movingRight;
    }

    isMovingForward() {
        return this.input.right || this.input.left;
    }

    stopMoving() {
        this.input.left = this.input.right = false;
    }

    changeDirection() {
        this.movingRight = !this.movingRight;
        if (this.isMovingForward()) {
            this.input.right = this.movingRight;
            this.input.left = !this.movingRight;
        }
    }

    extJump() {
        //this.prevInput.jump = false;
        //this.input.jump = true;
        this.jump(true);
    }

    dash() {
        this.body.maxVelocity.x = 1500;
        this.body.velocity.x = 1500 * (this.movingRight ? 1 : -1);
    }

    doNothing() {}

    getInput(keys) {
        return {
            left: keys.left.isDown,
            right: keys.right.isDown,
            down: keys.down.isDown,
            jump: keys.jump.isDown || keys.jump2.isDown
        };
    }
}
