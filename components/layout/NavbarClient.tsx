"use client";
// components/layout/NavbarClient.tsx

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { JWTPayload } from "@/lib/auth";

type Props = { session: JWTPayload | null };

const NAV_LINKS = [
 { href: "/", label: "Beranda" },
 { href: "/products", label: "Produk" },
];

const AUTH_LINKS = [
 { href: "/cart", label: "Keranjang", icon: "" },
 { href: "/rentals", label: "Penyewaan Saya", icon: "" },
];

export default function NavbarClient({ session }: Props) {
 const pathname = usePathname();
 const router = useRouter();
 const [menuOpen, setMenuOpen] = useState(false);
 const [userMenuOpen, setUserMenuOpen] = useState(false);

 async function handleLogout() {
 await fetch("/api/auth/logout", { method: "POST" });
 router.refresh();
 router.push("/");
 }

 function isActive(href: string) {
 if (href === "/") return pathname === "/";
 return pathname.startsWith(href);
 }

 return (
 <header className="fixed top-0 left-0 right-0 z-50">
 {/* Glass navbar */}
 <div className="mx-4 mt-3 rounded-2xl border border-slate-800 px-5 py-3 flex items-center justify-between bg-[rgba(2,6,23,0.85)] backdrop-blur-[20px]">
 {/* ── Logo ── */}
 <Link href="/" className="flex items-center gap-2 select-none">
 <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black bg-[linear-gradient(135deg,#9333ea,#6d28d9)]">
 R
 </div>
 <span className="font-black text-lg tracking-tight">
 Rent<span className="gradient-text">Zone</span>
 </span>
 </Link>

 {/* ── Desktop Nav ── */}
 <nav className="hidden md:flex items-center gap-1">
 {NAV_LINKS.map((link) => (
 <Link
 key={link.href}
 href={link.href}
 className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
 isActive(link.href)
 ? "bg-purple-500/15 text-purple-300 border border-purple-500/20"
 : "text-slate-400 hover:text-white hover:bg-slate-800/60"
 }`}
 >
 {link.label}
 </Link>
 ))}

 {session &&
 AUTH_LINKS.map((link) => (
 <Link
 key={link.href}
 href={link.href}
 className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
 isActive(link.href)
 ? "bg-purple-500/15 text-purple-300 border border-purple-500/20"
 : "text-slate-400 hover:text-white hover:bg-slate-800/60"
 }`}
 >
 <span>{link.icon}</span>
 {link.label}
 </Link>
 ))}

 {session?.role === "ADMIN" && (
 <Link
 href="/admin"
 className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
 isActive("/admin")
 ? "bg-purple-500/15 text-purple-300 border border-purple-500/20"
 : "text-slate-400 hover:text-white hover:bg-slate-800/60"
 }`}
 >
 Admin
 </Link>
 )}
 </nav>

 {/* ── Right Side ── */}
 <div className="hidden md:flex items-center gap-3">
 {session ? (
 <div className="relative">
 <button
 onClick={() => setUserMenuOpen(!userMenuOpen)}
 className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-purple-500/30 transition-all duration-200"
 >
 <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-[linear-gradient(135deg,#9333ea,#6d28d9)]">
 {session.name.charAt(0).toUpperCase()}
 </div>
 <span className="text-sm text-slate-300 max-w-[100px] truncate">
 {session.name}
 </span>
 <svg
 className={`w-3 h-3 text-slate-500 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
 fill="none" viewBox="0 0 24 24" stroke="currentColor"
 >
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
 </svg>
 </button>

 {userMenuOpen && (
 <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-700 overflow-hidden z-50 bg-[rgba(15,23,42,0.95)] backdrop-blur-[20px]">
 <div className="px-4 py-3 border-b border-slate-700">
 <p className="text-xs text-slate-500">Masuk sebagai</p>
 <p className="text-sm font-semibold text-white truncate">{session.email}</p>
 </div>
 <button
 onClick={handleLogout}
 className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
 >
 Keluar
 </button>
 </div>
 )}
 </div>
 ) : (
 <>
 <Link href="/login" className="btn-ghost text-sm py-2 px-4">
 Masuk
 </Link>
 <Link
 href="/register"
 className="btn-primary text-sm py-2 px-4 relative z-10"
 >
 Daftar
 </Link>
 </>
 )}
 </div>

 {/* ── Mobile Hamburger ── */}
 <button
 onClick={() => setMenuOpen(!menuOpen)}
 className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
 >
 {menuOpen ? (
 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 ) : (
 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
 </svg>
 )}
 </button>
 </div>

 {/* ── Mobile Menu ── */}
 {menuOpen && (
 <div className="mx-4 mt-1 rounded-2xl border border-slate-800 p-4 flex flex-col gap-2 md:hidden bg-[rgba(2,6,23,0.95)] backdrop-blur-[20px]">
 {NAV_LINKS.map((link) => (
 <Link
 key={link.href}
 href={link.href}
 onClick={() => setMenuOpen(false)}
 className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
 isActive(link.href)
 ? "bg-purple-500/15 text-purple-300"
 : "text-slate-400 hover:text-white hover:bg-slate-800/60"
 }`}
 >
 {link.label}
 </Link>
 ))}

 {session &&
 AUTH_LINKS.map((link) => (
 <Link
 key={link.href}
 href={link.href}
 onClick={() => setMenuOpen(false)}
 className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
 isActive(link.href)
 ? "bg-purple-500/15 text-purple-300"
 : "text-slate-400 hover:text-white hover:bg-slate-800/60"
 }`}
 >
 {link.icon} {link.label}
 </Link>
 ))}

 {session?.role === "ADMIN" && (
 <Link
 href="/admin"
 onClick={() => setMenuOpen(false)}
 className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
 >
 Admin
 </Link>
 )}

 <div className="border-t border-slate-800 pt-2 mt-1">
 {session ? (
 <button
 onClick={() => { handleLogout(); setMenuOpen(false); }}
 className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
 >
 Keluar
 </button>
 ) : (
 <div className="flex gap-2">
 <Link href="/login" onClick={() => setMenuOpen(false)}
 className="flex-1 text-center btn-ghost text-sm py-2">Masuk</Link>
 <Link href="/register" onClick={() => setMenuOpen(false)}
 className="flex-1 text-center btn-primary text-sm py-2 relative z-10">Daftar</Link>
 </div>
 )}
 </div>
 </div>
 )}
 </header>
 );
}