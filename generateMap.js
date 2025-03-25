function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function generateMaze(width, height) {
    if (width % 2 === 0 || height % 2 === 0) {
        throw new Error("Maze dimensions must be odd for proper generation.");
    }

    // Step 1: Generate a full maze
    const maze = Array.from({ length: height }, () => Array(width).fill(1));
    const stack = [];
    const startX = 1;
    const startY = 1;
    maze[startY][startX] = 0;
    stack.push([startX, startY]);

    const directions = [
        [0, -2], [0, 2], [-2, 0], [2, 0]
    ];

    while (stack.length) {
        const [x, y] = stack.pop();
        shuffleArray(directions);
        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx > 0 && ny > 0 && nx < width - 1 && ny < height - 1 && maze[ny][nx] === 1) {
                maze[ny][nx] = 0;
                maze[y + dy / 2][x + dx / 2] = 0;
                stack.push([nx, ny]);
            }
        }
    }
    const midY = Math.floor(height / 2);
    maze[midY][0] = 0; // Entrance
    maze[midY][1] = 2;
    maze[midY][width - 1] = 0; // Exit
    maze[midY][width - 2] = 3; // Exit


    // Step 3: Fill all other borders with walls
    for (let y = 0; y < height; y++) {
        maze[y][0] = (y === midY) ? 0 : 1;
        maze[y][width - 1] = (y === midY) ? 0 : 1;
    }
    for (let x = 0; x < width; x++) {
        maze[0][x] = 1;
        maze[height - 1][x] = 1;
    }


    return maze;
}

const MIN_ROOM_SIZE = 3;
const MAX_DEPTH = 10;

function generateDungeon(width, height) {
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
