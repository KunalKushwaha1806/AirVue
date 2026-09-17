# 🌬️ AirVue — Global Air Quality Intelligence & Live Telemetry

AirVue is a **real-time, interactive AQI (Air Quality Index) dashboard** that visualizes telemetry from **3,800+ micro-monitoring stations** on an ultra-modern, dark-mode glassmorphic interface.  

✨ **Live Demo:** [https://air-vue-five.vercel.app/](https://air-vue-five.vercel.app/)

---

## 📖 Overview
- **Watermark-free Interactive Map**: Powered by Leaflet with high-resolution ArcGIS Dark Gray Canvas, Satellite Imagery, and OpenStreetMap basemaps.
- **Accurate Geocoding**: Covers all 28 Indian States & UTs with authentic CPCB/SAFAR neighborhood monitoring coordinates (Delhi NCR, Mumbai MMR, Bengaluru, Kolkata, Chennai, Hyderabad, Pune, Ahmedabad, and more).
- **True AQI Cluster Badges**: Cluster pins dynamically compute and display the **real average AQI** and severity color scale, accompanied by station counts.
- **Interactive Fly-To Navigation**: Search for any city or station, or click any alert in the live event feed or top polluted chart to smoothly animate the map directly to that sensor.
- **Station Detail Card**: Floating glassmorphic card displaying real-time PM2.5, PM10, NO2, Temperature, Humidity, and contextual health guidance.
- **Ranked Leaderboard & Chart**: Toggle between Chart.js animated bar visualization and an interactive Top 15 Leaderboard table.
- **Fullstack Serverless on Vercel**: Express API seamlessly served via Vercel Serverless Functions with offline/cold-start resilient telemetry caching.

---

## 🚀 Key Features

- 🗺️ **Multi-Layer Basemaps (No API Key Required)**:
  - 🌙 **Dark Canvas** — ArcGIS World Dark Gray Base + Reference Labels (Clean, zero watermark)
  - 🛰️ **Satellite Imagery** — High-resolution ArcGIS World Imagery
  - 🗺️ **Streets** — OpenStreetMap Standard
- 📍 **Smart AQI Clustering**: Calculates weighted regional average AQIs dynamically using Leaflet MarkerCluster.
- 🔥 **Pollution Density Heatmap**: Continuous air quality heat gradient visualization using `leaflet.heat`.
- 🔍 **Instant Search & Autocomplete**: Search by city, state, or neighborhood station with live AQI indicator pills.
- ⚡ **Real-Time Simulation Stream**: Continuous micro-fluctuations simulating atmospheric dynamics.
- 📊 **Pollution Comparison**: Real-time identification of critical air quality hotspots.
- 📱 **Fully Responsive**: Optimized for high-resolution desktop monitors, laptops, tablets, and smartphones.

---

## ⚡ Performance Optimizations

| Optimization | Technique |
|---|---|
| **O(1) AQI Lookup** | Precomputed 502-entry table replaces linear `.find()` scans |
| **Single-Pass Network Stats** | All statistical breakdowns computed in a single array loop |
| **Min-Heap Top-K** | Chart data uses heap-based selection — O(n log 15) vs O(n log n) full sort |
| **Lazy Popups & Drawers** | Component state and popups rendered on-demand to save memory |
| **Page Visibility API** | Background simulation intervals automatically pause when tab is inactive |
| **Zero-Watermark Tiles** | High-performance ESRI canvas eliminating third-party key limits |
| **Chunked Loading** | RequestAnimationFrame and chunked marker addition for 3,800+ markers |
| **Resilient Telemetry Cache** | Client-side fallback guarantees instant rendering on cold starts |

---

## 🛠️ Tech Stack & Libraries

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling & Motion**: Vanilla CSS (Glassmorphism design tokens), [Framer Motion](https://www.framer.com/motion/)
- **Mapping**: [Leaflet](https://leafletjs.com/), [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster), [Leaflet.heat](https://github.com/Leaflet/Leaflet.heat)
- **Charts & Icons**: [Chart.js](https://www.chartjs.org/) & [react-chartjs-2](https://react-chartjs-2.js.org/), [Lucide React](https://lucide.dev/)
- **Backend**: [Express.js](https://expressjs.com/), [Node.js](https://nodejs.org/), [Vercel Serverless Functions](https://vercel.com/docs/functions)

---

## 🚀 Running Locally

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation & Startup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/KunalKushwaha1806/AirVue.git
   cd AirVue
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Start the local fullstack development environment:**
   ```bash
   npm run dev
   ```
   This concurrently runs:
   - Express Backend: `http://localhost:5000`
   - Vite React Client: `http://localhost:5173`

4. Open your browser and navigate to:
   **[http://localhost:5173](http://localhost:5173)** (or **[http://localhost:5000](http://localhost:5000)**)

---

## 📁 Project Structure

```
AirVue/
├── api/
│   └── index.js            # Vercel Serverless Function entrypoint
├── client/
│   ├── src/
│   │   ├── components/     # MapDashboard, SearchFilter, ComparisonChart, etc.
│   │   ├── styles/         # Glassmorphism design tokens & global CSS
│   │   ├── types/          # TypeScript data models (Station, Stats, ViewMode)
│   │   ├── utils/          # AQI scales, health advisories, fallback data
│   │   ├── App.tsx         # Main interactive dashboard container
│   │   └── main.tsx        # React entrypoint
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/
│   ├── server.js           # Express API server (standalone)
│   ├── simulation.js       # Geocoded micro-station telemetry engine
│   └── aqiLookup.js        # O(1) AQI calculation lookup
├── vercel.json             # Vercel deployment routing & rewrites
└── package.json            # Root workspaces configuration
```

---

## ☁️ Deployment on Vercel

The project is pre-configured for 1-click Vercel deployment:

1. Import the repository in [Vercel Dashboard](https://vercel.com/new).
2. Leave settings as default (detected from `vercel.json`).
3. Click **Deploy**.

Live production deployment: **[https://air-vue-five.vercel.app/](https://air-vue-five.vercel.app/)**

---

## 🧾 License
This project is licensed under the **Apache 2.0 License**.
