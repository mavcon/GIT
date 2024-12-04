import { useNavigate } from 'react-router-dom';
import { NotificationGroup } from '../types/notification';

const routeMap: Record<string, string> = {
  training: '/dojos/schedule',
  achievement: '/stats/achievements',
};

export const useNotificationRouting = () => {
  const navigate = useNavigate();

  const getDirectMessageRoute = (senderId: string | undefined) => 
    senderId ? `/chat/${senderId}` : '/chat';

  const getGroupChatRoute = (metadata?: Record<string, any>) => {
    const groupName = metadata?.groupName?.toLowerCase().replace(/\s+/g, '-');
    return `/chat/group/${groupName || 'default'}`;
  };

  const getBillingRoute = (message: string) => {
    return message.toLowerCase().includes('failed')
      ? '/settings/billing/payment-failed'
      : '/settings/billing';
  };

  const getFollowRoute = (group: NotificationGroup) => {
    return group.metadata?.followCount && group.metadata.followCount > 1
      ? '/profile/followers'
      : group.senderId
        ? `/members/${group.senderId}`
        : '/members';
  };

  const handleNotificationNavigation = (group: NotificationGroup) => {
    // If targetRoute is provided, use it directly
    if (group.latestNotification.targetRoute) {
      navigate(group.latestNotification.targetRoute);
      return;
    }

    // Use predefined routes for simple cases
    if (routeMap[group.type]) {
      navigate(routeMap[group.type]);
      return;
    }

    // Handle complex routing cases
    switch (group.type) {
      case 'direct_message':
        navigate(getDirectMessageRoute(group.senderId));
        break;
      case 'group_chat':
        navigate(getGroupChatRoute(group.metadata));
        break;
      case 'billing':
        navigate(getBillingRoute(group.latestNotification.message));
        break;
      case 'follow':
        navigate(getFollowRoute(group));
        break;
      default:
        navigate('/');
    }
  };

  return handleNotificationNavigation;
};

export default useNotificationRouting;
