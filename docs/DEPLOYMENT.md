# VanRakshak Production Deployment Guide

This guide outlines deployment options for hosting the VanRakshak platform.

---

## Deployment Strategy Overview

The application consists of:
1. **Frontend**: Static single-page application built with Vite (`dist/` directory).
2. **Backend**: Node.js / Express REST API and persistent SQLite database (`server/`).

---

## Option 1: Unified Full-Stack Deployment (Render / Railway)

### Using Render.com Web Service
1. Connect your GitHub repository: `https://github.com/chandreomkar/vanrakshak`
2. Configure settings:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run server`
   - **Plan**: Starter or Free tier with Persistent Disk mounted at `/data`
3. Environment Variables:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `DATABASE_PATH`: `/data/vanrakshak.db`
   - `DEMO_MODE`: `true`
   - `INGESTION_API_KEY`: Generate a random secure key

---

## Option 2: Decoupled Frontend (Vercel) + Backend (Railway / Render)

### Deploying Frontend to Vercel
1. Import repository on Vercel.
2. Build Settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add Rewrite in `vercel.json`:
   ```json
   {
     "rewrites": [
       { "source": "/api/(.*)", "destination": "https://your-backend.railway.app/api/$1" },
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

---

## Option 3: Docker Container Deployment

Create a `Dockerfile`:
```dockerfile
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/tsconfig.json ./

EXPOSE 5000
CMD ["npx", "tsx", "server/index.ts"]
```

Build and run:
```bash
docker build -t vanrakshak:latest .
docker run -p 5000:5000 -v vanrakshak-data:/app/data vanrakshak:latest
```
