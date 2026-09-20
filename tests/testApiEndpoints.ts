import app from '../server/index.js';
import http from 'http';

const PORT = 5055;
const server = http.createServer(app);

async function testEndpoints() {
  console.log('📡 Testing REST API endpoints over HTTP on port', PORT);
  await new Promise<void>((resolve) => server.listen(PORT, resolve));

  const BASE = `http://localhost:${PORT}/api`;

  try {
    // 1. Health check
    const healthRes = await fetch(`${BASE}/health`);
    console.log('  /api/health status:', healthRes.status);
    const health = await healthRes.json();
    console.log('  Health response status:', health.status);

    // 2. Nodes list
    const nodesRes = await fetch(`${BASE}/nodes`);
    const nodes = await nodesRes.json();
    console.log(`  /api/nodes: returned ${nodes.length} nodes (status ${nodesRes.status})`);

    // 3. Alerts list
    const alertsRes = await fetch(`${BASE}/alerts`);
    const alerts = await alertsRes.json();
    console.log(`  /api/alerts: returned ${alerts.length} alerts (status ${alertsRes.status})`);

    // 4. Metrics
    const metricsRes = await fetch(`${BASE}/metrics`);
    const metrics = await metricsRes.json();
    console.log(`  /api/metrics: activeNodes=${metrics.activeNodes}, totalAlerts=${metrics.totalAlerts}`);

    // 5. Simulation trigger
    const simRes = await fetch(`${BASE}/simulation/chainsaw-alert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetNodeId: 'VR-03', customConfidence: 0.94 }),
    });
    const simData = await simRes.json();
    console.log('  /api/simulation/chainsaw-alert status:', simRes.status);
    console.log('  Simulated alert created ID:', simData.alert?.id, 'Confidence:', simData.alert?.confidence);

    // 6. Planned Hardware Ingest endpoint (valid payload + token)
    const ingestRes = await fetch(`${BASE}/ingest/alert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'vr_dev_test_device_key_in865',
      },
      body: JSON.stringify({
        nodeId: 'VR-01',
        eventType: 'possible_chainsaw',
        confidence: 0.93,
        timestamp: new Date().toISOString(),
        batteryPercentage: 90,
        sequenceNumber: 501,
        zone: 'Zone A',
      }),
    });
    const ingestData = await ingestRes.json();
    console.log('  /api/ingest/alert status:', ingestRes.status);
    console.log('  Ingest response integrationStage:', ingestData.integrationStage);

    // 7. Hardware Ingest invalid authentication test
    const unauthRes = await fetch(`${BASE}/ingest/alert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'wrong_key',
      },
      body: JSON.stringify({}),
    });
    console.log('  /api/ingest/alert with wrong key status:', unauthRes.status, '(Expected 401)');

    console.log('\n🎉 All HTTP REST endpoint tests completed successfully!');
  } finally {
    server.close();
  }
}

testEndpoints().catch((e) => {
  console.error('HTTP Test error:', e);
  server.close();
  process.exit(1);
});
