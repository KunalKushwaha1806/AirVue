import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
    initSimulation, 
    refreshSimulation, 
    tickSimulation, 
    getTopPolluted, 
    calculateStats, 
    globalAQIData, 
    feedLog 
} from './simulation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize simulation
initSimulation();

// Periodic update loop (runs every 3 seconds)
setInterval(() => {
    tickSimulation();
}, 3000);

// API Endpoints
app.get('/api/stations', (req, res) => {
    const view = req.query.view;
    if (view === 'india') {
        res.json(globalAQIData.filter(s => !s.isGlobal));
    } else if (view === 'global') {
        res.json(globalAQIData.filter(s => s.isGlobal));
    } else {
        res.json(globalAQIData);
    }
});

app.get('/api/stats', (req, res) => {
    const stats = calculateStats();
    res.json(stats);
});

app.get('/api/top-polluted', (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 15;
    const topStations = getTopPolluted(limit);
    res.json(topStations);
});

app.get('/api/feed', (req, res) => {
    res.json(feedLog);
});

app.post('/api/refresh', (req, res) => {
    refreshSimulation();
    res.json({ success: true, message: "Data refreshed - 3,500 stations updated" });
});

// Serve frontend static files in production
app.use(express.static(path.join(__dirname, '../client/dist')));

// Wildcard route to serve React app shell for any other requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start Express Server
app.listen(PORT, () => {
    console.log(`[AirVue Server] Running on http://localhost:${PORT}`);
});
