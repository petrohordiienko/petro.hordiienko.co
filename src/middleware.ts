import { type NextRequest, NextResponse } from 'next/server';
import { defaultLocale, isLocale, type Locale, localeCookie } from '@/shared/lib/i18n';

function preferredLocale(req: NextRequest): Locale {
  const fromCookie = req.cookies.get(localeCookie)?.value;
  if (fromCookie && isLocale(fromCookie)) return fromCookie;

  const header = req.headers.get('accept-language') ?? '';
  const ranked = header
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=');
      return { lang: tag.toLowerCase().slice(0, 2), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  const match = ranked.find((r) => isLocale(r.lang));
  return match ? (match.lang as Locale) : defaultLocale;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const segment = pathname.split('/')[1] ?? '';

  if (isLocale(segment)) {
    const res = NextResponse.next();
    if (req.cookies.get(localeCookie)?.value !== segment) {
      res.cookies.set(localeCookie, segment, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
      });
    }
    return res;
  }

  const url = req.nextUrl.clone();
  url.pathname = `/${preferredLocale(req)}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
