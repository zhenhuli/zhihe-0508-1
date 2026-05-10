import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { shareStore, noteStore } from '../utils/jsonStore';
import { Share } from '../types';

const router = Router();

router.post('/note/:noteId', (req: Request, res: Response) => {
  const { noteId } = req.params;

  const note = noteStore.getById(noteId);
  if (!note) {
    return res.status(404).json({ success: false, error: '笔记不存在' });
  }

  const existingShare = shareStore.getByNoteId(noteId);
  if (existingShare) {
    return res.json({ success: true, data: existingShare });
  }

  const now = Date.now();
  const share: Share = {
    id: uuidv4(),
    noteId,
    token: uuidv4().replace(/-/g, '').slice(0, 16),
    createdAt: now,
    expiresAt: null,
  };

  const created = shareStore.create(share);
  res.status(201).json({ success: true, data: created });
});

router.get('/token/:token', (req: Request, res: Response) => {
  const { token } = req.params;

  const share = shareStore.getByToken(token);
  if (!share) {
    return res.status(404).json({ success: false, error: '分享链接无效' });
  }

  if (share.expiresAt && Date.now() > share.expiresAt) {
    return res.status(410).json({ success: false, error: '分享链接已过期' });
  }

  const note = noteStore.getById(share.noteId);
  if (!note) {
    return res.status(404).json({ success: false, error: '笔记不存在' });
  }

  res.json({
    success: true,
    data: {
      note,
      share,
    },
  });
});

router.delete('/note/:noteId', (req: Request, res: Response) => {
  const { noteId } = req.params;

  const note = noteStore.getById(noteId);
  if (!note) {
    return res.status(404).json({ success: false, error: '笔记不存在' });
  }

  shareStore.deleteByNoteId(noteId);
  res.json({ success: true, data: null });
});

export default router;
