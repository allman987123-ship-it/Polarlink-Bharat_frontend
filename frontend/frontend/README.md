# ❄️ PolarLink-Bharat — Frontend (Next.js 14)

Mission Operations UI & 3D WebGL Digital Twin for Indian Antarctic Research Stations.

## 🚀 Independent Deployment (Vercel / Netlify / Render / Cloudflare)

### 1. Environment Variables
In your deployment dashboard (e.g. Vercel / Netlify Project Settings), add:
- `NEXT_PUBLIC_API_URL`: URL of your deployed backend (e.g. `https://polarlink-backend.onrender.com`)
- `NEXT_PUBLIC_WS_URL`: WebSocket URL of your deployed backend (e.g. `wss://polarlink-backend.onrender.com/ws/telemetry`)

### 2. Build & Start Commands
- **Framework Preset**: Next.js
- **Install Command**: `npm install`
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

### 3. Local Development
```bash
npm install
npm run dev
```
Runs at: http://localhost:3000
