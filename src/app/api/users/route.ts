import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const users = await db.user.findMany({
      where: search ? {
        OR: [
          { displayName: { contains: search } },
          { zaxoNumber: { contains: search } },
          { email: { contains: search } },
        ],
      } : undefined,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
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

    const total = await db.user.count();

    return NextResponse.json({ users, total });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
