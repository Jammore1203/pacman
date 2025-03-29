// === GLOBAL STATE ===
let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
let start = false;
let money = 0;
let level = 0;
let score = 0;
let ammo = 0;
let clipSize = 5;
let isReloading = false;

const main = document.querySelector('main');
const MIN_ROOM_SIZE = 2;
const MAX_DEPTH = 100;
const MAP_WIDTH = 20;
const MAP_HEIGHT = 20;

const wallTextures = ['brick0.png', 'brick1.png', 'brick2.png'];
const floorTextures = ['cobble0.png', 'cobble1.png'];


let objectives = 1;
let enemies = 1;

let map = generateDungeon(MAP_WIDTH, MAP_HEIGHT, MIN_ROOM_SIZE, MAX_DEPTH);
let playerPos = findPlayerStart(map);
let player = null;

placeEnemies(map, enemies, playerPos);
placeobjectives(map, objectives, playerPos)
renderMap();

// === RENDER MAP ===
function renderMap() {
    main.innerHTML = '';
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            const cellValue = map[row][col];
            const block = document.createElement('div');
            block.classList.add('block');

            switch (cellValue) {
                case 1:
                    block.classList.add('wall', 'solid', 'solidForBullet', 'solidForEnemyBullet');
                    const wallImg = wallTextures[Math.floor(Math.random() * wallTextures.length)];
                    block.style.backgroundImage = `url('images/${wallImg}')`;
                    break;
                case 2:
                    block.id = 'player';
                    break;
                case 3:
                    block.id = 'enemy';
                    block.classList.add('enemy', 'solidForBullet');
                    break;
                case 4:
                    block.id = 'exit';
                    block.classList.add('exit', 'debug', 'solidForBullet', 'solidForEnemyBullet');
                    break;
                case 5:
                    block.id = 'objective'
                    block.classList.add('objective', 'solidForBullet', 'solidForEnemyBullet');
                    break;
                default:
                    block.classList.add('point');
                    const floorImg = floorTextures[Math.floor(Math.random() * floorTextures.length)];
                    block.style.backgroundImage = `url('images/${floorImg}')`;

            }

            block.style.gridRowStart = row + 1;
            block.style.gridColumnStart = col + 1;
            main.appendChild(block);
        }
    }
    player = document.getElementById('player');
    player.style.top = '0px';
    player.style.left = '0px';
}

// === MOVEMENT CONTROLS ===
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function keyDown(event) {
    if (!start) return;
    if (event.key === 'ArrowUp' || event.key === 'w') upPressed = true;
    else if (event.key === 'ArrowDown' || event.key === 's') downPressed = true;
    else if (event.key === 'ArrowLeft' || event.key === 'a') leftPressed = true;
    else if (event.key === 'ArrowRight' || event.key === 'd') rightPressed = true;
}

function keyUp(event) {
    if (!start) return;
    if (event.key === 'ArrowUp' || event.key === 'w') upPressed = false;
    else if (event.key === 'ArrowDown' || event.key === 's') downPressed = false;
    else if (event.key === 'ArrowLeft' || event.key === 'a') leftPressed = false;
    else if (event.key === 'ArrowRight' || event.key === 'd') rightPressed = false;
}

