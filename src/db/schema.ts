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
  status: "active" | "inactive" | "suspended";
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
