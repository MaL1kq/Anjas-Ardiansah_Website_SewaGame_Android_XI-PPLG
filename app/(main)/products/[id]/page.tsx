// app/(main)/products/[id]/page.tsx
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";

type Props = { params: Promise<{ id: string }> };

export default async function ProductDetailPage({ params }: Props) {
 const { id } = await params;
 const session = await getSession();

 const product = await db.product.findUnique({ where: { id, isActive: true } });
 if (!product) notFound();

 const price = Number(product.price);

 // Cek apakah user sudah punya rental aktif untuk produk ini
 let alreadyRented = false;
 if (session) {
 const activeRental = await db.rental.findFirst({
 where: {
 userId: session.id,
 productId: id,
 status: { in: ["PENDING", "ACTIVE"] },
 },
 });
 alreadyRented = !!activeRental;
 }

 return (
 <div className="max-w-5xl mx-auto px-4 py-10">
 {/* Breadcrumb */}
 <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
 <Link href="/products" className="hover:text-purple-400 transition-colors">
 Produk
 </Link>
 <span>/</span>
 <span className="text-slate-300 truncate max-w-[200px]">{product.name}</span>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
 {/* Gambar */}
 <div className="glass overflow-hidden">
 <div className="aspect-video relative bg-slate-900">
 {product.imageUrl ? (
 <Image
 src={product.imageUrl}
 alt={product.name}
 fill
 className="object-cover"
 />
 ) : (
 <div className="absolute inset-0 flex items-center justify-center">
 <span className="text-8xl">
 {product.category === "GAME" ? "" : ""}
 </span>
 </div>
 )}
 </div>
 </div>

 {/* Info */}
 <div className="flex flex-col gap-5">
 {/* Badge + Judul */}
 <div>
 <span className={`${product.category === "GAME" ? "badge-game" : "badge-android"} mb-3 inline-block`}>
 {product.category === "GAME" ? " Game" : " Android"}
 </span>
 <h1 className="text-2xl md:text-3xl font-black text-white mb-3">
 {product.name}
 </h1>
 <p className="text-slate-400 leading-relaxed text-sm">
 {product.description}
 </p>
 </div>

 {/* Harga */}
 <div className="glass p-5">
 <p className="text-xs text-slate-600 mb-1">Harga sewa</p>
 <p className="text-3xl font-black gradient-text mb-1">
 Rp {price.toLocaleString("id-ID")}
 </p>
 <p className="text-xs text-slate-500">per minggu (7 hari akses penuh)</p>
 </div>

 {/* Info akses */}
 <div className="space-y-2">
 {product.itchioUrl && (
 <div className="flex items-center gap-2 text-sm text-slate-400">
 <span></span>
 <span>Link via itch.io (diberikan setelah konfirmasi)</span>
 </div>
 )}
 {product.githubUrl && (
 <div className="flex items-center gap-2 text-sm text-slate-400">
 <span></span>
 <span>Link via GitHub (diberikan setelah konfirmasi)</span>
 </div>
 )}
 <div className="flex items-center gap-2 text-sm text-slate-400">
 <span></span>
 <span>Akses otomatis ditutup setelah 7 hari</span>
 </div>
 </div>

 {/* Tombol */}
 {alreadyRented ? (
 <div className="glass-purple p-4 text-center rounded-xl">
 <p className="text-purple-300 font-semibold text-sm">
 Kamu sudah menyewa produk ini
 </p>
 <Link
 href="/rentals"
 className="text-xs text-slate-400 hover:text-purple-300 transition-colors mt-1 inline-block"
 >
 Lihat status penyewaan →
 </Link>
 </div>
 ) : (
 <AddToCartButton
 productId={product.id}
 isLoggedIn={!!session}
 />
 )}
 </div>
 </div>
 </div>
 );
}