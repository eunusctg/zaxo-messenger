import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const totalUsers = await db.user.count();
    const activeToday = await db.user.count({
      where: {
        lastSeen: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });
    const newRegistrations = await db.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });
    const totalMessages = await db.message.count();
    const audioCalls = await db.callLog.count({ where: { callType: 'audio' } });
    const videoCalls = await db.callLog.count({ where: { callType: 'video' } });

    return NextResponse.json({
      totalUsers,
      activeToday,
      newRegistrations,
      totalMessages,
      audioCalls,
      videoCalls,
      serverHealth: 99.7,
      revenue: 45892,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
