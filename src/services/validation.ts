import { Member, TrainingArt } from "../types/member";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export const ConnectionPolicies = {
  MAX_CONNECTIONS: 1000,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 20,
};

export const MemberPolicies = {
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 20,
  MIN_BIO_LENGTH: 10,
  MAX_BIO_LENGTH: 500,
  MIN_AGE: 13,
  MAX_AGE: 100,
};

export const ChatPolicies = {
  MAX_MESSAGE_LENGTH: 1000,
  MAX_MESSAGES_PER_DAY: 100,
};

export const validateTrainingArts = (arts: string[]): TrainingArt[] => {
  const validArts: TrainingArt[] = ["BJJ", "Wrestling", "Submission Grappling"];
  return arts.filter((art): art is TrainingArt =>
    validArts.includes(art as TrainingArt)
  );
};

export const validateMember = (member: Partial<Member>): string[] => {
  const errors: string[] = [];

  // Required fields
  const requiredFields = [
    "username",
    "email",
    "dateOfBirth",
    "trainingStartDate",
    "trainingArts",
    "bio",
  ] as const;

  requiredFields.forEach((field) => {
    if (!member[field]) {
      errors.push(`${field} is required`);
    }
  });

  // Username validation
  if (member.username) {
    if (member.username.length < MemberPolicies.MIN_USERNAME_LENGTH) {
      errors.push(
        `Username must be at least ${MemberPolicies.MIN_USERNAME_LENGTH} characters long`
      );
    }
    if (member.username.length > MemberPolicies.MAX_USERNAME_LENGTH) {
      errors.push(
        `Username must be less than ${MemberPolicies.MAX_USERNAME_LENGTH} characters long`
      );
    }
    if (!/^[a-zA-Z0-9_]+$/.test(member.username)) {
      errors.push(
        "Username can only contain letters, numbers, and underscores"
      );
    }
  }

  // Email validation
  if (member.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(member.email)) {
      errors.push("Invalid email format");
    }
  }

  // Date validations
  if (member.dateOfBirth) {
    const dob = new Date(member.dateOfBirth);
    const now = new Date();
    const age = now.getFullYear() - dob.getFullYear();

    if (isNaN(dob.getTime())) {
      errors.push("Invalid date of birth");
    } else if (age < MemberPolicies.MIN_AGE) {
      errors.push(`Must be at least ${MemberPolicies.MIN_AGE} years old`);
    } else if (age > MemberPolicies.MAX_AGE) {
      errors.push("Invalid age");
    }
  }

  if (member.trainingStartDate) {
    const startDate = new Date(member.trainingStartDate);
    const now = new Date();

    if (isNaN(startDate.getTime())) {
      errors.push("Invalid training start date");
    } else if (startDate > now) {
      errors.push("Training start date cannot be in the future");
    }
  }

  // Training arts validation
  if (member.trainingArts) {
    const validArts = ["BJJ", "Wrestling", "Submission Grappling"];
    member.trainingArts.forEach((art) => {
      if (!validArts.includes(art)) {
        errors.push(`Invalid training art: ${art}`);
      }
    });
  }

  // Bio validation
  if (member.bio) {
    if (member.bio.length < MemberPolicies.MIN_BIO_LENGTH) {
      errors.push(
        `Bio must be at least ${MemberPolicies.MIN_BIO_LENGTH} characters long`
      );
    }
    if (member.bio.length > MemberPolicies.MAX_BIO_LENGTH) {
      errors.push(
        `Bio must be less than ${MemberPolicies.MAX_BIO_LENGTH} characters long`
      );
    }
  }

  // Weight validation
  if (member.weight) {
    if (member.weight.value <= 0) {
      errors.push("Weight must be greater than 0");
    }
    if (!["kg", "lbs"].includes(member.weight.unit)) {
      errors.push("Invalid weight unit");
    }
  }

  // Height validation
  if (member.height) {
    if (member.height.value <= 0) {
      errors.push("Height must be greater than 0");
    }
    if (!["cm", "ft"].includes(member.height.unit)) {
      errors.push("Invalid height unit");
    }
  }

  // Privacy settings validation
  if (member.privacySettings) {
    type PrivacyKey = keyof Member["privacySettings"];
    const requiredSettings: PrivacyKey[] = [
      "ageVisibility",
      "weightVisibility",
      "heightVisibility",
      "connectionsVisibility",
    ];

    requiredSettings.forEach((setting) => {
      if (typeof member.privacySettings?.[setting] !== "boolean") {
        errors.push(`Invalid ${setting} setting`);
      }
    });
  }

  return errors;
};
