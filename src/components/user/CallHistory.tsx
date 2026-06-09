'use client';

import { useMemo, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, Video, PhoneOff, ArrowUpRight, ArrowDownLeft,
  PhoneCall, Users, Zap, Search, Filter, Clock, Star,
  MoreVertical, MessageCircle, Shield, Radio, MonitorUp,
  Volume2, CircleDot, Wifi, Sparkles,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useCallStore, CallRecord } from '@/stores';
import { mockCallHistory, mockUsers } from '@/lib/mock-data';

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function formatDuration(seconds: number): string {
  if (seconds === 0) return '—';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

// New call modal
function NewCallModal({ onClose, onStartCall }: { onClose: () => void; onStartCall: (userId: string, name: string, type: 'audio' | 'video') => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [callType, setCallType] = useState<'audio' | 'video'>('audio');

  const filteredUsers = mockUsers.filter((u) =>
    u.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="relative w-full max-w-md bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl border border-border overflow-hidden max-h-[80vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">New Call</h3>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <PhoneOff className="h-4 w-4" />
            </Button>
          </div>
          {/* Call type toggle */}
          <div className="flex gap-2 mb-3">
            <Button
              variant={callType === 'audio' ? 'default' : 'outline'}
              size="sm"
              className="flex-1 gap-2"
              onClick={() => setCallType('audio')}
            >
              <Phone className="h-4 w-4" />
              Audio Call
            </Button>
            <Button
              variant={callType === 'video' ? 'default' : 'outline'}
              size="sm"
              className="flex-1 gap-2"
              onClick={() => setCallType('video')}
            >
              <Video className="h-4 w-4" />
              Video Call
            </Button>
          </div>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts..."
              className="w-full rounded-xl bg-muted/50 pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Contact list */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => onStartCall(user.id, user.displayName, callType)}
                className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-accent/50 transition-colors"
              >
                <Avatar className="h-11 w-11 shrink-0">
                  <AvatarFallback className={`font-semibold text-sm ${user.isOnline ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {getInitials(user.displayName)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-sm font-medium truncate">{user.displayName}</p>
                  <p className="text-xs text-muted-foreground">{user.isOnline ? 'Online' : 'Offline'}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`h-2 w-2 rounded-full ${user.isOnline ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`} />
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {callType === 'audio' ? <Phone className="h-2.5 w-2.5" /> : <Video className="h-2.5 w-2.5" />}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t border-border flex items-center justify-center gap-2">
          <Shield className="h-3.5 w-3.5 text-emerald-500" />
          <span className="text-[10px] text-muted-foreground">All calls are end-to-end encrypted</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface CallItemProps {
  call: CallRecord;
  isCurrentUserCaller: boolean;
  onCallBack: (call: CallRecord, type: 'audio' | 'video') => void;
}

function CallItem({ call, isCurrentUserCaller, onCallBack }: CallItemProps) {
  const [showActions, setShowActions] = useState(false);
  const isMissed = call.status === 'missed';
  const isOutgoing = call.status === 'outgoing' || isCurrentUserCaller;
  const isVideo = call.callType === 'video';
  const isGroupCall = call.isGroup;

  const displayName = isCurrentUserCaller ? call.receiverName : call.callerName;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="group flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-accent/50 transition-colors relative"
    >
      <Avatar className="h-9 w-9 sm:h-11 sm:w-11 shrink-0">
        <AvatarFallback
          className={`font-semibold text-xs sm:text-sm ${
            isGroupCall ? 'bg-violet-500/10 text-violet-500' :
            isMissed ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
          }`}
        >
          {isGroupCall ? <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : getInitials(displayName)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className={`text-xs sm:text-sm font-medium truncate ${isMissed ? 'text-destructive' : ''}`}>
            {displayName}
          </span>
          {isGroupCall && (
            <Badge variant="secondary" className="text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0 bg-violet-500/10 text-violet-500">
              Group
            </Badge>
          )}
          {isVideo && (
            <Badge variant="secondary" className="text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0 bg-blue-500/10 text-blue-500">
              HD
            </Badge>
          )}
          {call.wasRecorded && (
            <Badge variant="secondary" className="text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0 bg-red-500/10 text-red-500">
              REC
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5">
          {isOutgoing ? (
            <ArrowUpRight className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${isMissed ? 'text-destructive' : 'text-primary'}`} />
          ) : (
            <ArrowDownLeft className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${isMissed ? 'text-destructive' : 'text-muted-foreground'}`} />
          )}
          {isVideo ? (
            <Video className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground" />
          ) : (
            <Phone className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground" />
          )}
          <span className="text-[10px] sm:text-xs text-muted-foreground">
            {isMissed ? 'Missed' : isOutgoing ? 'Outgoing' : 'Incoming'}
            {call.duration > 0 && ` · ${formatDuration(call.duration)}`}
          </span>
          {call.callQuality && (
            <span className={`text-[8px] sm:text-[9px] hidden sm:inline ${call.callQuality === 'excellent' ? 'text-emerald-500' : call.callQuality === 'good' ? 'text-blue-500' : 'text-amber-500'}`}>
              · {call.callQuality}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
        <span className="text-[10px] sm:text-xs text-muted-foreground mr-0.5 sm:mr-1 hidden sm:inline">{call.timestamp}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 sm:h-8 sm:w-8 rounded-full text-primary hover:bg-primary/10"
          onClick={() => onCallBack(call, 'audio')}
        >
          <PhoneCall className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 sm:h-8 sm:w-8 rounded-full text-primary hover:bg-primary/10"
          onClick={() => onCallBack(call, 'video')}
        >
          <Video className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 sm:h-7 sm:w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setShowActions(!showActions)}
        >
          <MoreVertical className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </Button>
      </div>

      {/* Quick actions dropdown */}
      <AnimatePresence>
        {showActions && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowActions(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-4 top-12 z-50 min-w-[160px] rounded-xl border border-border bg-popover p-1.5 shadow-xl"
            >
              <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors">
                <MessageCircle className="h-4 w-4" /> Message
              </button>
              <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors">
                <Star className="h-4 w-4" /> Favorite
              </button>
              <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors">
                <Shield className="h-4 w-4" /> Block
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CallHistory() {
  const { setCallHistory, callHistory, setActiveCall } = useCallStore();
  const [showNewCall, setShowNewCall] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'missed' | 'audio' | 'video' | 'group'>('all');

  useMemo(() => {
    if (callHistory.length === 0) {
      setCallHistory(mockCallHistory);
    }
  }, [callHistory.length, setCallHistory]);

  const filteredCalls = useMemo(() => {
    switch (filterType) {
      case 'missed': return callHistory.filter((c) => c.status === 'missed');
      case 'audio': return callHistory.filter((c) => c.callType === 'audio');
      case 'video': return callHistory.filter((c) => c.callType === 'video');
      case 'group': return callHistory.filter((c) => c.isGroup);
      default: return callHistory;
    }
  }, [callHistory, filterType]);

  const groupedCalls = useMemo(() => {
    const today: CallRecord[] = [];
    const yesterday: CallRecord[] = [];
    const earlier: CallRecord[] = [];

    filteredCalls.forEach((call) => {
      const ts = call.timestamp.toLowerCase();
      if (ts.includes('pm') || ts.includes('am')) {
        today.push(call);
      } else if (ts.includes('yesterday')) {
        yesterday.push(call);
      } else {
        earlier.push(call);
      }
    });

    return { today, yesterday, earlier };
  }, [filteredCalls]);

  const handleCallBack = useCallback(
    (call: CallRecord, type: 'audio' | 'video') => {
      const isCurrentUserCaller = call.callerId === 'demo-user-1';
      const targetId = isCurrentUserCaller ? call.receiverId : call.callerId;
      const targetName = isCurrentUserCaller ? call.receiverName : call.callerName;

      setActiveCall({
        id: `call-${Date.now()}`,
        callType: type,
        isGroup: call.isGroup,
        participants: call.isGroup && call.participants
          ? call.participants.map((p) => ({ ...p, avatar: null }))
          : [{ id: targetId, name: targetName, avatar: null }],
        status: 'ringing',
        isMuted: false,
        isSpeakerOn: false,
        isVideoOn: type === 'video',
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
    },
    [setActiveCall]
  );

  const handleStartNewCall = useCallback(
    (userId: string, name: string, type: 'audio' | 'video') => {
      setActiveCall({
        id: `call-${Date.now()}`,
        callType: type,
        isGroup: false,
        participants: [{ id: userId, name, avatar: null }],
        status: 'ringing',
        isMuted: false,
        isSpeakerOn: false,
        isVideoOn: type === 'video',
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
      setShowNewCall(false);
    },
    [setActiveCall]
  );

  const renderGroup = (label: string, calls: CallRecord[]) => {
    if (calls.length === 0) return null;
    return (
      <div>
        <div className="px-4 py-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
        </div>
        {calls.map((call) => (
          <CallItem key={call.id} call={call} isCurrentUserCaller={call.callerId === 'demo-user-1'} onCallBack={handleCallBack} />
        ))}
      </div>
    );
  };

  const filterButtons = [
    { id: 'all' as const, label: 'All', icon: Phone },
    { id: 'missed' as const, label: 'Missed', icon: PhoneOff },
    { id: 'audio' as const, label: 'Audio', icon: Radio },
    { id: 'video' as const, label: 'Video', icon: MonitorUp },
    { id: 'group' as const, label: 'Group', icon: Users },
  ];

  return (
    <div className="flex h-full flex-col bg-background min-h-0">
      {/* Header */}
      <div className="px-3 sm:px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg sm:text-xl font-bold">Calls</h1>
          <Button
            onClick={() => setShowNewCall(true)}
            className="gap-1.5 sm:gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-3 sm:px-4 h-8 sm:h-9 text-xs sm:text-sm"
          >
            <div className="flash-glow relative">
              <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <Sparkles className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-primary-foreground/60 absolute -top-1 -right-1 lightning-flash" />
            </div>
            New Call
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 sm:gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {filterButtons.map((btn) => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.id}
                onClick={() => setFilterType(btn.id)}
                className={`flex items-center gap-1 sm:gap-1.5 rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium whitespace-nowrap transition-colors ${
                  filterType === btn.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground hover:bg-accent'
                }`}
              >
                <Icon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                {btn.label}
              </button>
            );
          })}
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-3 sm:gap-4 mt-2 text-[9px] sm:text-[10px] text-muted-foreground overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 shrink-0">
            <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            {callHistory.length} total
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <PhoneOff className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            {callHistory.filter((c) => c.status === 'missed').length} missed
          </div>
          <div className="flex items-center gap-1 shrink-0 hidden sm:flex">
            <Wifi className="h-3 w-3" />
            HD Quality
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Shield className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-emerald-500" />
            E2E
          </div>
        </div>
      </div>

      {/* Call history list */}
      <ScrollArea className="flex-1">
        {filteredCalls.length > 0 ? (
          <div>
            {renderGroup('Today', groupedCalls.today)}
            {groupedCalls.today.length > 0 && groupedCalls.yesterday.length > 0 && <Separator className="my-1" />}
            {renderGroup('Yesterday', groupedCalls.yesterday)}
            {groupedCalls.yesterday.length > 0 && groupedCalls.earlier.length > 0 && <Separator className="my-1" />}
            {renderGroup('Earlier', groupedCalls.earlier)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <PhoneOff className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No {filterType !== 'all' ? filterType : ''} calls</p>
            <p className="text-xs text-muted-foreground mt-1">
              Start a new call to begin
            </p>
          </div>
        )}
      </ScrollArea>

      {/* New Call Modal */}
      <AnimatePresence>
        {showNewCall && (
          <NewCallModal onClose={() => setShowNewCall(false)} onStartCall={handleStartNewCall} />
        )}
      </AnimatePresence>
    </div>
  );
}
