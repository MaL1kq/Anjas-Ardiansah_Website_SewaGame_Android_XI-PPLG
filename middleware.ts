// middleware.ts  ← letakkan di ROOT project (sejajar dengan app/)
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

// Route yang butuh login
const PROTECTED = ["/cart", "/rentals", "/profile"];
// Route khusus admin
const ADMIN_ONLY = ["/admin"];
// Route yang tidak boleh diakses kalau sudah login
const AUTH_PAGES = ["/login", "/register"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("rentzone_token")?.value;
  const session = token ? await verifyToken(token) : null;

  // Kalau sudah login, jangan bisa akses /login atau /register
  if (AUTH_PAGES.some((p) => pathname.startsWith(p))) {
    if (session) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Kalau belum login dan mau akses halaman protected
  if (PROTECTED.some((p) => pathname.startsWith(p))) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // Kalau bukan admin dan mau akses /admin
  if (ADMIN_ONLY.some((p) => pathname.startsWith(p))) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};