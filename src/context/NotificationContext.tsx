import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { Notification, NotificationState, NotificationGroup, NotificationBellState } from '../types/notification';

interface NotificationContextType extends NotificationState {
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

type NotificationAction = 
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'CLEAR_NOTIFICATIONS' };

function calculateAlertValue(notifications: Notification[]): NotificationBellState {
  const groupedAlerts: { [key: string]: number } = {};
  const unreadSenders = new Set(
    notifications
      .filter(n => !n.isRead && n.type === 'direct_message')
      .map(n => n.senderId)
  );

  return {
    alertValue: unreadSenders.size,
    groupedAlerts
  };
}

const notificationKeyMap: Record<string, (n: Notification) => string> = {
  direct_message: n => `${n.type}-${n.senderId}`,
  group_chat: n => `${n.type}-${n.metadata?.groupName}`,
  follow: n => `${n.type}-${n.metadata?.groupingPeriodStart}`,
};

function getNotificationGroupKey(notification: Notification): string {
  const getKey = notificationKeyMap[notification.type] || (n => `${n.type}-${n.id}`);
  return getKey(notification);
}

function updateGroupMetadata(group: NotificationGroup, notification: Notification): void {
  if (notification.type === 'follow' && group.metadata) {
    group.metadata.followCount = (group.metadata.followCount || 0) + 1;
  }
}

function createNotificationGroup(notification: Notification): NotificationGroup {
  return {
    type: notification.type,
    senderId: notification.senderId,
    count: 1,
    latestNotification: notification,
    metadata: notification.metadata,
    groupingPeriodStart: notification.metadata?.groupingPeriodStart
  };
}

function compareNotifications(a: NotificationGroup, b: NotificationGroup): number {
  // Sort by read status (unread first)
  if (!a.latestNotification.isRead && b.latestNotification.isRead) return -1;
  if (a.latestNotification.isRead && !b.latestNotification.isRead) return 1;
  
  // Then sort by timestamp (newest first)
  return new Date(b.latestNotification.timestamp).getTime() - 
         new Date(a.latestNotification.timestamp).getTime();
}

function updateGroupWithNotification(
  group: NotificationGroup,
  notification: Notification
): void {
  group.count++;
  updateGroupMetadata(group, notification);
  
  const currentTimestamp = new Date(notification.timestamp);
  const latestTimestamp = new Date(group.latestNotification.timestamp);
  
  if (currentTimestamp > latestTimestamp) {
    group.latestNotification = notification;
  }
}

function groupAndSortNotifications(notifications: Notification[]): NotificationGroup[] {
  const groups = new Map<string, NotificationGroup>();

  notifications.forEach(notification => {
    const key = getNotificationGroupKey(notification);
    const existingGroup = groups.get(key);

    if (existingGroup) {
      updateGroupWithNotification(existingGroup, notification);
    } else {
      groups.set(key, createNotificationGroup(notification));
    }
  });

  return Array.from(groups.values()).sort(compareNotifications);
}

function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case 'ADD_NOTIFICATION': {
      const notifications = [action.payload, ...state.notifications];
      const bellState = calculateAlertValue(notifications);
      return {
        notifications,
        groupedNotifications: groupAndSortNotifications(notifications),
        totalUnreadCount: bellState.alertValue
      };
    }
    case 'MARK_AS_READ': {
      const notifications = state.notifications.map(notification =>
        notification.id === action.payload
          ? { ...notification, isRead: true }
          : notification
      );
      const bellState = calculateAlertValue(notifications);
      return {
        notifications,
        groupedNotifications: groupAndSortNotifications(notifications),
        totalUnreadCount: bellState.alertValue
      };
    }
    case 'MARK_ALL_AS_READ': {
      const notifications = state.notifications.map(notification => ({
        ...notification,
        isRead: true
      }));
      return {
        notifications,
        groupedNotifications: groupAndSortNotifications(notifications),
        totalUnreadCount: 0
      };
    }
    case 'CLEAR_NOTIFICATIONS': {
      return {
        notifications: [],
        groupedNotifications: [],
        totalUnreadCount: 0
      };
    }
    default:
      return state;
  }
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, {
    notifications: [],
    groupedNotifications: [],
    totalUnreadCount: 0
  });

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      isRead: false
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    dispatch({ type: 'MARK_AS_READ', payload: notificationId });
  }, []);

  const markAllAsRead = useCallback(() => {
    dispatch({ type: 'MARK_ALL_AS_READ' });
  }, []);

  const clearNotifications = useCallback(() => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        ...state,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
