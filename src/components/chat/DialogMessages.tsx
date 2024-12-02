import React from 'react';
import { Message } from '../../types/chat';
import { useMessageScroll } from '../../hooks/useMessageScroll';
import styles from './ChatDialog.module.css';

export interface DialogMessagesProps {
  messages: Message[];
  currentUserId: string;
  highlightedMessageId: string | null;
}

export const DialogMessages: React.FC<DialogMessagesProps> = ({
  messages,
  currentUserId,
  highlightedMessageId,
}) => {
  const { messagesEndRef, messageRefs } = useMessageScroll({
    messages,
    highlightedMessageId,
    styles,
  });

  if (messages.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-base-content/50">
        No messages yet. Start the conversation!
      </div>
    );
  }

  return (
    <div className="h-96 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        const isSender = message.senderId === currentUserId;
        return (
          <div
            key={message.id}
            ref={el => messageRefs.current[message.id] = el}
            className={`${styles['message-container']} flex ${
              isSender ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] ${
                isSender
                  ? "bg-primary text-primary-content"
                  : "bg-base-200 text-base-content"
              } rounded-lg px-4 py-2`}
            >
              <p>{message.text}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default DialogMessages;
