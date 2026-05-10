import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, FileText, Lock, AlertCircle } from 'lucide-react';
import { shareApi } from '@/utils/api';
import { Note, Share } from '@/types';

interface ShareData {
  note: Note;
  share: Share;
}

export default function SharePage() {
  const router = useRouter();
  const { token } = router.query;
  const [data, setData] = useState<ShareData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const loadShareData = async () => {
      setLoading(true);
      setError(null);
      try {
        const shareData = await shareApi.getByToken(token as string);
        setData(shareData);
      } catch (err: any) {
        setError(err.message || '加载分享笔记失败');
      } finally {
        setLoading(false);
      }
    };

    loadShareData();
  }, [token]);

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">无法访问</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="btn-primary inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { note } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900 truncate max-w-md">
                  {note.title || '无标题'}
                </h1>
                <p className="text-xs text-gray-500">
                  最后更新: {new Date(note.updatedAt).toLocaleString('zh-CN')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                <Lock className="w-3 h-3" />
                只读分享
              </div>
              <button
                onClick={() => router.push('/')}
                className="btn-secondary text-sm"
              >
                返回首页
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <article className="bg-white rounded-xl shadow-sm p-8 markdown-preview">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {note.content || '这篇笔记还没有内容'}
          </ReactMarkdown>
        </article>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            由协作笔记分享 · 只能查看，无法编辑
          </p>
        </div>
      </main>
    </div>
  );
}
