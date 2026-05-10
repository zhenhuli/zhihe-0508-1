import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Clock, RotateCcw, Eye, X } from 'lucide-react';
import { VersionSnapshot, Note } from '@/types';
import { versionApi, getUserId } from '@/utils/api';

interface VersionHistoryProps {
  note: Note;
  onClose: () => void;
  onRestore: (note: Note) => void;
}

export default function VersionHistory({
  note,
  onClose,
  onRestore,
}: VersionHistoryProps) {
  const [versions, setVersions] = useState<VersionSnapshot[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<VersionSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    loadVersions();
  }, [note.id]);

  const loadVersions = async () => {
    setLoading(true);
    try {
      const data = await versionApi.getByNoteId(note.id);
      setVersions(data);
      if (data.length > 0) {
        setSelectedVersion(data[0]);
      }
    } catch (error) {
      console.error('加载版本历史失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!selectedVersion) return;

    setRestoring(true);
    try {
      const restoredNote = await versionApi.restore(
        note.id,
        selectedVersion.id,
        getUserId()
      );
      onRestore(restoredNote);
      onClose();
    } catch (error) {
      console.error('恢复版本失败:', error);
    } finally {
      setRestoring(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            版本历史 - {note.title || '无标题'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-80 border-r bg-gray-50 overflow-y-auto scrollbar-thin">
            {loading ? (
              <div className="flex items-center justify-center h-32 text-gray-400">
                加载中...
              </div>
            ) : versions.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-gray-400">
                暂无版本历史
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {versions.map((version, index) => (
                  <div
                    key={version.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedVersion?.id === version.id
                        ? 'bg-primary-50 border border-primary-200'
                        : 'hover:bg-white border border-transparent'
                    }`}
                    onClick={() => setSelectedVersion(version)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        版本 {versions.length - index}
                      </span>
                      {index === 0 && (
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                          最新
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(version.createdAt)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1 truncate">
                      {version.title || '无标题'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Eye className="w-4 h-4" />
                {selectedVersion ? (
                  <span>预览: {formatDate(selectedVersion.createdAt)}</span>
                ) : (
                  <span>选择一个版本查看预览</span>
                )}
              </div>
              {selectedVersion && (
                <button
                  onClick={handleRestore}
                  disabled={restoring}
                  className="btn-primary flex items-center gap-2 text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  {restoring ? '恢复中...' : '恢复此版本'}
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {selectedVersion ? (
                <div className="p-6 markdown-preview">
                  <h2 className="text-2xl font-bold mb-4 pb-2 border-b">
                    {selectedVersion.title || '无标题'}
                  </h2>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {selectedVersion.content || ''}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-400">
                  选择左侧的版本进行预览
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
