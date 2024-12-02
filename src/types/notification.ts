export type NotificationType = 'direct_message' | 'group_chat' | 'billing' | 'follow' | 'training' | 'achievement';

export interface NotificationMetadata {
  messageSnippet?: string;
  groupName?: string;
  amount?: number;
  currency?: string;
  followCount?: number;
  groupingPeriodStart?: Date;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  senderId?: string;
  targetRoute?: string;
  metadata?: NotificationMetadata;
}

export interface NotificationGroup {
  type: NotificationType;
  senderId?: string;
  count: number;
  latestNotification: Notification;
  metadata?: NotificationMetadata;
  groupingPeriodStart?: Date;
}

export interface NotificationState {
  notifications: Notification[];
  groupedNotifications: NotificationGroup[];
  totalUnreadCount: number;
}

export interface NotificationBellState {
  alertValue: number;
  groupedAlerts: {
    [key: string]: number; // key is type-senderId or type-groupId
  };
}
