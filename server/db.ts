import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.resolve(dataDir, 'vanrakshak.db');
export const db = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

export function initDatabase() {
  // 1. sensorNodes table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sensorNodes (
      id TEXT PRIMARY KEY,
      nodeId TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      zone TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('online', 'offline', 'warning')),
      batteryPercentage INTEGER NOT NULL CHECK(batteryPercentage >= 0 AND batteryPercentage <= 100),
      solarCharging INTEGER NOT NULL CHECK(solarCharging IN (0, 1)),
      signalStrength INTEGER NOT NULL,
      firmwareVersion TEXT NOT NULL,
      modelVersion TEXT NOT NULL,
      lastSeenAt TEXT NOT NULL,
      lastEventType TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);

  // 2. alerts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS alerts (
      id TEXT PRIMARY KEY,
      nodeId TEXT NOT NULL,
      eventType TEXT NOT NULL,
      confidence REAL NOT NULL CHECK(confidence >= 0.0 AND confidence <= 1.0),
      timestamp TEXT NOT NULL,
      zone TEXT NOT NULL,
      batteryPercentage INTEGER NOT NULL CHECK(batteryPercentage >= 0 AND batteryPercentage <= 100),
      sequenceNumber INTEGER NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('pending', 'verified', 'false_positive', 'patrol_requested', 'assigned')),
      verificationNote TEXT,
      evidenceImageUrl TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);

  // 3. verificationActions table (audit log)
  db.exec(`
    CREATE TABLE IF NOT EXISTS verificationActions (
      id TEXT PRIMARY KEY,
      alertId TEXT NOT NULL,
      userId TEXT NOT NULL,
      userName TEXT,
      action TEXT NOT NULL,
      note TEXT,
      createdAt TEXT NOT NULL
    );
  `);

  // 4. events table (raw acoustic event logs)
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      nodeId TEXT NOT NULL,
      eventType TEXT NOT NULL,
      confidence REAL NOT NULL,
      timestamp TEXT NOT NULL,
      sequenceNumber INTEGER NOT NULL,
      rawFeatures TEXT,
      createdAt TEXT NOT NULL
    );
  `);

  // 5. systemMetrics table
  db.exec(`
    CREATE TABLE IF NOT EXISTS systemMetrics (
      id TEXT PRIMARY KEY,
      metricDate TEXT NOT NULL,
      activeNodes INTEGER NOT NULL,
      totalAlerts INTEGER NOT NULL,
      verifiedAlerts INTEGER NOT NULL,
      falsePositives INTEGER NOT NULL,
      pendingVerification INTEGER NOT NULL,
      packetDeliveryRate REAL NOT NULL,
      averageAlertLatency REAL NOT NULL,
      averageBattery REAL NOT NULL
    );
  `);

  // 6. projectSettings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projectSettings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);

  // 7. users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('ranger', 'admin', 'guest')),
      email TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);

  // Seed default data if sensorNodes is empty
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM sensorNodes');
  const result = countStmt.get() as { count: number };

  if (result.count === 0) {
    seedDatabase();
  }
}

function seedDatabase() {
  const now = new Date().toISOString();

  // Seed Sensor Nodes (Fictional demonstration nodes VR-01 to VR-06)
  const insertNode = db.prepare(`
    INSERT INTO sensorNodes (
      id, nodeId, name, zone, status, batteryPercentage, solarCharging,
      signalStrength, firmwareVersion, modelVersion, lastSeenAt, lastEventType,
      createdAt, updatedAt
    ) VALUES (
      @id, @nodeId, @name, @zone, @status, @batteryPercentage, @solarCharging,
      @signalStrength, @firmwareVersion, @modelVersion, @lastSeenAt, @lastEventType,
      @createdAt, @updatedAt
    )
  `);

  const nodes = [
    {
      id: 'node-1',
      nodeId: 'VR-01',
      name: 'Simulated Canopy Node Alpha',
      zone: 'Zone A',
      status: 'online',
      batteryPercentage: 91,
      solarCharging: 1,
      signalStrength: -72,
      firmwareVersion: '1.2.0-esp32s3',
      modelVersion: 'vanrakshak-tinyml-v1.4',
      lastSeenAt: new Date(Date.now() - 2 * 60000).toISOString(),
      lastEventType: 'background',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'node-2',
      nodeId: 'VR-02',
      name: 'Simulated Ridge Node Bravo',
      zone: 'Zone A',
      status: 'online',
      batteryPercentage: 83,
      solarCharging: 1,
      signalStrength: -80,
      firmwareVersion: '1.2.0-esp32s3',
      modelVersion: 'vanrakshak-tinyml-v1.4',
      lastSeenAt: new Date(Date.now() - 5 * 60000).toISOString(),
      lastEventType: 'background',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'node-3',
      nodeId: 'VR-03',
      name: 'Simulated Valley Node Charlie',
      zone: 'Zone B',
      status: 'warning',
      batteryPercentage: 78,
      solarCharging: 0,
      signalStrength: -91,
      firmwareVersion: '1.2.0-esp32s3',
      modelVersion: 'vanrakshak-tinyml-v1.4',
      lastSeenAt: new Date(Date.now() - 1 * 60000).toISOString(),
      lastEventType: 'possible_chainsaw',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'node-4',
      nodeId: 'VR-04',
      name: 'Simulated Riverbed Node Delta',
      zone: 'Zone B',
      status: 'offline',
      batteryPercentage: 22,
      solarCharging: 0,
      signalStrength: -108,
      firmwareVersion: '1.1.8-esp32s3',
      modelVersion: 'vanrakshak-tinyml-v1.3',
      lastSeenAt: new Date(Date.now() - 180 * 60000).toISOString(),
      lastEventType: 'low_battery_warning',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'node-5',
      nodeId: 'VR-05',
      name: 'Simulated Buffer Node Echo',
      zone: 'Zone C',
      status: 'online',
      batteryPercentage: 65,
      solarCharging: 1,
      signalStrength: -84,
      firmwareVersion: '1.2.0-esp32s3',
      modelVersion: 'vanrakshak-tinyml-v1.4',
      lastSeenAt: new Date(Date.now() - 7 * 60000).toISOString(),
      lastEventType: 'background',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'node-6',
      nodeId: 'VR-06',
      name: 'Simulated Dense Forest Node Foxtrot',
      zone: 'Zone C',
      status: 'online',
      batteryPercentage: 88,
      solarCharging: 1,
      signalStrength: -75,
      firmwareVersion: '1.2.0-esp32s3',
      modelVersion: 'vanrakshak-tinyml-v1.4',
      lastSeenAt: new Date(Date.now() - 4 * 60000).toISOString(),
      lastEventType: 'background',
      createdAt: now,
      updatedAt: now,
    },
  ];

  const seedNodesTx = db.transaction((items) => {
    for (const item of items) insertNode.run(item);
  });
  seedNodesTx(nodes);

  // Seed Alerts
  const insertAlert = db.prepare(`
    INSERT INTO alerts (
      id, nodeId, eventType, confidence, timestamp, zone,
      batteryPercentage, sequenceNumber, status, verificationNote,
      evidenceImageUrl, createdAt, updatedAt
    ) VALUES (
      @id, @nodeId, @eventType, @confidence, @timestamp, @zone,
      @batteryPercentage, @sequenceNumber, @status, @verificationNote,
      @evidenceImageUrl, @createdAt, @updatedAt
    )
  `);

  const initialAlerts = [
    {
      id: 'alert-101',
      nodeId: 'VR-03',
      eventType: 'possible_chainsaw',
      confidence: 0.92,
      timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
      zone: 'Zone B',
      batteryPercentage: 78,
      sequenceNumber: 104,
      status: 'pending',
      verificationNote: null,
      evidenceImageUrl: null,
      createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 60000).toISOString(),
    },
    {
      id: 'alert-100',
      nodeId: 'VR-01',
      eventType: 'possible_chainsaw',
      confidence: 0.88,
      timestamp: new Date(Date.now() - 140 * 60000).toISOString(),
      zone: 'Zone A',
      batteryPercentage: 93,
      sequenceNumber: 99,
      status: 'verified',
      verificationNote: 'Forest patrol confirmed illegal fallen timber extraction in sector A-4.',
      evidenceImageUrl: null,
      createdAt: new Date(Date.now() - 140 * 60000).toISOString(),
      updatedAt: new Date(Date.now() - 110 * 60000).toISOString(),
    },
    {
      id: 'alert-099',
      nodeId: 'VR-05',
      eventType: 'soundscape_anomaly',
      confidence: 0.74,
      timestamp: new Date(Date.now() - 360 * 60000).toISOString(),
      zone: 'Zone C',
      batteryPercentage: 68,
      sequenceNumber: 87,
      status: 'false_positive',
      verificationNote: 'Unusual cicada chorus and wind burst misclassified as acoustic anomaly.',
      evidenceImageUrl: null,
      createdAt: new Date(Date.now() - 360 * 60000).toISOString(),
      updatedAt: new Date(Date.now() - 330 * 60000).toISOString(),
    },
  ];

  const seedAlertsTx = db.transaction((items) => {
    for (const item of items) insertAlert.run(item);
  });
  seedAlertsTx(initialAlerts);

  // Seed Verification Action Audit Trail
  const insertAction = db.prepare(`
    INSERT INTO verificationActions (id, alertId, userId, userName, action, note, createdAt)
    VALUES (@id, @alertId, @userId, @userName, @action, @note, @createdAt)
  `);

  insertAction.run({
    id: 'act-1',
    alertId: 'alert-100',
    userId: 'user-ranger',
    userName: 'Ranger Vikram Singh',
    action: 'verified',
    note: 'Patrol team dispatched to Sector A-4. Confirmed unauthorized chainsaw sound.',
    createdAt: new Date(Date.now() - 110 * 60000).toISOString(),
  });

  insertAction.run({
    id: 'act-2',
    alertId: 'alert-099',
    userId: 'user-ranger',
    userName: 'Ranger Vikram Singh',
    action: 'false_positive',
    note: 'Audited spectrogram; high-frequency wind and cicada cluster pattern.',
    createdAt: new Date(Date.now() - 330 * 60000).toISOString(),
  });

  // Seed System Metrics
  const insertMetric = db.prepare(`
    INSERT INTO systemMetrics (
      id, metricDate, activeNodes, totalAlerts, verifiedAlerts,
      falsePositives, pendingVerification, packetDeliveryRate,
      averageAlertLatency, averageBattery
    ) VALUES (
      @id, @metricDate, @activeNodes, @totalAlerts, @verifiedAlerts,
      @falsePositives, @pendingVerification, @packetDeliveryRate,
      @averageAlertLatency, @averageBattery
    )
  `);

  insertMetric.run({
    id: 'metric-today',
    metricDate: new Date().toISOString().split('T')[0],
    activeNodes: 5,
    totalAlerts: 3,
    verifiedAlerts: 1,
    falsePositives: 1,
    pendingVerification: 1,
    packetDeliveryRate: 98.6,
    averageAlertLatency: 2.1,
    averageBattery: 80.8,
  });

  // Seed Settings
  const insertSetting = db.prepare(`
    INSERT INTO projectSettings (key, value, updatedAt)
    VALUES (@key, @value, @updatedAt)
  `);

  const settings = [
    { key: 'demo_mode', value: 'true', updatedAt: now },
    { key: 'gateway_status', value: 'online', updatedAt: now },
    { key: 'chainsaw_threshold', value: '0.85', updatedAt: now },
    { key: 'model_version', value: 'vanrakshak-tinyml-v1.4', updatedAt: now },
    { key: 'lora_frequency_mhz', value: '865.0625', updatedAt: now },
    { key: 'lora_region', value: 'IN865', updatedAt: now },
  ];

  for (const s of settings) insertSetting.run(s);

  // Seed Users for demo login
  const insertUser = db.prepare(`
    INSERT INTO users (id, username, name, role, email, createdAt)
    VALUES (@id, @username, @name, @role, @email, @createdAt)
  `);

  const users = [
    {
      id: 'user-ranger',
      username: 'ranger',
      name: 'Ranger Vikram Singh',
      role: 'ranger',
      email: 'vikram.singh@forest.gov.in',
      createdAt: now,
    },
    {
      id: 'user-admin',
      username: 'admin',
      name: 'Forest Division Officer Anita Roy',
      role: 'admin',
      email: 'anita.roy@forest.gov.in',
      createdAt: now,
    },
    {
      id: 'user-guest',
      username: 'guest',
      name: 'Hackathon Evaluator (Guest)',
      role: 'guest',
      email: 'guest@climatehack.demo',
      createdAt: now,
    },
  ];

  for (const u of users) insertUser.run(u);
}

// Automatically initialize schema and seed on load
initDatabase();
