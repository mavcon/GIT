import { DBMember, DBConnection, DBChat } from "./schema";
import { Member, Connection, TrainingArt } from "../types/member";

export const dummyMembers: DBMember[] = [
  {
    id: "1",
    username: "johndoe",
    email: "john@example.com",
    password_hash: "hashed_password_1",
    profile_photo: "https://i.pravatar.cc/300?img=11",
    date_of_birth: "1990-01-01",
    training_start_date: "2020-06-15",
    training_arts: ["BJJ", "Submission Grappling"],
    bio: "Passionate about BJJ and always learning",
    weight_value: 75,
    weight_unit: "kg",
    height_value: 175,
    height_unit: "cm",
    privacy_settings: {
      profile_visibility: true,
      metrics_visibility: true,
      age_visibility: true,
      weight_visibility: true,
      height_visibility: true,
      connections_visibility: true,
    },
    status: "active",
    is_online: true,
    last_active: new Date().toISOString(),
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: "2",
    username: "sarahsmith",
    email: "sarah@example.com",
    password_hash: "hashed_password_2",
    profile_photo: "https://i.pravatar.cc/300?img=47",
    date_of_birth: "1992-03-15",
    training_start_date: "2019-01-10",
    training_arts: ["BJJ", "Wrestling"],
    bio: "Wrestling background, now focused on BJJ",
    weight_value: 63,
    weight_unit: "kg",
    height_value: 165,
    height_unit: "cm",
    privacy_settings: {
      profile_visibility: true,
      metrics_visibility: true,
      age_visibility: true,
      weight_visibility: true,
      height_visibility: true,
      connections_visibility: true,
    },
    status: "active",
    is_online: true,
    last_active: new Date().toISOString(),
    created_at: "2023-01-02T00:00:00Z",
    updated_at: "2023-01-02T00:00:00Z",
  },
  {
    id: "3",
    username: "mikebrown",
    email: "mike@example.com",
    password_hash: "hashed_password_3",
    profile_photo: "https://i.pravatar.cc/300?img=68",
    date_of_birth: "1988-07-22",
    training_start_date: "2021-02-01",
    training_arts: ["Submission Grappling"],
    bio: "New to grappling, loving the journey",
    weight_value: 82,
    weight_unit: "kg",
    height_value: 180,
    height_unit: "cm",
    privacy_settings: {
      profile_visibility: true,
      metrics_visibility: true,
      age_visibility: true,
      weight_visibility: true,
      height_visibility: true,
      connections_visibility: true,
    },
    status: "active",
    is_online: false,
    last_active: "2024-01-20T15:30:00Z",
    created_at: "2023-01-03T00:00:00Z",
    updated_at: "2023-01-03T00:00:00Z",
  },
  {
    id: "4",
    username: "alexchen",
    email: "alex@example.com",
    password_hash: "hashed_password_4",
    profile_photo: "https://i.pravatar.cc/300?img=32",
    date_of_birth: "1995-11-03",
    training_start_date: "2018-05-20",
    training_arts: ["BJJ", "Wrestling", "Submission Grappling"],
    bio: "Competitive grappler, always looking to improve",
    weight_value: 70,
    weight_unit: "kg",
    height_value: 170,
    height_unit: "cm",
    privacy_settings: {
      profile_visibility: true,
      metrics_visibility: true,
      age_visibility: true,
      weight_visibility: true,
      height_visibility: true,
      connections_visibility: true,
    },
    status: "active",
    is_online: true,
    last_active: new Date().toISOString(),
    created_at: "2023-01-04T00:00:00Z",
    updated_at: "2023-01-04T00:00:00Z",
  },
  {
    id: "5",
    username: "emilywong",
    email: "emily@example.com",
    password_hash: "hashed_password_5",
    profile_photo: "https://i.pravatar.cc/300?img=25",
    date_of_birth: "1993-09-12",
    training_start_date: "2017-03-15",
    training_arts: ["BJJ", "Wrestling"],
    bio: "BJJ brown belt, wrestling coach",
    weight_value: 58,
    weight_unit: "kg",
    height_value: 162,
    height_unit: "cm",
    privacy_settings: {
      profile_visibility: true,
      metrics_visibility: true,
      age_visibility: true,
      weight_visibility: true,
      height_visibility: true,
      connections_visibility: true,
    },
    status: "active",
    is_online: true,
    last_active: new Date().toISOString(),
    created_at: "2023-01-05T00:00:00Z",
    updated_at: "2023-01-05T00:00:00Z",
  },
];

