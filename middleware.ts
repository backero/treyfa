import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const adminRoutes = ["/admin"];
const authRoutes = ["/login", "/register"];
const protectedRoutes = ["/checkout", "/orders", "/profile", "/wishlist"];

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  const isAdminRoute = adminRoutes.some((route) => nextUrl.pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => nextUrl.pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some((route) => nextUrl.pathname.startsWith(route));

  // Redirect admin routes for non-admins
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login?callbackUrl=/admin/dashboard", nextUrl));
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${nextUrl.pathname}`, nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|$).*)",
  ],
};
