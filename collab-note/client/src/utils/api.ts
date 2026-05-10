import axios from 'axios';
import { Category, Note, VersionSnapshot, Share, ShareNoteData, ApiResponse, AuthUser, AuthResponse } from '@/types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

function handleResponse<T>(response: { data: ApiResponse<T> }): T {
  if (response.data.success) {
    return response.data.data as T;
  }
  throw new Error(response.data.error || '请求失败');
}

export const categoryApi = {
  getAll(): Promise<Category[]> {
    return api.get('/categories').then(handleResponse);
  },

  getById(id: string): Promise<Category> {
    return api.get(`/categories/${id}`).then(handleResponse);
  },

  create(name: string, color?: string): Promise<Category> {
    return api.post('/categories', { name, color }).then(handleResponse);
  },

  update(id: string, updates: { name?: string; color?: string }): Promise<Category> {
    return api.put(`/categories/${id}`, updates).then(handleResponse);
  },

  delete(id: string): Promise<void> {
    return api.delete(`/categories/${id}`).then(handleResponse);
  },
};

export const noteApi = {
  getAll(categoryId?: string | null): Promise<Note[]> {
    const params = categoryId !== undefined ? { categoryId: categoryId || 'null' } : {};
    return api.get('/notes', { params }).then(handleResponse);
  },

  getById(id: string): Promise<Note> {
    return api.get(`/notes/${id}`).then(handleResponse);
  },

  create(data: {
    title?: string;
    content?: string;
    categoryId?: string | null;
    authorId?: string;
  }): Promise<Note> {
    return api.post('/notes', data).then(handleResponse);
  },

  update(
    id: string,
    data: {
      title?: string;
      content?: string;
      categoryId?: string | null;
      authorId?: string;
      createVersion?: boolean;
    }
  ): Promise<Note> {
    return api.put(`/notes/${id}`, data).then(handleResponse);
  },

  delete(id: string): Promise<void> {
    return api.delete(`/notes/${id}`).then(handleResponse);
  },
};

export const versionApi = {
  getByNoteId(noteId: string): Promise<VersionSnapshot[]> {
    return api.get(`/versions/note/${noteId}`).then(handleResponse);
  },

  getById(noteId: string, versionId: string): Promise<VersionSnapshot> {
    return api.get(`/versions/note/${noteId}/${versionId}`).then(handleResponse);
  },

  restore(noteId: string, versionId: string, authorId?: string): Promise<Note> {
    return api
      .post(`/versions/note/${noteId}/restore/${versionId}`, { authorId })
      .then(handleResponse);
  },
};

export const shareApi = {
  create(noteId: string): Promise<Share> {
    return api.post(`/shares/note/${noteId}`).then(handleResponse);
  },

  getByToken(token: string): Promise<ShareNoteData> {
    return api.get(`/shares/token/${token}`).then(handleResponse);
  },

  delete(noteId: string): Promise<void> {
    return api.delete(`/shares/note/${noteId}`).then(handleResponse);
  },
};

export const authApi = {
  register(username: string, password: string, displayName?: string): Promise<AuthResponse> {
    return api
      .post('/auth/register', { username, password, displayName })
      .then(handleResponse);
  },

  login(username: string, password: string): Promise<AuthResponse> {
    return api.post('/auth/login', { username, password }).then(handleResponse);
  },

  logout(): Promise<void> {
    return api.post('/auth/logout').then(handleResponse);
  },

  getCurrentUser(): Promise<{ user: AuthUser }> {
    return api.get('/auth/me').then(handleResponse);
  },

  updateProfile(data: { displayName?: string; color?: string }): Promise<{ user: AuthUser }> {
    return api.put('/auth/me', data).then(handleResponse);
  },
};

export function getUserId(): string {
  if (typeof window === 'undefined') return 'server';
  
  let userId = localStorage.getItem('collab-note-user-id');
  if (!userId) {
    userId = 'user-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('collab-note-user-id', userId);
  }
  return userId;
}

export function getUserName(): string {
  if (typeof window === 'undefined') return '匿名用户';
  
  let userName = localStorage.getItem('collab-note-user-name');
  if (!userName) {
    const colors = ['红', '蓝', '绿', '黄', '紫', '青', '橙', '粉'];
    userName = colors[Math.floor(Math.random() * colors.length)] + '色用户';
    localStorage.setItem('collab-note-user-name', userName);
  }
  return userName;
}

export function setUserName(name: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('collab-note-user-name', name);
}
