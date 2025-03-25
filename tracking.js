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

function findPlayerStart(map) {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            if (map[y][x] === 4) {
                return { x, y };
            }
        }
    }
    return null;
}