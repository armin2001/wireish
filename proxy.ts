import { NextResponse, type NextRequest } from 'next/server';
import { LOCALE_COOKIE, negotiateLocale, splitLocale } from '@/lib/i18n/config';

/**
 * Next.js 16 proxy (the successor of middleware.ts). Every page lives under a language
 * prefix; a request without one (/, /pricing, old bookmarks) is redirected to the
 * visitor's language: saved choice first, then the browser's Accept-Language, then English.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (splitLocale(pathname).locale) return NextResponse.next();

  const locale = negotiateLocale(request.cookies.get(LOCALE_COOKIE)?.value, request.headers.get('accept-language'));
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  url.search = search;
  const response = NextResponse.redirect(url);
  // Caches must key the redirect on these headers, or one visitor's language would be served to everyone.
  response.headers.set('Vary', 'Accept-Language, Cookie');
  return response;
}

export const config = {
  // Everything except API routes, Next internals and files with an extension (logo.svg, robots.txt …).
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
