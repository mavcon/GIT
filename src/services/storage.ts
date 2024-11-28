import { Member, Connection } from "../types/member";
import { DBChat } from "../db/schema";
import {
  dummyMembers,
  initialConnections,
  dummyChats,
  convertDBMemberToMember,
} from "../db/dummy-data";
import { validateMember } from "./validation";

// Storage keys
const KEYS = {
  MEMBERS: "members",
  CONNECTIONS: "connections",
  CHATS: "chats",
} as const;

// Custom events for storage updates
export const STORAGE_EVENTS = {
  MEMBERS_UPDATED: "membersUpdated",
  CONNECTIONS_UPDATED: "connectionsUpdated",
  CHATS_UPDATED: "chatsUpdated",
} as const;

class StorageService {
  private dispatchStorageEvent<T>(eventName: string, data: T) {
    const event = new CustomEvent(eventName, { detail: data });
    window.dispatchEvent(event);
  }

  addStorageListener<T>(
    eventName: string,
    callback: (event: CustomEvent<T>) => void
  ) {
    const handler = callback as EventListener;
    window.addEventListener(eventName, handler);
    return () => window.removeEventListener(eventName, handler);
  }

  // Initialize storage with dummy data
  resetStorage() {
    localStorage.clear();
    this.setMembers(dummyMembers.map(convertDBMemberToMember));
    this.setConnections(initialConnections);
    this.setChats(dummyChats);
  }

  // Members
  getMembers(): Member[] {
    const membersJson = localStorage.getItem(KEYS.MEMBERS);
    return membersJson ? JSON.parse(membersJson) : [];
  }

  setMembers(members: Member[]) {
    try {
      // Validate each member
      members.forEach((member) => {
        const errors = validateMember(member);
        if (errors.length > 0) {
          throw new Error(`Member validation failed: ${errors.join(", ")}`);
        }
      });

      localStorage.setItem(KEYS.MEMBERS, JSON.stringify(members));
      this.dispatchStorageEvent(STORAGE_EVENTS.MEMBERS_UPDATED, members);
    } catch (error) {
      console.error("Error setting members:", error);
      throw error;
    }
  }

  updateMember(memberId: string, updates: Partial<Member>) {
    const members = this.getMembers();
    const memberIndex = members.findIndex((m) => m.id === memberId);

    if (memberIndex === -1) {
      throw new Error(`Member with ID ${memberId} not found`);
    }

    const updatedMember = {
      ...members[memberIndex],
      ...updates,
    };

    const errors = validateMember(updatedMember);
    if (errors.length > 0) {
      throw new Error(`Member validation failed: ${errors.join(", ")}`);
    }

    members[memberIndex] = updatedMember;
    this.setMembers(members);
  }

  // Connections
  getConnections(): Connection[] {
    const connectionsJson = localStorage.getItem(KEYS.CONNECTIONS);
    return connectionsJson ? JSON.parse(connectionsJson) : [];
  }

  setConnections(connections: Connection[]) {
    localStorage.setItem(KEYS.CONNECTIONS, JSON.stringify(connections));
    this.dispatchStorageEvent(STORAGE_EVENTS.CONNECTIONS_UPDATED, connections);
  }

  addConnection(connection: Connection) {
    const connections = this.getConnections();
    this.setConnections([...connections, connection]);
  }

  removeConnection(
    userId: string,
    targetUserId: string,
    connectionType: Connection["connectionType"]
  ) {
    const connections = this.getConnections();
    const filtered = connections.filter(
      (conn) =>
        !(
          conn.userId === userId &&
          conn.targetUserId === targetUserId &&
          conn.connectionType === connectionType
        )
    );
    this.setConnections(filtered);
  }

  // Chats
  getChats(): DBChat[] {
    const chatsJson = localStorage.getItem(KEYS.CHATS);
    return chatsJson ? JSON.parse(chatsJson) : [];
  }

  setChats(chats: DBChat[]) {
    localStorage.setItem(KEYS.CHATS, JSON.stringify(chats));
    this.dispatchStorageEvent(STORAGE_EVENTS.CHATS_UPDATED, chats);
  }

  addChat(chat: DBChat) {
    const chats = this.getChats();
    this.setChats([...chats, chat]);
  }

  updateChat(chatId: string, updates: Partial<DBChat>) {
    const chats = this.getChats();
    const updatedChats = chats.map((chat) =>
      chat.id === chatId ? { ...chat, ...updates } : chat
    );
    this.setChats(updatedChats);
  }
}

const storageService = new StorageService();
export default storageService;
