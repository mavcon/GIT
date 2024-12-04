import { Member, Connection } from "../types/member";
import { DBChat } from "../db/schema";
import { dummyMembers, convertDBMemberToMember } from "../db/dummy-data";
import storageService from "./storage";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class ApiService {
  // Members
  async getMembers(): Promise<Member[]> {
    await delay(300);
    return storageService.getMembers();
  }

  async getMemberById(memberId: string): Promise<Member | null> {
    await delay(300);
    const members = storageService.getMembers();
    return members.find((m) => m.id === memberId) || null;
  }

  async updateMember(
    memberId: string,
    updates: Partial<Member>
  ): Promise<void> {
    await delay(300);
    storageService.updateMember(memberId, updates);
  }

  // Connections
  async getConnections(memberId: string): Promise<{
    followers: Connection[];
    following: Connection[];
  }> {
    await delay(300);
    const connections = storageService.getConnections();

    const followers = connections.filter(
      (c: Connection) =>
        c.targetUserId === memberId && c.connectionType === "following"
    );

    const following = connections.filter(
      (c: Connection) =>
        c.userId === memberId && c.connectionType === "following"
    );

    return {
      followers,
      following,
    };
  }

  async addConnection(connection: Connection): Promise<void> {
    await delay(300);
    storageService.addConnection(connection);
  }

  async removeConnection(
    userId: string,
    targetUserId: string,
    connectionType: Connection["connectionType"]
  ): Promise<void> {
    await delay(300);
    storageService.removeConnection(userId, targetUserId, connectionType);
  }

  // Chats
  async getChats(userId: string, targetUserId: string): Promise<ChatMessage[]> {
    await delay(300);
    const chats = storageService.getChats();
    return chats
      .filter(
        (chat: DBChat) =>
          (chat.sender_id === userId && chat.receiver_id === targetUserId) ||
          (chat.sender_id === targetUserId && chat.receiver_id === userId)
      )
      .map((chat: DBChat) => ({
        id: chat.id,
        senderId: chat.sender_id,
        receiverId: chat.receiver_id,
        message: chat.message,
        isRead: chat.is_read,
        createdAt: chat.created_at,
        updatedAt: chat.updated_at,
      }));
  }

  async sendMessage(
    senderId: string,
    receiverId: string,
    message: string
  ): Promise<void> {
    await delay(300);
    const newChat: DBChat = {
      id: Math.random().toString(36).substring(7),
      sender_id: senderId,
      receiver_id: receiverId,
      message,
      is_read: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    storageService.addChat(newChat);
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    await delay(300);
    const chats = storageService.getChats();
    const updatedChats = chats.map((chat: DBChat) =>
      chat.id === messageId ? { ...chat, is_read: true } : chat
    );
    storageService.setChats(updatedChats);
  }
}

interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

const apiService = new ApiService();
export default apiService;
