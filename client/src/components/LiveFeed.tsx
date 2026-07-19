import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAQIDetails } from '../utils/aqi';

interface FeedItem {
  time: string;
  message: string;
  aqi: number;
}

interface LiveFeedProps {
  feed: FeedItem[];
}

export const LiveFeed: React.FC<LiveFeedProps> = ({ feed }) => {
  return (
    <div className="feed-container">
      <AnimatePresence initial={false}>
        {feed.slice(0, 10).map((item, index) => {
          const details = getAQIDetails(item.aqi);
          return (
            <motion.div
              key={`${item.time}-${index}-${item.message.substring(0, 10)}`}
              className="feed-item"
              style={{ borderLeftColor: details.color }}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <div className="feed-time">{item.time}</div>
              <div className="feed-content">{item.message}</div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
export default LiveFeed;
