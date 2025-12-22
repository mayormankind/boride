//middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get auth token and user role from cookies or headers
  // This is a placeholder - implement based on your auth system
  const token = request.cookies.get('auth-token')?.value;
  const userRole = request.cookies.get('user-role')?.value; // 'student' or 'driver'

  // Protected student routes
  if (pathname.startsWith('/student')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    if (userRole !== 'student') {
      return NextResponse.redirect(new URL('/driver', request.url));
    }
  }

  // Protected driver routes
  if (pathname.startsWith('/driver')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    if (userRole !== 'driver') {
      return NextResponse.redirect(new URL('/student', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/student/:path*', '/driver/:path*'],
};
