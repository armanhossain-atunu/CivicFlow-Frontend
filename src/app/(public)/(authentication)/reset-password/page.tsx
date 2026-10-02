import { GuestOnly } from "@/components/auth/GuestOnly";
import { ResetPasswordForm } from "@/components/Form/ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string | string[] }>;
}) {
  const params = await searchParams;
  const email = typeof params.email === "string" ? params.email : "";

  return (
    <GuestOnly>
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md">
          <ResetPasswordForm email={email} />
        </div>
      </div>
    </GuestOnly>
  );
}
