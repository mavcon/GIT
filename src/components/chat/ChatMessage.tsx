import React from 'react';
import { Message } from '../../types/chat';
import { formatTimestamp } from '../../utils/chatUtils';

export interface ChatMessageProps {
  message: Message;
  isSender: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isSender }) => (
  <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
    <div
      className={`max-w-[70%] ${
        isSender
          ? "bg-primary text-primary-content"
          : "bg-base-200 text-base-content"
      } rounded-lg px-4 py-2`}
    >
      <p>{message.text}</p>
      <p className="text-xs opacity-70 mt-1">
        {formatTimestamp(message.timestamp)}
      </p>
    </div>
  </div>
);

export default ChatMessage;
