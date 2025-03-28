// === Ammo Logic ===
function ammoCount() {
    if (isReloading) return;

    if (ammo > 0) {
        firePlayerBullet();
        ammo--;
        document.querySelector('#ammo').innerHTML = ammo;
    } else {
        // Begin reload
        isReloading = true;
        document.querySelector('#ammo').innerHTML = "Reloading";

        setTimeout(() => {
            ammo = clipSize;
            isReloading = false;
            document.querySelector('#ammo').innerHTML = ammo;
        }, 2000);
    }
}



// === Bullet Fireing Logic ===
function spawnBullet({ originX, originY, targetX, targetY, color, speed, radius, onHit }) {
    const angle = Math.atan2(targetY - originY, targetX - originX);

    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    bullet.style.position = 'absolute';
    bullet.style.width = radius * 2 + 'px';
    bullet.style.height = radius * 2 + 'px';
    bullet.style.borderRadius = '50%';
    bullet.style.backgroundColor = color;
    bullet.style.left = originX + 'px';
    bullet.style.top = originY + 'px';
    document.body.appendChild(bullet);

    const interval = setInterval(() => {
        let bulletX = parseFloat(bullet.style.left);
        let bulletY = parseFloat(bullet.style.top);

        const newX = bulletX + Math.cos(angle) * speed;
        const newY = bulletY + Math.sin(angle) * speed;

        const cx = newX + radius;
        const cy = newY + radius;

        if (onHit && onHit(cx, cy, bullet)) {
            bullet.remove();
            clearInterval(interval);
            return;
        }

        if (newX < 0 || newX > window.innerWidth || newY < 0 || newY > window.innerHeight) {
            bullet.remove();
            clearInterval(interval);
            return;
        }

        bullet.style.left = newX + 'px';
        bullet.style.top = newY + 'px';
    }, 16);
}

function firePlayerBullet() {
    const player = document.getElementById('player');
    const playerRect = player.getBoundingClientRect();

    const originX = playerRect.left + playerRect.width / 2;
    const originY = playerRect.top + playerRect.height / 2;
    const mouseX = window.mouseX || window.innerWidth / 2;
    const mouseY = window.mouseY || window.innerHeight / 2;

    spawnBullet({
        originX,
        originY,
        targetX: mouseX,
        targetY: mouseY,
        color: 'yellow',
        speed: 10,
        radius: 3,
        onHit: playerBulletCollide
    });
}

function fireEnemyBullet(enemy) {
    const enemyRect = enemy.getBoundingClientRect();
    const player = document.getElementById('player');
    const playerRect = player.getBoundingClientRect();

    const originX = enemyRect.left + enemyRect.width / 2;
    const originY = enemyRect.top + enemyRect.height / 2;
    const targetX = playerRect.left + playerRect.width / 2;
    const targetY = playerRect.top + playerRect.height / 2;

    spawnBullet({
        originX,
        originY,
        targetX,
        targetY,
        color: 'red',
        speed: 4,
        radius: 5,
        onHit: enemyBulletCollide
    });
}



/// === Enemy / Player Hits ===
function handleEnemyHit(enemy){
    score++;
    document.querySelector('#score').innerHTML = score;
    rObjectives--;
    enemy.remove();
}

function handlePlayerHit() {
    if (isPlayerInvincible) return;
    document.documentElement.style.setProperty('--background', 'darkred');

    const player = document.getElementById('player');

    isPlayerInvincible = true;
    player.classList.add('invincible');

    setTimeout(() => {
        document.documentElement.style.setProperty('--background', 'black');
    }, 10);

    setTimeout(() => {
        isPlayerInvincible = false;
        player.classList.remove('invincible');
    }, 1000);

    if (lives > 0) {
        lives--;
        removeLife();
    }

    if (lives === 0) {
        console.log("Game Over");
        dead = true;
        gameOver();
    }
}



// === Collisions ===
function playerBulletCollide(x, y, bulletElement) {
    for (let enemy of document.querySelectorAll('.enemy')) {
        const rect = enemy.getBoundingClientRect();
        if (isCircleRectColliding(x, y, 6, rect)) {
            handleEnemyHit(enemy);
            return true;
        }
    }

    for (let solid of document.querySelectorAll('.solidForBullet')) {
        const rect = solid.getBoundingClientRect();
        if (isCircleRectColliding(x, y, 6, rect)) {
            return true;
        }
    }

    return false;
}

function enemyBulletCollide(x, y, bulletElement) {
    const player = document.getElementById('player');
    const rect = player.getBoundingClientRect();

    if (isCircleRectColliding(x, y, 6, rect)) {
        handlePlayerHit();
        return true;
    }

    for (let solid of document.querySelectorAll('.solidForEnemyBullet')) {
        const rect = solid.getBoundingClientRect();
        if (isCircleRectColliding(x, y, 6, rect)) {
            return true;
        }
    }

    return false;
}



// === Initial Mouse Tracking ===
window.mouseX = window.innerWidth / 2;
window.mouseY = window.innerHeight / 2;

document.addEventListener('mousemove', (e) => {
    window.mouseX = e.clientX;
    window.mouseY = e.clientY;
});
