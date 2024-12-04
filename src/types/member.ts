export type TrainingArt = "BJJ" | "Wrestling" | "Submission Grappling";

export type MembershipStatus = "free" | "paid";
export type AccountStatus = "active" | "suspended" | "banned";

export interface Member {
  id: string;
  username: string;
  profilePhoto: string | null;
  email: string;
  dateOfBirth: string;
  trainingStartDate: string;
  trainingArts: TrainingArt[];
  bio: string;
  gender: "male" | "female";
  weight: {
    value: number;
    unit: "kg" | "lbs";
  };
  height: {
    value: number;
    unit: "cm" | "ft";
  };
  privacySettings: {
    ageVisibility: boolean;
    weightVisibility: boolean;
    heightVisibility: boolean;
    connectionsVisibility: boolean;
  };
  membershipStatus: MembershipStatus;
  accountStatus: AccountStatus;
  isOnline: boolean;
  lastActive: string;
}

export type ConnectionType = "following" | "blocked";

export interface Connection {
  id: string;
  userId: string;
  targetUserId: string;
  username: string;
  profilePhoto: string | null;
  connectionType: ConnectionType;
  isOnline: boolean;
  lastActive: string;
}
