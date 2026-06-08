// app/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-2 border-t-transparent border-[rgba(168,85,247,0.3)] border-t-[#a855f7] mx-auto mb-4 animate-spin" />
        <p className="text-slate-500 text-sm">Memuat...</p>
      </div>
    </div>
  );
}