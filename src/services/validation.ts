import { Connection, Member } from "../types/member";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export const ConnectionPolicies = {
  // Prevent self-connections
  canConnect: (userId: string, targetUserId: string): boolean => {
    if (userId === targetUserId) {
      throw new ValidationError("Cannot create connection with yourself");
    }
    return true;
  },

  // Prevent duplicate connections
  isDuplicateConnection: (
    connections: Connection[],
    userId: string,
    targetUserId: string,
    connectionType: Connection["connectionType"]
  ): boolean => {
    return connections.some(
      (conn) =>
        conn.userId === userId &&
        conn.targetUserId === targetUserId &&
        conn.connectionType === connectionType
    );
  },

  // Check if users can interact (not blocked)
  canInteract: (
    connections: Connection[],
    userId: string,
    targetUserId: string
  ): boolean => {
    const isBlocked = connections.some(
      (conn) =>
        ((conn.userId === userId && conn.targetUserId === targetUserId) ||
          (conn.userId === targetUserId && conn.targetUserId === userId)) &&
        conn.connectionType === "blocked"
    );
    if (isBlocked) {
      throw new ValidationError("Cannot interact with blocked user");
    }
    return true;
  },

  // Validate connection creation
  validateConnection: (
    connections: Connection[],
    userId: string,
    targetUserId: string,
    connectionType: Connection["connectionType"]
  ): boolean => {
    // Check self-connection
    ConnectionPolicies.canConnect(userId, targetUserId);

    // Check for duplicates
    if (
      ConnectionPolicies.isDuplicateConnection(
        connections,
        userId,
        targetUserId,
        connectionType
      )
    ) {
      throw new ValidationError("Connection already exists");
    }

    // For following connections, check if users can interact
    if (connectionType === "following") {
      ConnectionPolicies.canInteract(connections, userId, targetUserId);
    }

    return true;
  },
};

export const MemberPolicies = {
  // Validate member data
  validateMember: (member: Member): boolean => {
    if (!member.username.trim()) {
      throw new ValidationError("Username is required");
    }

    if (!member.email.includes("@")) {
      throw new ValidationError("Invalid email format");
    }

    if (member.weight.value <= 0) {
      throw new ValidationError("Weight must be greater than 0");
    }

    if (member.height.value <= 0) {
      throw new ValidationError("Height must be greater than 0");
    }

    return true;
  },

  // Validate privacy settings
  validatePrivacySettings: (member: Member): boolean => {
    type PrivacyKey = keyof Member["privacySettings"];
    const requiredSettings: PrivacyKey[] = [
      "profileVisibility",
      "metricsVisibility",
      "ageVisibility",
      "weightVisibility",
      "heightVisibility",
      "connectionsVisibility",
    ];

    for (const setting of requiredSettings) {
      if (typeof member.privacySettings[setting] !== "boolean") {
        throw new ValidationError(`Invalid privacy setting: ${setting}`);
      }
    }

    return true;
  },

  // Validate training arts
  validateTrainingArts: (member: Member): boolean => {
    const validArts = ["BJJ", "Wrestling", "Submission Grappling"] as const;

    for (const art of member.trainingArts) {
      if (!validArts.includes(art)) {
        throw new ValidationError(`Invalid training art: ${art}`);
      }
    }

    return true;
  },
};

export const ChatPolicies = {
  // Validate if users can chat
  canChat: (
    connections: Connection[],
    userId: string,
    targetUserId: string
  ): boolean => {
    // Users must be able to interact (not blocked)
    ConnectionPolicies.canInteract(connections, userId, targetUserId);

    // Cannot chat with self
    ConnectionPolicies.canConnect(userId, targetUserId);

    return true;
  },
};
