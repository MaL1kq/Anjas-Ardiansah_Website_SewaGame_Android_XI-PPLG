// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-center">
      <div className="animate-fade-up">
        {/* Glow */}
        <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_500px_400px_at_50%_50%,rgba(147,51,234,0.08),transparent_70%)]" />

        <p className="text-8xl md:text-9xl font-black gradient-text mb-4">404</p>
        <h1 className="text-2xl md:text-3xl font-black text-white mb-3">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
          Halaman yang kamu cari tidak ada atau sudah dipindahkan.
          Kembali ke halaman utama dan coba lagi.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="btn-primary px-8 py-3 text-sm font-semibold relative z-10">
            Kembali ke Beranda
          </Link>
          <Link href="/products" className="btn-ghost px-8 py-3 text-sm font-semibold">
            Lihat Produk
          </Link>
        </div>
      </div>
    </div>
  );
}