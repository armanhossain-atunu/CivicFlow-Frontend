import { GuestOnly } from "@/components/auth/GuestOnly";
import { ForgotPasswordForm } from "@/components/Form/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <GuestOnly>
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md">
          <ForgotPasswordForm />
        </div>
      </div>
    </GuestOnly>
  );
}
