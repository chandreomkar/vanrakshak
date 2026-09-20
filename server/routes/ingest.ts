import { Router } from 'express';
import { db } from '../db.js';

export const ingestRouter = Router();

// In-memory rate limiting map for hardware ingestion (max 10 requests per minute per node)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(nodeId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(nodeId);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(nodeId, { count: 1, resetTime: now + 60000 });
    return true;
  }
  if (entry.count >= 15) {
    return false;
  }
  entry.count++;
  return true;
}

// POST /api/ingest/alert - Planned Hardware Ingestion Interface
ingestRouter.post('/alert', (req, res) => {
  try {
    // 1. Authenticate device request
    const apiKey = req.headers['x-api-key'] || req.headers['authorization'];
    const expectedKey = process.env.INGESTION_API_KEY || 'vr_dev_test_device_key_in865';

    if (!apiKey || apiKey !== expectedKey) {
      return res.status(401).json({
        error: 'Unauthorized: Invalid or missing hardware device API key',
        hint: 'Use header x-api-key: vr_dev_test_device_key_in865 in test development mode',
      });
    }

    const {
      nodeId,
      eventType,
      confidence,
      timestamp,
      batteryPercentage,
      sequenceNumber,
      zone,
    } = req.body;

    // 2. Strict payload validation
    if (!nodeId || typeof nodeId !== 'string') {
      return res.status(400).json({ error: 'Field nodeId is required and must be a string' });
    }

    if (!checkRateLimit(nodeId)) {
      return res.status(429).json({ error: `Rate limit exceeded for node ${nodeId}. Max 15 packets/min.` });
    }

    const validEventTypes = ['possible_chainsaw', 'background', 'soundscape_anomaly'];
    if (!eventType || !validEventTypes.includes(eventType)) {
      return res.status(400).json({
        error: `Field eventType must be one of: ${validEventTypes.join(', ')}`,
      });
    }

    const confNum = Number(confidence);
    if (isNaN(confNum) || confNum < 0.0 || confNum > 1.0) {
      return res.status(400).json({
        error: 'Field confidence must be a valid float between 0.0 and 1.0',
      });
    }

    const battNum = Number(batteryPercentage);
    if (isNaN(battNum) || battNum < 0 || battNum > 100) {
      return res.status(400).json({
        error: 'Field batteryPercentage must be an integer between 0 and 100',
      });
    }

    const seqNum = Number(sequenceNumber);
    if (isNaN(seqNum) || seqNum < 0) {
      return res.status(400).json({
        error: 'Field sequenceNumber must be a non-negative integer',
      });
    }

    if (!zone || typeof zone !== 'string') {
      return res.status(400).json({ error: 'Field zone is required and must be a string' });
    }

    const alertTime = timestamp ? new Date(timestamp).toISOString() : new Date().toISOString();
    const alertId = `alert-${Date.now()}`;
    const now = new Date().toISOString();

    // 3. Check if node exists or auto-register test node
    const existingNode = db.prepare('SELECT id FROM sensorNodes WHERE nodeId = ?').get(nodeId);
    if (!existingNode) {
      db.prepare(`
        INSERT INTO sensorNodes (
          id, nodeId, name, zone, status, batteryPercentage, solarCharging,
          signalStrength, firmwareVersion, modelVersion, lastSeenAt, lastEventType,
          createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        `node-${Date.now()}`,
        nodeId,
        `Planned Hardware Node ${nodeId}`,
        zone,
        eventType === 'possible_chainsaw' ? 'warning' : 'online',
        battNum,
        1,
        -78,
        '1.2.0-esp32s3',
        'vanrakshak-tinyml-v1.4',
        alertTime,
        eventType,
        now,
        now
      );
    } else {
      db.prepare(`
        UPDATE sensorNodes SET
          status = ?,
          batteryPercentage = ?,
          lastSeenAt = ?,
          lastEventType = ?,
          updatedAt = ?
        WHERE nodeId = ?
      `).run(
        eventType === 'possible_chainsaw' ? 'warning' : 'online',
        battNum,
        alertTime,
        eventType,
        now,
        nodeId
      );
    }

    // 4. Store raw event in events table
    const eventId = `evt-${Date.now()}`;
    db.prepare(`
      INSERT INTO events (id, nodeId, eventType, confidence, timestamp, sequenceNumber, rawFeatures, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      eventId,
      nodeId,
      eventType,
      confNum,
      alertTime,
      seqNum,
      JSON.stringify({ source: 'hardware_ingest_interface', packetType: 'compact_event_packet' }),
      now
    );

    // 5. If event is suspicious (possible_chainsaw or high confidence anomaly), create alert record
    let alertRecord = null;
    if (eventType === 'possible_chainsaw' || confNum >= 0.80) {
      db.prepare(`
        INSERT INTO alerts (
          id, nodeId, eventType, confidence, timestamp, zone,
          batteryPercentage, sequenceNumber, status, verificationNote,
          evidenceImageUrl, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        alertId,
        nodeId,
        eventType,
        confNum,
        alertTime,
        zone,
        battNum,
        seqNum,
        'pending',
        null,
        null,
        now,
        now
      );
      alertRecord = db.prepare('SELECT * FROM alerts WHERE id = ?').get(alertId);
    }

    res.status(201).json({
      status: 'accepted',
      integrationStage: 'Planned Hardware Integration Interface',
      message: 'Packet validated and processed through VanRakshak pipeline.',
      packetSummary: {
        nodeId,
        eventType,
        confidence: confNum,
        batteryPercentage: battNum,
        sequenceNumber: seqNum,
        zone,
        alertCreated: Boolean(alertRecord),
      },
      wpcCompliance: {
        frequencyBand: 'IN865 (865.0 - 867.0 MHz)',
        licenseStatus: 'License-exempt under DoT / WPC GSR 564(E)',
        dutyCycleLimit: '< 1% compliant transmission burst',
        packetType: 'Compact event packet (raw audio stays on node)',
      },
      alert: alertRecord,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
