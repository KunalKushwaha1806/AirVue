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
} from '../server/simulation.js';

const app = express();

app.use(cors());
app.use(express.json());

// Initialize simulation on cold start if not already populated
if (!globalAQIData || globalAQIData.length === 0) {
    initSimulation();
}

app.get('/api/stations', (req, res) => {
    if (!globalAQIData || globalAQIData.length === 0) initSimulation();
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
    if (!globalAQIData || globalAQIData.length === 0) initSimulation();
    const stats = calculateStats();
    res.json(stats);
});

app.get('/api/top-polluted', (req, res) => {
    if (!globalAQIData || globalAQIData.length === 0) initSimulation();
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 15;
    const topStations = getTopPolluted(limit);
    res.json(topStations);
});

app.get('/api/feed', (req, res) => {
    if (!globalAQIData || globalAQIData.length === 0) initSimulation();
    // Provide tick updates when queried on serverless
    tickSimulation();
    res.json(feedLog);
});

app.post('/api/refresh', (req, res) => {
    refreshSimulation();
    res.json({ success: true, message: "Data refreshed - 3,800+ stations synchronized" });
});

export default app;
