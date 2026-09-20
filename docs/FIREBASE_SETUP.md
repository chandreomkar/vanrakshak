# Optional Firebase Extension & Migration Guide

While VanRakshak runs locally and independently with SQLite and Express for the hackathon MVP, the database collections and REST endpoints were deliberately architected to mirror Firebase Firestore collections 1:1.

This guide explains how to migrate or connect Firebase services as an optional extension.

---

## 1. Prerequisites
- A Google Firebase account (https://console.firebase.google.com)
- Firebase CLI installed: `npm install -g firebase-tools`

---

## 2. Firebase Project Setup
1. Create a new Firebase project named `vanrakshak-forest`.
2. Enable **Cloud Firestore** in production mode.
3. Enable **Firebase Authentication** with Email/Password or Google Sign-in providers.
4. Download your web configuration keys and add them to `.env`:
   ```bash
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=vanrakshak-forest.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=vanrakshak-forest
   VITE_FIREBASE_STORAGE_BUCKET=vanrakshak-forest.appspot.com
   ```

---

## 3. Firestore Collection Mapping
The current SQLite tables map directly to Firestore collections:

| SQLite Table | Firestore Collection | Document ID Format |
|---|---|---|
| `sensorNodes` | `sensorNodes` | `nodeId` (e.g. `VR-01`) |
| `alerts` | `alerts` | Auto-generated UUID |
| `verificationActions` | `verificationActions` | Auto-generated UUID |
| `systemMetrics` | `systemMetrics` | `YYYY-MM-DD` |
| `projectSettings` | `projectSettings` | `settingKey` |
| `users` | `users` | Firebase Auth UID |

---

## 4. Firestore Security Rules Example
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Read access for authenticated staff and guests
    match /sensorNodes/{nodeId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }

    match /alerts/{alertId} {
      allow read: if request.auth != null;
      allow create: if request.auth.token.isDevice == true || request.auth.token.role == 'admin';
      allow update: if request.auth != null && (request.auth.token.role == 'ranger' || request.auth.token.role == 'admin');
    }

    match /verificationActions/{actionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && (request.auth.token.role == 'ranger' || request.auth.token.role == 'admin');
    }
  }
}
```

---

## 5. Firebase Hosting Deployment
To deploy the static frontend to Firebase Hosting:
```bash
firebase login
firebase init hosting
# Set public directory to "dist"
# Configure as a single-page app: Yes
npm run build
firebase deploy --only hosting
```
