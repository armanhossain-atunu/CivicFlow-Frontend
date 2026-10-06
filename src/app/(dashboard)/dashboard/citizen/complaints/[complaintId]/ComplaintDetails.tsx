"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGetSingleComplaint } from "@/hooks/complain.hook";

type ComplaintDetailsData = {
  id: string;
  title?: string;
  description?: string;
  status?: string;
  paymentStatus?: string;
  paymentAmount?: number;
  department?: string;
  category?: string;
  location?: string;
  createdAt?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unwrapComplaint(value: unknown): unknown {
  let current = value;

  for (let depth = 0; depth < 4; depth += 1) {
    if (!isRecord(current)) {
      return current;
    }

    if (isRecord(current.complaint)) {
      current = current.complaint;
    } else if ("data" in current) {
      current = current.data;
    } else {
      return current;
    }
  }

  return current;
}

function getText(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value;
  }

  if (isRecord(value)) {
    return getText(value.name) ?? getText(value.title);
  }

  return undefined;
}

function normalizeComplaint(value: unknown): ComplaintDetailsData | null {
  const record = unwrapComplaint(value);
  if (!isRecord(record)) {
    return null;
  }

  const id =
    typeof record.id === "string"
      ? record.id
      : typeof record._id === "string"
        ? record._id
        : undefined;

  if (!id) {
    return null;
  }

  const paymentAmountValue =
    typeof record.paymentAmount === "number"
      ? record.paymentAmount
      : typeof record.paymentAmount === "string"
        ? Number(record.paymentAmount)
        : undefined;

  return {
    id,
    title: getText(record.title) ?? getText(record.complaintTitle),
    description: getText(record.description),
    status: getText(record.status),
    paymentStatus: getText(record.paymentStatus),
    paymentAmount: Number.isFinite(paymentAmountValue)
      ? paymentAmountValue
      : undefined,
    department: getText(record.department),
    category: getText(record.category),
    location: getText(record.location),
    createdAt: getText(record.createdAt),
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
        timeStyle: "short",
      }).format(date);
}

function formatCurrency(value?: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "—";
  }

  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(value);
}

function Detail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium">{children || "—"}</dd>
    </div>
  );
}

export default function ComplaintDetails({
  complaintId,
}: {
  complaintId: string;
}) {
  const complaintQuery = useGetSingleComplaint(complaintId);
  const complaint = complaintQuery.data
    ? normalizeComplaint(complaintQuery.data)
    : null;

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/dashboard/citizen#my-complaints"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to my complaints
      </Link>

      <header>
        <p className="text-sm font-medium text-primary">My complaints</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Complaint details
        </h1>
        <p className="mt-2 break-all text-sm text-muted-foreground">
          Complaint ID: {complaintId}
        </p>
      </header>

      {complaintQuery.isPending ? (
        <output className="block rounded-xl border bg-card p-6 text-sm text-muted-foreground">
          Loading complaint details…
        </output>
      ) : complaintQuery.isError ? (
        <div className="space-y-3 rounded-xl border border-destructive/30 bg-card p-6">
          <p role="alert" className="text-sm text-destructive">
            {complaintQuery.error instanceof Error
              ? complaintQuery.error.message
              : "Could not load complaint details."}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => void complaintQuery.refetch()}
          >
            Try again
          </Button>
        </div>
      ) : !complaint ? (
        <p
          role="alert"
          className="rounded-xl border bg-card p-6 text-sm text-destructive"
        >
          The complaint details response has an unexpected format.
        </p>
      ) : (
        <article className="space-y-6 rounded-xl border bg-card p-6">
          <div>
            <h2 className="text-xl font-semibold">
              {complaint.title || "Complaint"}
            </h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {complaint.description || "No description provided."}
            </p>
          </div>

          <dl className="grid gap-5 border-t pt-5 sm:grid-cols-2">
            <Detail label="Status">{complaint.status}</Detail>
            <Detail label="Submitted">{formatDate(complaint.createdAt)}</Detail>
            <Detail label="Department">{complaint.department}</Detail>
            <Detail label="Category">{complaint.category}</Detail>
            <Detail label="Location">{complaint.location}</Detail>
            <Detail label="Payment status">{complaint.paymentStatus}</Detail>
            <Detail label="Payment amount">
              {formatCurrency(complaint.paymentAmount)}
            </Detail>
          </dl>
        </article>
      )}
    </main>
  );
}
