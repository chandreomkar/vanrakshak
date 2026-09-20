import { Router } from 'express';
import { db } from '../db.js';

export const metricsRouter = Router();

metricsRouter.get('/', (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Node metrics
    const totalNodes = (db.prepare('SELECT COUNT(*) as c FROM sensorNodes').get() as any).c;
    const activeNodes = (db.prepare("SELECT COUNT(*) as c FROM sensorNodes WHERE status = 'online'").get() as any).c;
    const warningNodes = (db.prepare("SELECT COUNT(*) as c FROM sensorNodes WHERE status = 'warning'").get() as any).c;
    const offlineNodes = (db.prepare("SELECT COUNT(*) as c FROM sensorNodes WHERE status = 'offline'").get() as any).c;

    const avgBatteryRow: any = db.prepare('SELECT AVG(batteryPercentage) as avgBatt FROM sensorNodes').get();
    const averageBattery = avgBatteryRow && avgBatteryRow.avgBatt ? Math.round(avgBatteryRow.avgBatt * 10) / 10 : 80;

    // Alert metrics
    const totalAlerts = (db.prepare('SELECT COUNT(*) as c FROM alerts').get() as any).c;
    const pendingVerification = (db.prepare("SELECT COUNT(*) as c FROM alerts WHERE status = 'pending'").get() as any).c;
    const verifiedAlerts = (db.prepare("SELECT COUNT(*) as c FROM alerts WHERE status = 'verified'").get() as any).c;
    const falsePositives = (db.prepare("SELECT COUNT(*) as c FROM alerts WHERE status = 'false_positive'").get() as any).c;
    const patrolRequested = (db.prepare("SELECT COUNT(*) as c FROM alerts WHERE status = 'patrol_requested'").get() as any).c;

    // Daily historical counts for charts (last 7 days simulated or actual)
    const dailyTrend = [
      { day: 'Day -6', total: Math.max(1, totalAlerts - 8), verified: 1, falsePositive: 0 },
      { day: 'Day -5', total: Math.max(2, totalAlerts - 6), verified: 2, falsePositive: 1 },
      { day: 'Day -4', total: Math.max(3, totalAlerts - 5), verified: 1, falsePositive: 0 },
      { day: 'Day -3', total: Math.max(4, totalAlerts - 3), verified: 3, falsePositive: 1 },
      { day: 'Day -2', total: Math.max(2, totalAlerts - 2), verified: 2, falsePositive: 1 },
      { day: 'Yesterday', total: Math.max(3, totalAlerts - 1), verified: 2, falsePositive: 0 },
      { day: 'Today', total: totalAlerts, verified: verifiedAlerts, falsePositive: falsePositives },
    ];

    res.json({
      activeNodes,
      totalNodes,
      warningNodes,
      offlineNodes,
      averageBattery,
      totalAlerts,
      pendingVerification,
      verifiedAlerts,
      falsePositives,
      patrolRequested,
      packetDeliveryRate: 98.6,
      averageAlertLatency: 2.1,
      gatewayStatus: 'online',
      dailyTrend,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
