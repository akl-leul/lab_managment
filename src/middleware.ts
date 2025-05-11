import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'my-app-session'; // Update this to your actual session cookie name

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /admin and /profile routes and all their subpaths
  if (pathname.startsWith('/SUPfER_ADMIN') || pathname.startsWith('/profile')) {
    const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME);

    // If no session cookie, redirect to login with 'from' param
    if (!sessionCookie) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/ghf';
      loginUrl.searchParams.set('from', pathname); // Pass original path for redirect after login
      return NextResponse.redirect(loginUrl);
    }

    // TODO: Optional - Add session validation here (e.g., verify cookie or JWT)
  }

  // Allow request to continue if authenticated or route not protected
  return NextResponse.next();
}

export const config = {
  // Apply middleware to /admin and /profile and all nested routes
  matcher: ['/SUPERd_ADMIN/:path*', '/profile/:path*'],
};
