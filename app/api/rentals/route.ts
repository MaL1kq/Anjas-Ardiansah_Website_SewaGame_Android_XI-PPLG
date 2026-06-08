// app/api/rentals/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession, expireRentals } from "@/lib/auth";

// ── GET — ambil semua rental milik user ──
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    // Auto expire dulu
    await expireRentals();

    const rentals = await db.rental.findMany({
      where: { userId: session.id },
      include: {
        product: true,
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(rentals);
  } catch (err) {
    console.error("[GET RENTALS]", err);
    return NextResponse.json({ error: "Gagal mengambil data penyewaan." }, { status: 500 });
  }
}

// ── POST — checkout: buat rental dari semua item di keranjang ──
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { cartIds } = await req.json(); // array of cart item IDs yang dipilih

    if (!cartIds || !Array.isArray(cartIds) || cartIds.length === 0) {
      return NextResponse.json(
        { error: "Pilih minimal 1 item untuk disewa." },
        { status: 400 }
      );
    }

    // Ambil cart items yang dipilih (pastikan milik user ini)
    const cartItems = await db.cart.findMany({
      where: {
        id: { in: cartIds },
        userId: session.id,
      },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Item tidak ditemukan." }, { status: 404 });
    }

    // Buat rental + payment untuk setiap item
    const createdRentals = await Promise.all(
      cartItems.map(async (item) => {
        const rental = await db.rental.create({
          data: {
            userId: session.id,
            productId: item.productId,
            status: "PENDING",
          },
        });

        await db.payment.create({
          data: {
            rentalId: rental.id,
            amount: item.product.price,
            status: "PENDING",
          },
        });

        // Hapus dari keranjang setelah checkout
        await db.cart.delete({ where: { id: item.id } });

        return rental;
      })
    );

    return NextResponse.json(
      {
        message: `${createdRentals.length} penyewaan berhasil diajukan. Menunggu konfirmasi admin.`,
        rentals: createdRentals,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST RENTALS]", err);
    return NextResponse.json({ error: "Gagal membuat penyewaan." }, { status: 500 });
  }
}