// app/(main)/products/page.tsx
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { expireRentals } from "@/lib/auth";
import ProductCard from "@/components/ProductCard";
import ProductSearch from "@/components/ProductSearch";
import { Prisma } from "@prisma/client";

type Props = {
 searchParams: Promise<{ search?: string; category?: string }>;
};

export default async function ProductsPage({ searchParams }: Props) {
 // Auto expire rentals yang sudah lewat 7 hari
 await expireRentals();

 const session = await getSession();
 const { search = "", category = "" } = await searchParams;

 const where: Prisma.ProductWhereInput = {
 isActive: true,
 ...(search && {
 OR: [
 { name: { contains: search, mode: "insensitive" } },
 { description: { contains: search, mode: "insensitive" } },
 ],
 }),
 ...(category === "GAME" || category === "ANDROID" ? { category } : {}),
 };

 const products = await db.product.findMany({
 where,
 orderBy: { createdAt: "desc" },
 });

 return (
 <div className="max-w-6xl mx-auto px-4 py-10">
 {/* Header */}
 <div className="mb-10">
 <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
 Katalog <span className="gradient-text">Produk</span>
 </h1>
 <p className="text-slate-500">
 {products.length} produk tersedia — sewa selama 1 minggu
 </p>
 </div>

 {/* Search + Filter */}
 <ProductSearch currentSearch={search} currentCategory={category} />

 {/* Grid Produk */}
 {products.length === 0 ? (
 <div className="text-center py-24">
 <div className="text-6xl mb-4"></div>
 <h3 className="text-xl font-bold text-white mb-2">Produk tidak ditemukan</h3>
 <p className="text-slate-500">
 Coba kata kunci lain atau hapus filter kategori.
 </p>
 </div>
 ) : (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
 {products.map((product) => (
 <ProductCard
 key={product.id}
 product={{
 ...product,
 price: Number(product.price),
 }}
 isLoggedIn={!!session}
 />
 ))}
 </div>
 )}
 </div>
 );
}