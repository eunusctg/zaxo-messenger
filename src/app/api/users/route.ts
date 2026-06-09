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
        ],
      } : undefined,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });

    const total = await db.user.count();

    return NextResponse.json({ users, total });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { displayName, phoneNumber, zaxoNumber, bio } = body;

    const user = await db.user.create({
      data: {
        displayName,
        phoneNumber,
        zaxoNumber,
        bio: bio || '',
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