// Initial connections - Each connection is unique and bidirectional
export const initialConnections: Connection[] = [
  // John follows Sarah
  {
    id: "1-2-following",
    userId: "1",
    targetUserId: "2",
    username: "sarahsmith",
    profilePhoto: "https://i.pravatar.cc/300?img=47",
    connectionType: "following",
    isOnline: true,
    lastActive: new Date().toISOString(),
  },
  // Sarah follows John
  {
    id: "2-1-following",
    userId: "2",
    targetUserId: "1",
    username: "johndoe",
    profilePhoto: "https://i.pravatar.cc/300?img=11",
    connectionType: "following",
    isOnline: true,
    lastActive: new Date().toISOString(),
  },
  // Mike follows Sarah
  {
    id: "3-2-following",
    userId: "3",
    targetUserId: "2",
    username: "sarahsmith",
    profilePhoto: "https://i.pravatar.cc/300?img=47",
    connectionType: "following",
    isOnline: true,
    lastActive: new Date().toISOString(),
  },
  // Emily follows Sarah
  {
    id: "5-2-following",
    userId: "5",
    targetUserId: "2",
    username: "sarahsmith",
    profilePhoto: "https://i.pravatar.cc/300?img=47",
    connectionType: "following",
    isOnline: true,
    lastActive: new Date().toISOString(),
  },
  // Alex follows Emily
  {
    id: "4-5-following",
    userId: "4",
    targetUserId: "5",
    username: "emilywong",
    profilePhoto: "https://i.pravatar.cc/300?img=25",
    connectionType: "following",
    isOnline: true,
    lastActive: new Date().toISOString(),
  },
];

export const dummyChats: DBChat[] = [
  {
    id: "1",
    sender_id: "1",
    receiver_id: "2",
    message: "Hey Sarah, how's training going?",
    is_read: true,
    created_at: "2024-01-20T10:00:00Z",
    updated_at: "2024-01-20T10:00:00Z",
  },
  {
    id: "2",
    sender_id: "2",
    receiver_id: "1",
    message: "Going great! Just learned a new technique today.",
    is_read: true,
    created_at: "2024-01-20T10:05:00Z",
    updated_at: "2024-01-20T10:05:00Z",
  },
  {
    id: "3",
    sender_id: "3",
    receiver_id: "1",
    message: "Are you coming to open mat this weekend?",
    is_read: false,
    created_at: "2024-01-20T15:30:00Z",
    updated_at: "2024-01-20T15:30:00Z",
  },
];

// Initialize storage with dummy data
export const initializeStorage = () => {
  const storage = localStorage.getItem("connections");
  if (!storage) {
    localStorage.setItem("connections", JSON.stringify(initialConnections));
  }

  const members = localStorage.getItem("members");
  if (!members) {
    localStorage.setItem(
      "members",
      JSON.stringify(dummyMembers.map(convertDBMemberToMember))
    );
  }

  const chats = localStorage.getItem("chats");
  if (!chats) {
    localStorage.setItem("chats", JSON.stringify(dummyChats));
  }
};

// Helper function to convert DB member to frontend Member type
export const convertDBMemberToMember = (dbMember: DBMember): Member => ({
  id: dbMember.id,
  username: dbMember.username,
  profilePhoto: dbMember.profile_photo,
  email: dbMember.email,
  dateOfBirth: dbMember.date_of_birth,
  trainingStartDate: dbMember.training_start_date,
  trainingArts: dbMember.training_arts as TrainingArt[],
  bio: dbMember.bio,
  weight: {
    value: dbMember.weight_value,
    unit: dbMember.weight_unit,
  },
  height: {
    value: dbMember.height_value,
    unit: dbMember.height_unit,
  },
  privacySettings: {
    profileVisibility: dbMember.privacy_settings.profile_visibility,
    metricsVisibility: dbMember.privacy_settings.metrics_visibility,
    ageVisibility: dbMember.privacy_settings.age_visibility,
    weightVisibility: dbMember.privacy_settings.weight_visibility,
    heightVisibility: dbMember.privacy_settings.height_visibility,
    connectionsVisibility: dbMember.privacy_settings.connections_visibility,
  },
  status: dbMember.status,
  isOnline: dbMember.is_online,
  lastActive: dbMember.last_active,
});
