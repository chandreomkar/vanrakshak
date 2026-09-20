import { SensorNode, Alert, VerificationAction, SystemMetrics, IngestAlertPayload, User } from '../types';
import { mockStorage } from './mockStorage';

const BASE_URL = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('vr_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const api = {
  // Authentication
  async login(role: string): Promise<{ token: string; user: User }> {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('vr_token', data.token);
        return data;
      }
    } catch (e) {
      // Backend unavailable (e.g. Vercel static deployment)
    }

    // Client-side fallback
    const user = mockStorage.switchUser(role as any);
    const token = `demo_token_${user.id}_${Date.now()}`;
    localStorage.setItem('vr_token', token);
    return { token, user };
  },

  async getMe(): Promise<{ user: User; authenticated: boolean; isGuest: boolean }> {
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        return res.json();
      }
    } catch (e) {
      // Backend unavailable
    }

    const user = mockStorage.getCurrentUser();
    return { user, authenticated: user.role !== 'guest', isGuest: user.role === 'guest' };
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch (e) {
      // Ignore
    }
    localStorage.removeItem('vr_token');
    mockStorage.switchUser('guest');
  },

  // Sensor Nodes
  async getNodes(): Promise<SensorNode[]> {
    try {
      const res = await fetch(`${BASE_URL}/nodes`);
      if (res.ok) return res.json();
    } catch (e) {
      // Fallback
    }
    return mockStorage.getNodes();
  },

  async getNode(nodeId: string): Promise<SensorNode> {
    try {
      const res = await fetch(`${BASE_URL}/nodes/${nodeId}`);
      if (res.ok) return res.json();
    } catch (e) {
      // Fallback
    }
    const node = mockStorage.getNode(nodeId);
    if (!node) throw new Error(`Node ${nodeId} not found`);
    return node;
  },

  async createNode(data: Partial<SensorNode>): Promise<SensorNode> {
    try {
      const res = await fetch(`${BASE_URL}/nodes`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) return res.json();
    } catch (e) {
      // Fallback
    }
    return mockStorage.createNode(data);
  },

  async updateNode(nodeId: string, data: Partial<SensorNode>): Promise<SensorNode> {
    try {
      const res = await fetch(`${BASE_URL}/nodes/${nodeId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) return res.json();
    } catch (e) {
      // Fallback
    }
    return mockStorage.updateNode(nodeId, data);
  },

  async deleteNode(nodeId: string): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`${BASE_URL}/nodes/${nodeId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) return res.json();
    } catch (e) {
      // Fallback
    }
    return mockStorage.deleteNode(nodeId);
  },

  // Alerts
  async getAlerts(params?: { eventType?: string; zone?: string; status?: string }): Promise<Alert[]> {
    try {
      const query = new URLSearchParams();
      if (params?.eventType) query.append('eventType', params.eventType);
      if (params?.zone) query.append('zone', params.zone);
      if (params?.status) query.append('status', params.status);

      const res = await fetch(`${BASE_URL}/alerts?${query.toString()}`);
      if (res.ok) return res.json();
    } catch (e) {
      // Fallback
    }
    return mockStorage.getAlerts(params);
  },

  async getAlert(id: string): Promise<Alert & { actions: VerificationAction[] }> {
    try {
      const res = await fetch(`${BASE_URL}/alerts/${id}`);
      if (res.ok) return res.json();
    } catch (e) {
      // Fallback
    }
    const alert = mockStorage.getAlert(id);
    if (!alert) throw new Error(`Alert ${id} not found`);
    return alert;
  },

  async updateAlertStatus(
    id: string,
    status: string,
    note: string,
    userId?: string,
    userName?: string
  ): Promise<Alert & { actions: VerificationAction[] }> {
    try {
      const res = await fetch(`${BASE_URL}/alerts/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, note, userId, userName }),
      });
      if (res.ok) return res.json();
    } catch (e) {
      // Fallback
    }
    return mockStorage.updateAlertStatus(id, status, note, userId, userName);
  },

  // Verification Actions
  async getActions(): Promise<VerificationAction[]> {
    try {
      const res = await fetch(`${BASE_URL}/actions`);
      if (res.ok) return res.json();
    } catch (e) {
      // Fallback
    }
    return mockStorage.getActions();
  },

  // System Metrics
  async getMetrics(): Promise<SystemMetrics & {
    totalNodes: number;
    warningNodes: number;
    offlineNodes: number;
    patrolRequested: number;
    gatewayStatus: string;
    dailyTrend: { day: string; total: number; verified: number; falsePositive: number }[];
  }> {
    try {
      const res = await fetch(`${BASE_URL}/metrics`);
      if (res.ok) return res.json();
    } catch (e) {
      // Fallback
    }
    return mockStorage.getMetrics() as any;
  },

  // Project Settings
  async getSettings(): Promise<Record<string, string>> {
    try {
      const res = await fetch(`${BASE_URL}/settings`);
      if (res.ok) return res.json();
    } catch (e) {
      // Fallback
    }
    return {
      demo_mode: 'true',
      gateway_status: 'online',
      chainsaw_threshold: '0.85',
      model_version: 'vanrakshak-tinyml-v1.4',
      lora_frequency_mhz: '865.0625',
      lora_region: 'IN865',
    };
  },

  // Simulation
  async simulateChainsawAlert(targetNodeId?: string, customConfidence?: number) {
    try {
      const res = await fetch(`${BASE_URL}/simulation/chainsaw-alert`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ targetNodeId, customConfidence }),
      });
      if (res.ok) return res.json();
    } catch (e) {
      // Fallback
    }
    return mockStorage.simulateChainsawAlert(targetNodeId, customConfidence);
  },

  async simulateBackgroundEvent(targetNodeId?: string) {
    try {
      const res = await fetch(`${BASE_URL}/simulation/background-event`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ targetNodeId }),
      });
      if (res.ok) return res.json();
    } catch (e) {
      // Fallback
    }
    return mockStorage.simulateBackgroundEvent(targetNodeId);
  },

  // Hardware Ingest (Planned Interface)
  async ingestHardwareAlert(payload: IngestAlertPayload, apiKey?: string) {
    try {
      const res = await fetch(`${BASE_URL}/ingest/alert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey || 'vr_dev_test_device_key_in865',
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) return res.json();
    } catch (e) {
      // Fallback
    }
    return {
      status: 'accepted',
      integrationStage: 'Planned Hardware Integration Interface',
      message: 'Packet validated and processed through VanRakshak simulation pipeline.',
      packetSummary: payload,
    };
  },
};
