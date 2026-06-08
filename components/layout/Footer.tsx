// components/layout/Footer.tsx
import Link from "next/link";

export default function Footer() {
 return (
 <footer className="mt-24 border-t border-slate-800/60">
 <div className="max-w-6xl mx-auto px-4 py-12">
 <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
 {/* Brand */}
 <div>
 <div className="flex items-center gap-2 mb-4">
 <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black text-white bg-[linear-gradient(135deg,#9333ea,#6d28d9)]">
 R
 </div>
 <span className="font-black text-lg tracking-tight">
 Rent<span className="gradient-text">Zone</span>
 </span>
 </div>
 <p className="text-sm text-slate-500 leading-relaxed">
 Platform penyewaan aplikasi Game & Android. Akses premium, harga terjangkau, selama 1 minggu.
 </p>
 </div>

 {/* Links */}
 <div>
 <p className="text-sm font-semibold text-slate-300 mb-4">Navigasi</p>
 <ul className="space-y-2">
 {[
 { href: "/", label: "Beranda" },
 { href: "/products", label: "Produk" },
 { href: "/cart", label: "Keranjang" },
 { href: "/rentals", label: "Penyewaan Saya" },
 ].map((l) => (
 <li key={l.href}>
 <Link
 href={l.href}
 className="text-sm text-slate-500 hover:text-purple-400 transition-colors"
 >
 {l.label}
 </Link>
 </li>
 ))}
 </ul>
 </div>

 {/* Info */}
 <div>
 <p className="text-sm font-semibold text-slate-300 mb-4">Info</p>
 <ul className="space-y-2 text-sm text-slate-500">
 <li> Akses aktif 7 hari setelah konfirmasi</li>
 <li> Game via itch.io</li>
 <li> Android via GitHub</li>
 <li> SMKN 21 Jakarta — RPL 2025/2026</li>
 </ul>
 </div>
 </div>

 <div className="mt-10 pt-6 border-t border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-4">
 <p className="text-xs text-slate-600">
 © 2026 RentZone. Dibuat untuk Projek ASAS Genap — SMKN 21 Jakarta.
 </p>
 <p className="text-xs text-slate-600">
 Konsentrasi RPL — Fase F PPLG
 </p>
 </div>
 </div>
 </footer>
 );
}