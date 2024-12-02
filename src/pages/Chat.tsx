import React, { useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import ChatDialog from '../components/chat/ChatDialog';
import { useMember } from '../hooks/useMember';
import { useChat } from '../context/ChatContext';

interface ChatPageProps {
  currentUserId: string;
}

const ChatPage: React.FC<ChatPageProps> = ({ currentUserId }) => {
  const { memberId } = useParams();
  const [searchParams] = useSearchParams();
  const messageId = searchParams.get('messageId');
  const navigate = useNavigate();
  const { getMemberById } = useMember(currentUserId);
  const { markAsRead } = useChat();

  const currentUser = getMemberById(currentUserId);
  const otherMember = memberId ? getMemberById(memberId) : null;

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (currentUser && otherMember) {
      const chatId = [currentUser.id, otherMember.id].sort().join('-');
      markAsRead(chatId);
    }
  }, [currentUser, otherMember, markAsRead]);

  if (!currentUser || !otherMember) {
    return <div>Loading...</div>;
  }

  return (
    <ChatDialog
      currentUser={currentUser}
      otherMember={otherMember}
      isOpen={true}
      onClose={() => navigate(-1)}
    />
  );
};

export default ChatPage;
