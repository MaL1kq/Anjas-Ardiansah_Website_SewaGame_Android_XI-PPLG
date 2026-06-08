"use client";
// components/ProductSearch.tsx

import { useRouter, usePathname } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
 currentSearch: string;
 currentCategory: string;
};

const CATEGORIES = [
 { value: "", label: "Semua" },
 { value: "GAME", label: " Game" },
 { value: "ANDROID", label: " Android" },
];

export default function ProductSearch({ currentSearch, currentCategory }: Props) {
 const router = useRouter();
 const pathname = usePathname();
 const [isPending, startTransition] = useTransition();
 const [search, setSearch] = useState(currentSearch);

 function updateParams(newSearch: string, newCategory: string) {
 const params = new URLSearchParams();
 if (newSearch) params.set("search", newSearch);
 if (newCategory) params.set("category", newCategory);
 startTransition(() => {
 router.push(`${pathname}?${params.toString()}`);
 });
 }

 function handleSearch(e: React.FormEvent) {
 e.preventDefault();
 updateParams(search, currentCategory);
 }

 function handleCategory(val: string) {
 updateParams(search, val);
 }

 return (
 <div className="space-y-4">
 {/* Search bar */}
 <form onSubmit={handleSearch} className="flex gap-3">
 <div className="relative flex-1">
 <svg
 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
 fill="none" viewBox="0 0 24 24" stroke="currentColor"
 >
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
 d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
 </svg>
 <input
 type="text"
 className="input-dark pl-10"
 placeholder="Cari nama atau deskripsi produk..."
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 />
 </div>
 <button
 type="submit"
 disabled={isPending}
 className="btn-primary px-6 py-2.5 text-sm font-semibold relative z-10 disabled:opacity-60"
 >
 {isPending ? "..." : "Cari"}
 </button>
 </form>

 {/* Filter kategori */}
 <div className="flex items-center gap-2 flex-wrap">
 <span className="text-xs text-slate-600 mr-1">Filter:</span>
 {CATEGORIES.map((cat) => (
 <button
 key={cat.value}
 onClick={() => handleCategory(cat.value)}
 className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
 currentCategory === cat.value
 ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
 : "bg-slate-800/60 text-slate-400 border border-slate-700/50 hover:border-purple-500/20 hover:text-white"
 }`}
 >
 {cat.label}
 </button>
 ))}

 {(currentSearch || currentCategory) && (
 <button
 onClick={() => { setSearch(""); updateParams("", ""); }}
 className="px-3 py-1.5 rounded-xl text-xs text-slate-500 hover:text-red-400 border border-slate-800 hover:border-red-500/20 transition-all"
 >
 Reset
 </button>
 )}
 </div>
 </div>
 );
}