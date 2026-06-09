import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

function generateZaxoNumber(): string {
  const part1 = Math.floor(Math.random() * 900 + 100);
  const part2 = Math.floor(Math.random() * 900 + 100);
  const part3 = Math.floor(Math.random() * 900 + 100);
  return `${part1}-${part2}-${part3}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { displayName, email, password, phoneNumber } = body;

    // Validate required fields
    if (!displayName || !email || !password || !phoneNumber) {
      return NextResponse.json(
        { error: 'All fields are required: displayName, email, password, phoneNumber' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await db.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Check if phone number already exists
    const existingPhone = await db.user.findUnique({ where: { phoneNumber } });
    if (existingPhone) {
      return NextResponse.json(
        { error: 'An account with this phone number already exists' },
        { status: 409 }
      );
    }

    // Hash the password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate a unique Zaxo number
    let zaxoNumber = generateZaxoNumber();
    let attempts = 0;
    while (attempts < 20) {
      const existing = await db.user.findUnique({ where: { zaxoNumber } });
      if (!existing) break;
      zaxoNumber = generateZaxoNumber();
      attempts++;
    }

    // Create the user
    const user = await db.user.create({
      data: {
        email,
        passwordHash,
        zaxoNumber,
        displayName,
        phoneNumber,
        bio: '',
        status: 'Hey there! I\'m using Zaxo',
        isOnline: true,
        lastSeen: new Date(),
        role: 'user',
      },
    });

    // Create a session
    const sessionToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 day session

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
      user: safeUser,
      token: sessionToken,
      message: 'Registration successful! Welcome to Zaxo.',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
