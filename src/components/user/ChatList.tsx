'use client';

import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Pin, BellOff, Plus, Users, Volume2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useChatStore, Chat } from '@/stores';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1">
      <span className="typing-dot h-1.5 w-1.5 rounded-full bg-primary" />
      <span className="typing-dot h-1.5 w-1.5 rounded-full bg-primary" />
      <span className="typing-dot h-1.5 w-1.5 rounded-full bg-primary" />
    </div>
  );
}

function OnlineIndicator() {
  return (
    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
  );
}

interface ChatListItemProps {
  chat: Chat;
  isActive: boolean;
  isOnline: boolean;
  onClick: () => void;
}

function ChatListItem({ chat, isActive, isOnline, onClick }: ChatListItemProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/50 ${
        isActive ? 'bg-accent' : ''
      }`}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
            {chat.isGroup ? (
              <Users className="h-5 w-5" />
            ) : (
              getInitials(chat.name)
            )}
          </AvatarFallback>
        </Avatar>
        {isOnline && !chat.isGroup && <OnlineIndicator />}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            {chat.isPinned && (
              <Pin className="h-3 w-3 shrink-0 text-muted-foreground rotate-45" />
            )}
            <span className="truncate font-medium text-sm">{chat.name}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {chat.isMuted && <BellOff className="h-3 w-3 text-muted-foreground" />}
            <span className="text-xs text-muted-foreground">{chat.lastMessageTime}</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <div className="min-w-0 flex-1">
            {chat.isTyping ? (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-primary font-medium">typing</span>
                <TypingIndicator />
              </div>
            ) : (
              <p className="truncate text-xs text-muted-foreground">{chat.lastMessage}</p>
            )}
          </div>
          {chat.unreadCount > 0 && (
            <Badge className="h-5 min-w-[20px] shrink-0 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold px-1.5">
              {chat.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </motion.button>
  );
}

export default function ChatList({ onNewChat }: { onNewChat?: () => void }) {
  const { chats, activeChat, setActiveChat, searchQuery, setSearchQuery, markAsRead } = useChatStore();

  // Filter and sort chats
  const filteredChats = useMemo(() => {
    const pinned = chats.filter((c) => c.isPinned);
    const unpinned = chats.filter((c) => !c.isPinned);

    const filterFn = (c: (typeof chats)[0]) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    const sortedPinned = pinned.filter(filterFn);
    const sortedUnpinned = unpinned.filter(filterFn);

    return [...sortedPinned, ...sortedUnpinned];
  }, [chats, searchQuery]);

  const handleChatClick = (chat: Chat) => {
    setActiveChat(chat);
    if (chat.unreadCount > 0) {
      markAsRead(chat.id);
    }
  };

  // Get online status for a chat
  const isChatOnline = (chat: Chat) => {
    if (chat.isGroup || chat.isChannel) return false;
    return false;
  };

  return (
    <div className="flex h-full flex-col bg-background min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold">Chats</h1>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={onNewChat}>
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Search */}
      <div className="px-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-muted/50 border-none rounded-full text-sm"
          />
        </div>
      </div>

      {/* Chat list */}
      <ScrollArea className="flex-1">
        <AnimatePresence initial={false}>
          {filteredChats.length > 0 ? (
            <div className="divide-y divide-border/50">
              {filteredChats.map((chat) => (
                <ChatListItem
                  key={chat.id}
                  chat={chat}
                  isActive={activeChat?.id === chat.id}
                  isOnline={isChatOnline(chat)}
                  onClick={() => handleChatClick(chat)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No chats found</p>
              <p className="text-xs text-muted-foreground mt-1">
                Start a new conversation
              </p>
            </div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
}
