
"use client";

import {
  ArrowRight,
  BarChart3,
  ClipboardList,
  CreditCard,
  FilePlus2,
  History,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { RadialBar, RadialBarChart } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  ComplaintStatus,
  useDeleteComplaint,
  useGetMyAllComplaints,
} from "@/hooks/complain.hook";
import { useMyPaymentsHistory } from "@/hooks/payments.hook";
import { toast } from "@/components/ui/toast";

import type {
  Complaint,
  GetAllComplaintsParams,
} from "@/types/complaints.type";
import type { Payment } from "@/types/payment.type";

import { CommonPagination } from "@/components/common/CommonPagination";
import { CommonSearch } from "@/components/common/CommonSearch";
import { CommonStatusFilter } from "@/components/common/CommonStatusFilter";
import { COMPLAINT_STATUS_OPTIONS } from "@/lib/complaint-status";
import { getStatusLabel } from "@/lib/status-label";

import MyComplaints from "./MyComplaints";
import PaymentHistory from "./PaymentHistory";

const PAGE_SIZE = 10;

const chartConfig = {
  resolved: {
    label: "Resolved",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const quickLinks = [
  {
    title: "Create complaint",
    description: "Report a new issue in your community.",
    href: "/complaint",
    icon: FilePlus2,
  },
  {
    title: "My complaints",
    description: "Review your submitted complaints.",
    href: "#my-complaints",
    icon: ClipboardList,
  },
  {
    title: "Pending payments",
    description: "Complete payments for your complaints.",
    href: "/payment-pending",
    icon: CreditCard,
  },
  {
    title: "Payment history",
    description: "See your recent payment records.",
    href: "#payment-history",
    icon: History,
  },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function getNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const number = Number(value);
    return Number.isFinite(number) ? number : undefined;
  }

  return undefined;
}

function getArrayPayload(value: unknown): unknown[] {
  let current = value;

  for (let depth = 0; depth < 5; depth++) {
    if (Array.isArray(current)) return current;

    if (!isRecord(current) || !("data" in current)) {
      return [];
    }

    current = current.data;
  }

  return Array.isArray(current) ? current : [];
}

function getComplaint(value: unknown): Complaint | null {
  if (!isRecord(value) || typeof value.id !== "string") {
    return null;
  }

  return {
    id: value.id,
    title: getString(value.title),
    status: getString(value.status),
    paymentStatus: getString(value.paymentStatus),
    paymentAmount: getNumber(value.amount),
    createdAt: getString(value.createdAt),
  };
}

function getPayment(value: unknown): Payment | null {
  if (!isRecord(value)) return null;

  const id =
    getString(value.id) ??
    getString(value.paymentID) ??
    getString(value.transactionId);

  if (!id) return null;

  const complaint = isRecord(value.complaint)
    ? {
        id: getString(value.complaint.id),
        title: getString(value.complaint.title),
      }
    : undefined;

  return {
    id,
    complaintId: getString(value.complaintId),
    citizenId: getString(value.citizenId),
    amount: getNumber(value.amount),
    status: getString(value.status),
    method: getString(value.method),
    purpose: getString(value.purpose),
    transactionId: getString(value.transactionId),
    gatewayTransactionId: getString(value.gatewayTransactionId),
    merchantInvoice: getString(value.merchantInvoice),
    gateway: getString(value.gateway),
    initiatedAt: getString(value.initiatedAt),
    paidAt: getString(value.paidAt),
    failedAt: getString(value.failedAt),
    failureReason: getString(value.failureReason),
    createdAt: getString(value.createdAt),
    updatedAt: getString(value.updatedAt),
    complaint,
  };
}

function getPaginationMeta(value: unknown) {
  const fallback = {
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPage: 0,
  };

  if (!isRecord(value)) return fallback;

  // Handles { meta, data }, including common nested API wrappers.
  let current: unknown = value;

  for (let depth = 0; depth < 4; depth++) {
    if (!isRecord(current)) break;

    if (isRecord(current.meta)) {
      const raw = current.meta;

      return {
        page: getNumber(raw.page) ?? fallback.page,
        limit: getNumber(raw.limit) ?? fallback.limit,
        total: getNumber(raw.total) ?? fallback.total,
        totalPage:
          getNumber(raw.totalPage) ?? fallback.totalPage,
      };
    }

    if (!("data" in current)) break;
    current = current.data;
  }

  return fallback;
}

export default function CitizenDashboard() {
  const pathname = usePathname();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const complaintParams = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      search: search.trim() || undefined,
      status:
        status === "ALL"
          ? undefined
          : (status as  ComplaintStatus),
    }),
    [page, search, status],
  );

  const complaintsQuery = useGetMyAllComplaints(complaintParams);
  const paymentsQuery = useMyPaymentsHistory();
  const deleteMutation = useDeleteComplaint();

  const complaints = useMemo(
    () =>
      getArrayPayload(complaintsQuery.data)
        .map(getComplaint)
        .filter((item): item is Complaint => item !== null),
    [complaintsQuery.data],
  );

  const meta = useMemo(
    () => getPaginationMeta(complaintsQuery.data),
    [complaintsQuery.data],
  );

  const payments = useMemo(
    () =>
      getArrayPayload(paymentsQuery.data)
        .map(getPayment)
        .filter((item): item is Payment => item !== null),
    [paymentsQuery.data],
  );

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
    document.getElementById("my-complaints")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setStatus(value);
    setPage(1);
  }, []);

  const handleDeleteComplaint = async (complaintId: string) => {
    try {
      await deleteMutation.mutateAsync(complaintId);

      toast.add({
        title: "Complaint deleted",
        description: "The complaint was successfully deleted.",
        type: "success",
      });

      // If the last item on a page was deleted, move back one page.
      if (complaints.length === 1 && page > 1) {
        setPage((current) => current - 1);
      }
    } catch (error) {
      toast.add({
        title: "Could not delete complaint",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong while deleting the complaint.",
        type: "error",
      });
    }
  };

  const resolvedCount = complaints.filter((item) =>
    ["RESOLVED", "COMPLETED"].includes(
      item.status?.toUpperCase() ?? "",
    ),
  ).length;

  const pendingPayments = complaints.filter(
    (item) => item.paymentStatus?.toUpperCase() === "PENDING",
  ).length;

  const resolutionPercentage =
    complaints.length > 0
      ? Math.round((resolvedCount / complaints.length) * 100)
      : 0;

  const radialChartData = [
    {
      name: "Resolved",
      value: resolutionPercentage,
      fill: "var(--color-resolved)",
    },
  ];

  const paymentCount = payments.length;

  return (
    <SidebarProvider>
      <Sidebar className="mt-20 [&_[data-slot=sidebar-container]]:top-[81px]">
        <SidebarHeader>
          <div className="flex items-center gap-3 px-2 py-1">
            <span className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <LayoutDashboard className="size-5" />
            </span>
            <div className="group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-semibold">Citizen portal</p>
              <p className="text-xs text-sidebar-foreground/70">
                Your services
              </p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {[
                  {
                    title: "Overview",
                    href: "/dashboard/citizen",
                    icon: LayoutDashboard,
                  },
                  {
                    title: "My complaints",
                    href: "#my-complaints",
                    icon: ClipboardList,
                  },
                  {
                    title: "Pending payments",
                    href: "/payment-pending",
                    icon: CreditCard,
                  },
                  {
                    title: "Payment history",
                    href: "#payment-history",
                    icon: History,
                  },
                  {
                    title: "Create complaint",
                    href: "/complaint",
                    icon: FilePlus2,
                  },
                ].map(({ title, href, icon: Icon }) => (
                  <SidebarMenuItem key={title}>
                    <SidebarMenuButton
                      render={<Link href={href} />}
                      tooltip={title}
                      isActive={
                        href.startsWith("#")
                          ? pathname === "/dashboard/citizen" &&
                            (typeof window !== "undefined"
                              ? window.location.hash === href
                              : false)
                          : pathname === href
                      }
                    >
                      <Icon className="size-4" />
                      <span>{title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter />
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <div className="mx-auto w-full max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
          <header className="flex items-start gap-3">
            <SidebarTrigger className="mt-1 shrink-0" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Citizen portal
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">
                My complaint summary
              </h1>
              <p className="mt-2 text-muted-foreground">
                Track your service requests and payments from one place.
              </p>
            </div>
          </header>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Total complaints",
                value: meta.total,
                loading: complaintsQuery.isLoading,
              },
              {
                label: "Resolved on this page",
                value: resolvedCount,
                loading: complaintsQuery.isLoading,
              },
              {
                label: "Pending payments on this page",
                value: pendingPayments,
                loading: complaintsQuery.isLoading,
              },
              {
                label: "Payment records",
                value: paymentCount,
                loading: paymentsQuery.isLoading,
              },
            ].map((item) => (
              <Card key={item.label}>
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold">
                    {item.loading ? "—" : item.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </section>

          <section>
            <Card>
              <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <BarChart3 className="size-5 text-primary" />
                    <h2 className="text-xl font-semibold">
                      Complaint resolution
                    </h2>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Resolution percentage for the currently loaded page.
                  </p>
                </div>

                <ChartContainer
                  config={chartConfig}
                  className="h-[220px] w-full max-w-[220px]"
                >
                  <RadialBarChart
                    data={radialChartData}
                    startAngle={90}
                    endAngle={90 - resolutionPercentage * 3.6}
                    innerRadius={70}
                    outerRadius={100}
                    barSize={18}
                  >
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <RadialBar
                      dataKey="value"
                      background
                      cornerRadius={10}
                    />
                  </RadialBarChart>
                </ChartContainer>

                <p className="text-3xl font-bold">
                  {complaintsQuery.isLoading
                    ? "—"
                    : `${resolutionPercentage}%`}
                </p>
              </CardContent>
            </Card>
          </section>

          {(complaintsQuery.isError || paymentsQuery.isError) && (
            <p role="alert" className="text-sm text-destructive">
              Unable to load some dashboard information. Please try again.
            </p>
          )}

          <section>
            <h2 className="text-xl font-semibold">Your services</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {quickLinks.map(({ title, description, href, icon: Icon }) => (
                <Link key={title} href={href} className="group rounded-xl">
                  <Card className="h-full transition-colors group-hover:bg-muted/50">
                    <CardContent className="flex items-start gap-4 p-5">
                      <span className="rounded-lg bg-primary/10 p-3 text-primary">
                        <Icon className="size-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-3 font-semibold">
                          {title}
                          <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                        </span>
                        <span className="mt-1 block text-sm text-muted-foreground">
                          {description}
                        </span>
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          <section id="my-complaints" className="scroll-mt-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">My complaints</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Showing {meta.total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}
                  {"–"}
                  {Math.min(page * PAGE_SIZE, meta.total)} of {meta.total}{" "}
                  complaints
                </p>
              </div>
              <Link
                href="/complaint"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <FilePlus2 className="size-4" />
                Create complaint
              </Link>
            </div>

            <div className="mb-4 space-y-4">
              <CommonSearch
                value={search}
                onChange={handleSearchChange}
                placeholder="Search complaints..."
              />
              <CommonStatusFilter
                value={status}
                options={COMPLAINT_STATUS_OPTIONS}
                onChange={handleStatusChange}
              />
            </div>

            {complaintsQuery.isLoading ? (
              <p className="rounded-xl border p-5 text-sm text-muted-foreground">
                Loading complaints...
              </p>
            ) : complaintsQuery.isError ? (
              <p className="rounded-xl border p-5 text-sm text-destructive">
                Unable to load complaints.
              </p>
            ) : (
              <>
                <MyComplaints
                  complaints={complaints}
                  meta={meta}
                  search={search}
                  status={status}
                  isLoading={false}
                  isError={false}
                  onSearchChange={handleSearchChange}
                  onStatusChange={handleStatusChange}
                  onPageChange={handlePageChange}
                  onDelete={handleDeleteComplaint}
                  deletingComplaintId={
                    deleteMutation.isPending
                      ? deleteMutation.variables
                      : null
                  }
                />

               
              </>
            )}
          </section>
{/* payment history */}
          <section id="payment-history" className="scroll-mt-6">
         
            <PaymentHistory
              payments={payments}
              isLoading={paymentsQuery.isLoading}
              isError={paymentsQuery.isError}
            />
          </section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}