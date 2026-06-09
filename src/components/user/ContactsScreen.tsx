'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  Users,
  Radio,
  Globe,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAppStore, useChatStore } from '@/stores';
import { mockUsers } from '@/lib/mock-data';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function ContactsScreen() {
  const { setOverlay } = useAppStore();
  const { chats, setActiveChat, setChats } = useChatStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter out the current user and search
  const contacts = useMemo(() => {
    const filtered = mockUsers.filter((u) => u.id !== 'demo-user-1');
    if (!searchQuery.trim()) return filtered;
    return filtered.filter(
      (u) =>
        u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.about?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleContactClick = (userId: string) => {
    // Check if a chat already exists with this user
    const existingChat = chats.find(
      (c) => !c.isGroup && !c.isChannel && c.members.includes(userId)
    );

    if (existingChat) {
      setActiveChat(existingChat);
    } else {
      // Create a new chat
      const user = mockUsers.find((u) => u.id === userId);
      if (!user) return;

      const newChat = {
        id: `chat-${Date.now()}`,
        name: user.displayName,
        avatar: null,
        isGroup: false,
        isChannel: false,
        members: ['demo-user-1', userId],
        lastMessage: '',
        lastMessageTime: 'Just now',
        unreadCount: 0,
        isPinned: false,
        isMuted: false,
        isTyping: false,
        isArchived: false,
        isDeleted: false,
        wallpaper: null,
        disappearingMessages: false,
        disappearingDuration: 24,
        e2eEncrypted: true,
        pinnedMessages: [],
        description: '',
        createdBy: '',
        groupAdmins: [],
        customNotifications: false,
      };
      setChats([newChat, ...chats]);
      setActiveChat(newChat);
    }
    setOverlay('none');
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed inset-0 z-40 bg-background flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={() => setOverlay('none')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">New chat</h1>
      </div>

      {/* Search */}
      <div className="px-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-muted/50 border-none rounded-full text-sm"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {/* Quick Actions */}
        <div className="divide-y divide-border/50">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setOverlay('new-group')}
            className="flex w-full items-center gap-4 px-4 py-3 text-left hover:bg-accent/50 transition-colors"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">New Group</p>
              <p className="text-xs text-muted-foreground">Create a group with contacts</p>
            </div>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setOverlay('new-broadcast')}
            className="flex w-full items-center gap-4 px-4 py-3 text-left hover:bg-accent/50 transition-colors"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
              <Radio className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">New Broadcast</p>
              <p className="text-xs text-muted-foreground">Send a message to multiple contacts</p>
            </div>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            className="flex w-full items-center gap-4 px-4 py-3 text-left hover:bg-accent/50 transition-colors"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">New Community</p>
              <p className="text-xs text-muted-foreground">Bring people together around a topic</p>
            </div>
          </motion.button>
        </div>

        <Separator />

        {/* Contacts Section */}
        <div>
          <p className="px-4 pt-3 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Contacts on Zaxo ({contacts.length})
          </p>

          <div className="divide-y divide-border/30">
            {contacts.map((contact) => (
              <motion.button
                key={contact.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleContactClick(contact.id)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-accent/50 transition-colors"
              >
                <div className="relative shrink-0">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                      {getInitials(contact.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  {contact.isOnline && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{contact.displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {contact.about || contact.bio}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>

          {contacts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No contacts found</p>
              <p className="text-xs text-muted-foreground mt-1">
                Try a different search term
              </p>
            </div>
          )}
        </div>

        <div className="h-4" />
      </ScrollArea>
    </motion.div>
  );
}
