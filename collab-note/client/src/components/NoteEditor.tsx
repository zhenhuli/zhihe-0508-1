import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Save,
  FolderOpen,
  Share2,
  History,
  Clock,
  ChevronDown,
  Wifi,
  WifiOff,
  Users,
} from 'lucide-react';
import MarkdownEditor from './MarkdownEditor';
import Modal from './Modal';
import { Note, Category, User, RemoteCursor, VersionSnapshot, Share } from '@/types';
import { useSocket } from '@/hooks/useSocket';
import { useAuth } from '@/context/AuthContext';
import { noteApi, versionApi, shareApi, getUserId } from '@/utils/api';

interface NoteEditorProps {
  note: Note | null;
  categories: Category[];
  onNoteUpdate: (note: Note) => void;
  onShowVersions: (note: Note) => void;
}

export default function NoteEditor({
  note,
  categories,
  onNoteUpdate,
  onShowVersions,
}: NoteEditorProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<User[]>([]);
  const [remoteCursors, setRemoteCursors] = useState<Map<string, RemoteCursor>>(new Map());
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [collaboratorActivity, setCollaboratorActivity] = useState<string | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { joinNote, leaveNote, updateContent, moveCursor } = useSocket({
    onConnected: () => {
      console.log('Socket connected');
      setIsConnected(true);
    },
    onDisconnected: () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    },
    onJoined: (data) => {
      setRemoteUsers(data.users.filter((u) => u.id !== data.user.id));
      setIsConnected(true);
    },
    onUserJoined: (data) => {
      setRemoteUsers((prev) => [...prev, data.user]);
      setCollaboratorActivity(`${data.user.name} 加入了协作`);
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
      activityTimeoutRef.current = setTimeout(() => {
        setCollaboratorActivity(null);
      }, 3000);
    },
    onUserLeft: (data) => {
      setRemoteUsers((prev) => prev.filter((u) => u.id !== data.userId));
      setRemoteCursors((prev) => {
        const next = new Map(prev);
        next.delete(data.userId);
        return next;
      });
      setCollaboratorActivity(`${data.user.name} 离开了`);
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
      activityTimeoutRef.current = setTimeout(() => {
        setCollaboratorActivity(null);
      }, 3000);
    },
    onContentUpdated: (data) => {
      setContent(data.content);
      if (data.title !== undefined) {
        setTitle(data.title);
      }
    },
    onUserCursor: (data) => {
      setRemoteCursors((prev) => {
        const next = new Map(prev);
        next.set(data.userId, data);
        return next;
      });
    },
  });

  useEffect(() => {
    if (note && user) {
      setTitle(note.title);
      setContent(note.content);
      setCategoryId(note.categoryId);
      joinNote(note.id, user.displayName);
    }

    return () => {
      if (note) {
        leaveNote(note.id);
      }
    };
  }, [note?.id, user?.id]);

  const saveNote = useCallback(
    async (options: { createVersion?: boolean } = {}) => {
      if (!note || !user) return;

      setSaving(true);
      try {
        const updated = await noteApi.update(note.id, {
          title,
          content,
          categoryId,
          authorId: user.id,
          createVersion: options.createVersion ?? false,
        });
        onNoteUpdate(updated);
        setLastSaved(new Date());
      } catch (error) {
        console.error('保存失败:', error);
      } finally {
        setSaving(false);
      }
    },
    [note, user, title, content, categoryId, onNoteUpdate]
  );

  useEffect(() => {
    if (!note) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      updateContent(note.id, content, title);
    }, 300);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, title, note?.id]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    saveNote();
  };

  const handleCategoryChange = (newCategoryId: string | null) => {
    setCategoryId(newCategoryId);
    setShowCategoryDropdown(false);
    setTimeout(() => saveNote(), 0);
  };

  const handleGenerateShareLink = async () => {
    if (!note) return;

    try {
      const share = await shareApi.create(note.id);
      const link = `${window.location.origin}/share/${share.token}`;
      setShareLink(link);
    } catch (error) {
      console.error('生成分享链接失败:', error);
    }
  };

  const handleCopyShareLink = async () => {
    if (shareLink) {
      try {
        await navigator.clipboard.writeText(shareLink);
      } catch (error) {
        console.error('复制失败:', error);
      }
    }
  };

  const getCategoryById = (id: string | null) => {
    if (!id) return null;
    return categories.find((c) => c.id === id);
  };

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-400">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-lg">选择一个笔记开始编辑</p>
          <p className="text-sm mt-2">或创建一个新笔记</p>
        </div>
      </div>
    );
  }

  const selectedCategory = getCategoryById(categoryId);

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="border-b px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              className="w-full text-2xl font-bold text-gray-900 outline-none focus:ring-0 border-0 p-0 placeholder-gray-300"
              placeholder="无标题"
            />
            <div className="flex items-center gap-4 mt-2 text-sm">
              <div className="flex items-center gap-1 text-gray-500">
                <Clock className="w-4 h-4" />
                {lastSaved ? (
                  <span>最后保存: {lastSaved.toLocaleTimeString()}</span>
                ) : (
                  <span>未保存</span>
                )}
                {saving && <span className="text-primary-600 ml-2">保存中...</span>}
              </div>

              <div className={`flex items-center gap-1 ${isConnected ? 'text-green-600' : 'text-red-500'}`}>
                {isConnected ? (
                  <Wifi className="w-4 h-4" />
                ) : (
                  <WifiOff className="w-4 h-4" />
                )}
                <span>{isConnected ? '已连接' : '未连接'}</span>
              </div>

              {remoteUsers.length > 0 && (
                <div className="flex items-center gap-1 text-primary-600">
                  <Users className="w-4 h-4" />
                  <span>{remoteUsers.length} 人协作中</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FolderOpen
                  className="w-4 h-4"
                  style={{ color: selectedCategory?.color || '#6b7280' }}
                />
                <span>{selectedCategory?.name || '未分类'}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showCategoryDropdown && (
                <div className="dropdown-menu">
                  <div
                    className="dropdown-item"
                    onClick={() => handleCategoryChange(null)}
                  >
                    未分类
                  </div>
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="dropdown-item"
                      onClick={() => handleCategoryChange(category.id)}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => saveNote({ createVersion: true })}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              保存版本
            </button>

            <button
              onClick={() => onShowVersions(note)}
              className="btn-secondary flex items-center gap-2"
              title="历史版本"
            >
              <History className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                handleGenerateShareLink();
                setShowShareModal(true);
              }}
              className="btn-secondary flex items-center gap-2"
              title="分享"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <MarkdownEditor
        content={content}
        onChange={setContent}
        remoteUsers={remoteUsers}
        remoteCursors={remoteCursors}
        collaboratorActivity={collaboratorActivity}
        isConnected={isConnected}
        onCursorMove={(position, selection) => {
          if (note) {
            moveCursor(note.id, position, selection);
          }
        }}
      />

      <Modal
        isOpen={showShareModal}
        onClose={() => {
          setShowShareModal(false);
          setShareLink(null);
        }}
        title="分享笔记"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            生成只读分享链接，任何人都可以查看此笔记的内容，但不能编辑。
          </p>

          {!shareLink ? (
            <button
              onClick={handleGenerateShareLink}
              className="w-full btn-primary"
            >
              生成分享链接
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="input-field flex-1"
                />
                <button onClick={handleCopyShareLink} className="btn-primary">
                  复制
                </button>
              </div>
              <p className="text-sm text-green-600">链接已生成，可安全分享</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
