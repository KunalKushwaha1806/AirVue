import React from 'react';
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
import { getAQIDetails } from '../utils/aqi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Station {
  id: number;
  city: string;
  locationName: string;
  country: string;
  lat: number;
  lng: number;
  aqi: number;
}

interface ComparisonChartProps {
  topStations: Station[];
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ topStations }) => {
  const data = {
    labels: topStations.map((s) => s.locationName),
    datasets: [
      {
        label: 'AQI Level',
        data: topStations.map((s) => s.aqi),
        backgroundColor: topStations.map((s) => getAQIDetails(s.aqi).color),
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'x' as const,
    animation: {
      duration: 500,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 10,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        displayColors: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'rgba(248, 250, 252, 0.6)',
          font: {
            size: 10,
            family: "'Inter', sans-serif",
          },
          maxRotation: 45,
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
          color: 'rgba(248, 250, 252, 0.6)',
          font: {
            size: 11,
            family: "'Inter', sans-serif",
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
      },
    },
  };

  return (
    <div className="chart-wrapper">
      <Bar data={data} options={options} />
    </div>
  );
};
export default ComparisonChart;
