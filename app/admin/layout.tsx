import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin/dashboard");
  }

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 ml-64 p-8 bg-secondary/20 min-h-screen">
        {children}
      </main>
    </div>
  );
}
