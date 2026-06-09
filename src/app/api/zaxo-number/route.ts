import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

function generateZaxoNumber(): string {
  const part1 = Math.floor(Math.random() * 900 + 100);
  const part2 = Math.floor(Math.random() * 900 + 100);
  const part3 = Math.floor(Math.random() * 900 + 100);
  return `${part1}-${part2}-${part3}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Check if user already has a Zaxo number
    const user = await db.user.findUnique({ where: { id: userId } });
    if (user?.zaxoNumber) {
      return NextResponse.json({ error: 'User already has a Zaxo number', zaxoNumber: user.zaxoNumber }, { status: 400 });
    }

    // Generate unique number
    let zaxoNumber = generateZaxoNumber();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await db.user.findUnique({ where: { zaxoNumber } });
      if (!existing) break;
      zaxoNumber = generateZaxoNumber();
      attempts++;
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { zaxoNumber },
    });

    return NextResponse.json({ zaxoNumber: updatedUser.zaxoNumber });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to assign Zaxo number' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const number = searchParams.get('number');

    if (!number) {
      return NextResponse.json({ error: 'number parameter is required' }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { zaxoNumber: number },
      select: {
        id: true,
        zaxoNumber: true,
        displayName: true,
        bio: true,
        isOnline: true,
        profilePicture: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Zaxo number not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to lookup Zaxo number' }, { status: 500 });
  }
}
