import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { noteStore, versionStore, shareStore } from '../utils/jsonStore';
import { Note, VersionSnapshot } from '../types';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const { categoryId } = req.query;

  let notes: Note[];
  if (categoryId) {
    notes = noteStore.getByCategory(categoryId as string);
  } else if (categoryId === null || categoryId === 'null') {
    notes = noteStore.getByCategory(null);
  } else {
    notes = noteStore.getAll();
  }

  res.json({ success: true, data: notes });
});

router.get('/:id', (req: Request, res: Response) => {
  const note = noteStore.getById(req.params.id);
  if (!note) {
    return res.status(404).json({ success: false, error: '笔记不存在' });
  }
  res.json({ success: true, data: note });
});

router.post('/', (req: Request, res: Response) => {
  const { title = '无标题', content = '', categoryId = null, authorId = 'anonymous' } = req.body;

  const now = Date.now();
  const note: Note = {
    id: uuidv4(),
    title,
    content,
    categoryId,
    createdAt: now,
    updatedAt: now,
    authorId,
  };

  const created = noteStore.create(note);

  const version: VersionSnapshot = {
    id: uuidv4(),
    noteId: created.id,
    title: created.title,
    content: created.content,
    createdAt: now,
    authorId,
  };
  versionStore.create(version);

  res.status(201).json({ success: true, data: created });
});

router.put('/:id', (req: Request, res: Response) => {
  const { title, content, categoryId, authorId = 'anonymous', createVersion = true } = req.body;
  const noteId = req.params.id;

  const existingNote = noteStore.getById(noteId);
  if (!existingNote) {
    return res.status(404).json({ success: false, error: '笔记不存在' });
  }

  const updates: Partial<Note> = {};
  if (title !== undefined) updates.title = title;
  if (content !== undefined) updates.content = content;
  if (categoryId !== undefined) updates.categoryId = categoryId;

  const hasContentChanged =
    (title !== undefined && title !== existingNote.title) ||
    (content !== undefined && content !== existingNote.content);

  const updated = noteStore.update(noteId, updates);
  if (!updated) {
    return res.status(404).json({ success: false, error: '笔记不存在' });
  }

  if (hasContentChanged && createVersion) {
    const version: VersionSnapshot = {
      id: uuidv4(),
      noteId: updated.id,
      title: updated.title,
      content: updated.content,
      createdAt: Date.now(),
      authorId,
    };
    versionStore.create(version);
  }

  res.json({ success: true, data: updated });
});

router.delete('/:id', (req: Request, res: Response) => {
  const noteId = req.params.id;

  versionStore.deleteByNoteId(noteId);
  shareStore.deleteByNoteId(noteId);

  const deleted = noteStore.delete(noteId);
  if (!deleted) {
    return res.status(404).json({ success: false, error: '笔记不存在' });
  }

  res.json({ success: true, data: null });
});

export default router;
