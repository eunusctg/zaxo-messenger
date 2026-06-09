'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  X,
  Radio,
  Info,
  Users,
  ChevronRight,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/stores';
import { mockUsers, mockBroadcastLists } from '@/lib/mock-data';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function BroadcastScreen() {
  const { setOverlay } = useAppStore();
  const [listName, setListName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  // Available contacts
  const contacts = useMemo(() => {
    const filtered = mockUsers.filter((u) => u.id !== 'demo-user-1');
    if (!searchQuery.trim()) return filtered;
    return filtered.filter(
      (u) =>
        u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.about?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const toggleMember = (userId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const removeMember = (userId: string) => {
    setSelectedMembers((prev) => prev.filter((id) => id !== userId));
  };

  const canCreate = listName.trim().length > 0 && selectedMembers.length > 0;

  const handleCreate = () => {
    if (!canCreate) return;
    // In a real app, this would create the broadcast list
    setOverlay('none');
  };

  const getSelectedUser = (id: string) => mockUsers.find((u) => u.id === id);

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
        <div>
          <h1 className="text-lg font-semibold">New Broadcast</h1>
          {selectedMembers.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {selectedMembers.length} recipient{selectedMembers.length > 1 ? 's' : ''} selected
            </p>
          )}
        </div>
      </div>

      {/* List Name Input */}
      <div className="px-4 pb-2 space-y-2">
        <Input
          placeholder="List name"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          className="bg-transparent text-sm h-9"
          maxLength={100}
        />

        {/* Info Notice */}
        <div className="flex items-start gap-2 rounded-lg bg-primary/5 p-3">
          <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Only contacts with your number saved will receive your broadcast messages.
          </p>
        </div>
      </div>

      {/* Selected Members Chips */}
      <AnimatePresence>
        {selectedMembers.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 px-4 pb-3">
              {selectedMembers.map((id) => {
                const user = getSelectedUser(id);
                if (!user) return null;
                return (
                  <motion.div
                    key={id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Badge
                      variant="secondary"
                      className="gap-1 pl-1 pr-2 py-1 text-xs"
                    >
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="bg-primary/10 text-primary text-[8px] font-semibold">
                          {getInitials(user.displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="max-w-[80px] truncate">{user.displayName.split(' ')[0]}</span>
                      <button
                        onClick={() => removeMember(id)}
                        className="ml-0.5 hover:text-destructive transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Contacts */}
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

      {/* Contact List + Existing Lists */}
      <ScrollArea className="flex-1">
        {/* Contact Selection */}
        <div className="divide-y divide-border/30">
          {contacts.map((contact) => {
            const isSelected = selectedMembers.includes(contact.id);
            return (
              <motion.button
                key={contact.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleMember(contact.id)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  isSelected ? 'bg-primary/5' : 'hover:bg-accent/50'
                }`}
              >
                <div className="relative shrink-0">
                  <Avatar className="h-11 w-11">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                      {getInitials(contact.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  {contact.isOnline && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{contact.displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {contact.about || contact.bio}
                  </p>
                </div>
                <div className="shrink-0">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleMember(contact.id)}
                    className="h-5 w-5"
                  />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Existing Broadcast Lists */}
        {mockBroadcastLists.length > 0 && (
          <>
            <Separator />
            <div>
              <p className="px-4 pt-3 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Existing broadcast lists
              </p>
              {mockBroadcastLists.map((list) => (
                <motion.button
                  key={list.id}
                  whileTap={{ scale: 0.98 }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-accent/50 transition-colors"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                    <Radio className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{list.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {list.memberCount} recipient{list.memberCount > 1 ? 's' : ''}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </motion.button>
              ))}
            </div>
          </>
        )}

        {contacts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No contacts found</p>
          </div>
        )}

        <div className="h-4" />
      </ScrollArea>

      {/* Create Button */}
      <div className="border-t bg-background p-4">
        <Button
          onClick={handleCreate}
          disabled={!canCreate}
          className="w-full gap-2"
        >
          <Radio className="h-4 w-4" />
          Create Broadcast List
          {selectedMembers.length > 0 && ` (${selectedMembers.length})`}
        </Button>
      </div>
    </motion.div>
  );
}
