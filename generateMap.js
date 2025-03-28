//Player = 2, Wall = 1, Enemy = 3, Point = 0
//generates a roomed map
function generateDungeon(width, height, MIN_ROOM_SIZE, MAX_DEPTH) {
    const map = Array.from({ length: height }, () => Array(width).fill(1));

    const rooms = [];

    function createLeaf(x, y, w, h, depth = 0) {
        if (depth >= MAX_DEPTH || w < MIN_ROOM_SIZE * 2 || h < MIN_ROOM_SIZE * 2) {
            const roomW = Math.floor(Math.random() * (w - MIN_ROOM_SIZE)) + MIN_ROOM_SIZE;
            const roomH = Math.floor(Math.random() * (h - MIN_ROOM_SIZE)) + MIN_ROOM_SIZE;
            const roomX = x + Math.floor(Math.random() * (w - roomW));
            const roomY = y + Math.floor(Math.random() * (h - roomH));

            for (let i = roomY; i < roomY + roomH; i++) {
                for (let j = roomX; j < roomX + roomW; j++) {
                    map[i][j] = 0;
                }
            }

            const center = {
                x: Math.floor(roomX + roomW / 2),
                y: Math.floor(roomY + roomH / 2)
            };

            rooms.push(center);
            return center;
        }

        const horizontalSplit = Math.random() > 0.5;
        if (horizontalSplit) {
            const split = Math.floor(Math.random() * (h - MIN_ROOM_SIZE * 2)) + MIN_ROOM_SIZE;
            const r1 = createLeaf(x, y, w, split, depth + 1);
            const r2 = createLeaf(x, y + split, w, h - split, depth + 1);
            connectRooms(r1, r2);
            return r1;
        } else {
            const split = Math.floor(Math.random() * (w - MIN_ROOM_SIZE * 2)) + MIN_ROOM_SIZE;
            const r1 = createLeaf(x, y, split, h, depth + 1);
            const r2 = createLeaf(x + split, y, w - split, h, depth + 1);
            connectRooms(r1, r2);
            return r1;
        }
    }

    function connectRooms(p1, p2) {
        if (!p1 || !p2) return;
        if (Math.random() > 0.5) {
            carveHorizontal(p1.x, p2.x, p1.y);
            carveVertical(p1.y, p2.y, p2.x);
        } else {
            carveVertical(p1.y, p2.y, p1.x);
            carveHorizontal(p1.x, p2.x, p2.y);
        }
    }

    function carveHorizontal(x1, x2, y) {
        for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
            map[y][x] = 0;
        }
    }

    function carveVertical(y1, y2, x) {
        for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
            map[y][x] = 0;
        }
    }

    // Carve rooms recursively
    createLeaf(1, 1, width - 2, height - 2);

    // Enforce perimeter walls
    for (let x = 0; x < width; x++) {
        map[0][x] = 1;
        map[height - 1][x] = 1;
    }
    for (let y = 0; y < height; y++) {
        map[y][0] = 1;
        map[y][width - 1] = 1;
    }

    // Start and exit using case 4
    const start = rooms[0];
    const exit = rooms[rooms.length - 1];
    if (start) map[start.y][start.x] = 2;
    if (exit) map[exit.y][exit.x] = 4;

    return map;
}

function placeEnemies(map, count, playerPos) {
    const walkableTiles = [];

    for (let y = 1; y < map.length - 1; y++) {
        for (let x = 1; x < map[0].length - 1; x++) {
            if (
                map[y][x] === 0 && // walkable
                !(x === playerPos.x && y === playerPos.y) // not player
            ) {
                walkableTiles.push({ x, y });
            }
        }
    }

    if (walkableTiles.length === 0) {
        console.error("No valid tiles to place enemies.");
        return;
    }

    for (let i = 0; i < count && walkableTiles.length > 0; i++) {
        const index = Math.floor(Math.random() * walkableTiles.length);
        const { x, y } = walkableTiles.splice(index, 1)[0];
        map[y][x] = 3; // enemy
        console.log(map[x][y]);
    }

    console.log("Enemies placed:", count);
}

function placeobjectives(map, count, playerPos) {
    const walkableTiles = [];

    for (let y = 1; y < map.length - 1; y++) {
        for (let x = 1; x < map[0].length - 1; x++) {
            if (
                map[y][x] === 0 && // walkable
                !(x === playerPos.x && y === playerPos.y) // not player
            ) {
                walkableTiles.push({ x, y });
            }
        }
    }

    if (walkableTiles.length === 0) {
        console.error("No valid tiles to place enemies.");
        return;
    }

    for (let i = 0; i < count && walkableTiles.length > 0; i++) {
        const index = Math.floor(Math.random() * walkableTiles.length);
        const { x, y } = walkableTiles.splice(index, 1)[0];
        map[y][x] = 5; // enemy
        console.log(map[x][y]);
    }

    console.log("Enemies placed:", count);
}
