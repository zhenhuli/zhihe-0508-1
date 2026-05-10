import * as fs from 'fs';
import * as path from 'path';
import { Category, Note, VersionSnapshot, Share, RegisteredUser, Session } from '../types';

const DATA_DIR = path.join(__dirname, '../../../data');

function ensureDirectory(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readJSON<T>(filePath: string): T {
  ensureDirectory(path.dirname(filePath));
  if (!fs.existsSync(filePath)) {
    return {} as T;
  }
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch {
    return {} as T;
  }
}

function writeJSON<T>(filePath: string, data: T): void {
  ensureDirectory(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function getArrayFromMap<T>(data: Record<string, T>): T[] {
  return Object.values(data);
}

export const categoryStore = {
  getAll(): Category[] {
    const data = readJSON<Record<string, Category>>(path.join(DATA_DIR, 'categories', 'index.json'));
    return getArrayFromMap(data).sort((a, b) => b.updatedAt - a.updatedAt);
  },

  getById(id: string): Category | null {
    const data = readJSON<Record<string, Category>>(path.join(DATA_DIR, 'categories', 'index.json'));
    return data[id] || null;
  },

  create(category: Category): Category {
    const data = readJSON<Record<string, Category>>(path.join(DATA_DIR, 'categories', 'index.json'));
    data[category.id] = category;
    writeJSON(path.join(DATA_DIR, 'categories', 'index.json'), data);
    return category;
  },

  update(id: string, updates: Partial<Category>): Category | null {
    const data = readJSON<Record<string, Category>>(path.join(DATA_DIR, 'categories', 'index.json'));
    if (!data[id]) return null;
    data[id] = { ...data[id], ...updates, updatedAt: Date.now() };
    writeJSON(path.join(DATA_DIR, 'categories', 'index.json'), data);
    return data[id];
  },

  delete(id: string): boolean {
    const data = readJSON<Record<string, Category>>(path.join(DATA_DIR, 'categories', 'index.json'));
    if (!data[id]) return false;
    delete data[id];
    writeJSON(path.join(DATA_DIR, 'categories', 'index.json'), data);
    return true;
  }
};

export const noteStore = {
  getAll(): Note[] {
    const data = readJSON<Record<string, Note>>(path.join(DATA_DIR, 'notes', 'index.json'));
    return getArrayFromMap(data).sort((a, b) => b.updatedAt - a.updatedAt);
  },

  getById(id: string): Note | null {
    const data = readJSON<Record<string, Note>>(path.join(DATA_DIR, 'notes', 'index.json'));
    return data[id] || null;
  },

  getByCategory(categoryId: string | null): Note[] {
    return this.getAll().filter(note => note.categoryId === categoryId);
  },

  create(note: Note): Note {
    const data = readJSON<Record<string, Note>>(path.join(DATA_DIR, 'notes', 'index.json'));
    data[note.id] = note;
    writeJSON(path.join(DATA_DIR, 'notes', 'index.json'), data);
    return note;
  },

  update(id: string, updates: Partial<Note>): Note | null {
    const data = readJSON<Record<string, Note>>(path.join(DATA_DIR, 'notes', 'index.json'));
    if (!data[id]) return null;
    data[id] = { ...data[id], ...updates, updatedAt: Date.now() };
    writeJSON(path.join(DATA_DIR, 'notes', 'index.json'), data);
    return data[id];
  },

  delete(id: string): boolean {
    const data = readJSON<Record<string, Note>>(path.join(DATA_DIR, 'notes', 'index.json'));
    if (!data[id]) return false;
    delete data[id];
    writeJSON(path.join(DATA_DIR, 'notes', 'index.json'), data);
    return true;
  }
};

export const versionStore = {
  getByNoteId(noteId: string): VersionSnapshot[] {
    const data = readJSON<Record<string, VersionSnapshot>>(path.join(DATA_DIR, 'versions', `${noteId}.json`));
    return getArrayFromMap(data).sort((a, b) => b.createdAt - a.createdAt);
  },

  getById(noteId: string, versionId: string): VersionSnapshot | null {
    const data = readJSON<Record<string, VersionSnapshot>>(path.join(DATA_DIR, 'versions', `${noteId}.json`));
    return data[versionId] || null;
  },

  create(version: VersionSnapshot): VersionSnapshot {
    const data = readJSON<Record<string, VersionSnapshot>>(path.join(DATA_DIR, 'versions', `${version.noteId}.json`));
    data[version.id] = version;
    writeJSON(path.join(DATA_DIR, 'versions', `${version.noteId}.json`), data);
    return version;
  },

  deleteByNoteId(noteId: string): boolean {
    const filePath = path.join(DATA_DIR, 'versions', `${noteId}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  }
};

export const shareStore = {
  getAll(): Share[] {
    const data = readJSON<Record<string, Share>>(path.join(DATA_DIR, 'shares', 'index.json'));
    return getArrayFromMap(data);
  },

  getByToken(token: string): Share | null {
    const data = readJSON<Record<string, Share>>(path.join(DATA_DIR, 'shares', 'index.json'));
    const allShares = getArrayFromMap(data);
    return allShares.find(s => s.token === token) || null;
  },

  getByNoteId(noteId: string): Share | null {
    const data = readJSON<Record<string, Share>>(path.join(DATA_DIR, 'shares', 'index.json'));
    const allShares = getArrayFromMap(data);
    return allShares.find(s => s.noteId === noteId) || null;
  },

  create(share: Share): Share {
    const data = readJSON<Record<string, Share>>(path.join(DATA_DIR, 'shares', 'index.json'));
    data[share.id] = share;
    writeJSON(path.join(DATA_DIR, 'shares', 'index.json'), data);
    return share;
  },

  deleteByNoteId(noteId: string): boolean {
    const data = readJSON<Record<string, Share>>(path.join(DATA_DIR, 'shares', 'index.json'));
    const shareToDelete = Object.values(data).find(s => s.noteId === noteId);
    if (shareToDelete) {
      delete data[shareToDelete.id];
      writeJSON(path.join(DATA_DIR, 'shares', 'index.json'), data);
      return true;
    }
    return false;
  }
};

export const userStore = {
  getAll(): RegisteredUser[] {
    const data = readJSON<Record<string, RegisteredUser>>(path.join(DATA_DIR, 'users', 'index.json'));
    return getArrayFromMap(data);
  },

  getById(id: string): RegisteredUser | null {
    const data = readJSON<Record<string, RegisteredUser>>(path.join(DATA_DIR, 'users', 'index.json'));
    return data[id] || null;
  },

  getByUsername(username: string): RegisteredUser | null {
    const users = this.getAll();
    return users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
  },

  create(user: RegisteredUser): RegisteredUser {
    const data = readJSON<Record<string, RegisteredUser>>(path.join(DATA_DIR, 'users', 'index.json'));
    data[user.id] = user;
    writeJSON(path.join(DATA_DIR, 'users', 'index.json'), data);
    return user;
  },

  update(id: string, updates: Partial<RegisteredUser>): RegisteredUser | null {
    const data = readJSON<Record<string, RegisteredUser>>(path.join(DATA_DIR, 'users', 'index.json'));
    if (!data[id]) return null;
    data[id] = { ...data[id], ...updates, updatedAt: Date.now() };
    writeJSON(path.join(DATA_DIR, 'users', 'index.json'), data);
    return data[id];
  },

  delete(id: string): boolean {
    const data = readJSON<Record<string, RegisteredUser>>(path.join(DATA_DIR, 'users', 'index.json'));
    if (!data[id]) return false;
    delete data[id];
    writeJSON(path.join(DATA_DIR, 'users', 'index.json'), data);
    return true;
  }
};

export const sessionStore = {
  getAll(): Session[] {
    const data = readJSON<Record<string, Session>>(path.join(DATA_DIR, 'sessions', 'index.json'));
    return getArrayFromMap(data);
  },

  getById(id: string): Session | null {
    const data = readJSON<Record<string, Session>>(path.join(DATA_DIR, 'sessions', 'index.json'));
    return data[id] || null;
  },

  create(session: Session): Session {
    const data = readJSON<Record<string, Session>>(path.join(DATA_DIR, 'sessions', 'index.json'));
    data[session.id] = session;
    writeJSON(path.join(DATA_DIR, 'sessions', 'index.json'), data);
    return session;
  },

  delete(id: string): boolean {
    const data = readJSON<Record<string, Session>>(path.join(DATA_DIR, 'sessions', 'index.json'));
    if (!data[id]) return false;
    delete data[id];
    writeJSON(path.join(DATA_DIR, 'sessions', 'index.json'), data);
    return true;
  },

  cleanExpired(): void {
    const data = readJSON<Record<string, Session>>(path.join(DATA_DIR, 'sessions', 'index.json'));
    const now = Date.now();
    const validSessions: Record<string, Session> = {};
    
    Object.entries(data).forEach(([id, session]) => {
      if (session.expiresAt > now) {
        validSessions[id] = session;
      }
    });
    
    writeJSON(path.join(DATA_DIR, 'sessions', 'index.json'), validSessions);
  }
};
