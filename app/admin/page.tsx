"use client";
// app/admin/page.tsx

import { useEffect, useState } from "react";
import Link from "next/link";

type Stats = {
 totalProducts: number;
 totalUsers: number;
 pendingRentals: number;
 activeRentals: number;
 expiredRentals: number;
 totalGames: number;
 totalAndroid: number;
 totalRevenue: number;
 recentRentals: Array<{
 id: string;
 status: string;
 createdAt: string;
 user: { name: string; email: string };
 product: { name: string; category: string };
 }>;
};

function StatCard({
 icon, label, value, sub, accent = false,
}: {
 icon: string; label: string; value: string | number; sub?: string; accent?: boolean;
}) {
 return (
 <div className={`glass p-5 ${accent ? "border-purple-500/30 glow-border" : ""}`}>
 <div className="flex items-start justify-between mb-3">
 <span className="text-2xl">{icon}</span>
 {accent && (
 <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse-purple" />
 )}
 </div>
 <p className={`text-2xl font-black mb-0.5 ${accent ? "gradient-text" : "text-white"}`}>
 {value}
 </p>
 <p className="text-sm text-slate-400">{label}</p>
 {sub && <p className="text-xs text-slate-600 mt-0.5">{sub}</p>}
 </div>
 );
}

function StatusBadge({ status }: { status: string }) {
 const map: Record<string, string> = {
 PENDING: "badge-pending",
 ACTIVE: "badge-active",
 EXPIRED: "badge-expired",
 };
 return <span className={map[status] ?? "badge-pending"}>{status}</span>;
}

export default function AdminDashboard() {
 const [stats, setStats] = useState<Stats | null>(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 fetch("/api/admin/stats")
 .then((r) => r.json())
 .then(setStats)
 .catch(console.error)
 .finally(() => setLoading(false));
 }, []);

 if (loading) {
 return (
 <div className="flex items-center justify-center h-64">
 <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
 </div>
 );
 }

 if (!stats) return <p className="text-red-400">Gagal memuat data.</p>;

 return (
 <div className="space-y-8 animate-fade-in">
 {/* Header */}
 <div>
 <h1 className="text-2xl md:text-3xl font-black text-white">
 Dashboard <span className="gradient-text">Admin</span>
 </h1>
 <p className="text-slate-500 text-sm mt-1">
 Ringkasan aktivitas RentZone
 </p>
 </div>

 {/* Stat cards */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 <StatCard icon="" label="Menunggu Konfirmasi" value={stats.pendingRentals} accent={stats.pendingRentals > 0} />
 <StatCard icon="" label="Penyewaan Aktif" value={stats.activeRentals} />
 <StatCard icon="" label="Total Pembeli" value={stats.totalUsers} />
 <StatCard
 icon=""
 label="Total Pendapatan"
 value={`Rp ${stats.totalRevenue.toLocaleString("id-ID")}`}
 sub="dari pembayaran terkonfirmasi"
 accent
 />
 </div>

 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 <StatCard icon="" label="Produk Game" value={stats.totalGames} />
 <StatCard icon="" label="Produk Android" value={stats.totalAndroid} />
 <StatCard icon="" label="Total Produk" value={stats.totalProducts} />
 <StatCard icon="" label="Sewa Expired" value={stats.expiredRentals} />
 </div>

 {/* Quick actions */}
 {stats.pendingRentals > 0 && (
 <div className="glass-purple p-5 flex items-center justify-between flex-wrap gap-4">
 <div>
 <p className="font-bold text-white">
 Ada {stats.pendingRentals} penyewaan menunggu konfirmasi
 </p>
 <p className="text-sm text-slate-400 mt-0.5">
 Segera konfirmasi agar pembeli mendapat akses.
 </p>
 </div>
 <Link
 href="/admin/rentals"
 className="btn-primary px-6 py-2.5 text-sm font-semibold relative z-10 glow-purple-sm"
 >
 Konfirmasi Sekarang →
 </Link>
 </div>
 )}

 {/* Recent rentals */}
 <div>
 <div className="flex items-center justify-between mb-4">
 <h2 className="font-bold text-white">Penyewaan Terbaru</h2>
 <Link href="/admin/rentals" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
 Lihat semua →
 </Link>
 </div>

 {stats.recentRentals.length === 0 ? (
 <div className="glass p-8 text-center text-slate-500 text-sm">
 Belum ada penyewaan
 </div>
 ) : (
 <div className="glass overflow-hidden">
 <table className="w-full text-sm">
 <thead>
 <tr className="border-b border-slate-800">
 <th className="text-left px-5 py-3 text-slate-500 font-medium">Pembeli</th>
 <th className="text-left px-5 py-3 text-slate-500 font-medium hidden md:table-cell">Produk</th>
 <th className="text-left px-5 py-3 text-slate-500 font-medium">Status</th>
 <th className="text-left px-5 py-3 text-slate-500 font-medium hidden md:table-cell">Tanggal</th>
 </tr>
 </thead>
 <tbody>
 {stats.recentRentals.map((r, i) => (
 <tr
 key={r.id}
 className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${
 i === stats.recentRentals.length - 1 ? "border-0" : ""
 }`}
 >
 <td className="px-5 py-3">
 <p className="font-medium text-white">{r.user.name}</p>
 <p className="text-xs text-slate-500">{r.user.email}</p>
 </td>
 <td className="px-5 py-3 hidden md:table-cell">
 <p className="text-slate-300">{r.product.name}</p>
 <p className="text-xs text-slate-500">{r.product.category}</p>
 </td>
 <td className="px-5 py-3">
 <StatusBadge status={r.status} />
 </td>
 <td className="px-5 py-3 text-slate-500 hidden md:table-cell">
 {new Date(r.createdAt).toLocaleDateString("id-ID")}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>
 </div>
 );
}