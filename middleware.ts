import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const PROTECTED_ROUTES = ["/mypage", "/payment", "/dashboard"];
const AUTH_ROUTES = ["/login"];

function getPathnameWithoutLocale(pathname: string): string {
  const localePattern = /^\/(ko|en|ja|zh)(\/|$)/;
  return pathname.replace(localePattern, "/");
}

function getLocaleFromPathname(pathname: string): string {
  const match = pathname.match(/^\/(ko|en|ja|zh)(\/|$)/);
  return match ? match[1] : "ko";
}

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameWithoutLocale = getPathnameWithoutLocale(pathname);
  const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === "true";

  // Check for auth session cookie (next-auth session token)
  const sessionToken =
    request.cookies.get("__Secure-authjs.session-token") ||
    request.cookies.get("authjs.session-token");
  const isAuthenticated = !!sessionToken;

  // Redirect authenticated users away from login page
  if (isAuthenticated && AUTH_ROUTES.some((r) => pathnameWithoutLocale.startsWith(r))) {
    const locale = getLocaleFromPathname(pathname);
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // Redirect unauthenticated users from protected routes to login (skip in test mode)
  if (!isTestMode && !isAuthenticated && PROTECTED_ROUTES.some((r) => pathnameWithoutLocale.startsWith(r))) {
    const locale = getLocaleFromPathname(pathname);
    const callbackUrl = encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(new URL(`/${locale}/login?callbackUrl=${callbackUrl}`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
