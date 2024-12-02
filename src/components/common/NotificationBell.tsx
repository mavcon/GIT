import React, { useState } from "react";
import { useNotifications } from "../../context/NotificationContext";
import { NotificationGroup } from "../../types/notification";
import NotificationsDialog from "./NotificationsDialog";
import NotificationBellIcon from "./NotificationBellIcon";
import useNotificationRouting from "../../hooks/useNotificationRouting";

export interface NotificationBellProps {}

export const NotificationBell: React.FC<NotificationBellProps> = () => {
  const { groupedNotifications, totalUnreadCount, markAsRead } = useNotifications();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleNotificationNavigation = useNotificationRouting();

  const handleNotificationClick = (group: NotificationGroup) => {
    markAsRead(group.latestNotification.id);
    setIsDialogOpen(false);
    handleNotificationNavigation(group);
  };

  return (
    <>
      <button
        className="btn btn-ghost btn-circle relative"
        onClick={() => setIsDialogOpen(true)}
      >
        <NotificationBellIcon unreadCount={totalUnreadCount} />
      </button>

      <NotificationsDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        notifications={groupedNotifications}
        onNotificationClick={handleNotificationClick}
      />
    </>
  );
};

export default NotificationBell;
