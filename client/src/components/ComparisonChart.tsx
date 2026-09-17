import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { Station } from '../types/station';
import { getAQIDetails } from '../utils/aqi';
import { BarChart3, ListOrdered, ArrowUpRight } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ComparisonChartProps {
  topStations: Station[];
  onSelectStation?: (station: Station) => void;
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ 
  topStations,
  onSelectStation 
}) => {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

  const chartData = {
    labels: topStations.map((s) => s.city ? `${s.locationName}` : s.fullName),
    datasets: [
      {
        label: 'AQI Level',
        data: topStations.map((s) => s.aqi),
        backgroundColor: topStations.map((s) => getAQIDetails(s.aqi).color),
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: '#ffffff',
      },
    ],
  };

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (_event, elements) => {
      if (elements.length > 0 && onSelectStation) {
        const index = elements[0].index;
        const station = topStations[index];
        if (station) {
          onSelectStation(station);
        }
      }
    },
    animation: {
      duration: 500,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 12,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          afterLabel: () => '👉 Click to locate on map'
        }
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'rgba(248, 250, 252, 0.7)',
          font: {
            size: 11,
            family: "'Inter', sans-serif",
          },
          maxRotation: 35,
          minRotation: 0,
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        max: 500,
        ticks: {
          color: 'rgba(248, 250, 252, 0.7)',
          font: {
            size: 11,
            family: "'Inter', sans-serif",
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.06)',
        },
      },
    },
  };

  return (
    <div className="comparison-container">
      <div className="comparison-header">
        <div className="comparison-subtitle">
          Real-time rank of highest air pollution monitoring stations — click any station to jump to its coordinates
        </div>
        <div className="view-toggle-buttons">
          <button 
            className={`toggle-btn ${viewMode === 'chart' ? 'active' : ''}`}
            onClick={() => setViewMode('chart')}
            title="Bar Chart View"
          >
            <BarChart3 size={14} /> Chart
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
            title="Ranked Leaderboard View"
          >
            <ListOrdered size={14} /> Leaderboard
          </button>
        </div>
      </div>

      {viewMode === 'chart' ? (
        <div className="chart-wrapper">
          <Bar data={chartData} options={chartOptions} />
        </div>
      ) : (
        <div className="leaderboard-grid">
          {topStations.map((station, idx) => {
            const details = getAQIDetails(station.aqi);
            return (
              <div 
                key={station.id} 
                className="leaderboard-item"
                onClick={() => onSelectStation && onSelectStation(station)}
              >
                <div className="rank-badge">#{idx + 1}</div>
                <div className="leaderboard-info">
                  <div className="leaderboard-title">{station.locationName}</div>
                  <div className="leaderboard-location">{station.city}, {station.state}</div>
                </div>
                <div className="leaderboard-right">
                  <div 
                    className="leaderboard-aqi-pill"
                    style={{ backgroundColor: details.color, color: details.textColor }}
                  >
                    AQI {station.aqi}
                  </div>
                  <ArrowUpRight size={14} className="leaderboard-arrow" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default ComparisonChart;
