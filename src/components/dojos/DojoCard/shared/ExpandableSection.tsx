import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExpandableSectionProps {
  title: string;
  summary: string | React.ReactNode;
  children: React.ReactNode;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  summary,
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-4">
      <button 
        className="flex justify-between items-center w-full hover:bg-base-200 p-2 rounded-lg transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
      >
        <span className="font-semibold">{title}</span>
        <div className="flex items-center">
          <span className="text-sm mr-2">{summary}</span>
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
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpandableSection;
