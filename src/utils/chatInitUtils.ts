import { Message, Chat } from '../types/chat';

interface DBChat {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

interface ChatInitData {
  chatMessages: { [key: string]: Message[] };
  processedChats: Chat[];
}

const createMessage = (dbChat: DBChat): Message => ({
  id: dbChat.id,
  senderId: dbChat.sender_id,
  receiverId: dbChat.receiver_id,
  text: dbChat.message,
  timestamp: dbChat.created_at,
  read: dbChat.is_read,
});

const getChatId = (senderId: string, receiverId: string): string => {
  return [senderId, receiverId].sort().join('-');
};

const updateExistingChat = (
  existingChat: Chat,
  message: Message,
  isRead: boolean
): Chat => {
  const isNewer = new Date(message.timestamp) > new Date(existingChat.lastMessage.timestamp);
  return {
    ...existingChat,
    lastMessage: isNewer ? message : existingChat.lastMessage,
    unreadCount: existingChat.unreadCount + (isRead ? 0 : 1),
  };
};

const createNewChat = (
  chatId: string,
  message: Message,
  isRead: boolean
): Chat => ({
  id: chatId,
  participants: [message.senderId, message.receiverId],
  lastMessage: message,
  unreadCount: isRead ? 0 : 1,
});

export const initializeChats = (dbChats: DBChat[]): ChatInitData => {
  const chatMessages: { [key: string]: Message[] } = {};
  const chatMap = new Map<string, Chat>();

  dbChats.forEach(dbChat => {
    const chatId = getChatId(dbChat.sender_id, dbChat.receiver_id);
    const message = createMessage(dbChat);

    // Add message to chatMessages
    if (!chatMessages[chatId]) {
      chatMessages[chatId] = [];
    }
    chatMessages[chatId].push(message);

    // Update or create chat
    const existingChat = chatMap.get(chatId);
    chatMap.set(
      chatId,
      existingChat
        ? updateExistingChat(existingChat, message, dbChat.is_read)
        : createNewChat(chatId, message, dbChat.is_read)
    );
  });

  return {
    chatMessages,
    processedChats: Array.from(chatMap.values()),
  };
};
