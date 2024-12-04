import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationGroup } from '../../types/notification';
import { useMember } from '../../hooks/useMember';
import { useNotifications } from '../../context/NotificationContext';
import ProfileImage from './ProfileImage';
import { getNotificationContent } from './NotificationContent';

interface NotificationsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationGroup[];
  onNotificationClick: (notification: NotificationGroup) => void;
}

const NotificationsDialog: React.FC<NotificationsDialogProps> = ({
  isOpen,
  onClose,
  notifications,
  onNotificationClick
}) => {
  const { getMemberById } = useMember("1");
  const { markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleNotificationClick = (group: NotificationGroup) => {
    markAsRead(group.latestNotification.id);
    onClose();
    
    if (group.latestNotification.targetRoute) {
      navigate(group.latestNotification.targetRoute);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-16 z-50">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <h2 className="font-bold text-lg">Notifications</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={markAllAsRead}
              className="btn btn-ghost btn-sm normal-case"
            >
              Read All
            </button>
            <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="max-h-[32rem] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-base-content/50">
              No new notifications
            </div>
          ) : (
            <div className="divide-y divide-base-300">
              {notifications.map((group) => {
                const sender = group.senderId ? getMemberById(group.senderId) : null;
                const content = getNotificationContent({ group, sender });
                const { timestamp, isRead } = group.latestNotification;
                const notificationKey = `${group.latestNotification.id}-${group.type}${group.senderId ? `-${group.senderId}` : ''}`;

                return (
                  <div
                    key={notificationKey}
                    className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-base-200 transition-colors ${
                      !isRead ? 'bg-base-100/90' : 'bg-base-100'
                    }`}
                    onClick={() => handleNotificationClick(group)}
                  >
                    <ProfileImage
                      src={content.image}
                      alt={content.title}
                      size="sm"
                      isOnline={content.isOnline}
                    />
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-grow min-w-0">
                          <h3 className={`font-semibold truncate ${!isRead ? 'text-primary-600' : ''}`}>
                            {content.title}
                          </h3>
                          <p className={`text-sm truncate ${!isRead ? 'text-base-content' : 'text-base-content/70'}`}>
                            {content.message}
                          </p>
                        </div>
                        <div className="flex flex-col items-end ml-4">
                          <span className="text-xs text-base-content/70">
                            {formatTimestamp(new Date(timestamp))}
                          </span>
                          <span className={`text-xs mt-1 ${!isRead ? 'text-primary-600' : 'text-base-content/50'}`}>
                            {isRead ? 'Read' : 'Unread'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsDialog;
