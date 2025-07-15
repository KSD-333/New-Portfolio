// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  // No authentication, allow all routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};