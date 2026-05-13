import { TILE_SIZE, DIRECTIONS, COLORS, COLS, ROWS } from './config.js';
import { canMoveInDirection, isTunnel, isAtIntersection, getAvailableDirections } from './collision.js';

export class Pacman {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = TILE_SIZE * 14;
        this.y = TILE_SIZE * 23;
        this.direction = { ...DIRECTIONS.NONE };
        this.nextDirection = { ...DIRECTIONS.NONE };
        this.speed = 2;
        this.moving = false;
    }

    update() {
        if (this.nextDirection.x !== 0 || this.nextDirection.y !== 0) {
            if (canMoveInDirection(this.x, this.y, this.nextDirection)) {
                this.direction = { ...this.nextDirection };
                this.moving = true;
            }
        }

        if (canMoveInDirection(this.x, this.y, this.direction)) {
            this.x += this.direction.x * this.speed;
            this.y += this.direction.y * this.speed;
            this.moving = true;

            if (isTunnel(this.x, this.y)) {
                if (this.x < -TILE_SIZE * 0.5) {
                    this.x = COLS * TILE_SIZE + TILE_SIZE * 0.5;
                } else if (this.x > COLS * TILE_SIZE + TILE_SIZE * 0.5) {
                    this.x = -TILE_SIZE * 0.5;
                }
            }
        } else {
            this.moving = false;
        }
    }

    setDirection(direction) {
        this.nextDirection = { ...DIRECTIONS[direction] };
    }
}

export class Ghost {
    constructor(name, color, startX, startY) {
        this.name = name;
        this.color = color;
        this.startX = startX;
        this.startY = startY;
        this.reset();
    }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.direction = { ...DIRECTIONS.UP };
        this.speed = 1.5;
        this.scared = false;
        this.scaredTimer = 0;
        this.inHouse = this.y > TILE_SIZE * 13 && this.y < TILE_SIZE * 17;
    }

    update(pacman, pacmanDirection) {
        if (this.scared) {
            this.scaredTimer--;
            if (this.scaredTimer <= 0) {
                this.scared = false;
                this.speed = 1.5;
            }
        }

        if (isAtIntersection(this.x, this.y)) {
            this.chooseDirection(pacman, pacmanDirection);
        }

        this.x += this.direction.x * this.speed;
        this.y += this.direction.y * this.speed;

        if (isTunnel(this.x, this.y)) {
            if (this.x < 0) {
                this.x = COLS * TILE_SIZE;
            } else if (this.x > COLS * TILE_SIZE) {
                this.x = 0;
            }
        }
    }

    chooseDirection(pacman, pacmanDirection) {
        const available = getAvailableDirections(this.x, this.y);
        const opposite = this.getOppositeDirection();
        
        const filtered = available.filter(dir => dir !== opposite);
        
        if (filtered.length === 0) {
            this.direction = { ...DIRECTIONS[opposite] };
            return;
        }

        if (this.scared) {
            const randomIndex = Math.floor(Math.random() * filtered.length);
            this.direction = { ...DIRECTIONS[filtered[randomIndex]] };
            return;
        }

        let bestDirection = filtered[0];
        let bestDistance = Infinity;

        for (const dir of filtered) {
            const testDir = DIRECTIONS[dir];
            const testX = this.x + testDir.x * TILE_SIZE;
            const testY = this.y + testDir.y * TILE_SIZE;
            const distance = this.getDistance(testX, testY, pacman.x, pacman.y);
            
            if (distance < bestDistance) {
                bestDistance = distance;
                bestDirection = dir;
            }
        }

        this.direction = { ...DIRECTIONS[bestDirection] };
    }

    getOppositeDirection() {
        if (this.direction.x === 1) return 'LEFT';
        if (this.direction.x === -1) return 'RIGHT';
        if (this.direction.y === 1) return 'UP';
        if (this.direction.y === -1) return 'DOWN';
        return 'UP';
    }

    getDistance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return dx * dx + dy * dy;
    }

    scare() {
        this.scared = true;
        this.scaredTimer = 300;
        this.speed = 1;
    }
}

export function createGhosts() {
    return [
        new Ghost('blinky', COLORS.GHOSTS.BLINKY, TILE_SIZE * 13.5, TILE_SIZE * 11),
        new Ghost('pinky', COLORS.GHOSTS.PINKY, TILE_SIZE * 13.5, TILE_SIZE * 14),
        new Ghost('inky', COLORS.GHOSTS.INKY, TILE_SIZE * 11.5, TILE_SIZE * 14),
        new Ghost('clyde', COLORS.GHOSTS.CLYDE, TILE_SIZE * 15.5, TILE_SIZE * 14)
    ];
}
