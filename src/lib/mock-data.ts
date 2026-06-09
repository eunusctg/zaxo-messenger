import { Chat, Message } from '@/stores';
import { CallRecord } from '@/stores';

// Mock users for demo
export const mockUsers = [
  { id: 'demo-user-1', zaxoNumber: '482-719-356', displayName: 'Alex Morgan', profilePicture: null, bio: 'Building cool things with Zaxo!', status: 'Available', isOnline: true },
  { id: 'user-2', zaxoNumber: '291-834-567', displayName: 'Sarah Chen', profilePicture: null, bio: 'Designer & Creative Thinker', status: 'At work', isOnline: true },
  { id: 'user-3', zaxoNumber: '738-456-129', displayName: 'Marcus Johnson', profilePicture: null, bio: 'Full-stack developer', status: 'Busy', isOnline: false },
  { id: 'user-4', zaxoNumber: '564-893-712', displayName: 'Elena Rodriguez', profilePicture: null, bio: 'Exploring the world 🌍', status: 'Traveling', isOnline: true },
  { id: 'user-5', zaxoNumber: '847-261-935', displayName: 'David Kim', profilePicture: null, bio: 'Music lover & coffee addict', status: 'In a meeting', isOnline: false },
  { id: 'user-6', zaxoNumber: '193-678-452', displayName: 'Aisha Patel', profilePicture: null, bio: 'Product Manager @TechCorp', status: 'Available', isOnline: true },
  { id: 'user-7', zaxoNumber: '625-914-387', displayName: 'James Wilson', profilePicture: null, bio: 'Photographer | Storyteller', status: 'Out shooting', isOnline: false },
  { id: 'user-8', zaxoNumber: '381-547-629', displayName: 'Yuki Tanaka', profilePicture: null, bio: 'AI researcher & cat person', status: 'Studying', isOnline: true },
];

// Mock chats
export const mockChats: Chat[] = [
  {
    id: 'chat-1',
    name: 'Sarah Chen',
    avatar: null,
    isGroup: false,
    isChannel: false,
    members: ['demo-user-1', 'user-2'],
    lastMessage: 'Hey! Are you coming to the design review?',
    lastMessageTime: '2:34 PM',
    unreadCount: 2,
    isPinned: true,
    isMuted: false,
    isTyping: false,
  },
  {
    id: 'chat-2',
    name: 'Marcus Johnson',
    avatar: null,
    isGroup: false,
    isChannel: false,
    members: ['demo-user-1', 'user-3'],
    lastMessage: 'The API endpoint is ready for testing',
    lastMessageTime: '1:15 PM',
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    isTyping: false,
  },
  {
    id: 'chat-3',
    name: 'Project Alpha Team',
    avatar: null,
    isGroup: true,
    isChannel: false,
    members: ['demo-user-1', 'user-2', 'user-3', 'user-6'],
    lastMessage: 'Aisha: Let\'s sync up tomorrow morning',
    lastMessageTime: '12:45 PM',
    unreadCount: 5,
    isPinned: true,
    isMuted: false,
    isTyping: true,
  },
  {
    id: 'chat-4',
    name: 'Elena Rodriguez',
    avatar: null,
    isGroup: false,
    isChannel: false,
    members: ['demo-user-1', 'user-4'],
    lastMessage: 'Check out these photos from Kyoto! 🏯',
    lastMessageTime: '11:30 AM',
    unreadCount: 1,
    isPinned: false,
    isMuted: false,
    isTyping: false,
  },
  {
    id: 'chat-5',
    name: 'Zaxo Updates',
    avatar: null,
    isGroup: false,
    isChannel: true,
    members: [],
    lastMessage: 'New feature: Group video calls are here! 🎉',
    lastMessageTime: '10:00 AM',
    unreadCount: 0,
    isPinned: false,
    isMuted: true,
    isTyping: false,
  },
  {
    id: 'chat-6',
    name: 'David Kim',
    avatar: null,
    isGroup: false,
    isChannel: false,
    members: ['demo-user-1', 'user-5'],
    lastMessage: 'Have you heard the new album?',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    isTyping: false,
  },
  {
    id: 'chat-7',
    name: 'Family Group',
    avatar: null,
    isGroup: true,
    isChannel: false,
    members: ['demo-user-1', 'user-5', 'user-7'],
    lastMessage: 'Mom: Don\'t forget dinner on Sunday!',
    lastMessageTime: 'Yesterday',
    unreadCount: 3,
    isPinned: false,
    isMuted: false,
    isTyping: false,
  },
  {
    id: 'chat-8',
    name: 'Yuki Tanaka',
    avatar: null,
    isGroup: false,
    isChannel: false,
    members: ['demo-user-1', 'user-8'],
    lastMessage: 'That ML paper was fascinating!',
    lastMessageTime: 'Mon',
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    isTyping: false,
  },
];

