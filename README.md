# 🌬️ AirVue — Global Air Quality Monitor

AirVue is a **real-time, interactive AQI (Air Quality Index) dashboard** that visualizes simulated data from **3,500+ monitoring stations** on a sleek dark-blue, glassmorphism UI.  
It includes an interactive Leaflet map (clustered markers + heatmap), a live-updating Chart.js bar chart of the most polluted locations, a real-time feed, and smooth GSAP animations.

✨ **Live Demo:** *https://airvue.onrender.com/*

---

## 📖 Overview
- Interactive map showing AQI at thousands of stations (markers + clustering + heatmap).  
- Animated bar chart for top **15 most polluted** locations (updates automatically).  
- Live feed with recent station updates and a stats panel (stations, average AQI, counts).  
- UI: glassmorphism cards, particle background, responsive layout, GSAP animations.

---

## 🚀 Key Features
- 🌍 **Interactive Map (Leaflet)** — pan, zoom, marker popups with real geographic coordinates.  
- 📍 **Marker Clustering** — handles dense data sets using `leaflet.markercluster`.  
- 🔥 **Heatmap** — pollution density via `leaflet.heat`.  
- ⚡ **Live Simulation** — AQI values are simulated & updated periodically (no external AQI API needed).  
- 📊 **Charts** — `Chart.js` shows real-time top polluted locations.  
- 🎨 **Animations** — `GSAP` for entrance & UI animations.  
- 📱 **Responsive Design** — works on desktop and mobile with adaptive particle rendering.  
- 🗺️ **Accurate Area Mapping** — 200+ named areas across 20 cities with real-world lat/lng coordinates.

---

## ⚡ Performance Optimizations

AirVue is built for speed even with 3,500+ data points rendering simultaneously:

| Optimization | Technique |
|---|---|
| **O(1) AQI Lookup** | Precomputed 502-entry table replaces linear `.find()` scans |
| **Single-Pass Stats** | All 4 statistics computed in 1 loop instead of 3 separate array passes |
| **Min-Heap Top-K** | Chart data uses heap-based selection — O(n log 15) vs O(n log n) full sort |
| **Lazy Popups** | Popup HTML built on-click, not pre-allocated for all 3,500 markers |
| **Page Visibility API** | Background intervals pause when the tab is hidden |
| **DOM Caching** | Key elements cached once at init, no repeated `getElementById` calls |
| **CSS Containment** | `contain: content` on panels prevents layout thrashing across components |
| **GPU Optimization** | Removed `backdrop-filter` and `::before` from 3,500 marker elements |
| **Preconnect Hints** | DNS/TLS latency reduced for CDN domains via `<link rel="preconnect">` |
| **Deferred Scripts** | Non-critical scripts load with `defer` to unblock HTML parsing |
| **Mobile Adaptive** | Particle count halved (30 → 15) on mobile for smoother rendering |

---

## 🛠️ Libraries & External Resources

**Map & Map Layers**
- [Leaflet.js](https://leafletjs.com/) — interactive map UI (v1.9.4)  
- [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster) — marker clustering (v1.5.3)  
- [Leaflet.heat](https://github.com/Leaflet/Leaflet.heat) — heatmap visualization (v0.2.0)  
- **Map Tiles**: CARTO Dark  
  - URL: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`  
  - Attribution: © OpenStreetMap contributors © CARTO  

**Charts & Animations**
- [Chart.js](https://www.chartjs.org/) — comparison bar chart  
- [GSAP](https://greensock.com/gsap/) — UI animations (v3.12.2)  
- [ScrollToPlugin](https://greensock.com/docs/v3/Plugins/ScrollToPlugin) — smooth scrolling  

**UI Enhancements**
- [Font Awesome](https://fontawesome.com/) — icons (v6.4.0)  
- [Google Fonts: Inter](https://fonts.google.com/specimen/Inter) — typography  

---

## 🚀 Running the Project Locally
You can run this project with or without a local server.

### Quick Method (No Server Required)
Simply open the `index.html` file directly in your web browser.

**Example:** Double-click the file or right-click → *Open with* → Google Chrome.

### Recommended Method (Using a Local Server)
Using a local server is the best practice for web development. Here's a quick way to start one using Python's built-in module.

1. Make sure you have Python installed.  
2. Open your terminal or command prompt in the project's root directory.  
3. Run the following command:

```bash
python -m http.server 8000
```

Once the server is running, open your browser and go to: [http://localhost:8000](http://localhost:8000)

---

## 📁 File Structure
The project is organized into three core files for clean separation of concerns.

```
AirVue/
│
├── index.html      # App shell — CDN library imports, preconnect hints, and semantic structure
├── style.css       # Glassmorphism theme, layout, responsive design, and GPU-optimized rendering
├── script.js       # Core logic — data simulation, map rendering, charts, animations, and optimizations
└── assets/         # Demo screenshots and images
```

---

## 🔗 APIs & Data Source

### AQI Data Simulation
- This project does **not** call any external AQI APIs.  
- AQI values are simulated locally within `script.js` for fast performance and a dynamic UX.  
- The `generateDenseData()` function creates **3,500 data points** across 47 base cities.  
- **200+ named areas** (Connaught Place, Bandra, Koramangala, etc.) use real geographic coordinates.  
- AQI values are updated periodically via `setInterval`, with automatic pausing when the tab is hidden.

### Map Tiles API
- The interactive map background is provided by **CARTO** using **OpenStreetMap** data.  

**Source URL:**  
```
https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png
```

**Attribution:** © OpenStreetMap contributors © CARTO

---

## 🧾 License
This project is licensed under the **Apache 2.0 License**.  

Please see the LICENSE file in the repository for full details.

---

## 🙏 Credits & Acknowledgements
This project was made possible by the following amazing open-source libraries and services:

- **Map & Data:** OpenStreetMap & CARTO  
- **Libraries:**  
  - Leaflet.js  
  - Leaflet.markercluster  
  - Leaflet.heat  
  - Chart.js  
  - GSAP (GreenSock Animation Platform)  
  - Font Awesome  
  - Google Fonts  

---

## 🛠️ Getting Started

```bash
# Clone the repository
git clone https://github.com/KunalKushwaha1806/AirVue.git

# Navigate to the project folder
cd AirVue

# Open in browser (or use a local server)
python -m http.server 8000
```
