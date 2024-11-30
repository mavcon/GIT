import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DojoLocation } from '../../../types/dojo';

interface DojoHoursProps {
  dojo: DojoLocation;
}

const DojoHours: React.FC<DojoHoursProps> = ({ dojo }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get current day's operating hours
  const today = new Date().getDay();
  const currentHours = dojo.operatingHours[today === 0 ? 6 : today - 1];

  return (
    <div className="mt-4">
      <button 
        className="flex justify-between items-center w-full hover:bg-base-200 p-2 rounded-lg transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
      >
        <span className="font-semibold">Hours</span>
        <div className="flex items-center">
          <span className="text-sm mr-2">
            {currentHours.openTime} - {currentHours.closeTime}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 space-y-1 p-2 bg-base-200 rounded-lg">
              {dojo.operatingHours.map((hours) => (
                <div key={hours.day} className="flex justify-between text-sm">
                  <span className="font-medium">{hours.day}</span>
                  <span>{hours.openTime} - {hours.closeTime}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DojoHours;
