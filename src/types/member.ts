export type TrainingArt = "BJJ" | "Wrestling" | "Submission Grappling";

export interface Member {
  id: string;
  username: string;
  profilePhoto?: string;
  email: string;
  dateOfBirth: string;
  trainingStartDate: string;
  trainingArts: TrainingArt[];
  bio?: string;
  weight: {
    value: number;
    unit: "kg" | "lbs";
  };
  height: {
    value: number;
    unit: "cm" | "ft";
  };
  privacySettings: {
    profileVisibility: boolean;
    metricsVisibility: boolean;
    ageVisibility: boolean;
    weightVisibility: boolean;
    heightVisibility: boolean;
    connectionsVisibility: boolean;
  };
  status: "active" | "inactive" | "suspended";
  isOnline: boolean;
  lastActive: string;
}

export interface Connection {
  id: string;
  userId: string;
  targetUserId: string;
  username: string;
  profilePhoto?: string;
  connectionType: "following" | "blocked";
  isOnline?: boolean;
  lastActive?: string;
}

export interface Chat {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: "follow" | "message" | "system";
  title: string;
  message: string;
  isRead: boolean;
  relatedUserId?: string;
  relatedChatId?: string;
  createdAt: string;
}

export interface TrainingSession {
  id: string;
  userId: string;
  sessionType: "class" | "open_mat" | "private";
  trainingArt: TrainingArt;
  durationMinutes: number;
  notes?: string;
  intensity: 1 | 2 | 3 | 4 | 5;
  techniquesPracticed?: string[];
  partners?: string[];
  location?: string;
  createdAt: string;
}

export interface Metrics {
  id: string;
  userId: string;
  metricType: "weight" | "height" | "attendance" | "technique_progress";
  value: number;
  unit?: string;
  notes?: string;
  recordedAt: string;
  createdAt: string;
}

export interface Technique {
  id: string;
  name: string;
  category: "takedown" | "submission" | "position" | "escape" | "other";
  trainingArt: TrainingArt;
  description?: string;
  videoUrl?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  prerequisites?: string[];
  relatedTechniques?: string[];
  createdAt: string;
}

export interface UserTechnique {
  id: string;
  userId: string;
  techniqueId: string;
  proficiency: 1 | 2 | 3 | 4 | 5;
  timesPracticed: number;
  notes?: string;
  lastPracticed: string;
  createdAt: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementType:
    | "belt_promotion"
    | "competition"
    | "attendance"
    | "technique_mastery";
  title: string;
  description?: string;
  awardedAt: string;
  createdAt: string;
}

// Helper function to validate training arts
export const validateTrainingArts = (arts: unknown): TrainingArt[] => {
  if (!Array.isArray(arts)) {
    return [];
  }

  const validArts: TrainingArt[] = [];
  const validArtSet = new Set<string>([
    "BJJ",
    "Wrestling",
    "Submission Grappling",
  ]);

  for (const art of arts) {
    if (typeof art === "string" && validArtSet.has(art)) {
      validArts.push(art as TrainingArt);
    }
  }

  return validArts;
};

// Helper function to get connection type display text
export const getConnectionTypeDisplay = (
  type: Connection["connectionType"]
): string => {
  switch (type) {
    case "following":
      return "Following";
    case "blocked":
      return "Blocked";
    default:
      return "Unknown";
  }
};

// Helper function to check if a connection type is valid
export const isValidConnectionType = (
  type: string
): type is Connection["connectionType"] => {
  return type === "following" || type === "blocked";
};
