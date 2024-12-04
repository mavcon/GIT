import { ChatState, Message, Chat } from '../types/chat';

export const updateMessagesState = (
  state: ChatState,
  chatId: string,
  message: Message
): ChatState['messages'] => ({
  ...state.messages,
  [chatId]: [...(state.messages[chatId] || []), message],
});

export const updateChatsState = (
  state: ChatState,
  chatId: string,
  message: Message
): Chat[] => {
  const existingChat = state.chats.find(chat => chat.id === chatId);

  if (existingChat) {
    return state.chats.map(chat =>
      chat.id === chatId
        ? {
            ...chat,
            lastMessage: message,
            unreadCount: chat.unreadCount + 1,
          }
        : chat
    );
  }

  return [
    ...state.chats,
    {
      id: chatId,
      participants: [message.senderId, message.receiverId],
      lastMessage: message,
      unreadCount: 1,
    },
  ];
};

export const processInitialMessages = (messages: Message[], chatId: string): Message[] => {
  return messages.sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
};

export const processInitialChats = (chats: Chat[]): Chat[] => {
  return chats.sort((a, b) => 
    new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
  );
};
