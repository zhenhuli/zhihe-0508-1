import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { categoryStore, noteStore } from '../utils/jsonStore';
import { Category } from '../types';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const categories = categoryStore.getAll();
  res.json({ success: true, data: categories });
});

router.get('/:id', (req: Request, res: Response) => {
  const category = categoryStore.getById(req.params.id);
  if (!category) {
    return res.status(404).json({ success: false, error: '分类不存在' });
  }
  res.json({ success: true, data: category });
});

router.post('/', (req: Request, res: Response) => {
  const { name, color = '#3b82f6' } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ success: false, error: '分类名称不能为空' });
  }

  const now = Date.now();
  const category: Category = {
    id: uuidv4(),
    name: name.trim(),
    color,
    createdAt: now,
    updatedAt: now,
  };

  const created = categoryStore.create(category);
  res.status(201).json({ success: true, data: created });
});

router.put('/:id', (req: Request, res: Response) => {
  const { name, color } = req.body;
  const updates: Partial<Category> = {};

  if (name !== undefined && name.trim() === '') {
    return res.status(400).json({ success: false, error: '分类名称不能为空' });
  }

  if (name) updates.name = name.trim();
  if (color) updates.color = color;

  const updated = categoryStore.update(req.params.id, updates);
  if (!updated) {
    return res.status(404).json({ success: false, error: '分类不存在' });
  }

  res.json({ success: true, data: updated });
});

router.delete('/:id', (req: Request, res: Response) => {
  const categoryId = req.params.id;

  const notesInCategory = noteStore.getByCategory(categoryId);
  notesInCategory.forEach(note => {
    noteStore.update(note.id, { categoryId: null });
  });

  const deleted = categoryStore.delete(categoryId);
  if (!deleted) {
    return res.status(404).json({ success: false, error: '分类不存在' });
  }

  res.json({ success: true, data: null });
});

export default router;
