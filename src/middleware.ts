import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // No route protection, allow all requests through
  return NextResponse.next();
}

export const config = {
  matcher: [], // No routes are matched, middleware effectively disabled
};
