import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Radio, Activity } from 'lucide-react';

interface Stats {
  totalStations: number;
  avgAQI: number;
  goodAir: number;
  hazardousAir: number;
}

interface StatisticsGridProps {
  stats: Stats;
}

export const StatisticsGrid: React.FC<StatisticsGridProps> = ({ stats }) => {
  const statItems = [
    {
      label: 'Monitoring Stations',
      value: stats.totalStations,
      icon: <Radio className="w-5 h-5 text-blue-400" />,
      colorClass: 'text-blue-400',
    },
    {
      label: 'Average AQI',
      value: stats.avgAQI,
      icon: <Activity className="w-5 h-5 text-indigo-400" />,
      colorClass: 'text-indigo-400',
    },
    {
      label: 'Good Air Stations',
      value: stats.goodAir,
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      colorClass: 'text-emerald-400',
    },
    {
      label: 'Hazardous Stations',
      value: stats.hazardousAir,
      icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
      colorClass: 'text-rose-400',
    },
  ];

  return (
    <div className="stats-grid">
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          className="stat-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
            {item.icon}
          </div>
          <motion.div 
            className="stat-number"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.3 }}
            key={item.value}
          >
            {item.value.toLocaleString()}
          </motion.div>
          <div className="stat-label">{item.label}</div>
        </motion.div>
      ))}
    </div>
  );
};
export default StatisticsGrid;
