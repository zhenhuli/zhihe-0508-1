const GRID_SIZE = 20;
const CELL_SIZE = 20;

export class Game {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = GRID_SIZE * CELL_SIZE;
    this.canvas.height = GRID_SIZE * CELL_SIZE;
    this.players = [];
    this.food = null;
    this.isPlaying = false;
  }

  draw() {
    this.ctx.fillStyle = '#1a1a2e';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.strokeStyle = '#16213e';
    this.ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(i * CELL_SIZE, 0);
      this.ctx.lineTo(i * CELL_SIZE, this.canvas.height);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(0, i * CELL_SIZE);
      this.ctx.lineTo(this.canvas.width, i * CELL_SIZE);
      this.ctx.stroke();
    }

    if (this.food) {
      this.ctx.fillStyle = '#e94560';
      this.ctx.beginPath();
      this.ctx.arc(
        this.food.x * CELL_SIZE + CELL_SIZE / 2,
        this.food.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2 - 2,
        0,
        Math.PI * 2
      );
      this.ctx.fill();
    }

    const colors = ['#00ff88', '#00d4ff'];
    this.players.forEach((player, index) => {
      const color = colors[index % colors.length];
      player.snake.forEach((segment, i) => {
        const alpha = 1 - (i / player.snake.length) * 0.5;
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = alpha;
        this.ctx.fillRect(
          segment.x * CELL_SIZE + 1,
          segment.y * CELL_SIZE + 1,
          CELL_SIZE - 2,
          CELL_SIZE - 2
        );
      });
      this.ctx.globalAlpha = 1;
    });
  }

  updateState(players, food) {
    this.players = players;
    this.food = food;
    this.draw();
  }

  reset() {
    this.players = [];
    this.food = null;
    this.isPlaying = false;
    this.draw();
  }
}
