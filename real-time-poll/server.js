const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

let polls = {};

io.on('connection', (socket) => {
  console.log('用户连接:', socket.id);

  socket.emit('initial polls', polls);

  socket.on('create poll', (data) => {
    const pollId = data.id || Date.now().toString();
    const options = data.options.map(opt => ({
      text: opt,
      votes: 0
    }));
    
    polls[pollId] = {
      id: pollId,
      title: data.title,
      options: options,
      createdAt: new Date()
    };

    io.emit('new poll', polls[pollId]);
  });

  socket.on('vote', ({ pollId, optionIndex }) => {
    if (polls[pollId] && polls[pollId].options[optionIndex]) {
      polls[pollId].options[optionIndex].votes++;
      io.emit('update poll', {
        pollId,
        options: polls[pollId].options
      });
    }
  });

  socket.on('delete poll', ({ pollId }) => {
    if (polls[pollId]) {
      delete polls[pollId];
      io.emit('poll deleted', { pollId });
    }
  });

  socket.on('disconnect', () => {
    console.log('用户断开连接:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
