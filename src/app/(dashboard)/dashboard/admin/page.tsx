"use client";

import Link from "next/link";
import {
  ArrowRight,
  ChartNoAxesCombined,
  ClipboardList,
  CreditCard,
  FolderTree,
  Users,
  CheckCircle2,
  CircleCheck,
  Clock,
  ClipboardCheck,
} from "lucide-react";

import { useGetAllCategories } from "@/hooks/complain.hook";
import { useManagerComplaints, useGetTechnicians } from "@/hooks/manager.hook";
import { useGetPayments } from "@/hooks/payments.hook";

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

type Complaint = {
  id?: string;
  status?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function countArrayPayload(value: unknown): number | undefined {
  let current = value;

  for (let depth = 0; depth < 5; depth += 1) {
    if (Array.isArray(current)) {
      return current.length;
    }

    if (!isRecord(current)) {
      return undefined;
    }

    for (const key of ["payments", "users", "technicians", "categories"]) {
      const nested = current[key];

      if (Array.isArray(nested)) {
        return nested.length;
      }
    }

    if (!("data" in current)) {
      return undefined;
    }

    current = current.data;
  }

  return Array.isArray(current) ? current.length : undefined;
}

function getComplaintArray(value: unknown): Complaint[] {
  let current = value;

  for (let depth = 0; depth < 5; depth += 1) {
    if (Array.isArray(current)) {
      return current.filter(
        (item): item is Complaint =>
          isRecord(item) &&
          (typeof item.status === "string" || item.status === undefined),
      );
    }

    if (!isRecord(current)) {
      return [];
    }

    if (Array.isArray(current.complaints)) {
      current = current.complaints;
      continue;
    }

    if ("data" in current) {
      current = current.data;
      continue;
    }

    return [];
  }

  return [];
}

export default function AdminDashboard() {
  const paymentsQuery = useGetPayments();
  const usersQuery = useGetTechnicians();
  const categoriesQuery = useGetAllCategories();
  const complaintsQuery = useManagerComplaints();

  const complaints = getComplaintArray(complaintsQuery.data);

  const closedCount = complaints.filter(
    (complaint) => complaint.status === "CLOSED",
  ).length;

  const assingCount = complaints.filter(
    (complaint) => complaint.status === "ASSIGNED",
  ).length;

  const resolvedCount = complaints.filter(
    (complaint) => complaint.status === "RESOLVED",
  ).length;

  const inProgressCount = complaints.filter(
    (complaint) => complaint.status === "IN_PROGRESS",
  ).length;

  const metrics = [
    {
      label: "User accounts",
      value: usersQuery.isError
        ? "Unavailable"
        : (countArrayPayload(usersQuery.data) ?? 0).toLocaleString(),
      isLoading: usersQuery.isLoading,
      icon: Users,
    },
    {
      label: "Categories",
      value: categoriesQuery.isError
        ? "Unavailable"
        : (countArrayPayload(categoriesQuery.data) ?? 0).toLocaleString(),
      isLoading: categoriesQuery.isLoading,
      icon: FolderTree,
    },
    {
      label: "Payment records",
      value: paymentsQuery.isError
        ? "Unavailable"
        : (countArrayPayload(paymentsQuery.data) ?? 0).toLocaleString(),
      isLoading: paymentsQuery.isLoading,
      icon: CreditCard,
    },
    {
      label: "Total complaints",
      value: complaintsQuery.isError
        ? "Unavailable"
        : (complaintsQuery.data?.total ?? complaints.length).toLocaleString(),
      isLoading: complaintsQuery.isLoading,
      icon: ClipboardList,
    },

    {
      label: "Assigned complaints",
      value: assingCount.toLocaleString(),
      isLoading: complaintsQuery.isLoading,
      icon: ClipboardCheck,
    },
    {
      label: "In progress",
      value: inProgressCount.toLocaleString(),
      isLoading: complaintsQuery.isLoading,
      icon: Clock,
    },
    {
      label: "Resolved complaints",
      value: resolvedCount.toLocaleString(),
      isLoading: complaintsQuery.isLoading,
      icon: CircleCheck,
    },

    {
      label: "Closed complaints",
      value: closedCount.toLocaleString(),
      isLoading: complaintsQuery.isLoading,
      icon: CheckCircle2,
    },
  ];

  return (
    <AdminPage
      title="Admin overview"
      description="Monitor CivicFlow operations and open an administration section."
    >
      {/* Dashboard Metrics */}
      <section
        aria-label="Platform totals"
        className="grid grid-cols-1 gap-4 sm:grid-cols-4 xl:grid-cols-4"
      >
        {metrics.map(({ label, value, isLoading, icon: Icon }) => (
          <Card key={label} className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>

              <Icon
                aria-hidden="true"
                className="size-5 text-muted-foreground"
              />
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

      {/* Complaint Area Chart */}
      {/* <section className="mt-6" aria-label="Complaint analytics">
        <ComplaintAreaChart />
      </section> */}

      {/* Administration Sections */}
      <section
        aria-label="Administration sections"
        className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
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
