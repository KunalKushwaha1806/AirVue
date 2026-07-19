import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.heat';
import { getAQIDetails } from '../utils/aqi';

interface Station {
  id: number;
  city: string;
  locationName: string;
  country: string;
  lat: number;
  lng: number;
  aqi: number;
}

interface MapDashboardProps {
  stations: Station[];
  currentView: 'global' | 'heatmap';
  searchQuery: string;
  selectedSeverity: string;
}

export const MapDashboard: React.FC<MapDashboardProps> = ({
  stations,
  currentView,
  searchQuery,
  selectedSeverity,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerClusterGroupRef = useRef<any>(null);
  const heatmapLayerRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create map instance
    const mapInstance = L.map(mapContainerRef.current, {
      center: [22.5, 82.0],
      zoom: 5,
      zoomControl: true,
      fadeAnimation: true,
    });

    mapRef.current = mapInstance;

    // Add Dark tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors © CARTO',
      subdomains: 'abcd',
      minZoom: 2,
      maxZoom: 18,
    }).addTo(mapInstance);

    setLoading(false);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

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

    // Filter stations
    const filteredStations = stations.filter((station) => {
      const matchesSearch =
        station.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.city.toLowerCase().includes(searchQuery.toLowerCase());
      
      const details = getAQIDetails(station.aqi);
      const matchesSeverity = selectedSeverity === 'all' || details.status.toLowerCase() === selectedSeverity.toLowerCase();

      return matchesSearch && matchesSeverity;
    });

    if (currentView === 'global') {
      // Marker Clustering view
      const markerClusterGroup = (L as any).markerClusterGroup({
        chunkedLoading: true,
        maxClusterRadius: 60,
        iconCreateFunction: (cluster: any) => {
          const childCount = cluster.getChildCount();
          let c = ' marker-cluster-';
          if (childCount < 100) {
            c += 'small';
          } else if (childCount < 1000) {
            c += 'medium';
          } else {
            c += 'large';
          }
          return new L.DivIcon({
            html: `<div><span>${childCount}</span></div>`,
            className: `marker-cluster${c}`,
            iconSize: new L.Point(40, 40),
          });
        },
      });

      // Add markers in chunks using requestAnimationFrame for performance
      let i = 0;
      const total = filteredStations.length;
      
      const processChunk = () => {
        if (!mapRef.current || !markerClusterGroup) return;
        const chunkSize = 400;
        const end = Math.min(i + chunkSize, total);

        for (; i < end; i++) {
          const station = filteredStations[i];
          const details = getAQIDetails(station.aqi);
          const icon = L.divIcon({
            className: 'aqi-marker-container',
            html: `<div class="aqi-marker" style="background-color: ${details.color}; color: ${details.textColor}; border-color: ${details.borderColor};">${station.aqi}</div>`,
            iconSize: [42, 30],
            iconAnchor: [21, 30],
            popupAnchor: [0, -30],
          });

          const marker = L.marker([station.lat, station.lng], { icon });

          // Lazy popup builder
          marker.on('click', () => {
            const popupContent = `
              <div class="custom-popup">
                <div class="popup-title">${station.locationName}, ${station.country}</div>
                <div class="popup-aqi" style="color: ${details.color};">AQI: ${station.aqi}</div>
                <div class="popup-status" style="background-color: ${details.color}; color:${details.textColor}">${details.status}</div>
              </div>`;
            marker.bindPopup(popupContent).openPopup();
          });

          markerClusterGroup.addLayer(marker);
        }

        if (i < total) {
          requestAnimationFrame(processChunk);
        }
      };

      if (total > 0) {
        requestAnimationFrame(processChunk);
      }

      markerClusterGroupRef.current = markerClusterGroup;
      map.addLayer(markerClusterGroup);

    } else if (currentView === 'heatmap') {
      // Heatmap view
      const heatData = filteredStations.map((station) => [
        station.lat,
        station.lng,
        station.aqi / 500, // Normalize relative weight (max 500)
      ]) as Array<[number, number, number]>;

      const heatmapLayer = (L as any).heatLayer(heatData, {
        radius: 25,
        blur: 20,
        maxZoom: 12,
        gradient: {
          0.0: '#00e400',
          0.2: '#ffff00',
          0.4: '#ff7e00',
          0.6: '#ff0000',
          0.8: '#8f3f97',
          1.0: '#7e0023',
        },
      }).addTo(map);

      heatmapLayerRef.current = heatmapLayer;
    }
  }, [stations, currentView, searchQuery, selectedSeverity]);

  // Center/Fly to global coordinates on view switch
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo([22.5, 82.0], 5, { duration: 1.2 });
    }
  }, [currentView]);

  return (
    <div className="glass-panel map-card">
      <div style={{ display: 'none' }}>
        {/* Force type definitions loading */}
      </div>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <div className="loading-text">
            Loading interactive air quality maps...
            <small>Establishing layout context</small>
          </div>
        </div>
      )}
      <div ref={mapContainerRef} className="map-wrapper" id="map" />
    </div>
  );
};
export default MapDashboard;
