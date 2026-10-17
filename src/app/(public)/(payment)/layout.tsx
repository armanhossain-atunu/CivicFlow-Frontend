import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { Header } from "@/components/layout/public/Header";
import { Footer } from "@/components/layout/public/Footer";

const paymentLayout = async ({ children }: { children: ReactNode }) => {
  const hasSession = (await cookies()).has("accessToken");

  return (
    <div className="flex flex-col min-h-screen">
      <Header hasSession={hasSession} />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export default paymentLayout;
