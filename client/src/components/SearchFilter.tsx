import React from 'react';
import { Search } from 'lucide-react';

interface SearchFilterProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedSeverity: string;
  setSelectedSeverity: (s: string) => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchQuery,
  setSearchQuery,
  selectedSeverity,
  setSelectedSeverity,
}) => {
  const severities = [
    { value: 'all', label: 'All AQI' },
    { value: 'good', label: 'Good' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'unhealthy for sensitive', label: 'Sensitive' },
    { value: 'unhealthy', label: 'Unhealthy' },
    { value: 'very unhealthy', label: 'Very Unhealthy' },
    { value: 'hazardous', label: 'Hazardous' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
      {/* Search Input */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <Search />
          <input
            type="text"
            className="search-input"
            placeholder="Search by city or monitoring area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Severity Filter Pills */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {severities.map((sev) => (
          <button
            key={sev.value}
            className={`btn ${selectedSeverity === sev.value ? 'active' : ''}`}
            onClick={() => setSelectedSeverity(sev.value)}
            style={{ 
              fontSize: '0.75rem', 
              padding: '6px 14px', 
              borderRadius: '9999px',
              textTransform: 'capitalize' 
            }}
          >
            {sev.label}
          </button>
        ))}
      </div>
    </div>
  );
};
export default SearchFilter;
