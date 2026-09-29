import type { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return <div className="min-h-screen bg-background">{children}</div>;
};

export default DashboardLayout;
