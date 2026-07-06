import { Logo } from "@/components/Logo";
import { AdminLoginForm } from "@/app/admin/login/AdminLoginForm";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-8 px-4 py-16">
      <Logo size="lg" />
      <AdminLoginForm next={next ?? "/admin"} />
    </div>
  );
}
