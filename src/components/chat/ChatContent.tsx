import React from 'react';
import { Member } from '../../types/member';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import ChatMessageList from './ChatMessageList';
import { Message } from '../../types/chat';

interface ChatContentProps {
  isActive: boolean;
  messages: Message[];
  currentUserId: string;
  activeMember: Member | null;
  onSendMessage: (message: string) => void;
}

const ChatContent: React.FC<ChatContentProps> = ({
  isActive,
  messages,
  currentUserId,
  activeMember,
  onSendMessage,
}) => {
  if (!isActive) {
    return (
      <div className="flex-grow flex items-center justify-center text-base-content/50">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <>
      {activeMember && <ChatHeader member={activeMember} />}
      <ChatMessageList
        messages={messages}
        currentUserId={currentUserId}
      />
      <ChatInput onSendMessage={onSendMessage} />
    </>
  );
};

export default ChatContent;
