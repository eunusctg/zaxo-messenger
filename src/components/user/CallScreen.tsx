'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, MicOff, Volume2, VolumeX, Video, VideoOff,
  PhoneOff, PhoneCall, Camera, Phone, Users, UserPlus,
  MonitorUp, MonitorOff, Bluetooth, BluetoothOff,
  Shield, ShieldCheck, CircleDot, Radio, EarOff,
  MoreVertical, MessageCircle, Hash, Pause, Play,
  Circle, Download, Zap, Signal, Wifi,
  LayoutGrid, Maximize2, Presentation, Hand,
  Subtitles, Sparkles, ImagePlus, SwitchCamera,
  Battery, Clock, ArrowDown, X,
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
    <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-white/60 text-sm font-mono">
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

// Group call participant tile
function ParticipantTile({ 
  participant, 
  isSpeaking, 
  isHandRaised, 
  layout 
}: { 
  participant: { id: string; name: string; avatar: string | null; isMuted?: boolean; isVideoOn?: boolean; isSpeaking?: boolean }; 
  isSpeaking: boolean;
  isHandRaised: boolean;
  layout: 'grid' | 'speaker' | 'presentation';
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative flex flex-col items-center gap-1.5 rounded-xl bg-white/5 backdrop-blur-sm overflow-hidden ${
        isSpeaking ? 'ring-2 ring-emerald-400/60 speaking-indicator' : ''
      } ${isHandRaised ? 'ring-2 ring-amber-400/60' : ''}`}
    >
      {/* Video placeholder */}
      {participant.isVideoOn && (
        <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
          <Camera className="h-6 w-6 text-zinc-600" />
        </div>
      )}
      
      <div className={`flex flex-col items-center gap-1 p-3 ${participant.isVideoOn ? 'opacity-0' : ''}`}>
        <Avatar className="h-14 w-14 border-2 border-white/10">
          <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
            {getInitials(participant.name)}
          </AvatarFallback>
        </Avatar>
        <span className="text-[10px] text-white/70 truncate max-w-full">{participant.name}</span>
      </div>

      {/* Status indicators */}
      <div className="absolute top-1.5 right-1.5 flex flex-col gap-1">
        {participant.isMuted && (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/30">
            <MicOff className="h-3 w-3 text-red-400" />
          </div>
        )}
        {isHandRaised && (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/30">
            <Hand className="h-3 w-3 text-amber-400" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function CallScreen() {
  const {
    activeCall, toggleMute, toggleSpeaker, toggleVideo,
    toggleRecording, toggleScreenShare, toggleNoiseCancellation,
    toggleHold, toggleBluetooth, addParticipant, endCall, updateCallStatus,
    toggleLowDataMode, toggleVirtualBackground, togglePictureInPicture,
    toggleSwitchCamera, toggleLiveCaptioning, toggleVoiceEnhancement,
    setGroupCallLayout, raiseHand, lowerHand, setActiveSpeaker, removeParticipant,
  } = useCallStore();
  const [isIncoming, setIsIncoming] = useState(false);
  const [showMoreControls, setShowMoreControls] = useState(false);
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [showParticipantsList, setShowParticipantsList] = useState(false);
  const [showChatOverlay, setShowChatOverlay] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
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
      autoConnectTimeoutRef.current = setTimeout(() => {
        updateCallStatus('connecting');
        setTimeout(() => updateCallStatus('connected'), 800);
      }, 3000);
    }
    return () => { if (autoConnectTimeoutRef.current) clearTimeout(autoConnectTimeoutRef.current); };
  }, [activeCall?.status, isIncoming, updateCallStatus]);

  const handleAcceptCall = useCallback(() => {
    updateCallStatus('connecting');
    setTimeout(() => updateCallStatus('connected'), 500);
    setIsIncoming(false);
  }, [updateCallStatus]);

  const handleDeclineCall = useCallback(() => {
    endCall();
    setIsIncoming(false);
  }, [endCall]);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { sender: 'You', text: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setChatInput('');
  };

  if (!activeCall) return null;

  const participant = activeCall.participants[0];
  const participantName = activeCall.isGroup ? `Group Call (${activeCall.participants.length})` : (participant?.name || 'Unknown');
  const isVideoCall = activeCall.callType === 'video';
  const isConnected = activeCall.status === 'connected';
  const isConnecting = activeCall.status === 'connecting';
  const isReconnecting = activeCall.status === 'reconnecting';

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
            <motion.div 
              className="absolute top-4 right-4 h-36 w-28 rounded-xl bg-zinc-800 border-2 border-white/10 overflow-hidden flex items-center justify-center cursor-move"
              drag
              dragConstraints={{ top: 0, left: 0, right: 100, bottom: 200 }}
              dragElastic={0.1}
            >
              <Camera className="h-6 w-6 text-zinc-600" />
              {activeCall.isSwitchingCamera && (
                <div className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50">
                  <SwitchCamera className="h-3 w-3 text-white" />
                </div>
              )}
            </motion.div>
            {/* Screen share indicator */}
            {activeCall.isScreenSharing && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 rounded-lg px-3 py-1.5 screen-share-glow">
                <MonitorUp className="h-4 w-4 text-primary" />
                <span className="text-xs text-white">Screen Sharing</span>
              </div>
            )}
            {/* Virtual background indicator */}
            {activeCall.isVirtualBackground && (
              <div className="absolute top-14 left-4 flex items-center gap-2 bg-black/60 rounded-lg px-2 py-1">
                <ImagePlus className="h-3 w-3 text-primary" />
                <span className="text-[10px] text-white">Virtual BG</span>
              </div>
            )}
          </div>
        )}

        {/* Top status bar */}
        <div className="absolute top-0 left-0 right-0 z-30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {activeCall.e2eEncrypted && (
                <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-[10px] px-2 py-0">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  Encrypted
                </Badge>
              )}
              <CallQualityBadge quality={activeCall.callQuality} />
              <NetworkStrength strength={activeCall.networkStrength} />
              {isConnecting && (
                <Badge className="bg-blue-500/20 text-blue-400 border-0 text-[10px] px-2 py-0">
                  <CircleDot className="h-2.5 w-2.5 mr-1 animate-spin" />
                  Connecting...
                </Badge>
              )}
              {isReconnecting && (
                <Badge className="bg-amber-500/20 text-amber-400 border-0 text-[10px] px-2 py-0">
                  <Wifi className="h-2.5 w-2.5 mr-1" />
                  Reconnecting...
                </Badge>
              )}
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
              {activeCall.isLowDataMode && (
                <Badge className="bg-amber-500/20 text-amber-400 border-0 text-[10px] px-2 py-0">
                  <Signal className="h-3 w-3 mr-1" />
                  Low Data
                </Badge>
              )}
              {activeCall.isLiveCaptioning && (
                <Badge className="bg-purple-500/20 text-purple-400 border-0 text-[10px] px-2 py-0">
                  <Subtitles className="h-3 w-3 mr-1" />
                  Captions
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
          <div className="relative z-10 flex flex-col items-center gap-3 px-4 w-full max-h-[50vh] overflow-y-auto">
            {/* Layout switcher for group calls */}
            {isVideoCall && (
              <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setGroupCallLayout('grid')}
                  className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] ${activeCall.groupCallLayout === 'grid' ? 'bg-white/10 text-white' : 'text-white/50'}`}
                >
                  <LayoutGrid className="h-3 w-3" /> Grid
                </button>
                <button
                  onClick={() => setGroupCallLayout('speaker')}
                  className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] ${activeCall.groupCallLayout === 'speaker' ? 'bg-white/10 text-white' : 'text-white/50'}`}
                >
                  <Maximize2 className="h-3 w-3" /> Speaker
                </button>
                <button
                  onClick={() => setGroupCallLayout('presentation')}
                  className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] ${activeCall.groupCallLayout === 'presentation' ? 'bg-white/10 text-white' : 'text-white/50'}`}
                >
                  <Presentation className="h-3 w-3" /> Present
                </button>
              </div>
            )}

            <div className={`grid gap-2 w-full max-w-lg mx-auto ${
              activeCall.groupCallLayout === 'grid'
                ? activeCall.participants.length <= 4 ? 'grid-cols-2' : activeCall.participants.length <= 9 ? 'grid-cols-3' : 'grid-cols-4'
                : activeCall.groupCallLayout === 'speaker'
                  ? 'grid-cols-1 max-w-sm'
                  : 'grid-cols-2'
            }`}>
              {activeCall.participants.map((p) => (
                <ParticipantTile
                  key={p.id}
                  participant={p}
                  isSpeaking={p.isSpeaking || false}
                  isHandRaised={activeCall.raisedHands.includes(p.id)}
                  layout={activeCall.groupCallLayout}
                />
              ))}
            </div>
            <h2 className="text-xl font-bold text-white">{participantName}</h2>
            <CallTimer isActive={isConnected} />
            
            {/* Raised hands indicator */}
            {activeCall.raisedHands.length > 0 && (
              <div className="flex items-center gap-2 bg-amber-500/10 rounded-full px-3 py-1">
                <Hand className="h-4 w-4 text-amber-400" />
                <span className="text-xs text-amber-400">
                  {activeCall.raisedHands.length} hand{activeCall.raisedHands.length > 1 ? 's' : ''} raised
                </span>
              </div>
            )}
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
            ) : isConnecting ? (
              <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-white/60 text-sm flex items-center gap-2">
                <CircleDot className="h-4 w-4 animate-spin text-primary" />
                Connecting...
              </motion.p>
            ) : isReconnecting ? (
              <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-amber-400/80 text-sm flex items-center gap-2">
                <Wifi className="h-4 w-4" />
                Reconnecting...
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
              {activeCall.isVoiceEnhancement && (
                <Badge className="bg-purple-500/20 text-purple-400 border-0 text-[10px] ml-2 px-2 py-0">
                  <Sparkles className="h-2.5 w-2.5 mr-1" />
                  Enhanced
                </Badge>
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
            <div className="flex items-center justify-center gap-4 mb-3">
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
                <Button onClick={endCall} className="h-14 w-14 rounded-full bg-destructive hover:bg-destructive/90 text-white shadow-lg shadow-destructive/30" size="icon">
                  <PhoneOff className="h-6 w-6" />
                </Button>
                <span className="text-[9px] text-white/50">End</span>
              </div>
            </div>

            {/* Secondary controls row */}
            <AnimatePresence>
              {showMoreControls && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center justify-center gap-3 pb-2 flex-wrap px-4">
                    {/* Record */}
                    <div className="flex flex-col items-center gap-1">
                      <Button onClick={toggleRecording} variant="ghost" className={`h-10 w-10 rounded-full ${activeCall.isRecording ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white hover:bg-white/20'}`} size="icon">
                        <CircleDot className="h-4 w-4" />
                      </Button>
                      <span className="text-[9px] text-white/50">Record</span>
                    </div>

                    {/* Noise cancellation */}
                    <div className="flex flex-col items-center gap-1">
                      <Button onClick={toggleNoiseCancellation} variant="ghost" className={`h-10 w-10 rounded-full ${activeCall.isNoiseCancellation ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-white hover:bg-white/20'}`} size="icon">
                        {activeCall.isNoiseCancellation ? <Radio className="h-4 w-4" /> : <EarOff className="h-4 w-4" />}
                      </Button>
                      <span className="text-[9px] text-white/50">Noise</span>
                    </div>

                    {/* Bluetooth */}
                    <div className="flex flex-col items-center gap-1">
                      <Button onClick={toggleBluetooth} variant="ghost" className={`h-10 w-10 rounded-full ${activeCall.isBluetoothConnected ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-white hover:bg-white/20'}`} size="icon">
                        {activeCall.isBluetoothConnected ? <Bluetooth className="h-4 w-4" /> : <BluetoothOff className="h-4 w-4" />}
                      </Button>
                      <span className="text-[9px] text-white/50">BT</span>
                    </div>

                    {/* Hold */}
                    <div className="flex flex-col items-center gap-1">
                      <Button onClick={toggleHold} variant="ghost" className={`h-10 w-10 rounded-full ${activeCall.isOnHold ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10 text-white hover:bg-white/20'}`} size="icon">
                        {activeCall.isOnHold ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                      </Button>
                      <span className="text-[9px] text-white/50">{activeCall.isOnHold ? 'Resume' : 'Hold'}</span>
                    </div>

                    {/* Add participant */}
                    <div className="flex flex-col items-center gap-1">
                      <Button onClick={() => setShowAddParticipant(!showAddParticipant)} variant="ghost" className="h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20" size="icon">
                        <UserPlus className="h-4 w-4" />
                      </Button>
                      <span className="text-[9px] text-white/50">Add</span>
                    </div>

                    {/* Chat */}
                    <div className="flex flex-col items-center gap-1">
                      <Button onClick={() => setShowChatOverlay(!showChatOverlay)} variant="ghost" className="h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20" size="icon">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <span className="text-[9px] text-white/50">Chat</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Advanced controls */}
            <AnimatePresence>
              {showAdvancedControls && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center justify-center gap-3 pb-2 flex-wrap px-4">
                    {/* Switch Camera */}
                    {isVideoCall && (
                      <div className="flex flex-col items-center gap-1">
                        <Button onClick={toggleSwitchCamera} variant="ghost" className={`h-10 w-10 rounded-full ${activeCall.isSwitchingCamera ? 'bg-white/20 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`} size="icon">
                          <SwitchCamera className="h-4 w-4" />
                        </Button>
                        <span className="text-[9px] text-white/50">Flip</span>
                      </div>
                    )}

                    {/* Virtual Background */}
                    {isVideoCall && (
                      <div className="flex flex-col items-center gap-1">
                        <Button onClick={toggleVirtualBackground} variant="ghost" className={`h-10 w-10 rounded-full ${activeCall.isVirtualBackground ? 'bg-purple-500/20 text-purple-400' : 'bg-white/10 text-white hover:bg-white/20'}`} size="icon">
                          <ImagePlus className="h-4 w-4" />
                        </Button>
                        <span className="text-[9px] text-white/50">BG</span>
                      </div>
                    )}

                    {/* PiP Mode */}
                    <div className="flex flex-col items-center gap-1">
                      <Button onClick={togglePictureInPicture} variant="ghost" className={`h-10 w-10 rounded-full ${activeCall.isPictureInPicture ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white hover:bg-white/20'}`} size="icon">
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                      <span className="text-[9px] text-white/50">PiP</span>
                    </div>

                    {/* Live Captions */}
                    <div className="flex flex-col items-center gap-1">
                      <Button onClick={toggleLiveCaptioning} variant="ghost" className={`h-10 w-10 rounded-full ${activeCall.isLiveCaptioning ? 'bg-purple-500/20 text-purple-400' : 'bg-white/10 text-white hover:bg-white/20'}`} size="icon">
                        <Subtitles className="h-4 w-4" />
                      </Button>
                      <span className="text-[9px] text-white/50">Caption</span>
                    </div>

                    {/* Voice Enhancement */}
                    <div className="flex flex-col items-center gap-1">
                      <Button onClick={toggleVoiceEnhancement} variant="ghost" className={`h-10 w-10 rounded-full ${activeCall.isVoiceEnhancement ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white hover:bg-white/20'}`} size="icon">
                        <Sparkles className="h-4 w-4" />
                      </Button>
                      <span className="text-[9px] text-white/50">Enhance</span>
                    </div>

                    {/* Low Data Mode */}
                    <div className="flex flex-col items-center gap-1">
                      <Button onClick={toggleLowDataMode} variant="ghost" className={`h-10 w-10 rounded-full ${activeCall.isLowDataMode ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10 text-white hover:bg-white/20'}`} size="icon">
                        <Signal className="h-4 w-4" />
                      </Button>
                      <span className="text-[9px] text-white/50">Low Data</span>
                    </div>

                    {/* Raise Hand (group calls) */}
                    {activeCall.isGroup && (
                      <div className="flex flex-col items-center gap-1">
                        <Button 
                          onClick={() => {
                            const myId = 'demo-user-1';
                            if (activeCall.raisedHands.includes(myId)) {
                              lowerHand(myId);
                            } else {
                              raiseHand(myId);
                            }
                          }} 
                          variant="ghost" 
                          className={`h-10 w-10 rounded-full ${activeCall.raisedHands.includes('demo-user-1') ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10 text-white hover:bg-white/20'}`} 
                          size="icon"
                        >
                          <Hand className="h-4 w-4" />
                        </Button>
                        <span className="text-[9px] text-white/50">Hand</span>
                      </div>
                    )}

                    {/* Participants list (group calls) */}
                    {activeCall.isGroup && (
                      <div className="flex flex-col items-center gap-1">
                        <Button onClick={() => setShowParticipantsList(!showParticipantsList)} variant="ghost" className="h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20" size="icon">
                          <Users className="h-4 w-4" />
                        </Button>
                        <span className="text-[9px] text-white/50">{activeCall.participants.length}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toggle buttons */}
            <div className="flex justify-center gap-4">
              <Button onClick={() => { setShowMoreControls(!showMoreControls); if (showAdvancedControls) setShowAdvancedControls(false); }} variant="ghost" className="text-white/40 hover:text-white/60 text-xs gap-1">
                <MoreVertical className="h-3.5 w-3.5" />
                {showMoreControls ? 'Less' : 'More'}
              </Button>
              <Button onClick={() => { setShowAdvancedControls(!showAdvancedControls); if (showMoreControls) setShowMoreControls(false); }} variant="ghost" className="text-white/40 hover:text-white/60 text-xs gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                {showAdvancedControls ? 'Less' : 'Advanced'}
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
                  <X className="h-3.5 w-3.5" />
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

        {/* Participants List Panel */}
        <AnimatePresence>
          {showParticipantsList && activeCall.isGroup && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-32 left-4 right-4 z-30 bg-zinc-900/95 backdrop-blur-lg rounded-2xl border border-white/10 p-4 max-h-60 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">Participants ({activeCall.participants.length})</h3>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-white/60" onClick={() => setShowParticipantsList(false)}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="space-y-1.5">
                {activeCall.participants.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs">{getInitials(p.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{p.name}</p>
                      <div className="flex items-center gap-1.5">
                        {p.isMuted && <MicOff className="h-2.5 w-2.5 text-red-400" />}
                        {activeCall.raisedHands.includes(p.id) && <Hand className="h-2.5 w-2.5 text-amber-400" />}
                        {p.isSpeaking && <span className="text-[9px] text-emerald-400">Speaking</span>}
                      </div>
                    </div>
                    {p.id !== 'demo-user-1' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-white/40 hover:text-red-400"
                        onClick={() => removeParticipant(p.id)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat overlay */}
        <AnimatePresence>
          {showChatOverlay && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute bottom-32 right-4 z-30 w-72 bg-zinc-900/95 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden flex flex-col max-h-80"
            >
              <div className="flex items-center justify-between p-3 border-b border-white/10">
                <h3 className="text-sm font-semibold text-white">Call Chat</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-white/60" onClick={() => setShowChatOverlay(false)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-[120px]">
                {chatMessages.length === 0 ? (
                  <p className="text-xs text-white/30 text-center py-4">No messages yet</p>
                ) : (
                  chatMessages.map((msg, i) => (
                    <div key={i} className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-medium text-primary">{msg.sender}</span>
                        <span className="text-[8px] text-white/30">{msg.time}</span>
                      </div>
                      <p className="text-xs text-white/80">{msg.text}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="p-2 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSendChat(); }}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/5 rounded-lg px-3 py-1.5 text-xs text-white outline-none placeholder:text-white/30"
                />
                <Button onClick={handleSendChat} size="icon" className="h-7 w-7 rounded-full bg-primary shrink-0">
                  <MessageCircle className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Captions overlay */}
        {activeCall.isLiveCaptioning && isConnected && (
          <div className="absolute bottom-36 left-4 right-4 z-20">
            <div className="bg-black/70 rounded-lg px-4 py-2 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 mb-1">
                <Subtitles className="h-3 w-3 text-purple-400" />
                <span className="text-[9px] text-purple-400">Live Captions</span>
              </div>
              <p className="text-xs text-white/80 italic">
                {activeCall.isMuted ? 'You are muted. Unmute to speak.' : 'Listening...'}
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
