"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { usePayForComplaint } from "@/hooks/complain.hook";

function BillingContent() {
  const searchParams = useSearchParams();

  const complaintId = searchParams.get("complaintId");
  const price = searchParams.get("price");
  const { mutateAsync: payForComplaint, isPending } = usePayForComplaint();
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const amount = price ? Number(price) : 0;
  const callbackStatus = (
    searchParams.get("paymentStatus") ??
    searchParams.get("status") ??
    ""
  ).toLowerCase();
  const isPaymentSuccessful = [
    "success",
    "successful",
    "paid",
    "completed",
  ].includes(callbackStatus);
  const isPaymentFailed =
    ["failure", "failed", "cancel", "canceled", "cancelled"].includes(
      callbackStatus,
    ) || Boolean(paymentError);

  const handleBkashPayment = async () => {
    if (!complaintId) {
      toast.add({
        title: "Invalid complaint",
        description: "Complaint ID is missing.",
        type: "error",
      });

      return;
    }

    try {
      setPaymentError(null);
      const result = await payForComplaint(complaintId);

      const bkashURL =
        result?.data?.bkashURL ||
        result?.data?.bkashUrl ||
        result?.data?.paymentURL ||
        result?.data?.paymentUrl ||
        result?.bkashURL ||
        result?.bkashUrl ||
        result?.paymentURL ||
        result?.paymentUrl;

      if (!bkashURL) {
        throw new Error("bKash payment URL was not returned by the server.");
      }

      const paymentUrl = new URL(bkashURL);

      if (paymentUrl.protocol !== "https:") {
        throw new Error("The payment server returned an invalid checkout URL.");
      }

      toast.add({
        title: "Payment created",
        description: "Redirecting you to bKash...",
        type: "success",
      });

      window.location.assign(paymentUrl.toString());
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while creating the payment.";
      setPaymentError(message);
      toast.add({
        title: "Payment failed",
        description: message,
        type: "error",
      });
    }
  };

  if (!complaintId) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <section className="rounded-2xl border bg-white p-8 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              !
            </div>

            <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
              Invalid Payment Request
            </h1>

            <p className="mt-3 leading-7 text-slate-600">
              Complaint ID is missing. Please return to your complaints page and
              try again.
            </p>

            <div className="mt-6">
              <Link href="/complaint">
                <Button>Back to Complaints</Button>
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (isPaymentSuccessful) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <section className="rounded-2xl border bg-white p-8 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-100 text-3xl font-bold text-green-700">
              ✓
            </div>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
              Payment complete
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Payment successful
            </h1>
            <p className="mt-3 text-slate-600">
              Your payment was successful for complaint{" "}
              <span className="font-semibold text-slate-900">
                {complaintId}
              </span>
              .
            </p>
            {amount > 0 && (
              <p className="mt-4 text-2xl font-bold text-slate-900">
                ৳{amount.toLocaleString("en-BD")}
              </p>
            )}
            <Link
              href="/complaint"
              className="mt-7 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
            >
              Return to complaints
            </Link>
          </section>
        </div>
      </main>
    );
  }

  if (isPaymentFailed) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <section className="rounded-2xl border bg-white p-8 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-100 text-3xl font-bold text-red-700">
              !
            </div>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-red-700">
              Payment not completed
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Payment failed
            </h1>
            <p className="mt-3 text-slate-600">
              {paymentError ??
                "Your complaint is still saved with payment pending. You can try the payment again."}
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={handleBkashPayment}
                disabled={isPending}
                className="h-10 bg-pink-600 px-4 text-white hover:bg-pink-700"
              >
                {isPending ? "Creating Payment..." : "Try payment again"}
              </Button>
              <Link
                href="/complaint"
                className="inline-flex h-10 items-center justify-center rounded-lg border px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Return to complaints
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            CivicFlow Billing
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Complete Your Payment
          </h1>

          <p className="mt-3 text-slate-600">
            Complete the bKash payment to continue processing your complaint.
          </p>
        </div>

        {/* Payment Card */}
        <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          {/* Card Header */}
          <div className="border-b bg-slate-50 px-6 py-5 sm:px-8">
            <h2 className="text-lg font-semibold text-slate-900">
              Payment Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review your payment information before continuing.
            </p>
          </div>

          {/* Details */}
          <div className="space-y-5 px-6 py-6 sm:px-8">
            {/* Complaint ID */}
            <div className="flex flex-col gap-2 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm font-medium text-slate-500">
                Complaint ID
              </span>

              <span className="break-all rounded-md bg-slate-100 px-3 py-1.5 font-mono text-sm text-slate-800">
                {complaintId}
              </span>
            </div>

            {/* Amount */}
            <div className="flex items-center justify-between border-b pb-5">
              <span className="text-sm font-medium text-slate-500">
                Payment Amount
              </span>

              <span className="text-2xl font-bold text-slate-900">
                ৳{amount.toLocaleString("en-BD")}
              </span>
            </div>

            {/* Payment Method */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Payment Method
              </span>

              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-pink-600 text-xs font-bold text-white">
                  bK
                </span>

                <span className="font-semibold text-pink-600">bKash</span>
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="border-t bg-slate-50 px-6 py-6 sm:px-8">
            <Button
              type="button"
              onClick={handleBkashPayment}
              disabled={isPending}
              className="h-12 w-full rounded-lg bg-pink-600 text-base font-semibold text-white hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Creating Payment..." : "Pay with bKash"}
            </Button>

            <p className="mt-3 text-center text-xs leading-5 text-slate-500">
              You will be redirected to the bKash payment page to complete your
              transaction securely.
            </p>

            <div className="mt-4 text-center">
              <Link
                href="/complaint"
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                ← Back to Complaints
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function BillingPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
          <div
            className="mx-auto max-w-2xl space-y-4 rounded-xl border bg-card p-6"
            aria-busy="true"
          >
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </main>
      }
    >
      <BillingContent />
    </Suspense>
  );
}
