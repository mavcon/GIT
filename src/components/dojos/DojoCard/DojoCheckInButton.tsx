import React from 'react';
import { motion } from 'framer-motion';
import { DojoLocation } from '../../../types/dojo';
import DojoIcon from './shared/DojoIcon';

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
    onCheckInOut?.(dojo.id);
  };

  const buttonClass = !dojo.isOpen 
    ? 'btn-disabled' 
    : isCheckedIn 
      ? 'btn-error' 
      : 'btn-success';

  const buttonText = isCheckedIn ? 'Check Out' : 'Check In';
  const iconType = isCheckedIn ? 'checkOut' : 'checkIn';

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
        <DojoIcon type={iconType} />
        <span>{buttonText}</span>
      </motion.div>
    </button>
  );
};

export default DojoCheckInButton;
