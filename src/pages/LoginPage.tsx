import { LoginForm } from "@/components/features/auth/LoginForm";
import Logo from "@/components/shared/logo";

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6 min-h-screen w-full items-center justify-center bg-muted/40 px-4">
      <Logo />
      <LoginForm />
    </div>
  );
}
