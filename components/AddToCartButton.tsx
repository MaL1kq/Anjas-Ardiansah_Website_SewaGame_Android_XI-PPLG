"use client";
// components/AddToCartButton.tsx

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
 productId: string;
 isLoggedIn: boolean;
};

export default function AddToCartButton({ productId, isLoggedIn }: Props) {
 const router = useRouter();
 const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
 const [message, setMessage] = useState("");

 async function handleAdd() {
 if (!isLoggedIn) {
 router.push("/login");
 return;
 }

 setState("loading");

 try {
 const res = await fetch("/api/cart", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ productId }),
 });

 const data = await res.json();

 if (res.ok) {
 setState("success");
 setMessage("Berhasil ditambahkan ke keranjang!");
 } else {
 setState("error");
 setMessage(data.error || "Gagal menambahkan.");
 }
 } catch {
 setState("error");
 setMessage("Terjadi kesalahan.");
 }
 }

 if (state === "success") {
 return (
 <div className="space-y-3">
 <div className="glass p-4 text-center rounded-xl border border-green-500/20 bg-green-500/5">
 <p className="text-green-400 font-semibold text-sm"> {message}</p>
 </div>
 <a
 href="/cart"
 className="block w-full text-center btn-primary py-3 text-sm font-semibold relative z-10"
 >
 Lihat Keranjang →
 </a>
 </div>
 );
 }

 return (
 <div className="space-y-3">
 {state === "error" && (
 <p className="text-red-400 text-sm text-center">{message}</p>
 )}
 <button
 onClick={handleAdd}
 disabled={state === "loading"}
 className="w-full btn-primary py-3.5 text-base font-semibold relative z-10 disabled:opacity-60 glow-purple-sm"
 >
 {state === "loading" ? (
 <span className="flex items-center justify-center gap-2">
 <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
 </svg>
 Menambahkan...
 </span>
 ) : (
 " Tambah ke Keranjang"
 )}
 </button>
 {!isLoggedIn && (
 <p className="text-xs text-slate-600 text-center">
 Kamu perlu{" "}
 <a href="/login" className="text-purple-400 hover:underline">masuk</a>{" "}
 terlebih dahulu
 </p>
 )}
 </div>
 );
}