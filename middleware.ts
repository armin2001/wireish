import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get('wireish_auth');
  const { pathname } = request.nextUrl;

  // Dozvoli pristup login stranici i api rutama
  if (pathname.startsWith('/login') || pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // Ako cookie nije postavljen, preusmjeri na /login
  if (!cookie || cookie.value !== 'authenticated_true') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'],
};