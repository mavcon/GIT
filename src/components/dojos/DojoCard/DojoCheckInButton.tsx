import React from 'react';
import { motion } from 'framer-motion';
import { DojoLocation } from '../../../types/dojo';

interface DojoCheckInButtonProps {
  dojo: DojoLocation;
  onCheckInOut?: (dojoId: string) => void;
  isCheckedIn?: boolean;
}

const DojoCheckInButton: React.FC<DojoCheckInButtonProps> = ({ 
  dojo, 
  onCheckInOut, 
  isCheckedIn 
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCheckInOut) {
      onCheckInOut(dojo.id);
    }
  };

  const buttonClass = !dojo.isOpen 
    ? 'btn-disabled' 
    : isCheckedIn 
      ? 'btn-error' 
      : 'btn-success';

  return (
    <button 
      className={`btn mt-6 w-full ${buttonClass}`}
      onClick={handleClick}
      disabled={!dojo.isOpen}
    >
      <motion.div
        initial={false}
        animate={isCheckedIn ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2"
      >
        {isCheckedIn ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>Check Out</span>
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Check In</span>
          </>
        )}
      </motion.div>
    </button>
  );
};

export default DojoCheckInButton;
