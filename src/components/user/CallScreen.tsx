'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, MicOff, Volume2, VolumeX, Video, VideoOff,
  PhoneOff, PhoneCall, Camera, Phone, Users, UserPlus,
  MonitorUp, MonitorOff, Bluetooth, BluetoothOff,
  Shield, ShieldCheck, CircleDot, Radio, EarOff,
  MoreVertical, MessageCircle, Hash, Pause, Play,
  Circle, Download, Zap, Signal, Wifi
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCallStore } from '@/stores';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Call timer with key-based reset
function CallTimer({ isActive }: { isActive: boolean }) {
  const [duration, setDuration] = useState(0);
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(interval);
  }, [isActive]);
  if (!isActive) return null;
  return (
    <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-white/60 text-sm">
      {formatDuration(duration)}
    </motion.p>
  );
}

// Network strength indicator
function NetworkStrength({ strength }: { strength: number }) {
  return (
    <div className="flex items-end gap-0.5 h-3">
      {[1, 2, 3, 4].map((level) => (
        <div
          key={level}
          className={`w-1 rounded-full ${level <= strength ? 'bg-emerald-400' : 'bg-white/20'}`}
          style={{ height: `${level * 25}%` }}
        />
      ))}
    </div>
  );
}

// Call quality badge
function CallQualityBadge({ quality }: { quality: string }) {
  const colors: Record<string, string> = {
    excellent: 'bg-emerald-500/20 text-emerald-400',
    good: 'bg-blue-500/20 text-blue-400',
    fair: 'bg-amber-500/20 text-amber-400',
    poor: 'bg-red-500/20 text-red-400',
  };
  return (
    <Badge className={`${colors[quality] || colors.good} border-0 text-[10px] px-2 py-0`}>
      <CircleDot className="h-2.5 w-2.5 mr-1" />
      {quality.charAt(0).toUpperCase() + quality.slice(1)}
    </Badge>
  );
}

