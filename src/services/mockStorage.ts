import { SensorNode, Alert, VerificationAction, SystemMetrics, User, UserRole } from '../types';

const STORAGE_KEYS = {
  NODES: 'vr_nodes_v1',
  ALERTS: 'vr_alerts_v1',
  ACTIONS: 'vr_actions_v1',
  USER: 'vr_user_v1',
};

const initialUsers: Record<UserRole, User> = {
  ranger: {
    id: 'user-ranger',
    username: 'ranger',
    name: 'Ranger Vikram Singh',
    role: 'ranger',
    email: 'vikram.singh@forest.gov.in',
  },
  admin: {
    id: 'user-admin',
    username: 'admin',
    name: 'Officer Anita Roy',
    role: 'admin',
    email: 'anita.roy@forest.gov.in',
  },
  guest: {
    id: 'user-guest',
    username: 'guest',
    name: 'Hackathon Evaluator (Guest)',
    role: 'guest',
    email: 'guest@climatehack.demo',
  },
};

const defaultNodes: SensorNode[] = [
  {
    id: 'node-1',
    nodeId: 'VR-01',
    name: 'Simulated Canopy Node Alpha',
    zone: 'Zone A',
    status: 'online',
    batteryPercentage: 91,
    solarCharging: true,
    signalStrength: -72,
    firmwareVersion: '1.2.0-esp32s3',
    modelVersion: 'vanrakshak-tinyml-v1.4',
    lastSeenAt: new Date(Date.now() - 2 * 60000).toISOString(),
    lastEventType: 'background',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'node-2',
    nodeId: 'VR-02',
    name: 'Simulated Ridge Node Bravo',
    zone: 'Zone A',
    status: 'online',
    batteryPercentage: 83,
    solarCharging: true,
    signalStrength: -80,
    firmwareVersion: '1.2.0-esp32s3',
    modelVersion: 'vanrakshak-tinyml-v1.4',
    lastSeenAt: new Date(Date.now() - 5 * 60000).toISOString(),
    lastEventType: 'background',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'node-3',
    nodeId: 'VR-03',
    name: 'Simulated Valley Node Charlie',
    zone: 'Zone B',
    status: 'warning',
    batteryPercentage: 78,
    solarCharging: false,
    signalStrength: -91,
    firmwareVersion: '1.2.0-esp32s3',
    modelVersion: 'vanrakshak-tinyml-v1.4',
    lastSeenAt: new Date(Date.now() - 1 * 60000).toISOString(),
    lastEventType: 'possible_chainsaw',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'node-4',
    nodeId: 'VR-04',
    name: 'Simulated Riverbed Node Delta',
    zone: 'Zone B',
    status: 'offline',
    batteryPercentage: 22,
    solarCharging: false,
    signalStrength: -108,
    firmwareVersion: '1.1.8-esp32s3',
    modelVersion: 'vanrakshak-tinyml-v1.3',
    lastSeenAt: new Date(Date.now() - 180 * 60000).toISOString(),
    lastEventType: 'low_battery_warning',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'node-5',
    nodeId: 'VR-05',
    name: 'Simulated Buffer Node Echo',
    zone: 'Zone C',
    status: 'online',
    batteryPercentage: 65,
    solarCharging: true,
    signalStrength: -84,
    firmwareVersion: '1.2.0-esp32s3',
    modelVersion: 'vanrakshak-tinyml-v1.4',
    lastSeenAt: new Date(Date.now() - 7 * 60000).toISOString(),
    lastEventType: 'background',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'node-6',
    nodeId: 'VR-06',
    name: 'Simulated Dense Forest Node Foxtrot',
    zone: 'Zone C',
    status: 'online',
    batteryPercentage: 88,
    solarCharging: true,
    signalStrength: -75,
    firmwareVersion: '1.2.0-esp32s3',
    modelVersion: 'vanrakshak-tinyml-v1.4',
    lastSeenAt: new Date(Date.now() - 4 * 60000).toISOString(),
    lastEventType: 'background',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const defaultAlerts: Alert[] = [
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
    verificationNote: undefined,
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
    createdAt: new Date(Date.now() - 360 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 330 * 60000).toISOString(),
  },
];

const defaultActions: VerificationAction[] = [
  {
    id: 'act-1',
    alertId: 'alert-100',
    userId: 'user-ranger',
    userName: 'Ranger Vikram Singh',
    action: 'verified',
    note: 'Patrol team dispatched to Sector A-4. Confirmed unauthorized chainsaw sound.',
    createdAt: new Date(Date.now() - 110 * 60000).toISOString(),
  },
  {
    id: 'act-2',
    alertId: 'alert-099',
    userId: 'user-ranger',
    userName: 'Ranger Vikram Singh',
    action: 'false_positive',
    note: 'Audited spectrogram; high-frequency wind and cicada cluster pattern.',
    createdAt: new Date(Date.now() - 330 * 60000).toISOString(),
  },
];

function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn('Failed to save to localStorage', e);
  }
}

