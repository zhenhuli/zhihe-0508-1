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

export interface RemoteCursor {
  userId: string;
  user: User;
  position: number;
  selection?: { start: number; end: number };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ShareNoteData {
  note: Note;
  share: Share;
}

export interface AuthUser {
  id: string;
  username: string;
  displayName: string;
  color: string;
  createdAt: number;
  updatedAt: number;
}

export interface AuthResponse {
  user: AuthUser;
  sessionId: string;
}
