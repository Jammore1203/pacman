let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
let start = false;

const main = document.querySelector('main');

const MIN_ROOM_SIZE = 3;
const MAX_DEPTH = 10;
const MAP_WIDTH = 30
const MAP_HEIGHT = 30

const map = generateDungeon(MAP_WIDTH, MAP_HEIGHT, MIN_ROOM_SIZE, MAX_DEPTH);



console.log(map);

const playerPos = findPlayerStart(map);

placeEnemies(map, 5, playerPos);

//Populates the map in the HTML
for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
        const cellValue = map[row][col];
        const block = document.createElement('div');
        block.classList.add('block');

        switch (cellValue) {
            case 1:
                block.classList.add('wall', 'solid');
                break;
            case 2:
                block.id = 'player';
                break;
            case 3:
                block.id = 'enemy';
                block.classList.add('enemy');
                break;
            case 4:
                block.id = 'debug';
                block.classList.add('debug');
                break;
            default:
                block.classList.add('point');
                block.style.height = '1vh';
                block.style.width = '1vh';
        }

        // Optional: Use CSS grid positioning
        block.style.gridRowStart = row + 1;
        block.style.gridColumnStart = col + 1;

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
let playerTop = 0;
let playerLeft = 0;

setInterval(function () {
    const playerRect = player.getBoundingClientRect();
    const radius = 6; //size of collision box
    const speed = 1; //speed of player

    let dx = 0;
    let dy = 0;

    // Check up
    if (upPressed) {
        const circleX = playerRect.left + playerRect.width / 2;
        const circleY = playerRect.top - 1 + playerRect.height / 2;

        let blocked = false;
        for (let solid of document.querySelectorAll('.solid')) {
            if (isCircleRectColliding(circleX, circleY - radius, radius, solid.getBoundingClientRect())) {
                blocked = true;
                break;
            }
        }
        if (!blocked) dy--;
    }

    // Check down
    if (downPressed) {
        const circleX = playerRect.left + playerRect.width / 2;
        const circleY = playerRect.top + 1 + playerRect.height / 2;

        let blocked = false;
        for (let solid of document.querySelectorAll('.solid')) {
            if (isCircleRectColliding(circleX, circleY + radius, radius, solid.getBoundingClientRect())) {
                blocked = true;
                break;
            }
        }
        if (!blocked) dy++;
    }

    // Check left
    if (leftPressed) {
        const circleX = playerRect.left - 1 + playerRect.width / 2;
        const circleY = playerRect.top + playerRect.height / 2;

        let blocked = false;
        for (let solid of document.querySelectorAll('.solid')) {
            if (isCircleRectColliding(circleX - radius, circleY, radius, solid.getBoundingClientRect())) {
                blocked = true;
                break;
            }
        }
        if (!blocked) dx--;
    }

    // Check right
    if (rightPressed) {
        const circleX = playerRect.left + 1 + playerRect.width / 2;
        const circleY = playerRect.top + playerRect.height / 2;

        let blocked = false;
        for (let solid of document.querySelectorAll('.solid')) {
            if (isCircleRectColliding(circleX + radius, circleY, radius, solid.getBoundingClientRect())) {
                blocked = true;
                break;
            }
        }
        if (!blocked) dx++;
    }

    if (dx !== 0 && dy !== 0) {
        dx *= Math.SQRT1_2; // ~0.707
        dy *= Math.SQRT1_2;
    }

    playerTop += dy * speed;
    playerLeft += dx * speed;
    player.style.top = playerTop + 'px';
    player.style.left = playerLeft + 'px';
}, 1);


function isCircleRectColliding(circleX, circleY, radius, rect) {
    const closestX = Math.max(rect.left, Math.min(circleX, rect.right));
    const closestY = Math.max(rect.top, Math.min(circleY, rect.bottom));

    const dx = circleX - closestX;
    const dy = circleY - closestY;

    return (dx * dx + dy * dy) < (radius * radius);
}



function removeStartBtn() {
    let button = document.querySelector('#startBtn');
    button.style.display = 'none';
    start = true;
}



trackPlayer();
mouseTrack();

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
startBtn.addEventListener('click', removeStartBtn);