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
- 🌍 **Interactive Map (Leaflet)** — pan, zoom, marker popups.  
- 📍 **Marker Clustering** — handles dense data sets using `leaflet.markercluster`.  
- 🔥 **Heatmap** — pollution density via `leaflet.heat`.  
- ⚡ **Live Simulation** — AQI values are simulated & updated periodically (no external AQI API needed).  
- 📊 **Charts** — `Chart.js` shows real-time top polluted locations.  
- 🎨 **Animations** — `GSAP` for entrance & UI animations.  
- 📱 **Responsive Design** — works on desktop and mobile.  

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

# AirVue 🌍

## 🚀 Running the Project Locally
You can run this project with or without a local server.

### Quick Method (No Server Required)
Simply open the `index.html` file directly in your web browser.

**Example:** Double-click the file or right-click → *Open with* → Google Chrome.

### Recommended Method (Using a Local Server)
Using a local server is the best practice for web development. Here’s a quick way to start one using Python's built-in module.

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
├── index.html      # Main HTML structure, container for the app, and library imports
├── style.css       # All styles, including the glassmorphism theme, layout, and responsive design
└── script.js       # Core logic for map rendering, AQI simulation, charts, and animations
```

---

## 🔗 APIs & Data Source

### AQI Data Simulation
- This project does **not** call any external AQI APIs.  
- To ensure fast performance and a dynamic user experience, the AQI values are simulated locally within `script.js`.  
- The `generateDenseData()` function creates approximately **3,500 data points** for monitoring stations.  
- AQI values are updated periodically using `setInterval` to mimic a live data feed.

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


```bash
# Clone the repository
git clone https://github.com/your-username/airvue.git

# Navigate to the project folder
cd airvue