// Group call participant grid
function GroupParticipantsGrid({ participants }: { participants: { id: string; name: string; avatar: string | null; isMuted?: boolean; isVideoOn?: boolean; isSpeaking?: boolean }[] }) {
  return (
    <div className={`grid gap-2 ${participants.length <= 4 ? 'grid-cols-2' : participants.length <= 9 ? 'grid-cols-3' : 'grid-cols-4'} w-full max-w-lg mx-auto`}>
      {participants.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/5 backdrop-blur-sm ${p.isSpeaking ? 'speaking-indicator' : ''}`}
        >
          <Avatar className="h-14 w-14 border-2 border-white/10">
            <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
              {getInitials(p.name)}
            </AvatarFallback>
          </Avatar>
          <span className="text-[10px] text-white/70 truncate max-w-full">{p.name}</span>
          {p.isMuted && <MicOff className="absolute top-2 right-2 h-3 w-3 text-red-400" />}
          {p.isVideoOn && (
            <div className="absolute inset-0 rounded-xl bg-zinc-800 flex items-center justify-center">
              <Camera className="h-5 w-5 text-zinc-600" />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

export default function CallScreen() {
  const {
    activeCall, toggleMute, toggleSpeaker, toggleVideo,
    toggleRecording, toggleScreenShare, toggleNoiseCancellation,
    toggleHold, toggleBluetooth, addParticipant, endCall, updateCallStatus
  } = useCallStore();
  const [isIncoming, setIsIncoming] = useState(false);
  const [showMoreControls, setShowMoreControls] = useState(false);
  const [showChatOverlay, setShowChatOverlay] = useState(false);
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const incomingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoConnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (activeCall?.status === 'ringing') {
      incomingTimeoutRef.current = setTimeout(() => setIsIncoming(true), 500);
    }
    return () => { if (incomingTimeoutRef.current) clearTimeout(incomingTimeoutRef.current); };
  }, [activeCall?.status]);

  useEffect(() => {
    if (activeCall?.status === 'ringing' && !isIncoming) {
      autoConnectTimeoutRef.current = setTimeout(() => updateCallStatus('connected'), 3000);
    }
    return () => { if (autoConnectTimeoutRef.current) clearTimeout(autoConnectTimeoutRef.current); };
  }, [activeCall?.status, isIncoming, updateCallStatus]);

  const handleAcceptCall = useCallback(() => {
    updateCallStatus('connected');
    setIsIncoming(false);
  }, [updateCallStatus]);

  const handleDeclineCall = useCallback(() => {
    endCall();
    setIsIncoming(false);
  }, [endCall]);

  if (!activeCall) return null;

  const participant = activeCall.participants[0];
  const participantName = activeCall.isGroup ? `Group Call (${activeCall.participants.length})` : (participant?.name || 'Unknown');
  const isVideoCall = activeCall.callType === 'video';
  const isConnected = activeCall.status === 'connected';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl"
      >
        {/* Video call camera preview */}
        {isVideoCall && activeCall.isVideoOn && isConnected && (
          <div className="absolute inset-0 bg-zinc-900">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-zinc-600 text-sm">Camera Preview</div>
            </div>
            {/* Self-view PIP */}
            <div className="absolute top-4 right-4 h-32 w-24 rounded-xl bg-zinc-800 border-2 border-white/10 overflow-hidden flex items-center justify-center">
              <Camera className="h-6 w-6 text-zinc-600" />
            </div>
            {/* Screen share indicator */}
            {activeCall.isScreenSharing && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 rounded-lg px-3 py-1.5 screen-share-glow">
                <MonitorUp className="h-4 w-4 text-primary" />
                <span className="text-xs text-white">Screen Sharing</span>
              </div>
            )}
          </div>
        )}

        {/* Top status bar */}
        <div className="absolute top-0 left-0 right-0 z-30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {activeCall.e2eEncrypted !== false && (
                <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-[10px] px-2 py-0">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  Encrypted
                </Badge>
              )}
              <CallQualityBadge quality={activeCall.callQuality} />
              <NetworkStrength strength={activeCall.networkStrength} />
            </div>
            <div className="flex items-center gap-2">
              {activeCall.isRecording && (
                <div className="flex items-center gap-1 bg-red-500/20 rounded-full px-2.5 py-1 rec-blink">
                  <CircleDot className="h-3 w-3 text-red-400" />
                  <span className="text-[10px] text-red-400 font-medium">REC</span>
                </div>
              )}
              {activeCall.isNoiseCancellation && (
                <Badge className="bg-blue-500/20 text-blue-400 border-0 text-[10px] px-2 py-0">
                  <Radio className="h-3 w-3 mr-1" />
                  Noise Off
                </Badge>
              )}
              {activeCall.isBluetoothConnected && (
                <Bluetooth className="h-4 w-4 text-blue-400" />
              )}
            </div>
          </div>
        </div>

        {/* Group call participant grid */}
        {activeCall.isGroup && isConnected ? (
          <div className="relative z-10 flex flex-col items-center gap-4 px-4 w-full max-h-[50vh] overflow-y-auto">
            <GroupParticipantsGrid participants={activeCall.participants} />
            <h2 className="text-xl font-bold text-white">{participantName}</h2>
            <CallTimer isActive={isConnected} />
          </div>
        ) : (
          /* 1-on-1 caller info */
          <div className="relative z-10 flex flex-col items-center gap-4">
            <motion.div
              animate={activeCall.status === 'ringing' ? { scale: [1, 1.05, 1] } : { scale: 1 }}
              transition={activeCall.status === 'ringing' ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : {}}
            >
              <div className={activeCall.status === 'ringing' ? 'call-pulse rounded-full' : ''}>
                <Avatar className="h-28 w-28 border-4 border-white/20">
                  <AvatarFallback className="bg-primary/20 text-primary text-3xl font-bold">
                    {activeCall.isGroup ? <Users className="h-10 w-10" /> : getInitials(participant?.name || 'Unknown')}
                  </AvatarFallback>
                </Avatar>
              </div>
            </motion.div>
            <h2 className="text-2xl font-bold text-white">{participantName}</h2>
            {activeCall.status === 'ringing' ? (
              <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-white/60 text-sm">
                {isIncoming ? 'Incoming call...' : 'Ringing...'}
              </motion.p>
            ) : activeCall.status === 'connected' ? (
              <CallTimer isActive={isConnected} />
            ) : (
              <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-white/60 text-sm">Call ended</motion.p>
            )}
            <div className="flex items-center gap-1.5 text-white/40">
              {isVideoCall ? <Video className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
              <span className="text-xs">{isVideoCall ? 'Video Call' : 'Audio Call'}</span>
              {activeCall.isOnHold && (
                <Badge className="bg-amber-500/20 text-amber-400 border-0 text-[10px] ml-2 px-2 py-0">On Hold</Badge>
              )}
            </div>
          </div>
        )}

        {/* Incoming call buttons */}
        {isIncoming && activeCall.status === 'ringing' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-16 flex items-center gap-8 z-20"
          >
            <div className="flex flex-col items-center gap-2">
              <Button onClick={handleDeclineCall} className="h-16 w-16 rounded-full bg-destructive hover:bg-destructive/90 text-white shadow-lg shadow-destructive/30" size="icon">
                <PhoneOff className="h-7 w-7" />
              </Button>
              <span className="text-xs text-white/60">Decline</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button onClick={handleAcceptCall} className="h-16 w-16 rounded-full bg-emerald-500 hover:bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/30" size="icon">
                <PhoneCall className="h-7 w-7" />
              </Button>
              <span className="text-xs text-white/60">Accept</span>
            </div>
          </motion.div>
        ) : (
          /* Call controls */
          <div className="absolute bottom-0 left-0 right-0 z-20 pb-6 pt-4 bg-gradient-to-t from-black/80 to-transparent">
            {/* Main controls row */}
            <div className="flex items-center justify-center gap-5 mb-4">
              {/* Mute */}
              <div className="flex flex-col items-center gap-1.5">
                <Button onClick={toggleMute} variant="ghost" className={`h-12 w-12 rounded-full ${activeCall.isMuted ? 'bg-white text-red-500' : 'bg-white/10 text-white hover:bg-white/20'}`} size="icon">
                  {activeCall.isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                <span className="text-[9px] text-white/50">{activeCall.isMuted ? 'Unmute' : 'Mute'}</span>
              </div>

              {/* Speaker */}
              <div className="flex flex-col items-center gap-1.5">
                <Button onClick={toggleSpeaker} variant="ghost" className={`h-12 w-12 rounded-full ${activeCall.isSpeakerOn ? 'bg-white text-emerald-600' : 'bg-white/10 text-white hover:bg-white/20'}`} size="icon">
                  {activeCall.isSpeakerOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                </Button>
                <span className="text-[9px] text-white/50">Speaker</span>
              </div>

              {/* Video toggle */}
              {isVideoCall && (
                <div className="flex flex-col items-center gap-1.5">
                  <Button onClick={toggleVideo} variant="ghost" className={`h-12 w-12 rounded-full ${activeCall.isVideoOn ? 'bg-white text-emerald-600' : 'bg-white/10 text-white hover:bg-white/20'}`} size="icon">
                    {activeCall.isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </Button>
                  <span className="text-[9px] text-white/50">Video</span>
                </div>
              )}

              {/* Screen share */}
              {isVideoCall && (
                <div className="flex flex-col items-center gap-1.5">
                  <Button onClick={toggleScreenShare} variant="ghost" className={`h-12 w-12 rounded-full ${activeCall.isScreenSharing ? 'bg-white text-primary' : 'bg-white/10 text-white hover:bg-white/20'}`} size="icon">
                    {activeCall.isScreenSharing ? <MonitorUp className="h-5 w-5" /> : <MonitorOff className="h-5 w-5" />}
                  </Button>
                  <span className="text-[9px] text-white/50">Share</span>
                </div>
              )}

              {/* End call */}
              <div className="flex flex-col items-center gap-1.5">
                <Button onClick={endCall} className="h-12 w-12 rounded-full bg-destructive hover:bg-destructive/90 text-white shadow-lg shadow-destructive/30" size="icon">
                  <PhoneOff className="h-5 w-5" />
                </Button>
                <span className="text-[9px] text-white/50">End</span>
              </div>
            </div>

            {/* More controls - expandable */}
            <AnimatePresence>
              {showMoreControls && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center justify-center gap-4 pb-3 flex-wrap px-4">
                    {/* Record */}
                    <div className="flex flex-col items-center gap-1.5">
                      <Button onClick={toggleRecording} variant="ghost" className={`h-10 w-10 rounded-full ${activeCall.isRecording ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white hover:bg-white/20'}`} size="icon">
                        <CircleDot className="h-4 w-4" />
                      </Button>
                      <span className="text-[9px] text-white/50">Record</span>
                    </div>

                    {/* Noise cancellation */}
                    <div className="flex flex-col items-center gap-1.5">
                      <Button onClick={toggleNoiseCancellation} variant="ghost" className={`h-10 w-10 rounded-full ${activeCall.isNoiseCancellation ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-white hover:bg-white/20'}`} size="icon">
                        {activeCall.isNoiseCancellation ? <Radio className="h-4 w-4" /> : <EarOff className="h-4 w-4" />}
                      </Button>
                      <span className="text-[9px] text-white/50">Noise</span>
                    </div>

                    {/* Bluetooth */}
                    <div className="flex flex-col items-center gap-1.5">
                      <Button onClick={toggleBluetooth} variant="ghost" className={`h-10 w-10 rounded-full ${activeCall.isBluetoothConnected ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-white hover:bg-white/20'}`} size="icon">
                        {activeCall.isBluetoothConnected ? <Bluetooth className="h-4 w-4" /> : <BluetoothOff className="h-4 w-4" />}
                      </Button>
                      <span className="text-[9px] text-white/50">BT</span>
                    </div>

                    {/* Hold */}
                    <div className="flex flex-col items-center gap-1.5">
                      <Button onClick={toggleHold} variant="ghost" className={`h-10 w-10 rounded-full ${activeCall.isOnHold ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10 text-white hover:bg-white/20'}`} size="icon">
                        {activeCall.isOnHold ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                      </Button>
                      <span className="text-[9px] text-white/50">{activeCall.isOnHold ? 'Resume' : 'Hold'}</span>
                    </div>

                    {/* Add participant */}
                    <div className="flex flex-col items-center gap-1.5">
                      <Button onClick={() => setShowAddParticipant(!showAddParticipant)} variant="ghost" className="h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20" size="icon">
                        <UserPlus className="h-4 w-4" />
                      </Button>
                      <span className="text-[9px] text-white/50">Add</span>
                    </div>

                    {/* Chat */}
                    <div className="flex flex-col items-center gap-1.5">
                      <Button onClick={() => setShowChatOverlay(!showChatOverlay)} variant="ghost" className="h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20" size="icon">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <span className="text-[9px] text-white/50">Chat</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* More toggle */}
            <div className="flex justify-center">
              <Button onClick={() => setShowMoreControls(!showMoreControls)} variant="ghost" className="text-white/40 hover:text-white/60 text-xs gap-1">
                <MoreVertical className="h-3.5 w-3.5" />
                {showMoreControls ? 'Less' : 'More'}
              </Button>
            </div>
          </div>
        )}

        {/* Add Participant Quick Panel */}
        <AnimatePresence>
          {showAddParticipant && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-32 left-4 right-4 z-30 bg-zinc-900/95 backdrop-blur-lg rounded-2xl border border-white/10 p-4 max-h-60 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">Add Participant</h3>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-white/60" onClick={() => setShowAddParticipant(false)}>
                  <PhoneOff className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="space-y-1.5">
                {['Sarah Wilson', 'Marcus Chen', 'Aria Johnson', 'David Park'].map((name) => (
                  <button
                    key={name}
                    onClick={() => {
                      addParticipant({ id: `user-${name.toLowerCase().replace(' ', '-')}`, name, avatar: null });
                      setShowAddParticipant(false);
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs">{getInitials(name)}</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-sm text-white">{name}</p>
                      <p className="text-[10px] text-white/40">Tap to add</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
