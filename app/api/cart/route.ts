// app/api/cart/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

// ── GET — ambil isi keranjang user ──
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const cartItems = await db.cart.findMany({
      where: { userId: session.id },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(cartItems);
  } catch (err) {
    console.error("[GET CART]", err);
    return NextResponse.json({ error: "Gagal mengambil keranjang." }, { status: 500 });
  }
}

// ── POST — tambah produk ke keranjang ──
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: "productId wajib diisi." }, { status: 400 });
    }

    // Cek produk ada dan aktif
    const product = await db.product.findUnique({
      where: { id: productId, isActive: true },
    });
    if (!product) {
      return NextResponse.json({ error: "Produk tidak ditemukan." }, { status: 404 });
    }

    // Cek apakah sudah ada di keranjang (unique constraint)
    const existing = await db.cart.findUnique({
      where: { userId_productId: { userId: session.id, productId } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Produk sudah ada di keranjang." },
        { status: 409 }
      );
    }

    // Cek apakah sudah punya rental aktif
    const activeRental = await db.rental.findFirst({
      where: {
        userId: session.id,
        productId,
        status: { in: ["PENDING", "ACTIVE"] },
      },
    });
    if (activeRental) {
      return NextResponse.json(
        { error: "Kamu sudah menyewa produk ini." },
        { status: 409 }
      );
    }

    const cartItem = await db.cart.create({
      data: { userId: session.id, productId },
      include: { product: true },
    });

    return NextResponse.json(cartItem, { status: 201 });
  } catch (err) {
    console.error("[POST CART]", err);
    return NextResponse.json({ error: "Gagal menambahkan ke keranjang." }, { status: 500 });
  }
}

// ── DELETE — hapus item dari keranjang ──
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const cartId = searchParams.get("cartId");
    if (!cartId) {
      return NextResponse.json({ error: "cartId wajib diisi." }, { status: 400 });
    }

    // Pastikan item milik user ini
    const item = await db.cart.findUnique({ where: { id: cartId } });
    if (!item || item.userId !== session.id) {
      return NextResponse.json({ error: "Item tidak ditemukan." }, { status: 404 });
    }

    await db.cart.delete({ where: { id: cartId } });

    return NextResponse.json({ message: "Item berhasil dihapus dari keranjang." });
  } catch (err) {
    console.error("[DELETE CART]", err);
    return NextResponse.json({ error: "Gagal menghapus item." }, { status: 500 });
  }
}