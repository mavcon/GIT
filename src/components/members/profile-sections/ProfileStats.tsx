import React from "react";
import { Member } from "../../../types/member";

interface ProfileStatsProps {
  member: Member;
  calculateAge: (dob: string) => number;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({
  member,
  calculateAge,
}) => {
  const visibleStats = [
    member.privacySettings.ageVisibility && {
      value: `${calculateAge(member.dateOfBirth)}y`,
    },
    member.privacySettings.weightVisibility && {
      value: `${member.weight.value}${member.weight.unit}`,
    },
    member.privacySettings.heightVisibility && {
      value: `${member.height.value}${member.height.unit}`,
    },
  ].filter(Boolean);

  if (visibleStats.length === 0) return null;

  return (
    <div className="text-sm text-base-content/60 flex gap-3">
      {visibleStats.map(
        (stat, index) =>
          stat && (
            <React.Fragment key={index}>
              {index > 0 && <span>•</span>}
              <span>{stat.value}</span>
            </React.Fragment>
          )
      )}
    </div>
  );
};

export default ProfileStats;
