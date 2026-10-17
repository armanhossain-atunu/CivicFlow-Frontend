/** biome-ignore-all lint/style/useImportType: <explanation> */
"use client";

import { ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import {
  useGetFeedbacks,
  useGetSingleComplaint,
  usePayForComplaint,
} from "@/hooks/complain.hook";
import type {
  ComplaintDetailsData,
  FeedbackRecord,
} from "@/types/complaints.type";

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
        timeZone: "Asia/Dhaka",
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

function getFeedbackRecords(value: unknown): FeedbackRecord[] {
  let current = value;

  for (let depth = 0; depth < 4; depth += 1) {
    if (Array.isArray(current)) {
      return current.filter(
        (item): item is FeedbackRecord =>
          isRecord(item) &&
          typeof item.complaintId === "string" &&
          typeof item.rating === "number" &&
          typeof item.comment === "string",
      );
    }

    if (!isRecord(current) || !("data" in current)) {
      return [];
    }

    current = current.data;
  }

  return [];
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
  const feedbackQuery = useGetFeedbacks();

  const { mutateAsync: payForComplaint, isPending: isPaying } =
    usePayForComplaint();
  const complaint = complaintQuery.data
    ? normalizeComplaint(complaintQuery.data)
    : null;
  const feedback = getFeedbackRecords(feedbackQuery.data).find(
    (record) => record.complaintId === complaintId,
  );
  console.log(feedback?.citizen, "feedback");

  const handlePayNow = async (id: string) => {
    try {
      const result = await payForComplaint(id);
      const paymentUrl =
        result?.data?.bkashURL ??
        result?.data?.bkashUrl ??
        result?.data?.paymentURL ??
        result?.data?.paymentUrl ??
        result?.bkashURL ??
        result?.bkashUrl ??
        result?.paymentURL ??
        result?.paymentUrl;

      if (!paymentUrl) {
        throw new Error("The server did not return a bKash checkout URL.");
      }

      const checkoutUrl = new URL(paymentUrl);
      if (
        checkoutUrl.protocol !== "https:" ||
        checkoutUrl.username ||
        checkoutUrl.password
      ) {
        throw new Error("The payment server returned an invalid checkout URL.");
      }

      window.location.assign(checkoutUrl.toString());
    } catch (error) {
      toast.add({
        title: "Payment failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to create payment. Please try again.",
        type: "error",
      });
    }
  };

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
        <article
          className="space-y-6 rounded-xl border bg-card p-6"
          aria-busy="true"
          aria-label="Loading complaint details"
        >
          <div className="space-y-3">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <dl className="grid gap-5 border-t pt-5 sm:grid-cols-2">
            {["one", "two", "three", "four", "five", "six"].map((item) => (
              <div key={item} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-40" />
              </div>
            ))}
          </dl>
        </article>
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
        <>
          <article className="space-y-6 rounded-xl border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  {complaint.title || "Complaint"}
                </h2>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                  {complaint.description || "No description provided."}
                </p>
              </div>
              {complaint.status === "PAYMENT_PENDING" && (
                <Button
                  type="button"
                  className="shrink-0"
                  disabled={isPaying}
                  onClick={() => void handlePayNow(complaint.id)}
                >
                  {isPaying ? "Creating payment..." : "Pay Now"}
                </Button>
              )}
            </div>

            <dl className="grid gap-5 border-t pt-5 sm:grid-cols-2">
              <Detail label="Status">{complaint.status}</Detail>
              <Detail label="Submitted">
                {formatDate(complaint.createdAt)}
              </Detail>
              <Detail label="Department">{complaint.department}</Detail>
              <Detail label="Category">{complaint.category}</Detail>
              <Detail label="Location">{complaint.location}</Detail>
              <Detail label="Payment status">{complaint.paymentStatus}</Detail>
              <Detail label="Payment amount">
                {formatCurrency(complaint.paymentAmount)}
              </Detail>
            </dl>
          </article>

          {feedbackQuery.isPending ? (
            <section
              className="space-y-3 rounded-xl border bg-card p-6"
              aria-busy="true"
              aria-label="Loading feedback"
            >
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-28" />
            </section>
          ) : feedbackQuery.isError ? (
            <section className="space-y-3 rounded-xl border border-destructive/30 bg-card p-6">
              <p role="alert" className="text-sm text-destructive">
                {feedbackQuery.error instanceof Error
                  ? feedbackQuery.error.message
                  : "Could not load feedback."}
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => void feedbackQuery.refetch()}
              >
                Try again
              </Button>
            </section>
          ) : feedback ? (
            <section
              aria-labelledby="complaint-feedback-heading"
              className="space-y-5 rounded-xl border bg-card p-5 shadow-sm sm:p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <h2
                  id="complaint-feedback-heading"
                  className="text-xl font-semibold"
                >
                  Feedback
                </h2>

                <span className="rounded-full bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-600">
                  {feedback.rating}/5 Rating
                </span>
              </div>

              <div className="grid gap-5 md:grid-cols-[1fr_auto]">
                {/* Feedback Details */}
                <article className="min-w-0 space-y-3">
                  <div
                    className="flex flex-wrap items-center gap-1"
                    role="img"
                    aria-label={`Rated ${feedback.rating} out of 5 stars`}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        aria-hidden="true"
                        className={`size-5 ${
                          star <= feedback.rating
                            ? "fill-amber-500 text-amber-500"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}

                    <span className="ml-2 text-sm font-medium">
                      {feedback.rating} out of 5
                    </span>
                  </div>

                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Citizen Comment
                    </p>

                    <p className="whitespace-pre-wrap break-words text-sm leading-6">
                      {feedback.comment || "No comment provided."}
                    </p>
                  </div>

                  {feedback.createdAt && (
                    <p className="text-xs text-muted-foreground">
                      Submitted {formatDate(feedback.createdAt)}
                    </p>
                  )}
                </article>

                {/* Citizen Information */}
                <aside className="space-y-3 rounded-lg border p-4 md:min-w-56">
                  <h3 className="text-sm font-semibold">Citizen Information</h3>

                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="break-words text-sm font-medium">
                      {feedback.citizen?.name || "Unknown"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="break-all text-sm font-medium">
                      {feedback.citizen?.email || "Not available"}
                    </p>
                  </div>
                </aside>
              </div>
            </section>
          ) : null}
        </>
      )}
    </main>
  );
}
