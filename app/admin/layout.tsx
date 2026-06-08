// app/admin/layout.tsx
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/");

  return (
    <div className="min-h-screen flex">
      <AdminSidebar session={session} />
      <main className="flex-1 ml-0 md:ml-64 p-6 md:p-8 pt-20 md:pt-8">
        {children}
      </main>
    </div>
  );
}