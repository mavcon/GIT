import { TrainingArt } from "../types/member";

export interface DBMember {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  profile_photo?: string;
  date_of_birth: string;
  training_start_date: string;
  training_arts: TrainingArt[];
  bio?: string;
  weight_value: number;
  weight_unit: "kg" | "lbs";
  height_value: number;
  height_unit: "cm" | "ft";
  privacy_settings: {
    profile_visibility: boolean;
    metrics_visibility: boolean;
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

export interface DBNotification {
  id: string;
  user_id: string;
  type: "follow" | "message" | "system";
  title: string;
  message: string;
  is_read: boolean;
  related_user_id?: string;
  related_chat_id?: string;
  created_at: string;
  updated_at: string;
}

export interface DBTrainingSession {
  id: string;
  user_id: string;
  session_type: "class" | "open_mat" | "private";
  training_art: TrainingArt;
  duration_minutes: number;
  notes?: string;
  intensity: 1 | 2 | 3 | 4 | 5;
  techniques_practiced?: string[];
  partners?: string[];
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface DBMetrics {
  id: string;
  user_id: string;
  metric_type: "weight" | "height" | "attendance" | "technique_progress";
  value: number;
  unit?: string;
  notes?: string;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

export interface DBTechnique {
  id: string;
  name: string;
  category: "takedown" | "submission" | "position" | "escape" | "other";
  training_art: TrainingArt;
  description?: string;
  video_url?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  prerequisites?: string[];
  related_techniques?: string[];
  created_at: string;
  updated_at: string;
}

export interface DBUserTechnique {
  id: string;
  user_id: string;
  technique_id: string;
  proficiency: 1 | 2 | 3 | 4 | 5;
  times_practiced: number;
  notes?: string;
  last_practiced: string;
  created_at: string;
  updated_at: string;
}

export interface DBUserAchievement {
  id: string;
  user_id: string;
  achievement_type:
    | "belt_promotion"
    | "competition"
    | "attendance"
    | "technique_mastery";
  title: string;
  description?: string;
  awarded_at: string;
  created_at: string;
  updated_at: string;
}
