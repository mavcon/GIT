import { Member } from "../types/member";
import { validateTrainingArts } from "../services/validation";
import { dummyMembers } from "../db/dummy-data";

type DBMember = typeof dummyMembers[0];

export const convertDBMemberToMember = (dbMember: DBMember): Member => ({
  id: dbMember.id,
  username: dbMember.username,
  profilePhoto: dbMember.profile_photo || null,
  email: dbMember.email,
  dateOfBirth: dbMember.date_of_birth,
  trainingStartDate: dbMember.training_start_date,
  trainingArts: validateTrainingArts(dbMember.training_arts),
  bio: dbMember.bio,
  gender: dbMember.gender,
  weight: {
    value: dbMember.weight_value,
    unit: dbMember.weight_unit,
  },
  height: {
    value: dbMember.height_value,
    unit: dbMember.height_unit,
  },
  privacySettings: {
    ageVisibility: dbMember.privacy_settings.age_visibility,
    weightVisibility: dbMember.privacy_settings.weight_visibility,
    heightVisibility: dbMember.privacy_settings.height_visibility,
    connectionsVisibility: dbMember.privacy_settings.connections_visibility,
  },
  membershipStatus: dbMember.membership_status,
  accountStatus: dbMember.account_status,
  isOnline: dbMember.is_online,
  lastActive: dbMember.last_active,
});
