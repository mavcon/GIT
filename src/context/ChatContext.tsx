import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ChatState, Message, Chat } from '../types/chat';
import storageService from '../services/storage';
import {
  updateMessagesState,
  updateChatsState,
  processInitialMessages,
  processInitialChats,
} from '../utils/chatStateUtils';
import { initializeChats } from '../utils/chatInitUtils';

interface ChatContextType {
  state: ChatState;
  sendMessage: (receiverId: string, text: string) => void;
  markAsRead: (chatId: string) => void;
  setActiveChat: (chatId: string | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

type ChatAction =
  | { type: 'SET_CHATS'; payload: Chat[] }
  | { type: 'SET_MESSAGES'; payload: { chatId: string; messages: Message[] } }
  | { type: 'ADD_MESSAGE'; payload: { chatId: string; message: Message } }
  | { type: 'SET_ACTIVE_CHAT'; payload: string | null }
  | { type: 'MARK_AS_READ'; payload: string };

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_CHATS':
      return { ...state, chats: action.payload };
      
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.chatId]: action.payload.messages,
        },
      };
      
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: updateMessagesState(state, action.payload.chatId, action.payload.message),
        chats: updateChatsState(state, action.payload.chatId, action.payload.message),
      };
      
    case 'SET_ACTIVE_CHAT':
      return { ...state, activeChat: action.payload };
      
    case 'MARK_AS_READ':
      return {
        ...state,
        chats: state.chats.map(chat =>
          chat.id === action.payload
            ? { ...chat, unreadCount: 0 }
            : chat
        ),
      };
      
    default:
      return state;
  }
};

const initialState: ChatState = {
  chats: [],
  activeChat: null,
  messages: {},
};

export const ChatProvider: React.FC<{ children: React.ReactNode; currentUserId: string }> = ({ 
  children, 
  currentUserId 
}) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const sendMessage = (receiverId: string, text: string) => {
    const chatId = [currentUserId, receiverId].sort().join('-');
    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      receiverId,
      text,
      timestamp: new Date().toISOString(),
      read: false,
    };

    dispatch({ type: 'ADD_MESSAGE', payload: { chatId, message } });
  };

  const markAsRead = (chatId: string) => {
    dispatch({ type: 'MARK_AS_READ', payload: chatId });
  };

  const setActiveChat = (chatId: string | null) => {
    dispatch({ type: 'SET_ACTIVE_CHAT', payload: chatId });
    if (chatId) {
      markAsRead(chatId);
    }
  };

  useEffect(() => {
    const dbChats = storageService.getChats();
    const { chatMessages, processedChats } = initializeChats(dbChats);

    // Set sorted chats
    const sortedChats = processInitialChats(processedChats);
    dispatch({ type: 'SET_CHATS', payload: sortedChats });

    // Set sorted messages for each chat
    Object.entries(chatMessages).forEach(([chatId, messages]) => {
      const sortedMessages = processInitialMessages(messages, chatId);
      dispatch({ type: 'SET_MESSAGES', payload: { chatId, messages: sortedMessages } });
    });
  }, [currentUserId]);

  return (
    <ChatContext.Provider value={{ state, sendMessage, markAsRead, setActiveChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
