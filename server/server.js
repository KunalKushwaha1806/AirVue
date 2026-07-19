import express from 'express';
import cors from 'cors';
import { 
    initSimulation, 
    refreshSimulation, 
    tickSimulation, 
    getTopPolluted, 
    calculateStats, 
    globalAQIData, 
    feedLog 
} from './simulation.js';

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
    res.json(globalAQIData);
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

// Start Express Server
app.listen(PORT, () => {
    console.log(`[AirVue Server] Running on http://localhost:${PORT}`);
});
