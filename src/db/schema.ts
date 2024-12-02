export interface DBMember {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  profile_photo: string | null;
  date_of_birth: string;
  training_start_date: string;
  training_arts: string[];
  bio: string;
  gender: "male" | "female";
  weight_value: number;
  weight_unit: "kg" | "lbs";
  height_value: number;
  height_unit: "cm" | "ft";
  privacy_settings: {
    age_visibility: boolean;
    weight_visibility: boolean;
    height_visibility: boolean;
    connections_visibility: boolean;
  };
  membership_status: "free" | "paid";
  account_status: "active" | "suspended" | "banned";
  is_online: boolean;
  last_active: string;
  created_at: string;
  updated_at: string;
}

export interface DBConnection {
  id: string;
  user_id: string;
  target_user_id: string;
  connection_type: "following" | "blocked";
  created_at: string;
  updated_at: string;
}

export interface DBChat {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface DBNotification {
  id: string;
  recipient_id: string;
  type: "direct_message" | "group_chat" | "billing" | "follow" | "training" | "achievement";
  title: string;
  message: string;
  is_read: boolean;
  // Optional fields based on notification type
  sender_id?: string;        // For messages and follows
  message_id?: string;       // For chat notifications
  group_id?: string;         // For group chat
  amount?: number;           // For billing
  currency?: string;         // For billing
  follow_count?: number;     // For grouped follows
  grouping_period?: string;  // For grouped notifications
  // Metadata for UI
  target_route: string;      // Where clicking takes you
  // Timestamps
  created_at: string;
  updated_at: string;
  read_at?: string;         // When notification was read
}
