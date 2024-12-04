export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage: Message; // Make lastMessage required
  unreadCount: number;
}

export interface ChatState {
  chats: Chat[];
  activeChat: string | null;
  messages: { [chatId: string]: Message[] };
}
