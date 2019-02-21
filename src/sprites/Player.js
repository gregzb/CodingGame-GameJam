import Phaser from 'phaser';

export default class Player extends Phaser.GameObjects.Sprite{

    constructor(config) {
        super(config.scene, config.x, config.y, config.texture, config.frame);
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);
        this.alive = true;

        this.body.setCollideWorldBounds(true);
        //this.body.setBounce(0.5,0.5);

        // start still and wait until needed
        //this.body.setCollideWorldBounds(true);
        //this.body.setVelocity(0, 0).setBounce(0, 0).setCollideWorldBounds(false);
        //this.body.allowGravity = false;
        //this.beenSeen = false;

        this.body.setSize(16, 18);
        this.body.offset.set(4, 6);

        //this.body.setAllowGravity(true);

        //this.body.setDrag(100,100);
        //this.body.drag.sest(0.9,0.1);
        //this.body.useDamping = true;

        //this.body.useDamping = true;
        //this.body.drag.x = .5;
        //this.body.drag.y = 1.5;
        console.log(this.body.drag);

        this.acceleration = 400;

        this.body.maxVelocity.x = 150;
        this.body.maxVelocity.y = 500;

        //this.body.maxVelocity.set(150,this.body.maxVelocity.y);
        //this.body.friction.set(100, 100);
        console.log(this.body);

        this.running = false;
        this.prevRunning = this.running;
        this.jumping = false;
        this.onGround = this.body.blocked.down;
        this.prevGround = this.onGround;
        this.prevFlipX = this.flipX;
        this.prevInput = {};
    }

    updateSprite(keys, time, delta) {
        this.input = this.getInput(keys);
        if (!this.prevInput) {
            this.prevInput = this.input;
        }

        this.onGround = this.body.blocked.down;

        if (this.input.right) {
            this.body.setAccelerationX(this.acceleration);
        } else if (this.input.left) {
            this.body.setAccelerationX(-this.acceleration);
        } else {
            this.body.velocity.x *= 0.75;
            if (Math.abs(this.body.velocity.x) < .5) {
                this.body.velocity.x = 0;
            }
            this.body.setAccelerationX(0);
        }

        //1 is an arbitrary num greater than 0
        if (Math.abs(this.body.velocity.x) > 1) {
            if (this.running === false && !this.jumping) {
                //this.anims.play("run");
            }
            this.running = true;
        } else {
            this.running = false;
            //this.anims.play("idle");
        }

        this.jump(this.input.jump && !this.prevInput.jump);

        // if (input.jump && !this.jumping) {
        //     this.jump();
        //     //this.anims.play("jump");
        // } else {
        //     this.body.acceleration.y = 0;
        // }

        if (!this.onGround) {
            this.anims.play("jump");
        } else {
            if (this.running && !this.prevRunning || this.onGround && !this.prevGround) {
                this.anims.play("run");
            } else if (!this.running){
                this.anims.play("idle");
            }
        }

        // if (this.onGround) {
        //     if (this.jumping) {
        //         if (this.running) {
        //             this.anims.play("run");
        //         } else {
        //             this.anims.play("idle");
        //         }
        //     }
        //     this.jumping = false;
        // }

        //console.log(this.body.);
        //console.log((this.body.velocity.x === 0 ? this.prevFlipX : true));
        this.flipX = this.body.velocity.x === 0 ? this.prevFlipX : this.body.velocity.x < 0;
        // console.log();
        // console.log(this.body.velocity);
        // console.log(this.body.acceleration);
        //console.log(this.body.touching);
        //console.log(this.body.onFloor());
        this.prevRunning = this.running;
        this.prevGround = this.onGround;
        this.prevFlipX = this.flipX;
        this.prevInput = this.input;
    }

    jump(jumpDown) {
        if (jumpDown && !this.jumping && this.onGround) {
            this.jumping = true;
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

    getInput(keys) {
        return {
            left: keys.left.isDown,
            right: keys.right.isDown,
            down: keys.down.isDown,
            jump: keys.jump.isDown || keys.jump2.isDown,
        };
    }
}