import { Router } from 'express';
import { db } from '../db.js';

export const simulationRouter = Router();

// POST /api/simulation/chainsaw-alert
simulationRouter.post('/chainsaw-alert', (req, res) => {
  try {
    const { targetNodeId, customConfidence } = req.body;

    // Pick target node or default to VR-03 or VR-02
    let node: any;
    if (targetNodeId) {
      node = db.prepare('SELECT * FROM sensorNodes WHERE nodeId = ?').get(targetNodeId);
    }
    if (!node) {
      node = db.prepare("SELECT * FROM sensorNodes WHERE status != 'offline' ORDER BY RANDOM() LIMIT 1").get();
    }
    if (!node) {
      node = db.prepare('SELECT * FROM sensorNodes ORDER BY RANDOM() LIMIT 1').get();
    }

    if (!node) {
      return res.status(400).json({ error: 'No sensor nodes available for simulation' });
    }

    const now = new Date().toISOString();
    const alertId = `alert-${Date.now()}`;
    const confidence = customConfidence !== undefined 
      ? Math.max(0.70, Math.min(0.99, Number(customConfidence))) 
      : Number((0.85 + Math.random() * 0.12).toFixed(2)); // Between 85% and 97%

    // Decrement battery by 1% due to LoRa transmission burst
    const newBattery = Math.max(1, node.batteryPercentage - 1);
    const seqNum = Math.floor(Math.random() * 900) + 100;

    // 1. Update node status
    db.prepare(`
      UPDATE sensorNodes SET
        status = 'warning',
        batteryPercentage = ?,
        lastSeenAt = ?,
        lastEventType = 'possible_chainsaw',
        updatedAt = ?
      WHERE nodeId = ?
    `).run(newBattery, now, now, node.nodeId);

    // 2. Insert into events table (raw edge event log)
    const eventId = `evt-${Date.now()}`;
    db.prepare(`
      INSERT INTO events (id, nodeId, eventType, confidence, timestamp, sequenceNumber, rawFeatures, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      eventId,
      node.nodeId,
      'possible_chainsaw',
      confidence,
      now,
      seqNum,
      JSON.stringify({
        subWindows: [
          (confidence - 0.02).toFixed(2),
          confidence.toFixed(2),
          (confidence + 0.01).toFixed(2),
        ],
        dominantFrequencyHz: 2150,
        energyDbfs: -18.4,
        inferenceLatencyMs: 42,
        tfliteModel: 'vanrakshak-tinyml-v1.4',
      }),
      now
    );

    // 3. Insert into alerts table
    db.prepare(`
      INSERT INTO alerts (
        id, nodeId, eventType, confidence, timestamp, zone,
        batteryPercentage, sequenceNumber, status, verificationNote,
        evidenceImageUrl, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      alertId,
      node.nodeId,
      'possible_chainsaw',
      confidence,
      now,
      node.zone,
      newBattery,
      seqNum,
      'pending',
      null,
      null,
      now,
      now
    );

    const createdAlert = db.prepare('SELECT * FROM alerts WHERE id = ?').get(alertId);
    const updatedNode = db.prepare('SELECT * FROM sensorNodes WHERE nodeId = ?').get(node.nodeId);

    res.status(201).json({
      success: true,
      simulated: true,
      disclaimer: 'This creates synthetic prototype data and does not represent a real forest event.',
      alert: createdAlert,
      node: updatedNode,
      inferenceSimulation: {
        windowDurationSec: 1.5,
        votingWindows: 3,
        classificationResults: ['chainsaw (91%)', 'chainsaw (94%)', 'chainsaw (92%)'],
        consensusConfidence: confidence,
        packetTransmitted: 'Compact event packet (approx 24-byte LoRa payload)',
        frequency: '865.0625 MHz (India WPC IN865 Band)',
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/simulation/background-event
simulationRouter.post('/background-event', (req, res) => {
  try {
    const { targetNodeId } = req.body;
    let node: any;
    if (targetNodeId) {
      node = db.prepare('SELECT * FROM sensorNodes WHERE nodeId = ?').get(targetNodeId);
    } else {
      node = db.prepare("SELECT * FROM sensorNodes WHERE status != 'offline' ORDER BY RANDOM() LIMIT 1").get();
    }

    if (!node) {
      return res.status(400).json({ error: 'No node found' });
    }

    const now = new Date().toISOString();
    // Solar charging adds a bit during daytime simulation
    const newBattery = Math.min(100, node.batteryPercentage + (node.solarCharging ? 1 : 0));

    db.prepare(`
      UPDATE sensorNodes SET
        status = 'online',
        batteryPercentage = ?,
        lastSeenAt = ?,
        lastEventType = 'background',
        updatedAt = ?
      WHERE nodeId = ?
    `).run(newBattery, now, now, node.nodeId);

    res.json({
      success: true,
      nodeId: node.nodeId,
      lastSeenAt: now,
      status: 'online',
      batteryPercentage: newBattery,
      eventType: 'background',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
