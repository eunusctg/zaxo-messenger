import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('chatId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!chatId) {
      return NextResponse.json({ error: 'chatId is required' }, { status: 400 });
    }

    const messages = await db.message.findMany({
      where: { chatId },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ messages: messages.reverse() });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, messageType, senderId, chatId, receiverId, groupId } = body;

    const message = await db.message.create({
      data: {
        content,
        messageType: messageType || 'text',
        senderId,
        chatId,
        receiverId,
        groupId,
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
