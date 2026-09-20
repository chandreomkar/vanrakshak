# VanRakshak Local Developer Setup Guide

Follow these instructions to run the complete VanRakshak prototype on your local machine.

---

## 1. Prerequisites
- **Node.js**: v18.0 or higher (v24.x LTS recommended)
- **npm**: v9.0 or higher
- **Git**: Installed and configured

---

## 2. Clone & Enter Repository
```bash
git clone https://github.com/chandreomkar/vanrakshak.git
cd vanrakshak
```

---

## 3. Environment Configuration
Copy the sample environment file:
```bash
cp .env.example .env
```
*(Default settings in `.env` are pre-configured for zero-friction local development with SQLite and simulated demo mode).*

---

## 4. Install Dependencies
```bash
npm install
```

---

## 5. Launch Application
You can start both the Express backend and Vite frontend concurrently with a single command:

```bash
npm start
```

Or run them in separate terminals:

**Terminal 1 (Backend API & SQLite Store):**
```bash
npm run server
```
*Backend runs on: `http://localhost:5000`*

**Terminal 2 (Frontend Dashboard):**
```bash
npm run dev
```
*Frontend runs on: `http://localhost:3000`*

Open `http://localhost:3000` in your web browser.

---

## 6. Run Automated QA Tests
```bash
npm test
```
Verifies SQLite schemas, payload constraints, ranger audit trails, and India WPC regulatory frequencies.

---

## 7. Demo Mode Personas
Use the persona switcher in the top right navbar to test different roles:
- **Forest Ranger**: Full triage, status verification, and patrol dispatch permissions.
- **Division Admin**: Fleet registration, threshold tuning, and sensor node editing.
- **Guest Evaluator**: Read-only exploration for hackathon judges.
