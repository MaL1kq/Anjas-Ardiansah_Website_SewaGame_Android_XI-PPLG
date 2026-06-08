"use client";
// app/(main)/rentals/page.tsx

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Rental = {
 id: string;
 status: "PENDING" | "ACTIVE" | "EXPIRED";
 startDate: string | null;
 endDate: string | null;
 accessUrl: string | null;
 createdAt: string;
 product: {
 id: string;
 name: string;
 imageUrl: string | null;
 category: "GAME" | "ANDROID";
 price: number;
 };
 payment: {
 amount: number;
 status: "PENDING" | "CONFIRMED";
 } | null;
};

function StatusBadge({ status }: { status: Rental["status"] }) {
 const map = {
 PENDING: { cls: "badge-pending", label: " Menunggu Konfirmasi" },
 ACTIVE: { cls: "badge-active", label: " Aktif" },
 EXPIRED: { cls: "badge-expired", label: " Expired" },
 };
 const { cls, label } = map[status];
 return <span className={cls}>{label}</span>;
}

function CountdownTimer({ endDate }: { endDate: string }) {
 const end = new Date(endDate).getTime();
 const now = Date.now();
 const diff = end - now;

 if (diff <= 0) return <span className="text-red-400 text-xs">Waktu habis</span>;

 const days = Math.floor(diff / (1000 * 60 * 60 * 24));
 const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
 const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

 return (
 <span className="text-purple-300 text-xs font-semibold">
 Sisa: {days}h {hours}j {mins}m
 </span>
 );
}

export default function RentalsPage() {
 const [rentals, setRentals] = useState<Rental[]>([]);
 const [loading, setLoading] = useState(true);
 const [filter, setFilter] = useState<"ALL" | "PENDING" | "ACTIVE" | "EXPIRED">("ALL");

 useEffect(() => {
 fetch("/api/rentals")
 .then((r) => r.json())
 .then((data) => setRentals(Array.isArray(data) ? data : []))
 .catch(console.error)
 .finally(() => setLoading(false));
 }, []);

 const filtered = filter === "ALL"
 ? rentals
 : rentals.filter((r) => r.status === filter);

 const counts = {
 ALL: rentals.length,
 PENDING: rentals.filter((r) => r.status === "PENDING").length,
 ACTIVE: rentals.filter((r) => r.status === "ACTIVE").length,
 EXPIRED: rentals.filter((r) => r.status === "EXPIRED").length,
 };

 return (
 <div className="max-w-4xl mx-auto px-4 py-10">
 <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
 <div>
 <h1 className="text-3xl font-black text-white">
 Penyewaan <span className="gradient-text">Saya</span>
 </h1>
 <p className="text-slate-500 text-sm mt-1">
 {rentals.length} total penyewaan
 </p>
 </div>
 <Link href="/products" className="btn-ghost px-5 py-2 text-sm">
 + Sewa Lagi
 </Link>
 </div>

 {/* Filter tab */}
 <div className="flex gap-2 flex-wrap mb-6">
 {(["ALL", "PENDING", "ACTIVE", "EXPIRED"] as const).map((f) => (
 <button
 key={f}
 onClick={() => setFilter(f)}
 className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
 filter === f
 ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
 : "bg-slate-800/60 text-slate-500 border border-slate-700/50 hover:text-white"
 }`}
 >
 {f === "ALL" ? "Semua" : f === "PENDING" ? "Pending" : f === "ACTIVE" ? "Aktif" : "Expired"}
 <span className="ml-1.5 text-xs opacity-60">({counts[f]})</span>
 </button>
 ))}
 </div>

 {loading ? (
 <div className="text-center py-24">
 <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
 <p className="text-slate-500">Memuat data penyewaan...</p>
 </div>
 ) : filtered.length === 0 ? (
 <div className="text-center py-24">
 <div className="text-6xl mb-4"></div>
 <h3 className="text-xl font-bold text-white mb-2">
 {filter === "ALL" ? "Belum ada penyewaan" : `Tidak ada penyewaan ${filter.toLowerCase()}`}
 </h3>
 <p className="text-slate-500 mb-6">
 {filter === "ALL" && "Mulai sewa aplikasi favoritmu sekarang!"}
 </p>
 {filter === "ALL" && (
 <Link href="/products" className="btn-primary px-8 py-3 text-sm font-semibold relative z-10">
 Lihat Produk
 </Link>
 )}
 </div>
 ) : (
 <div className="space-y-4">
 {filtered.map((rental) => (
 <div
 key={rental.id}
 className={`glass p-5 transition-all duration-200 ${
 rental.status === "ACTIVE" ? "border-purple-500/30 glow-border" : ""
 }`}
 >
 <div className="flex gap-4 items-start">
 {/* Gambar produk */}
 <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0">
 {rental.product.imageUrl ? (
 <Image
 src={rental.product.imageUrl}
 alt={rental.product.name}
 width={80} height={64}
 className="w-full h-full object-cover"
 />
 ) : (
 <div className="w-full h-full flex items-center justify-center text-2xl">
 {rental.product.category === "GAME" ? "" : ""}
 </div>
 )}
 </div>

 {/* Info */}
 <div className="flex-1 min-w-0">
 <div className="flex items-start justify-between gap-2 mb-2">
 <div>
 <h3 className="font-bold text-white text-sm">{rental.product.name}</h3>
 <p className="text-xs text-slate-500 mt-0.5">
 Diajukan: {new Date(rental.createdAt).toLocaleDateString("id-ID", {
 day: "numeric", month: "long", year: "numeric"
 })}
 </p>
 </div>
 <StatusBadge status={rental.status} />
 </div>

 {/* Info tambahan per status */}
 {rental.status === "PENDING" && (
 <div className="mt-3 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/15">
 <p className="text-xs text-yellow-300/80">
 Penyewaanmu sedang menunggu konfirmasi dan verifikasi pembayaran dari admin.
 </p>
 <p className="text-xs text-slate-500 mt-1">
 Total: <span className="text-white font-semibold">
 Rp {Number(rental.payment?.amount ?? 0).toLocaleString("id-ID")}
 </span>
 </p>
 </div>
 )}

 {rental.status === "ACTIVE" && rental.accessUrl && (
 <div className="mt-3 p-3 rounded-xl bg-purple-500/8 border border-purple-500/20">
 <div className="flex items-center justify-between flex-wrap gap-2">
 <div>
 <p className="text-xs text-slate-400 mb-1">
 Aktif: {new Date(rental.startDate!).toLocaleDateString("id-ID")} —{" "}
 {new Date(rental.endDate!).toLocaleDateString("id-ID")}
 </p>
 <CountdownTimer endDate={rental.endDate!} />
 </div>
 <a
 href={rental.accessUrl}
 target="_blank"
 rel="noopener noreferrer"
 className="btn-primary px-5 py-2 text-xs font-semibold relative z-10 glow-purple-sm"
 >
 Akses Sekarang
 </a>
 </div>
 </div>
 )}

 {rental.status === "EXPIRED" && (
 <div className="mt-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/30">
 <p className="text-xs text-slate-500">
 Akses berakhir pada{" "}
 {rental.endDate
 ? new Date(rental.endDate).toLocaleDateString("id-ID", {
 day: "numeric", month: "long", year: "numeric"
 })
 : "-"}
 </p>
 <Link
 href={`/products/${rental.product.id}`}
 className="text-xs text-purple-400 hover:text-purple-300 transition-colors mt-1 inline-block"
 >
 Sewa lagi →
 </Link>
 </div>
 )}
 </div>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 );
}