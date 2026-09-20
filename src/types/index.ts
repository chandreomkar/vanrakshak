export type NodeStatus = 'online' | 'offline' | 'warning';

export interface SensorNode {
  id: string;
  nodeId: string;
  name: string;
  zone: string;
  status: NodeStatus;
  batteryPercentage: number;
  solarCharging: boolean;
  signalStrength: number; // e.g., -85 dBm (RSSI)
  firmwareVersion: string;
  modelVersion: string;
  lastSeenAt: string;
  lastEventType?: string;
  createdAt: string;
  updatedAt: string;
}

export type AlertEventType = 'possible_chainsaw' | 'background' | 'soundscape_anomaly';
export type AlertStatus = 'pending' | 'verified' | 'false_positive' | 'patrol_requested' | 'assigned';

export interface Alert {
  id: string;
  nodeId: string;
  eventType: AlertEventType;
  confidence: number; // Stored 0.0 to 1.0, displayed as percentage
  timestamp: string;
  zone: string;
  batteryPercentage: number;
  sequenceNumber: number;
  status: AlertStatus;
  verificationNote?: string;
  evidenceImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationAction {
  id: string;
  alertId: string;
  userId: string;
  userName?: string;
  action: 'verified' | 'false_positive' | 'assign_review' | 'request_patrol';
  note: string;
  createdAt: string;
}

export interface SystemMetrics {
  id: string;
  metricDate: string;
  activeNodes: number;
  totalAlerts: number;
  verifiedAlerts: number;
  falsePositives: number;
  pendingVerification: number;
  packetDeliveryRate: number; // e.g. 98.4%
  averageAlertLatency: number; // e.g. 2.4s
  averageBattery: number; // e.g. 78%
}

export interface ProjectSettings {
  key: string;
  value: string;
  updatedAt: string;
}

export type UserRole = 'ranger' | 'admin' | 'guest';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  email: string;
}

export interface IngestAlertPayload {
  nodeId: string;
  eventType: 'possible_chainsaw' | 'background' | 'soundscape_anomaly';
  confidence: number;
  timestamp: string;
  batteryPercentage: number;
  sequenceNumber: number;
  zone: string;
}
