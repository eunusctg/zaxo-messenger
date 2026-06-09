import { Chat, Message } from '@/stores';
import { CallRecord } from '@/stores';
import { StatusItem } from '@/stores';

// Mock users for demo
export const mockUsers = [
  { id: 'demo-user-1', zaxoNumber: '482-719-356', displayName: 'Alex Morgan', profilePicture: null, bio: 'Building cool things with Zaxo!', status: 'Available', isOnline: true, phone: '+1-555-0101', about: 'Hey there! I am using Zaxo' },
  { id: 'user-2', zaxoNumber: '291-834-567', displayName: 'Sarah Chen', profilePicture: null, bio: 'Designer & Creative Thinker', status: 'At work', isOnline: true, phone: '+1-555-0102', about: 'Living life creatively ✨' },
  { id: 'user-3', zaxoNumber: '738-456-129', displayName: 'Marcus Johnson', profilePicture: null, bio: 'Full-stack developer', status: 'Busy', isOnline: false, phone: '+1-555-0103', about: 'Code. Coffee. Repeat.' },
  { id: 'user-4', zaxoNumber: '564-893-712', displayName: 'Elena Rodriguez', profilePicture: null, bio: 'Exploring the world 🌍', status: 'Traveling', isOnline: true, phone: '+1-555-0104', about: 'Adventure awaits!' },
  { id: 'user-5', zaxoNumber: '847-261-935', displayName: 'David Kim', profilePicture: null, bio: 'Music lover & coffee addict', status: 'In a meeting', isOnline: false, phone: '+1-555-0105', about: '🎵 Music is life' },
  { id: 'user-6', zaxoNumber: '193-678-452', displayName: 'Aisha Patel', profilePicture: null, bio: 'Product Manager @TechCorp', status: 'Available', isOnline: true, phone: '+1-555-0106', about: 'Building the future, one product at a time' },
  { id: 'user-7', zaxoNumber: '625-914-387', displayName: 'James Wilson', profilePicture: null, bio: 'Photographer | Storyteller', status: 'Out shooting', isOnline: false, phone: '+1-555-0107', about: 'Capturing moments 📷' },
  { id: 'user-8', zaxoNumber: '381-547-629', displayName: 'Yuki Tanaka', profilePicture: null, bio: 'AI researcher & cat person', status: 'Studying', isOnline: true, phone: '+1-555-0108', about: '🧠🤖🐱' },
  { id: 'user-9', zaxoNumber: '914-372-851', displayName: "Liam O'Brien", profilePicture: null, bio: 'Fitness enthusiast', status: 'At the gym', isOnline: false, phone: '+1-555-0109', about: 'No pain no gain 💪' },
  { id: 'user-10', zaxoNumber: '457-683-129', displayName: 'Priya Sharma', profilePicture: null, bio: 'Data scientist & tea lover', status: 'Available', isOnline: true, phone: '+1-555-0110', about: 'In data we trust 📊' },
  { id: 'user-11', zaxoNumber: '628-195-473', displayName: 'Carlos Mendez', profilePicture: null, bio: 'Chef & food blogger', status: 'Cooking', isOnline: false, phone: '+1-555-0111', about: 'Life is too short for bad food 🍳' },
  { id: 'user-12', zaxoNumber: '371-859-264', displayName: 'Nina Petrov', profilePicture: null, bio: 'Architect & urban planner', status: 'At the studio', isOnline: true, phone: '+1-555-0112', about: 'Designing spaces, shaping lives 🏗️' },
];

