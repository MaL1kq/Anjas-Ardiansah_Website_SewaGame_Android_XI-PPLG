// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database RentZone...\n");

  // ── Admin user ──────────────────────────────────────────
  const adminPass = await bcrypt.hash("admin123", 12);
  const admin = await db.user.upsert({
    where:  { email: "admin@rentzone.id" },
    update: {},
    create: {
      name:     "Admin RentZone",
      email:    "admin@rentzone.id",
      password: adminPass,
      role:     "ADMIN",
    },
  });
  console.log("✅ Admin created:", admin.email);

  // ── Sample buyer ────────────────────────────────────────
  const buyerPass = await bcrypt.hash("buyer123", 12);
  const buyer = await db.user.upsert({
    where:  { email: "buyer@rentzone.id" },
    update: {},
    create: {
      name:     "Budi Santoso",
      email:    "buyer@rentzone.id",
      password: buyerPass,
      role:     "BUYER",
    },
  });
  console.log("✅ Buyer created:", buyer.email);

  // ── Sample products ─────────────────────────────────────
  const products = [
    {
      name:        "MARCO BROSS — OOP Platformer",
      description: "Game platformer 2D bertema OOP. Lawan musuh, kumpulkan koin konsep OOP, dan capai portal kemenangan! Dibuat dengan GDevelop.",
      price:       15000,
      category:    "GAME" as const,
      imageUrl:    null,
      itchioUrl:   "https://itch.io",
      githubUrl:   null,
    },
    {
      name:        "Quest of the Code Masters",
      description: "Jelajahi dunia virtual sambil belajar konsep OOP: kelas, objek, pewarisan, polimorfisme, enkapsulasi, dan abstraksi.",
      price:       10000,
      category:    "GAME" as const,
      imageUrl:    null,
      itchioUrl:   "https://itch.io",
      githubUrl:   null,
    },
    {
      name:        "E-Travel Android App",
      description: "Aplikasi pemesanan tiket travel berbasis Android. Fitur: login, registrasi, pencarian, pemesanan, dan histori transaksi.",
      price:       20000,
      category:    "ANDROID" as const,
      imageUrl:    null,
      itchioUrl:   null,
      githubUrl:   "https://github.com",
    },
    {
      name:        "ETicketing Mobile App",
      description: "Aplikasi e-ticketing mobile untuk berbagai acara. Admin dapat mengelola tiket, pembeli dapat memesan dan melihat histori.",
      price:       18000,
      category:    "ANDROID" as const,
      imageUrl:    null,
      itchioUrl:   null,
      githubUrl:   "https://github.com",
    },
    {
      name:        "Pixel Jungle Runner",
      description: "Game runner seru dengan tema hutan pixel art. Lompati rintangan, kumpulkan koin, dan raih skor tertinggi!",
      price:       12000,
      category:    "GAME" as const,
      imageUrl:    null,
      itchioUrl:   "https://itch.io",
      githubUrl:   null,
    },
    {
      name:        "TokoKu — Inventory Android",
      description: "Aplikasi manajemen inventori toko berbasis Android. CRUD produk, laporan stok, dan manajemen transaksi sederhana.",
      price:       25000,
      category:    "ANDROID" as const,
      imageUrl:    null,
      itchioUrl:   null,
      githubUrl:   "https://github.com",
    },
  ];

  for (const p of products) {
    const created = await db.product.create({ data: p });
    console.log(`✅ Product: ${created.name} (${created.category})`);
  }

  console.log("\n🎉 Seeding selesai!");
  console.log("─────────────────────────────────────");
  console.log("👤 Admin   → admin@rentzone.id  / admin123");
  console.log("👤 Buyer   → buyer@rentzone.id  / buyer123");
  console.log("─────────────────────────────────────\n");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });