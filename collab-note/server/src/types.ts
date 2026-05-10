export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: number;
  updatedAt: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  categoryId: string | null;
  createdAt: number;
  updatedAt: number;
  authorId: string;
}

export interface VersionSnapshot {
  id: string;
  noteId: string;
  title: string;
  content: string;
  createdAt: number;
  authorId: string;
}

export interface Share {
  id: string;
  noteId: string;
  token: string;
  createdAt: number;
  expiresAt: number | null;
}

export interface User {
  id: string;
  name: string;
  color: string;
  currentNoteId: string | null;
}

export interface RegisteredUser {
  id: string;
  username: string;
  passwordHash: string;
  displayName: string;
  color: string;
  createdAt: number;
  updatedAt: number;
}

export interface Session {
  id: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
}

export interface CollaborativeSession {
  noteId: string;
  users: Map<string, User>;
}
