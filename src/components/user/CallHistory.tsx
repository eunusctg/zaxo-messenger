'use client';

import { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  Video,
  PhoneOff,
  ArrowUpRight,
  ArrowDownLeft,
  PhoneCall,
  Video as VideoIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useCallStore, CallRecord } from '@/stores';
import { mockCallHistory } from '@/lib/mock-data';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDuration(seconds: number): string {
  if (seconds === 0) return '—';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

interface CallItemProps {
  call: CallRecord;
  isCurrentUserCaller: boolean;
  onCallBack: (call: CallRecord, type: 'audio' | 'video') => void;
}

function CallItem({ call, isCurrentUserCaller, onCallBack }: CallItemProps) {
  const isMissed = call.status === 'missed';
  const isOutgoing = call.status === 'outgoing' || isCurrentUserCaller;
  const isVideo = call.callType === 'video';

  const displayName = isCurrentUserCaller ? call.receiverName : call.callerName;
  const displayNumber = isCurrentUserCaller ? call.receiverNumber : call.callerNumber;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors"
    >
      {/* Avatar */}
      <Avatar className="h-11 w-11 shrink-0">
        <AvatarFallback
          className={`font-semibold text-sm ${
            isMissed ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
          }`}
        >
          {getInitials(displayName)}
        </AvatarFallback>
      </Avatar>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className={`text-sm font-medium truncate ${isMissed ? 'text-destructive' : ''}`}>
            {displayName}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          {/* Call direction icon */}
          {isOutgoing ? (
            <ArrowUpRight className={`h-3 w-3 ${isMissed ? 'text-destructive' : 'text-primary'}`} />
          ) : (
            <ArrowDownLeft className={`h-3 w-3 ${isMissed ? 'text-destructive' : 'text-muted-foreground'}`} />
          )}
          {/* Call type icon */}
          {isVideo ? (
            <Video className="h-3 w-3 text-muted-foreground" />
          ) : (
            <Phone className="h-3 w-3 text-muted-foreground" />
          )}
          <span className="text-xs text-muted-foreground">
            {isMissed ? 'Missed' : isOutgoing ? 'Outgoing' : 'Incoming'}
            {call.duration > 0 && ` · ${formatDuration(call.duration)}`}
          </span>
        </div>
      </div>

      {/* Time + Call back buttons */}
      <div className="flex items-center gap-1 shrink-0">
        <span className="text-xs text-muted-foreground mr-1">{call.timestamp}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-primary hover:bg-primary/10"
          onClick={() => onCallBack(call, 'audio')}
        >
          <PhoneCall className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-primary hover:bg-primary/10"
          onClick={() => onCallBack(call, 'video')}
        >
          <Video className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}

export default function CallHistory() {
  const { setCallHistory, callHistory, setActiveCall } = useCallStore();

  // Initialize mock data
  useMemo(() => {
    if (callHistory.length === 0) {
      setCallHistory(mockCallHistory);
    }
  }, [callHistory.length, setCallHistory]);

  // Group calls by time period
  const groupedCalls = useMemo(() => {
    const today: CallRecord[] = [];
    const yesterday: CallRecord[] = [];
    const earlier: CallRecord[] = [];

    callHistory.forEach((call) => {
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
  }, [callHistory]);

  const handleCallBack = useCallback(
    (call: CallRecord, type: 'audio' | 'video') => {
      const isCurrentUserCaller = call.callerId === 'demo-user-1';
      const targetId = isCurrentUserCaller ? call.receiverId : call.callerId;
      const targetName = isCurrentUserCaller ? call.receiverName : call.callerName;

      setActiveCall({
        id: `call-${Date.now()}`,
        callType: type,
        isGroup: false,
        participants: [{ id: targetId, name: targetName, avatar: null }],
        status: 'ringing',
        isMuted: false,
        isSpeakerOn: false,
        isVideoOn: type === 'video',
        duration: 0,
      });
    },
    [setActiveCall]
  );

  const renderGroup = (label: string, calls: CallRecord[]) => {
    if (calls.length === 0) return null;
    return (
      <div>
        <div className="px-4 py-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {label}
          </span>
        </div>
        {calls.map((call) => (
          <CallItem
            key={call.id}
            call={call}
            isCurrentUserCaller={call.callerId === 'demo-user-1'}
            onCallBack={handleCallBack}
          />
        ))}
      </div>
    );
  };

  const hasCalls = callHistory.length > 0;

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold">Calls</h1>
      </div>

      {/* Call history list */}
      <ScrollArea className="flex-1">
        {hasCalls ? (
          <div>
            {renderGroup('Today', groupedCalls.today)}
            {groupedCalls.today.length > 0 && groupedCalls.yesterday.length > 0 && (
              <Separator className="my-1" />
            )}
            {renderGroup('Yesterday', groupedCalls.yesterday)}
            {groupedCalls.yesterday.length > 0 && groupedCalls.earlier.length > 0 && (
              <Separator className="my-1" />
            )}
            {renderGroup('Earlier', groupedCalls.earlier)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <PhoneOff className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No call history</p>
            <p className="text-xs text-muted-foreground mt-1">
              Your recent calls will appear here
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
