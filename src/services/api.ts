import { Member, Connection } from "../types/member";
import { DBChat } from "../db/schema";
import {
  dummyMembers,
  convertDBMemberToMember,
  initializeStorage,
} from "../db/dummy-data";
import storageService from "./storage";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface ChatMessage {
  id: string;
  senderId: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

class ApiService {
  constructor() {
    // Initialize storage with dummy data
    initializeStorage();
  }

  // Members
  async getMembers(): Promise<Member[]> {
    await delay(500);
    return storageService.getMembers();
  }

  async getMemberById(id: string): Promise<Member | null> {
    await delay(300);
    const members = storageService.getMembers();
    return members.find((m) => m.id === id) || null;
  }

  async searchMembers(query: string): Promise<Member[]> {
    await delay(300);
    const members = storageService.getMembers();
    const lowercaseQuery = query.toLowerCase();
    return members.filter(
      (m) =>
        m.username.toLowerCase().includes(lowercaseQuery) ||
        m.bio?.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Connections
  async getConnections(userId: string): Promise<{
    followers: Connection[];
    following: Connection[];
    blocked: Connection[];
  }> {
    await delay(300);
    const connections = storageService.getConnections();

    const followers = connections.filter(
      (c: Connection) =>
        c.targetUserId === userId && c.connectionType === "following"
    );

    const following = connections.filter(
      (c: Connection) => c.userId === userId && c.connectionType === "following"
    );

    const blocked = connections.filter(
      (c: Connection) => c.userId === userId && c.connectionType === "blocked"
    );

    return { followers, following, blocked };
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
  async getChatHistory(
    userId: string,
    otherId: string
  ): Promise<ChatMessage[]> {
    await delay(300);
    const chats = storageService.getChats();
    return chats
      .filter(
        (chat: DBChat) =>
          (chat.sender_id === userId && chat.receiver_id === otherId) ||
          (chat.sender_id === otherId && chat.receiver_id === userId)
      )
      .map((chat: DBChat) => ({
        id: chat.id,
        senderId: chat.sender_id,
        message: chat.message,
        timestamp: chat.created_at,
        isRead: chat.is_read,
      }))
      .sort(
        (a: ChatMessage, b: ChatMessage) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
  }

  async sendMessage(
    senderId: string,
    receiverId: string,
    message: string
  ): Promise<void> {
    await delay(300);
    const newChat: DBChat = {
      id: `${Date.now()}`,
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

// Create a singleton instance
const apiService = new ApiService();

export default apiService;
