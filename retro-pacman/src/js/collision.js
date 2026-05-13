import { TILE_SIZE, COLS, ROWS, MAP, DIRECTIONS } from './config.js';

const { UP, DOWN, LEFT, RIGHT } = DIRECTIONS;

export function isWall(x, y) {
    const col = Math.floor(x / TILE_SIZE);
    const row = Math.floor(y / TILE_SIZE);
    
    if (col < 0 || col >= COLS) {
        if (isTunnel(x, y)) {
            return false;
        }
        return true;
    }
    
    if (row < 0 || row >= ROWS) {
        return true;
    }
    
    const tile = MAP[row * COLS + col];
    return tile === 1;
}

export function isTunnel(x, y) {
    const row = Math.floor(y / TILE_SIZE);
    return row >= 10 && row <= 11;
}

export function checkEntityCollision(entity1, entity2) {
    const dx = Math.abs(entity1.x - entity2.x);
    const dy = Math.abs(entity1.y - entity2.y);
    return dx < TILE_SIZE * 0.7 && dy < TILE_SIZE * 0.7;
}

export function canMoveInDirection(x, y, direction) {
    if (direction.x === 0 && direction.y === 0) {
        return false;
    }
    
    const margin = TILE_SIZE * 0.25;
    const checkX = x + direction.x * margin;
    const checkY = y + direction.y * margin;
    
    return !isWall(checkX, checkY);
}

export function isAtIntersection(x, y) {
    const col = Math.round(x / TILE_SIZE);
    const row = Math.round(y / TILE_SIZE);
    const centerX = col * TILE_SIZE;
    const centerY = row * TILE_SIZE;
    
    const dx = Math.abs(x - centerX);
    const dy = Math.abs(y - centerY);
    
    if (dx > 2 || dy > 2) {
        return false;
    }
    
    return true;
}

export function getAvailableDirections(x, y) {
    const directions = [];
    
    if (canMoveInDirection(x, y, UP)) directions.push('UP');
    if (canMoveInDirection(x, y, DOWN)) directions.push('DOWN');
    if (canMoveInDirection(x, y, LEFT)) directions.push('LEFT');
    if (canMoveInDirection(x, y, RIGHT)) directions.push('RIGHT');
    
    return directions;
}
