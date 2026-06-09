import { AccessToken } from 'livekit-server-sdk';

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY || '';
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET || '';
const LIVEKIT_URL = process.env.LIVEKIT_URL || '';

export interface LiveKitTokenOptions {
  /** Unique identity for the participant */
  identity: string;
  /** Display name shown in the room */
  name?: string;
  /** Room name to join */
  room: string;
  /** Whether this participant can publish audio */
  canPublishAudio?: boolean;
  /** Whether this participant can publish video */
  canPublishVideo?: boolean;
  /** Whether this participant can subscribe */
  canSubscribe?: boolean;
  /** Whether this participant is a room admin (can kick, mute others) */
  canAdmin?: boolean;
  /** Whether this is a group call */
  isGroup?: boolean;
  /** Maximum number of participants (for group calls) */
  maxParticipants?: number;
  /** Call type */
  callType?: 'audio' | 'video';
}

/**
 * Generate a LiveKit access token for a participant to join a room.
 * This token is used by the client to connect to the LiveKit server.
 */
export function generateLiveKitToken(options: LiveKitTokenOptions): string {
  const {
    identity,
    name,
    room,
    canPublishAudio = true,
    canPublishVideo = true,
    canSubscribe = true,
    canAdmin = false,
    callType = 'video',
  } = options;

  const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity,
    name: name || identity,
  });

  token.addGrant({
    roomJoin: true,
    room: room,
    canPublish: canPublishAudio || canPublishVideo,
    canSubscribe,
    canPublishAudio,
    canPublishVideo: callType === 'video' ? canPublishVideo : false,
    canAdmin,
    // Room configuration
    roomCreate: canAdmin,
    roomList: canAdmin,
    // Recording
    canPublishData: true,
  });

  return token.toJwt();
}

/**
 * Generate a token for an admin user who can manage the room
 */
export function generateAdminToken(identity: string, room: string, name?: string): string {
  return generateLiveKitToken({
    identity,
    name,
    room,
    canAdmin: true,
    canPublishAudio: true,
    canPublishVideo: true,
    canSubscribe: true,
  });
}

/**
 * Generate a room name from a call ID
 */
export function generateRoomName(callId: string): string {
  // LiveKit room names must be alphanumeric with hyphens
  return `zaxo-call-${callId.replace(/[^a-zA-Z0-9-]/g, '-')}`;
}

/**
 * Get the LiveKit WebSocket URL
 */
export function getLiveKitUrl(): string {
  return LIVEKIT_URL;
}
