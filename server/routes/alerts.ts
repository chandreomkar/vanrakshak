import { Router } from 'express';
import { db } from '../db.js';

export const alertsRouter = Router();

// GET alerts with filtering
alertsRouter.get('/', (req, res) => {
  try {
    const { eventType, zone, status } = req.query;

    let query = 'SELECT * FROM alerts WHERE 1=1';
    const params: any[] = [];

    if (eventType && eventType !== 'all') {
      query += ' AND eventType = ?';
      params.push(eventType);
    }
    if (zone && zone !== 'all') {
      query += ' AND zone = ?';
      params.push(zone);
    }
    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY timestamp DESC';

    const alerts = db.prepare(query).all(...params);
    res.json(alerts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET alert by ID
alertsRouter.get('/:id', (req, res) => {
  try {
    const alert = db.prepare('SELECT * FROM alerts WHERE id = ?').get(req.params.id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    // Attach verification actions audit trail
    const actions = db.prepare('SELECT * FROM verificationActions WHERE alertId = ? ORDER BY createdAt DESC').all(req.params.id);

    res.json({
      ...alert,
      actions,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH alert status & create verification action
alertsRouter.patch('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, note, userId = 'user-ranger', userName = 'Ranger Vikram Singh' } = req.body;

    const validStatuses = ['pending', 'verified', 'false_positive', 'patrol_requested', 'assigned'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const alert: any = db.prepare('SELECT * FROM alerts WHERE id = ?').get(id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    const now = new Date().toISOString();

    // Update alert
    const updateAlert = db.prepare(`
      UPDATE alerts SET
        status = ?,
        verificationNote = ?,
        updatedAt = ?
      WHERE id = ?
    `);

    // Insert verificationAction audit record
    const actionId = `act-${Date.now()}`;
    const insertAction = db.prepare(`
      INSERT INTO verificationActions (id, alertId, userId, userName, action, note, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    // Update system metrics counts
    const updateMetrics = () => {
      const today = new Date().toISOString().split('T')[0];
      const verifiedCount = (db.prepare("SELECT COUNT(*) as c FROM alerts WHERE status = 'verified'").get() as any).c;
      const fpCount = (db.prepare("SELECT COUNT(*) as c FROM alerts WHERE status = 'false_positive'").get() as any).c;
      const pendingCount = (db.prepare("SELECT COUNT(*) as c FROM alerts WHERE status = 'pending'").get() as any).c;

      db.prepare(`
        UPDATE systemMetrics SET
          verifiedAlerts = ?,
          falsePositives = ?,
          pendingVerification = ?
        WHERE metricDate = ?
      `).run(verifiedCount, fpCount, pendingCount, today);
    };

    const tx = db.transaction(() => {
      updateAlert.run(status, note || null, now, id);
      insertAction.run(actionId, id, userId, userName, status, note || 'Status changed by ranger', now);
      updateMetrics();
    });

    tx();

    const updatedAlert: any = db.prepare('SELECT * FROM alerts WHERE id = ?').get(id);
    const actions = db.prepare('SELECT * FROM verificationActions WHERE alertId = ? ORDER BY createdAt DESC').all(id);

    res.json({
      ...updatedAlert,
      actions,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
