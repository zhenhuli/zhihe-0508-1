import { TILE_SIZE, COLS, ROWS, COLORS, MAP } from './config.js';

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.animationFrame = 0;
    }

    clear() {
        this.ctx.fillStyle = COLORS.BACKGROUND;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawMap(mapState) {
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const tile = mapState[row * COLS + col];
                const x = col * TILE_SIZE;
                const y = row * TILE_SIZE;

                if (tile === 1) {
                    this.drawWall(x, y);
                } else if (tile === 2) {
                    this.drawDot(x, y);
                } else if (tile === 3) {
                    this.drawPowerDot(x, y);
                }
            }
        }
    }

    drawWall(x, y) {
        this.ctx.fillStyle = COLORS.WALL;
        this.ctx.fillRect(x + 1, y + 1, TILE_SIZE - 2, TILE_SIZE - 2);
        
        this.ctx.fillStyle = '#3333AA';
        this.ctx.fillRect(x + 1, y + 1, TILE_SIZE - 2, 3);
        this.ctx.fillRect(x + 1, y + 1, 3, TILE_SIZE - 2);
    }

    drawDot(x, y) {
        this.ctx.fillStyle = COLORS.DOT;
        this.ctx.beginPath();
        this.ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, 3, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawPowerDot(x, y) {
        const pulse = Math.sin(this.animationFrame * 0.2) * 2 + 6;
        this.ctx.fillStyle = COLORS.POWER_DOT;
        this.ctx.beginPath();
        this.ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, pulse, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawPacman(pacman) {
        const x = pacman.x;
        const y = pacman.y;
        const radius = TILE_SIZE * 0.45;
        
        this.ctx.fillStyle = COLORS.PACMAN;
        
        let mouthAngle = 0.2;
        if (pacman.moving) {
            mouthAngle = Math.sin(this.animationFrame * 0.3) * 0.2 + 0.2;
        }
        
        let startAngle = mouthAngle;
        let endAngle = Math.PI * 2 - mouthAngle;
        
        if (pacman.direction.x === -1) {
            startAngle = Math.PI - mouthAngle;
            endAngle = Math.PI + mouthAngle;
        } else if (pacman.direction.y === -1) {
            startAngle = Math.PI * 1.5 - mouthAngle;
            endAngle = Math.PI * 1.5 + mouthAngle;
        } else if (pacman.direction.y === 1) {
            startAngle = Math.PI * 0.5 - mouthAngle;
            endAngle = Math.PI * 0.5 + mouthAngle;
        }
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.arc(x, y, radius, startAngle, endAngle);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawGhost(ghost) {
        const x = ghost.x;
        const y = ghost.y;
        const radius = TILE_SIZE * 0.45;
        
        let color = ghost.color;
        if (ghost.scared) {
            color = this.animationFrame % 20 < 10 ? '#0000FF' : '#FFFFFF';
        }
        
        this.ctx.fillStyle = color;
        
        this.ctx.beginPath();
        this.ctx.arc(x, y - 2, radius, Math.PI, 0);
        this.ctx.lineTo(x + radius, y + radius * 0.8);
        
        for (let i = 0; i < 3; i++) {
            const waveX = x + radius - (i + 1) * radius * 0.66;
            const waveY = y + radius * 0.8 + (i % 2 === 0 ? 4 : -2);
            this.ctx.lineTo(waveX, waveY);
        }
        
        this.ctx.lineTo(x - radius, y + radius * 0.8);
        this.ctx.closePath();
        this.ctx.fill();
        
        if (!ghost.scared) {
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.beginPath();
            this.ctx.arc(x - 5, y - 4, 5, 0, Math.PI * 2);
            this.ctx.arc(x + 5, y - 4, 5, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.fillStyle = '#0000FF';
            this.ctx.beginPath();
            this.ctx.arc(x - 5 + ghost.direction.x * 2, y - 4 + ghost.direction.y * 2, 2.5, 0, Math.PI * 2);
            this.ctx.arc(x + 5 + ghost.direction.x * 2, y - 4 + ghost.direction.y * 2, 2.5, 0, Math.PI * 2);
            this.ctx.fill();
        } else {
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.beginPath();
            this.ctx.arc(x - 5, y - 4, 2, 0, Math.PI * 2);
            this.ctx.arc(x + 5, y - 4, 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.lineWidth = 1.5;
            this.ctx.beginPath();
            this.ctx.moveTo(x - 8, y + 4);
            for (let i = 0; i < 5; i++) {
                this.ctx.lineTo(x - 8 + i * 4, y + 4 + (i % 2 === 0 ? 3 : -3));
            }
            this.ctx.stroke();
        }
    }

    updateAnimationFrame() {
        this.animationFrame++;
    }
}
