
"use client";

import { useState } from "react";
import {
  CreditCard,
  MapPin,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import {
  useGetAllPendingComplaints,
  usePayForComplaint,
} from "@/hooks/complain.hook";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";

/* =========================================================
   Types
========================================================= */

type PendingComplaint = {
  id: string;
  title?: string;
  categoryName?: string;
  location?: string;
  paymentAmount?: number | string;
  paymentStatus?: string;
  status?: string;
};

/* =========================================================
   Safe Helpers
========================================================= */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function getAmount(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const amount = Number(value);

    if (Number.isFinite(amount)) {
      return amount;
    }
  }

  return undefined;
}

/* =========================================================
   Parse Complaint
========================================================= */

function parseComplaint(value: unknown): PendingComplaint | null {
  if (!isRecord(value) || typeof value.id !== "string") {
    return null;
  }

  const category = isRecord(value.category)
    ? value.category
    : null;

  const payment = isRecord(value.payment)
    ? value.payment
    : null;

  const paymentStatus =
    getString(value.paymentStatus) ??
    getString(value.payment_status) ??
    getString(payment?.status) ??
    getString(payment?.paymentStatus) ??
    getString(payment?.payment_status);

  const status = getString(value.status);

  return {
    id: value.id,

    title: getString(value.title) ?? "Untitled complaint",

    categoryName:
      getString(value.categoryName) ??
      getString(category?.name) ??
      "—",

    location: getString(value.location) ?? "—",

    paymentAmount:
      getAmount(value.paymentAmount) ??
      getAmount(value.payment_amount) ??
      getAmount(payment?.amount) ??
      getAmount(value.amount) ??
      getAmount(category?.paymentAmount),

    paymentStatus,
    status,
  };
}

/* =========================================================
   Extract Complaint Array
========================================================= */

function getComplaints(value: unknown): PendingComplaint[] {
  let current = value;

  for (let depth = 0; depth < 8; depth++) {
    if (Array.isArray(current)) {
      return current
        .map(parseComplaint)
        .filter(
          (item): item is PendingComplaint => item !== null,
        );
    }

    if (!isRecord(current)) {
      return [];
    }

    // Some APIs return complaints in a named property.
    if (Array.isArray(current.complaints)) {
      return current.complaints
        .map(parseComplaint)
        .filter(
          (item): item is PendingComplaint => item !== null,
        );
    }

    if (!("data" in current)) {
      return [];
    }

    current = current.data;
  }

  return [];
}

/* =========================================================
   Payment URL
========================================================= */

