class Sprite {
    constructor({ position, imageSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 } }) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.frameCurrent = 0
        this.frameElapsed = 0
        this.frameHold = 5
        this.offset = offset
    }

    draw() {
        c.fillStyle = 'rgba(0, 0, 0, 0.17)';
        c.fillRect(0, 0, cvs.width, cvs.height);
        c.drawImage(
            this.image,
            this.frameCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale);
    }

    animateFrames() {
        this.frameElapsed++

        if (this.frameElapsed % this.frameHold === 0) {
            if (this.frameCurrent < this.framesMax - 1) {
                this.frameCurrent++;
            } else {
                this.frameCurrent = 0;
            }
        }
    }

    update() {
        this.draw();
        this.animateFrames();
    }
}

class Fighters extends Sprite {
    constructor({
        position,
        velocity,
        color,
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 },
        sprites,
        attackBox = {
            offset: {},
            width: undefined,
            height: undefined,
        }
    }) {

        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        });

        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastkey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.color = color
        this.isAttacking = false
        this.health = 100
        this.frameCurrent = 0
        this.frameElapsed = 0
        this.frameHold = 5
        this.sprites = sprites
        this.jumps = 0;
        this.death = false;
        for (let sprite in sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
    }

    update() {
        this.draw();
        if (!this.death) this.animateFrames();

        // attack boxes
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        // c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= cvs.height - 96) {
            this.velocity.y = 0;
            this.position.y = 330;
        } else this.velocity.y += gravity;
    }

    attack() {
        this.switchSprite('attack1');
        this.isAttacking = true;
    }

    takeHit() {
        if (this.health <= 0) {
            this.switchSprite('death');
            this.health = 0;
        } else {
            this.health -= 15;
            this.switchSprite('takeHit');
        }
    }

    barrier() {
        if (this.position.x < 0) {
            this.position.x += 5;
        } else if (this.position.x + this.width > cvs.width) {
            this.position.x -= 5;
        }
    }

    restart() {
        this.image = this.sprites.idle.image
        this.switchSprite('idle');
        this.framesMax = this.sprites.idle.framesMax;

        clearTimeout(timerId);
        timer = 30;
        decreseTimer();

        this.death = false;
        this.health = 100;

        document.querySelector('#displayText').style.display = 'none';
        restartBtn.style.display = 'none';
    }

    switchSprite(sprite) {

        if (this.image === this.sprites.death.image) {
            this.isAttacking = false;
            if (this.frameCurrent === this.sprites.death.framesMax - 1) {
                this.death = true;
            }
            return
        }

        // overriding all other animations with the ataack animaation
        if (
            this.image === this.sprites.attack1.image
            && this.frameCurrent < this.sprites.attack1.framesMax - 1)
            return

        // overriding when fighter gets hit

        if (
            this.image === this.sprites.takeHit.image
            && this.frameCurrent < this.sprites.takeHit.framesMax - 1)
            return

        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax;
                    this.frameCurrent = 0;
                }
                break;

            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image;
                    this.framesMax = this.sprites.run.framesMax;
                    this.frameCurrent = 0;
                }
                break;

            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.framesMax = this.sprites.jump.framesMax;
                    this.frameCurrent = 0;
                }
                break;

            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.framesMax = this.sprites.fall.framesMax;
                    this.frameCurrent = 0;
                }
                break;

            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image;
                    this.framesMax = this.sprites.attack1.framesMax;
                    this.frameCurrent = 0;
                }
                break;

            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image;
                    this.framesMax = this.sprites.takeHit.framesMax;
                    this.frameCurrent = 0;
                }
                break;

            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image;
                    this.framesMax = this.sprites.death.framesMax;
                    this.frameCurrent = 0;
                }
                break;

        }
    }
}