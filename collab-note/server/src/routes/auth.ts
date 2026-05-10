import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { userStore, sessionStore } from '../utils/jsonStore';
import { hashPassword, verifyPassword, validatePassword, validateUsername } from '../utils/password';
import { RegisteredUser, Session } from '../types';

const router = Router();

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;
const userColors = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#8b5cf6', '#ec4899', '#64748b', '#14b8a6'
];

function getRandomColor(): string {
  return userColors[Math.floor(Math.random() * userColors.length)];
}

function sanitizeUser(user: RegisteredUser) {
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    color: user.color,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

router.post('/register', async (req: Request, res: Response) => {
  const { username, password, displayName } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: '用户名和密码不能为空' });
  }

  const usernameValidation = validateUsername(username);
  if (!usernameValidation.valid) {
    return res.status(400).json({ success: false, error: usernameValidation.message });
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return res.status(400).json({ success: false, error: passwordValidation.message });
  }

  const existingUser = userStore.getByUsername(username);
  if (existingUser) {
    return res.status(409).json({ success: false, error: '用户名已存在' });
  }

  const now = Date.now();
  const user: RegisteredUser = {
    id: uuidv4(),
    username: username.toLowerCase(),
    passwordHash: hashPassword(password),
    displayName: displayName || username,
    color: getRandomColor(),
    createdAt: now,
    updatedAt: now,
  };

  userStore.create(user);

  const sessionId = uuidv4();
  const session: Session = {
    id: sessionId,
    userId: user.id,
    createdAt: now,
    expiresAt: now + SESSION_DURATION,
  };
  sessionStore.create(session);

  res.cookie('sessionId', sessionId, {
    httpOnly: false,
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
  });

  res.status(201).json({
    success: true,
    data: {
      user: sanitizeUser(user),
      sessionId,
    },
  });
});

router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: '用户名和密码不能为空' });
  }

  const user = userStore.getByUsername(username);
  if (!user) {
    return res.status(401).json({ success: false, error: '用户名或密码错误' });
  }

  if (!verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ success: false, error: '用户名或密码错误' });
  }

  const now = Date.now();
  const sessionId = uuidv4();
  const session: Session = {
    id: sessionId,
    userId: user.id,
    createdAt: now,
    expiresAt: now + SESSION_DURATION,
  };
  sessionStore.create(session);

  res.cookie('sessionId', sessionId, {
    httpOnly: false,
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
  });

  res.json({
    success: true,
    data: {
      user: sanitizeUser(user),
      sessionId,
    },
  });
});

router.post('/logout', async (req: Request, res: Response) => {
  const sessionId = req.cookies?.sessionId || req.headers['x-session-id'] as string;

  if (sessionId) {
    sessionStore.delete(sessionId);
  }

  res.clearCookie('sessionId');
  res.json({ success: true, data: null });
});

router.get('/me', async (req: Request, res: Response) => {
  const sessionId = req.cookies?.sessionId || req.headers['x-session-id'] as string;

  if (!sessionId) {
    return res.status(401).json({ success: false, error: '未登录' });
  }

  sessionStore.cleanExpired();
  const session = sessionStore.getById(sessionId);

  if (!session) {
    return res.status(401).json({ success: false, error: '会话已过期' });
  }

  if (session.expiresAt < Date.now()) {
    sessionStore.delete(sessionId);
    return res.status(401).json({ success: false, error: '会话已过期' });
  }

  const user = userStore.getById(session.userId);
  if (!user) {
    return res.status(401).json({ success: false, error: '用户不存在' });
  }

  res.json({
    success: true,
    data: {
      user: sanitizeUser(user),
    },
  });
});

router.put('/me', async (req: Request, res: Response) => {
  const sessionId = req.cookies?.sessionId || req.headers['x-session-id'] as string;

  if (!sessionId) {
    return res.status(401).json({ success: false, error: '未登录' });
  }

  const session = sessionStore.getById(sessionId);
  if (!session) {
    return res.status(401).json({ success: false, error: '会话已过期' });
  }

  const { displayName, color } = req.body;
  const updates: Partial<RegisteredUser> = {};

  if (displayName !== undefined) {
    if (displayName.length === 0 || displayName.length > 50) {
      return res.status(400).json({ success: false, error: '显示名称长度应在1-50个字符之间' });
    }
    updates.displayName = displayName;
  }

  if (color !== undefined) {
    if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
      return res.status(400).json({ success: false, error: '无效的颜色格式' });
    }
    updates.color = color;
  }

  const updated = userStore.update(session.userId, updates);
  if (!updated) {
    return res.status(404).json({ success: false, error: '用户不存在' });
  }

  res.json({
    success: true,
    data: {
      user: sanitizeUser(updated),
    },
  });
});

export default router;
