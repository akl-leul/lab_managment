import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/session';

interface AnnouncementCreateBody {
  title: string;
  message: string;
  date: string; // ISO string
}

interface AnnouncementUpdateBody {
  id: string;
  title?: string;
  message?: string;
  date?: string;
}

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { date: 'desc' },
    });

    // Serialize dates to ISO strings
    const serialized = announcements.map(a => ({
      ...a,
      date: a.date.toISOString(),
    }));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // Require logged-in user (adjust as needed)
  const session = await getIronSession(cookies(), sessionOptions);
  if (!session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { title, message, date } = (await req.json()) as AnnouncementCreateBody;

    if (
      typeof title !== 'string' ||
      typeof message !== 'string' ||
      typeof date !== 'string' ||
      isNaN(Date.parse(date))
    ) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    const newAnnouncement = await prisma.announcement.create({
      data: {
        title,
        message,
        date: new Date(date),
      },
    });

    return NextResponse.json(
      { ...newAnnouncement, date: newAnnouncement.date.toISOString() },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  // Require admin or super admin role for updates (adjust roles as needed)
  const session = await getIronSession(cookies(), sessionOptions);
  if (!session.user || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { id, title, message, date } = (await req.json()) as AnnouncementUpdateBody;

    if (!id) {
      return NextResponse.json({ error: 'Missing announcement ID' }, { status: 400 });
    }

    // Prepare update data object dynamically
    const updateData: Partial<{ title: string; message: string; date: Date }> = {};
    if (title !== undefined) updateData.title = title;
    if (message !== undefined) updateData.message = message;
    if (date !== undefined) {
      if (isNaN(Date.parse(date))) {
        return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
      }
      updateData.date = new Date(date);
    }

    const updated = await prisma.announcement.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ ...updated, date: updated.date.toISOString() }, { status: 200 });
  } catch (error) {
    console.error('Error updating announcement:', error);
    return NextResponse.json({ error: 'Failed to update announcement' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  // Require super admin role for deletion (adjust as needed)
  const session = await getIronSession(cookies(), sessionOptions);
  if (!session.user || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing announcement ID' }, { status: 400 });
    }

    await prisma.announcement.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Announcement deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json({ error: 'Failed to delete announcement' }, { status: 500 });
  }
}
