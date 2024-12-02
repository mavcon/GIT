import React from 'react';
import { useMember } from '../../hooks/useMember';
import { useActiveChat } from '../../hooks/useActiveChat';
import ChatList from './ChatList';
import ChatContent from './ChatContent';

const CURRENT_USER_ID = "1";

const ChatCard: React.FC = () => {
  const { getMemberById } = useMember(CURRENT_USER_ID);
  const {
    activeChat,
    activeChatData,
    handleChatSelect,
    handleSendMessage,
    chats,
    currentUserId,
  } = useActiveChat();

  const currentUser = getMemberById(CURRENT_USER_ID);
  if (!currentUser) return null;

  return (
    <div className="grid grid-cols-4 gap-4 h-full bg-base-100 rounded-lg shadow-xl overflow-hidden">
      <ChatList
        chats={chats}
        activeChat={activeChat}
        currentUserId={currentUserId}
        getMemberById={getMemberById}
        onChatSelect={handleChatSelect}
      />

      <div className="col-span-3 flex flex-col">
        <ChatContent
          isActive={!!activeChat}
          messages={activeChatData.messages}
          currentUserId={currentUserId}
          activeMember={activeChatData.otherMember}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default ChatCard;
