import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true
});

const rooms = new Map();
const leaderboard = [];

const GRID_SIZE = 20;
const GAME_SPEED = 150;

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generateFood(snake1, snake2) {
  let food;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  } while (
    snake1.some(seg => seg.x === food.x && seg.y === food.y) ||
    snake2.some(seg => seg.x === food.x && seg.y === food.y)
  );
  return food;
}

function createSnake(startX, startY, direction) {
  return [
    { x: startX, y: startY },
    { x: startX - (direction === 'RIGHT' ? 1 : 0), y: startY - (direction === 'DOWN' ? 1 : 0) },
    { x: startX - (direction === 'RIGHT' ? 2 : 0), y: startY - (direction === 'DOWN' ? 2 : 0) }
  ];
}

function moveSnake(snake, direction) {
  const head = { ...snake[0] };
  
  switch (direction) {
    case 'UP': head.y--; break;
    case 'DOWN': head.y++; break;
    case 'LEFT': head.x--; break;
    case 'RIGHT': head.x++; break;
  }
  
  return [head, ...snake];
}

function checkCollision(snake, otherSnake, gridSize) {
  const head = snake[0];
  
  if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
    return true;
  }
  
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      return true;
    }
  }
  
  for (let i = 0; i < otherSnake.length; i++) {
    if (otherSnake[i].x === head.x && otherSnake[i].y === head.y) {
      return true;
    }
  }
  
  return false;
}

function startGameLoop(roomCode) {
  const room = rooms.get(roomCode);
  if (!room || room.gameState !== 'playing') return;

  room.gameLoop = setInterval(() => {
    room.players.forEach(player => {
      if (player.nextDirection) {
        player.direction = player.nextDirection;
        player.nextDirection = null;
      }
    });

    room.players[0].snake = moveSnake(room.players[0].snake, room.players[0].direction);
    room.players[1].snake = moveSnake(room.players[1].snake, room.players[1].direction);

    room.players.forEach(player => {
      if (player.snake[0].x === room.food.x && player.snake[0].y === room.food.y) {
        player.score += 10;
        room.food = generateFood(room.players[0].snake, room.players[1].snake);
      } else {
        player.snake.pop();
      }
    });

    const p1Collision = checkCollision(room.players[0].snake, room.players[1].snake, GRID_SIZE);
    const p2Collision = checkCollision(room.players[1].snake, room.players[0].snake, GRID_SIZE);

    if (p1Collision || p2Collision) {
      room.gameState = 'finished';
      clearInterval(room.gameLoop);

      let winner = null;
      if (p1Collision && !p2Collision) {
        winner = room.players[1];
      } else if (!p1Collision && p2Collision) {
        winner = room.players[0];
      } else {
        winner = room.players[0].score > room.players[1].score ? room.players[0] :
                room.players[1].score > room.players[0].score ? room.players[1] : null;
      }

      if (winner) {
        const existingEntry = leaderboard.find(entry => entry.name === winner.name);
        if (existingEntry) {
          existingEntry.score = Math.max(existingEntry.score, winner.score);
        } else {
          leaderboard.push({ name: winner.name, score: winner.score });
        }
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard.splice(10);
      }

      io.to(roomCode).emit('gameOver', {
        players: room.players.map(p => ({ name: p.name, score: p.score })),
        winner: winner ? winner.name : null
      });
    } else {
      io.to(roomCode).emit('gameUpdate', {
        players: room.players.map(p => ({ name: p.name, snake: p.snake, score: p.score })),
        food: room.food
      });
    }
  }, GAME_SPEED);
}

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  socket.on('createRoom', (playerName) => {
    const roomCode = generateRoomCode();
    const player = {
      id: socket.id,
      name: playerName,
      snake: createSnake(5, 10, 'RIGHT'),
      direction: 'RIGHT',
      nextDirection: null,
      score: 0
    };

    rooms.set(roomCode, {
      code: roomCode,
      players: [player],
      gameState: 'waiting',
      food: null,
      gameLoop: null
    });

    socket.join(roomCode);
    socket.emit('roomCreated', roomCode);
  });

  socket.on('joinRoom', ({ roomCode, playerName }) => {
    const room = rooms.get(roomCode);
    
    if (!room) {
      socket.emit('error', '房间不存在');
      return;
    }
    
    if (room.players.length >= 2) {
      socket.emit('error', '房间已满');
      return;
    }

    const player = {
      id: socket.id,
      name: playerName,
      snake: createSnake(14, 10, 'LEFT'),
      direction: 'LEFT',
      nextDirection: null,
      score: 0
    };

    room.players.push(player);
    socket.join(roomCode);

    io.to(roomCode).emit('playerJoined', {
      players: room.players.map(p => ({ name: p.name, score: p.score }))
    });

    if (room.players.length === 2) {
      room.gameState = 'ready';
      io.to(roomCode).emit('gameReady');
    }
  });

  socket.on('startGame', (roomCode) => {
    const room = rooms.get(roomCode);
    if (!room || room.players.length < 2) return;

    room.gameState = 'playing';
    room.players[0].snake = createSnake(5, 10, 'RIGHT');
    room.players[0].direction = 'RIGHT';
    room.players[0].score = 0;
    room.players[1].snake = createSnake(14, 10, 'LEFT');
    room.players[1].direction = 'LEFT';
    room.players[1].score = 0;
    room.food = generateFood(room.players[0].snake, room.players[1].snake);

    io.to(roomCode).emit('gameStarted', {
      players: room.players.map(p => ({ name: p.name, snake: p.snake, score: p.score })),
      food: room.food
    });

    startGameLoop(roomCode);
  });

  socket.on('changeDirection', ({ roomCode, direction }) => {
    const room = rooms.get(roomCode);
    if (!room || room.gameState !== 'playing') return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    const opposites = {
      'UP': 'DOWN',
      'DOWN': 'UP',
      'LEFT': 'RIGHT',
      'RIGHT': 'LEFT'
    };

    if (opposites[direction] !== player.direction) {
      player.nextDirection = direction;
    }
  });

  socket.on('sendMessage', ({ roomCode, message }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    io.to(roomCode).emit('receiveMessage', {
      playerName: player.name,
      message
    });
  });

  socket.on('getLeaderboard', () => {
    socket.emit('leaderboard', leaderboard);
  });

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    
    rooms.forEach((room, roomCode) => {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        const playerName = room.players[playerIndex].name;
        room.players.splice(playerIndex, 1);
        
        if (room.gameLoop) {
          clearInterval(room.gameLoop);
        }
        
        if (room.players.length === 0) {
          rooms.delete(roomCode);
        } else {
          room.gameState = 'waiting';
          io.to(roomCode).emit('playerLeft', playerName);
        }
      }
    });
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
