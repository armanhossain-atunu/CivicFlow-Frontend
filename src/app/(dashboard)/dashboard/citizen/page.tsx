
"use client";

import {
  ArrowRight,
  ClipboardList,
  CreditCard,
  FilePlus2,
  History,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import {
  RadialBar,
  RadialBarChart,
} from "recharts";

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
  useDeleteComplaint,
  useGetAllPendingComplaints,
} from "@/hooks/complain.hook";

import { useMyPaymentsHistory } from "@/hooks/payments.hook";

import { toast } from "@/components/ui/toast";

import type {
  Complaint,
  Payment,
} from "@/types/complaints.type";

import MyComplaints from "./MyComplaints";
import PaymentHistory from "./PaymentHistory";

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getArrayPayload(value: unknown): unknown[] {
  let current = value;

  for (let depth = 0; depth < 4; depth += 1) {
    if (Array.isArray(current)) {
      return current;
    }

    if (
      !isRecord(current) ||
      !("data" in current)
    ) {
      return [];
    }

    current = current.data;
  }

  return Array.isArray(current) ? current : [];
}

function getString(
  value: unknown,
): string | undefined {
  return typeof value === "string"
    ? value
    : undefined;
}

function getNumber(
  value: unknown,
): number | undefined {
  return typeof value === "number"
    ? value
    : undefined;
}

function getComplaint(
  value: unknown,
): Complaint | null {
  if (
    !isRecord(value) ||
    typeof value.id !== "string"
  ) {
    return null;
  }

  return {
    id: value.id,
    title: getString(value.title),
    status: getString(value.status),
    paymentStatus: getString(
      value.paymentStatus,
    ),
    paymentAmount: getNumber(
      value.paymentAmount,
    ),
    createdAt: getString(
      value.createdAt,
    ),
  };
}

function getPayment(
  value: unknown,
): Payment | null {
  if (!isRecord(value)) {
    return null;
  }

  const id =
    getString(value.id) ??
    getString(value.paymentID) ??
    getString(value.transactionId);

  if (!id) {
    return null;
  }

  const complaint = isRecord(
    value.complaint,
  )
    ? {
        title: getString(
          value.complaint.title,
        ),
      }
    : undefined;

  return {
    id,
    paymentID: getString(
      value.paymentID,
    ),
    transactionId: getString(
      value.transactionId,
    ),
    amount: getNumber(value.amount),
    paymentAmount: getNumber(
      value.paymentAmount,
    ),
    status: getString(value.status),
    paymentStatus: getString(
      value.paymentStatus,
    ),
    createdAt: getString(
      value.createdAt,
    ),
    complaint,
  };
}

const quickLinks = [
  {
    title: "Create complaint",
    description:
      "Report a new issue in your community.",
    href: "/complaint",
    icon: FilePlus2,
  },
  {
    title: "My complaints",
    description:
      "Review the status of your submitted complaints.",
    href: "#my-complaints",
    icon: ClipboardList,
  },
  {
    title: "Pending payments",
    description:
      "Complete payment for complaints that need it.",
    href: "/payment-pending",
    icon: CreditCard,
  },
  {
    title: "Payment history",
    description:
      "See your recent payment records.",
    href: "#payment-history",
    icon: History,
  },
];

const activeSidebarItemClassName =
  "relative before:absolute before:inset-y-1 before:left-0 before:w-0.5 before:rounded-full before:bg-sidebar-primary before:opacity-0 data-[active=true]:before:opacity-100";

