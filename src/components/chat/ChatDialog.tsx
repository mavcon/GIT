import React, { useState } from "react";
import { Member } from "../../types/member";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

interface ChatDialogProps {
  currentUser: Member;
  otherMember: Member;
  isOpen: boolean;
  onClose: () => void;
}

const ChatDialog: React.FC<ChatDialogProps> = ({
  currentUser,
  otherMember,
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-lg mx-4">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-10 h-10 rounded-full relative">
                <img
                  src={otherMember.profilePhoto || "/default-avatar.png"}
                  alt={otherMember.username}
                  className="object-cover"
                />
                {otherMember.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-base-100"></div>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold">{otherMember.username}</h3>
              <p className="text-xs text-base-content/70">
                {otherMember.isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-base-content/50 mt-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message) => {
              const isSender = message.senderId === currentUser.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${
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
            })
          )}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-base-300">
          <div className="join w-full">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="input input-bordered join-item flex-grow"
            />
            <button
              onClick={handleSend}
              className="btn btn-primary join-item"
              disabled={!newMessage.trim()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDialog;