// Mock chats with WhatsApp features
export const mockChats: Chat[] = [
  {
    id: 'chat-1', name: 'Sarah Chen', avatar: null, isGroup: false, isChannel: false,
    members: ['demo-user-1', 'user-2'], lastMessage: 'Hey! Are you coming to the design review?',
    lastMessageTime: '2:34 PM', unreadCount: 2, isPinned: true, isMuted: false, isTyping: false,
    isArchived: false, isDeleted: false, wallpaper: null, disappearingMessages: false,
    disappearingDuration: 24, e2eEncrypted: true, pinnedMessages: [],
    description: '', createdBy: '', groupAdmins: [], customNotifications: false,
  },
  {
    id: 'chat-2', name: 'Marcus Johnson', avatar: null, isGroup: false, isChannel: false,
    members: ['demo-user-1', 'user-3'], lastMessage: 'The API endpoint is ready for testing',
    lastMessageTime: '1:15 PM', unreadCount: 0, isPinned: false, isMuted: false, isTyping: false,
    isArchived: false, isDeleted: false, wallpaper: null, disappearingMessages: false,
    disappearingDuration: 24, e2eEncrypted: true, pinnedMessages: [],
    description: '', createdBy: '', groupAdmins: [], customNotifications: false,
  },
  {
    id: 'chat-3', name: 'Project Alpha Team', avatar: null, isGroup: true, isChannel: false,
    members: ['demo-user-1', 'user-2', 'user-3', 'user-6'],
    lastMessage: "Aisha: Let's sync up tomorrow morning", lastMessageTime: '12:45 PM',
    unreadCount: 5, isPinned: true, isMuted: false, isTyping: true,
    isArchived: false, isDeleted: false, wallpaper: null, disappearingMessages: false,
    disappearingDuration: 24, e2eEncrypted: true, pinnedMessages: ['m20'],
    description: 'Team collaboration for Project Alpha', createdBy: 'demo-user-1',
    groupAdmins: ['demo-user-1', 'user-6'], customNotifications: false,
  },
  {
    id: 'chat-4', name: 'Elena Rodriguez', avatar: null, isGroup: false, isChannel: false,
    members: ['demo-user-1', 'user-4'], lastMessage: 'Check out these photos from Kyoto! 🏯',
    lastMessageTime: '11:30 AM', unreadCount: 1, isPinned: false, isMuted: false, isTyping: false,
    isArchived: false, isDeleted: false, wallpaper: null, disappearingMessages: true,
    disappearingDuration: 168, e2eEncrypted: true, pinnedMessages: [],
    description: '', createdBy: '', groupAdmins: [], customNotifications: false,
  },
  {
    id: 'chat-5', name: 'Zaxo Updates', avatar: null, isGroup: false, isChannel: true,
    members: [], lastMessage: 'New feature: Group video calls are here! 🎉',
    lastMessageTime: '10:00 AM', unreadCount: 0, isPinned: false, isMuted: true, isTyping: false,
    isArchived: false, isDeleted: false, wallpaper: null, disappearingMessages: false,
    disappearingDuration: 24, e2eEncrypted: false, pinnedMessages: [],
    description: '', createdBy: '', groupAdmins: [], customNotifications: false,
  },
  {
    id: 'chat-6', name: 'David Kim', avatar: null, isGroup: false, isChannel: false,
    members: ['demo-user-1', 'user-5'], lastMessage: 'Have you heard the new album?',
    lastMessageTime: 'Yesterday', unreadCount: 0, isPinned: false, isMuted: false, isTyping: false,
    isArchived: false, isDeleted: false, wallpaper: null, disappearingMessages: false,
    disappearingDuration: 24, e2eEncrypted: true, pinnedMessages: [],
    description: '', createdBy: '', groupAdmins: [], customNotifications: false,
  },
  {
    id: 'chat-7', name: 'Family Group 👨‍👩‍👧‍👦', avatar: null, isGroup: true, isChannel: false,
    members: ['demo-user-1', 'user-5', 'user-7'],
    lastMessage: "Don't forget dinner on Sunday!", lastMessageTime: 'Yesterday',
    unreadCount: 3, isPinned: false, isMuted: false, isTyping: false,
    isArchived: false, isDeleted: false, wallpaper: null, disappearingMessages: false,
    disappearingDuration: 24, e2eEncrypted: true, pinnedMessages: [],
    description: 'Family chat group', createdBy: 'demo-user-1',
    groupAdmins: ['demo-user-1'], customNotifications: false,
  },
  {
    id: 'chat-8', name: 'Yuki Tanaka', avatar: null, isGroup: false, isChannel: false,
    members: ['demo-user-1', 'user-8'], lastMessage: 'That ML paper was fascinating!',
    lastMessageTime: 'Mon', unreadCount: 0, isPinned: false, isMuted: false, isTyping: false,
    isArchived: true, isDeleted: false, wallpaper: null, disappearingMessages: false,
    disappearingDuration: 24, e2eEncrypted: true, pinnedMessages: [],
    description: '', createdBy: '', groupAdmins: [], customNotifications: false,
  },
  {
    id: 'chat-9', name: 'Workout Buddies 💪', avatar: null, isGroup: true, isChannel: false,
    members: ['demo-user-1', 'user-9', 'user-5'],
    lastMessage: "Liam: Who's up for a 5K run tomorrow?", lastMessageTime: 'Mon',
    unreadCount: 0, isPinned: false, isMuted: true, isTyping: false,
    isArchived: false, isDeleted: false, wallpaper: null, disappearingMessages: false,
    disappearingDuration: 24, e2eEncrypted: true, pinnedMessages: [],
    description: 'Fitness motivation group', createdBy: 'user-9',
    groupAdmins: ['user-9'], customNotifications: false,
  },
  {
    id: 'chat-10', name: 'Priya Sharma', avatar: null, isGroup: false, isChannel: false,
    members: ['demo-user-1', 'user-10'], lastMessage: 'The regression model converged! 🎉',
    lastMessageTime: 'Sun', unreadCount: 0, isPinned: false, isMuted: false, isTyping: false,
    isArchived: false, isDeleted: false, wallpaper: null, disappearingMessages: false,
    disappearingDuration: 24, e2eEncrypted: true, pinnedMessages: [],
    description: '', createdBy: '', groupAdmins: [], customNotifications: false,
  },
];

