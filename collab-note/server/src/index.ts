import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import categoriesRouter from './routes/categories';
import notesRouter from './routes/notes';
import versionsRouter from './routes/versions';
import sharesRouter from './routes/shares';
import authRouter from './routes/auth';
import { User, CollaborativeSession } from './types';
import { noteStore } from './utils/jsonStore';

const PORT = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const activeSessions = new Map<string, CollaborativeSession>();
const userColors = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#8b5cf6', '#ec4899', '#64748b', '#14b8a6'
];

function getRandomColor(): string {
  return userColors[Math.floor(Math.random() * userColors.length)];
}

io.on('connection', (socket) => {
  const userId = socket.id;

  socket.on('join-note', async ({ noteId, userName }: { noteId: string; userName: string }) => {
    const note = noteStore.getById(noteId);
    if (!note) {
      socket.emit('error', { message: '笔记不存在' });
      return;
    }

    if (!activeSessions.has(noteId)) {
      activeSessions.set(noteId, {
        noteId,
        users: new Map(),
      });
    }

    const session = activeSessions.get(noteId)!;
    const user: User = {
      id: userId,
      name: userName || `用户${userId.slice(0, 6)}`,
      color: getRandomColor(),
      currentNoteId: noteId,
    };

    session.users.set(userId, user);

    socket.join(noteId);
    socket.data.currentNoteId = noteId;
    socket.data.userName = user.name;

    socket.emit('joined', {
      user,
      note,
      users: Array.from(session.users.values()),
    });

    socket.to(noteId).emit('user-joined', { user });
  });

  socket.on('update-content', async ({ noteId, content, title }: { noteId: string; content: string; title?: string }) => {
    const note = noteStore.getById(noteId);
    if (!note) {
      return;
    }

    const updates: { content?: string; title?: string } = { content };
    if (title !== undefined) updates.title = title;

    const updated = noteStore.update(noteId, updates);
    if (updated) {
      socket.to(noteId).emit('content-updated', {
        userId,
        content: updated.content,
        title: updated.title,
      });
    }
  });

  socket.on('cursor-move', ({ noteId, position, selection }: { noteId: string; position: number; selection?: { start: number; end: number } }) => {
    const session = activeSessions.get(noteId);
    if (!session) return;

    const user = session.users.get(userId);
    if (!user) return;

    socket.to(noteId).emit('user-cursor', {
      userId,
      user,
      position,
      selection,
    });
  });

  socket.on('leave-note', ({ noteId }: { noteId: string }) => {
    handleUserLeave(noteId, userId);
  });

  socket.on('disconnect', () => {
    const currentNoteId = socket.data.currentNoteId;
    if (currentNoteId) {
      handleUserLeave(currentNoteId, userId);
    }
  });
});

function handleUserLeave(noteId: string, userId: string) {
  const session = activeSessions.get(noteId);
  if (!session) return;

  const user = session.users.get(userId);
  if (user) {
    session.users.delete(userId);
    io.to(noteId).emit('user-left', { userId, user });
  }

  if (session.users.size === 0) {
    activeSessions.delete(noteId);
  }
}

app.use('/api/auth', authRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/notes', notesRouter);
app.use('/api/versions', versionsRouter);
app.use('/api/shares', sharesRouter);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: '服务运行正常' });
});

server.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`HTTP: http://localhost:${PORT}`);
  console.log(`Socket.IO: ws://localhost:${PORT}`);
});
