import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Radio, Activity } from 'lucide-react';
import type { Stats } from '../types/station';
import { getAQIDetails } from '../utils/aqi';

interface StatisticsGridProps {
  stats: Stats;
}

export const StatisticsGrid: React.FC<StatisticsGridProps> = ({ stats }) => {
  const avgDetails = getAQIDetails(stats.avgAQI);
  const safePercent = stats.safePercent !== undefined 
    ? stats.safePercent 
    : (stats.totalStations > 0 ? Math.round((stats.goodAir / stats.totalStations) * 100) : 0);

  const statItems = [
    {
      label: 'Active Sensors',
      value: stats.totalStations.toLocaleString(),
      subtext: '3,800+ Grid Telemetry',
      icon: <Radio className="w-5 h-5 text-blue-400" />,
      glowColor: 'rgba(59, 130, 246, 0.15)',
      borderColor: 'rgba(59, 130, 246, 0.25)',
    },
    {
      label: 'Mean AQI Index',
      value: stats.avgAQI,
      subtext: avgDetails.status,
      icon: <Activity className="w-5 h-5" style={{ color: avgDetails.color }} />,
      glowColor: `${avgDetails.color}20`,
      borderColor: `${avgDetails.color}40`,
      highlightColor: avgDetails.color,
    },
    {
      label: 'Safe Air Zone',
      value: `${safePercent}%`,
      subtext: `${stats.goodAir.toLocaleString()} Good Stations`,
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      glowColor: 'rgba(16, 185, 129, 0.15)',
      borderColor: 'rgba(16, 185, 129, 0.25)',
      highlightColor: '#10b981',
    },
    {
      label: 'Hazardous Alerts',
      value: stats.hazardousAir.toLocaleString(),
      subtext: 'Exceeding AQI 300',
      icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
      glowColor: 'rgba(239, 68, 68, 0.15)',
      borderColor: 'rgba(239, 68, 68, 0.25)',
      highlightColor: '#ef4444',
    },
  ];

  return (
    <div className="stats-grid">
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          className="stat-card"
          style={{
            borderColor: item.borderColor,
            background: `radial-gradient(circle at top, ${item.glowColor} 0%, rgba(15, 23, 42, 0.4) 100%)`,
          }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <div className="stat-card-top">
            <span className="stat-icon-wrapper">{item.icon}</span>
            <span className="stat-label">{item.label}</span>
          </div>
          <motion.div 
            className="stat-number"
            style={{ color: item.highlightColor || '#f8fafc' }}
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 0.3 }}
            key={item.value}
          >
            {item.value}
          </motion.div>
          <div className="stat-subtext">{item.subtext}</div>
        </motion.div>
      ))}
    </div>
  );
};
export default StatisticsGrid;