// Enhanced mock messages with WhatsApp features
export const mockMessages: Record<string, Message[]> = {
  'chat-1': [
    { id: 'm1', content: 'Hi Alex! How are you doing?', messageType: 'text', senderId: 'user-2', chatId: 'chat-1', isForwarded: false, isRead: true, isDelivered: true, reactions: [], createdAt: '2:20 PM', isStarred: false, isDeleted: false, isEdited: false, deletedForEveryone: false },
    { id: 'm2', content: 'Hey Sarah! I\'m good, just finishing up some code. What about you?', messageType: 'text', senderId: 'demo-user-1', chatId: 'chat-1', isForwarded: false, isRead: true, isDelivered: true, reactions: ['👍'], createdAt: '2:22 PM', isStarred: true, isDeleted: false, isEdited: false, deletedForEveryone: false },
    { id: 'm3', content: 'Great! Working on the new dashboard designs', messageType: 'text', senderId: 'user-2', chatId: 'chat-1', isForwarded: false, isRead: true, isDelivered: true, reactions: [], createdAt: '2:25 PM', isStarred: false, isDeleted: false, isEdited: false, deletedForEveryone: false },
    { id: 'm4', content: 'That sounds awesome! Can\'t wait to see them', messageType: 'text', senderId: 'demo-user-1', chatId: 'chat-1', isForwarded: false, isRead: true, isDelivered: true, reactions: [], createdAt: '2:27 PM', isStarred: false, isDeleted: false, isEdited: false, deletedForEveryone: false },
    { id: 'm5', content: 'Hey! Are you coming to the design review?', messageType: 'text', senderId: 'user-2', chatId: 'chat-1', isForwarded: false, isRead: false, isDelivered: true, reactions: [], createdAt: '2:34 PM', isStarred: false, isDeleted: false, isEdited: false, deletedForEveryone: false },
    { id: 'm6', content: 'It\'s at 4 PM in the main conference room', messageType: 'text', senderId: 'user-2', chatId: 'chat-1', isForwarded: false, isRead: false, isDelivered: true, reactions: [], createdAt: '2:34 PM', isStarred: false, isDeleted: false, isEdited: false, deletedForEveryone: false },
    { id: 'm7', content: '', messageType: 'voice', senderId: 'user-2', chatId: 'chat-1', isForwarded: false, isRead: true, isDelivered: true, reactions: [], createdAt: '2:35 PM', isStarred: false, isDeleted: false, isEdited: false, deletedForEveryone: false, voiceDuration: 12, voiceWaveform: [3,5,8,12,7,4,9,15,6,8,3,5,10,7,4,2,6,8,5,3] },
    { id: 'm8', content: 'Check this out!', messageType: 'image', senderId: 'user-2', chatId: 'chat-1', isForwarded: false, isRead: true, isDelivered: true, reactions: ['❤️'], createdAt: '2:36 PM', isStarred: false, isDeleted: false, isEdited: false, deletedForEveryone: false },
    { id: 'm9', content: 'This message was deleted', messageType: 'system', senderId: 'user-2', chatId: 'chat-1', isForwarded: false, isRead: true, isDelivered: true, reactions: [], createdAt: '2:37 PM', isStarred: false, isDeleted: false, isEdited: false, deletedForEveryone: true },
    { id: 'm10', content: 'https://zaxo.com/design-review', messageType: 'link', senderId: 'user-2', chatId: 'chat-1', isForwarded: false, isRead: false, isDelivered: true, reactions: [], createdAt: '2:38 PM', isStarred: false, isDeleted: false, isEdited: false, deletedForEveryone: false, linkPreview: { title: 'Design Review - Sprint 24', description: 'Join the design review session for the upcoming sprint', url: 'https://zaxo.com/design-review' } },
    { id: 'm11', content: 'Where are you?', messageType: 'location', senderId: 'user-2', chatId: 'chat-1', isForwarded: false, isRead: false, isDelivered: true, reactions: [], createdAt: '2:39 PM', isStarred: false, isDeleted: false, isEdited: false, deletedForEveryone: false, locationData: { lat: 37.7749, lng: -122.4194, name: 'San Francisco, CA' } },
    { id: 'm12', content: 'What should we order?', messageType: 'poll', senderId: 'user-2', chatId: 'chat-1', isForwarded: false, isRead: false, isDelivered: true, reactions: [], createdAt: '2:40 PM', isStarred: false, isDeleted: false, isEdited: false, deletedForEveryone: false, pollData: { question: 'Lunch options?', options: [{ text: '🍕 Pizza', votes: 3, votedByMe: true }, { text: '🍣 Sushi', votes: 2, votedByMe: false }, { text: '🥗 Salad', votes: 1, votedByMe: false }, { text: '🌮 Tacos', votes: 4, votedByMe: false }] } },
    { id: 'm13', content: ' fwd: Hey team, the meeting has been moved to 3 PM', messageType: 'text', senderId: 'demo-user-1', chatId: 'chat-1', isForwarded: true, isRead: true, isDelivered: true, reactions: [], createdAt: '2:41 PM', isStarred: false, isDeleted: false, isEdited: false, deletedForEveryone: false },
    { id: 'm14', content: 'Sure I\'ll be there!', messageType: 'text', senderId: 'demo-user-1', chatId: 'chat-1', isForwarded: false, isRead: true, isDelivered: true, reactions: [], createdAt: '2:42 PM', isStarred: false, isDeleted: false, isEdited: true, deletedForEveryone: false },
  ],
  'chat-2': [
    { id: 'm20', content: 'Team, we need to discuss the sprint goals for next week', messageType: 'text', senderId: 'user-6', chatId: 'chat-3', isForwarded: false, isRead: true, isDelivered: true, reactions: [], createdAt: '12:00 PM', isStarred: true, isDeleted: false, isEdited: false, deletedForEveryone: false },
    { id: 'm21', content: 'Hey Marcus, how\'s the API integration going?', messageType: 'text', senderId: 'demo-user-1', chatId: 'chat-2', isForwarded: false, isRead: true, isDelivered: true, reactions: [], createdAt: '12:45 PM', isStarred: false, isDeleted: false, isEdited: false, deletedForEveryone: false },
    { id: 'm22', content: 'Making good progress! Should be done by EOD', messageType: 'text', senderId: 'user-3', chatId: 'chat-2', isForwarded: false, isRead: true, isDelivered: true, reactions: [], createdAt: '1:00 PM', isStarred: false, isDeleted: false, isEdited: false, deletedForEveryone: false },
    { id: 'm23', content: 'The API endpoint is ready for testing', messageType: 'text', senderId: 'user-3', chatId: 'chat-2', isForwarded: false, isRead: true, isDelivered: true, reactions: ['🎉'], createdAt: '1:15 PM', isStarred: false, isDeleted: false, isEdited: false, deletedForEveryone: false },
    { id: 'm24', content: '', messageType: 'document', senderId: 'user-3', chatId: 'chat-2', isForwarded: false, isRead: true, isDelivered: true, reactions: [], createdAt: '1:16 PM', isStarred: false, isDeleted: false, isEdited: false, deletedForEveryone: false, mediaUrl: 'API_Documentation_v2.pdf' },
  ],
  'chat-3': [
    { id: 'm30', content: 'Team, we need to discuss the sprint goals for next week', messageType: 'text', senderId: 'user-6', chatId: 'chat-3', isForwarded: false, isRead: true, isDelivered: true, reactions: [], createdAt: '12:00 PM', isStarred: true, isDeleted: false, isEdited: false, deletedForEveryone: false },
    { id: 'm31', content: 'I\'ve prepared the backlog items', messageType: 'text', senderId: 'user-3', chatId: 'chat-3', isForwarded: false, isRead: true, isDelivered: true, reactions: [], createdAt: '12:15 PM', isStarred: false, isDeleted: false, isEdited: false, deletedForEveryone: false },
    { id: 'm32', content: 'Great! Let\'s also review the design mockups', messageType: 'text', senderId: 'user-2', chatId: 'chat-3', isForwarded: false, isRead: true, isDelivered: true, reactions: [], createdAt: '12:20 PM', isStarred: false, isDeleted: false, isEdited: false, deletedForEveryone: false },
    { id: 'm33', content: 'I\'ll add the performance metrics report to the agenda', messageType: 'text', senderId: 'demo-user-1', chatId: 'chat-3', isForwarded: false, isRead: true, isDelivered: true, reactions: [], createdAt: '12:30 PM', isStarred: false, isDeleted: false, isEdited: false, deletedForEveryone: false },
    { id: 'm34', content: 'Perfect, I\'ll set up the meeting room', messageType: 'text', senderId: 'user-6', chatId: 'chat-3', isForwarded: false, isRead: true, isDelivered: true, reactions: ['👍'], createdAt: '12:35 PM', isStarred: false, isDeleted: false, isEdited: false, deletedForEveryone: false },
    { id: 'm35', content: "Let's sync up tomorrow morning", messageType: 'text', senderId: 'user-6', chatId: 'chat-3', isForwarded: false, isRead: false, isDelivered: true, reactions: [], createdAt: '12:45 PM', isStarred: false, isDeleted: false, isEdited: false, deletedForEveryone: false },
    { id: 'm36', content: 'When should we meet?', messageType: 'poll', senderId: 'demo-user-1', chatId: 'chat-3', isForwarded: false, isRead: true, isDelivered: true, reactions: [], createdAt: '12:50 PM', isStarred: false, isDeleted: false, isEdited: false, deletedForEveryone: false, pollData: { question: 'Meeting time?', options: [{ text: '9:00 AM', votes: 2, votedByMe: true }, { text: '10:00 AM', votes: 3, votedByMe: false }, { text: '11:00 AM', votes: 1, votedByMe: false }] } },
  ],
  'chat-4': [
    { id: 'm40', content: 'Alex! You won\'t believe where I am right now 😍', messageType: 'text', senderId: 'user-4', chatId: 'chat-4', isForwarded: false, isRead: true, isDelivered: true, reactions: [], createdAt: '11:00 AM', isStarred: false, isDeleted: false, isEdited: false, deletedForEveryone: false },
    { id: 'm41', content: 'Where??', messageType: 'text', senderId: 'demo-user-1', chatId: 'chat-4', isForwarded: false, isRead: true, isDelivered: true, reactions: [], createdAt: '11:05 AM', isStarred: false, isDeleted: false, isEdited: false, deletedForEveryone: false },
    { id: 'm42', content: 'Check out these photos from Kyoto! 🏯', messageType: 'image', senderId: 'user-4', chatId: 'chat-4', isForwarded: false, isRead: false, isDelivered: true, reactions: [], createdAt: '11:30 AM', isStarred: false, isDeleted: false, isEdited: false, deletedForEveryone: false },
  ],
  'chat-6': [
    { id: 'm60', content: 'Have you heard the new album?', messageType: 'text', senderId: 'user-5', chatId: 'chat-6', isForwarded: false, isRead: true, isDelivered: true, reactions: [], createdAt: '5:00 PM', isStarred: false, isDeleted: false, isEdited: false, deletedForEveryone: false },
    { id: 'm61', content: '', messageType: 'voice', senderId: 'user-5', chatId: 'chat-6', isForwarded: false, isRead: true, isDelivered: true, reactions: [], createdAt: '5:01 PM', isStarred: false, isDeleted: false, isEdited: false, deletedForEveryone: false, voiceDuration: 45, voiceWaveform: [2,4,7,10,5,8,12,6,3,9,7,5,11,8,4,6,10,7,3,5,8,6,4,9,7,5,3,6,8,4] },
    { id: 'm62', content: 'Which one? Send me a link!', messageType: 'text', senderId: 'demo-user-1', chatId: 'chat-6', isForwarded: false, isRead: true, isDelivered: true, reactions: [], createdAt: '5:05 PM', isStarred: false, isDeleted: false, isEdited: false, deletedForEveryone: false },
  ],
  'chat-7': [
    { id: 'm70', content: "Don't forget dinner on Sunday!", messageType: 'text', senderId: 'user-7', chatId: 'chat-7', isForwarded: false, isRead: true, isDelivered: true, reactions: [], createdAt: '6:00 PM', isStarred: false, isDeleted: false, isEdited: false, deletedForEveryone: false },
    { id: 'm71', content: 'I\'ll bring dessert! 🍰', messageType: 'text', senderId: 'demo-user-1', chatId: 'chat-7', isForwarded: false, isRead: true, isDelivered: true, reactions: ['❤️', '👍'], createdAt: '6:05 PM', isStarred: false, isDeleted: false, isEdited: false, deletedForEveryone: false },
  ],
};

