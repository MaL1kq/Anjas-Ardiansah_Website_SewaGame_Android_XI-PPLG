// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RentZone — Sewa Aplikasi Game & Android",
  description: "Platform penyewaan aplikasi game dan Android terpercaya. Akses game & app premium selama 1 minggu.",
  keywords: ["sewa aplikasi", "game", "android", "rental app"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${inter.className} antialiased`}>
        {/* Space Background — fixed, behind everything */}
        <div className="space-bg" aria-hidden="true">
          <div className="stars" />
          <div className="shooting-star" />
        </div>

        <Navbar />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}