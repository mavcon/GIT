import { NotificationGroup } from '../../types/notification';
import { Member } from '../../types/member';

interface NotificationContentProps {
  group: NotificationGroup;
  sender: Member | null;
}

interface NotificationContentResult {
  title: string;
  message: string;
  image: string;
  isOnline: boolean;
}

const getDirectMessageContent = (sender: Member | null, message: string): NotificationContentResult => ({
  title: sender?.username || 'Unknown user',
  message,
  image: sender?.profilePhoto || '/default-avatar.png',
  isOnline: sender?.isOnline || false
});

const getGroupChatContent = (
  sender: Member | null,
  message: string,
  groupName?: string
): NotificationContentResult => ({
  title: groupName || 'Group Chat',
  message: `${sender?.username || 'Unknown'}: ${message}`,
  image: '/group-chat-icon.svg',
  isOnline: false
});

const getTrainingContent = (message: string): NotificationContentResult => ({
  title: 'Training Update',
  message,
  image: '/training-icon.svg',
  isOnline: false
});

const getBillingContent = (
  title: string,
  message: string,
  amount?: number,
  currency?: string
): NotificationContentResult => ({
  title,
  message: amount ? `${message} (${currency}${amount.toString()})` : message,
  image: '/billing-icon.svg',
  isOnline: false
});

const getDefaultContent = (title: string, message: string): NotificationContentResult => ({
  title,
  message,
  image: '/notification-icon.svg',
  isOnline: false
});

type NotificationTypeHandler = (
  message: string,
  title: string | undefined,
  sender: Member | null,
  metadata?: Record<string, any>
) => NotificationContentResult;

const notificationTypeHandlers: Record<string, NotificationTypeHandler> = {
  direct_message: (message, _, sender) => 
    getDirectMessageContent(sender, message),

  group_chat: (message, _, sender, metadata) => 
    getGroupChatContent(sender, message, metadata?.groupName),

  training: (message) => 
    getTrainingContent(message),

  billing: (message, title, _, metadata) => 
    getBillingContent(
      title || 'Billing Update',
      message,
      metadata?.amount,
      metadata?.currency
    ),
};

const getNotificationContent = ({ group, sender }: NotificationContentProps): NotificationContentResult => {
  const { type, latestNotification, metadata } = group;
  const { message, title } = latestNotification;

  const handler = notificationTypeHandlers[type];
  return handler
    ? handler(message, title, sender, metadata)
    : getDefaultContent(title || 'Notification', message);
};

export { getNotificationContent };
export type { NotificationContentResult, NotificationContentProps };
