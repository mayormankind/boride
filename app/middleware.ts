// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect these routes
  const isStudentRoute = pathname.startsWith("/student");
  const isDriverRoute = pathname.startsWith("/driver");

  if (!isStudentRoute && !isDriverRoute) {
    return NextResponse.next();
  }

  try {
    const res = await fetch(
      "https://boride-backend.vercel.app/api/auth/me",
      {
        method: "GET",
        headers: {
          cookie: req.headers.get("cookie") || "",
        },
        credentials: "include",
      }
    );

    if (!res.ok) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    const data = await res.json();

    if (isStudentRoute && data.role !== "student") {
      return NextResponse.redirect(new URL("/driver", req.url));
    }

    if (isDriverRoute && data.role !== "driver") {
      return NextResponse.redirect(new URL("/student", req.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

export const config = {
  matcher: ["/student/:path*", "/driver/:path*"],
};