// Mock call history
export const mockCallHistory: CallRecord[] = [
  { id: 'call-1', callerId: 'demo-user-1', callerName: 'Alex Morgan', callerNumber: '482-719-356', receiverId: 'user-2', receiverName: 'Sarah Chen', receiverNumber: '291-834-567', callType: 'video', status: 'completed', duration: 1847, timestamp: '2:34 PM', isGroup: false },
  { id: 'call-2', callerId: 'user-3', callerName: 'Marcus Johnson', callerNumber: '738-456-129', receiverId: 'demo-user-1', receiverName: 'Alex Morgan', receiverNumber: '482-719-356', callType: 'audio', status: 'missed', duration: 0, timestamp: '1:15 PM', isGroup: false },
  { id: 'call-3', callerId: 'demo-user-1', callerName: 'Alex Morgan', callerNumber: '482-719-356', receiverId: 'user-6', receiverName: 'Aisha Patel', receiverNumber: '193-678-452', callType: 'audio', status: 'completed', duration: 432, timestamp: '11:30 AM', isGroup: false },
  { id: 'call-4', callerId: 'user-4', callerName: 'Elena Rodriguez', callerNumber: '564-893-712', receiverId: 'demo-user-1', receiverName: 'Alex Morgan', receiverNumber: '482-719-356', callType: 'video', status: 'completed', duration: 2356, timestamp: 'Yesterday', isGroup: false },
  { id: 'call-5', callerId: 'demo-user-1', callerName: 'Alex Morgan', callerNumber: '482-719-356', receiverId: 'user-8', receiverName: 'Yuki Tanaka', receiverNumber: '381-547-629', callType: 'audio', status: 'outgoing', duration: 189, timestamp: 'Yesterday', isGroup: false },
  { id: 'call-6', callerId: 'user-5', callerName: 'David Kim', callerNumber: '847-261-935', receiverId: 'demo-user-1', receiverName: 'Alex Morgan', receiverNumber: '482-719-356', callType: 'audio', status: 'missed', duration: 0, timestamp: 'Mon', isGroup: false },
  { id: 'call-7', callerId: 'demo-user-1', callerName: 'Alex Morgan', callerNumber: '482-719-356', receiverId: '', receiverName: 'Project Alpha Team', receiverNumber: '', callType: 'video', status: 'completed', duration: 3600, timestamp: 'Tue', isGroup: true, participants: [{ id: 'user-2', name: 'Sarah Chen' }, { id: 'user-3', name: 'Marcus Johnson' }, { id: 'user-6', name: 'Aisha Patel' }] },
];

