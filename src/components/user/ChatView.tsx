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
  Star,
  MapPin,
  FileText,
  BarChart3,
  Link2,
  Image,
  Zap,
  PhoneOff,
  UserPlus,
  MonitorUp,
  CircleDot,
  ShieldCheck,
  Radio,
  Sparkles,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useChatStore, useCallStore, Message } from '@/stores';
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
  const isReply = !!message.replyToId;
  const isForwarded = message.isForwarded;
  const isDeleted = message.deletedForEveryone;
  const isEdited = message.isEdited;
  const isStarred = message.isStarred;

  const renderContent = () => {
    if (isDeleted) {
      return (
        <p className="text-sm italic opacity-50 break-words">This message was deleted</p>
      );
    }

    switch (message.messageType) {
      case 'voice':
        return (
          <div className="flex items-center gap-2 min-w-[180px]">
            <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-full shrink-0 ${isSent ? 'text-primary-foreground hover:bg-primary-foreground/20' : 'text-primary hover:bg-primary/20'}`}>
              <Mic className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-0.5 h-6">
                {(message.voiceWaveform || [3,5,8,6,4,7,5,3,6,8,4,5,7,3,5,8,6,4,3,5]).map((v, i) => (
                  <div
                    key={i}
                    className={`w-[3px] rounded-full ${isSent ? 'bg-primary-foreground/60' : 'bg-foreground/30'}`}
                    style={{ height: `${Math.max(v, 2) * 1.5}px` }}
                  />
                ))}
              </div>
            </div>
            <span className={`text-[10px] shrink-0 ${isSent ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
              {message.voiceDuration ? `${Math.floor(message.voiceDuration / 60)}:${(message.voiceDuration % 60).toString().padStart(2, '0')}` : '0:00'}
            </span>
          </div>
        );
      case 'image':
        return (
          <div className="space-y-1">
            <div className={`rounded-lg h-40 w-48 flex items-center justify-center ${isSent ? 'bg-primary-foreground/10' : 'bg-muted-foreground/10'}`}>
              <Image className={`h-8 w-8 ${isSent ? 'text-primary-foreground/40' : 'text-muted-foreground/40'}`} alt="Photo" />
            </div>
            {message.content && <p className="text-sm leading-relaxed break-words">{message.content}</p>}
          </div>
        );
      case 'document':
        return (
          <div className="flex items-center gap-2">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${isSent ? 'bg-primary-foreground/10' : 'bg-muted'}`}>
              <FileText className={`h-5 w-5 ${isSent ? 'text-primary-foreground' : 'text-foreground'}`} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{message.mediaUrl || 'Document'}</p>
              <p className={`text-[10px] ${isSent ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>PDF · 2.4 MB</p>
            </div>
          </div>
        );
      case 'location':
        return (
          <div className="space-y-1">
            <div className={`rounded-lg h-32 w-48 flex items-center justify-center relative overflow-hidden ${isSent ? 'bg-primary-foreground/10' : 'bg-muted'}`}>
              <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-8 grid-rows-6 h-full w-full gap-px p-1">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div key={i} className={`rounded-sm ${isSent ? 'bg-primary-foreground/30' : 'bg-foreground/20'}`} />
                  ))}
                </div>
              </div>
              <MapPin className={`h-6 w-6 relative z-10 ${isSent ? 'text-primary-foreground' : 'text-primary'}`} />
            </div>
            {message.locationData && (
              <p className="text-sm font-medium">{message.locationData.name}</p>
            )}
            {message.content && <p className="text-xs opacity-70">{message.content}</p>}
          </div>
        );
      case 'poll':
        return (
          <div className="space-y-2 min-w-[200px]">
            <div className="flex items-center gap-1.5">
              <BarChart3 className={`h-4 w-4 ${isSent ? 'text-primary-foreground' : 'text-primary'}`} />
              <span className="text-sm font-medium">Poll</span>
            </div>
            {message.pollData && (
              <>
                <p className="text-sm font-medium">{message.pollData.question}</p>
                <div className="space-y-1.5">
                  {message.pollData.options.map((opt, i) => (
                    <div key={i} className="relative rounded-md overflow-hidden">
                      <div
                        className={`absolute inset-y-0 left-0 ${isSent ? 'bg-primary-foreground/20' : 'bg-primary/20'}`}
                        style={{ width: `${opt.votes > 0 ? Math.max((opt.votes / Math.max(...message.pollData!.options.map(o => o.votes))) * 100, 5) : 0}%` }}
                      />
                      <div className="relative flex items-center justify-between px-2 py-1">
                        <span className="text-xs">{opt.text}</span>
                        <span className="text-[10px] opacity-70">{opt.votes}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        );
      case 'link':
        return (
          <div className="space-y-1">
            <p className="text-sm leading-relaxed break-words">{message.content}</p>
            {message.linkPreview && (
              <div className={`rounded-lg p-2 mt-1 ${isSent ? 'bg-primary-foreground/10' : 'bg-muted'}`}>
                <div className={`h-2 w-16 rounded mb-1 ${isSent ? 'bg-primary-foreground/30' : 'bg-foreground/20'}`} />
                <p className="text-xs font-medium truncate">{message.linkPreview.title}</p>
                <p className="text-[10px] opacity-70 line-clamp-2">{message.linkPreview.description}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Link2 className="h-3 w-3 opacity-50" />
                  <span className="text-[10px] opacity-50">{message.linkPreview.url}</span>
                </div>
              </div>
            )}
          </div>
        );
      case 'contact':
        return (
          <div className="flex items-center gap-2">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${isSent ? 'bg-primary-foreground/10' : 'bg-primary/10'}`}>
              <Users className={`h-5 w-5 ${isSent ? 'text-primary-foreground' : 'text-primary'}`} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium">{message.contactData?.name || 'Contact'}</p>
              <p className={`text-[10px] ${isSent ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{message.contactData?.zaxoNumber || ''}</p>
            </div>
          </div>
        );
      case 'sticker':
        return (
          <div className="text-4xl text-center py-1">{message.content || '😺'}</div>
        );
      default:
        return <p className="text-sm leading-relaxed break-words">{message.content}</p>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-1`}
    >
      <div
        className={`max-w-[75%] px-3 py-2 relative group ${
          isDeleted ? 'bg-muted/50' :
          isSent
            ? 'bg-primary text-primary-foreground chat-bubble-sent'
            : 'bg-muted text-foreground chat-bubble-received'
        }`}
      >
        {isForwarded && !isDeleted && (
          <div className="flex items-center gap-1 mb-1 opacity-70">
            <Forward className="h-3 w-3" />
            <span className="text-[10px] font-medium">Forwarded</span>
          </div>
        )}

        {isReply && !isDeleted && (
          <div
            className={`border-l-2 mb-1 pl-2 py-0.5 rounded-sm text-[11px] ${
              isSent ? 'border-primary-foreground/40 bg-primary-foreground/10' : 'border-primary/40 bg-primary/5'
            }`}
          >
            <span className="font-medium opacity-70">Replied message</span>
          </div>
        )}

        {renderContent()}

        {isStarred && !isDeleted && (
          <Star className={`absolute -top-1 -left-1 h-3 w-3 fill-amber-400 text-amber-400`} />
        )}

        {isEdited && !isDeleted && (
          <span className={`text-[9px] ${isSent ? 'text-primary-foreground/50' : 'text-muted-foreground/70'} ml-1`}>edited</span>
        )}

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
          {isSent && !isDeleted && (
            message.isRead ? (
              <CheckCheck className="h-3 w-3 text-primary-foreground/70" />
            ) : message.isDelivered ? (
              <CheckCheck className="h-3 w-3 text-primary-foreground/40" />
            ) : (
              <Check className="h-3 w-3 text-primary-foreground/40" />
            )
          )}
        </div>

        {!isDeleted && (
          <button
            onClick={() => showReply?.(message.id)}
            className="absolute -top-1 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground rounded-full p-1 shadow-md border border-border"
          >
            <Reply className="h-3 w-3" />
          </button>
        )}
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

export default function ChatView({
  onOpenMediaGallery,
  onOpenWallpaper,
  onOpenE2EInfo,
  onOpenVoiceRecorder,
}: {
  onOpenMediaGallery?: (media: { url?: string; type: string; name: string; sender: string; time: string }) => void;
  onOpenWallpaper?: () => void;
  onOpenE2EInfo?: () => void;
  onOpenVoiceRecorder?: () => void;
}) {
  const { activeChat, messages, setActiveChat } = useChatStore();
  const { setActiveCall } = useCallStore();
  const [inputText, setInputText] = useState('');
  const [showEmojiHint, setShowEmojiHint] = useState(false);
  const [showDialMenu, setShowDialMenu] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMessages = activeChat ? messages[activeChat.id] || [] : [];

  const onlineUsers = useMemo(() => {
    const map = new Map<string, boolean>();
    mockUsers.forEach((u) => map.set(u.id, u.isOnline));
    return map;
  }, []);

  const isOtherOnline = useMemo(() => {
    if (!activeChat || activeChat.isGroup) return false;
    const otherMemberId = activeChat.members.find((m) => m !== 'demo-user-1');
    return otherMemberId ? onlineUsers.get(otherMemberId) ?? false : false;
  }, [activeChat, onlineUsers]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages.length]);

  const handleStartCall = (callType: 'audio' | 'video') => {
    if (!activeChat) return;
    const otherMemberId = activeChat.members.find((m) => m !== 'demo-user-1') || activeChat.members[0];
    const otherName = activeChat.name;
    setActiveCall({
      id: `call-${Date.now()}`,
      callType,
      isGroup: false,
      participants: [{ id: otherMemberId, name: otherName, avatar: null }],
      status: 'ringing',
      isMuted: false,
      isSpeakerOn: false,
      isVideoOn: callType === 'video',
      isRecording: false,
      isScreenSharing: false,
      isNoiseCancellation: true,
      isOnHold: false,
      isBluetoothConnected: false,
      duration: 0,
      callQuality: 'excellent',
      networkStrength: 4,
      e2eEncrypted: true,
      isLowDataMode: false,
      isVirtualBackground: false,
      isPictureInPicture: false,
      isSwitchingCamera: false,
      isLiveCaptioning: false,
      isVoiceEnhancement: false,
      groupCallLayout: 'grid',
      raisedHands: [],
      activeSpeakerId: null,
      maxParticipants: 32,
      callStartTime: null,
    });
    setShowDialMenu(false);
  };

  const handleStartGroupCall = (callType: 'audio' | 'video') => {
    if (!activeChat) return;
    const groupParticipants = activeChat.members.map((mId) => ({
      id: mId,
      name: mId === 'demo-user-1' ? 'You' : `Member ${mId.slice(-3)}`,
      avatar: null,
    }));
    setActiveCall({
      id: `call-${Date.now()}`,
      callType,
      isGroup: true,
      participants: groupParticipants,
      status: 'ringing',
      isMuted: false,
      isSpeakerOn: false,
      isVideoOn: callType === 'video',
      isRecording: false,
      isScreenSharing: false,
      isNoiseCancellation: true,
      isOnHold: false,
      isBluetoothConnected: false,
      duration: 0,
      callQuality: 'excellent',
      networkStrength: 4,
      e2eEncrypted: true,
      isLowDataMode: false,
      isVirtualBackground: false,
      isPictureInPicture: false,
      isSwitchingCamera: false,
      isLiveCaptioning: false,
      isVoiceEnhancement: false,
      groupCallLayout: 'grid',
      raisedHands: [],
      activeSpeakerId: null,
      maxParticipants: 32,
      callStartTime: null,
    });
    setShowDialMenu(false);
  };

  const handleSend = () => {
    if (!inputText.trim() || !activeChat) return;
    setInputText('');
  };

  if (!activeChat) {
    return <EmptyState />;
  }

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Chat Header */}
      <div className="flex items-center gap-3 border-b px-4 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shrink-0">
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
          <div className="flex items-center gap-1">
            {activeChat.e2eEncrypted && !activeChat.isGroup && (
              <svg className="h-3 w-3 text-muted-foreground shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            )}
            <p className="text-xs text-muted-foreground">
              {activeChat.isGroup
                ? `${activeChat.members.length} members`
                : activeChat.isTyping
                  ? 'typing...'
                  : isOtherOnline
                    ? 'Online'
                    : 'Last seen recently'}
            </p>
            {activeChat.disappearingMessages && (
              <span className="text-[10px] text-muted-foreground ml-1">
                ⏱ {activeChat.disappearingDuration}h
              </span>
            )}
          </div>
        </div>

        {/* Dial Button with Dropdown */}
        <div className="flex items-center gap-1 shrink-0 relative">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full relative electric-spark"
              onClick={() => setShowDialMenu(!showDialMenu)}
            >
              <div className="flash-glow relative">
                <Zap className="h-5 w-5 text-primary" />
                {/* Lightning sparkle effect */}
                <Sparkles className="h-3 w-3 text-primary/60 absolute -top-1 -right-1 lightning-flash" />
              </div>
            </Button>
            {/* Pulse ring */}
            <div className="absolute inset-0 rounded-full dial-pulse pointer-events-none" />
            
            {/* Dropdown menu */}
            <AnimatePresence>
              {showDialMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowDialMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 z-50 min-w-[220px] rounded-xl border border-border bg-popover p-1.5 shadow-xl"
                  >
                    {/* Audio Call */}
                    <button
                      onClick={() => handleStartCall('audio')}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent transition-colors"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 shrink-0">
                        <Phone className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Audio Call</p>
                        <p className="text-[10px] text-muted-foreground">Voice call with E2E encryption</p>
                      </div>
                    </button>
                    
                    {/* Video Call */}
                    <button
                      onClick={() => handleStartCall('video')}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent transition-colors"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 shrink-0">
                        <Video className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Video Call</p>
                        <p className="text-[10px] text-muted-foreground">HD video with screen share</p>
                      </div>
                    </button>

                    {/* Group Call - always shown */}
                    <div className="my-1 h-px bg-border" />
                    <button
                      onClick={() => handleStartGroupCall('video')}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent transition-colors"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/10 shrink-0">
                        <Users className="h-4 w-4 text-violet-500" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Group Call</p>
                        <p className="text-[10px] text-muted-foreground">Call all {activeChat?.members.length || 0} members</p>
                      </div>
                    </button>
                    
                    <div className="my-1 h-px bg-border" />
                    
                    <div className="px-3 py-1.5 flex items-center gap-1.5">
                      <ShieldCheck className="h-3 w-3 text-emerald-500" />
                      <p className="text-[10px] text-muted-foreground">End-to-end encrypted</p>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4">
        <div className="py-4">
          <div className="flex items-center justify-center mb-4">
            <Badge variant="secondary" className="text-[10px] font-normal rounded-full px-3 py-0.5">
              Today
            </Badge>
          </div>

          <AnimatePresence initial={false}>
            {chatMessages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isSent={msg.senderId === 'demo-user-1'}
                showReply={(id) => {
                  console.log('Reply to message:', id);
                }}
              />
            ))}
          </AnimatePresence>

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
      <div className="border-t bg-background p-3 shrink-0">
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
