"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const Header = () => {
  const pathname = usePathname();

  const routes = [
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
    { name: "Features", url: "/features" },
    { name: "Contact", url: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            CF
          </span>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            CivicFlow
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {routes.map((route) => {
            const isActive =
              route.url === "/"
                ? pathname === "/"
                : pathname.startsWith(route.url);

            return (
              <Link
                key={route.url}
                href={route.url}
                className={[
                  "text-sm font-medium transition",
                  isActive
                    ? "text-primary"
                    : "text-slate-600 hover:text-slate-900",
                ].join(" ")}
              >
                {route.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-slate-700 transition hover:text-slate-900 sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
