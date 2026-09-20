import { Router } from 'express';
import { db } from '../db.js';

export const settingsRouter = Router();

settingsRouter.get('/', (req, res) => {
  try {
    const rows: any[] = db.prepare('SELECT key, value, updatedAt FROM projectSettings').all();
    const settings: Record<string, string> = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

settingsRouter.patch('/', (req, res) => {
  try {
    const updates = req.body;
    const now = new Date().toISOString();

    const upsert = db.prepare(`
      INSERT INTO projectSettings (key, value, updatedAt)
      VALUES (?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = excluded.updatedAt
    `);

    const tx = db.transaction(() => {
      for (const [key, value] of Object.entries(updates)) {
        upsert.run(key, String(value), now);
      }
    });

    tx();

    const rows: any[] = db.prepare('SELECT key, value, updatedAt FROM projectSettings').all();
    const settings: Record<string, string> = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
