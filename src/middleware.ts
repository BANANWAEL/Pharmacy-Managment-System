// // middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('userToken')?.value;
  const { pathname } = request.nextUrl;

  // لو رايح للداشبورد ومعندوش توكن -> يرجعه للـ login
  if (pathname.startsWith('/Dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // لو عنده توكن ورايح للـ login -> يدخله علطول للداشبورد
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/Dashboard/Manager', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/Dashboard/:path*', '/login'],
};