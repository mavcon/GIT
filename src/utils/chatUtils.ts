export interface ChatUtils {
  formatTimestamp: (timestamp: string) => string;
  getOtherMemberId: (participants: string[], currentUserId: string) => string;
}

export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
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

export const getOtherMemberId = (participants: string[], currentUserId: string): string => {
  return participants.find(id => id !== currentUserId) || '';
};