// Mock messages for each chat
export const mockMessages: Record<string, Message[]> = {
  'chat-1': [
    { id: 'm1', content: 'Hi Alex! How are you doing?', messageType: 'text', senderId: 'user-2', chatId: 'chat-1', isForwarded: false, isRead: true, isDelivered: true, reactions: [], createdAt: '2:20 PM' },
    { id: 'm2', content: 'Hey Sarah! I\'m good, just finishing up some code. What about you?', messageType: 'text', senderId: 'demo-user-1', chatId: 'chat-1', isForwarded: false, isRead: true, isDelivered: true, reactions: ['👍'], createdAt: '2:22 PM' },
    { id: 'm3', content: 'Great! Working on the new dashboard designs', messageType: 'text', senderId: 'user-2', chatId: 'chat-1', isForwarded: false, isRead: true, isDelivered: true, reactions: [], createdAt: '2:25 PM' },
    { id: 'm4', content: 'That sounds awesome! Can\'t wait to see them', messageType: 'text', senderId: 'demo-user-1', chatId: 'chat-1', isForwarded: false, isRead: true, isDelivered: true, reactions: [], createdAt: '2:27 PM' },
    { id: 'm5', content: 'Hey! Are you coming to the design review?', messageType: 'text', senderId: 'user-2', chatId: 'chat-1', isForwarded: false, isRead: false, isDelivered: true, reactions: [], createdAt: '2:34 PM' },
    { id: 'm6', content: 'It\'s at 4 PM in the main conference room', messageType: 'text', senderId: 'user-2', chatId: 'chat-1', isForwarded: false, isRead: false, isDelivered: true, reactions: [], createdAt: '2:34 PM' },
  ],
  'chat-2': [
    { id: 'm10', content: 'Hey Marcus, how\'s the API integration going?', messageType: 'text', senderId: 'demo-user-1', chatId: 'chat-2', isForwarded: false, isRead: true, isDelivered: true, reactions: [], createdAt: '12:45 PM' },
    { id: 'm11', content: 'Making good progress! Should be done by EOD', messageType: 'text', senderId: 'user-3', chatId: 'chat-2', isForwarded: false, isRead: true, isDelivered: true, reactions: [], createdAt: '1:00 PM' },
    { id: 'm12', content: 'The API endpoint is ready for testing', messageType: 'text', senderId: 'user-3', chatId: 'chat-2', isForwarded: false, isRead: true, isDelivered: true, reactions: ['🎉'], createdAt: '1:15 PM' },
  ],
  'chat-3': [
    { id: 'm20', content: 'Team, we need to discuss the sprint goals for next week', messageType: 'text', senderId: 'user-6', chatId: 'chat-3', isForwarded: false, isRead: true, isDelivered: true, reactions: [], createdAt: '12:00 PM' },
    { id: 'm21', content: 'I\'ve prepared the backlog items', messageType: 'text', senderId: 'user-3', chatId: 'chat-3', isForwarded: false, isRead: true, isDelivered: true, reactions: [], createdAt: '12:15 PM' },
    { id: 'm22', content: 'Great! Let\'s also review the design mockups', messageType: 'text', senderId: 'user-2', chatId: 'chat-3', isForwarded: false, isRead: true, isDelivered: true, reactions: [], createdAt: '12:20 PM' },
    { id: 'm23', content: 'I\'ll add the performance metrics report to the agenda', messageType: 'text', senderId: 'demo-user-1', chatId: 'chat-3', isForwarded: false, isRead: true, isDelivered: true, reactions: [], createdAt: '12:30 PM' },
    { id: 'm24', content: 'Perfect, I\'ll set up the meeting room', messageType: 'text', senderId: 'user-6', chatId: 'chat-3', isForwarded: false, isRead: true, isDelivered: true, reactions: ['👍'], createdAt: '12:35 PM' },
    { id: 'm25', content: 'Let\'s sync up tomorrow morning', messageType: 'text', senderId: 'user-6', chatId: 'chat-3', isForwarded: false, isRead: false, isDelivered: true, reactions: [], createdAt: '12:45 PM' },
  ],
  'chat-4': [
    { id: 'm30', content: 'Alex! You won\'t believe where I am right now 😍', messageType: 'text', senderId: 'user-4', chatId: 'chat-4', isForwarded: false, isRead: true, isDelivered: true, reactions: [], createdAt: '11:00 AM' },
    { id: 'm31', content: 'Where??', messageType: 'text', senderId: 'demo-user-1', chatId: 'chat-4', isForwarded: false, isRead: true, isDelivered: true, reactions: [], createdAt: '11:05 AM' },
    { id: 'm32', content: 'Check out these photos from Kyoto! 🏯', messageType: 'text', senderId: 'user-4', chatId: 'chat-4', isForwarded: false, isRead: false, isDelivered: true, reactions: [], createdAt: '11:30 PM' },
  ],
};