function getPaymentUrl(value: unknown): string | null {
  if (!isRecord(value)) {
    return null;
  }

  const nested = isRecord(value.data) ? value.data : null;

  const candidates = [
    nested?.bkashURL,
    nested?.bkashUrl,
    nested?.paymentURL,
    nested?.paymentUrl,
    nested?.checkoutURL,
    nested?.checkoutUrl,
    value.bkashURL,
    value.bkashUrl,
    value.paymentURL,
    value.paymentUrl,
    value.checkoutURL,
    value.checkoutUrl,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return null;
}

/* =========================================================
   Format Amount
========================================================= */

function formatAmount(amount?: number | string): string {
  if (amount === undefined || amount === "") {
    return "Not available";
  }

  const parsed = getAmount(amount);

  if (parsed === undefined) {
    return "Not available";
  }

  return `৳${parsed.toLocaleString("en-BD")}`;
}

/* =========================================================
   Check Pending Status
========================================================= */

function isPendingPayment(complaint: PendingComplaint): boolean {
  const paymentStatus = complaint.paymentStatus?.trim().toUpperCase();
  const complaintStatus = complaint.status?.trim().toUpperCase();

  return (
    paymentStatus === "PENDING" ||
    paymentStatus === "PAYMENT_PENDING" ||
    complaintStatus === "PAYMENT_PENDING"
  );
}

/* =========================================================
   Payment Pending Component
========================================================= */

export default function PaymentPending() {
  const [payingComplaintId, setPayingComplaintId] =
    useState<string | null>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetAllPendingComplaints();

  const { mutateAsync: payForComplaint } = usePayForComplaint();

  const complaints = getComplaints(data);

  const pendingComplaints = complaints.filter(isPendingPayment);

  /* =======================================================
     Debug: Check API response in browser console
  ======================================================= */

  console.log("Pending payment API response:", data);
  console.log("Parsed complaints:", complaints);
  console.log("Filtered pending complaints:", pendingComplaints);

  /* =======================================================
     Handle Payment
  ======================================================= */

  const handlePayNow = async (complaint: PendingComplaint) => {
    if (payingComplaintId !== null) {
      return;
    }

    setPayingComplaintId(complaint.id);

    try {
      const result: unknown = await payForComplaint(complaint.id);

      const checkoutUrl = getPaymentUrl(result);

      if (!checkoutUrl) {
        throw new Error(
          "The server did not return a bKash checkout URL.",
        );
      }

      let parsedUrl: URL;

      try {
        parsedUrl = new URL(checkoutUrl);
      } catch {
        throw new Error("The checkout URL is invalid.");
      }

      if (
        parsedUrl.protocol !== "https:" ||
        parsedUrl.username ||
        parsedUrl.password
      ) {
        throw new Error("The checkout URL is invalid.");
      }

      window.location.assign(parsedUrl.toString());
    } catch (error) {
      toast.add({
        title: "Payment failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to create payment. Please try again.",
        type: "error",
      });

      setPayingComplaintId(null);
    }
  };

  /* =======================================================
     Loading
  ======================================================= */

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Pending payments
        </h1>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <div className="h-5 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="h-12 rounded bg-muted" />
                <div className="h-12 rounded bg-muted" />
              </CardContent>

              <CardFooter>
                <div className="h-9 w-full rounded bg-muted" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  /* =======================================================
     Error
  ======================================================= */

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl p-4 sm:p-6">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <AlertCircle className="size-10 text-destructive" />

            <h2 className="font-semibold">
              Failed to load complaints
            </h2>

            <p className="text-sm text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "Something went wrong while fetching your complaints."}
            </p>

            <Button
              variant="outline"
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              <RefreshCw
                className={`mr-2 size-4 ${
                  isFetching ? "animate-spin" : ""
                }`}
              />
              {isFetching ? "Retrying..." : "Try again"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* =======================================================
     Main UI
  ======================================================= */

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      {/* Header */}

      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Pending payments
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Complete payment for your submitted complaints.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => void refetch()}
          disabled={isFetching || payingComplaintId !== null}
        >
          <RefreshCw
            className={`mr-2 size-4 ${
              isFetching ? "animate-spin" : ""
            }`}
          />
          Refresh
        </Button>
      </header>

      {/* Summary */}

      <div className="flex items-center gap-3 rounded-xl border p-4">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <CreditCard className="size-5" />
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Complaints awaiting payment
          </p>

          <p className="text-2xl font-bold">
            {pendingComplaints.length}
          </p>
        </div>
      </div>

      {/* Empty State */}

      {pendingComplaints.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted">
              <CreditCard className="size-7 text-muted-foreground" />
            </div>

            <h2 className="font-semibold">
              No pending payments found
            </h2>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              No complaints matched the pending payment statuses.
              Refresh the list or inspect the API response to verify
              the payment status fields.
            </p>

            <Button
              variant="outline"
              className="mt-4"
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              <RefreshCw
                className={`mr-2 size-4 ${
                  isFetching ? "animate-spin" : ""
                }`}
              />
              {isFetching ? "Refreshing..." : "Refresh complaints"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Complaint Cards */

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pendingComplaints.map((complaint) => {
            const isPaying = payingComplaintId === complaint.id;

            return (
              <Card
                key={complaint.id}
                className="flex h-full flex-col transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <div className="mb-2">
                    <Badge variant="outline">
                      Payment pending
                    </Badge>
                  </div>

                  <CardTitle className="line-clamp-2">
                    {complaint.title}
                  </CardTitle>

                  <CardDescription>
                    Category: {complaint.categoryName}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  <div>
                    <p className="mb-1 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <MapPin className="size-3" />
                      Location
                    </p>

                    <p className="line-clamp-2 text-sm">
                      {complaint.location || "—"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-lg bg-muted p-3">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Payment amount
                      </p>

                      <p className="text-lg font-bold">
                        {formatAmount(complaint.paymentAmount)}
                      </p>
                    </div>

                    <Badge variant="secondary">
                      {complaint.paymentStatus ??
                        complaint.status ??
                        "UNKNOWN"}
                    </Badge>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full"
                    disabled={payingComplaintId !== null}
                    onClick={() => void handlePayNow(complaint)}
                  >
                    <CreditCard className="mr-2 size-4" />

                    {isPaying
                      ? "Creating payment..."
                      : "Pay with bKash"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
