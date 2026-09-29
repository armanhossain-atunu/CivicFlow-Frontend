import type { ReactNode } from "react";
import { Header } from "@/components/layout/public/Header";
import { Footer } from "@/components/layout/public/Footer";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