// Mock call history
export const mockCallHistory: CallRecord[] = [
  { id: 'call-1', callerId: 'demo-user-1', callerName: 'Alex Morgan', callerNumber: '482-719-356', receiverId: 'user-2', receiverName: 'Sarah Chen', receiverNumber: '291-834-567', callType: 'video', status: 'completed', duration: 1847, timestamp: '2:34 PM' },
  { id: 'call-2', callerId: 'user-3', callerName: 'Marcus Johnson', callerNumber: '738-456-129', receiverId: 'demo-user-1', receiverName: 'Alex Morgan', receiverNumber: '482-719-356', callType: 'audio', status: 'missed', duration: 0, timestamp: '1:15 PM' },
  { id: 'call-3', callerId: 'demo-user-1', callerName: 'Alex Morgan', callerNumber: '482-719-356', receiverId: 'user-6', receiverName: 'Aisha Patel', receiverNumber: '193-678-452', callType: 'audio', status: 'completed', duration: 432, timestamp: '11:30 AM' },
  { id: 'call-4', callerId: 'user-4', callerName: 'Elena Rodriguez', callerNumber: '564-893-712', receiverId: 'demo-user-1', receiverName: 'Alex Morgan', receiverNumber: '482-719-356', callType: 'video', status: 'completed', duration: 2356, timestamp: 'Yesterday' },
  { id: 'call-5', callerId: 'demo-user-1', callerName: 'Alex Morgan', callerNumber: '482-719-356', receiverId: 'user-8', receiverName: 'Yuki Tanaka', receiverNumber: '381-547-629', callType: 'audio', status: 'outgoing', duration: 189, timestamp: 'Yesterday' },
  { id: 'call-6', callerId: 'user-5', callerName: 'David Kim', callerNumber: '847-261-935', receiverId: 'demo-user-1', receiverName: 'Alex Morgan', receiverNumber: '482-719-356', callType: 'audio', status: 'missed', duration: 0, timestamp: 'Mon' },
];

// Mock admin users for admin panel
export const mockAdminUsers = [
  { id: 'user-2', zaxoNumber: '291-834-567', displayName: 'Sarah Chen', profilePicture: null, phoneNumber: '+1-555-0102', isOnline: true, isSuspended: false, isBanned: false, lastSeen: 'Now', createdAt: '2025-08-15' },
  { id: 'user-3', zaxoNumber: '738-456-129', displayName: 'Marcus Johnson', profilePicture: null, phoneNumber: '+1-555-0103', isOnline: false, isSuspended: false, isBanned: false, lastSeen: '2 hours ago', createdAt: '2025-09-02' },
  { id: 'user-4', zaxoNumber: '564-893-712', displayName: 'Elena Rodriguez', profilePicture: null, phoneNumber: '+1-555-0104', isOnline: true, isSuspended: false, isBanned: false, lastSeen: 'Now', createdAt: '2025-10-18' },
  { id: 'user-5', zaxoNumber: '847-261-935', displayName: 'David Kim', profilePicture: null, phoneNumber: '+1-555-0105', isOnline: false, isSuspended: false, isBanned: false, lastSeen: '1 day ago', createdAt: '2025-11-05' },
  { id: 'user-6', zaxoNumber: '193-678-452', displayName: 'Aisha Patel', profilePicture: null, phoneNumber: '+1-555-0106', isOnline: true, isSuspended: false, isBanned: false, lastSeen: 'Now', createdAt: '2025-12-01' },
  { id: 'user-7', zaxoNumber: '625-914-387', displayName: 'James Wilson', profilePicture: null, phoneNumber: '+1-555-0107', isOnline: false, isSuspended: true, isBanned: false, lastSeen: '3 days ago', createdAt: '2026-01-10' },
  { id: 'user-8', zaxoNumber: '381-547-629', displayName: 'Yuki Tanaka', profilePicture: null, phoneNumber: '+1-555-0108', isOnline: true, isSuspended: false, isBanned: false, lastSeen: 'Now', createdAt: '2026-02-14' },
  { id: 'user-9', zaxoNumber: '914-372-851', displayName: 'Liam O\'Brien', profilePicture: null, phoneNumber: '+1-555-0109', isOnline: false, isSuspended: false, isBanned: true, lastSeen: '2 weeks ago', createdAt: '2026-03-20' },
  { id: 'user-10', zaxoNumber: '457-683-129', displayName: 'Priya Sharma', profilePicture: null, phoneNumber: '+1-555-0110', isOnline: true, isSuspended: false, isBanned: false, lastSeen: 'Now', createdAt: '2026-04-08' },
  { id: 'user-11', zaxoNumber: '628-195-473', displayName: 'Carlos Mendez', profilePicture: null, phoneNumber: '+1-555-0111', isOnline: false, isSuspended: false, isBanned: false, lastSeen: '5 hours ago', createdAt: '2026-05-01' },
];

