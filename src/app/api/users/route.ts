import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

// pages/api/users.ts (or app/api/users/route.ts for Next.js 13)

import { NextApiRequest, NextApiResponse } from 'next'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Hash password here before saving (recommended)
      // For demo, saving plaintext (NOT recommended in production)
      const newUser = await prisma.user.create({
        data: { username, password, role },
      });
      return res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Failed to create user' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}


export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, role: true, profileImage: true },
    });
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { username, password, role } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hashedPassword, role },
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, username, password, role } = await req.json();
    const dataToUpdate: any = { username, role };
    if (password && password.trim() !== '') {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }
    const updatedUser = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
