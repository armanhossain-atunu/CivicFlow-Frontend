"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartNoAxesCombined,
  ClipboardList,
  CreditCard,
  FolderTree,
  LayoutDashboard,
  Settings,
  Users,
  Wrench,
} from "lucide-react";

const adminRoutes = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  {
    href: "/dashboard/admin/complaints",
    label: "Complaints",
    icon: ClipboardList,
  },
  { href: "/dashboard/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/dashboard/admin/users", label: "Users", icon: Users },
  {
    href: "/dashboard/admin/assignments",
    label: "Assignments",
    icon: Wrench,
  },
  {
    href: "/dashboard/admin/categories",
    label: "Categories",
    icon: FolderTree,
  },
  {
    href: "/dashboard/admin/reports",
    label: "Reports",
    icon: ChartNoAxesCombined,
  },
  { href: "/dashboard/admin/settings", label: "Settings", icon: Settings },
];

export function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Admin navigation"
      className="flex gap-2 overflow-x-auto border-b pb-3"
    >
      {adminRoutes.map(({ href, label, icon: Icon }) => {
        const isActive =
          href === "/dashboard/admin"
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={[
              "inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            ].join(" ")}
          >
            <Icon aria-hidden="true" className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
