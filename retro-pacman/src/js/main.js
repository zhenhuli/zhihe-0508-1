import { Game } from './game.js';
import { GAME_STATE } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const game = new Game(canvas);

    document.getElementById('startBtn').addEventListener('click', () => {
        game.reset();
        document.getElementById('gameOver').classList.add('hidden');
        game.start();
    });

    document.getElementById('pauseBtn').addEventListener('click', () => {
        game.pause();
    });

    document.getElementById('restartBtn').addEventListener('click', () => {
        document.getElementById('gameOver').classList.add('hidden');
        game.reset();
        game.start();
    });

    document.addEventListener('keydown', (e) => {
        const key = e.key;
        if (key.startsWith('Arrow')) {
            e.preventDefault();
        }
        
        switch (key) {
            case 'ArrowUp':
                game.setPacmanDirection('UP');
                break;
            case 'ArrowDown':
                game.setPacmanDirection('DOWN');
                break;
            case 'ArrowLeft':
                game.setPacmanDirection('LEFT');
                break;
            case 'ArrowRight':
                game.setPacmanDirection('RIGHT');
                break;
            case ' ':
                game.pause();
                break;
        }
    });

    game.render();
});
