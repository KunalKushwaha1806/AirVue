import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAQIDetails } from '../utils/aqi';
import type { FeedItem, Station } from '../types/station';
import { ArrowRight } from 'lucide-react';

interface LiveFeedProps {
  feed: FeedItem[];
  stations?: Station[];
  onSelectStation?: (station: Station) => void;
}

export const LiveFeed: React.FC<LiveFeedProps> = ({ 
  feed, 
  stations = [], 
  onSelectStation 
}) => {
  const handleItemClick = (item: FeedItem) => {
    if (!onSelectStation || stations.length === 0) return;
    
    // Find station by stationId or by matching city/name
    let target = item.stationId !== undefined ? stations.find(s => s.id === item.stationId) : null;
    if (!target && item.city) {
      target = stations.find(s => s.city.toLowerCase() === item.city!.toLowerCase()) || null;
    }
    if (target) {
      onSelectStation(target);
    }
  };

  return (
    <div className="feed-container">
      <AnimatePresence initial={false}>
        {feed.slice(0, 10).map((item, index) => {
          const details = getAQIDetails(item.aqi);
          return (
            <motion.div
              key={`${item.time}-${index}-${item.message.substring(0, 15)}`}
              className="feed-item"
              style={{ borderLeftColor: details.color }}
              onClick={() => handleItemClick(item)}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <div className="feed-header-row">
                <div className="feed-time">
                  <span className="live-dot" style={{ backgroundColor: details.color }}></span>
                  {item.time}
                </div>
                <span 
                  className="feed-aqi-tag"
                  style={{ backgroundColor: `${details.color}20`, color: details.color }}
                >
                  AQI {item.aqi}
                </span>
              </div>
              <div className="feed-content-row">
                <span className="feed-content">{item.message}</span>
                <ArrowRight size={13} className="feed-arrow" />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
export default LiveFeed;
