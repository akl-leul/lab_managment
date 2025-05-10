import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/ prisma';
import bcrypt from 'bcryptjs';
import { sessionOptions } from '@/lib/session';

interface UserSession {
  id: string;
  username: string;
  role: string;
  profileImage?: string | null;
}

export async function POST(req: Request) {
  try {
    const { username: rawUsername, password: rawPassword } = await req.json();

    // Trim inputs to avoid whitespace issues
    const username = rawUsername?.trim();
    const password = rawPassword?.trim();

    console.log('Login attempt:', { username });

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { username } });
    console.log('User found:', user ? true : false);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValid);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const session = await getIronSession(cookies(), sessionOptions);
    session.user = {
      id: user.id,
      username: user.username,
      role: user.role,
      profileImage: user.profileImage || null,
    } as UserSession;
    await session.save();

    return NextResponse.json({ message: 'Logged in' });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await getIronSession(cookies(), sessionOptions);
    session.destroy();
    await session.save();
    return NextResponse.json({ message: 'Logged out' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getIronSession(cookies(), sessionOptions);
    return NextResponse.json({ user: session.user || null });
  } catch (error) {
    console.error('Get session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
