import React from 'react';
import { FolderOpen, Plus, Edit2, Trash2, FileText, Layout } from 'lucide-react';
import { Category, Note } from '@/types';

interface SidebarProps {
  categories: Category[];
  notes: Note[];
  selectedCategoryId: string | null;
  selectedNoteId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onSelectNote: (noteId: string) => void;
  onCreateNote: () => void;
  onCreateCategory: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
  onDeleteNote: (noteId: string) => void;
}

export default function Sidebar({
  categories,
  notes,
  selectedCategoryId,
  selectedNoteId,
  onSelectCategory,
  onSelectNote,
  onCreateNote,
  onCreateCategory,
  onEditCategory,
  onDeleteCategory,
  onDeleteNote,
}: SidebarProps) {
  const filteredNotes = selectedCategoryId
    ? notes.filter((note) => note.categoryId === selectedCategoryId)
    : notes;

  const getCategoryById = (categoryId: string | null) => {
    if (!categoryId) return null;
    return categories.find((c) => c.id === categoryId);
  };

  return (
    <div className="w-72 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-6 h-6 text-primary-600" />
          <h1 className="text-xl font-bold text-gray-900">协作笔记</h1>
        </div>
        <button
          onClick={onCreateNote}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          新建笔记
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="p-3">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              分类
            </span>
            <button
              onClick={onCreateCategory}
              className="text-gray-400 hover:text-primary-600 transition-colors"
              title="新建分类"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div
            className={`sidebar-item ${selectedCategoryId === null ? 'active' : ''}`}
            onClick={() => onSelectCategory(null)}
          >
            <Layout className="w-4 h-4" />
            <span className="flex-1">全部笔记</span>
            <span className="text-xs text-gray-400">{notes.length}</span>
          </div>

          {categories.map((category) => (
            <div key={category.id} className="group">
              <div
                className={`sidebar-item ${selectedCategoryId === category.id ? 'active' : ''}`}
                onClick={() => onSelectCategory(category.id)}
              >
                <FolderOpen className="w-4 h-4" style={{ color: category.color }} />
                <span className="flex-1 truncate">{category.name}</span>
                <span className="text-xs text-gray-400">
                  {notes.filter((n) => n.categoryId === category.id).length}
                </span>
                <div className="hidden group-hover:flex items-center gap-1 ml-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditCategory(category);
                    }}
                    className="p-1 text-gray-400 hover:text-primary-600 rounded"
                    title="编辑分类"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCategory(category);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                    title="删除分类"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-gray-200 mt-2">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1 mb-2">
            {selectedCategoryId === null ? '全部笔记' : '分类笔记'} ({filteredNotes.length})
          </div>

          {filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              暂无笔记，点击上方按钮创建
            </div>
          ) : (
            <div className="space-y-1">
              {filteredNotes.map((note) => {
                const category = getCategoryById(note.categoryId);
                return (
                  <div
                    key={note.id}
                    className={`sidebar-item group ${selectedNoteId === note.id ? 'active' : ''}`}
                    onClick={() => onSelectNote(note.id)}
                  >
                    <FileText className="w-4 h-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate">
                        {note.title || '无标题'}
                      </div>
                      {category && (
                        <div
                          className="category-pill mt-1"
                          style={{ backgroundColor: category.color }}
                        >
                          {category.name}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNote(note.id);
                      }}
                      className="hidden group-hover:block p-1 text-gray-400 hover:text-red-600 rounded"
                      title="删除笔记"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
