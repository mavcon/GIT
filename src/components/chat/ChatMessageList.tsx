import React, { useRef, useEffect } from 'react';
import { Message } from '../../types/chat';
import ChatMessage from './ChatMessage';

export interface ChatMessageListProps {
  messages: Message[];
  currentUserId: string;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-base-content/50">
        No messages yet. Start the conversation!
      </div>
    );
  }

  return (
    <div className="flex-grow overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          isSender={message.senderId === currentUserId}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;
