import { Router } from 'express';
import { db } from '../db.js';

export const nodesRouter = Router();

// GET all sensor nodes
nodesRouter.get('/', (req, res) => {
  try {
    const nodes = db.prepare('SELECT * FROM sensorNodes ORDER BY nodeId ASC').all();
    const formatted = nodes.map((n: any) => ({
      ...n,
      solarCharging: Boolean(n.solarCharging),
    }));
    res.json(formatted);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET single node by nodeId
nodesRouter.get('/:nodeId', (req, res) => {
  try {
    const node: any = db.prepare('SELECT * FROM sensorNodes WHERE nodeId = ?').get(req.params.nodeId);
    if (!node) {
      return res.status(404).json({ error: 'Node not found' });
    }
    res.json({
      ...node,
      solarCharging: Boolean(node.solarCharging),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new sensor node
nodesRouter.post('/', (req, res) => {
  try {
    const {
      nodeId,
      name,
      zone,
      status = 'online',
      batteryPercentage = 100,
      solarCharging = true,
      signalStrength = -75,
      firmwareVersion = '1.2.0-esp32s3',
      modelVersion = 'vanrakshak-tinyml-v1.4',
    } = req.body;

    if (!nodeId || !name || !zone) {
      return res.status(400).json({ error: 'Missing required fields: nodeId, name, zone' });
    }

    // Check duplicate
    const existing = db.prepare('SELECT id FROM sensorNodes WHERE nodeId = ?').get(nodeId);
    if (existing) {
      return res.status(409).json({ error: `Node ${nodeId} already exists` });
    }

    const now = new Date().toISOString();
    const id = `node-${Date.now()}`;

    const stmt = db.prepare(`
      INSERT INTO sensorNodes (
        id, nodeId, name, zone, status, batteryPercentage, solarCharging,
        signalStrength, firmwareVersion, modelVersion, lastSeenAt, lastEventType,
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      nodeId.trim().toUpperCase(),
      name.trim(),
      zone.trim(),
      status,
      Math.max(0, Math.min(100, Number(batteryPercentage))),
      solarCharging ? 1 : 0,
      Number(signalStrength),
      firmwareVersion,
      modelVersion,
      now,
      'registration',
      now,
      now
    );

    const created: any = db.prepare('SELECT * FROM sensorNodes WHERE id = ?').get(id);
    res.status(201).json({
      ...created,
      solarCharging: Boolean(created.solarCharging),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update existing node
nodesRouter.put('/:nodeId', (req, res) => {
  try {
    const { nodeId } = req.params;
    const existing: any = db.prepare('SELECT * FROM sensorNodes WHERE nodeId = ?').get(nodeId);
    if (!existing) {
      return res.status(404).json({ error: 'Node not found' });
    }

    const {
      name = existing.name,
      zone = existing.zone,
      status = existing.status,
      batteryPercentage = existing.batteryPercentage,
      solarCharging = existing.solarCharging,
      signalStrength = existing.signalStrength,
      firmwareVersion = existing.firmwareVersion,
      modelVersion = existing.modelVersion,
    } = req.body;

    const now = new Date().toISOString();

    const stmt = db.prepare(`
      UPDATE sensorNodes SET
        name = ?,
        zone = ?,
        status = ?,
        batteryPercentage = ?,
        solarCharging = ?,
        signalStrength = ?,
        firmwareVersion = ?,
        modelVersion = ?,
        updatedAt = ?
      WHERE nodeId = ?
    `);

    stmt.run(
      name,
      zone,
      status,
      Math.max(0, Math.min(100, Number(batteryPercentage))),
      solarCharging ? 1 : 0,
      Number(signalStrength),
      firmwareVersion,
      modelVersion,
      now,
      nodeId
    );

    const updated: any = db.prepare('SELECT * FROM sensorNodes WHERE nodeId = ?').get(nodeId);
    res.json({
      ...updated,
      solarCharging: Boolean(updated.solarCharging),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE sensor node
nodesRouter.delete('/:nodeId', (req, res) => {
  try {
    const { nodeId } = req.params;
    const existing = db.prepare('SELECT id FROM sensorNodes WHERE nodeId = ?').get(nodeId);
    if (!existing) {
      return res.status(404).json({ error: 'Node not found' });
    }

    db.prepare('DELETE FROM sensorNodes WHERE nodeId = ?').run(nodeId);
    res.json({ success: true, message: `Node ${nodeId} deleted successfully` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
