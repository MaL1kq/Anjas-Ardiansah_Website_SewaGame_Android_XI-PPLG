// app/page.tsx
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function HomePage() {
 const session = await getSession();

 // Ambil jumlah produk
 const [totalGames, totalAndroid] = await Promise.all([
 db.product.count({ where: { category: "GAME", isActive: true } }),
 db.product.count({ where: { category: "ANDROID", isActive: true } }),
 ]);

 return (
 <div className="max-w-6xl mx-auto px-4">
 {/* ── HERO ── */}
 <section className="pt-20 pb-24 text-center relative">
 {/* Glow background */}
 <div className="absolute inset-0 -z-10 pointer-events-none bg-[radial-gradient(ellipse_700px_400px_at_50%_40%,rgba(147,51,234,0.12),transparent_70%)]" />

 <div className="animate-fade-up">
 <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/25 bg-purple-500/10 text-purple-300 text-xs font-semibold mb-8 tracking-widest uppercase">
 <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse-purple" />
 Platform Penyewaan Aplikasi
 </span>
 </div>

 <h1 className="animate-fade-up delay-100 text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
 Sewa{" "}
 <span className="gradient-text-white">Game</span>
 {" & "}
 <span className="gradient-text">App</span>
 <br />
 Favorit Kamu
 </h1>

 <p className="animate-fade-up delay-200 text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
 Akses aplikasi Game dan Android premium selama{" "}
 <span className="text-purple-300 font-semibold">1 minggu penuh</span>.
 Bayar sekali, langsung dapat link akses.
 </p>

 <div className="animate-fade-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4">
 <Link
 href="/products"
 className="btn-primary px-8 py-3.5 text-base font-semibold glow-purple-sm relative z-10"
 >
 Jelajahi Produk →
 </Link>
 {!session && (
 <Link
 href="/register"
 className="btn-ghost px-8 py-3.5 text-base font-semibold"
 >
 Daftar Gratis
 </Link>
 )}
 </div>

 {/* Stats */}
 <div className="animate-fade-up delay-400 flex items-center justify-center gap-8 mt-16">
 <div className="text-center">
 <p className="text-3xl font-black gradient-text">{totalGames}+</p>
 <p className="text-sm text-slate-500 mt-1">Game</p>
 </div>
 <div className="w-px h-10 bg-slate-800" />
 <div className="text-center">
 <p className="text-3xl font-black gradient-text">{totalAndroid}+</p>
 <p className="text-sm text-slate-500 mt-1">Aplikasi Android</p>
 </div>
 <div className="w-px h-10 bg-slate-800" />
 <div className="text-center">
 <p className="text-3xl font-black gradient-text">7</p>
 <p className="text-sm text-slate-500 mt-1">Hari Akses</p>
 </div>
 </div>
 </section>

 {/* ── HOW IT WORKS ── */}
 <section className="py-20">
 <div className="text-center mb-14">
 <h2 className="text-3xl md:text-4xl font-black mb-3">
 Cara <span className="gradient-text">Kerja</span>
 </h2>
 <p className="text-slate-500">Mudah, cepat, dan terpercaya</p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
 {[
 { step: "01", icon: "", title: "Pilih Produk", desc: "Browse koleksi game dan aplikasi Android yang tersedia." },
 { step: "02", icon: "", title: "Tambah ke Keranjang", desc: "Masukkan produk yang kamu mau ke keranjang belanja." },
 { step: "03", icon: "", title: "Ajukan Peminjaman", desc: "Submit peminjaman dan tunggu konfirmasi dari admin." },
 { step: "04", icon: "", title: "Dapat Akses", desc: "Setelah dikonfirmasi, kamu langsung dapat link akses 7 hari." },
 ].map((item, i) => (
 <div key={i} className="glass p-6 relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
 <div className="absolute top-0 right-0 text-6xl font-black opacity-5 select-none pointer-events-none text-[#a855f7]">
 {item.step}
 </div>
 <div className="text-3xl mb-4">{item.icon}</div>
 <h3 className="font-bold text-white mb-2">{item.title}</h3>
 <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
 </div>
 ))}
 </div>
 </section>

 {/* ── FEATURES ── */}
 <section className="py-20">
 <div className="glass-purple p-10 md:p-14 text-center relative overflow-hidden">
 {/* Decorative glow */}
 <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_500px_300px_at_50%_100%,rgba(147,51,234,0.15),transparent_60%)]" />

 <h2 className="text-3xl md:text-5xl font-black mb-4 relative z-10">
 Siap <span className="gradient-text">Mulai</span>?
 </h2>
 <p className="text-slate-400 text-lg mb-8 relative z-10 max-w-xl mx-auto">
 Daftar sekarang dan nikmati akses ke ratusan aplikasi game dan Android.
 </p>
 <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
 <Link
 href={session ? "/products" : "/register"}
 className="btn-primary px-10 py-3.5 text-base font-semibold glow-purple relative z-10"
 >
 {session ? "Lihat Produk →" : "Daftar Sekarang →"}
 </Link>
 </div>
 </div>
 </section>
 </div>
 );
}