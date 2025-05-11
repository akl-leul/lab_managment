import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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
  if (!session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { name, description, quantity, status, category } = await req.json();

  try {
    const newEquipment = await prisma.equipment.create({
      data: { name, description, quantity, status, category },
    });
    return NextResponse.json(newEquipment, { status: 201 });
  } catch (error) {
    console.error('Error creating equipment:', error);
    return NextResponse.json({ error: 'Failed to create equipment' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getIronSession(cookies(), sessionOptions);
  if (!session.user || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id, quantity, status } = await req.json();

  try {
    const updated = await prisma.equipment.update({
      where: { id },
      data: { quantity, status },
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('Error updating equipment:', error);
    return NextResponse.json({ error: 'Failed to update equipment' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getIronSession(cookies(), sessionOptions);
  if (!session.user || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing equipment ID' }, { status: 400 });
  }

  try {
    await prisma.equipment.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Equipment deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting equipment:', error);
    return NextResponse.json({ error: 'Failed to delete equipment' }, { status: 500 });
  }
}
