import { NextRequest, NextResponse } from 'next/server';
import { sendCallNotification, sendMessageNotification } from '@/lib/firebase-admin';

/**
 * POST /api/notifications
 * Send a push notification via Firebase Cloud Messaging.
 *
 * Body:
 *   - type: 'call' | 'message'
 *   - For calls: targetToken, callerName, callId, callType, roomName, callerId
 *   - For messages: targetToken, senderName, messagePreview, chatId, senderId
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;

    if (!type) {
      return NextResponse.json(
        { error: 'Missing notification type' },
        { status: 400 }
      );
    }

    let result: string | null = null;

    if (type === 'call') {
      const { targetToken, callerName, callId, callType, roomName, callerId } = body;
      if (!targetToken || !callerName || !callId) {
        return NextResponse.json(
          { error: 'Missing required fields for call notification' },
          { status: 400 }
        );
      }
      result = await sendCallNotification({
        targetToken,
        callerName,
        callId,
        callType: callType || 'audio',
        roomName: roomName || '',
        callerId: callerId || '',
      });
    } else if (type === 'message') {
      const { targetToken, senderName, messagePreview, chatId, senderId } = body;
      if (!targetToken || !senderName) {
        return NextResponse.json(
          { error: 'Missing required fields for message notification' },
          { status: 400 }
        );
      }
      result = await sendMessageNotification({
        targetToken,
        senderName,
        messagePreview: messagePreview || '',
        chatId: chatId || '',
        senderId: senderId || '',
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid notification type. Use "call" or "message"' },
        { status: 400 }
      );
    }

    if (result) {
      return NextResponse.json({ success: true, messageId: result });
    } else {
      return NextResponse.json(
        { error: 'Failed to send notification' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[Notifications API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