// Mock Status/Stories data
export const mockContactStatuses: StatusItem[] = [
  { id: 's1', userId: 'user-2', userName: 'Sarah Chen', userAvatar: null, type: 'image', content: 'New design coming soon! ✨', backgroundColor: '#10b981', createdAt: '1 hour ago', expiresAt: '23h left', seenBy: [], isMyStatus: false },
  { id: 's2', userId: 'user-4', userName: 'Elena Rodriguez', userAvatar: null, type: 'image', content: 'Kyoto temple vibes 🏯', backgroundColor: '#8b5cf6', createdAt: '2 hours ago', expiresAt: '22h left', seenBy: [], isMyStatus: false },
  { id: 's3', userId: 'user-4', userName: 'Elena Rodriguez', userAvatar: null, type: 'text', content: 'Travel is the only thing you buy that makes you richer ✈️', backgroundColor: '#f59e0b', textColor: '#000', createdAt: '3 hours ago', expiresAt: '21h left', seenBy: ['demo-user-1'], isMyStatus: false },
  { id: 's4', userId: 'user-8', userName: 'Yuki Tanaka', userAvatar: null, type: 'text', content: 'Just published my paper on transformer architectures! 🧠', backgroundColor: '#6366f1', createdAt: '4 hours ago', expiresAt: '20h left', seenBy: [], isMyStatus: false },
  { id: 's5', userId: 'user-10', userName: 'Priya Sharma', userAvatar: null, type: 'image', content: 'Data visualization of the week 📊', backgroundColor: '#ec4899', createdAt: '5 hours ago', expiresAt: '19h left', seenBy: [], isMyStatus: false },
  { id: 's6', userId: 'user-9', userName: "Liam O'Brien", userAvatar: null, type: 'video', content: 'Morning run highlights 🏃', backgroundColor: '#14b8a6', createdAt: '6 hours ago', expiresAt: '18h left', seenBy: ['demo-user-1'], isMyStatus: false },
];

