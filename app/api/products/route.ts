// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

// ── GET — ambil semua produk (support ?search=&category=) ──
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    const products = await db.product.findMany({
      where: {
        isActive: true,
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(category === "GAME" || category === "ANDROID"
          ? { category }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (err) {
    console.error("[GET PRODUCTS]", err);
    return NextResponse.json({ error: "Gagal mengambil produk." }, { status: 500 });
  }
}

// ── POST — tambah produk baru (admin only) ──
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    const { name, description, price, imageUrl, category, itchioUrl, githubUrl } =
      await req.json();

    if (!name || !description || !price || !category) {
      return NextResponse.json({ error: "Field wajib belum lengkap." }, { status: 400 });
    }

    const product = await db.product.create({
      data: {
        name,
        description,
        price,
        imageUrl: imageUrl || null,
        category,
        itchioUrl: itchioUrl || null,
        githubUrl: githubUrl || null,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error("[POST PRODUCT]", err);
    return NextResponse.json({ error: "Gagal menambah produk." }, { status: 500 });
  }
}