const radialChartConfig = {
  resolved: {
    label: "Resolved",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function CitizenDashboard() {
  const pathname = usePathname();

  const [activeHash, setActiveHash] =
    useState("");

  const complaintsQuery =
    useGetAllPendingComplaints();

  const paymentsQuery =
    useMyPaymentsHistory();

  const deleteComplaintMutation =
    useDeleteComplaint();

  const handleDeleteComplaint = async (
    complaintId: string,
  ) => {
    try {
      await deleteComplaintMutation.mutateAsync(
        complaintId,
      );

      toast.add({
        title: "Complaint deleted",
        description:
          "The complaint was successfully deleted.",
        type: "success",
      });
    } catch (error) {
      toast.add({
        title:
          "Could not delete complaint",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong while deleting the complaint.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    const updateActiveHash = () => {
      setActiveHash(
        window.location.hash,
      );
    };

    updateActiveHash();

    window.addEventListener(
      "hashchange",
      updateActiveHash,
    );

    return () => {
      window.removeEventListener(
        "hashchange",
        updateActiveHash,
      );
    };
  }, []);

  const complaints =
    getArrayPayload(
      complaintsQuery.data,
    )
      .map(getComplaint)
      .filter(
        (
          complaint,
        ): complaint is Complaint =>
          complaint !== null,
      );

  const payments =
    getArrayPayload(
      paymentsQuery.data,
    )
      .map(getPayment)
      .filter(
        (
          payment,
        ): payment is Payment =>
          payment !== null,
      );

  const pendingPayments =
    complaints.filter(
      (complaint) =>
        complaint.paymentStatus?.toUpperCase() ===
        "PENDING",
    ).length;

  const resolvedComplaints =
    complaints.filter((complaint) =>
      [
        "RESOLVED",
        "COMPLETED",
      ].includes(
        complaint.status?.toUpperCase() ?? "",
      ),
    ).length;

  const totalComplaints =
    complaints.length;

  const resolutionPercentage =
    totalComplaints > 0
      ? Math.round(
          (resolvedComplaints /
            totalComplaints) *
            100,
        )
      : 0;

  const radialChartData = [
    {
      name: "Resolved",
      value: resolutionPercentage,
      fill: "var(--color-resolved)",
    },
  ];

  return (
    <SidebarProvider>
      <Sidebar className="mt-20 [&_[data-slot=sidebar-container]]:top-[81px]">
        <SidebarHeader>
          <div className="flex items-center gap-3 px-2 py-1">
            <span className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <LayoutDashboard
                aria-hidden="true"
                className="size-5"
              />
            </span>

            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-sm font-semibold">
                Citizen portal
              </p>

              <p className="truncate text-xs text-sidebar-foreground/70">
                Your services
              </p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              Workspace
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {/* Overview */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={
                      <Link href="/dashboard/citizen" />
                    }
                    isActive={
                      pathname ===
                        "/dashboard/citizen" &&
                      activeHash === ""
                    }
                    tooltip="Overview"
                    className={
                      activeSidebarItemClassName
                    }
                  >
                    <LayoutDashboard aria-hidden="true" />
                    <span>Overview</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* My Complaints */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={
                      <Link href="#my-complaints" />
                    }
                    isActive={
                      pathname ===
                        "/dashboard/citizen" &&
                      activeHash ===
                        "#my-complaints"
                    }
                    tooltip="My complaints"
                    className={
                      activeSidebarItemClassName
                    }
                  >
                    <ClipboardList aria-hidden="true" />
                    <span>My complaints</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Pending Payments */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={
                      <Link href="/payment-pending" />
                    }
                    isActive={
                      pathname ===
                      "/payment-pending"
                    }
                    tooltip="Pending payments"
                    className={
                      activeSidebarItemClassName
                    }
                  >
                    <CreditCard aria-hidden="true" />
                    <span>
                      Pending payments
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Payment History */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={
                      <Link href="#payment-history" />
                    }
                    isActive={
                      pathname ===
                        "/dashboard/citizen" &&
                      activeHash ===
                        "#payment-history"
                    }
                    tooltip="Payment history"
                    className={
                      activeSidebarItemClassName
                    }
                  >
                    <History aria-hidden="true" />
                    <span>
                      Payment history
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Create Complaint */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={
                      <Link href="/complaint" />
                    }
                    isActive={
                      pathname ===
                      "/complaint"
                    }
                    tooltip="Create complaint"
                    className={
                      activeSidebarItemClassName
                    }
                  >
                    <FilePlus2 aria-hidden="true" />
                    <span>
                      Create complaint
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu />
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <div className="mx-auto w-full max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
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
                Track your service requests
                and payments from one place.
              </p>
            </div>
          </header>

          {/* Summary Cards */}
          <section
            aria-label="Complaint summary"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              {
                label:
                  "Total complaints",
                value: totalComplaints,
              },
              {
                label:
                  "Resolved complaints",
                value: resolvedComplaints,
              },
              {
                label:
                  "Pending payments",
                value: pendingPayments,
              },
              {
                label:
                  "Payment records",
                value: payments.length,
              },
            ].map((item) => (
              <Card key={item.label}>
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">
                    {item.label}
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {complaintsQuery.isLoading ||
                    paymentsQuery.isLoading
                      ? "—"
                      : item.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </section>

          {/* Resolution Radial Chart */}
          <section aria-label="Complaint resolution">
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  {/* Chart Information */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <BarChart3
                          aria-hidden="true"
                          className="size-5"
                        />
                      </div>

                      <div>
                        <h2 className="text-xl font-semibold">
                          Complaint resolution
                        </h2>

                        <p className="text-sm text-muted-foreground">
                          Your overall complaint
                          resolution progress.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4 sm:max-w-md">
                      <div className="rounded-lg border bg-muted/30 p-4">
                        <p className="text-sm text-muted-foreground">
                          Total complaints
                        </p>

                        <p className="mt-1 text-2xl font-bold">
                          {totalComplaints}
                        </p>
                      </div>

                      <div className="rounded-lg border bg-muted/30 p-4">
                        <p className="text-sm text-muted-foreground">
                          Resolved
                        </p>

                        <p className="mt-1 text-2xl font-bold">
                          {resolvedComplaints}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Radial Chart */}
                  <div className="flex justify-center md:pr-8">
                    <ChartContainer
                      config={
                        radialChartConfig
                      }
                      className="h-[220px] w-[220px]"
                    >
                      <RadialBarChart
                        data={
                          radialChartData
                        }
                        startAngle={90}
                        endAngle={
                          90 -
                          resolutionPercentage *
                            3.6
                        }
                        innerRadius={70}
                        outerRadius={100}
                        barSize={18}
                        cx="50%"
                        cy="50%"
                      >
                        <ChartTooltip
                          cursor={false}
                          content={
                            <ChartTooltipContent
                              hideLabel
                            />
                          }
                        />

                        <RadialBar
                          dataKey="value"
                          background
                          cornerRadius={10}
                        />

                        <text
                          x="50%"
                          y="50%"
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x="50%"
                            dy="-0.2em"
                            className="fill-foreground text-3xl font-bold"
                          >
                            {complaintsQuery.isLoading
                              ? "—"
                              : `${resolutionPercentage}%`}
                          </tspan>

                          <tspan
                            x="50%"
                            dy="1.8em"
                            className="fill-muted-foreground text-xs"
                          >
                            Resolved
                          </tspan>
                        </text>
                      </RadialBarChart>
                    </ChartContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Error Message */}
          {(complaintsQuery.isError ||
            paymentsQuery.isError) && (
            <p
              role="alert"
              className="text-sm text-destructive"
            >
              {complaintsQuery.isError &&
              paymentsQuery.isError
                ? "Complaint and payment information could not be loaded."
                : complaintsQuery.isError
                  ? "Complaint information could not be loaded."
                  : "Payment history could not be loaded."}{" "}
              Please refresh and try again.
            </p>
          )}

          {/* Quick Links */}
          <section aria-label="Citizen services">
            <h2 className="text-xl font-semibold">
              Your services
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {quickLinks.map(
                ({
                  title,
                  description,
                  href,
                  icon: Icon,
                }) => (
                  <Link
                    key={title}
                    href={href}
                    className="group rounded-xl"
                  >
                    <Card className="h-full transition-colors group-hover:bg-muted/50">
                      <CardContent className="flex items-start gap-4 p-5">
                        <span className="rounded-lg bg-primary/10 p-3 text-primary">
                          <Icon
                            aria-hidden="true"
                            className="size-5"
                          />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-3 font-semibold">
                            {title}

                            <ArrowRight
                              aria-hidden="true"
                              className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1"
                            />
                          </span>

                          <span className="mt-1 block text-sm text-muted-foreground">
                            {description}
                          </span>
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ),
              )}
            </div>
          </section>

          {/* My Complaints */}
          <MyComplaints
            complaints={complaints}
            isLoading={
              complaintsQuery.isLoading
            }
            isError={
              complaintsQuery.isError
            }
            onDelete={
              handleDeleteComplaint
            }
            deletingComplaintId={
              deleteComplaintMutation.isPending
                ? deleteComplaintMutation.variables
                : null
            }
          />

          {/* Payment History */}
          <PaymentHistory
            payments={payments}
            isLoading={
              paymentsQuery.isLoading
            }
            isError={
              paymentsQuery.isError
            }
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

