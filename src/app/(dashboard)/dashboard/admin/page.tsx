"use client";

import Link from "next/link";
import {
  ArrowRight,
  ChartNoAxesCombined,
  ClipboardList,
  CreditCard,
  FolderTree,
  Users,
} from "lucide-react";

import { useGetAllCategories } from "@/hooks/complain.hook";
import { useManagerComplaints } from "@/hooks/manager.hook";
import { useGetPayments } from "@/hooks/payments.hook";
import { useGetTechnicians } from "@/hooks/manager.hook";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminPage } from "./AdminPage";

const sections = [
  {
    href: "/dashboard/admin/complaints",
    label: "Complaints",
    description: "Review and monitor incoming service requests.",
    icon: ClipboardList,
  },
  {
    href: "/dashboard/admin/payments",
    label: "Payments",
    description: "Browse payment records and transaction statuses.",
    icon: CreditCard,
  },
  {
    href: "/dashboard/admin/users",
    label: "Users",
    description: "View registered citizens and staff accounts.",
    icon: Users,
  },
  {
    href: "/dashboard/admin/assignments",
    label: "Assignments",
    description: "Review complaints assigned to technicians.",
    icon: ClipboardList,
  },
  {
    href: "/dashboard/admin/categories",
    label: "Categories",
    description: "View complaint categories and their payment settings.",
    icon: FolderTree,
  },
  {
    href: "/dashboard/admin/reports",
    label: "Reports",
    description: "See a summary of available complaint and payment data.",
    icon: ChartNoAxesCombined,
  },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function countArrayPayload(value: unknown): number | undefined {
  let current = value;

  for (let depth = 0; depth < 4; depth += 1) {
    if (Array.isArray(current)) return current.length;
    if (!isRecord(current)) return undefined;

    const record = current;
    const namedArray = ["payments", "users", "categories"]
      .map((key) => record[key])
      .find(Array.isArray);
    if (namedArray) return namedArray.length;
    if (!("data" in current)) return undefined;
    current = current.data;
  }

  return Array.isArray(current) ? current.length : undefined;
}

export default function AdminDashboard() {
  const complaintsQuery = useManagerComplaints(1, 1);
  const paymentsQuery = useGetPayments();
  const usersQuery = useGetTechnicians();
  const categoriesQuery = useGetAllCategories();

  const metrics = [
    {
      label: "Total complaints",
      isLoading: complaintsQuery.isLoading,
      value: complaintsQuery.isError
        ? "Unavailable"
        : (complaintsQuery.data?.total ?? 0).toLocaleString(),
    },
    {
      label: "Payment records",
      isLoading: paymentsQuery.isLoading,
      value: paymentsQuery.isError
        ? "Unavailable"
        : (countArrayPayload(paymentsQuery.data)?.toLocaleString() ??
          "Unavailable"),
    },
    {
      label: "User accounts",
      isLoading: usersQuery.isLoading,
      value: usersQuery.isError
        ? "Unavailable"
        : (countArrayPayload(usersQuery.data)?.toLocaleString() ??
          "Unavailable"),
    },
    {
      label: "Categories",
      isLoading: categoriesQuery.isLoading,
      value: categoriesQuery.isError
        ? "Unavailable"
        : (countArrayPayload(categoriesQuery.data)?.toLocaleString() ??
          "Unavailable"),
    },
  ];

  return (
    <AdminPage
      title="Admin overview"
      description="Monitor CivicFlow operations and open an administration section."
    >
      <section
        aria-label="Platform totals"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {metrics.map(({ label, value, isLoading }) => (
          <Card key={label}>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <p className="text-2xl font-semibold tabular-nums">{value}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </section>

      <section
        aria-label="Administration sections"
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        {sections.map(({ href, label, description, icon: Icon }) => (
          <Link key={href} href={href} className="group">
            <Card className="h-full transition-colors group-hover:bg-muted/50">
              <CardContent className="flex h-full items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <Icon aria-hidden="true" className="size-5 text-primary" />
                    {label}
                  </div>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                <ArrowRight
                  aria-hidden="true"
                  className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1"
                />
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </AdminPage>
  );
}
