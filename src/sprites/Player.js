import Phaser from 'phaser';

export default class Turtle extends Phaser.GameObjects.Sprite{

    constructor(config) {
        super(config.scene, config.x, config.y, config.texture, config.frame);
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);
        this.alive = true;

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
        this.jumping = false;
    }

    updateSprite(keys, time, delta) {
        let input = this.getInput(keys);

        if (input.right) {
            this.body.setAccelerationX(this.acceleration);
        } else if (input.left) {
            this.body.setAccelerationX(-this.acceleration);
        } else {
            this.body.velocity.x *= 0.75;
            if (Math.abs(this.body.velocity.x) < .5) {
                this.body.velocity.x = 0;
            }
            this.body.setAccelerationX(0);
        }

        if (input.jump && !this.jumping) {
            this.jump();
            this.anims.play("jump");
        } else {
            this.body.acceleration.y = 0;
        }

        //1 is an arbitrary num greater than 0
        if (Math.abs(this.body.velocity.x) > 1) {
            if (this.running === false) {
                this.anims.play("run");
            }
            this.running = true;
        } else {
            this.running = false;
            this.anims.play("idle");
        }

        this.flipX = this.body.velocity.x < 0;
        // console.log();
        // console.log(this.body.velocity);
        // console.log(this.body.acceleration);
        //console.log(this.body.touching);
        //console.log(this.body.onFloor());
    }

    jump() {
        if (!this.jumping) {
            this.jumping = true;
            this.body.acceleration.y = -1000;
            this.body.setVelocityY(-300);
            //console.log("Jumped");
        } else {
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