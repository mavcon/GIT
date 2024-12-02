import { useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { dummyNotifications } from '../db/dummy-data';

export const useNotificationDemo = () => {
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Add initial notifications from dummy data
    dummyNotifications.forEach((dbNotification, index) => {
      const notification = {
        type: dbNotification.type,
        title: dbNotification.title,
        message: dbNotification.message,
        senderId: dbNotification.sender_id,
        targetRoute: dbNotification.target_route,
        metadata: {
          messageId: dbNotification.message_id,
          groupName: dbNotification.group_id,
          amount: dbNotification.amount,
          currency: dbNotification.currency,
          followCount: dbNotification.follow_count,
          groupingPeriod: dbNotification.grouping_period
        },
        isRead: dbNotification.is_read // Preserve the read status from dummy data
      };

      // Add each notification with a delay to simulate real-time updates
      setTimeout(() => {
        addNotification(notification);
      }, index * 1000);
    });

    // Add a new unread notification every minute using an existing notification as template
    const interval = setInterval(() => {
      const randomNotification = dummyNotifications[
        Math.floor(Math.random() * dummyNotifications.length)
      ];
      
      const notification = {
        type: randomNotification.type,
        title: randomNotification.title,
        message: `New ${randomNotification.message}`, // Add "New" to distinguish from initial notifications
        senderId: randomNotification.sender_id,
        targetRoute: randomNotification.target_route,
        metadata: {
          messageId: `new-${Date.now()}`, // Ensure unique messageId for new notifications
          groupName: randomNotification.group_id,
          amount: randomNotification.amount,
          currency: randomNotification.currency,
          followCount: randomNotification.follow_count,
          groupingPeriod: randomNotification.grouping_period
        },
        isRead: false // New notifications are always unread
      };

      addNotification(notification);
    }, 60000);

    return () => clearInterval(interval);
  }, [addNotification]);
};
