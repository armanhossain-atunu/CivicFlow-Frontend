import type { ReactNode } from "react";
import { cookies } from "next/headers";
import Footer from "@/components/layout/public/Footer";
import Header from "@/components/layout/public/Header";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const hasSession = (await cookies()).has("accessToken");

  return (
    <div className="min-h-screen bg-background">
      <Header hasSession={hasSession} />
      {children}

      <Footer />
    </div>
  );
};

export default DashboardLayout;
