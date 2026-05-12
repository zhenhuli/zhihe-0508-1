import { Game } from './game.js';
import { Network } from './network.js';

const game = new Game('gameCanvas');
const network = new Network();

let currentRoom = null;
let currentPlayer = null;
let players = [];

async function init() {
  try {
    await network.connect();
    setupEventListeners();
    setupNetworkHandlers();
    network.getLeaderboard();
    hideError();
  } catch (error) {
    console.error('Failed to connect:', error);
    showError('正在连接服务器...');
    setTimeout(() => {
      init();
    }, 2000);
  }
}

function setupEventListeners() {
  document.getElementById('createRoomBtn').addEventListener('click', () => {
    const name = document.getElementById('playerName').value.trim();
    if (!name) {
      showError('请输入你的名字');
      return;
    }
    currentPlayer = name;
    network.createRoom(name);
  });

  document.getElementById('joinRoomBtn').addEventListener('click', () => {
    const name = document.getElementById('playerName').value.trim();
    const roomCode = document.getElementById('roomCodeInput').value.trim().toUpperCase();
    
    if (!name) {
      showError('请输入你的名字');
      return;
    }
    if (!roomCode || roomCode.length !== 6) {
      showError('请输入有效的6位房间码');
      return;
    }
    
    currentPlayer = name;
    network.joinRoom(roomCode, name);
  });

  document.getElementById('startGameBtn').addEventListener('click', () => {
    if (currentRoom) {
      network.startGame(currentRoom);
    }
  });

  document.getElementById('backBtn').addEventListener('click', () => {
    showScreen('homeScreen');
    currentRoom = null;
    players = [];
  });

  document.getElementById('sendChatBtn').addEventListener('click', sendChatMessage);
  document.getElementById('chatInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChatMessage();
  });

  document.getElementById('exitGameBtn').addEventListener('click', () => {
    showScreen('homeScreen');
    game.reset();
    currentRoom = null;
    players = [];
    document.getElementById('chatBox').innerHTML = '';
    network.getLeaderboard();
  });

  document.getElementById('playAgainBtn').addEventListener('click', () => {
    hideGameOverModal();
    network.startGame(currentRoom);
  });

  document.getElementById('backToHomeBtn').addEventListener('click', () => {
    hideGameOverModal();
    showScreen('homeScreen');
    game.reset();
    currentRoom = null;
    players = [];
    document.getElementById('chatBox').innerHTML = '';
    network.getLeaderboard();
  });

  document.addEventListener('keydown', (e) => {
    if (!currentRoom || !game.isPlaying) return;

    let direction;
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        direction = 'UP';
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        direction = 'DOWN';
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        direction = 'LEFT';
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        direction = 'RIGHT';
        break;
      default:
        return;
    }
    
    e.preventDefault();
    network.changeDirection(currentRoom, direction);
  });
}

function setupNetworkHandlers() {
  network.on('roomCreated', (roomCode) => {
    currentRoom = roomCode;
    players = [{ name: currentPlayer }];
    document.getElementById('roomCodeDisplay').textContent = roomCode;
    updatePlayersList();
    showScreen('roomScreen');
    hideError();
  });

  network.on('playerJoined', (data) => {
    players = data.players;
    updatePlayersList();
    if (players.length === 2) {
      document.getElementById('startGameBtn').disabled = false;
    }
  });

  network.on('gameReady', () => {
    document.getElementById('startGameBtn').disabled = false;
  });

  network.on('gameStarted', (data) => {
    players = data.players;
    showScreen('gameScreen');
    game.isPlaying = true;
    updateScores();
    game.updateState(data.players, data.food);
  });

  network.on('gameUpdate', (data) => {
    players = data.players;
    updateScores();
    game.updateState(data.players, data.food);
  });

  network.on('gameOver', (data) => {
    game.isPlaying = false;
    showGameOverModal(data.players, data.winner);
  });

  network.on('receiveMessage', (data) => {
    addChatMessage(data.playerName, data.message);
  });

  network.on('leaderboard', (data) => {
    updateLeaderboard(data);
  });

  network.on('error', (message) => {
    showError(message);
  });

  network.on('playerLeft', (playerName) => {
    players = players.filter(p => p.name !== playerName);
    updatePlayersList();
    document.getElementById('startGameBtn').disabled = true;
    
    if (game.isPlaying) {
      game.isPlaying = false;
      showError('对方玩家已退出游戏');
      setTimeout(() => {
        showScreen('homeScreen');
        game.reset();
        currentRoom = null;
        players = [];
        document.getElementById('chatBox').innerHTML = '';
        network.getLeaderboard();
      }, 2000);
    }
  });
}

function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  
  if (message && currentRoom) {
    network.sendMessage(currentRoom, message);
    input.value = '';
  }
}

function addChatMessage(playerName, message) {
  const chatBox = document.getElementById('chatBox');
  const messageEl = document.createElement('div');
  messageEl.className = 'chat-message';
  messageEl.innerHTML = `
    <div class="chat-sender">${playerName}</div>
    <div class="chat-text">${escapeHtml(message)}</div>
  `;
  chatBox.appendChild(messageEl);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function updateScores() {
  if (players.length >= 1) {
    document.getElementById('p1Name').textContent = players[0].name;
    document.getElementById('p1Score').textContent = players[0].score || 0;
  }
  if (players.length >= 2) {
    document.getElementById('p2Name').textContent = players[1].name;
    document.getElementById('p2Score').textContent = players[1].score || 0;
  }
}

function updatePlayersList() {
  const list = document.getElementById('playersList');
  list.innerHTML = players.map((player, index) => `
    <div class="player-item ${players.length === 2 ? 'ready' : ''}">
      <span>${player.name}</span>
      <span class="${players.length === 2 ? 'status' : 'waiting'}">
        ${players.length === 2 ? '已准备' : '等待中...'}
      </span>
    </div>
  `).join('');
}

function updateLeaderboard(data) {
  const list = document.getElementById('leaderboardList');
  
  if (!data || data.length === 0) {
    list.innerHTML = '<div class="no-data">暂无数据</div>';
    return;
  }

  list.innerHTML = data.slice(0, 10).map((item, index) => `
    <div class="leaderboard-item">
      <span class="rank rank-${index + 1}">${index + 1}</span>
      <span>${item.name}</span>
      <span>${item.score}</span>
    </div>
  `).join('');
}

function showGameOverModal(finalPlayers, winner) {
  const modal = document.getElementById('gameOverModal');
  const scoresEl = document.getElementById('finalScores');
  const winnerEl = document.getElementById('winnerText');

  scoresEl.innerHTML = finalPlayers.map(player => `
    <div class="final-score">
      <span>${player.name}</span>
      <span>${player.score}</span>
    </div>
  `).join('');

  if (winner) {
    winnerEl.textContent = `🎉 ${winner} 获胜!`;
  } else {
    winnerEl.textContent = '🤝 平局!';
  }

  modal.classList.add('active');
}

function hideGameOverModal() {
  document.getElementById('gameOverModal').classList.remove('active');
}

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(screenId).classList.add('active');
}

function showError(message) {
  const errorEl = document.getElementById('errorMessage');
  errorEl.textContent = message;
  errorEl.style.display = 'block';
}

function hideError() {
  document.getElementById('errorMessage').style.display = 'none';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

init();
