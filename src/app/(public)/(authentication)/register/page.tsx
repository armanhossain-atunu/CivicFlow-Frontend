import Image from "next/image";
import { RegisterForm } from "@/components/Form/RegisterForm";
import Link from "next/link";
import Logo from "@/assets/svg/logo";

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Register Form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center  md:justify-start">
          <Link href="/" className="flex items-center font-medium">
            <div className="flex size-16 items-center justify-center rounded-md  text-primary-foreground">
              <Logo />
            </div>

            <span>CivicFlow</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>

      {/* Register Image */}
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/register.jpg"
          alt="CivicFlow registration"
          fill
          priority
          className="h-20"
        />
      </div>
    </div>
  );
}
