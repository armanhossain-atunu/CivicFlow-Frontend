"use client";

import {
  ArrowRight,
  ClipboardList,
  CreditCard,
  FilePlus2,
  History,
} from "lucide-react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { useGetAllPendingComplaints } from "@/hooks/complain.hook";
import { useMyPaymentsHistory } from "@/hooks/payments.hook";

type Complaint = {
  id: string;
  title?: string;
  status?: string;
  paymentStatus?: string;
  paymentAmount?: number;
  createdAt?: string;
};

type Payment = {
  id: string;
  paymentID?: string;
  transactionId?: string;
  amount?: number;
  paymentAmount?: number;
  status?: string;
  paymentStatus?: string;
  createdAt?: string;
  complaint?: { title?: string };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getArrayPayload(value: unknown): unknown[] {
  let current = value;

  for (let depth = 0; depth < 4; depth += 1) {
    if (Array.isArray(current)) {
      return current;
    }
    if (!isRecord(current) || !("data" in current)) {
      return [];
    }
    current = current.data;
  }

  return Array.isArray(current) ? current : [];
}

function getString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function getNumber(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined;
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
    paymentAmount: getNumber(value.paymentAmount),
    createdAt: getString(value.createdAt),
  };
}

function getPayment(value: unknown): Payment | null {
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

  const complaint = isRecord(value.complaint)
    ? { title: getString(value.complaint.title) }
    : undefined;

  return {
    id,
    paymentID: getString(value.paymentID),
    transactionId: getString(value.transactionId),
    amount: getNumber(value.amount),
    paymentAmount: getNumber(value.paymentAmount),
    status: getString(value.status),
    paymentStatus: getString(value.paymentStatus),
    createdAt: getString(value.createdAt),
    complaint,
  };
}

function formatDate(value?: string) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-BD", {
        dateStyle: "medium",
      }).format(date);
}

const quickLinks = [
  {
    title: "Create complaint",
    description: "Report a new issue in your community.",
    href: "/complaint",
    icon: FilePlus2,
  },
  {
    title: "My complaints",
    description: "Review the status of your submitted complaints.",
    href: "#my-complaints",
    icon: ClipboardList,
  },
  {
    title: "Pending payments",
    description: "Complete payment for complaints that need it.",
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

export default function CitizenDashboard() {
  const complaintsQuery = useGetAllPendingComplaints();
  const paymentsQuery = useMyPaymentsHistory();

  const complaints = getArrayPayload(complaintsQuery.data)
    .map(getComplaint)
    .filter((complaint): complaint is Complaint => complaint !== null);
  const payments = getArrayPayload(paymentsQuery.data)
    .map(getPayment)
    .filter((payment): payment is Payment => payment !== null);
  const pendingPayments = complaints.filter(
    (complaint) => complaint.paymentStatus?.toUpperCase() === "PENDING",
  ).length;
  const resolvedComplaints = complaints.filter((complaint) =>
    ["RESOLVED", "COMPLETED"].includes(complaint.status?.toUpperCase() ?? ""),
  ).length;

  return (
    <main className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Citizen portal
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          My complaint summary
        </h1>
        <p className="mt-2 text-muted-foreground">
          Track your service requests and payments from one place.
        </p>
      </header>

      <section
        aria-label="Complaint summary"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { label: "Total complaints", value: complaints.length },
          { label: "Resolved complaints", value: resolvedComplaints },
          { label: "Pending payments", value: pendingPayments },
          { label: "Payment records", value: payments.length },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="mt-2 text-3xl font-bold">
                {complaintsQuery.isLoading || paymentsQuery.isLoading
                  ? "—"
                  : item.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      {(complaintsQuery.isError || paymentsQuery.isError) && (
        <p role="alert" className="text-sm text-destructive">
          {complaintsQuery.isError && paymentsQuery.isError
            ? "Complaint and payment information could not be loaded."
            : complaintsQuery.isError
              ? "Complaint information could not be loaded."
              : "Payment history could not be loaded."}
          {" Please refresh and try again."}
        </p>
      )}

      <section aria-label="Citizen services">
        <h2 className="text-xl font-semibold">Your services</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {quickLinks.map(({ title, description, href, icon: Icon }) => (
            <Link key={title} href={href} className="group rounded-xl">
              <Card className="h-full transition-colors group-hover:bg-muted/50">
                <CardContent className="flex items-start gap-4 p-5">
                  <span className="rounded-lg bg-primary/10 p-3 text-primary">
                    <Icon aria-hidden="true" className="size-5" />
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
          ))}
        </div>
      </section>

      <section id="my-complaints" className="scroll-mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">My complaints</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Current status of your submitted requests.
            </p>
          </div>
          <Link
            href="/complaint"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <FilePlus2 aria-hidden="true" className="size-4" />
            Create complaint
          </Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border bg-card">
          {complaintsQuery.isLoading ? (
            <p className="p-5 text-sm text-muted-foreground">
              Loading complaints...
            </p>
          ) : complaintsQuery.isError ? (
            <p className="p-5 text-sm text-destructive">
              Unable to load complaints.
            </p>
          ) : complaints.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">
              You have not submitted any complaints yet.
            </p>
          ) : (
            <div className="divide-y">
              {complaints.map((complaint) => (
                <article
                  key={complaint.id}
                  className="flex flex-wrap items-center justify-between gap-3 p-5"
                >
                  <div>
                    <h3 className="font-medium">
                      {complaint.title || "Complaint"}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Submitted {formatDate(complaint.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-medium">
                    <span className="rounded-full bg-muted px-3 py-1">
                      {complaint.status || "Status unavailable"}
                    </span>
                    {complaint.paymentStatus && (
                      <span className="rounded-full bg-muted px-3 py-1">
                        Payment: {complaint.paymentStatus}
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="payment-history" className="scroll-mt-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Payment history</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your latest payment transactions.
            </p>
          </div>
          <Link
            href="/payment-pending"
            className="text-sm font-medium text-primary hover:underline"
          >
            Pending payments
          </Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border bg-card">
          {paymentsQuery.isLoading ? (
            <p className="p-5 text-sm text-muted-foreground">
              Loading payment history...
            </p>
          ) : paymentsQuery.isError ? (
            <p className="p-5 text-sm text-destructive">
              Unable to load payment history.
            </p>
          ) : payments.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">
              No payment history is available yet.
            </p>
          ) : (
            <div className="divide-y">
              {payments.map((payment) => (
                <article
                  key={payment.id}
                  className="flex flex-wrap items-center justify-between gap-3 p-5"
                >
                  <div>
                    <h3 className="font-medium">
                      {payment.complaint?.title ||
                        payment.paymentID ||
                        payment.transactionId ||
                        payment.id}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatDate(payment.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {(payment.amount ?? payment.paymentAmount) !==
                      undefined && (
                      <span className="font-semibold">
                        ৳{payment.amount ?? payment.paymentAmount}
                      </span>
                    )}
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                      {payment.paymentStatus || payment.status || "Recorded"}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
