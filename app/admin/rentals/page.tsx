"use client";
// app/admin/rentals/page.tsx

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

type Rental = {
 id: string;
 status: "PENDING" | "ACTIVE" | "EXPIRED";
 startDate: string | null;
 endDate: string | null;
 accessUrl: string | null;
 createdAt: string;
 user: { id: string; name: string; email: string };
 product: {
 id: string; name: string; category: string;
 imageUrl: string | null; itchioUrl: string | null; githubUrl: string | null;
 };
 payment: { amount: number; status: string } | null;
};

type Filter = "ALL" | "PENDING" | "ACTIVE" | "EXPIRED";

function StatusBadge({ status }: { status: Rental["status"] }) {
 const map = {
 PENDING: { cls: "badge-pending", label: " Pending" },
 ACTIVE: { cls: "badge-active", label: " Aktif" },
 EXPIRED: { cls: "badge-expired", label: " Expired" },
 };
 const { cls, label } = map[status];
 return <span className={cls}>{label}</span>;
}

export default function AdminRentalsPage() {
 const [rentals, setRentals] = useState<Rental[]>([]);
 const [loading, setLoading] = useState(true);
 const [filter, setFilter] = useState<Filter>("ALL");
 const [search, setSearch] = useState("");

 // Modal konfirmasi
 const [confirmModal, setConfirmModal] = useState<Rental | null>(null);
 const [accessUrl, setAccessUrl] = useState("");
 const [processing, setProcessing] = useState(false);
 const [successMsg, setSuccessMsg] = useState("");
 const [errorMsg, setErrorMsg] = useState("");

 const fetchRentals = useCallback(async () => {
 setLoading(true);
 try {
 const params = new URLSearchParams();
 if (filter !== "ALL") params.set("status", filter);
 if (search) params.set("search", search);
 const res = await fetch(`/api/admin/rentals?${params}`);
 const data = await res.json();
 setRentals(Array.isArray(data) ? data : []);
 } catch { console.error("Gagal fetch rentals"); }
 finally { setLoading(false); }
 }, [filter, search]);

 useEffect(() => { fetchRentals(); }, [fetchRentals]);

 function openConfirm(rental: Rental) {
 setConfirmModal(rental);
 // Pre-fill dengan URL dari produk kalau ada
 setAccessUrl(rental.product.itchioUrl || rental.product.githubUrl || "");
 setErrorMsg("");
 }

 async function handleAction(action: "CONFIRM" | "REJECT") {
 if (!confirmModal) return;
 setProcessing(true);
 setErrorMsg("");

 try {
 const res = await fetch(`/api/admin/rentals/${confirmModal.id}`, {
 method: "PUT",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ action, accessUrl: accessUrl.trim() || null }),
 });

 const data = await res.json();

 if (!res.ok) {
 setErrorMsg(data.error || "Gagal memproses.");
 return;
 }

 setConfirmModal(null);
 setSuccessMsg(data.message);
 setTimeout(() => setSuccessMsg(""), 4000);
 fetchRentals();
 } catch {
 setErrorMsg("Terjadi kesalahan.");
 } finally {
 setProcessing(false);
 }
 }

 const counts: Record<Filter, number> = {
 ALL: rentals.length,
 PENDING: rentals.filter((r) => r.status === "PENDING").length,
 ACTIVE: rentals.filter((r) => r.status === "ACTIVE").length,
 EXPIRED: rentals.filter((r) => r.status === "EXPIRED").length,
 };

 // Filter di client juga untuk responsivitas
 const displayed = rentals;

 return (
 <div className="space-y-6 animate-fade-in">
 {/* Header */}
 <div>
 <h1 className="text-2xl font-black text-white">
 Konfirmasi <span className="gradient-text">Penyewaan</span>
 </h1>
 <p className="text-slate-500 text-sm mt-1">
 Kelola dan konfirmasi permintaan sewa dari pembeli
 </p>
 </div>

 {/* Success */}
 {successMsg && (
 <div className="px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
 {successMsg}
 </div>
 )}

 {/* Alert pending */}
 {counts.PENDING > 0 && (
 <div className="glass-purple p-4 flex items-center gap-3">
 <span className="text-2xl"></span>
 <p className="text-sm text-purple-200">
 <span className="font-bold">{counts.PENDING} penyewaan</span> menunggu konfirmasimu.
 Segera proses agar pembeli mendapat akses!
 </p>
 </div>
 )}

 {/* Filter + Search */}
 <div className="flex flex-col sm:flex-row gap-3">
 {/* Search */}
 <div className="relative flex-1 max-w-sm">
 <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
 fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
 d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
 </svg>
 <input
 type="text"
 className="input-dark pl-10 text-sm"
 placeholder="Cari nama / email / produk..."
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 onKeyDown={(e) => e.key === "Enter" && fetchRentals()}
 />
 </div>

 {/* Filter tabs */}
 <div className="flex gap-2 flex-wrap">
 {(["ALL", "PENDING", "ACTIVE", "EXPIRED"] as Filter[]).map((f) => (
 <button
 key={f}
 onClick={() => setFilter(f)}
 className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
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
 </div>

 {/* Tabel */}
 {loading ? (
 <div className="text-center py-20">
 <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
 </div>
 ) : displayed.length === 0 ? (
 <div className="glass text-center py-16 text-slate-500 text-sm">
 Tidak ada data penyewaan.
 </div>
 ) : (
 <div className="glass overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-sm">
 <thead>
 <tr className="border-b border-slate-800">
 {["Pembeli", "Produk", "Harga", "Status", "Tanggal", "Aksi"].map((h) => (
 <th key={h} className="text-left px-5 py-3.5 text-slate-500 font-medium whitespace-nowrap">
 {h}
 </th>
 ))}
 </tr>
 </thead>
 <tbody>
 {displayed.map((r, i) => (
 <tr
 key={r.id}
 className={`border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors ${
 i === displayed.length - 1 ? "border-0" : ""
 } ${r.status === "PENDING" ? "bg-yellow-500/3" : ""}`}
 >
 {/* Pembeli */}
 <td className="px-5 py-4">
 <p className="font-semibold text-white">{r.user.name}</p>
 <p className="text-xs text-slate-500">{r.user.email}</p>
 </td>

 {/* Produk */}
 <td className="px-5 py-4">
 <div className="flex items-center gap-2">
 <div className="w-10 h-8 rounded-lg overflow-hidden bg-slate-900 flex-shrink-0">
 {r.product.imageUrl ? (
 <Image src={r.product.imageUrl} alt={r.product.name}
 width={40} height={32} className="w-full h-full object-cover" />
 ) : (
 <div className="w-full h-full flex items-center justify-center text-sm">
 {r.product.category === "GAME" ? "" : ""}
 </div>
 )}
 </div>
 <div>
 <p className="text-slate-300 font-medium">{r.product.name}</p>
 <p className="text-xs text-slate-600">{r.product.category}</p>
 </div>
 </div>
 </td>

 {/* Harga */}
 <td className="px-5 py-4">
 <p className="font-bold gradient-text">
 Rp {Number(r.payment?.amount ?? 0).toLocaleString("id-ID")}
 </p>
 <p className={`text-xs mt-0.5 ${
 r.payment?.status === "CONFIRMED" ? "text-green-400" : "text-yellow-400"
 }`}>
 {r.payment?.status === "CONFIRMED" ? " Lunas" : "Belum dikonfirmasi"}
 </p>
 </td>

 {/* Status */}
 <td className="px-5 py-4">
 <StatusBadge status={r.status} />
 {r.status === "ACTIVE" && r.endDate && (
 <p className="text-xs text-slate-500 mt-1">
 s/d {new Date(r.endDate).toLocaleDateString("id-ID")}
 </p>
 )}
 </td>

 {/* Tanggal */}
 <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
 {new Date(r.createdAt).toLocaleDateString("id-ID", {
 day: "numeric", month: "short", year: "numeric",
 })}
 </td>

 {/* Aksi */}
 <td className="px-5 py-4">
 {r.status === "PENDING" ? (
 <button
 onClick={() => openConfirm(r)}
 className="btn-primary px-4 py-1.5 text-xs font-semibold relative z-10 animate-pulse-purple"
 >
 Konfirmasi
 </button>
 ) : r.status === "ACTIVE" && r.accessUrl ? (
 <a
 href={r.accessUrl}
 target="_blank"
 rel="noopener noreferrer"
 className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
 >
 Lihat Link →
 </a>
 ) : (
 <span className="text-xs text-slate-600">—</span>
 )}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}

 {/* ── Modal Konfirmasi ── */}
 {confirmModal && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 <div
 className="absolute inset-0 bg-black/70 backdrop-blur-sm"
 onClick={() => !processing && setConfirmModal(null)}
 />
 <div className="relative w-full max-w-md glass p-6 md:p-8 z-[51]">
 <h2 className="text-lg font-black text-white mb-1">Konfirmasi Penyewaan</h2>
 <p className="text-slate-500 text-sm mb-6">
 Berikan akses ke pembeli setelah verifikasi pembayaran.
 </p>

 {/* Info rental */}
 <div className="glass p-4 mb-5 space-y-2">
 <div className="flex justify-between text-sm">
 <span className="text-slate-500">Pembeli</span>
 <span className="text-white font-semibold">{confirmModal.user.name}</span>
 </div>
 <div className="flex justify-between text-sm">
 <span className="text-slate-500">Produk</span>
 <span className="text-white">{confirmModal.product.name}</span>
 </div>
 <div className="flex justify-between text-sm">
 <span className="text-slate-500">Harga</span>
 <span className="gradient-text font-bold">
 Rp {Number(confirmModal.payment?.amount ?? 0).toLocaleString("id-ID")}
 </span>
 </div>
 <div className="flex justify-between text-sm">
 <span className="text-slate-500">Durasi</span>
 <span className="text-white">7 hari (mulai sekarang)</span>
 </div>
 </div>

 {/* URL Akses */}
 <div className="mb-5">
 <label className="block text-xs font-medium text-slate-400 mb-1.5">
 Link Akses untuk Pembeli
 </label>
 <input
 type="url"
 className="input-dark text-sm"
 placeholder="https://username.itch.io/game atau https://github.com/..."
 value={accessUrl}
 onChange={(e) => setAccessUrl(e.target.value)}
 />
 <p className="text-xs text-slate-600 mt-1.5">
 Kosongkan untuk gunakan link default dari data produk.
 </p>
 </div>

 {errorMsg && (
 <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
 {errorMsg}
 </div>
 )}

 {/* Tombol */}
 <div className="flex gap-3">
 <button
 onClick={() => handleAction("REJECT")}
 disabled={processing}
 className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all disabled:opacity-50"
 >
 {processing ? "..." : "Tolak"}
 </button>
 <button
 onClick={() => handleAction("CONFIRM")}
 disabled={processing}
 className="flex-1 btn-primary py-2.5 text-sm font-semibold relative z-10 disabled:opacity-60"
 >
 {processing ? (
 <span className="flex items-center justify-center gap-2">
 <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
 </svg>
 Memproses...
 </span>
 ) : " Konfirmasi & Aktifkan"}
 </button>
 </div>

 <button
 onClick={() => setConfirmModal(null)}
 disabled={processing}
 className="w-full mt-3 text-center text-xs text-slate-600 hover:text-slate-400 transition-colors"
 >
 Batal
 </button>
 </div>
 </div>
 )}
 </div>
 );
}