export const mockStorage = {
  // Auth
  getCurrentUser(): User {
    return getStored<User>(STORAGE_KEYS.USER, initialUsers.ranger);
  },

  switchUser(role: UserRole): User {
    const user = initialUsers[role] || initialUsers.ranger;
    setStored(STORAGE_KEYS.USER, user);
    return user;
  },

  // Nodes
  getNodes(): SensorNode[] {
    return getStored<SensorNode[]>(STORAGE_KEYS.NODES, defaultNodes);
  },

  getNode(nodeId: string): SensorNode | undefined {
    const nodes = this.getNodes();
    return nodes.find((n) => n.nodeId === nodeId);
  },

  createNode(data: Partial<SensorNode>): SensorNode {
    const nodes = this.getNodes();
    const now = new Date().toISOString();
    const newNode: SensorNode = {
      id: `node-${Date.now()}`,
      nodeId: data.nodeId || `VR-${Math.floor(Math.random() * 90) + 10}`,
      name: data.name || 'Simulated Canopy Node',
      zone: data.zone || 'Zone A',
      status: data.status || 'online',
      batteryPercentage: data.batteryPercentage !== undefined ? data.batteryPercentage : 90,
      solarCharging: data.solarCharging !== undefined ? data.solarCharging : true,
      signalStrength: data.signalStrength || -78,
      firmwareVersion: data.firmwareVersion || '1.2.0-esp32s3',
      modelVersion: data.modelVersion || 'vanrakshak-tinyml-v1.4',
      lastSeenAt: now,
      createdAt: now,
      updatedAt: now,
    };
    nodes.push(newNode);
    setStored(STORAGE_KEYS.NODES, nodes);
    return newNode;
  },

  updateNode(nodeId: string, data: Partial<SensorNode>): SensorNode {
    const nodes = this.getNodes();
    const idx = nodes.findIndex((n) => n.nodeId === nodeId);
    if (idx === -1) throw new Error(`Node ${nodeId} not found`);
    nodes[idx] = {
      ...nodes[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    setStored(STORAGE_KEYS.NODES, nodes);
    return nodes[idx];
  },

  deleteNode(nodeId: string): { success: boolean } {
    let nodes = this.getNodes();
    nodes = nodes.filter((n) => n.nodeId !== nodeId);
    setStored(STORAGE_KEYS.NODES, nodes);
    return { success: true };
  },

  // Alerts
  getAlerts(params?: { eventType?: string; zone?: string; status?: string }): Alert[] {
    let alerts = getStored<Alert[]>(STORAGE_KEYS.ALERTS, defaultAlerts);
    if (params?.eventType && params.eventType !== 'all') {
      alerts = alerts.filter((a) => a.eventType === params.eventType);
    }
    if (params?.zone && params.zone !== 'all') {
      alerts = alerts.filter((a) => a.zone === params.zone);
    }
    if (params?.status && params.status !== 'all') {
      alerts = alerts.filter((a) => a.status === params.status);
    }
    return alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  getAlert(id: string): (Alert & { actions: VerificationAction[] }) | undefined {
    const alerts = this.getAlerts();
    const alert = alerts.find((a) => a.id === id);
    if (!alert) return undefined;
    const actions = this.getActions().filter((act) => act.alertId === id);
    return { ...alert, actions };
  },

  updateAlertStatus(
    id: string,
    status: string,
    note: string,
    userId = 'user-ranger',
    userName = 'Ranger Vikram Singh'
  ): Alert & { actions: VerificationAction[] } {
    const alerts = this.getAlerts();
    const idx = alerts.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error(`Alert ${id} not found`);

    const now = new Date().toISOString();
    alerts[idx] = {
      ...alerts[idx],
      status: status as any,
      verificationNote: note,
      updatedAt: now,
    };
    setStored(STORAGE_KEYS.ALERTS, alerts);

    // Add action to audit log
    const actions = this.getActions();
    const newAction: VerificationAction = {
      id: `act-${Date.now()}`,
      alertId: id,
      userId,
      userName,
      action: status as any,
      note,
      createdAt: now,
    };
    actions.unshift(newAction);
    setStored(STORAGE_KEYS.ACTIONS, actions);

    return { ...alerts[idx], actions: actions.filter((a) => a.alertId === id) };
  },

  getActions(): VerificationAction[] {
    return getStored<VerificationAction[]>(STORAGE_KEYS.ACTIONS, defaultActions);
  },

  // Simulation
  simulateChainsawAlert(targetNodeId?: string, customConfidence?: number) {
    const nodes = this.getNodes();
    let node = nodes.find((n) => n.nodeId === targetNodeId);
    if (!node) {
      node = nodes.find((n) => n.status !== 'offline') || nodes[0];
    }
    if (!node) throw new Error('No nodes available to simulate');

    const now = new Date().toISOString();
    const confidence = customConfidence !== undefined 
      ? Number(customConfidence) 
      : Number((0.85 + Math.random() * 0.12).toFixed(2));
    const newBattery = Math.max(1, node.batteryPercentage - 1);
    const seqNum = Math.floor(Math.random() * 900) + 100;
    const alertId = `alert-${Date.now()}`;

    // Update node
    this.updateNode(node.nodeId, {
      status: 'warning',
      batteryPercentage: newBattery,
      lastSeenAt: now,
      lastEventType: 'possible_chainsaw',
    });

    // Create alert
    const newAlert: Alert = {
      id: alertId,
      nodeId: node.nodeId,
      eventType: 'possible_chainsaw',
      confidence,
      timestamp: now,
      zone: node.zone,
      batteryPercentage: newBattery,
      sequenceNumber: seqNum,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    const alerts = this.getAlerts();
    alerts.unshift(newAlert);
    setStored(STORAGE_KEYS.ALERTS, alerts);

    return {
      success: true,
      simulated: true,
      disclaimer: 'This creates synthetic prototype data and does not represent a real forest event.',
      alert: newAlert,
      node: this.getNode(node.nodeId),
      inferenceSimulation: {
        windowDurationSec: 1.5,
        votingWindows: 3,
        classificationResults: ['chainsaw (91%)', 'chainsaw (94%)', 'chainsaw (92%)'],
        consensusConfidence: confidence,
        packetTransmitted: 'Compact event packet',
        frequency: '865.0625 MHz (India WPC IN865 Band)',
      },
    };
  },

  simulateBackgroundEvent(targetNodeId?: string) {
    const nodes = this.getNodes();
    let node = nodes.find((n) => n.nodeId === targetNodeId);
    if (!node) {
      node = nodes.find((n) => n.status !== 'offline') || nodes[0];
    }
    if (!node) throw new Error('No nodes available to simulate');

    const now = new Date().toISOString();
    const newBattery = Math.min(100, node.batteryPercentage + (node.solarCharging ? 1 : 0));

    this.updateNode(node.nodeId, {
      status: 'online',
      batteryPercentage: newBattery,
      lastSeenAt: now,
      lastEventType: 'background',
    });

    return {
      success: true,
      nodeId: node.nodeId,
      lastSeenAt: now,
      status: 'online',
      batteryPercentage: newBattery,
      eventType: 'background',
    };
  },

  getMetrics() {
    const nodes = this.getNodes();
    const alerts = this.getAlerts();
    const activeNodes = nodes.filter((n) => n.status === 'online').length;
    const warningNodes = nodes.filter((n) => n.status === 'warning').length;
    const offlineNodes = nodes.filter((n) => n.status === 'offline').length;
    const pendingVerification = alerts.filter((a) => a.status === 'pending').length;
    const verifiedAlerts = alerts.filter((a) => a.status === 'verified').length;
    const falsePositives = alerts.filter((a) => a.status === 'false_positive').length;
    const patrolRequested = alerts.filter((a) => a.status === 'patrol_requested').length;
    const avgBattery = nodes.length > 0
      ? Math.round(nodes.reduce((acc, n) => acc + n.batteryPercentage, 0) / nodes.length)
      : 80;

    return {
      id: 'metric-client',
      metricDate: new Date().toISOString().split('T')[0],
      activeNodes,
      totalNodes: nodes.length,
      warningNodes,
      offlineNodes,
      averageBattery: avgBattery,
      totalAlerts: alerts.length,
      pendingVerification,
      verifiedAlerts,
      falsePositives,
      patrolRequested,
      packetDeliveryRate: 98.6,
      averageAlertLatency: 2.1,
      gatewayStatus: 'online',
      dailyTrend: [
        { day: 'Day -6', total: Math.max(1, alerts.length - 8), verified: 1, falsePositive: 0 },
        { day: 'Day -5', total: Math.max(2, alerts.length - 6), verified: 2, falsePositive: 1 },
        { day: 'Day -4', total: Math.max(3, alerts.length - 5), verified: 1, falsePositive: 0 },
        { day: 'Day -3', total: Math.max(4, alerts.length - 3), verified: 3, falsePositive: 1 },
        { day: 'Day -2', total: Math.max(2, alerts.length - 2), verified: 2, falsePositive: 1 },
        { day: 'Yesterday', total: Math.max(3, alerts.length - 1), verified: 2, falsePositive: 0 },
        { day: 'Today', total: alerts.length, verified: verifiedAlerts, falsePositive: falsePositives },
      ],
    };
  },
};
