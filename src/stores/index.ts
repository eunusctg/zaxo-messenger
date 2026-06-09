import { create } from 'zustand';

// ==================== App Store ====================
export type AppView = 'user' | 'admin';
export type UserTab = 'chats' | 'status' | 'calls' | 'qr' | 'profile';
export type AdminTab = 'dashboard' | 'users' | 'zaxo-numbers' | 'moderation' | 'config' | 'calling' | 'logs' | 'notifications';

interface AppState {
  currentApp: AppView;
  currentTab: UserTab | AdminTab;
  sidebarOpen: boolean;
  overlay: 'none' | 'contacts' | 'new-group' | 'new-broadcast' | 'camera' | 'media-gallery' | 'sticker-picker' | 'link-preview' | 'location-share' | 'contact-share' | 'poll-create' | 'chat-wallpaper' | 'app-lock' | 'e2e-info' | 'message-search' | 'voice-recorder';
  setApp: (app: AppView) => void;
  setTab: (tab: UserTab | AdminTab) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setOverlay: (overlay: AppState['overlay']) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentApp: 'user',
  currentTab: 'chats',
  sidebarOpen: false,
  overlay: 'none',
  setApp: (app) => set({ currentApp: app, currentTab: app === 'user' ? 'chats' : 'dashboard' }),
  setTab: (tab) => set({ currentTab: tab, overlay: 'none' }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setOverlay: (overlay) => set({ overlay }),
}));

// ==================== Auth Store ====================
interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  currentUser: UserPayload | null;
  isAppLocked: boolean;
  pinCode: string | null;
  login: (user: UserPayload, isAdmin?: boolean) => void;
  logout: () => void;
  lockApp: () => void;
  unlockApp: (pin: string) => void;
  setPinCode: (pin: string) => void;
}

export interface UserPayload {
  id: string;
  zaxoNumber: string;
  displayName: string;
  profilePicture: string | null;
  bio: string;
  status: string;
  isOnline: boolean;
  phone?: string;
  about?: string;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: true,
  isAdmin: false,
  isAppLocked: false,
  pinCode: null,
  currentUser: {
    id: 'demo-user-1',
    zaxoNumber: '482-719-356',
    displayName: 'Alex Morgan',
    profilePicture: null,
    bio: 'Building cool things with Zaxo!',
    status: 'Available',
    isOnline: true,
    phone: '+1-555-0101',
    about: 'Hey there! I am using Zaxo',
  },
  login: (user, isAdmin = false) => set({ isAuthenticated: true, currentUser: user, isAdmin }),
  logout: () => set({ isAuthenticated: false, currentUser: null, isAdmin: false }),
  lockApp: () => set({ isAppLocked: true }),
  unlockApp: (pin) => {
    const stored = get().pinCode;
    if (!stored || pin === stored) set({ isAppLocked: false });
  },
  setPinCode: (pin) => set({ pinCode: pin }),
}));

// ==================== Chat Store ====================
export interface Message {
  id: string;
  content: string;
  messageType: 'text' | 'image' | 'video' | 'document' | 'voice' | 'system' | 'location' | 'contact' | 'poll' | 'sticker' | 'link' | 'gif';
  senderId: string;
  chatId: string;
  replyToId?: string;
  replyTo?: { content: string; senderName: string } | null;
  isForwarded: boolean;
  isRead: boolean;
  isDelivered: boolean;
  reactions: string[];
  createdAt: string;
  mediaUrl?: string;
  isStarred: boolean;
  isDeleted: boolean;
  isEdited: boolean;
  deletedForEveryone: boolean;
  voiceDuration?: number;
  voiceWaveform?: number[];
  linkPreview?: { title: string; description: string; url: string; image?: string } | null;
  pollData?: { question: string; options: { text: string; votes: number; votedByMe: boolean }[] } | null;
  locationData?: { lat: number; lng: number; name: string } | null;
  contactData?: { name: string; zaxoNumber: string; phone: string } | null;
  disappearingAt?: string | null;
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
  isArchived: boolean;
  isDeleted: boolean;
  wallpaper: string | null;
  disappearingMessages: boolean;
  disappearingDuration: number; // hours: 24, 72, 168 (1 week)
  e2eEncrypted: boolean;
  pinnedMessages: string[]; // message IDs
  description?: string;
  createdBy?: string;
  groupAdmins?: string[];
  customNotifications: boolean;
  muteExpiry?: string | null;
}

