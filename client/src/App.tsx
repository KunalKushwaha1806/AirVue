import React, { useEffect, useState, useCallback } from 'react';
import { 
  Wind, 
  Map, 
  Flame, 
  RefreshCw, 
  Palette, 
  LineChart as LineChartIcon, 
  Rss, 
  BarChart3, 
  ChevronUp 
} from 'lucide-react';
import { motion } from 'framer-motion';

import { ParticleBackground } from './components/ParticleBackground';
import { StatisticsGrid } from './components/StatisticsGrid';
import { ComparisonChart } from './components/ComparisonChart';
import { LiveFeed } from './components/LiveFeed';
import { MapDashboard } from './components/MapDashboard';
import { SearchFilter } from './components/SearchFilter';
import { aqiLevels } from './utils/aqi';
import './styles/global.css';

interface Station {
  id: number;
  city: string;
  locationName: string;
  country: string;
  lat: number;
  lng: number;
  aqi: number;
}

interface Stats {
  totalStations: number;
  avgAQI: number;
  goodAir: number;
  hazardousAir: number;
}

interface FeedItem {
  time: string;
  message: string;
  aqi: number;
}

export const App: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [stats, setStats] = useState<Stats>({ totalStations: 0, avgAQI: 0, goodAir: 0, hazardousAir: 0 });
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [topStations, setTopStations] = useState<Station[]>([]);
  const [currentView, setCurrentView] = useState<'global' | 'heatmap'>('global');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Fetch all dashboard data from Node.js Express server
  const fetchDashboardData = useCallback(async (includeStations = true) => {
    try {
      // Run fetches in parallel
      const fetchPromises: Promise<any>[] = [
        fetch('/api/stats').then(res => res.json()),
        fetch('/api/top-polluted?limit=15').then(res => res.json()),
        fetch('/api/feed').then(res => res.json())
      ];

      if (includeStations) {
        fetchPromises.push(fetch('/api/stations').then(res => res.json()));
      }

      const results = await Promise.all(fetchPromises);
      
      setStats(results[0]);
      setTopStations(results[1]);
      setFeed(results[2]);
      
      if (includeStations) {
        setStations(results[3]);
      }
    } catch (error) {
      console.error("Error fetching AirVue data:", error);
    }
  }, []);

  // Initial mount load
  useEffect(() => {
    fetchDashboardData(true).then(() => {
      setLoading(false);
    });
  }, [fetchDashboardData]);

  // Periodic polling using Page Visibility API to save bandwidth/resources when tab is inactive
  useEffect(() => {
    let intervalId: any;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(intervalId);
      } else {
        intervalId = setInterval(() => {
          fetchDashboardData(true); // Fetch state updates
        }, 3000);
      }
    };

    // Start interval
    intervalId = setInterval(() => {
      fetchDashboardData(true);
    }, 3000);

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchDashboardData]);

  // Show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Trigger manual simulation reset
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetch('/api/refresh', { method: 'POST' });
      await fetchDashboardData(true);
    } catch (err) {
      console.error("Error refreshing data:", err);
    } finally {
      setTimeout(() => {
        setRefreshing(false);
      }, 800);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      {/* Background Particles */}
      <ParticleBackground />

      {/* Header Panel */}
      <motion.header 
        className="glass-panel app-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h1><Wind /> AirVue</h1>
        <p className="subtitle">
          Real-time global air quality monitoring dashboard. Visualizing live simulated telemetry from 3,500+ micro-stations across India and select international hubs.
        </p>

        {/* Global Controls */}
        <div className="controls-container">
          <button 
            className={`btn ${currentView === 'global' ? 'active' : ''}`}
            onClick={() => setCurrentView('global')}
          >
            <Map /> India View
          </button>
          <button 
            className={`btn ${currentView === 'heatmap' ? 'active' : ''}`}
            onClick={() => setCurrentView('heatmap')}
          >
            <Flame /> Heatmap
          </button>
          <button 
            className="btn" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={refreshing ? 'animate-spin' : ''} /> 
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </motion.header>

      {/* Main Grid: Map & Controls */}
      <div className="dashboard-grid">
        {/* Left Side: Map Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {loading ? (
            <div className="glass-panel map-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <MapDashboard 
              stations={stations} 
              currentView={currentView}
              searchQuery={searchQuery}
              selectedSeverity={selectedSeverity}
            />
          )}
        </motion.div>

        {/* Right Side: Side Panels */}
        <div className="side-panel">
          {/* Search Panel */}
          <motion.div 
            className="glass-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="panel-title"><Wind size={18} /> Search & Filter</div>
            <SearchFilter 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedSeverity={selectedSeverity}
              setSelectedSeverity={setSelectedSeverity}
            />
          </motion.div>

          {/* AQI Scale Legend Card */}
          <motion.div 
            className="glass-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="panel-title"><Palette size={18} /> AQI Classification</div>
            <div className="legend-grid">
              {aqiLevels.map(level => (
                <div className="legend-item" key={level.status}>
                  <div className="legend-color" style={{ backgroundColor: level.color }} />
                  <div className="legend-text">
                    <strong>{level.status}</strong> 
                    ({level.range[0]}-{level.range[1] === Infinity ? '301+' : level.range[1]})
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Stats Card */}
          <motion.div 
            className="glass-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="panel-title"><LineChartIcon size={18} /> Live Statistics</div>
            <StatisticsGrid stats={stats} />
          </motion.div>

          {/* Feed Card */}
          <motion.div 
            className="glass-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="panel-title"><Rss size={18} /> Event Log Feed</div>
            <LiveFeed feed={feed} />
          </motion.div>
        </div>
      </div>

      {/* Comparison Chart Panel */}
      <motion.div 
        className="glass-panel chart-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <div className="panel-title"><BarChart3 size={18} /> Top 15 Most Polluted Locations</div>
        <ComparisonChart topStations={topStations} />
      </motion.div>

      {/* Back to Top FAB */}
      {showScrollTop && (
        <motion.button 
          className="fab" 
          onClick={scrollToTop}
          title="Back to Top"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
        >
          <ChevronUp />
        </motion.button>
      )}
    </div>
  );
};
export default App;
