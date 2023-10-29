'use strict';

let gameIsStart = false;

setTimeout(() => {
    document.querySelector('.startScreen').style.opacity = 0;
    gameIsStart = true;
}, 3000)

const cvs = document.querySelector('canvas'),
    c = cvs.getContext('2d');

cvs.width = 1024;
cvs.height = 576;

c.fillRect(0, 0, cvs.width, cvs.height);

const gravity = 0.7;

const player = new Fighters({
    position: {
        x: 0,
        y: 10
    },

    velocity: {
        x: 0,
        y: 0
    },

    color: 'red',

    offset: {
        x: 0,
        y: 0
    },

    imageSrc: 'img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157,
    },
    sprites: {
        idle: {
            imageSrc: 'img/samuraiMack/Idle.png',
            framesMax: 8
        },

        run: {
            imageSrc: 'img/samuraiMack/Run.png',
            framesMax: 8
        },

        jump: {
            imageSrc: 'img/samuraiMack/Jump.png',
            framesMax: 2
        },

        fall: {
            imageSrc: 'img/samuraiMack/Fall.png',
            framesMax: 2
        },

        attack1: {
            imageSrc: 'img/samuraiMack/Attack1.png',
            framesMax: 6
        },

        takeHit: {
            imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4
        },

        death: {
            imageSrc: './img/samuraiMack/Death.png',
            framesMax: 6
        }
    },

    attackBox: {
        offset: {
            x: 100,
            y: 50
        },

        width: 150,
        height: 50
    }
});

const enemy = new Fighters({
    position: {
        x: cvs.width,
        y: 100
    },

    velocity: {
        x: 0,
        y: 0
    },

    color: 'blue',

    offset: {
        x: -50,
        y: 0
    },

    imageSrc: 'img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167,
    },
    sprites: {
        idle: {
            imageSrc: 'img/kenji/Idle.png',
            framesMax: 4
        },

        run: {
            imageSrc: 'img/kenji/Run.png',
            framesMax: 8
        },

        jump: {
            imageSrc: 'img/kenji/Jump.png',
            framesMax: 2
        },

        fall: {
            imageSrc: 'img/kenji/Fall.png',
            framesMax: 2
        },

        attack1: {
            imageSrc: 'img/kenji/Attack1.png',
            framesMax: 4
        },

        takeHit: {
            imageSrc: './img/kenji/Take hit.png',
            framesMax: 3
        },

        death: {
            imageSrc: './img/kenji/Death.png',
            framesMax: 7
        }
    },

    attackBox: {
        offset: {
            x: -170,
            y: 50
        },

        width: 170,
        height: 50
    },

});

const bg = new Sprite({
    position: {
        x: 0,
        y: 0
    },

    imageSrc: 'img/background.png'
});

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },

    imageSrc: 'img/shop.png',
    scale: 2.75,
    framesMax: 6,

})

const keys = {
    a: {
        pressed: false
    },

    d: {
        pressed: false
    },

    ArrowLeft: {
        pressed: false
    },

    ArrowRight: {
        pressed: false
    },
}

function rectengularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
        && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

decreseTimer()

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, cvs.width, cvs.height);
    bg.update();
    shop.update();
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // player movement

    player.barrier();

    if (keys.a.pressed && player.lastkey === 'a') {
        player.velocity.x = -5;
        player.switchSprite('run');
    } else if (keys.d.pressed && player.lastkey === 'd') {
        player.velocity.x = 5;
        player.switchSprite('run');
    } else {
        player.switchSprite('idle');
    }

    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }

    // enemy movement

    enemy.barrier();

    if (keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft') {
        enemy.velocity.x = -5;
        enemy.switchSprite('run');
    } else if (keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight') {
        enemy.velocity.x = 5;
        enemy.switchSprite('run');
    } else {
        enemy.switchSprite('idle');
    }

    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
    }

    // player is on the ground

    if (player.position.y == 330) {
        player.jumps = 0;
    }

    if (enemy.position.y == 330) {
        enemy.jumps = 0;
    }

    // detect for collision & player gets hit

    document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    document.querySelector('#playerHealth').style.width = player.health + '%';

    if (rectengularCollision({ rectangle1: player, rectangle2: enemy })
        && player.isAttacking
        && player.frameCurrent === 4
    ) {
        enemy.takeHit();
        player.isAttacking = false;
    }

    //player misses

    if (player.isAttacking && player.frameCurrent === 4) {
        player.isAttacking = false;
    }

    if (rectengularCollision({ rectangle1: enemy, rectangle2: player })
        && enemy.isAttacking
        && enemy.frameCurrent === 2
    ) {
        player.takeHit();
        enemy.isAttacking = false;
    }

    if (enemy.isAttacking && enemy.frameCurrent === 2) {
        enemy.isAttacking = false;
    }

    // and game based on health

    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId });
        restartBtn.style.display = 'flex';
    }
}

animate();

let restartIsCklicked = false;

window.addEventListener('keydown', (e) => {
    if (!player.death && gameIsStart) {
        switch (e.key) {
            case 'd':
                if (player.position.x + player.width <= cvs.width) {
                    keys.d.pressed = true;
                    player.lastkey = 'd';
                }
                break;

            case 'a':
                keys.a.pressed = true;
                player.lastkey = 'a';

                break;

            case 'w':
                if (player.jumps < 2) {
                    player.velocity.y = -15;
                    player.jumps++
                }
                break;

            case ' ':
                player.attack();
                break;
        }
    }

    // enemy keys
    if (!enemy.death && gameIsStart) {
        switch (e.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                enemy.lastkey = 'ArrowRight';

                break;

            case 'ArrowLeft':

                keys.ArrowLeft.pressed = true;
                enemy.lastkey = 'ArrowLeft';

                break;

            case 'ArrowUp':
                if (enemy.jumps < 2) {
                    enemy.velocity.y = -15;
                    enemy.jumps++
                }

                break;

            case 'ArrowDown':
                enemy.attack();
                break;
        }
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'd':
            keys.d.pressed = false;
            break;

        case 'a':
            keys.a.pressed = false;
            break;

        // enemy keys

        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;

        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;

    }
});

// restart

const restartBtn = document.querySelector('#restart');

if (restartIsCklicked) {
    player.death = false;
    enemy.death = false;
}

restartBtn.addEventListener('click', (e) => {
    console.log(e);
    player.restart();
    enemy.restart();

    player.position.x = 0;
    enemy.position.x = cvs.width;
});

