import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/ prisma';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/session';

export async function GET() {
  const equipments = await prisma.equipment.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(equipments);
}

export async function POST(req: Request) {
  const session = await getIronSession(cookies(), sessionOptions);
  if (!session.user || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { name, description, quantity, status, category } = await req.json();

  const newEquipment = await prisma.equipment.create({
    data: { name, description, quantity, status, category },
  });

  return NextResponse.json(newEquipment);
}

export async function PUT(req: Request) {
  const session = await getIronSession(cookies(), sessionOptions);
  if (!session.user || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id, quantity, status } = await req.json();

  const updated = await prisma.equipment.update({
    where: { id },
    data: { quantity, status },
  });

  return NextResponse.json(updated);
}
