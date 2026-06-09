'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  ControlBar,
  TrackToggle,
  DisconnectButton,
  useTracks,
  useParticipants,
  useLocalParticipant,
  useConnectionState,
  VideoTrack,
} from '@livekit/components-react';
import {
  ConnectionState,
  Track,
  LocalParticipant,
  RemoteParticipant,
  RemoteTrackPublication,
  ParticipantEvent,
  RoomEvent,
} from 'livekit-client';
import '@livekit/components-styles';

const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL || '';

interface LiveKitCallProps {
  token: string;
  roomName: string;
  callType: 'audio' | 'video';
  onDisconnected: () => void;
  onConnected: () => void;
  onError: (error: Error) => void;
}

/**
 * LiveKit room wrapper that manages the WebRTC connection.
 * This component handles the actual audio/video streaming between participants.
 */
export default function LiveKitCall({
  token,
  roomName,
  callType,
  onDisconnected,
  onConnected,
  onError,
}: LiveKitCallProps) {
  const [connectionState, setConnectionState] = useState<string>('disconnected');

  const handleConnected = useCallback(() => {
    console.log('[LiveKit] Connected to room:', roomName);
    setConnectionState('connected');
    onConnected();
  }, [roomName, onConnected]);

  const handleDisconnected = useCallback(() => {
    console.log('[LiveKit] Disconnected from room:', roomName);
    setConnectionState('disconnected');
    onDisconnected();
  }, [roomName, onDisconnected]);

  const handleError = useCallback((error: Error) => {
    console.error('[LiveKit] Error:', error);
    setConnectionState('failed');
    onError(error);
  }, [onError]);

  const handleReconnecting = useCallback(() => {
    console.log('[LiveKit] Reconnecting...');
    setConnectionState('reconnecting');
  }, []);

  const handleReconnected = useCallback(() => {
    console.log('[LiveKit] Reconnected');
    setConnectionState('connected');
  }, []);

  if (!token || !LIVEKIT_URL) {
    return null;
  }

  return (
    <LiveKitRoom
      serverUrl={LIVEKIT_URL}
      token={token}
      connect={true}
      audio={true}
      video={callType === 'video'}
      onConnected={handleConnected}
      onDisconnected={handleDisconnected}
      onError={handleError}
      onReconnecting={handleReconnecting}
      onReconnected={handleReconnected}
      data-lk-theme="default"
      style={{ height: '100%', width: '100%' }}
    >
      {/* Audio renderer - always render remote audio */}
      <RoomAudioRenderer />

      {/* Video conference layout for video calls */}
      {callType === 'video' && (
        <div className="h-full w-full relative">
          <VideoConference />
        </div>
      )}

      {/* For audio-only calls, just show participant info */}
      {callType === 'audio' && (
        <AudioCallLayout onDisconnected={onDisconnected} />
      )}
    </LiveKitRoom>
  );
}

/**
 * Layout for audio-only calls using LiveKit.
 * Shows participant avatars and audio level indicators.
 */
function AudioCallLayout({ onDisconnected }: { onDisconnected: () => void }) {
  const participants = useParticipants();
  const { localParticipant } = useLocalParticipant();
  const connectionState = useConnectionState();

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="flex flex-col items-center gap-3">
        {participants
          .filter((p) => p.identity !== localParticipant.identity)
          .map((participant) => (
            <div key={participant.identity} className="flex flex-col items-center gap-2">
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {participant.identity
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </span>
                </div>
                {/* Audio level indicator */}
                {participant.isSpeaking && (
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-400 speaking-indicator" />
                )}
              </div>
              <span className="text-white text-sm font-medium">
                {participant.identity}
              </span>
              {participant.isSpeaking && (
                <span className="text-emerald-400 text-xs">Speaking...</span>
              )}
            </div>
          ))}
      </div>

      <div className="flex items-center gap-2 text-white/50 text-xs mt-4">
        <div
          className={`h-2 w-2 rounded-full ${
            connectionState === ConnectionState.Connected
              ? 'bg-emerald-400'
              : connectionState === ConnectionState.Reconnecting
                ? 'bg-amber-400 animate-pulse'
                : 'bg-red-400'
          }`}
        />
        {connectionState === ConnectionState.Connected
          ? 'Connected'
          : connectionState === ConnectionState.Reconnecting
            ? 'Reconnecting...'
            : 'Disconnected'}
      </div>
    </div>
  );
}

/**
 * Fetch a LiveKit token from our API
 */
export async function fetchLiveKitToken(params: {
  identity: string;
  name: string;
  callId: string;
  callType: 'audio' | 'video';
  isGroup: boolean;
  canAdmin?: boolean;
}): Promise<{ token: string; roomName: string; url: string } | null> {
  try {
    const response = await fetch('/api/livekit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      console.error('[LiveKit] Failed to fetch token:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[LiveKit] Error fetching token:', error);
    return null;
  }
}
