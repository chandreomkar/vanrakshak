# VanRakshak Troubleshooting Guide

Common issues and their resolutions when setting up or testing the prototype.

---

## 1. Port Conflicts (Port 3000 or 5000 Already in Use)

**Symptom**: `Error: listen EADDRINUSE: address already in use :::5000`

**Resolution**:
1. Check what is running on port 5000:
   - On Windows PowerShell: `Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess`
2. Stop the conflicting process or change the port in `.env`:
   ```bash
   PORT=5001
   ```
3. Update `vite.config.ts` proxy to match your custom port if changed.

---

## 2. PowerShell Script Execution Policy Disabled

**Symptom**: `npm.ps1 cannot be loaded because running scripts is disabled on this system.`

**Resolution**:
- Run using `npm.cmd` instead of `npm`, or enable process-level bypass:
  ```powershell
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
  ```

---

## 3. SQLite Database Locked or Permission Error

**Symptom**: `SqliteError: database is locked`

**Resolution**:
- VanRakshak uses WAL (Write-Ahead Logging) mode which supports concurrent readers and a single writer. Ensure only one instance of `server/index.ts` is running at a time.
- If data corruption occurs during testing, simply delete `data/vanrakshak.db` and restart `npm run server` to automatically re-seed fresh demonstration data.

---

## 4. Hardware Ingestion 401 Unauthorized

**Symptom**: `POST /api/ingest/alert` returns `401 Unauthorized`.

**Resolution**:
- Make sure to pass the header `x-api-key`.
- The default development testing key in `.env` is:
  ```
  x-api-key: vr_dev_test_device_key_in865
  ```

---

## 5. Simulation Alert Not Showing Immediately

**Symptom**: Triggered simulation but dashboard didn't refresh.

**Resolution**:
- The dashboard automatically polls every 15–20 seconds.
- You can click **“Refresh Queue”** in the Live Alerts page or use the modal confirmation button to trigger immediate state synchronization.
