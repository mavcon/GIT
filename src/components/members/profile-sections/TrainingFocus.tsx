import React from "react";
import { TrainingArt } from "../../../types/member";
import { formatTrainingDuration } from "../../../utils/dateUtils";
import { useTheme } from "../../../context/ThemeContext";

interface TrainingFocusProps {
  trainingArts: TrainingArt[];
  trainingStartDate: string;
  onTrainingArtsChange?: (arts: TrainingArt[]) => void;
}

const TrainingFocus: React.FC<TrainingFocusProps> = ({
  trainingArts,
  trainingStartDate,
  onTrainingArtsChange,
}) => {
  const { theme, currentTheme } = useTheme();
  const isDark =
    theme === "dark" || (theme === "system" && currentTheme === "dark");

  const getArtIcon = (art: TrainingArt) => {
    switch (art) {
      case "BJJ":
        return "🥋"; // Gi icon
      case "Submission Grappling":
        return "🤼"; // Wrestling icon for grappling
      case "Wrestling":
        return "🎭"; // Luchador mask icon
      default:
        return "🥋";
    }
  };

  const getArtStyle = (art: TrainingArt) => {
    switch (art) {
      case "BJJ":
        return "bg-primary/10 text-primary border-primary/20";
      case "Submission Grappling":
        return "bg-secondary/10 text-secondary border-secondary/20";
      case "Wrestling":
        return "bg-accent/10 text-accent border-accent/20";
      default:
        return "bg-base-content/10 text-base-content border-base-content/20";
    }
  };

  const handleArtToggle = (art: TrainingArt) => {
    if (!onTrainingArtsChange) return;

    const newArts = trainingArts.includes(art)
      ? trainingArts.filter((a) => a !== art)
      : [...trainingArts, art];

    onTrainingArtsChange(newArts);
  };

  const allArts: TrainingArt[] = ["BJJ", "Submission Grappling", "Wrestling"];
  const duration = formatTrainingDuration(trainingStartDate);
  const years = parseFloat(duration.split(" ")[0]);
  const timeUnit = years >= 1 ? "years" : "months";
  const timeValue = years >= 1 ? years : years * 12;

  // If in edit mode, show all arts for selection
  const artsToDisplay = onTrainingArtsChange ? allArts : trainingArts;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4 text-base-content">
        Training Focus
      </h3>
      <div className="grid grid-cols-3 gap-4">
        {artsToDisplay.map((art) => {
          const isActive = trainingArts.includes(art);
          return (
            <button
              key={art}
              onClick={() => onTrainingArtsChange && handleArtToggle(art)}
              className={`flex flex-col items-center p-4 rounded-lg border ${getArtStyle(
                art
              )} ${
                isActive
                  ? `ring-1 ring-offset-1 ${
                      isDark ? "ring-base-content/20" : "ring-base-content/50"
                    }`
                  : ""
              } ${
                onTrainingArtsChange
                  ? "cursor-pointer hover:opacity-80"
                  : "cursor-default"
              } transition-all duration-200`}
              disabled={!onTrainingArtsChange}
            >
              <span className="text-2xl mb-2">{getArtIcon(art)}</span>
              <span className="text-lg font-semibold mb-1">
                {art === "BJJ"
                  ? "BJJ (gi)"
                  : art === "Submission Grappling"
                  ? "Grappling"
                  : art}
              </span>
              <div className="text-center">
                <span className="text-xl font-bold">
                  {Math.floor(timeValue)}
                </span>
                <span className="text-sm block opacity-70">{timeUnit}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TrainingFocus;
