// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('access_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const role = decoded.role;

  if (pathname.startsWith('/student') && role !== 'student') {
    return NextResponse.redirect(new URL('/driver', request.url));
  }

  if (pathname.startsWith('/driver') && role !== 'driver') {
    return NextResponse.redirect(new URL('/student', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/student/:path*', '/driver/:path*'],
};
