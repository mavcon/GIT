import { Member, Connection } from "../types/member";
import { Chat } from "../types/chat";
import { DBNotification, DBChat } from "../db/schema";
import {
  dummyMembers,
  dummyChats,
  dummyNotifications,
  convertDBMemberToMember
} from "../db/dummy-data";

// Storage events for pub/sub
export const STORAGE_EVENTS = {
  MEMBERS_UPDATED: 'MEMBERS_UPDATED',
  CHATS_UPDATED: 'CHATS_UPDATED',
  NOTIFICATIONS_UPDATED: 'NOTIFICATIONS_UPDATED',
  CONNECTIONS_UPDATED: 'CONNECTIONS_UPDATED'
} as const;

// Local storage keys
const MEMBERS_KEY = 'members';
const CHATS_KEY = 'chats';
const NOTIFICATIONS_KEY = 'notifications';
const CONNECTIONS_KEY = 'connections';

// Event listeners
const listeners: { [key: string]: Function[] } = {};

// Storage event handling
const dispatchStorageEvent = (eventName: string) => {
  if (listeners[eventName]) {
    listeners[eventName].forEach(listener => listener());
  }
};

export const addStorageListener = (eventName: string, listener: Function) => {
  if (!listeners[eventName]) {
    listeners[eventName] = [];
  }
  listeners[eventName].push(listener);
  return () => {
    listeners[eventName] = listeners[eventName].filter(l => l !== listener);
  };
};

// Initialize storage with dummy data
export const initializeStorage = () => {
  if (!localStorage.getItem(MEMBERS_KEY)) {
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(dummyMembers));
  }
  if (!localStorage.getItem(CHATS_KEY)) {
    localStorage.setItem(CHATS_KEY, JSON.stringify(dummyChats));
  }
  if (!localStorage.getItem(NOTIFICATIONS_KEY)) {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(dummyNotifications));
  }
  if (!localStorage.getItem(CONNECTIONS_KEY)) {
    localStorage.setItem(CONNECTIONS_KEY, JSON.stringify([]));
  }
};

// Reset storage (useful for development)
export const resetStorage = () => {
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(dummyMembers));
  localStorage.setItem(CHATS_KEY, JSON.stringify(dummyChats));
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(dummyNotifications));
  localStorage.setItem(CONNECTIONS_KEY, JSON.stringify([]));
};

// Member storage operations
export const getMembers = (): Member[] => {
  const membersJson = localStorage.getItem(MEMBERS_KEY);
  if (!membersJson) return [];
  const dbMembers = JSON.parse(membersJson);
  return dbMembers.map(convertDBMemberToMember);
};

export const setMembers = (members: Member[]) => {
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
  dispatchStorageEvent(STORAGE_EVENTS.MEMBERS_UPDATED);
};

export const updateMember = (memberId: string, updates: Partial<Member>) => {
  const members = getMembers();
  const memberIndex = members.findIndex(m => m.id === memberId);
  if (memberIndex !== -1) {
    members[memberIndex] = { ...members[memberIndex], ...updates };
    setMembers(members);
  }
};

// Connection storage operations
export const getConnections = (): Connection[] => {
  const connectionsJson = localStorage.getItem(CONNECTIONS_KEY);
  if (!connectionsJson) return [];
  return JSON.parse(connectionsJson);
};

export const addConnection = (connection: Connection) => {
  const connections = getConnections();
  connections.push(connection);
  localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(connections));
  dispatchStorageEvent(STORAGE_EVENTS.CONNECTIONS_UPDATED);
};

export const removeConnection = (userId: string, targetUserId: string, connectionType: Connection['connectionType']) => {
  const connections = getConnections();
  const updatedConnections = connections.filter(
    c => !(c.userId === userId && c.targetUserId === targetUserId && c.connectionType === connectionType)
  );
  localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(updatedConnections));
  dispatchStorageEvent(STORAGE_EVENTS.CONNECTIONS_UPDATED);
};

// Chat storage operations
export const getChats = (): DBChat[] => {
  const chatsJson = localStorage.getItem(CHATS_KEY);
  if (!chatsJson) return [];
  return JSON.parse(chatsJson);
};

export const setChats = (chats: DBChat[]) => {
  localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
  dispatchStorageEvent(STORAGE_EVENTS.CHATS_UPDATED);
};

export const addChat = (chat: DBChat) => {
  const chats = getChats();
  chats.push(chat);
  setChats(chats);
};

// Notification storage operations
export const getStoredNotifications = (): DBNotification[] => {
  const notificationsJson = localStorage.getItem(NOTIFICATIONS_KEY);
  if (!notificationsJson) return [];
  return JSON.parse(notificationsJson);
};

export const addStoredNotification = (notification: DBNotification) => {
  const notifications = getStoredNotifications();
  notifications.push(notification);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  dispatchStorageEvent(STORAGE_EVENTS.NOTIFICATIONS_UPDATED);
};

export const updateStoredNotification = (notificationId: string, updates: Partial<DBNotification>) => {
  const notifications = getStoredNotifications();
  const notificationIndex = notifications.findIndex((n: DBNotification) => n.id === notificationId);
  if (notificationIndex !== -1) {
    notifications[notificationIndex] = { ...notifications[notificationIndex], ...updates };
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    dispatchStorageEvent(STORAGE_EVENTS.NOTIFICATIONS_UPDATED);
  }
};

export const markStoredNotificationAsRead = (notificationId: string) => {
  updateStoredNotification(notificationId, { 
    is_read: true, 
    read_at: new Date().toISOString() 
  });
};

export const markAllStoredNotificationsAsRead = () => {
  const notifications = getStoredNotifications();
  const updatedNotifications = notifications.map((notification: DBNotification) => ({
    ...notification,
    is_read: true,
    read_at: new Date().toISOString()
  }));
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
  dispatchStorageEvent(STORAGE_EVENTS.NOTIFICATIONS_UPDATED);
};

// Default export with all methods
const storageService = {
  initializeStorage,
  resetStorage,
  addStorageListener,
  // Members
  getMembers,
  setMembers,
  updateMember,
  // Connections
  getConnections,
  addConnection,
  removeConnection,
  // Chats
  getChats,
  setChats,
  addChat,
  // Notifications
  getStoredNotifications,
  addStoredNotification,
  updateStoredNotification,
  markStoredNotificationAsRead,
  markAllStoredNotificationsAsRead
};

export default storageService;
