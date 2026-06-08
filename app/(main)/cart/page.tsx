"use client";
// app/(main)/cart/page.tsx

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type CartItem = {
 id: string;
 product: {
 id: string;
 name: string;
 description: string;
 price: number;
 imageUrl: string | null;
 category: "GAME" | "ANDROID";
 };
};

export default function CartPage() {
 const router = useRouter();
 const [items, setItems] = useState<CartItem[]>([]);
 const [loading, setLoading] = useState(true);
 const [selected, setSelected] = useState<string[]>([]);
 const [checkingOut, setCheckingOut] = useState(false);
 const [message, setMessage] = useState("");
 const [removing, setRemoving] = useState<string | null>(null);

 async function fetchCart() {
 try {
 const res = await fetch("/api/cart");
 if (res.ok) {
 const data = await res.json();
 setItems(data);
 setSelected(data.map((i: CartItem) => i.id));
 }
 } catch {
 console.error("Gagal fetch cart");
 } finally {
 setLoading(false);
 }
 }

 useEffect(() => { fetchCart(); }, []);

 function toggleSelect(id: string) {
 setSelected((prev) =>
 prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
 );
 }

 function toggleAll() {
 if (selected.length === items.length) setSelected([]);
 else setSelected(items.map((i) => i.id));
 }

 async function removeItem(cartId: string) {
 setRemoving(cartId);
 try {
 const res = await fetch(`/api/cart?cartId=${cartId}`, { method: "DELETE" });
 if (res.ok) {
 setItems((prev) => prev.filter((i) => i.id !== cartId));
 setSelected((prev) => prev.filter((x) => x !== cartId));
 }
 } catch { /* ignore */ } finally {
 setRemoving(null);
 }
 }

 async function handleCheckout() {
 if (selected.length === 0) return;
 setCheckingOut(true);
 setMessage("");

 try {
 const res = await fetch("/api/rentals", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ cartIds: selected }),
 });

 const data = await res.json();

 if (res.ok) {
 setMessage(data.message);
 setTimeout(() => router.push("/rentals"), 2000);
 } else {
 setMessage(data.error || "Checkout gagal.");
 }
 } catch {
 setMessage("Terjadi kesalahan saat checkout.");
 } finally {
 setCheckingOut(false);
 }
 }

 const selectedItems = items.filter((i) => selected.includes(i.id));
 const total = selectedItems.reduce((sum, i) => sum + Number(i.product.price), 0);

 return (
 <div className="max-w-5xl mx-auto px-4 py-10">
 <h1 className="text-3xl font-black text-white mb-8">
 Keranjang <span className="gradient-text">Belanja</span>
 </h1>

 {loading ? (
 <div className="text-center py-24">
 <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
 <p className="text-slate-500">Memuat keranjang...</p>
 </div>
 ) : items.length === 0 ? (
 <div className="text-center py-24">
 <div className="text-6xl mb-4"></div>
 <h3 className="text-xl font-bold text-white mb-2">Keranjang masih kosong</h3>
 <p className="text-slate-500 mb-6">Tambahkan produk yang ingin kamu sewa.</p>
 <Link href="/products" className="btn-primary px-8 py-3 text-sm font-semibold relative z-10">
 Lihat Produk
 </Link>
 </div>
 ) : (
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* Daftar item */}
 <div className="lg:col-span-2 space-y-4">
 {/* Select all */}
 <div className="flex items-center gap-3 px-1">
 <input
 type="checkbox"
 id="selectAll"
 checked={selected.length === items.length && items.length > 0}
 onChange={toggleAll}
 className="w-4 h-4 accent-purple-500 cursor-pointer"
 />
 <label htmlFor="selectAll" className="text-sm text-slate-400 cursor-pointer">
 Pilih semua ({items.length} item)
 </label>
 </div>

 {items.map((item) => (
 <div
 key={item.id}
 className={`glass p-4 flex gap-4 items-start transition-all duration-200 ${
 selected.includes(item.id) ? "border-purple-500/30" : "opacity-60"
 }`}
 >
 {/* Checkbox */}
 <input
 type="checkbox"
 aria-label={`Pilih ${item.product.name}`}
 checked={selected.includes(item.id)}
 onChange={() => toggleSelect(item.id)}
 className="w-4 h-4 accent-purple-500 cursor-pointer mt-1 flex-shrink-0"
 />

 {/* Gambar */}
 <div className="w-20 h-16 rounded-lg overflow-hidden bg-slate-900 flex-shrink-0">
 {item.product.imageUrl ? (
 <Image
 src={item.product.imageUrl}
 alt={item.product.name}
 width={80} height={64}
 className="w-full h-full object-cover"
 />
 ) : (
 <div className="w-full h-full flex items-center justify-center text-2xl">
 {item.product.category === "GAME" ? "" : ""}
 </div>
 )}
 </div>

 {/* Info */}
 <div className="flex-1 min-w-0">
 <div className="flex items-start justify-between gap-2">
 <div>
 <span className={`text-xs ${item.product.category === "GAME" ? "badge-game" : "badge-android"} mb-1 inline-block`}>
 {item.product.category === "GAME" ? " Game" : " Android"}
 </span>
 <h3 className="font-semibold text-white text-sm line-clamp-1">
 {item.product.name}
 </h3>
 <p className="text-slate-500 text-xs line-clamp-1 mt-0.5">
 {item.product.description}
 </p>
 </div>
 <p className="text-base font-black gradient-text flex-shrink-0">
 Rp {Number(item.product.price).toLocaleString("id-ID")}
 </p>
 </div>
 <div className="flex items-center justify-between mt-3">
 <p className="text-xs text-slate-600">Durasi: 7 hari akses</p>
 <button
 onClick={() => removeItem(item.id)}
 disabled={removing === item.id}
 className="text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
 >
 {removing === item.id ? "Menghapus..." : " Hapus"}
 </button>
 </div>
 </div>
 </div>
 ))}
 </div>

 {/* Ringkasan */}
 <div className="lg:col-span-1">
 <div className="glass p-6 sticky top-24">
 <h2 className="font-bold text-white mb-5">Ringkasan Pesanan</h2>

 <div className="space-y-3 mb-5">
 {selectedItems.map((item) => (
 <div key={item.id} className="flex justify-between text-sm">
 <span className="text-slate-400 truncate max-w-[140px]">
 {item.product.name}
 </span>
 <span className="text-slate-300 flex-shrink-0 ml-2">
 Rp {Number(item.product.price).toLocaleString("id-ID")}
 </span>
 </div>
 ))}
 </div>

 <div className="border-t border-slate-800 pt-4 mb-6">
 <div className="flex justify-between items-center">
 <span className="text-slate-400 text-sm">Total ({selectedItems.length} item)</span>
 <span className="text-xl font-black gradient-text">
 Rp {total.toLocaleString("id-ID")}
 </span>
 </div>
 <p className="text-xs text-slate-600 mt-1">
 Akses aktif setelah konfirmasi admin
 </p>
 </div>

 {message && (
 <div className={`mb-4 px-4 py-3 rounded-xl text-sm text-center ${
 message.includes("berhasil")
 ? "bg-green-500/10 border border-green-500/20 text-green-400"
 : "bg-red-500/10 border border-red-500/20 text-red-400"
 }`}>
 {message}
 </div>
 )}

 <button
 onClick={handleCheckout}
 disabled={selected.length === 0 || checkingOut}
 className="w-full btn-primary py-3 text-sm font-semibold relative z-10 disabled:opacity-40 glow-purple-sm"
 >
 {checkingOut ? (
 <span className="flex items-center justify-center gap-2">
 <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
 </svg>
 Memproses...
 </span>
 ) : (
 `Ajukan Penyewaan (${selected.length})`
 )}
 </button>

 <p className="text-xs text-slate-600 text-center mt-3">
 Pembayaran diverifikasi manual oleh admin
 </p>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}