export const mockMyStatuses: StatusItem[] = [];

// Mock admin data
export const mockAdminUsers = [
  { id: 'user-2', zaxoNumber: '291-834-567', displayName: 'Sarah Chen', profilePicture: null, phoneNumber: '+1-555-0102', isOnline: true, isSuspended: false, isBanned: false, lastSeen: 'Now', createdAt: '2025-08-15' },
  { id: 'user-3', zaxoNumber: '738-456-129', displayName: 'Marcus Johnson', profilePicture: null, phoneNumber: '+1-555-0103', isOnline: false, isSuspended: false, isBanned: false, lastSeen: '2 hours ago', createdAt: '2025-09-02' },
  { id: 'user-4', zaxoNumber: '564-893-712', displayName: 'Elena Rodriguez', profilePicture: null, phoneNumber: '+1-555-0104', isOnline: true, isSuspended: false, isBanned: false, lastSeen: 'Now', createdAt: '2025-10-18' },
  { id: 'user-5', zaxoNumber: '847-261-935', displayName: 'David Kim', profilePicture: null, phoneNumber: '+1-555-0105', isOnline: false, isSuspended: false, isBanned: false, lastSeen: '1 day ago', createdAt: '2025-11-05' },
  { id: 'user-6', zaxoNumber: '193-678-452', displayName: 'Aisha Patel', profilePicture: null, phoneNumber: '+1-555-0106', isOnline: true, isSuspended: false, isBanned: false, lastSeen: 'Now', createdAt: '2025-12-01' },
  { id: 'user-7', zaxoNumber: '625-914-387', displayName: 'James Wilson', profilePicture: null, phoneNumber: '+1-555-0107', isOnline: false, isSuspended: true, isBanned: false, lastSeen: '3 days ago', createdAt: '2026-01-10' },
  { id: 'user-8', zaxoNumber: '381-547-629', displayName: 'Yuki Tanaka', profilePicture: null, phoneNumber: '+1-555-0108', isOnline: true, isSuspended: false, isBanned: false, lastSeen: 'Now', createdAt: '2026-02-14' },
  { id: 'user-9', zaxoNumber: '914-372-851', displayName: "Liam O'Brien", profilePicture: null, phoneNumber: '+1-555-0109', isOnline: false, isSuspended: false, isBanned: true, lastSeen: '2 weeks ago', createdAt: '2026-03-20' },
  { id: 'user-10', zaxoNumber: '457-683-129', displayName: 'Priya Sharma', profilePicture: null, phoneNumber: '+1-555-0110', isOnline: true, isSuspended: false, isBanned: false, lastSeen: 'Now', createdAt: '2026-04-08' },
  { id: 'user-11', zaxoNumber: '628-195-473', displayName: 'Carlos Mendez', profilePicture: null, phoneNumber: '+1-555-0111', isOnline: false, isSuspended: false, isBanned: false, lastSeen: '5 hours ago', createdAt: '2026-05-01' },
];

