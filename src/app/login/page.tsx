import { Logo } from "@/components/Logo";
import { LoginForm } from "@/app/login/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-8 px-4 py-16">
      <Logo size="lg" />
      <LoginForm next={next ?? "/"} />
    </div>
  );
}
