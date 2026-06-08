"use client";
// components/admin/AdminSidebar.tsx

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { JWTPayload } from "@/lib/auth";

type Props = { session: JWTPayload };

const NAV = [
 { href: "/admin", icon: "", label: "Dashboard" },
 { href: "/admin/products", icon: "", label: "Kelola Produk" },
 { href: "/admin/rentals", icon: "", label: "Konfirmasi Sewa" },
];

export default function AdminSidebar({ session }: Props) {
 const pathname = usePathname();
 const router = useRouter();
 const [open, setOpen] = useState(false);

 async function handleLogout() {
 await fetch("/api/auth/logout", { method: "POST" });
 router.refresh();
 router.push("/");
 }

 function isActive(href: string) {
 if (href === "/admin") return pathname === "/admin";
 return pathname.startsWith(href);
 }

 const SidebarContent = () => (
 <div className="flex flex-col h-full">
 {/* Logo */}
 <div className="px-6 py-5 border-b border-slate-800">
 <Link href="/" className="flex items-center gap-2">
 <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-sm bg-[linear-gradient(135deg,#9333ea,#6d28d9)]">R</div>
 <span className="font-black text-lg tracking-tight">
 Rent<span className="gradient-text">Zone</span>
 </span>
 </Link>
 <span className="mt-2 inline-block text-xs px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/20 font-semibold">
 Admin Panel
 </span>
 </div>

 {/* Nav */}
 <nav className="flex-1 px-4 py-6 space-y-1">
 {NAV.map((item) => (
 <Link
 key={item.href}
 href={item.href}
 onClick={() => setOpen(false)}
 className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
 isActive(item.href)
 ? "bg-purple-500/15 text-purple-300 border border-purple-500/20"
 : "text-slate-400 hover:text-white hover:bg-slate-800/60"
 }`}
 >
 <span>{item.icon}</span>
 {item.label}
 </Link>
 ))}
 </nav>

 {/* User info + logout */}
 <div className="px-4 py-5 border-t border-slate-800">
 <div className="flex items-center gap-3 mb-3 px-2">
 <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0 bg-[linear-gradient(135deg,#9333ea,#6d28d9)]">
 {session.name.charAt(0).toUpperCase()}
 </div>
 <div className="min-w-0">
 <p className="text-sm font-semibold text-white truncate">{session.name}</p>
 <p className="text-xs text-slate-500 truncate">{session.email}</p>
 </div>
 </div>
 <button
 onClick={handleLogout}
 className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
 >
 Keluar
 </button>
 </div>
 </div>
 );

 return (
 <>
 {/* Mobile toggle */}
 <button
 onClick={() => setOpen(!open)}
 className="fixed top-4 left-4 z-50 md:hidden glass p-2 rounded-xl"
 >
 {open
 ? <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
 : <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
 }
 </button>

 {/* Mobile overlay */}
 {open && (
 <div
 className="fixed inset-0 bg-black/60 z-40 md:hidden"
 onClick={() => setOpen(false)}
 />
 )}

 {/* Mobile drawer */}
 <aside
 className={`fixed top-0 left-0 h-full w-64 z-50 md:hidden transition-transform duration-300 bg-[rgba(2,6,23,0.98)] backdrop-blur-[20px] border-r border-slate-800 ${
 open ? "translate-x-0" : "-translate-x-full"
 }`}
 >
 <SidebarContent />
 </aside>

 {/* Desktop sidebar */}
 <aside
 className="hidden md:flex flex-col fixed top-0 left-0 h-full w-64 bg-[rgba(2,6,23,0.95)] backdrop-blur-[20px] border-r border-slate-800"
 >
 <SidebarContent />
 </aside>
 </>
 );
}