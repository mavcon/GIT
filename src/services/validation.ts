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

const validateRequiredFields = (member: Partial<Member>): string[] => {
  const errors: string[] = [];
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
  return errors;
};

const validateUsername = (username?: string): string[] => {
  const errors: string[] = [];
  if (!username) return errors;

  if (username.length < MemberPolicies.MIN_USERNAME_LENGTH) {
    errors.push(
      `Username must be at least ${MemberPolicies.MIN_USERNAME_LENGTH} characters long`
    );
  }
  if (username.length > MemberPolicies.MAX_USERNAME_LENGTH) {
    errors.push(
      `Username must be less than ${MemberPolicies.MAX_USERNAME_LENGTH} characters long`
    );
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push("Username can only contain letters, numbers, and underscores");
  }
  return errors;
};

const validateEmail = (email?: string): string[] => {
  const errors: string[] = [];
  if (!email) return errors;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push("Invalid email format");
  }
  return errors;
};

const validateDateOfBirth = (dateOfBirth?: string): string[] => {
  const errors: string[] = [];
  if (!dateOfBirth) return errors;

  const dob = new Date(dateOfBirth);
  if (isNaN(dob.getTime())) {
    errors.push("Invalid date of birth");
    return errors;
  }

  const now = new Date();
  const age = now.getFullYear() - dob.getFullYear();

  if (age < MemberPolicies.MIN_AGE) {
    errors.push(`Must be at least ${MemberPolicies.MIN_AGE} years old`);
  }
  if (age > MemberPolicies.MAX_AGE) {
    errors.push("Invalid age");
  }

  return errors;
};

const validateTrainingStartDate = (trainingStartDate?: string): string[] => {
  const errors: string[] = [];
  if (!trainingStartDate) return errors;

  const startDate = new Date(trainingStartDate);
  if (isNaN(startDate.getTime())) {
    errors.push("Invalid training start date");
    return errors;
  }

  const now = new Date();
  if (startDate > now) {
    errors.push("Training start date cannot be in the future");
  }

  return errors;
};

export const validateTrainingArts = (arts: string[]): TrainingArt[] => {
  const validArts: TrainingArt[] = ["BJJ", "Wrestling", "Submission Grappling"];
  return arts.filter((art): art is TrainingArt =>
    validArts.includes(art as TrainingArt)
  );
};

const validateTrainingArtsArray = (arts?: TrainingArt[]): string[] => {
  const errors: string[] = [];
  if (!arts) return errors;

  const validArts = ["BJJ", "Wrestling", "Submission Grappling"];
  arts.forEach((art) => {
    if (!validArts.includes(art)) {
      errors.push(`Invalid training art: ${art}`);
    }
  });
  return errors;
};

const validateBio = (bio?: string): string[] => {
  const errors: string[] = [];
  if (!bio) return errors;

  if (bio.length < MemberPolicies.MIN_BIO_LENGTH) {
    errors.push(
      `Bio must be at least ${MemberPolicies.MIN_BIO_LENGTH} characters long`
    );
  }
  if (bio.length > MemberPolicies.MAX_BIO_LENGTH) {
    errors.push(
      `Bio must be less than ${MemberPolicies.MAX_BIO_LENGTH} characters long`
    );
  }
  return errors;
};

const validateMeasurement = (
  value: { value: number; unit: string } | undefined,
  type: "weight" | "height"
): string[] => {
  const errors: string[] = [];
  if (!value) return errors;

  if (value.value <= 0) {
    errors.push(`${type} must be greater than 0`);
  }

  const validUnits = type === "weight" ? ["kg", "lbs"] : ["cm", "ft"];
  if (!validUnits.includes(value.unit)) {
    errors.push(`Invalid ${type} unit`);
  }

  return errors;
};

const validatePrivacySettings = (
  settings?: Member["privacySettings"]
): string[] => {
  const errors: string[] = [];
  if (!settings) return errors;

  const requiredSettings = [
    "ageVisibility",
    "weightVisibility",
    "heightVisibility",
    "connectionsVisibility",
  ] as const;

  requiredSettings.forEach((setting) => {
    if (typeof settings[setting] !== "boolean") {
      errors.push(`Invalid ${setting} setting`);
    }
  });

  return errors;
};

export const validateMember = (member: Partial<Member>): string[] => {
  return [
    ...validateRequiredFields(member),
    ...validateUsername(member.username),
    ...validateEmail(member.email),
    ...validateDateOfBirth(member.dateOfBirth),
    ...validateTrainingStartDate(member.trainingStartDate),
    ...validateTrainingArtsArray(member.trainingArts),
    ...validateBio(member.bio),
    ...validateMeasurement(member.weight, "weight"),
    ...validateMeasurement(member.height, "height"),
    ...validatePrivacySettings(member.privacySettings),
  ];
};
