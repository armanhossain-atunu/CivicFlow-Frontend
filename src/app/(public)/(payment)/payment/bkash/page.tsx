"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function BkashPaymentResult() {
  const searchParams = useSearchParams();
  const status = (
    searchParams.get("status") ??
    searchParams.get("paymentStatus") ??
    ""
  ).toLowerCase();
  const paymentId = searchParams.get("paymentID");
  const isSuccessful = ["success", "successful", "completed", "paid"].includes(
    status,
  );
  const isFailed = ["failure", "failed", "cancel", "cancelled"].includes(
    status,
  );

  const result = isSuccessful
    ? {
        title: "Payment successful",
        message: "Your bKash payment was completed.",
        styles: "bg-green-100 text-green-700",
      }
    : isFailed
      ? {
          title: "Payment failed",
          message:
            "Your payment was not completed. Your complaint remains unpaid.",
          styles: "bg-red-100 text-red-700",
        }
      : {
          title: "Payment status unavailable",
          message:
            "We could not determine the result of this payment. Check your pending payments before trying again.",
          styles: "bg-amber-100 text-amber-700",
        };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <section className="rounded-2xl border bg-white p-8 text-center shadow-sm sm:p-10">
          <div
            className={`mx-auto flex size-16 items-center justify-center rounded-full text-3xl font-bold ${result.styles}`}
          >
            {isSuccessful ? "✓" : isFailed ? "!" : "?"}
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
            {result.title}
          </h1>
          <p className="mt-3 text-slate-600">{result.message}</p>
          {paymentId && (
            <p className="mt-4 break-all text-sm text-slate-500">
              Payment ID: {paymentId}
            </p>
          )}
          <Link
            href="/payment-pending"
            className="mt-7 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Return to pending payments
          </Link>
        </section>
      </div>
    </main>
  );
}

export default function BkashPage() {
  return (
    <Suspense
      fallback={<p className="py-10 text-center">Loading payment result...</p>}
    >
      <BkashPaymentResult />
    </Suspense>
  );
}
