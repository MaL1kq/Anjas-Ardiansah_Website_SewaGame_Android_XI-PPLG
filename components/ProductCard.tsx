"use client";
// components/ProductCard.tsx

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Product = {
 id: string;
 name: string;
 description: string;
 price: number | string;
 imageUrl?: string | null;
 category: "GAME" | "ANDROID";
 itchioUrl?: string | null;
 githubUrl?: string | null;
};

type Props = {
 product: Product;
 isLoggedIn: boolean;
};

export default function ProductCard({ product, isLoggedIn }: Props) {
 const [adding, setAdding] = useState(false);
 const [added, setAdded] = useState(false);
 const [error, setError] = useState("");

 async function handleAddToCart() {
 if (!isLoggedIn) {
 window.location.href = "/login";
 return;
 }

 setAdding(true);
 setError("");

 try {
 const res = await fetch("/api/cart", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ productId: product.id }),
 });

 if (res.ok) {
 setAdded(true);
 setTimeout(() => setAdded(false), 2000);
 } else {
 const data = await res.json();
 setError(data.error || "Gagal menambahkan.");
 setTimeout(() => setError(""), 3000);
 }
 } catch {
 setError("Terjadi kesalahan.");
 setTimeout(() => setError(""), 3000);
 } finally {
 setAdding(false);
 }
 }

 const price = typeof product.price === "string"
 ? parseFloat(product.price)
 : product.price;

 return (
 <div className="glass group hover:border-purple-500/30 transition-all duration-300 overflow-hidden flex flex-col">
 {/* Gambar */}
 <Link href={`/products/${product.id}`} className="block relative overflow-hidden">
 <div className="aspect-video bg-slate-900 relative">
 {product.imageUrl ? (
 <Image
 src={product.imageUrl}
 alt={product.name}
 fill
 className="object-cover group-hover:scale-105 transition-transform duration-500"
 />
 ) : (
 <div className="absolute inset-0 flex items-center justify-center">
 <span className="text-5xl">
 {product.category === "GAME" ? "" : ""}
 </span>
 </div>
 )}
 {/* Overlay gradient */}
 <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 </div>

 {/* Badge kategori */}
 <div className="absolute top-3 left-3">
 <span className={product.category === "GAME" ? "badge-game" : "badge-android"}>
 {product.category === "GAME" ? " Game" : " Android"}
 </span>
 </div>
 </Link>

 {/* Konten */}
 <div className="p-5 flex flex-col flex-1">
 <Link href={`/products/${product.id}`}>
 <h3 className="font-bold text-white mb-1.5 line-clamp-1 group-hover:text-purple-300 transition-colors">
 {product.name}
 </h3>
 </Link>
 <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1 leading-relaxed">
 {product.description}
 </p>

 <div className="flex items-center justify-between gap-3">
 {/* Harga */}
 <div>
 <p className="text-xs text-slate-600 mb-0.5">Harga sewa / minggu</p>
 <p className="text-lg font-black gradient-text">
 Rp {price.toLocaleString("id-ID")}
 </p>
 </div>

 {/* Tombol */}
 <button
 onClick={handleAddToCart}
 disabled={adding}
 className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 relative z-10 flex-shrink-0 ${
 added
 ? "bg-green-500/15 text-green-400 border border-green-500/30"
 : error
 ? "bg-red-500/15 text-red-400 border border-red-500/30"
 : "btn-primary"
 } disabled:opacity-60`}
 >
 {adding ? "..." : added ? " Ditambah" : error ? "Gagal" : "+ Keranjang"}
 </button>
 </div>

 {error && (
 <p className="text-xs text-red-400 mt-2">{error}</p>
 )}
 </div>
 </div>
 );
}