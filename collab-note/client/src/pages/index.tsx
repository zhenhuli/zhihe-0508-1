import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { LogOut, Settings } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import NoteEditor from '@/components/NoteEditor';
import Modal from '@/components/Modal';
import CategoryForm from '@/components/CategoryForm';
import VersionHistory from '@/components/VersionHistory';
import AuthPage from '@/components/AuthPage';
import { Category, Note, AuthUser } from '@/types';
import { useAuth } from '@/context/AuthContext';
import {
  categoryApi,
  noteApi,
  getUserId,
} from '@/utils/api';

interface UserProfileModalProps {
  user: AuthUser;
  onClose: () => void;
  onUpdate: (data: { displayName?: string; color?: string }) => Promise<void>;
}

function UserProfileModal({ user, onClose, onUpdate }: UserProfileModalProps) {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [color, setColor] = useState(user.color);
  const [loading, setLoading] = useState(false);

  const colors = [
    '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
    '#3b82f6', '#8b5cf6', '#ec4899', '#64748b', '#14b8a6'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdate({ displayName, color });
      onClose();
    } catch (error) {
      console.error('更新失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="个人设置">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            用户名
          </label>
          <input
            type="text"
            value={user.username}
            disabled
            className="input-field bg-gray-100 text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            显示名称
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="input-field"
            placeholder="显示给其他人的名称"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            用户颜色
          </label>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full transition-transform ${
                  color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            取消
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {loading ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function AppContent() {
  const { user, logout, updateProfile } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [categoriesData, notesData] = await Promise.all([
        categoryApi.getAll(),
        noteApi.getAll(),
      ]);
      setCategories(categoriesData);
      setNotes(notesData);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, loadData]);

  const handleCreateNote = async () => {
    if (!user) return;
    try {
      const note = await noteApi.create({
        title: '新笔记',
        content: '# 新笔记\n\n开始编辑你的笔记内容...',
        categoryId: selectedCategoryId,
        authorId: user.id,
      });
      setNotes((prev) => [note, ...prev]);
      setSelectedNote(note);
    } catch (error) {
      console.error('创建笔记失败:', error);
    }
  };

  const handleSelectNote = async (noteId: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (note) {
      setSelectedNote(note);
    }
  };

  const handleNoteUpdate = (updatedNote: Note) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === updatedNote.id ? updatedNote : n))
    );
    setSelectedNote(updatedNote);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('确定要删除这个笔记吗？此操作不可恢复。')) return;

    try {
      await noteApi.delete(noteId);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
      }
    } catch (error) {
      console.error('删除笔记失败:', error);
    }
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const handleSubmitCategory = async (name: string, color: string) => {
    try {
      if (editingCategory) {
        const updated = await categoryApi.update(editingCategory.id, { name, color });
        setCategories((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c))
        );
      } else {
        const created = await categoryApi.create(name, color);
        setCategories((prev) => [created, ...prev]);
      }
      setShowCategoryModal(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('保存分类失败:', error);
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    if (
      !confirm(
        `确定要删除分类"${category.name}"吗？该分类下的笔记将变为未分类。`
      )
    )
      return;

    try {
      await categoryApi.delete(category.id);
      setCategories((prev) => prev.filter((c) => c.id !== category.id));
      if (selectedCategoryId === category.id) {
        setSelectedCategoryId(null);
      }
    } catch (error) {
      console.error('删除分类失败:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  return (
    <div className="h-screen flex bg-white">
      <div className="w-72 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 text-primary-600">📝</div>
            <h1 className="text-xl font-bold text-gray-900">协作笔记</h1>
          </div>
          <button
            onClick={handleCreateNote}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <span className="text-sm">+</span>
            新建笔记
          </button>
        </div>

        {user && (
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <div
                className="user-avatar flex-shrink-0"
                style={{ backgroundColor: user.color }}
              >
                {user.displayName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {user.displayName}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  @{user.username}
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setShowUserProfile(true)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
                  title="个人设置"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="退出登录"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <Sidebar
            categories={categories}
            notes={notes}
            selectedCategoryId={selectedCategoryId}
            selectedNoteId={selectedNote?.id || null}
            onSelectCategory={setSelectedCategoryId}
            onSelectNote={handleSelectNote}
            onCreateNote={handleCreateNote}
            onCreateCategory={handleCreateCategory}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
            onDeleteNote={handleDeleteNote}
          />
        </div>
      </div>

      <NoteEditor
        note={selectedNote}
        categories={categories}
        onNoteUpdate={handleNoteUpdate}
        onShowVersions={(note) => {
          setSelectedNote(note);
          setShowVersionHistory(true);
        }}
      />

      <Modal
        isOpen={showCategoryModal}
        onClose={() => {
          setShowCategoryModal(false);
          setEditingCategory(null);
        }}
        title={editingCategory ? '编辑分类' : '新建分类'}
      >
        <CategoryForm
          category={editingCategory}
          onSubmit={handleSubmitCategory}
          onCancel={() => {
            setShowCategoryModal(false);
            setEditingCategory(null);
          }}
        />
      </Modal>

      {selectedNote && showVersionHistory && (
        <VersionHistory
          note={selectedNote}
          onClose={() => setShowVersionHistory(false)}
          onRestore={handleNoteUpdate}
        />
      )}

      {user && showUserProfile && (
        <UserProfileModal
          user={user}
          onClose={() => setShowUserProfile(false)}
          onUpdate={updateProfile}
        />
      )}
    </div>
  );
}

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <AppContent />;
}
