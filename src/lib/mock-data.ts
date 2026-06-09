import { Chat, Message } from '@/stores';
import { CallRecord } from '@/stores';
import { StatusItem } from '@/stores';

// Mock users for demo - cleared
export const mockUsers: never[] = [];

// Mock chats - cleared
export const mockChats: Chat[] = [];

// Mock messages - cleared
export const mockMessages: Record<string, Message[]> = {};

// Mock call history - cleared
export const mockCallHistory: CallRecord[] = [];

// Mock Status/Stories data - cleared
export const mockContactStatuses: StatusItem[] = [];

export const mockMyStatuses: StatusItem[] = [];

// Mock admin data - cleared
export const mockAdminUsers: never[] = [];

export const mockReports: never[] = [];

export const mockAuditLogs: never[] = [];

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