interface ChatState {
  chats: Chat[];
  activeChat: Chat | null;
  messages: Record<string, Message[]>;
  typingUsers: Record<string, string[]>;
  searchQuery: string;
  messageSearchQuery: string;
  starredMessages: Message[];
  archivedChats: Chat[];
  setChats: (chats: Chat[]) => void;
  setActiveChat: (chat: Chat | null) => void;
  addMessage: (chatId: string, message: Message) => void;
  setMessages: (chatId: string, messages: Message[]) => void;
  setTyping: (chatId: string, userIds: string[]) => void;
  setSearchQuery: (q: string) => void;
  setMessageSearchQuery: (q: string) => void;
  markAsRead: (chatId: string) => void;
  deleteMessage: (chatId: string, messageId: string, forEveryone: boolean) => void;
  editMessage: (chatId: string, messageId: string, newContent: string) => void;
  starMessage: (chatId: string, messageId: string) => void;
  archiveChat: (chatId: string) => void;
  unarchiveChat: (chatId: string) => void;
  toggleChatMute: (chatId: string) => void;
  toggleDisappearing: (chatId: string, enabled: boolean, duration: number) => void;
  setChatWallpaper: (chatId: string, wallpaper: string) => void;
  pinMessage: (chatId: string, messageId: string) => void;
  addReaction: (chatId: string, messageId: string, reaction: string) => void;
  updateChat: (chatId: string, updates: Partial<Chat>) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  activeChat: null,
  messages: {},
  typingUsers: {},
  searchQuery: '',
  messageSearchQuery: '',
  starredMessages: [],
  archivedChats: [],
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
  setMessageSearchQuery: (q) => set({ messageSearchQuery: q }),
  markAsRead: (chatId) =>
    set((s) => ({
      chats: s.chats.map((c) => (c.id === chatId ? { ...c, unreadCount: 0 } : c)),
    })),
  deleteMessage: (chatId, messageId, forEveryone) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [chatId]: s.messages[chatId]?.map((m) =>
          m.id === messageId
            ? forEveryone
              ? { ...m, deletedForEveryone: true, content: 'This message was deleted', messageType: 'system' as const }
              : { ...m, isDeleted: true }
            : m
        ),
      },
    })),
  editMessage: (chatId, messageId, newContent) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [chatId]: s.messages[chatId]?.map((m) =>
          m.id === messageId ? { ...m, content: newContent, isEdited: true } : m
        ),
      },
    })),
  starMessage: (chatId, messageId) =>
    set((s) => {
      const msgs = s.messages[chatId] || [];
      const msg = msgs.find((m) => m.id === messageId);
      const updatedStarred = msg?.isStarred
        ? s.starredMessages.filter((m) => m.id !== messageId)
        : msg
          ? [...s.starredMessages, { ...msg, isStarred: true }]
          : s.starredMessages;
      return {
        messages: {
          ...s.messages,
          [chatId]: msgs.map((m) =>
            m.id === messageId ? { ...m, isStarred: !m.isStarred } : m
          ),
        },
        starredMessages: updatedStarred,
      };
    }),
  archiveChat: (chatId) =>
    set((s) => {
      const chat = s.chats.find((c) => c.id === chatId);
      if (!chat) return s;
      return {
        chats: s.chats.filter((c) => c.id !== chatId),
        archivedChats: [...s.archivedChats, { ...chat, isArchived: true }],
      };
    }),
  unarchiveChat: (chatId) =>
    set((s) => {
      const chat = s.archivedChats.find((c) => c.id === chatId);
      if (!chat) return s;
      return {
        archivedChats: s.archivedChats.filter((c) => c.id !== chatId),
        chats: [{ ...chat, isArchived: false }, ...s.chats],
      };
    }),
  toggleChatMute: (chatId) =>
    set((s) => ({
      chats: s.chats.map((c) =>
        c.id === chatId ? { ...c, isMuted: !c.isMuted } : c
      ),
    })),
  toggleDisappearing: (chatId, enabled, duration) =>
    set((s) => ({
      chats: s.chats.map((c) =>
        c.id === chatId ? { ...c, disappearingMessages: enabled, disappearingDuration: duration } : c
      ),
    })),
  setChatWallpaper: (chatId, wallpaper) =>
    set((s) => ({
      chats: s.chats.map((c) =>
        c.id === chatId ? { ...c, wallpaper } : c
      ),
    })),
  pinMessage: (chatId, messageId) =>
    set((s) => ({
      chats: s.chats.map((c) => {
        if (c.id !== chatId) return c;
        const pinned = c.pinnedMessages.includes(messageId)
          ? c.pinnedMessages.filter((id) => id !== messageId)
          : [...c.pinnedMessages, messageId];
        return { ...c, pinnedMessages: pinned };
      }),
    })),
  addReaction: (chatId, messageId, reaction) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [chatId]: s.messages[chatId]?.map((m) =>
          m.id === messageId ? { ...m, reactions: [...m.reactions, reaction] } : m
        ),
      },
    })),
  updateChat: (chatId, updates) =>
    set((s) => ({
      chats: s.chats.map((c) => c.id === chatId ? { ...c, ...updates } : c),
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
  isGroup: boolean;
  participants?: { id: string; name: string }[];
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

// ==================== Status/Stories Store ====================
export interface StatusItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  type: 'text' | 'image' | 'video';
  content: string;
  backgroundColor?: string;
  textColor?: string;
  mediaUrl?: string;
  createdAt: string;
  expiresAt: string;
  seenBy: string[];
  isMyStatus: boolean;
  repliedTo?: { statusId: string; userId: string; message: string } | null;
}

interface StatusState {
  myStatuses: StatusItem[];
  contactStatuses: StatusItem[];
  viewedStatuses: StatusItem[];
  statusPrivacy: 'everyone' | 'contacts' | 'none' | 'selected';
  selectedPrivacyContacts: string[];
  setMyStatuses: (statuses: StatusItem[]) => void;
  setContactStatuses: (statuses: StatusItem[]) => void;
  setViewedStatuses: (statuses: StatusItem[]) => void;
  addMyStatus: (status: StatusItem) => void;
  markStatusViewed: (statusId: string) => void;
  setStatusPrivacy: (privacy: StatusState['statusPrivacy']) => void;
}

export const useStatusStore = create<StatusState>((set) => ({
  myStatuses: [],
  contactStatuses: [],
  viewedStatuses: [],
  statusPrivacy: 'everyone',
  selectedPrivacyContacts: [],
  setMyStatuses: (statuses) => set({ myStatuses: statuses }),
  setContactStatuses: (statuses) => set({ contactStatuses: statuses }),
  setViewedStatuses: (statuses) => set({ viewedStatuses: statuses }),
  addMyStatus: (status) => set((s) => ({ myStatuses: [...s.myStatuses, status] })),
  markStatusViewed: (statusId) =>
    set((s) => {
      const status = s.contactStatuses.find((st) => st.id === statusId);
      if (!status) return s;
      return {
        contactStatuses: s.contactStatuses.filter((st) => st.id !== statusId),
        viewedStatuses: [...s.viewedStatuses, { ...status, seenBy: [...status.seenBy, 'demo-user-1'] }],
      };
    }),
  setStatusPrivacy: (privacy) => set({ statusPrivacy: privacy }),
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
