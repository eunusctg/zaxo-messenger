import { NextRequest, NextResponse } from 'next/server';
import { generateLiveKitToken, generateRoomName } from '@/lib/livekit';

export const dynamic = 'force-static';

/**
 * POST /api/livekit
 * Generate a LiveKit access token for a participant to join a call room.
 *
 * Body:
 *   - identity: string (participant ID)
 *   - name: string (display name)
 *   - callId: string (unique call ID)
 *   - callType: 'audio' | 'video'
 *   - isGroup: boolean
 *   - canAdmin: boolean (optional)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identity, name, callId, callType, isGroup, canAdmin } = body;

    if (!identity || !callId) {
      return NextResponse.json(
        { error: 'Missing required fields: identity, callId' },
        { status: 400 }
      );
    }

    const roomName = generateRoomName(callId);

    const token = generateLiveKitToken({
      identity,
      name: name || identity,
      room: roomName,
      callType: callType || 'video',
      canPublishAudio: true,
      canPublishVideo: callType === 'video',
      canSubscribe: true,
      canAdmin: canAdmin || false,
      isGroup: isGroup || false,
    });

    return NextResponse.json({
      token,
      roomName,
      url: process.env.NEXT_PUBLIC_LIVEKIT_URL,
    });
  } catch (error) {
    console.error('[LiveKit API] Error generating token:', error);
    return NextResponse.json(
      { error: 'Failed to generate LiveKit token' },
      { status: 500 }
    );
  }
}