// Mock reports for admin moderation
export const mockReports = [
  { id: 'r1', reporterId: 'user-2', reporterName: 'Sarah Chen', targetId: 'user-9', targetName: 'Liam O\'Brien', targetType: 'user', reason: 'Spam', description: 'Sending unsolicited promotional messages', status: 'pending', createdAt: '2026-06-09 08:30' },
  { id: 'r2', reporterId: 'user-4', reporterName: 'Elena Rodriguez', targetId: 'msg-456', targetName: 'Message in Chat #3', targetType: 'message', reason: 'Inappropriate content', description: 'Offensive language in group chat', status: 'pending', createdAt: '2026-06-09 07:15' },
  { id: 'r3', reporterId: 'user-6', reporterName: 'Aisha Patel', targetId: 'user-9', targetName: 'Liam O\'Brien', targetType: 'user', reason: 'Harassment', description: 'Repeated unwanted messages after being asked to stop', status: 'reviewed', createdAt: '2026-06-08 14:20' },
  { id: 'r4', reporterId: 'user-3', reporterName: 'Marcus Johnson', targetId: 'msg-789', targetName: 'Media in Chat #7', targetType: 'message', reason: 'NSFW', description: 'Explicit content shared in family group', status: 'resolved', createdAt: '2026-06-07 22:45' },
  { id: 'r5', reporterId: 'user-8', reporterName: 'Yuki Tanaka', targetId: 'user-12', targetName: 'Unknown User', targetType: 'user', reason: 'Spam', description: 'Bot-like behavior, sending identical messages', status: 'pending', createdAt: '2026-06-09 09:00' },
];

// Mock audit logs
export const mockAuditLogs = [
  { id: 'al1', adminId: 'admin-1', adminName: 'System Admin', action: 'User suspended', target: 'James Wilson (625-914-387)', details: 'Violation of community guidelines', ipAddress: '192.168.1.45', createdAt: '2026-06-09 08:00' },
  { id: 'al2', adminId: 'admin-1', adminName: 'System Admin', action: 'User banned', target: 'Liam O\'Brien (914-372-851)', details: 'Repeated spam violations', ipAddress: '192.168.1.45', createdAt: '2026-06-08 16:30' },
  { id: 'al3', adminId: 'admin-2', adminName: 'Ops Manager', action: 'Feature flag updated', target: 'group_video_calls', details: 'Enabled for all users', ipAddress: '10.0.0.12', createdAt: '2026-06-08 10:00' },
  { id: 'al4', adminId: 'admin-1', adminName: 'System Admin', action: 'System config changed', target: 'max_call_duration', details: 'Changed from 60min to 120min', ipAddress: '192.168.1.45', createdAt: '2026-06-07 14:15' },
  { id: 'al5', adminId: 'admin-2', adminName: 'Ops Manager', action: 'Content removed', target: 'Message msg-789', details: 'NSFW content removed from Family Group', ipAddress: '10.0.0.12', createdAt: '2026-06-07 23:00' },
  { id: 'al6', adminId: 'admin-1', adminName: 'System Admin', action: 'Notification sent', target: 'All users', details: 'Maintenance window announced', ipAddress: '192.168.1.45', createdAt: '2026-06-06 09:30' },
];

// Weekly user growth data for charts
export const weeklyGrowthData = [
  { day: 'Mon', users: 124500, messages: 1120000, calls: 4200 },
  { day: 'Tue', users: 125200, messages: 1180000, calls: 4500 },
  { day: 'Wed', users: 126100, messages: 1210000, calls: 4100 },
  { day: 'Thu', users: 126800, messages: 1190000, calls: 4800 },
  { day: 'Fri', users: 127400, messages: 1250000, calls: 5100 },
  { day: 'Sat', users: 127900, messages: 1080000, calls: 5800 },
  { day: 'Sun', users: 128459, messages: 1150000, calls: 5400 },
];

// Monthly user growth data
export const monthlyGrowthData = [
  { month: 'Jan', users: 98000 },
  { month: 'Feb', users: 102000 },
  { month: 'Mar', users: 106500 },
  { month: 'Apr', users: 110200 },
  { month: 'May', users: 118000 },
  { month: 'Jun', users: 128459 },
];

// Geographic distribution data
export const geoDistribution = [
  { region: 'North America', users: 45000, percentage: 35 },
  { region: 'Europe', users: 32000, percentage: 25 },
  { region: 'Asia Pacific', users: 28000, percentage: 22 },
  { region: 'Latin America', users: 13000, percentage: 10 },
  { region: 'Africa', users: 6500, percentage: 5 },
  { region: 'Middle East', users: 3959, percentage: 3 },
];
