function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId);
    document.querySelector('#displayText').style.display = 'flex';
    if (player.health === enemy.health) {
        player.switchSprite('death');
        enemy.switchSprite('death');
        document.querySelector('#displayText').innerHTML = 'tie';
        player.health = 0;
        enemy.health = 0;
    } else if (player.health > enemy.health) {
        enemy.switchSprite('death');
        enemy.health = 0;
        document.querySelector('#displayText').innerHTML = `player ${player.color} wins`;
    } else if (enemy.health > player.health) {
        player.health = 0;
        player.switchSprite('death');
        document.querySelector('#displayText').innerHTML = `player ${enemy.color} wins`;
    }
}

let timer = 30;
let timerId;


function decreseTimer() {
    if (!gameIsStart) {
        timer = 33;
    }
    timerId = setTimeout(decreseTimer, 1000);
    if (timer > 0) timer--;
    document.querySelector('#timer').innerHTML = timer;

    if (timer === 0) {
        determineWinner({ player, enemy, timerId })
    }
}