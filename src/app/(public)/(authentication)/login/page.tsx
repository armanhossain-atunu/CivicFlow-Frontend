import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/svg/logo";

import { LoginForm } from "@/components/Form/LoginForm";
import { GuestOnly } from "@/components/auth/GuestOnly";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center  md:justify-start">
          <Link href="/" className="flex items-center font-medium">
            <div className="flex size-16 items-center justify-center rounded-md text-primary-foreground">
              <Logo />
            </div>
            CivicFlow
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/login.jpg"
          alt="Login"
          fill
          sizes="50vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
