import { Router, Request, Response } from 'express';
import { versionStore, noteStore } from '../utils/jsonStore';

const router = Router();

router.get('/note/:noteId', (req: Request, res: Response) => {
  const note = noteStore.getById(req.params.noteId);
  if (!note) {
    return res.status(404).json({ success: false, error: '笔记不存在' });
  }

  const versions = versionStore.getByNoteId(req.params.noteId);
  res.json({ success: true, data: versions });
});

router.get('/note/:noteId/:versionId', (req: Request, res: Response) => {
  const { noteId, versionId } = req.params;

  const note = noteStore.getById(noteId);
  if (!note) {
    return res.status(404).json({ success: false, error: '笔记不存在' });
  }

  const version = versionStore.getById(noteId, versionId);
  if (!version) {
    return res.status(404).json({ success: false, error: '版本不存在' });
  }

  res.json({ success: true, data: version });
});

router.post('/note/:noteId/restore/:versionId', (req: Request, res: Response) => {
  const { noteId, versionId } = req.params;
  const { authorId = 'anonymous' } = req.body;

  const note = noteStore.getById(noteId);
  if (!note) {
    return res.status(404).json({ success: false, error: '笔记不存在' });
  }

  const version = versionStore.getById(noteId, versionId);
  if (!version) {
    return res.status(404).json({ success: false, error: '版本不存在' });
  }

  const updated = noteStore.update(noteId, {
    title: version.title,
    content: version.content,
  });

  if (updated) {
    const newVersion = {
      id: require('uuid').v4(),
      noteId: updated.id,
      title: updated.title,
      content: updated.content,
      createdAt: Date.now(),
      authorId,
    };
    versionStore.create(newVersion);
  }

  res.json({ success: true, data: updated });
});

export default router;
