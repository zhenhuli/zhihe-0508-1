import { io } from 'socket.io-client';

export class Network {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.socket = io('/', {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      this.socket.on('connect', () => {
        this.connected = true;
        console.log('Connected to server');
        resolve();
      });

      this.socket.on('disconnect', () => {
        this.connected = false;
        console.log('Disconnected from server');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        reject(error);
      });
    });
  }

  createRoom(playerName) {
    this.socket.emit('createRoom', playerName);
  }

  joinRoom(roomCode, playerName) {
    this.socket.emit('joinRoom', { roomCode, playerName });
  }

  startGame(roomCode) {
    this.socket.emit('startGame', roomCode);
  }

  changeDirection(roomCode, direction) {
    this.socket.emit('changeDirection', { roomCode, direction });
  }

  sendMessage(roomCode, message) {
    this.socket.emit('sendMessage', { roomCode, message });
  }

  getLeaderboard() {
    this.socket.emit('getLeaderboard');
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
