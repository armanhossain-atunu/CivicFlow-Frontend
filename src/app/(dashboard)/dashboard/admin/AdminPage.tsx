import type { ReactNode } from "react";
import { AdminNavigation } from "./AdminNavigation";

type AdminPageProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AdminPage({ title, description, children }: AdminPageProps) {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <p className="text-sm font-medium text-primary">Administration</p>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </header>
      <AdminNavigation />
      {children}
    </main>
  );
}
