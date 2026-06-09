'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  Video,
  ArrowLeft,
  Paperclip,
  Smile,
  Send,
  CheckCheck,
  Check,
  Users,
  Reply,
  Forward,
  Mic,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useChatStore, Message } from '@/stores';
import { mockUsers } from '@/lib/mock-data';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1">
      <span className="typing-dot h-1.5 w-1.5 rounded-full bg-primary" />
      <span className="typing-dot h-1.5 w-1.5 rounded-full bg-primary" />
      <span className="typing-dot h-1.5 w-1.5 rounded-full bg-primary" />
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
  isSent: boolean;
  showReply?: (id: string) => void;
}

function MessageBubble({ message, isSent, showReply }: MessageBubbleProps) {
  // Find if there's a message being replied to
  const isReply = !!message.replyToId;
  const isForwarded = message.isForwarded;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-1`}
    >
      <div
        className={`max-w-[75%] px-3 py-2 relative group ${
          isSent
            ? 'bg-primary text-primary-foreground chat-bubble-sent'
            : 'bg-muted text-foreground chat-bubble-received'
        }`}
      >
        {/* Forwarded indicator */}
        {isForwarded && (
          <div className="flex items-center gap-1 mb-1 opacity-70">
            <Forward className="h-3 w-3" />
            <span className="text-[10px] font-medium">Forwarded</span>
          </div>
        )}

        {/* Reply indicator */}
        {isReply && (
          <div
            className={`border-l-2 mb-1 pl-2 py-0.5 rounded-sm text-[11px] ${
              isSent ? 'border-primary-foreground/40 bg-primary-foreground/10' : 'border-primary/40 bg-primary/5'
            }`}
          >
            <span className="font-medium opacity-70">Replied message</span>
          </div>
        )}

        {/* Message content */}
        <p className="text-sm leading-relaxed break-words">{message.content}</p>

        {/* Footer: time + read status + reactions */}
        <div className={`flex items-center gap-1 mt-0.5 ${isSent ? 'justify-end' : 'justify-start'}`}>
          {message.reactions.length > 0 && (
            <div className="flex gap-0.5 mr-1">
              {message.reactions.map((r, i) => (
                <span key={i} className="text-xs">{r}</span>
              ))}
            </div>
          )}
          <span className={`text-[10px] ${isSent ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
            {message.createdAt}
          </span>
          {isSent && (
            message.isRead ? (
              <CheckCheck className="h-3 w-3 text-primary-foreground/70" />
            ) : message.isDelivered ? (
              <CheckCheck className="h-3 w-3 text-primary-foreground/40" />
            ) : (
              <Check className="h-3 w-3 text-primary-foreground/40" />
            )
          )}
        </div>

        {/* Reply action on hover */}
        <button
          onClick={() => showReply?.(message.id)}
          className="absolute -top-1 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground rounded-full p-1 shadow-md border border-border"
        >
          <Reply className="h-3 w-3" />
        </button>
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center p-8">
      <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <svg className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-foreground">Zaxo Messenger</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-[280px]">
        Select a chat to start messaging, or begin a new conversation
      </p>
    </div>
  );
}

export default function ChatView() {
  const { activeChat, messages, setActiveChat } = useChatStore();
  const [inputText, setInputText] = useState('');
  const [showEmojiHint, setShowEmojiHint] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMessages = activeChat ? messages[activeChat.id] || [] : [];

  // Online user map
  const onlineUsers = useMemo(() => {
    const map = new Map<string, boolean>();
    mockUsers.forEach((u) => map.set(u.id, u.isOnline));
    return map;
  }, []);

  // Get the other member's online status
  const isOtherOnline = useMemo(() => {
    if (!activeChat || activeChat.isGroup) return false;
    const otherMemberId = activeChat.members.find((m) => m !== 'demo-user-1');
    return otherMemberId ? onlineUsers.get(otherMemberId) ?? false : false;
  }, [activeChat, onlineUsers]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages.length]);

  const handleSend = () => {
    if (!inputText.trim() || !activeChat) return;
    // In a real app, this would send via API
    setInputText('');
  };

  if (!activeChat) {
    return <EmptyState />;
  }

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Chat Header */}
      <div className="flex items-center gap-3 border-b px-4 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 md:hidden"
          onClick={() => setActiveChat(null)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
            {activeChat.isGroup ? <Users className="h-4 w-4" /> : getInitials(activeChat.name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-sm truncate">{activeChat.name}</h2>
          <p className="text-xs text-muted-foreground">
            {activeChat.isGroup
              ? `${activeChat.members.length} members`
              : activeChat.isTyping
                ? 'typing...'
                : isOtherOnline
                  ? 'Online'
                  : 'Last seen recently'}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <Video className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4" ref={scrollRef}>
        <div className="py-4">
          {/* Date separator */}
          <div className="flex items-center justify-center mb-4">
            <Badge variant="secondary" className="text-[10px] font-normal rounded-full px-3 py-0.5">
              Today
            </Badge>
          </div>

          {/* Message list */}
          <AnimatePresence initial={false}>
            {chatMessages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isSent={msg.senderId === 'demo-user-1'}
                showReply={(id) => {
                  // In a real app, this would set a reply state
                  console.log('Reply to message:', id);
                }}
              />
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {activeChat.isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start mb-1"
            >
              <div className="bg-muted chat-bubble-received px-4 py-2.5">
                <TypingDots />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t bg-background p-3">
        <div className="flex items-end gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 rounded-full">
            <Paperclip className="h-5 w-5 text-muted-foreground" />
          </Button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type a message..."
              className="w-full rounded-2xl bg-muted/50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-full"
            onClick={() => setShowEmojiHint(!showEmojiHint)}
          >
            <Smile className="h-5 w-5 text-muted-foreground" />
          </Button>

          {inputText.trim() ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <Button
                size="icon"
                className="h-9 w-9 shrink-0 rounded-full bg-primary hover:bg-primary/90"
                onClick={handleSend}
              >
                <Send className="h-4 w-4" />
              </Button>
            </motion.div>
          ) : (
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 rounded-full">
              <Mic className="h-5 w-5 text-muted-foreground" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
