import { Member, TrainingArt } from "../types/member";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

const POLICIES = {
  connection: {
    MAX_CONNECTIONS: 1000,
    MIN_USERNAME_LENGTH: 3,
    MAX_USERNAME_LENGTH: 20,
  },
  member: {
    MIN_USERNAME_LENGTH: 3,
    MAX_USERNAME_LENGTH: 20,
    MIN_BIO_LENGTH: 10,
    MAX_BIO_LENGTH: 500,
    MIN_AGE: 13,
    MAX_AGE: 100,
  },
  chat: {
    MAX_MESSAGE_LENGTH: 1000,
    MAX_MESSAGES_PER_DAY: 100,
  },
} as const;

export const { connection: ConnectionPolicies, member: MemberPolicies, chat: ChatPolicies } = POLICIES;

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

type ValidationRule<T> = {
  test: (value: T) => boolean;
  message: string;
};

type Validator<T> = (value: Partial<T>) => ValidationResult;

const createErrorMessage = (field: string, reason: string): string => 
  `${field}: ${reason}`;

const createLengthError = (field: string, type: 'min' | 'max', length: number): string =>
  createErrorMessage(field, `must be ${type === 'min' ? 'at least' : 'less than'} ${length} characters`);

const createValidator = <T>(
  validationFn: (value: Partial<T>) => string[]
): Validator<T> => (value: Partial<T>): ValidationResult => ({
  isValid: validationFn(value).length === 0,
  errors: validationFn(value),
});

const REQUIRED_MEMBER_FIELDS = [
  "username",
  "email",
  "dateOfBirth",
  "trainingStartDate",
  "trainingArts",
  "bio",
  "gender",
] as const;

const validateRequiredFields = (member: Partial<Member>): ValidationResult => ({
  isValid: REQUIRED_MEMBER_FIELDS.every(field => member[field]),
  errors: REQUIRED_MEMBER_FIELDS
    .filter(field => !member[field])
    .map(field => createErrorMessage(field, "is required")),
});

const USERNAME_RULES: ValidationRule<string>[] = [
  {
    test: (username) => username.length >= MemberPolicies.MIN_USERNAME_LENGTH,
    message: createLengthError("Username", "min", MemberPolicies.MIN_USERNAME_LENGTH),
  },
  {
    test: (username) => username.length <= MemberPolicies.MAX_USERNAME_LENGTH,
    message: createLengthError("Username", "max", MemberPolicies.MAX_USERNAME_LENGTH),
  },
  {
    test: (username) => /^[a-zA-Z0-9_]+$/.test(username),
    message: createErrorMessage("Username", "can only contain letters, numbers, and underscores"),
  },
];

const EMAIL_RULES: ValidationRule<string>[] = [
  {
    test: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    message: createErrorMessage("Email", "invalid format"),
  },
];

const validateIdentity = createValidator<Pick<Member, "username" | "email">>(
  (identity) => {
    const errors: string[] = [];

    if (identity.username) {
      USERNAME_RULES
        .filter(rule => !rule.test(identity.username!))
        .forEach(rule => errors.push(rule.message));
    }

    if (identity.email) {
      EMAIL_RULES
        .filter(rule => !rule.test(identity.email!))
        .forEach(rule => errors.push(rule.message));
    }

    return errors;
  }
);

const validateDate = (date: string, field: string): string[] => {
  const parsedDate = new Date(date);
  return isNaN(parsedDate.getTime()) 
    ? [createErrorMessage(field, "invalid date format")]
    : [];
};

const validateAge = (dateOfBirth: string): string[] => {
  const dob = new Date(dateOfBirth);
  const age = new Date().getFullYear() - dob.getFullYear();
  
  if (age < MemberPolicies.MIN_AGE) {
    return [createErrorMessage("Age", `must be at least ${MemberPolicies.MIN_AGE} years`)];
  }
  if (age > MemberPolicies.MAX_AGE) {
    return [createErrorMessage("Age", "exceeds maximum allowed")];
  }
  return [];
};

const validateTrainingStartDate = (date: string): string[] => {
  const startDate = new Date(date);
  return startDate > new Date()
    ? [createErrorMessage("Training start date", "cannot be in the future")]
    : [];
};

