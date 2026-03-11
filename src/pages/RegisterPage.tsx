import { RegisterForm } from "@/components/features/auth/RegisterForm";
import Logo from "@/components/shared/logo";

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-6 min-h-screen w-full items-center justify-center bg-muted/40 px-4">
      <Logo />
      <RegisterForm />
    </div>
  );
}