// === PLAYER MOVEMENT ENGINE ===
let playerTop = 0;
let playerLeft = 0;
setInterval(() => {
    if (!start || !player) return;

    const playerRect = player.getBoundingClientRect();
    const radius = 6;
    const speed = 1;
    let dx = 0;
    let dy = 0;

    // Up
    if (upPressed) {
        const cx = playerRect.left + playerRect.width / 2;
        const cy = playerRect.top - 1 + playerRect.height / 2;
        if (!isBlocked(cx, cy - radius)) dy--;
    }
    // Down
    if (downPressed) {
        const cx = playerRect.left + playerRect.width / 2;
        const cy = playerRect.top + 1 + playerRect.height / 2;
        if (!isBlocked(cx, cy + radius)) dy++;
    }
    // Left
    if (leftPressed) {
        const cx = playerRect.left - 1 + playerRect.width / 2;
        const cy = playerRect.top + playerRect.height / 2;
        if (!isBlocked(cx - radius, cy)) dx--;
    }
    // Right
    if (rightPressed) {
        const cx = playerRect.left + 1 + playerRect.width / 2;
        const cy = playerRect.top + playerRect.height / 2;
        if (!isBlocked(cx + radius, cy)) dx++;
    }

    if (dx !== 0 && dy !== 0) {
        dx *= Math.SQRT1_2;
        dy *= Math.SQRT1_2;
    }

    playerTop += dy * speed;
    playerLeft += dx * speed;
    player.style.top = playerTop + 'px';
    player.style.left = playerLeft + 'px';
}, 1);

function isBlocked(x, y) {
    for (let solid of document.querySelectorAll('.solid')) {
        if (isCircleRectColliding(x, y, 6, solid.getBoundingClientRect())) {
            return true;
        }
    }
    return false;
}

// === COLLISION CHECKER ===
function isCircleRectColliding(cx, cy, radius, rect) {
    const closestX = Math.max(rect.left, Math.min(cx, rect.right));
    const closestY = Math.max(rect.top, Math.min(cy, rect.bottom));
    const dx = cx - closestX;
    const dy = cy - closestY;
    return dx * dx + dy * dy < radius * radius;
}

// === CHECK FOR EXIT ===
setInterval(() => {
    const playerRect = player.getBoundingClientRect();
    const radius = 6;
    const cx = playerRect.left + playerRect.width / 2;
    const cy = playerRect.top + playerRect.height / 2;

    for (let solid of document.querySelectorAll('.exit')) {
        if (isCircleRectColliding(cx, cy, radius, solid.getBoundingClientRect())) {
            if (rObjectives === 0){
                newlevel();
                break;
            }
            break;
        }
    }
}, 16);

// === CHECK FOR OBJECTIVE ===
setInterval(() => {
    const playerRect = player.getBoundingClientRect();
    const radius = 6;
    const cx = playerRect.left + playerRect.width / 2;
    const cy = playerRect.top + playerRect.height / 2;

    for (let solid of document.querySelectorAll('.objective')) {
        if (isCircleRectColliding(cx, cy, radius, solid.getBoundingClientRect())) {
            solid.remove();


            money = money + 10;
            document.querySelector('#money').innerHTML = money;

            break;
        }
    }
}, 16);

function randomRGB() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

// === NEW LEVEL HANDLER ===
function newlevel() {
    main.innerHTML = '';
    player.style.top = '0px';
    player.style.left = '0px';
    playerTop = 0;
    playerLeft = 0;

    level++;
    document.querySelector('#level').innerHTML = level;

    if (level % 2 === 0) {
        enemies++;
        objectives++;
    }

    document.documentElement.style.setProperty('--walls', randomRGB());

    rObjectives = objectives

    map = generateDungeon(MAP_WIDTH, MAP_HEIGHT, MIN_ROOM_SIZE, MAX_DEPTH);
    playerPos = findPlayerStart(map);
    placeEnemies(map, enemies, playerPos);
    placeobjectives(map, objectives, playerPos)
    renderMap();
    trackPlayer(map, playerPos);
    mouseTrack();
}

// === START BUTTON ===
function removeStartBtn() {
    document.querySelector('#startBtn').style.display = 'none';
    start = true;
}

document.querySelector('#startBtn').addEventListener('click', removeStartBtn);

// === START TRACKING ===
let rObjectives = enemies
trackPlayer(map, playerPos);
mouseTrack();

// === Bullets ===
ammo = clipSize;
document.querySelector('#ammo').innerHTML = ammo;
main.addEventListener('click', ammoCount);

setInterval(() => {
    if (start === true){
        document.querySelectorAll('.enemy').forEach(enemy => {
            fireEnemyBullet(enemy);
        });
    }
}, 1000);