# VanRakshak QA & Verification Test Report

**Date of Execution**: 2026-09-20  
**Test Suite**: VanRakshak Core Verification (`npm test` & `tests/testApiEndpoints.ts`)  
**Status**: All Tests Passed (100% Success Rate)

---

## 1. Automated Test Results Summary

| Test Suite | Test Case | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| **Node Registry** | Default node seeding | $\ge 6$ nodes seeded | 6 nodes verified | ✅ PASS |
| **Node Registry** | VR-01 battery & zone | 91% battery in Zone A | 91% in Zone A | ✅ PASS |
| **Node Registry** | VR-03 warning state | Status 'warning', Zone B | Status 'warning', Zone B | ✅ PASS |
| **Node Registry** | VR-04 offline state | Status 'offline', 22% batt | Status 'offline', 22% batt | ✅ PASS |
| **Validation** | Confidence clamping | Rejects confidence &gt; 1.0 | Rejected | ✅ PASS |
| **Validation** | Confidence validity | Accepts 0.92 | Accepted | ✅ PASS |
| **Validation** | Battery bounds | Rejects &gt; 100% or &lt; 0% | Rejected | ✅ PASS |
| **Validation** | Battery acceptance | Accepts 78% | Accepted | ✅ PASS |
| **Alert Lifecycle** | Alert creation | Created in 'pending' | Status 'pending' verified | ✅ PASS |
| **Alert Lifecycle** | Status update | Updated to 'verified' | Status 'verified' verified | ✅ PASS |
| **Audit Trail** | Immutable action log | Logged in `verificationActions` | Record logged with timestamp | ✅ PASS |
| **Audit Trail** | Note fidelity | Ranger rationale preserved | Note stored accurately | ✅ PASS |
| **Simulation** | 3-Window voting logic | Consensus threshold $\ge 0.85$ | Consensus verified | ✅ PASS |
| **Regulatory** | India WPC compliance | Frequency in 865–867 MHz | 865.0625 MHz verified | ✅ PASS |

**Total Unit & Integration Assertions**: 15 Passed, 0 Failed.

---

## 2. HTTP REST Endpoints Verification

| Method | Route | Test Payload | Response Code | Notes |
|---|---|---|---|---|
| `GET` | `/api/health` | None | `200 OK` | System healthy, SQLite active |
| `GET` | `/api/nodes` | None | `200 OK` | Returns 6 seeded demonstration nodes |
| `GET` | `/api/alerts` | None | `200 OK` | Returns alert queue with status badges |
| `GET` | `/api/metrics` | None | `200 OK` | Calculated active nodes and battery avg |
| `POST` | `/api/simulation/chainsaw-alert` | `{ "targetNodeId": "VR-03" }` | `201 Created` | Generates synthetic alert & updates node |
| `POST` | `/api/ingest/alert` | Valid telemetry + API key | `201 Created` | Accepted as Planned Hardware Ingestion |
| `POST` | `/api/ingest/alert` | Missing / wrong API key | `401 Unauthorized` | Rejects unauthorized device traffic |

---

## 3. Frontend & UI Verification
- **TypeScript Compilation**: `tsc -b` completed with 0 errors.
- **Production Bundle**: `vite build` generated clean minified bundle in `dist/` in 39s.
- **Responsive Layout**: Tested across mobile (375px), tablet (768px), and desktop (1280px+).
- **Prototype Banner**: Visible on all pages without obstruction.
- **No Console Errors**: Zero unhandled exceptions or broken imports.
