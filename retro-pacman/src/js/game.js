import { TILE_SIZE, COLS, ROWS, MAP, GAME_STATE } from './config.js';
import { checkEntityCollision } from './collision.js';
import { Pacman, createGhosts } from './entities.js';
import { Renderer } from './renderer.js';

export class Game {
    constructor(canvas) {
        this.renderer = new Renderer(canvas);
        this.pacman = new Pacman();
        this.ghosts = createGhosts();
        this.mapState = [...MAP];
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.state = GAME_STATE.READY;
        this.animationId = null;
        this.dotsRemaining = this.countDots();
    }

    countDots() {
        return this.mapState.filter(tile => tile === 2 || tile === 3).length;
    }

    start() {
        this.state = GAME_STATE.PLAYING;
        this.gameLoop();
    }

    pause() {
        if (this.state === GAME_STATE.PLAYING) {
            this.state = GAME_STATE.PAUSED;
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
            }
        } else if (this.state === GAME_STATE.PAUSED) {
            this.state = GAME_STATE.PLAYING;
            this.gameLoop();
        }
    }

    reset() {
        this.pacman.reset();
        this.ghosts.forEach(ghost => ghost.reset());
        this.mapState = [...MAP];
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.dotsRemaining = this.countDots();
        this.updateUI();
    }

    resetPositions() {
        this.pacman.reset();
        this.ghosts.forEach(ghost => ghost.reset());
    }

    nextLevel() {
        this.level++;
        this.pacman.reset();
        this.ghosts.forEach(ghost => ghost.reset());
        this.mapState = [...MAP];
        this.dotsRemaining = this.countDots();
        this.state = GAME_STATE.PLAYING;
        this.updateUI();
    }

    gameLoop() {
        if (this.state !== GAME_STATE.PLAYING) return;

        this.update();
        this.render();
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        this.pacman.update();
        this.ghosts.forEach(ghost => ghost.update(this.pacman, this.pacman.direction));
        
        this.checkDotCollision();
        this.checkGhostCollision();
        
        if (this.dotsRemaining === 0) {
            this.levelComplete();
        }

        this.renderer.updateAnimationFrame();
    }

    render() {
        this.renderer.clear();
        this.renderer.drawMap(this.mapState);
        this.renderer.drawPacman(this.pacman);
        this.ghosts.forEach(ghost => this.renderer.drawGhost(ghost));
    }

    checkDotCollision() {
        const col = Math.round(this.pacman.x / TILE_SIZE);
        const row = Math.round(this.pacman.y / TILE_SIZE);
        const index = row * COLS + col;
        const tile = this.mapState[index];

        if (tile === 2) {
            this.mapState[index] = 0;
            this.score += 10;
            this.dotsRemaining--;
            this.updateUI();
        } else if (tile === 3) {
            this.mapState[index] = 0;
            this.score += 50;
            this.dotsRemaining--;
            this.ghosts.forEach(ghost => ghost.scare());
            this.updateUI();
        }
    }

    checkGhostCollision() {
        for (const ghost of this.ghosts) {
            if (checkEntityCollision(this.pacman, ghost)) {
                if (ghost.scared) {
                    this.score += 200;
                    ghost.reset();
                    this.updateUI();
                } else {
                    this.loseLife();
                    return;
                }
            }
        }
    }

    loseLife() {
        this.lives--;
        this.updateUI();
        
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            this.resetPositions();
        }
    }

    levelComplete() {
        this.state = GAME_STATE.LEVEL_UP;
        document.getElementById('levelUp').classList.remove('hidden');
        
        setTimeout(() => {
            document.getElementById('levelUp').classList.add('hidden');
            this.nextLevel();
        }, 2000);
    }

    gameOver() {
        this.state = GAME_STATE.GAME_OVER;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').classList.remove('hidden');
    }

    setPacmanDirection(direction) {
        this.pacman.setDirection(direction);
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('lives').textContent = this.lives;
    }
}
