import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user is banned or suspended
    if (user.isBanned) {
      return NextResponse.json(
        { error: 'This account has been banned. Contact support@zaxo.eu.cc' },
        { status: 403 }
      );
    }

    if (user.isSuspended) {
      return NextResponse.json(
        { error: 'This account has been suspended. Contact support@zaxo.eu.cc' },
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update user online status
    await db.user.update({
      where: { id: user.id },
      data: { isOnline: true, lastSeen: new Date() },
    });

    // Create a session
    const sessionToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await db.session.create({
      data: {
        userId: user.id,
        device: 'web',
        ipAddress: request.headers.get('x-forwarded-for') || null,
        lastActive: new Date(),
        isActive: true,
      },
    });

    // Return user data (without password hash)
    const { passwordHash: _, ...safeUser } = user;

    return NextResponse.json({
      user: {
        ...safeUser,
        isOnline: true,
        lastSeen: new Date().toISOString(),
      },
      token: sessionToken,
      isAdmin: user.role === 'admin',
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
