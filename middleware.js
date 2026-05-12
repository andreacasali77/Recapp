import { NextResponse } from "next/server";

export function middleware(request) {
  const token  = request.cookies.get("recaphq-auth")?.value;
  const secret = process.env.AUTH_SECRET;
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/login";
  // Both must exist and match — if AUTH_SECRET is undefined, always block
  const isValid = !!secret && !!token && token === secret;

  // Already logged in → skip login page
  if (isValid && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Not logged in → go to login
  if (!isValid && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Protect all pages except static assets, API routes and login
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo-recaphq.png|api/).*)",
  ],
};
