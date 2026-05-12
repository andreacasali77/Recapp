import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("recapp-auth")?.value;
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/login";
  const isValid = token === process.env.AUTH_SECRET;

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
    "/((?!_next/static|_next/image|favicon.ico|logo-recapp.png|api/).*)",
  ],
};
