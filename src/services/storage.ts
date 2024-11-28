import { Connection, Member } from "../types/member";
import { DBChat } from "../db/schema";
import {
  dummyMembers,
  initialConnections,
  dummyChats,
  convertDBMemberToMember,
} from "../db/dummy-data";
import {
  ConnectionPolicies,
  MemberPolicies,
  ChatPolicies,
  ValidationError,
} from "./validation";

// Storage keys
const KEYS = {
  CONNECTIONS: "connections",
  MEMBERS: "members",
  CHATS: "chats",
  CURRENT_USER: "currentUser",
  THEME: "theme",
} as const;

// Event names for storage changes
export const STORAGE_EVENTS = {
  CONNECTIONS_UPDATED: "connectionsUpdated",
  MEMBERS_UPDATED: "membersUpdated",
  CHATS_UPDATED: "chatsUpdated",
  CURRENT_USER_UPDATED: "currentUserUpdated",
} as const;

// Custom event dispatcher
const dispatchStorageEvent = (eventName: string, data: any) => {
  const event = new CustomEvent(eventName, { detail: data });
  window.dispatchEvent(event);
};

class StorageService {
  constructor() {
    this.initializeStorage();
  }

  // Reset storage and reinitialize with dummy data
  resetStorage() {
    localStorage.clear();
    this.initializeStorage();
  }

  // Initialize storage with dummy data
  initializeStorage() {
    // Initialize connections
    if (!localStorage.getItem(KEYS.CONNECTIONS)) {
      localStorage.setItem(
        KEYS.CONNECTIONS,
        JSON.stringify(initialConnections)
      );
    }

    // Initialize members
    if (!localStorage.getItem(KEYS.MEMBERS)) {
      const initialMembers = dummyMembers.map(convertDBMemberToMember);
      localStorage.setItem(KEYS.MEMBERS, JSON.stringify(initialMembers));
    }

    // Initialize chats
    if (!localStorage.getItem(KEYS.CHATS)) {
      localStorage.setItem(KEYS.CHATS, JSON.stringify(dummyChats));
    }
  }

  // Connections
  getConnections(): Connection[] {
    const data = localStorage.getItem(KEYS.CONNECTIONS);
    return data ? JSON.parse(data) : [];
  }

  setConnections(connections: Connection[]) {
    localStorage.setItem(KEYS.CONNECTIONS, JSON.stringify(connections));
    dispatchStorageEvent(STORAGE_EVENTS.CONNECTIONS_UPDATED, connections);
  }

  addConnection(connection: Connection) {
    try {
      const connections = this.getConnections();

      // Validate connection using policies
      ConnectionPolicies.validateConnection(
        connections,
        connection.userId,
        connection.targetUserId,
        connection.connectionType
      );

      // If validation passes, add the connection
      this.setConnections([...connections, connection]);
    } catch (error) {
      if (error instanceof ValidationError) {
        console.warn(`Connection validation failed: ${error.message}`);
      }
      throw error;
    }
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

  // Members
  getMembers(): Member[] {
    const data = localStorage.getItem(KEYS.MEMBERS);
    if (!data) {
      const initialMembers = dummyMembers.map(convertDBMemberToMember);
      this.setMembers(initialMembers);
      return initialMembers;
    }
    return JSON.parse(data);
  }

  setMembers(members: Member[]) {
    try {
      // Validate each member
      members.forEach((member) => {
        MemberPolicies.validateMember(member);
        MemberPolicies.validatePrivacySettings(member);
        MemberPolicies.validateTrainingArts(member);
      });

      localStorage.setItem(KEYS.MEMBERS, JSON.stringify(members));
      dispatchStorageEvent(STORAGE_EVENTS.MEMBERS_UPDATED, members);
    } catch (error) {
      if (error instanceof ValidationError) {
        console.warn(`Member validation failed: ${error.message}`);
      }
      throw error;
    }
  }

  updateMember(memberId: string, updates: Partial<Member>) {
    const members = this.getMembers();
    const updatedMembers = members.map((member) =>
      member.id === memberId ? { ...member, ...updates } : member
    );
    this.setMembers(updatedMembers);
  }

  // Chats
  getChats(): DBChat[] {
    const data = localStorage.getItem(KEYS.CHATS);
    return data ? JSON.parse(data) : [];
  }

  setChats(chats: DBChat[]) {
    localStorage.setItem(KEYS.CHATS, JSON.stringify(chats));
    dispatchStorageEvent(STORAGE_EVENTS.CHATS_UPDATED, chats);
  }

  addChat(chat: DBChat) {
    try {
      const connections = this.getConnections();

      // Validate chat using policies
      ChatPolicies.canChat(connections, chat.sender_id, chat.receiver_id);

      const chats = this.getChats();
      this.setChats([...chats, chat]);
    } catch (error) {
      if (error instanceof ValidationError) {
        console.warn(`Chat validation failed: ${error.message}`);
      }
      throw error;
    }
  }

  updateChat(chatId: string, updates: Partial<DBChat>) {
    const chats = this.getChats();
    const updatedChats = chats.map((chat) =>
      chat.id === chatId ? { ...chat, ...updates } : chat
    );
    this.setChats(updatedChats);
  }

  // Current User
  getCurrentUser(): string | null {
    return localStorage.getItem(KEYS.CURRENT_USER);
  }

  setCurrentUser(userId: string | null) {
    if (userId) {
      localStorage.setItem(KEYS.CURRENT_USER, userId);
    } else {
      localStorage.removeItem(KEYS.CURRENT_USER);
    }
    dispatchStorageEvent(STORAGE_EVENTS.CURRENT_USER_UPDATED, userId);
  }

  // Storage event listeners
  addStorageListener(
    eventName: string,
    callback: (event: CustomEvent) => void
  ) {
    window.addEventListener(eventName, callback as EventListener);
    return () =>
      window.removeEventListener(eventName, callback as EventListener);
  }

  // Clear all data
  clear() {
    localStorage.clear();
    dispatchStorageEvent(STORAGE_EVENTS.CONNECTIONS_UPDATED, []);
    dispatchStorageEvent(STORAGE_EVENTS.MEMBERS_UPDATED, []);
    dispatchStorageEvent(STORAGE_EVENTS.CHATS_UPDATED, []);
    dispatchStorageEvent(STORAGE_EVENTS.CURRENT_USER_UPDATED, null);
  }
}

// Create a singleton instance
const storageService = new StorageService();

export default storageService;
