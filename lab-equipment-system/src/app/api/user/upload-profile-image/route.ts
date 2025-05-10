import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const session = await getIronSession(req.headers.get('cookie') || '', sessionOptions);
  if (!session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const form = new IncomingForm({
    uploadDir: path.join(process.cwd(), '/public/uploads'),
    keepExtensions: true,
  });

  return new Promise((resolve, reject) => {
    form.parse(req as any, async (err, fields, files) => {
      if (err) {
        reject(NextResponse.json({ error: 'Upload failed' }, { status: 500 }));
        return;
      }

      const file = files.file as any;
      const filename = path.basename(file.filepath);

      // Update user profileImage
      await prisma.user.update({
        where: { id: session.user.id },
        data: { profileImage: `/uploads/${filename}` },
      });

      resolve(NextResponse.json({ message: 'Upload successful', url: `/uploads/${filename}` }));
    });
  });
}
