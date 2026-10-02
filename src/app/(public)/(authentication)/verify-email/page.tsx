import { GuestOnly } from "@/components/auth/GuestOnly";
import { VerifyEmailForm } from "@/components/Form/VerifyEmailForm";

export default function VerifyEmailPage() {
  return (
    <GuestOnly>
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md">
          <VerifyEmailForm />
        </div>
      </div>
    </GuestOnly>
  );
}
