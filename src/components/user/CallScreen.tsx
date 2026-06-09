'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Video,
  VideoOff,
  PhoneOff,
  PhoneCall,
  Camera,
  Phone,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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

// Separate timer component with key-based reset
function CallTimer({ isActive }: { isActive: boolean }) {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setDuration((d) => d + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <motion.p
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-white/60 text-sm"
    >
      {formatDuration(duration)}
    </motion.p>
  );
}

export default function CallScreen() {
  const { activeCall, toggleMute, toggleSpeaker, toggleVideo, endCall, updateCallStatus } = useCallStore();
  const [isIncoming, setIsIncoming] = useState(false);
  const incomingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoConnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Simulate incoming call scenario - delayed incoming indicator
  // isIncoming is reset via handleAcceptCall/handleDeclineCall callbacks
  // or naturally when activeCall becomes null (component returns null)
  useEffect(() => {
    if (activeCall?.status === 'ringing') {
      incomingTimeoutRef.current = setTimeout(() => {
        setIsIncoming(true);
      }, 500);
    }

    return () => {
      if (incomingTimeoutRef.current) {
        clearTimeout(incomingTimeoutRef.current);
      }
    };
  }, [activeCall?.status]);

  // Auto-connect after ringing for demo
  useEffect(() => {
    if (activeCall?.status === 'ringing' && !isIncoming) {
      autoConnectTimeoutRef.current = setTimeout(() => {
        updateCallStatus('connected');
      }, 3000);
    }

    return () => {
      if (autoConnectTimeoutRef.current) {
        clearTimeout(autoConnectTimeoutRef.current);
      }
    };
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
  const participantName = participant?.name || 'Unknown';
  const isVideoCall = activeCall.callType === 'video';
  const isConnected = activeCall.status === 'connected';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl"
      >
        {/* Video call camera preview */}
        {isVideoCall && activeCall.isVideoOn && isConnected && (
          <div className="absolute inset-0 bg-zinc-900">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-zinc-600 text-sm">Camera Preview</div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/40 text-white hover:bg-black/60"
            >
              <Camera className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Caller info - centered */}
        <div className="relative z-10 flex flex-col items-center gap-4">
          {/* Avatar with pulse animation when ringing */}
          <motion.div
            animate={
              activeCall.status === 'ringing'
                ? { scale: [1, 1.05, 1] }
                : { scale: 1 }
            }
            transition={
              activeCall.status === 'ringing'
                ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
                : {}
            }
          >
            <div className={activeCall.status === 'ringing' ? 'call-pulse rounded-full' : ''}>
              <Avatar className="h-28 w-28 border-4 border-white/20">
                <AvatarFallback className="bg-primary/20 text-primary text-3xl font-bold">
                  {getInitials(participantName)}
                </AvatarFallback>
              </Avatar>
            </div>
          </motion.div>

          {/* Name */}
          <h2 className="text-2xl font-bold text-white">{participantName}</h2>

          {/* Call status */}
          {activeCall.status === 'ringing' ? (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white/60 text-sm"
            >
              {isIncoming ? 'Incoming call...' : 'Ringing...'}
            </motion.p>
          ) : activeCall.status === 'connected' ? (
            <CallTimer isActive={isConnected} />
          ) : (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white/60 text-sm"
            >
              Call ended
            </motion.p>
          )}

          {/* Call type badge */}
          <div className="flex items-center gap-1.5 text-white/40">
            {isVideoCall ? (
              <Video className="h-4 w-4" />
            ) : (
              <Phone className="h-4 w-4" />
            )}
            <span className="text-xs">
              {isVideoCall ? 'Video Call' : 'Audio Call'}
            </span>
          </div>
        </div>

        {/* Incoming call buttons */}
        {isIncoming && activeCall.status === 'ringing' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-16 flex items-center gap-8 z-20"
          >
            <div className="flex flex-col items-center gap-2">
              <Button
                onClick={handleDeclineCall}
                className="h-16 w-16 rounded-full bg-destructive hover:bg-destructive/90 text-white shadow-lg shadow-destructive/30"
                size="icon"
              >
                <PhoneOff className="h-7 w-7" />
              </Button>
              <span className="text-xs text-white/60">Decline</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button
                onClick={handleAcceptCall}
                className="h-16 w-16 rounded-full bg-emerald-500 hover:bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/30"
                size="icon"
              >
                <PhoneCall className="h-7 w-7" />
              </Button>
              <span className="text-xs text-white/60">Accept</span>
            </div>
          </motion.div>
        ) : (
          /* Call controls */
          <div className="absolute bottom-16 z-20">
            <div className="flex items-center gap-6">
              {/* Mute */}
              <div className="flex flex-col items-center gap-2">
                <Button
                  onClick={toggleMute}
                  variant="ghost"
                  className={`h-14 w-14 rounded-full ${
                    activeCall.isMuted
                      ? 'bg-white text-red-500'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  size="icon"
                >
                  {activeCall.isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </Button>
                <span className="text-[10px] text-white/60">
                  {activeCall.isMuted ? 'Unmute' : 'Mute'}
                </span>
              </div>

              {/* Speaker */}
              <div className="flex flex-col items-center gap-2">
                <Button
                  onClick={toggleSpeaker}
                  variant="ghost"
                  className={`h-14 w-14 rounded-full ${
                    activeCall.isSpeakerOn
                      ? 'bg-white text-emerald-600'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  size="icon"
                >
                  {activeCall.isSpeakerOn ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
                </Button>
                <span className="text-[10px] text-white/60">Speaker</span>
              </div>

              {/* Video toggle (for video calls) */}
              {isVideoCall && (
                <div className="flex flex-col items-center gap-2">
                  <Button
                    onClick={toggleVideo}
                    variant="ghost"
                    className={`h-14 w-14 rounded-full ${
                      activeCall.isVideoOn
                        ? 'bg-white text-emerald-600'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    size="icon"
                  >
                    {activeCall.isVideoOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
                  </Button>
                  <span className="text-[10px] text-white/60">Video</span>
                </div>
              )}

              {/* End call */}
              <div className="flex flex-col items-center gap-2">
                <Button
                  onClick={endCall}
                  className="h-14 w-14 rounded-full bg-destructive hover:bg-destructive/90 text-white shadow-lg shadow-destructive/30"
                  size="icon"
                >
                  <PhoneOff className="h-6 w-6" />
                </Button>
                <span className="text-[10px] text-white/60">End</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
