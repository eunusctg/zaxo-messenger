import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-static';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const calls = await db.callLog.findMany({
      where: {
        OR: [
          { callerId: userId },
          { receiverId: userId },
        ],
      },
      take: limit,
      orderBy: { startedAt: 'desc' },
    });

    return NextResponse.json({ calls });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch call history' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { callerId, receiverId, callType } = body;

    const call = await db.callLog.create({
      data: {
        callerId,
        receiverId,
        callType: callType || 'audio',
        status: 'completed',
      },
    });

    return NextResponse.json({ call }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to log call' }, { status: 500 });
  }
}
