import React, { useMemo } from "react";
import { Member } from "../../types/member";
import { useChat } from "../../context/ChatContext";
import { useLocation } from "react-router-dom";
import DialogHeader from "./DialogHeader";
import DialogMessages from "./DialogMessages";
import ChatInput from "./ChatInput";

export interface ChatDialogProps {
  currentUser: Member;
  otherMember: Member;
  isOpen: boolean;
  onClose: () => void;
}

export const ChatDialog: React.FC<ChatDialogProps> = ({
  currentUser,
  otherMember,
  isOpen,
  onClose,
}) => {
  const { state, sendMessage, markAsRead } = useChat();
  const location = useLocation();
  const highlightedMessageId = new URLSearchParams(location.search).get('messageId');

  const chatId = useMemo(
    () => [currentUser.id, otherMember.id].sort().join('-'),
    [currentUser.id, otherMember.id]
  );
  
  const messages = useMemo(
    () => state.messages[chatId] || [],
    [state.messages, chatId]
  );

  // Mark messages as read when chat is opened
  React.useEffect(() => {
    if (isOpen && chatId) {
      markAsRead(chatId);
    }
  }, [isOpen, chatId, markAsRead]);

  const handleSendMessage = (message: string) => {
    sendMessage(otherMember.id, message);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-lg mx-4">
        <DialogHeader member={otherMember} onClose={onClose} />
        <DialogMessages
          messages={messages}
          currentUserId={currentUser.id}
          highlightedMessageId={highlightedMessageId}
        />
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatDialog;
