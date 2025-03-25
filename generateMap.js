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
    maze[midY][width -2] = 3; // Exit
    

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

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}
