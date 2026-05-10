import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { User, Note } from '@/types';

interface SocketCallbacks {
  onJoined?: (data: { user: User; note: Note; users: User[] }) => void;
  onUserJoined?: (data: { user: User }) => void;
  onUserLeft?: (data: { userId: string; user: User }) => void;
  onContentUpdated?: (data: { userId: string; content: string; title?: string }) => void;
  onUserCursor?: (data: {
    userId: string;
    user: User;
    position: number;
    selection?: { start: number; end: number };
  }) => void;
  onError?: (data: { message: string }) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
}

export function useSocket(callbacks: SocketCallbacks = {}) {
  const socketRef = useRef<Socket | null>(null);
  const callbacksRef = useRef<SocketCallbacks>(callbacks);

  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  useEffect(() => {
    socketRef.current = io('http://localhost:3001', {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      callbacksRef.current.onConnected?.();
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      callbacksRef.current.onDisconnected?.();
    });

    socket.on('joined', (data) => {
      callbacksRef.current.onJoined?.(data);
    });

    socket.on('user-joined', (data) => {
      callbacksRef.current.onUserJoined?.(data);
    });

    socket.on('user-left', (data) => {
      callbacksRef.current.onUserLeft?.(data);
    });

    socket.on('content-updated', (data) => {
      callbacksRef.current.onContentUpdated?.(data);
    });

    socket.on('user-cursor', (data) => {
      callbacksRef.current.onUserCursor?.(data);
    });

    socket.on('error', (data) => {
      callbacksRef.current.onError?.(data);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);

  const joinNote = useCallback((noteId: string, userName: string) => {
    socketRef.current?.emit('join-note', { noteId, userName });
  }, []);

  const leaveNote = useCallback((noteId: string) => {
    socketRef.current?.emit('leave-note', { noteId });
  }, []);

  const updateContent = useCallback(
    (noteId: string, content: string, title?: string) => {
      socketRef.current?.emit('update-content', { noteId, content, title });
    },
    []
  );

  const moveCursor = useCallback(
    (noteId: string, position: number, selection?: { start: number; end: number }) => {
      socketRef.current?.emit('cursor-move', { noteId, position, selection });
    },
    []
  );

  return {
    joinNote,
    leaveNote,
    updateContent,
    moveCursor,
  };
}
