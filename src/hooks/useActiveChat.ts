import { useMemo } from 'react';
import { useChat } from '../context/ChatContext';
import { useMember } from './useMember';
import { useChatMessages } from './useChatMessages';
import { getOtherMemberId } from '../utils/chatUtils';

const CURRENT_USER_ID = "1";

export const useActiveChat = () => {
  const { state, setActiveChat } = useChat();
  const { getMemberById } = useMember(CURRENT_USER_ID);
  const { handleSendMessage, getActiveChatMessages } = useChatMessages();

  const handleChatSelect = (memberId: string) => {
    setActiveChat([CURRENT_USER_ID, memberId].sort().join('-'));
  };

  const activeChatData = useMemo(() => {
    if (!state.activeChat) {
      return { messages: [], otherMember: null };
    }

    const chat = state.chats.find(chat => chat.id === state.activeChat);
    const otherMemberId = getOtherMemberId(chat?.participants || [], CURRENT_USER_ID);
    
    return {
      messages: getActiveChatMessages(),
      otherMember: otherMemberId ? getMemberById(otherMemberId) : null,
    };
  }, [state.activeChat, state.chats, getMemberById, getActiveChatMessages]);

  return {
    activeChat: state.activeChat,
    activeChatData,
    handleChatSelect,
    handleSendMessage,
    chats: state.chats,
    currentUserId: CURRENT_USER_ID,
  };
};