const validateDates = createValidator<Pick<Member, "dateOfBirth" | "trainingStartDate">>(
  (dates) => {
    const errors: string[] = [];

    if (dates.dateOfBirth) {
      errors.push(
        ...validateDate(dates.dateOfBirth, "Date of birth"),
        ...validateAge(dates.dateOfBirth)
      );
    }

    if (dates.trainingStartDate) {
      errors.push(
        ...validateDate(dates.trainingStartDate, "Training start date"),
        ...validateTrainingStartDate(dates.trainingStartDate)
      );
    }

    return errors;
  }
);

const VALID_TRAINING_ARTS = ["BJJ", "Wrestling", "Submission Grappling"] as const;

const validateBio = (bio: string): string[] => {
  const errors: string[] = [];
  
  if (bio.length < MemberPolicies.MIN_BIO_LENGTH) {
    errors.push(createLengthError("Bio", "min", MemberPolicies.MIN_BIO_LENGTH));
  }
  if (bio.length > MemberPolicies.MAX_BIO_LENGTH) {
    errors.push(createLengthError("Bio", "max", MemberPolicies.MAX_BIO_LENGTH));
  }
  
  return errors;
};

const validateTrainingArt = (art: string): string[] =>
  VALID_TRAINING_ARTS.includes(art as TrainingArt)
    ? []
    : [createErrorMessage("Training art", `invalid value: ${art}`)];

const validateGender = (gender: string): string[] =>
  ["male", "female"].includes(gender)
    ? []
    : [createErrorMessage("Gender", "must be either 'male' or 'female'")];

const validateProfile = createValidator<Pick<Member, "bio" | "trainingArts" | "gender">>(
  (profile) => {
    const errors: string[] = [];

    if (profile.bio) {
      errors.push(...validateBio(profile.bio));
    }

    if (profile.trainingArts) {
      profile.trainingArts.forEach(art => {
        errors.push(...validateTrainingArt(art));
      });
    }

    if (profile.gender) {
      errors.push(...validateGender(profile.gender));
    }

    return errors;
  }
);

const validateSingleMeasurement = (
  measurement: { value: number; unit: string },
  type: "weight" | "height"
): string[] => {
  const errors: string[] = [];
  const validUnits = type === "weight" ? ["kg", "lbs"] : ["cm", "ft"];

  if (measurement.value <= 0) {
    errors.push(createErrorMessage(type, "must be greater than 0"));
  }

  if (!validUnits.includes(measurement.unit)) {
    errors.push(createErrorMessage(type, `invalid unit: ${measurement.unit}`));
  }

  return errors;
};

const validateMeasurements = createValidator<Pick<Member, "weight" | "height">>(
  (measurements) => {
    const errors: string[] = [];

    if (measurements.weight) {
      errors.push(...validateSingleMeasurement(measurements.weight, "weight"));
    }

    if (measurements.height) {
      errors.push(...validateSingleMeasurement(measurements.height, "height"));
    }

    return errors;
  }
);

const PRIVACY_SETTINGS = [
  "ageVisibility",
  "weightVisibility",
  "heightVisibility",
  "connectionsVisibility",
] as const;

const validatePrivacySettings = createValidator<Member["privacySettings"]>(
  (settings) => {
    if (!settings) return [];

    return PRIVACY_SETTINGS
      .filter(setting => settings[setting] !== undefined && typeof settings[setting] !== "boolean")
      .map(setting => createErrorMessage(setting, "must be a boolean value"));
  }
);

export const validateTrainingArts = (arts: string[]): TrainingArt[] =>
  arts.filter((art): art is TrainingArt =>
    VALID_TRAINING_ARTS.includes(art as TrainingArt)
  );

export const validateMember = (member: Partial<Member>): string[] => {
  const requiredFieldsResult = validateRequiredFields(member);
  if (!requiredFieldsResult.isValid) {
    return requiredFieldsResult.errors;
  }

  return [
    validateIdentity(member),
    validateDates(member),
    validateProfile(member),
    validateMeasurements(member),
    member.privacySettings
      ? validatePrivacySettings(member.privacySettings)
      : { isValid: true, errors: [] },
  ].reduce<string[]>(
    (allErrors, result) => [...allErrors, ...result.errors],
    []
  );
};
