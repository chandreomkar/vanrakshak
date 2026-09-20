import { Router } from 'express';
import { db } from '../db.js';

export const actionsRouter = Router();

// GET all verification actions (Ranger audit log)
actionsRouter.get('/', (req, res) => {
  try {
    const actions = db.prepare(`
      SELECT va.*, a.nodeId, a.eventType, a.zone
      FROM verificationActions va
      LEFT JOIN alerts a ON va.alertId = a.id
      ORDER BY va.createdAt DESC
      LIMIT 100
    `).all();
    res.json(actions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET actions for a specific alert
actionsRouter.get('/alert/:alertId', (req, res) => {
  try {
    const actions = db.prepare('SELECT * FROM verificationActions WHERE alertId = ? ORDER BY createdAt DESC').all(req.params.alertId);
    res.json(actions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
