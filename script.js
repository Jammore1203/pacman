let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
let start = false;

const main = document.querySelector('main');

//Player = 2, Wall = 1, Enemy = 3, Point = 0
let maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 1, 0, 0, 0, 0, 3, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 1, 0, 3, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 3, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

//Populates the maze in the HTML
for (let y of maze) {
    for (let x of y) {
        let block = document.createElement('div');
        block.classList.add('block');

        switch (x) {
            case 1:
                block.classList.add('wall');
                break;
            case 2:
                block.id = 'player';
                let mouth = document.createElement('div');
                break;
            case 3:
                block.id = 'enemy';
                block.classList.add('enemy');
                break;
            default:
                block.classList.add('point');
                block.style.height = '1vh';
                block.style.width = '1vh';
        }

        main.appendChild(block);
    }
}

//Player movement
function keyUp(event) {
    if (start === true) {
        if (event.key === 'ArrowUp' || event.key === 'w') {
            upPressed = false;
        } else if (event.key === 'ArrowDown' || event.key === 's') {
            downPressed = false;
        } else if (event.key === 'ArrowLeft' || event.key === 'a') {
            leftPressed = false;
        } else if (event.key === 'ArrowRight' || event.key === 'd') {
            rightPressed = false;
        }
    }
}

function keyDown(event) {
    if (start === true) {
        if (event.key === 'ArrowUp' || event.key === 'w') {
            upPressed = true;
        } else if (event.key === 'ArrowDown' || event.key === 's') {
            downPressed = true;
        } else if (event.key === 'ArrowLeft' || event.key === 'a') {
            leftPressed = true;
        } else if (event.key === 'ArrowRight' || event.key === 'd') {
            rightPressed = true;
        }
    }
}

const player = document.querySelector('#player');
const playerMouth = player.querySelector('.mouth');
let playerTop = 0;
let playerLeft = 0;

setInterval(function() {
    if(downPressed) {
        playerTop++;
        player.style.top = playerTop + 'px';
        playerMouth.classList = 'down';
    }
    else if(upPressed) {
        playerTop--;
        player.style.top = playerTop + 'px';
        playerMouth.classList = 'up';
    }
    else if(leftPressed) {
        playerLeft--;
        player.style.left = playerLeft + 'px';
        playerMouth.classList = 'left';
    }
    else if(rightPressed) {
        playerLeft++;
        player.style.left = playerLeft + 'px';
        playerMouth.classList = 'right';
    }
}, 1)

function removeStartBtn() {
    let button = document.querySelector('#startBtn');
    button.style.display = 'none';
    start = true;
}

function mouseTrack() {
    const pointer = document.getElementById('player');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    // Store mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Constantly update rotation
    setInterval(() => {
        const rect = pointer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const angle = Math.atan2(mouseY - centerY, mouseX - centerX);
        pointer.style.transform = `rotate(${angle}rad)`;
    }, 10);
}

function trackPlayer() {
    const player = document.getElementById('player');
    const enemies = document.querySelectorAll('.enemy');

    if (!player || enemies.length === 0) {
        console.error('Player or enemies not found');
        return;
    }

    setInterval(() => {
        const playerRect = player.getBoundingClientRect();
        const playerX = playerRect.left + playerRect.width / 2;
        const playerY = playerRect.top + playerRect.height / 2;

        enemies.forEach((enemy) => {
            const enemyRect = enemy.getBoundingClientRect();
            const enemyX = enemyRect.left + enemyRect.width / 2;
            const enemyY = enemyRect.top + enemyRect.height / 2;

            const angle = Math.atan2(playerY - enemyY, playerX - enemyX);
            enemy.style.transform = `rotate(${angle}rad)`;
        });
    }, 10);
}

trackPlayer();


mouseTrack();

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
startBtn.addEventListener('click', removeStartBtn);