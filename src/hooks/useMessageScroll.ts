import { useEffect, useRef, useCallback } from 'react';
import { Message } from '../types/chat';

export interface UseMessageScrollProps {
  messages: Message[];
  highlightedMessageId: string | null;
  styles: { [key: string]: string };
}

export const useMessageScroll = ({ messages, highlightedMessageId, styles }: UseMessageScrollProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const scrollToMessage = useCallback((messageId: string) => {
    const messageElement = messageRefs.current[messageId];
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
      messageElement.classList.add(styles['highlight-message']);
      setTimeout(() => {
        messageElement.classList.remove(styles['highlight-message']);
      }, 2000);
    }
  }, [styles]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (highlightedMessageId) {
        scrollToMessage(highlightedMessageId);
      } else {
        scrollToBottom();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [highlightedMessageId, messages, scrollToMessage, scrollToBottom]);

  return {
    messagesEndRef,
    messageRefs,
    scrollToMessage,
    scrollToBottom
  };
};

export type UseMessageScrollReturn = ReturnType<typeof useMessageScroll>;

export default useMessageScroll;
