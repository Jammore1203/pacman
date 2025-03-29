function ammoCount() {
    if (isReloading) return;

    if (ammo > 0) {
        spawnBullet();
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


function spawnBullet() {
    const player = document.getElementById('player');
    const playerRect = player.getBoundingClientRect();
    const centerX = playerRect.left + playerRect.width / 2;
    const centerY = playerRect.top + playerRect.height / 2;

    // Get mouse position at time of firing
    const mouseX = window.mouseX || window.innerWidth / 2;
    const mouseY = window.mouseY || window.innerHeight / 2;

    const angle = Math.atan2(mouseY - centerY, mouseX - centerX);

    // Create bullet
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    bullet.style.position = 'absolute';
    bullet.style.width = '10px';
    bullet.style.height = '10px';
    bullet.style.borderRadius = '50%';
    bullet.style.backgroundColor = 'yellow';
    bullet.style.left = centerX + 'px';
    bullet.style.top = centerY + 'px';
    document.body.appendChild(bullet);

    const speed = 10;
    const radius = 2;

    const interval = setInterval(() => {
        let bulletX = parseFloat(bullet.style.left);
        let bulletY = parseFloat(bullet.style.top);

        const newX = bulletX + Math.cos(angle) * speed;
        const newY = bulletY + Math.sin(angle) * speed;

        // Get center for collision
        const cx = newX + radius; // 5 = radius
        const cy = newY + radius;

        if (isBlocked(cx, cy)) {
            bullet.remove();
            clearInterval(interval);
            return;
        }

        // Remove if off screen
        if (newX < 0 || newX > window.innerWidth || newY < 0 || newY > window.innerHeight) {
            bullet.remove();
            clearInterval(interval);
            return;
        }

        bullet.style.left = newX + 'px';
        bullet.style.top = newY + 'px';
    }, 16);
}
window.mouseX = window.innerWidth / 2;
window.mouseY = window.innerHeight / 2;

document.addEventListener('mousemove', (e) => {
    window.mouseX = e.clientX;
    window.mouseY = e.clientY;
});
