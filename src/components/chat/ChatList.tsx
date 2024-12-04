import React from 'react';
import { Chat } from '../../types/chat';
import { Member } from '../../types/member';
import ProfileImage from '../common/ProfileImage';
import { formatTimestamp, getOtherMemberId } from '../../utils/chatUtils';

export interface ChatListProps {
  chats: Chat[];
  activeChat: string | null;
  currentUserId: string;
  getMemberById: (id: string) => Member | null;
  onChatSelect: (memberId: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  activeChat,
  currentUserId,
  getMemberById,
  onChatSelect,
}) => {
  return (
    <div className="col-span-1 border-r border-base-300 overflow-y-auto">
      <div className="p-4 border-b border-base-300">
        <h2 className="font-bold text-lg">Recent Chats</h2>
      </div>
      <div className="divide-y divide-base-300">
        {chats.map(chat => {
          const otherMemberId = getOtherMemberId(chat.participants, currentUserId);
          const otherMember = getMemberById(otherMemberId);
          if (!otherMember) return null;

          const isActive = activeChat === chat.id;

          return (
            <div
              key={chat.id}
              className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
                isActive ? 'bg-primary/10' : 'hover:bg-base-200'
              }`}
              onClick={() => onChatSelect(otherMemberId)}
            >
              <ProfileImage
                src={otherMember.profilePhoto}
                alt={otherMember.username}
                isOnline={otherMember.isOnline}
                size="sm"
              />
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold truncate">
                    {otherMember.username}
                  </h3>
                  {chat.lastMessage && (
                    <span className="text-xs text-base-content/70">
                      {formatTimestamp(chat.lastMessage.timestamp)}
                    </span>
                  )}
                </div>
                {chat.lastMessage && (
                  <p className="text-sm text-base-content/70 truncate">
                    {chat.lastMessage.text}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatList;
