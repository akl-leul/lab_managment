import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
 
export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/profile')) {
    const cookie = req.cookies.get('lab-equipment-session');
    if (!cookie) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/login/:path*', '/profile/:path*'],
};
