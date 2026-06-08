// app/api/admin/rentals/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

// ── PUT — konfirmasi atau tolak rental ──
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    const { id } = await params;
    const { action, accessUrl } = await req.json();
    // action: "CONFIRM" | "REJECT"

    const rental = await db.rental.findUnique({
      where: { id },
      include: { payment: true, product: true },
    });

    if (!rental) {
      return NextResponse.json({ error: "Rental tidak ditemukan." }, { status: 404 });
    }

    if (rental.status !== "PENDING") {
      return NextResponse.json(
        { error: "Hanya rental berstatus PENDING yang bisa dikonfirmasi." },
        { status: 400 }
      );
    }

    if (action === "CONFIRM") {
      // Tentukan URL akses:
      // Prioritas: accessUrl dari admin → itchioUrl produk → githubUrl produk
      const finalAccessUrl =
        accessUrl?.trim() ||
        rental.product.itchioUrl ||
        rental.product.githubUrl ||
        null;

      const startDate = new Date();
      const endDate   = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7); // +7 hari

      // Update rental jadi ACTIVE
      const updated = await db.rental.update({
        where: { id },
        data: {
          status:    "ACTIVE",
          startDate,
          endDate,
          accessUrl: finalAccessUrl,
        },
      });

      // Update payment jadi CONFIRMED
      if (rental.payment) {
        await db.payment.update({
          where: { id: rental.payment.id },
          data: {
            status:      "CONFIRMED",
            confirmedAt: new Date(),
          },
        });
      }

      return NextResponse.json({
        message: "Penyewaan berhasil dikonfirmasi. Akses aktif selama 7 hari.",
        rental:  updated,
      });
    }

    if (action === "REJECT") {
      // Hapus rental dan payment (biarkan user bisa sewa lagi)
      if (rental.payment) {
        await db.payment.delete({ where: { id: rental.payment.id } });
      }
      await db.rental.delete({ where: { id } });

      return NextResponse.json({ message: "Penyewaan berhasil ditolak." });
    }

    return NextResponse.json({ error: "Action tidak valid." }, { status: 400 });
  } catch (err) {
    console.error("[ADMIN CONFIRM RENTAL]", err);
    return NextResponse.json({ error: "Gagal memproses rental." }, { status: 500 });
  }
}