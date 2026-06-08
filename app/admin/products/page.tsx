"use client";
// app/admin/products/page.tsx

import { useEffect, useState } from "react";
import Image from "next/image";

type Product = {
 id: string;
 name: string;
 description: string;
 price: number;
 imageUrl: string | null;
 category: "GAME" | "ANDROID";
 itchioUrl: string | null;
 githubUrl: string | null;
 isActive: boolean;
 createdAt: string;
};

type FormData = {
 name: string;
 description: string;
 price: string;
 imageUrl: string;
 category: "GAME" | "ANDROID";
 itchioUrl: string;
 githubUrl: string;
};

const EMPTY_FORM: FormData = {
 name: "", description: "", price: "",
 imageUrl: "", category: "GAME",
 itchioUrl: "", githubUrl: "",
};

export default function AdminProductsPage() {
 const [products, setProducts] = useState<Product[]>([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState("");
 const [modalOpen, setModalOpen] = useState(false);
 const [editTarget, setEditTarget] = useState<Product | null>(null);
 const [form, setForm] = useState<FormData>(EMPTY_FORM);
 const [saving, setSaving] = useState(false);
 const [deleting, setDeleting] = useState<string | null>(null);
 const [error, setError] = useState("");
 const [successMsg, setSuccessMsg] = useState("");

 async function fetchProducts() {
 try {
 const res = await fetch("/api/products?all=true");
 const data = await res.json();
 setProducts(Array.isArray(data) ? data : []);
 } catch { console.error("Gagal fetch products"); }
 finally { setLoading(false); }
 }

 useEffect(() => { fetchProducts(); }, []);

 function openAdd() {
 setEditTarget(null);
 setForm(EMPTY_FORM);
 setError("");
 setModalOpen(true);
 }

 function openEdit(p: Product) {
 setEditTarget(p);
 setForm({
 name: p.name,
 description: p.description,
 price: String(p.price),
 imageUrl: p.imageUrl ?? "",
 category: p.category,
 itchioUrl: p.itchioUrl ?? "",
 githubUrl: p.githubUrl ?? "",
 });
 setError("");
 setModalOpen(true);
 }

 async function handleSave() {
 if (!form.name || !form.description || !form.price) {
 setError("Nama, deskripsi, dan harga wajib diisi.");
 return;
 }
 setSaving(true);
 setError("");

 try {
 const payload = {
 ...form,
 price: parseFloat(form.price),
 imageUrl: form.imageUrl || null,
 itchioUrl: form.itchioUrl || null,
 githubUrl: form.githubUrl || null,
 };

 const res = editTarget
 ? await fetch(`/api/products/${editTarget.id}`, {
 method: "PUT",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify(payload),
 })
 : await fetch("/api/products", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify(payload),
 });

 if (!res.ok) {
 const d = await res.json();
 setError(d.error || "Gagal menyimpan.");
 return;
 }

 setModalOpen(false);
 setSuccessMsg(editTarget ? "Produk berhasil diperbarui!" : "Produk berhasil ditambahkan!");
 setTimeout(() => setSuccessMsg(""), 3000);
 fetchProducts();
 } catch {
 setError("Terjadi kesalahan.");
 } finally {
 setSaving(false);
 }
 }

 async function handleDelete(id: string) {
 if (!confirm("Yakin ingin menghapus produk ini?")) return;
 setDeleting(id);
 try {
 await fetch(`/api/products/${id}`, { method: "DELETE" });
 setSuccessMsg("Produk berhasil dihapus.");
 setTimeout(() => setSuccessMsg(""), 3000);
 fetchProducts();
 } catch { console.error("Delete failed"); }
 finally { setDeleting(null); }
 }

 const filtered = products.filter((p) =>
 p.name.toLowerCase().includes(search.toLowerCase())
 );

 return (
 <div className="space-y-6 animate-fade-in">
 {/* Header */}
 <div className="flex items-center justify-between flex-wrap gap-4">
 <div>
 <h1 className="text-2xl font-black text-white">
 Kelola <span className="gradient-text">Produk</span>
 </h1>
 <p className="text-slate-500 text-sm mt-1">{products.length} produk terdaftar</p>
 </div>
 <button onClick={openAdd} className="btn-primary px-5 py-2.5 text-sm font-semibold relative z-10 glow-purple-sm">
 + Tambah Produk
 </button>
 </div>

 {/* Success */}
 {successMsg && (
 <div className="px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
 {successMsg}
 </div>
 )}

 {/* Search */}
 <div className="relative max-w-sm">
 <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
 fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
 d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
 </svg>
 <input
 type="text"
 className="input-dark pl-10 text-sm"
 placeholder="Cari produk..."
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 />
 </div>

 {/* Tabel */}
 {loading ? (
 <div className="text-center py-20">
 <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
 </div>
 ) : filtered.length === 0 ? (
 <div className="glass text-center py-16 text-slate-500">
 {search ? "Produk tidak ditemukan." : "Belum ada produk. Tambahkan sekarang!"}
 </div>
 ) : (
 <div className="glass overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-sm">
 <thead>
 <tr className="border-b border-slate-800">
 {["Produk", "Kategori", "Harga", "Link", "Aksi"].map((h) => (
 <th key={h} className="text-left px-5 py-3.5 text-slate-500 font-medium whitespace-nowrap">
 {h}
 </th>
 ))}
 </tr>
 </thead>
 <tbody>
 {filtered.map((p, i) => (
 <tr
 key={p.id}
 className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${
 i === filtered.length - 1 ? "border-0" : ""
 }`}
 >
 {/* Produk */}
 <td className="px-5 py-4">
 <div className="flex items-center gap-3">
 <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-900 flex-shrink-0">
 {p.imageUrl ? (
 <Image src={p.imageUrl} alt={p.name} width={48} height={40}
 className="w-full h-full object-cover" />
 ) : (
 <div className="w-full h-full flex items-center justify-center text-lg">
 {p.category === "GAME" ? "" : ""}
 </div>
 )}
 </div>
 <div>
 <p className="font-semibold text-white">{p.name}</p>
 <p className="text-xs text-slate-500 line-clamp-1 max-w-[180px]">
 {p.description}
 </p>
 </div>
 </div>
 </td>

 {/* Kategori */}
 <td className="px-5 py-4">
 <span className={p.category === "GAME" ? "badge-game" : "badge-android"}>
 {p.category === "GAME" ? " Game" : " Android"}
 </span>
 </td>

 {/* Harga */}
 <td className="px-5 py-4">
 <span className="font-bold gradient-text">
 Rp {Number(p.price).toLocaleString("id-ID")}
 </span>
 <p className="text-xs text-slate-600">/minggu</p>
 </td>

 {/* Link */}
 <td className="px-5 py-4">
 <div className="flex flex-col gap-1">
 {p.itchioUrl && (
 <a href={p.itchioUrl} target="_blank" rel="noopener noreferrer"
 className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
 itch.io
 </a>
 )}
 {p.githubUrl && (
 <a href={p.githubUrl} target="_blank" rel="noopener noreferrer"
 className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
 GitHub
 </a>
 )}
 {!p.itchioUrl && !p.githubUrl && (
 <span className="text-xs text-slate-600">—</span>
 )}
 </div>
 </td>

 {/* Aksi */}
 <td className="px-5 py-4">
 <div className="flex gap-2">
 <button
 onClick={() => openEdit(p)}
 className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
 >
 Edit
 </button>
 <button
 onClick={() => handleDelete(p.id)}
 disabled={deleting === p.id}
 className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50"
 >
 {deleting === p.id ? "..." : "Hapus"}
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}

 {/* ── Modal Tambah / Edit ── */}
 {modalOpen && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 {/* Overlay */}
 <div
 className="absolute inset-0 bg-black/70 backdrop-blur-sm"
 onClick={() => setModalOpen(false)}
 />

 {/* Modal card */}
 <div className="relative w-full max-w-lg glass p-6 md:p-8 max-h-[90vh] overflow-y-auto z-[51]">
 <div className="flex items-center justify-between mb-6">
 <h2 className="text-lg font-black text-white">
 {editTarget ? "Edit Produk" : "Tambah Produk Baru"}
 </h2>
 <button
 onClick={() => setModalOpen(false)}
 aria-label="Tutup"
 className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
 >
   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
 </button>
 </div>

 {error && (
 <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
 {error}
 </div>
 )}

 <div className="space-y-4">
 {/* Nama */}
 <div>
 <label className="block text-xs font-medium text-slate-400 mb-1.5">
 Nama Produk <span className="text-red-400">*</span>
 </label>
 <input type="text" className="input-dark text-sm"
 placeholder="Nama aplikasi / game"
 value={form.name}
 onChange={(e) => setForm({ ...form, name: e.target.value })}
 />
 </div>

 {/* Deskripsi */}
 <div>
 <label className="block text-xs font-medium text-slate-400 mb-1.5">
 Deskripsi <span className="text-red-400">*</span>
 </label>
 <textarea
 rows={3}
 className="input-dark text-sm resize-none"
 placeholder="Deskripsi singkat produk..."
 value={form.description}
 onChange={(e) => setForm({ ...form, description: e.target.value })}
 />
 </div>

 {/* Harga + Kategori */}
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-xs font-medium text-slate-400 mb-1.5">
 Harga (Rp) <span className="text-red-400">*</span>
 </label>
 <input type="number" min="0" className="input-dark text-sm"
 placeholder="15000"
 value={form.price}
 onChange={(e) => setForm({ ...form, price: e.target.value })}
 />
 </div>
 <div>
 <label htmlFor="product-category" className="block text-xs font-medium text-slate-400 mb-1.5">
 Kategori <span className="text-red-400">*</span>
 </label>
 <select
 id="product-category"
 className="input-dark text-sm"
 value={form.category}
 onChange={(e) => setForm({ ...form, category: e.target.value as "GAME" | "ANDROID" })}
 >
 <option value="GAME"> Game</option>
 <option value="ANDROID"> Android</option>
 </select>
 </div>
 </div>

 {/* Image URL */}
 <div>
 <label className="block text-xs font-medium text-slate-400 mb-1.5">
 URL Gambar (opsional)
 </label>
 <input type="url" className="input-dark text-sm"
 placeholder="https://..."
 value={form.imageUrl}
 onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
 />
 </div>

 {/* itch.io URL */}
 <div>
 <label className="block text-xs font-medium text-slate-400 mb-1.5">
 Link itch.io {form.category === "GAME" && <span className="text-purple-400">(untuk game)</span>}
 </label>
 <input type="url" className="input-dark text-sm"
 placeholder="https://username.itch.io/game-name"
 value={form.itchioUrl}
 onChange={(e) => setForm({ ...form, itchioUrl: e.target.value })}
 />
 </div>

 {/* GitHub URL */}
 <div>
 <label className="block text-xs font-medium text-slate-400 mb-1.5">
 Link GitHub {form.category === "ANDROID" && <span className="text-purple-400">(untuk android)</span>}
 </label>
 <input type="url" className="input-dark text-sm"
 placeholder="https://github.com/username/repo"
 value={form.githubUrl}
 onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
 />
 </div>
 </div>

 {/* Tombol */}
 <div className="flex gap-3 mt-6">
 <button
 onClick={() => setModalOpen(false)}
 className="flex-1 btn-ghost py-2.5 text-sm font-semibold"
 >
 Batal
 </button>
 <button
 onClick={handleSave}
 disabled={saving}
 className="flex-1 btn-primary py-2.5 text-sm font-semibold relative z-10 disabled:opacity-60"
 >
 {saving ? "Menyimpan..." : editTarget ? "Simpan Perubahan" : "Tambahkan"}
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}