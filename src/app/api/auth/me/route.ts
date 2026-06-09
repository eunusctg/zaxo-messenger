import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    // Get user ID from custom header (set by client)
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        zaxoNumber: true,
        displayName: true,
        phoneNumber: true,
        profilePicture: true,
        bio: true,
        status: true,
        lastSeen: true,
        isOnline: true,
        lastSeenVisible: true,
        profileVisible: true,
        groupAdd: true,
        theme: true,
        twoFactorEnabled: true,
        isSuspended: true,
        isBanned: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.isBanned) {
      return NextResponse.json(
        { error: 'This account has been banned' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      user,
      isAdmin: user.role === 'admin',
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Authentication check failed' },
      { status: 500 }
    );
  }
}
