import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.heat';
import type { Station, BasemapMode, ViewMode } from '../types/station';
import { getAQIDetails } from '../utils/aqi';
import { 
  Layers, 
  Compass, 
  ZoomIn, 
  ZoomOut, 
  X, 
  Thermometer, 
  Droplets, 
  Wind, 
  Activity, 
  AlertTriangle 
} from 'lucide-react';

interface MapDashboardProps {
  stations: Station[];
  currentView: ViewMode;
  searchQuery: string;
  selectedSeverity: string;
  selectedStation: Station | null;
  onSelectStation: (station: Station | null) => void;
}

export const MapDashboard: React.FC<MapDashboardProps> = ({
  stations,
  currentView,
  searchQuery,
  selectedSeverity,
  selectedStation,
  onSelectStation,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayersRef = useRef<{ [key: string]: L.LayerGroup | L.TileLayer }>({});
  const markerClusterGroupRef = useRef<any>(null);
  const heatmapLayerRef = useRef<any>(null);
  const markersMapRef = useRef<Map<number, L.Marker>>(new Map());

  const [basemap, setBasemap] = useState<BasemapMode>('dark');
  const [loading, setLoading] = useState(true);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create map instance
    const initialCenter: [number, number] = currentView === 'global' ? [25.0, 20.0] : [22.5, 79.5];
    const initialZoom = currentView === 'global' ? 2 : 5;

    const mapInstance = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: false, // We render sleek custom controls
      attributionControl: false,
    });

    // Custom attribution control in bottom-right corner
    L.control.attribution({
      position: 'bottomright',
      prefix: '<span class="map-attr">AirVue Live</span>'
    }).addTo(mapInstance);

    // 1. Dark Canvas Basemap (ArcGIS Dark Gray Base + Reference Labels) - NO WATERMARK, NO API KEY
    const darkBase = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: '© Esri, HERE, Garmin, OpenStreetMap',
        maxZoom: 16,
      }
    );
    const darkReference = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 16,
      }
    );
    const darkGroup = L.layerGroup([darkBase, darkReference]);

    // 2. Satellite Imagery Basemap (ArcGIS World Imagery)
    const satelliteLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: '© Esri, Maxar, Earthstar Geographics',
        maxZoom: 18,
      }
    );

    // 3. Clean Streets (OpenStreetMap)
    const streetsLayer = L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }
    );

    tileLayersRef.current = {
      dark: darkGroup,
      satellite: satelliteLayer,
      streets: streetsLayer,
    };

    // Default to dark canvas
    darkGroup.addTo(mapInstance);
    mapRef.current = mapInstance;
    setLoading(false);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Handle Basemap Switching
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.entries(tileLayersRef.current).forEach(([key, layer]) => {
      if (key === basemap) {
        if (!map.hasLayer(layer)) {
          map.addLayer(layer);
        }
      } else {
        if (map.hasLayer(layer)) {
          map.removeLayer(layer);
        }
      }
    });
  }, [basemap]);

  // Update Layers based on data, view, and filters
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing layers
    if (markerClusterGroupRef.current) {
      map.removeLayer(markerClusterGroupRef.current);
      markerClusterGroupRef.current = null;
    }
    if (heatmapLayerRef.current) {
      map.removeLayer(heatmapLayerRef.current);
      heatmapLayerRef.current = null;
    }
    markersMapRef.current.clear();

    // Filter stations based on search, view mode, and severity
    const filteredStations = stations.filter((station) => {
      // View filtering: if India view, prioritize Indian stations
      if (currentView === 'india' && station.isGlobal) return false;
      if (currentView === 'global' && !station.isGlobal) return false;

      // Text search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        station.locationName.toLowerCase().includes(q) ||
        station.city.toLowerCase().includes(q) ||
        station.state.toLowerCase().includes(q);

      // Severity filter
      const details = getAQIDetails(station.aqi);
      const matchesSeverity =
        selectedSeverity === 'all' ||
        details.status.toLowerCase() === selectedSeverity.toLowerCase();

      return matchesSearch && matchesSeverity;
    });

    if (currentView === 'heatmap') {
      // Heatmap view
      const heatData = filteredStations.map((station) => [
        station.lat,
        station.lng,
        station.aqi / 500,
      ]) as Array<[number, number, number]>;

      const heatmapLayer = (L as any).heatLayer(heatData, {
        radius: 28,
        blur: 22,
        maxZoom: 13,
        gradient: {
          0.0: '#10b981',
          0.2: '#eab308',
          0.4: '#f97316',
          0.6: '#ef4444',
          0.8: '#a855f7',
          1.0: '#881337',
        },
      }).addTo(map);

      heatmapLayerRef.current = heatmapLayer;
    } else {
      // Marker Clustering view with ACCURATE AQI-DRIVEN cluster styling
      const markerClusterGroup = (L as any).markerClusterGroup({
        chunkedLoading: true,
        maxClusterRadius: 55,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        iconCreateFunction: (cluster: any) => {
          const markers = cluster.getAllChildMarkers();
          let sumAqi = 0;
          markers.forEach((m: any) => {
            sumAqi += (m.options?.stationData?.aqi || 100);
          });
          const avgAqi = Math.round(sumAqi / Math.max(1, markers.length));
          const childCount = cluster.getChildCount();
          const details = getAQIDetails(avgAqi);

          return new L.DivIcon({
            html: `
              <div class="custom-cluster-badge" style="border-color: ${details.color}; box-shadow: 0 0 16px ${details.color}55;">
                <div class="cluster-inner" style="background-color: ${details.color}; color: ${details.textColor};">
                  <span class="cluster-aqi-value">${avgAqi}</span>
                  <span class="cluster-stn-count">${childCount} stns</span>
                </div>
              </div>
            `,
            className: 'custom-cluster-wrapper',
            iconSize: new L.Point(54, 54),
            iconAnchor: [27, 27],
          });
        },
      });

      // Populate markers
      filteredStations.forEach((station) => {
        const details = getAQIDetails(station.aqi);
        const icon = L.divIcon({
          className: 'aqi-marker-wrapper',
          html: `
            <div class="aqi-marker-badge" style="background-color: ${details.color}; color: ${details.textColor}; border-color: ${details.borderColor}; box-shadow: 0 2px 10px ${details.color}40;">
              <span>${station.aqi}</span>
            </div>
          `,
          iconSize: [44, 28],
          iconAnchor: [22, 28],
          popupAnchor: [0, -28],
        });

        const marker = L.marker([station.lat, station.lng], {
          icon,
          stationData: station,
        } as any);

        marker.on('click', () => {
          onSelectStation(station);
        });

        markersMapRef.current.set(station.id, marker);
        markerClusterGroup.addLayer(marker);
      });

      markerClusterGroupRef.current = markerClusterGroup;
      map.addLayer(markerClusterGroup);
    }
  }, [stations, currentView, searchQuery, selectedSeverity, onSelectStation]);

  // Handle fly-to when selectedStation changes
  useEffect(() => {
    if (!selectedStation || !mapRef.current) return;

    mapRef.current.flyTo([selectedStation.lat, selectedStation.lng], 13, {
      duration: 1.4,
      easeLinearity: 0.25,
    });
  }, [selectedStation]);

  // Handle View Reset
  const handleResetView = useCallback(() => {
    if (!mapRef.current) return;
    if (currentView === 'global') {
      mapRef.current.flyTo([25.0, 20.0], 2.5, { duration: 1.2 });
    } else {
      mapRef.current.flyTo([22.5, 79.5], 5, { duration: 1.2 });
    }
  }, [currentView]);

  // Handle Zoom In / Zoom Out
  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();

  const selectedDetails = selectedStation ? getAQIDetails(selectedStation.aqi) : null;

  return (
    <div className="glass-panel map-card">
      {/* Loading overlay during initial map creation */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <div className="loading-text">
            Initializing satellite & telemetry basemap...
            <small>Streaming real-time air telemetry</small>
          </div>
        </div>
      )}

      {/* Map floating header & controls */}
      <div className="map-toolbar">
        {/* Basemap Switcher */}
        <div className="basemap-switcher">
          <button 
            className={`basemap-btn ${basemap === 'dark' ? 'active' : ''}`}
            onClick={() => setBasemap('dark')}
            title="High contrast Dark Canvas (no watermark)"
          >
            <Layers size={13} /> Dark Canvas
          </button>
          <button 
            className={`basemap-btn ${basemap === 'satellite' ? 'active' : ''}`}
            onClick={() => setBasemap('satellite')}
            title="High resolution Satellite Imagery"
          >
            Satellite
          </button>
          <button 
            className={`basemap-btn ${basemap === 'streets' ? 'active' : ''}`}
            onClick={() => setBasemap('streets')}
            title="OpenStreetMap Street View"
          >
            Streets
          </button>
        </div>

        {/* View Indicator Tag */}
        <div className="view-indicator-pill">
          <span className="pulsing-green-dot"></span>
          <span>{currentView === 'global' ? 'Global Hubs' : currentView === 'heatmap' ? 'AQI Heatmap' : 'India Telemetry'}</span>
        </div>
      </div>

      {/* Floating Map Navigation Controls */}
      <div className="map-nav-controls">
        <button className="nav-control-btn" onClick={handleResetView} title="Center Map View">
          <Compass size={17} />
        </button>
        <button className="nav-control-btn" onClick={handleZoomIn} title="Zoom In">
          <ZoomIn size={17} />
        </button>
        <button className="nav-control-btn" onClick={handleZoomOut} title="Zoom Out">
          <ZoomOut size={17} />
        </button>
      </div>

      {/* Interactive Floating Station Detail Drawer/Card */}
      {selectedStation && selectedDetails && (
        <div className="station-detail-card">
          <div className="station-card-header">
            <div>
              <div className="station-badge-row">
                <span className="station-city-tag">{selectedStation.city}</span>
                <span className="station-state-tag">{selectedStation.state}</span>
              </div>
              <h3 className="station-title">{selectedStation.locationName}</h3>
            </div>
            <button 
              className="station-close-btn" 
              onClick={() => onSelectStation(null)}
              title="Close details"
            >
              <X size={16} />
            </button>
          </div>

          <div className="station-aqi-banner" style={{ backgroundColor: `${selectedDetails.color}15`, borderColor: selectedDetails.color }}>
            <div className="aqi-huge-score" style={{ color: selectedDetails.color }}>
              {selectedStation.aqi}
            </div>
            <div className="aqi-verdict">
              <span className="aqi-status-chip" style={{ backgroundColor: selectedDetails.color, color: selectedDetails.textColor }}>
                {selectedDetails.status}
              </span>
              <span className="aqi-scale-label">Air Quality Index</span>
            </div>
          </div>

          {/* Micro Pollutants Grid */}
          <div className="pollutants-grid">
            <div className="pollutant-item">
              <span className="pollutant-name"><Activity size={12} /> PM2.5</span>
              <span className="pollutant-value">{selectedStation.pm25 ?? Math.round(selectedStation.aqi * 0.62)} µg/m³</span>
            </div>
            <div className="pollutant-item">
              <span className="pollutant-name"><Wind size={12} /> PM10</span>
              <span className="pollutant-value">{selectedStation.pm10 ?? Math.round(selectedStation.aqi * 1.15)} µg/m³</span>
            </div>
            <div className="pollutant-item">
              <span className="pollutant-name"><Thermometer size={12} /> Temp</span>
              <span className="pollutant-value">{selectedStation.temperature ?? 28}°C</span>
            </div>
            <div className="pollutant-item">
              <span className="pollutant-name"><Droplets size={12} /> Humidity</span>
              <span className="pollutant-value">{selectedStation.humidity ?? 55}%</span>
            </div>
          </div>

          {/* Health Advisory */}
          <div className="health-advisory-box">
            <div className="advisory-title"><AlertTriangle size={13} /> Health Guidance</div>
            <p className="advisory-text">{selectedDetails.advisory}</p>
          </div>
        </div>
      )}

      {/* Main Leaflet Map DOM Container */}
      <div ref={mapContainerRef} className="map-wrapper" id="map" />
    </div>
  );
};
export default MapDashboard;
