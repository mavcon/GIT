import React from 'react';

interface TrainingArtsProps {
  arts: string[];
}

const TrainingArts: React.FC<TrainingArtsProps> = ({ arts }) => {
  return (
    <div className="flex items-center gap-2">
      {arts.map((art) => (
        <span
          key={art}
          className="badge badge-sm"
          title={`Trains ${art}`}
        >
          {art === "BJJ"
            ? "BJJ"
            : art === "Submission Grappling"
            ? "Nogi"
            : art === "Wrestling"
            ? "Wrestling"
            : art}
        </span>
      ))}
    </div>
  );
};

export default TrainingArts;
