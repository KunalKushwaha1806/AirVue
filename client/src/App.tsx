import React, { useEffect, useState, useCallback } from 'react';
import { 
  Wind, 
  Map as MapIcon, 
  Globe2,
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
import type { Station, Stats, FeedItem, ViewMode } from './types/station';
import './styles/global.css';

export const App: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [stats, setStats] = useState<Stats>({ 
    totalStations: 0, 
    avgAQI: 0, 
    goodAir: 0, 
    hazardousAir: 0,
    safePercent: 0 
  });
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [topStations, setTopStations] = useState<Station[]>([]);
  const [currentView, setCurrentView] = useState<ViewMode>('india');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Fetch all dashboard data from Express API
  const fetchDashboardData = useCallback(async (includeStations = true) => {
    try {
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
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (error) {
      console.error("Error fetching AirVue telemetry:", error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchDashboardData(true).then(() => {
      setLoading(false);
    });
  }, [fetchDashboardData]);

  // Periodic polling
  useEffect(() => {
    let intervalId: any;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(intervalId);
      } else {
        intervalId = setInterval(() => {
          fetchDashboardData(true);
        }, 3000);
      }
    };

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
      console.error("Error refreshing telemetry:", err);
    } finally {
      setTimeout(() => {
        setRefreshing(false);
      }, 700);
    }
  };

  const handleSelectStation = (station: Station | null) => {
    setSelectedStation(station);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      {/* Dynamic Background Particles */}
      <ParticleBackground />

      {/* Header Panel */}
      <motion.header 
        className="glass-panel app-header"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className="header-badge-row">
          <span className="live-status-badge">
            <span className="pulsing-green-dot"></span>
            Telemetry Stream Live
          </span>
          {lastUpdated && (
            <span className="last-sync-tag">
              Updated at {lastUpdated}
            </span>
          )}
        </div>

        <div className="header-brand-row">
          <div className="brand-icon-box">
            <Wind size={36} />
          </div>
          <div className="brand-text-col">
            <h1>AirVue <span className="brand-sub-badge">v2.0</span></h1>
            <p className="subtitle">
              Precision Air Quality Intelligence & Interactive Geocoded Telemetry. Monitoring real-time PM2.5, PM10 & AQI across 3,800+ stations.
            </p>
          </div>
        </div>

        {/* Global Controls & View Switcher */}
        <div className="controls-container">
          <div className="view-mode-group">
            <button 
              className={`btn ${currentView === 'india' ? 'active' : ''}`}
              onClick={() => {
                setCurrentView('india');
                setSelectedStation(null);
              }}
              title="Focus on India National Network"
            >
              <MapIcon size={16} /> India View
            </button>
            <button 
              className={`btn ${currentView === 'global' ? 'active' : ''}`}
              onClick={() => {
                setCurrentView('global');
                setSelectedStation(null);
              }}
              title="Compare with Global Hubs"
            >
              <Globe2 size={16} /> Global Hubs
            </button>
            <button 
              className={`btn ${currentView === 'heatmap' ? 'active' : ''}`}
              onClick={() => {
                setCurrentView('heatmap');
                setSelectedStation(null);
              }}
              title="Continuous Air Pollution Density Heatmap"
            >
              <Flame size={16} /> AQI Heatmap
            </button>
          </div>

          <button 
            className="btn btn-refresh" 
            onClick={handleRefresh}
            disabled={refreshing}
            title="Recalibrate Simulation & Fetch Latest Telemetry"
          >
            <RefreshCw className={refreshing ? 'animate-spin' : ''} size={15} /> 
            {refreshing ? 'Syncing...' : 'Sync Data'}
          </button>
        </div>
      </motion.header>

      {/* Main Dashboard Layout */}
      <div className="dashboard-grid">
        {/* Left: Map Card */}
        <motion.div
          className="map-column"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {loading ? (
            <div className="glass-panel map-card flex-center">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <MapDashboard 
              stations={stations} 
              currentView={currentView}
              searchQuery={searchQuery}
              selectedSeverity={selectedSeverity}
              selectedStation={selectedStation}
              onSelectStation={handleSelectStation}
            />
          )}
        </motion.div>

        {/* Right Side: Interactive Side Panels */}
        <div className="side-panel">
          {/* Search & Autocomplete Panel */}
          <motion.div 
            className="glass-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="panel-title">
              <Wind size={18} /> 
              <span>Search & Telemetry Filters</span>
            </div>
            <SearchFilter 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedSeverity={selectedSeverity}
              setSelectedSeverity={setSelectedSeverity}
              stations={stations}
              onSelectStation={handleSelectStation}
            />
          </motion.div>

          {/* Real-time Network Statistics */}
          <motion.div 
            className="glass-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="panel-title">
              <LineChartIcon size={18} /> 
              <span>National Network Statistics</span>
            </div>
            <StatisticsGrid stats={stats} />
          </motion.div>

          {/* AQI Scale Reference */}
          <motion.div 
            className="glass-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="panel-title">
              <Palette size={18} /> 
              <span>AQI Scale & Health Impact</span>
            </div>
            <div className="legend-grid">
              {aqiLevels.map(level => (
                <div 
                  className={`legend-item ${selectedSeverity === level.status.toLowerCase() ? 'legend-selected' : ''}`} 
                  key={level.status}
                  onClick={() => setSelectedSeverity(
                    selectedSeverity === level.status.toLowerCase() ? 'all' : level.status.toLowerCase()
                  )}
                  title="Click to filter map by this severity"
                >
                  <div className="legend-color-dot" style={{ backgroundColor: level.color }} />
                  <div className="legend-text">
                    <strong>{level.status}</strong>
                    <span className="legend-range">
                      ({level.range[0]}-{level.range[1] === Infinity ? '301+' : level.range[1]})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Real-time Telemetry Event Log */}
          <motion.div 
            className="glass-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="panel-title">
              <Rss size={18} /> 
              <span>Live Sensor Activity Log</span>
            </div>
            <LiveFeed 
              feed={feed} 
              stations={stations}
              onSelectStation={handleSelectStation}
            />
          </motion.div>
        </div>
      </div>

      {/* Comparison & Hotspot Ranking Panel */}
      <motion.div 
        className="glass-panel chart-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <div className="panel-title">
          <BarChart3 size={18} /> 
          <span>Top 15 Most Polluted Stations (Click to View on Map)</span>
        </div>
        <ComparisonChart 
          topStations={topStations} 
          onSelectStation={handleSelectStation}
        />
      </motion.div>

      {/* Floating Scroll to Top FAB */}
      {showScrollTop && (
        <motion.button 
          className="fab" 
          onClick={scrollToTop}
          title="Return to Top"
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