export const mockReports = [
  { id: 'r1', reporterId: 'user-2', reporterName: 'Sarah Chen', targetId: 'user-9', targetName: "Liam O'Brien", targetType: 'user', reason: 'Spam', description: 'Sending unsolicited promotional messages', status: 'pending', createdAt: '2026-06-09 08:30' },
  { id: 'r2', reporterId: 'user-4', reporterName: 'Elena Rodriguez', targetId: 'msg-456', targetName: 'Message in Chat #3', targetType: 'message', reason: 'Inappropriate content', description: 'Offensive language in group chat', status: 'pending', createdAt: '2026-06-09 07:15' },
  { id: 'r3', reporterId: 'user-6', reporterName: 'Aisha Patel', targetId: 'user-9', targetName: "Liam O'Brien", targetType: 'user', reason: 'Harassment', description: 'Repeated unwanted messages after being asked to stop', status: 'reviewed', createdAt: '2026-06-08 14:20' },
  { id: 'r4', reporterId: 'user-3', reporterName: 'Marcus Johnson', targetId: 'msg-789', targetName: 'Media in Chat #7', targetType: 'message', reason: 'NSFW', description: 'Explicit content shared in family group', status: 'resolved', createdAt: '2026-06-07 22:45' },
  { id: 'r5', reporterId: 'user-8', reporterName: 'Yuki Tanaka', targetId: 'user-12', targetName: 'Unknown User', targetType: 'user', reason: 'Spam', description: 'Bot-like behavior, sending identical messages', status: 'pending', createdAt: '2026-06-09 09:00' },
];

export const mockAuditLogs = [
  { id: 'al1', adminId: 'admin-1', adminName: 'System Admin', action: 'User suspended', target: 'James Wilson (625-914-387)', details: 'Violation of community guidelines', ipAddress: '192.168.1.45', createdAt: '2026-06-09 08:00' },
  { id: 'al2', adminId: 'admin-1', adminName: 'System Admin', action: 'User banned', target: "Liam O'Brien (914-372-851)", details: 'Repeated spam violations', ipAddress: '192.168.1.45', createdAt: '2026-06-08 16:30' },
  { id: 'al3', adminId: 'admin-2', adminName: 'Ops Manager', action: 'Feature flag updated', target: 'group_video_calls', details: 'Enabled for all users', ipAddress: '10.0.0.12', createdAt: '2026-06-08 10:00' },
  { id: 'al4', adminId: 'admin-1', adminName: 'System Admin', action: 'System config changed', target: 'max_call_duration', details: 'Changed from 60min to 120min', ipAddress: '192.168.1.45', createdAt: '2026-06-07 14:15' },
  { id: 'al5', adminId: 'admin-2', adminName: 'Ops Manager', action: 'Content removed', target: 'Message msg-789', details: 'NSFW content removed from Family Group', ipAddress: '10.0.0.12', createdAt: '2026-06-07 23:00' },
  { id: 'al6', adminId: 'admin-1', adminName: 'System Admin', action: 'Notification sent', target: 'All users', details: 'Maintenance window announced', ipAddress: '192.168.1.45', createdAt: '2026-06-06 09:30' },
];

