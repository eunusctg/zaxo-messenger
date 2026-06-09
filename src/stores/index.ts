import { create } from 'zustand';

// ==================== App Store ====================
export type AppView = 'user' | 'admin';
export type UserTab = 'chats' | 'calls' | 'qr' | 'profile';
export type AdminTab = 'dashboard' | 'users' | 'zaxo-numbers' | 'moderation' | 'config' | 'calling' | 'logs' | 'notifications';

interface AppState {
  currentApp: AppView;
  currentTab: UserTab | AdminTab;
  sidebarOpen: boolean;
  setApp: (app: AppView) => void;
  setTab: (tab: UserTab | AdminTab) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentApp: 'user',
  currentTab: 'chats',
  sidebarOpen: false,
  setApp: (app) => set({ currentApp: app, currentTab: app === 'user' ? 'chats' : 'dashboard' }),
  setTab: (tab) => set({ currentTab: tab }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));

// ==================== Auth Store ====================
interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  currentUser: UserPayload | null;
  login: (user: UserPayload, isAdmin?: boolean) => void;
  logout: () => void;
}

export interface UserPayload {
  id: string;
  zaxoNumber: string;
  displayName: string;
  profilePicture: string | null;
  bio: string;
  status: string;
  isOnline: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: true, // Start logged in for demo
  isAdmin: false,
  currentUser: {
    id: 'demo-user-1',
    zaxoNumber: '482-719-356',
    displayName: 'Alex Morgan',
    profilePicture: null,
    bio: 'Building cool things with Zaxo!',
    status: 'Available',
    isOnline: true,
  },
  login: (user, isAdmin = false) => set({ isAuthenticated: true, currentUser: user, isAdmin }),
  logout: () => set({ isAuthenticated: false, currentUser: null, isAdmin: false }),
}));

// ==================== Chat Store ====================
export interface Message {
  id: string;
  content: string;
  messageType: 'text' | 'image' | 'video' | 'document' | 'voice' | 'system';
  senderId: string;
  chatId: string;
  replyToId?: string;
  isForwarded: boolean;
  isRead: boolean;
  isDelivered: boolean;
  reactions: string[];
  createdAt: string;
  mediaUrl?: string;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string | null;
  isGroup: boolean;
  isChannel: boolean;
  members: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isTyping: boolean;
}

interface ChatState {
  chats: Chat[];
  activeChat: Chat | null;
  messages: Record<string, Message[]>;
  typingUsers: Record<string, string[]>;
  searchQuery: string;
  setChats: (chats: Chat[]) => void;
  setActiveChat: (chat: Chat | null) => void;
  addMessage: (chatId: string, message: Message) => void;
  setMessages: (chatId: string, messages: Message[]) => void;
  setTyping: (chatId: string, userIds: string[]) => void;
  setSearchQuery: (q: string) => void;
  markAsRead: (chatId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  activeChat: null,
  messages: {},
  typingUsers: {},
  searchQuery: '',
  setChats: (chats) => set({ chats }),
  setActiveChat: (chat) => set({ activeChat: chat }),
  addMessage: (chatId, message) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [chatId]: [...(s.messages[chatId] || []), message],
      },
    })),
  setMessages: (chatId, messages) =>
    set((s) => ({
      messages: { ...s.messages, [chatId]: messages },
    })),
  setTyping: (chatId, userIds) =>
    set((s) => ({
      typingUsers: { ...s.typingUsers, [chatId]: userIds },
    })),
  setSearchQuery: (q) => set({ searchQuery: q }),
  markAsRead: (chatId) =>
    set((s) => ({
      chats: s.chats.map((c) => (c.id === chatId ? { ...c, unreadCount: 0 } : c)),
    })),
}));

// ==================== Call Store ====================
export interface CallRecord {
  id: string;
  callerId: string;
  callerName: string;
  callerNumber: string;
  receiverId: string;
  receiverName: string;
  receiverNumber: string;
  callType: 'audio' | 'video';
  status: 'incoming' | 'outgoing' | 'missed' | 'completed';
  duration: number;
  timestamp: string;
}

interface CallState {
  activeCall: {
    id: string;
    callType: 'audio' | 'video';
    isGroup: boolean;
    participants: { id: string; name: string; avatar: string | null }[];
    status: 'ringing' | 'connected' | 'ended';
    isMuted: boolean;
    isSpeakerOn: boolean;
    isVideoOn: boolean;
    duration: number;
  } | null;
  callHistory: CallRecord[];
  setActiveCall: (call: CallState['activeCall']) => void;
  updateCallStatus: (status: 'ringing' | 'connected' | 'ended') => void;
  toggleMute: () => void;
  toggleSpeaker: () => void;
  toggleVideo: () => void;
  endCall: () => void;
  setCallHistory: (history: CallRecord[]) => void;
}

export const useCallStore = create<CallState>((set) => ({
  activeCall: null,
  callHistory: [],
  setActiveCall: (call) => set({ activeCall: call }),
  updateCallStatus: (status) =>
    set((s) => ({
      activeCall: s.activeCall ? { ...s.activeCall, status } : null,
    })),
  toggleMute: () =>
    set((s) => ({
      activeCall: s.activeCall ? { ...s.activeCall, isMuted: !s.activeCall.isMuted } : null,
    })),
  toggleSpeaker: () =>
    set((s) => ({
      activeCall: s.activeCall ? { ...s.activeCall, isSpeakerOn: !s.activeCall.isSpeakerOn } : null,
    })),
  toggleVideo: () =>
    set((s) => ({
      activeCall: s.activeCall ? { ...s.activeCall, isVideoOn: !s.activeCall.isVideoOn } : null,
    })),
  endCall: () => set({ activeCall: null }),
  setCallHistory: (history) => set({ callHistory: history }),
}));

// ==================== Admin Store ====================
export interface AdminStats {
  totalUsers: number;
  activeToday: number;
  newRegistrations: number;
  totalMessages: number;
  audioCalls: number;
  videoCalls: number;
  serverHealth: number;
  revenue: number;
}

export interface AdminUser {
  id: string;
  zaxoNumber: string;
  displayName: string;
  profilePicture: string | null;
  phoneNumber: string;
  isOnline: boolean;
  isSuspended: boolean;
  isBanned: boolean;
  lastSeen: string;
  createdAt: string;
}

interface AdminState {
  stats: AdminStats;
  users: AdminUser[];
  reports: any[];
  auditLogs: any[];
  systemConfig: Record<string, string>;
  setStats: (stats: AdminStats) => void;
  setUsers: (users: AdminUser[]) => void;
  setReports: (reports: any[]) => void;
  setAuditLogs: (logs: any[]) => void;
  setSystemConfig: (config: Record<string, string>) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  stats: {
    totalUsers: 128459,
    activeToday: 34782,
    newRegistrations: 1247,
    totalMessages: 8429561,
    audioCalls: 23451,
    videoCalls: 12847,
    serverHealth: 99.7,
    revenue: 45892,
  },
  users: [],
  reports: [],
  auditLogs: [],
  systemConfig: {},
  setStats: (stats) => set({ stats }),
  setUsers: (users) => set({ users }),
  setReports: (reports) => set({ reports }),
  setAuditLogs: (logs) => set({ auditLogs: logs }),
  setSystemConfig: (config) => set({ systemConfig: config }),
}));
