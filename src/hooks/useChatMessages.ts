import { useChat } from '../context/ChatContext';
import { getOtherMemberId } from '../utils/chatUtils';

const CURRENT_USER_ID = "1";

export const useChatMessages = () => {
  const { state, sendMessage } = useChat();

  const handleSendMessage = (message: string) => {
    if (!state.activeChat) return;
    
    const chat = state.chats.find(chat => chat.id === state.activeChat);
    const otherMemberId = getOtherMemberId(chat?.participants || [], CURRENT_USER_ID);
    
    if (otherMemberId) {
      sendMessage(otherMemberId, message);
    }
  };

  const getActiveChatMessages = () => {
    return state.activeChat ? state.messages[state.activeChat] || [] : [];
  };

  return {
    handleSendMessage,
    getActiveChatMessages,
  };
};
