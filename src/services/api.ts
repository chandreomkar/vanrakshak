import { SensorNode, Alert, VerificationAction, SystemMetrics, IngestAlertPayload, User } from '../types';

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
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    if (!res.ok) throw new Error('Failed to login');
    const data = await res.json();
    localStorage.setItem('vr_token', data.token);
    return data;
  },

  async getMe(): Promise<{ user: User; authenticated: boolean; isGuest: boolean }> {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch current user');
    return res.json();
  },

  async logout(): Promise<void> {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    localStorage.removeItem('vr_token');
  },

  // Sensor Nodes
  async getNodes(): Promise<SensorNode[]> {
    const res = await fetch(`${BASE_URL}/nodes`);
    if (!res.ok) throw new Error('Failed to fetch sensor nodes');
    return res.json();
  },

  async getNode(nodeId: string): Promise<SensorNode> {
    const res = await fetch(`${BASE_URL}/nodes/${nodeId}`);
    if (!res.ok) throw new Error(`Failed to fetch node ${nodeId}`);
    return res.json();
  },

  async createNode(data: Partial<SensorNode>): Promise<SensorNode> {
    const res = await fetch(`${BASE_URL}/nodes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create node');
    }
    return res.json();
  },

  async updateNode(nodeId: string, data: Partial<SensorNode>): Promise<SensorNode> {
    const res = await fetch(`${BASE_URL}/nodes/${nodeId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update node');
    }
    return res.json();
  },

  async deleteNode(nodeId: string): Promise<{ success: boolean }> {
    const res = await fetch(`${BASE_URL}/nodes/${nodeId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to delete node ${nodeId}`);
    return res.json();
  },

  // Alerts
  async getAlerts(params?: { eventType?: string; zone?: string; status?: string }): Promise<Alert[]> {
    const query = new URLSearchParams();
    if (params?.eventType) query.append('eventType', params.eventType);
    if (params?.zone) query.append('zone', params.zone);
    if (params?.status) query.append('status', params.status);

    const res = await fetch(`${BASE_URL}/alerts?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
  },

  async getAlert(id: string): Promise<Alert & { actions: VerificationAction[] }> {
    const res = await fetch(`${BASE_URL}/alerts/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch alert ${id}`);
    return res.json();
  },

  async updateAlertStatus(
    id: string,
    status: string,
    note: string,
    userId?: string,
    userName?: string
  ): Promise<Alert & { actions: VerificationAction[] }> {
    const res = await fetch(`${BASE_URL}/alerts/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, note, userId, userName }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update alert status');
    }
    return res.json();
  },

  // Verification Actions
  async getActions(): Promise<VerificationAction[]> {
    const res = await fetch(`${BASE_URL}/actions`);
    if (!res.ok) throw new Error('Failed to fetch actions');
    return res.json();
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
    const res = await fetch(`${BASE_URL}/metrics`);
    if (!res.ok) throw new Error('Failed to fetch metrics');
    return res.json();
  },

  // Project Settings
  async getSettings(): Promise<Record<string, string>> {
    const res = await fetch(`${BASE_URL}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  // Simulation
  async simulateChainsawAlert(targetNodeId?: string, customConfidence?: number) {
    const res = await fetch(`${BASE_URL}/simulation/chainsaw-alert`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ targetNodeId, customConfidence }),
    });
    if (!res.ok) throw new Error('Failed to simulate chainsaw alert');
    return res.json();
  },

  async simulateBackgroundEvent(targetNodeId?: string) {
    const res = await fetch(`${BASE_URL}/simulation/background-event`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ targetNodeId }),
    });
    if (!res.ok) throw new Error('Failed to simulate background event');
    return res.json();
  },

  // Hardware Ingest (Planned Interface)
  async ingestHardwareAlert(payload: IngestAlertPayload, apiKey?: string) {
    const res = await fetch(`${BASE_URL}/ingest/alert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || 'vr_dev_test_device_key_in865',
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
};
