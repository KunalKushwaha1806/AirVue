import React, { useState, useRef, useEffect } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import type { Station } from '../types/station';
import { getAQIDetails } from '../utils/aqi';

interface SearchFilterProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedSeverity: string;
  setSelectedSeverity: (s: string) => void;
  stations: Station[];
  onSelectStation: (station: Station) => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchQuery,
  setSearchQuery,
  selectedSeverity,
  setSelectedSeverity,
  stations,
  onSelectStation,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Compute severity counts
  const severityCounts = React.useMemo(() => {
    const counts: { [key: string]: number } = {
      all: stations.length,
      good: 0,
      moderate: 0,
      'unhealthy for sensitive': 0,
      unhealthy: 0,
      'very unhealthy': 0,
      hazardous: 0,
    };

    stations.forEach((s) => {
      const details = getAQIDetails(s.aqi);
      const key = details.status.toLowerCase();
      if (counts[key] !== undefined) {
        counts[key]++;
      }
    });

    return counts;
  }, [stations]);

  // Compute autocomplete matches (up to 7 high-relevance matches)
  const matchingStations = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || q.length < 2) return [];

    return stations
      .filter((s) => 
        s.locationName.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q)
      )
      .slice(0, 7);
  }, [stations, searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const severities = [
    { value: 'all', label: 'All', count: severityCounts.all },
    { value: 'good', label: 'Good', count: severityCounts.good },
    { value: 'moderate', label: 'Moderate', count: severityCounts.moderate },
    { value: 'unhealthy for sensitive', label: 'Sensitive', count: severityCounts['unhealthy for sensitive'] },
    { value: 'unhealthy', label: 'Unhealthy', count: severityCounts.unhealthy },
    { value: 'very unhealthy', label: 'Very Unhealthy', count: severityCounts['very unhealthy'] },
    { value: 'hazardous', label: 'Hazardous', count: severityCounts.hazardous },
  ];

  const handleSelectMatch = (station: Station) => {
    setSearchQuery(station.city);
    setShowDropdown(false);
    onSelectStation(station);
  };

  const handleClear = () => {
    setSearchQuery('');
    setShowDropdown(false);
  };

  return (
    <div className="search-filter-container" ref={dropdownRef}>
      {/* Search Input with autocomplete dropdown */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search city, district, or station..."
            value={searchQuery}
            onFocus={() => setShowDropdown(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
          />
          {searchQuery && (
            <button 
              className="search-clear-btn" 
              onClick={handleClear}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Autocomplete Dropdown */}
        {showDropdown && matchingStations.length > 0 && (
          <div className="autocomplete-dropdown">
            <div className="dropdown-header">Matching Monitoring Hubs</div>
            {matchingStations.map((station) => {
              const details = getAQIDetails(station.aqi);
              return (
                <div
                  key={station.id}
                  className="dropdown-item"
                  onClick={() => handleSelectMatch(station)}
                >
                  <div className="dropdown-item-left">
                    <MapPin size={14} className="dropdown-pin-icon" />
                    <div>
                      <div className="dropdown-station-name">{station.locationName}</div>
                      <div className="dropdown-city-name">{station.city}, {station.state}</div>
                    </div>
                  </div>
                  <div 
                    className="dropdown-aqi-pill"
                    style={{ backgroundColor: details.color, color: details.textColor }}
                  >
                    AQI {station.aqi}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Severity Filter Chips */}
      <div className="severity-chips-container">
        {severities.map((sev) => (
          <button
            key={sev.value}
            className={`severity-chip ${selectedSeverity === sev.value ? 'active' : ''}`}
            onClick={() => setSelectedSeverity(sev.value)}
          >
            <span className="chip-label">{sev.label}</span>
            <span className="chip-count">{sev.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
export default SearchFilter;
