"use client";
// components/admin/ImageUpload.tsx

import { useRef, useState } from "react";
import Image from "next/image";

type Props = {
  value: string;
  onChange: (url: string) => void;
};

export default function ImageUpload({ value, onChange }: Props) {
  const inputRef             = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError]        = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res  = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload gagal.");
        return;
      }

      onChange(data.url);
    } catch {
      setError("Terjadi kesalahan saat upload.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove() {
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-700">
          <Image
            src={value}
            alt="Preview gambar produk"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center text-xs transition-colors z-10"
            aria-label="Hapus gambar"
          >
            ✕
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          aria-label="Pilih gambar produk"
          className="w-full aspect-video rounded-xl border-2 border-dashed border-slate-700 hover:border-purple-500/50 bg-slate-900/50 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:bg-slate-800/40"
        >
          <span className="text-3xl">🖼️</span>
          <p className="text-sm text-slate-400 font-medium">
            {uploading ? "Mengupload..." : "Klik untuk pilih gambar"}
          </p>
          <p className="text-xs text-slate-600">JPG, PNG, WebP, GIF — max 5MB</p>
        </div>
      )}

      {/* FIX: aria-label pada input file hidden */}
      <label htmlFor="product-image-upload" className="sr-only">
        Upload gambar produk
      </label>
      <input
        id="product-image-upload"
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        onChange={handleFile}
        className="hidden"
        aria-label="Upload gambar produk"
      />

      {value && !uploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full py-2 rounded-xl text-xs font-medium text-slate-400 border border-slate-700 hover:border-purple-500/30 hover:text-white transition-all"
        >
          🔄 Ganti Gambar
        </button>
      )}

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-purple-300">
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Mengupload gambar...
        </div>
      )}

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}