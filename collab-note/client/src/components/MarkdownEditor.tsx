import React, { useRef, useCallback, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, RemoteCursor } from '@/types';

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  remoteUsers: User[];
  remoteCursors: Map<string, RemoteCursor>;
  onCursorMove: (position: number, selection?: { start: number; end: number }) => void;
  collaboratorActivity?: string | null;
  isConnected?: boolean;
}

interface CursorPosition {
  top: number;
  left: number;
  height: number;
}

function calculateCursorPosition(
  textarea: HTMLTextAreaElement,
  position: number
): CursorPosition | null {
  const mirror = document.createElement('div');
  const computed = window.getComputedStyle(textarea);

  mirror.style.cssText = `
    position: absolute;
    visibility: hidden;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow: hidden;
    font-family: ${computed.fontFamily};
    font-size: ${computed.fontSize};
    line-height: ${computed.lineHeight};
    padding: ${computed.padding};
    border: ${computed.border};
    box-sizing: ${computed.boxSizing};
    width: ${computed.width};
    height: ${computed.height};
    letter-spacing: ${computed.letterSpacing};
  `;

  const textBeforeCursor = textarea.value.substring(0, position);
  const textAfterCursor = textarea.value.substring(position);

  mirror.textContent = textBeforeCursor;

  const marker = document.createElement('span');
  marker.textContent = '\u200b';
  mirror.appendChild(marker);

  const afterSpan = document.createElement('span');
  afterSpan.textContent = textAfterCursor || ' ';
  mirror.appendChild(afterSpan);

  document.body.appendChild(mirror);

  const markerRect = marker.getBoundingClientRect();
  const mirrorRect = mirror.getBoundingClientRect();

  document.body.removeChild(mirror);

  return {
    top: markerRect.top - mirrorRect.top,
    left: markerRect.left - mirrorRect.left,
    height: parseFloat(computed.lineHeight) || 20,
  };
}

export default function MarkdownEditor({
  content,
  onChange,
  remoteUsers,
  remoteCursors,
  onCursorMove,
  collaboratorActivity,
  isConnected = true,
}: MarkdownEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const cursorsOverlayRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [showEditor, setShowEditor] = useState(true);
  const [cursorPositions, setCursorPositions] = useState<Map<string, CursorPosition>>(new Map());

  const updateRemoteCursorPositions = useCallback(() => {
    if (!editorRef.current) return;

    const positions = new Map<string, CursorPosition>();

    remoteCursors.forEach((cursor, userId) => {
      const pos = calculateCursorPosition(editorRef.current!, cursor.position);
      if (pos) {
        positions.set(userId, pos);
      }
    });

    setCursorPositions(positions);
  }, [remoteCursors]);

  useEffect(() => {
    updateRemoteCursorPositions();
  }, [remoteCursors, content, updateRemoteCursorPositions]);

  useEffect(() => {
    const handleResize = () => {
      updateRemoteCursorPositions();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateRemoteCursorPositions]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
      setTimeout(updateRemoteCursorPositions, 0);
    },
    [onChange, updateRemoteCursorPositions]
  );

  const handleSelectionChange = useCallback(() => {
    if (editorRef.current) {
      const target = editorRef.current;
      onCursorMove(target.selectionStart, {
        start: target.selectionStart,
        end: target.selectionEnd,
      });
    }
  }, [onCursorMove]);

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      handleSelectionChange();
    },
    [handleSelectionChange]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLTextAreaElement>) => {
      setTimeout(handleSelectionChange, 0);
    },
    [handleSelectionChange]
  );

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLTextAreaElement>) => {
      if (previewRef.current && editorRef.current) {
        const textarea = editorRef.current;
        const scrollPercentage =
          textarea.scrollTop / (textarea.scrollHeight - textarea.clientHeight || 1);
        previewRef.current.scrollTop =
          scrollPercentage * (previewRef.current.scrollHeight - previewRef.current.clientHeight);
      }
    },
    []
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEditor(!showEditor)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              showEditor
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-500 hover:bg-gray-200'
            }`}
          >
            编辑
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              showPreview
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-500 hover:bg-gray-200'
            }`}
          >
            预览
          </button>
        </div>

        {remoteUsers.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">在线:</span>
            <div className="flex -space-x-2">
              {remoteUsers.slice(0, 5).map((user) => (
                <div
                  key={user.id}
                  className="user-avatar text-xs border-2 border-white relative group"
                  style={{ backgroundColor: user.color }}
                  title={user.name}
                >
                  {user.name.charAt(0)}
                  <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
                </div>
              ))}
              {remoteUsers.length > 5 && (
                <div className="user-avatar text-xs border-2 border-white bg-gray-400">
                  +{remoteUsers.length - 5}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {collaboratorActivity && (
        <div className="bg-primary-50 px-4 py-2 border-b border-primary-100 text-sm text-primary-700 animate-pulse">
          {collaboratorActivity}
        </div>
      )}

      {!isConnected && (
        <div className="bg-amber-50 px-4 py-2 border-b border-amber-100 text-sm text-amber-700">
          连接已断开，尝试重新连接中...
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {showEditor && (
          <div
          ref={editorWrapperRef}
          className={`relative flex-1 overflow-hidden ${
            showPreview ? 'border-r' : ''}
          `}
        >
          <textarea
            ref={editorRef}
            value={content}
            onChange={handleChange}
            onKeyUp={handleKeyUp}
            onClick={handleClick}
            onSelect={handleSelectionChange}
            onScroll={handleScroll}
            className="editor-textarea w-full h-full p-4"
            placeholder="在这里输入 Markdown 内容..."
            spellCheck={false}
          />

          {remoteCursors.size > 0 && (
            <div
              ref={cursorsOverlayRef}
              className="absolute inset-0 pointer-events-none overflow-hidden"
              style={{
                marginTop: '16px',
                marginLeft: '16px',
              }}
            >
              {Array.from(remoteCursors.entries()).map(([userId, cursor]) => {
                const pos = cursorPositions.get(userId);
                if (!pos) return null;

                const user = remoteUsers.find((u) => u.id === userId);
                if (!user) return null;

                return (
                  <div
                  key={userId}
                  className="absolute"
                  style={{
                    top: pos.top,
                    left: pos.left,
                  }}
                >
                  <div
                    className="w-0.5 h-5"
                    style={{ backgroundColor: user.color }}
                  ></div>
                  <div
                    className="remote-cursor-name"
                    style={{ backgroundColor: user.color }}
                  >
                    {user.name}
                  </div>
                </div>
              );
            })}
            </div>
          )}
        </div>
        )}

        {showPreview && (
          <div
            ref={previewRef}
            className="flex-1 overflow-y-auto p-4 markdown-preview bg-white"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content || '开始编辑笔记...'}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
