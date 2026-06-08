// lib/auth.ts
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-ganti-di-env"
);

export type JWTPayload = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "BUYER";
};

// ─── Sign token ───────────────────────────────────────────
export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

// ─── Verify token ─────────────────────────────────────────
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

// ─── Get session dari cookie ──────────────────────────────
export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("rentzone_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ─── Set session cookie ───────────────────────────────────
export async function setSession(payload: JWTPayload): Promise<void> {
  const token = await signToken(payload);
  const cookieStore = await cookies();
  cookieStore.set("rentzone_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
    path: "/",
  });
}

// ─── Hapus session ────────────────────────────────────────
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("rentzone_token");
}

// ─── Auto expire rentals ──────────────────────────────────
// Dipanggil tiap kali ada request — cek rental yang sudah lewat 7 hari
export async function expireRentals(): Promise<void> {
  await db.rental.updateMany({
    where: {
      status: "ACTIVE",
      endDate: { lt: new Date() },
    },
    data: { status: "EXPIRED" },
  });
}