import React from "react";
import { Member } from "../../../types/member";

interface MemberStatusProps {
  member: Member;
}

const MemberStatus: React.FC<MemberStatusProps> = ({ member }) => {
  const getStatusText = () => {
    const membershipText =
      member.membershipStatus === "paid" ? "Paid Member" : "Free Member";
    const statusText =
      member.accountStatus.charAt(0).toUpperCase() +
      member.accountStatus.slice(1);
    return `${membershipText} • ${statusText}${
      member.isOnline ? " • Online" : " • Offline"
    }`;
  };

  return (
    <div className="tooltip" data-tip={getStatusText()}>
      <p className="text-sm text-base-content/60 mt-1">
        {member.membershipStatus === "paid" && (
          <span className="badge badge-primary badge-sm mr-2">PRO</span>
        )}
        <span
          className={`badge badge-sm ${
            member.accountStatus === "active"
              ? "badge-success"
              : member.accountStatus === "suspended"
              ? "badge-warning"
              : "badge-error"
          }`}
        >
          {member.accountStatus}
        </span>
      </p>
    </div>
  );
};

export default MemberStatus;
