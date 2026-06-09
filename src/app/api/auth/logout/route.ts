import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');

    if (userId) {
      // Mark all active sessions as inactive
      await db.session.updateMany({
        where: { userId, isActive: true },
        data: { isActive: false },
      });

      // Update user online status
      await db.user.update({
        where: { id: userId },
        data: { isOnline: false, lastSeen: new Date() },
      });
    }

    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
