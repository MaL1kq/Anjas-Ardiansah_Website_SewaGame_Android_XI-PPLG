// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

// ── GET single produk ──
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await db.product.findUnique({ where: { id } });

    if (!product || !product.isActive) {
      return NextResponse.json({ error: "Produk tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err) {
    console.error("[GET PRODUCT]", err);
    return NextResponse.json({ error: "Gagal mengambil produk." }, { status: 500 });
  }
}

// ── PUT — update produk (admin only) ──
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const product = await db.product.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        imageUrl: body.imageUrl || null,
        category: body.category,
        itchioUrl: body.itchioUrl || null,
        githubUrl: body.githubUrl || null,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json(product);
  } catch (err) {
    console.error("[PUT PRODUCT]", err);
    return NextResponse.json({ error: "Gagal mengupdate produk." }, { status: 500 });
  }
}

// ── DELETE — soft delete produk (admin only) ──
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    const { id } = await params;

    // Soft delete — set isActive = false agar data rental tetap ada
    await db.product.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ message: "Produk berhasil dihapus." });
  } catch (err) {
    console.error("[DELETE PRODUCT]", err);
    return NextResponse.json({ error: "Gagal menghapus produk." }, { status: 500 });
  }
}