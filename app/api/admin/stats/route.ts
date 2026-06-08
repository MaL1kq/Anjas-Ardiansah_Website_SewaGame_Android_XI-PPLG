// app/api/admin/stats/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession, expireRentals } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    await expireRentals();

    const [
      totalProducts,
      totalUsers,
      pendingRentals,
      activeRentals,
      expiredRentals,
      totalGames,
      totalAndroid,
      recentRentals,
    ] = await Promise.all([
      db.product.count({ where: { isActive: true } }),
      db.user.count({ where: { role: "BUYER" } }),
      db.rental.count({ where: { status: "PENDING" } }),
      db.rental.count({ where: { status: "ACTIVE" } }),
      db.rental.count({ where: { status: "EXPIRED" } }),
      db.product.count({ where: { category: "GAME", isActive: true } }),
      db.product.count({ where: { category: "ANDROID", isActive: true } }),
      db.rental.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } }, product: { select: { name: true, category: true } } },
      }),
    ]);

    // Total pendapatan dari payment yang confirmed
    const revenue = await db.payment.aggregate({
      where: { status: "CONFIRMED" },
      _sum: { amount: true },
    });

    return NextResponse.json({
      totalProducts,
      totalUsers,
      pendingRentals,
      activeRentals,
      expiredRentals,
      totalGames,
      totalAndroid,
      totalRevenue: Number(revenue._sum.amount ?? 0),
      recentRentals,
    });
  } catch (err) {
    console.error("[GET STATS]", err);
    return NextResponse.json({ error: "Gagal mengambil statistik." }, { status: 500 });
  }
}