export const weeklyGrowthData = [
  { day: 'Mon', users: 124500, messages: 1120000, calls: 4200 },
  { day: 'Tue', users: 125200, messages: 1180000, calls: 4500 },
  { day: 'Wed', users: 126100, messages: 1210000, calls: 4100 },
  { day: 'Thu', users: 126800, messages: 1190000, calls: 4800 },
  { day: 'Fri', users: 127400, messages: 1250000, calls: 5100 },
  { day: 'Sat', users: 127900, messages: 1080000, calls: 5800 },
  { day: 'Sun', users: 128459, messages: 1150000, calls: 5400 },
];

export const monthlyGrowthData = [
  { month: 'Jan', users: 98000 },
  { month: 'Feb', users: 102000 },
  { month: 'Mar', users: 106500 },
  { month: 'Apr', users: 110200 },
  { month: 'May', users: 118000 },
  { month: 'Jun', users: 128459 },
];

export const geoDistribution = [
  { region: 'North America', users: 45000, percentage: 35 },
  { region: 'Europe', users: 32000, percentage: 25 },
  { region: 'Asia Pacific', users: 28000, percentage: 22 },
  { region: 'Latin America', users: 13000, percentage: 10 },
  { region: 'Africa', users: 6500, percentage: 5 },
  { region: 'Middle East', users: 3959, percentage: 3 },
];

// Broadcast list mock data
export const mockBroadcastLists = [
  { id: 'bl1', name: 'Work Team', members: ['user-2', 'user-3', 'user-6'], memberCount: 3 },
  { id: 'bl2', name: 'Family', members: ['user-5', 'user-7'], memberCount: 2 },
  { id: 'bl3', name: 'Soccer Friends', members: ['user-9', 'user-5', 'user-11'], memberCount: 3 },
];

// Chat wallpaper options
export const wallpaperOptions = [
  { id: 'default', name: 'Default', color: null },
  { id: 'solid-light', name: 'Light', color: '#f0fdf4' },
  { id: 'solid-dark', name: 'Dark', color: '#1a1a2e' },
  { id: 'gradient-teal', name: 'Teal Gradient', color: 'linear-gradient(135deg, #0d9488, #14b8a6)' },
  { id: 'gradient-warm', name: 'Warm', color: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
  { id: 'gradient-ocean', name: 'Ocean', color: 'linear-gradient(135deg, #6366f1, #3b82f6)' },
  { id: 'gradient-sunset', name: 'Sunset', color: 'linear-gradient(135deg, #ec4899, #f97316)' },
  { id: 'doodle', name: 'Doodle', color: '#fef3c7' },
  { id: 'patterns', name: 'Patterns', color: '#e0e7ff' },
];

// Status background colors
export const statusBackgroundColors = [
  '#10b981', '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b',
  '#14b8a6', '#3b82f6', '#ef4444', '#f97316', '#84cc16',
  '#06b6d4', '#a855f7', '#e11d48', '#000000',
];

// Sticker packs mock data
export const stickerPacks = [
  {
    id: 'sp1', name: 'Zaxo Friends', icon: '😺',
    stickers: ['😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🦁', '🐯', '🐮'],
  },
  {
    id: 'sp2', name: 'Expressions', icon: '😀',
    stickers: ['😀', '😂', '🥰', '😎', '🤔', '😱', '🥳', '😤', '🤗', '😴', '🤩', '🫡'],
  },
  {
    id: 'sp3', name: 'Hearts & Love', icon: '❤️',
    stickers: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💕', '💖', '💗', '💘'],
  },
  {
    id: 'sp4', name: 'Hands & Gestures', icon: '👋',
    stickers: ['👋', '🤚', '✋', '🖖', '👌', '🤌', '✌️', '🤞', '🫰', '🤙', '👈', '👆'],
  },
  {
    id: 'sp5', name: 'Animals', icon: '🐶',
    stickers: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐸'],
  },
];
