// app/api/admin/rentals/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession, expireRentals } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    await expireRentals();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search") || "";

    const rentals = await db.rental.findMany({
      where: {
        ...(status && status !== "ALL" ? { status: status as "PENDING" | "ACTIVE" | "EXPIRED" } : {}),
        ...(search && {
          OR: [
            { user: { name:  { contains: search, mode: "insensitive" } } },
            { user: { email: { contains: search, mode: "insensitive" } } },
            { product: { name: { contains: search, mode: "insensitive" } } },
          ],
        }),
      },
      include: {
        user:    { select: { id: true, name: true, email: true } },
        product: { select: { id: true, name: true, category: true, imageUrl: true, itchioUrl: true, githubUrl: true } },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(rentals);
  } catch (err) {
    console.error("[ADMIN GET RENTALS]", err);
    return NextResponse.json({ error: "Gagal mengambil data." }, { status: 500 });
  }
}