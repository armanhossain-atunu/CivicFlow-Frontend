"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

import apiClient from "@/lib/apiClient";

function BkashPaymentResult() {
  const searchParams = useSearchParams();
  const status = (
    searchParams.get("status") ??
    searchParams.get("paymentStatus") ??
    ""
  ).toLowerCase();
  const paymentId = searchParams.get("paymentID");
  const callbackParams = searchParams.toString();
  const processedCallback = useRef<string | null>(null);
  const [callbackState, setCallbackState] = useState<
    "processing" | "processed" | "error" | "unavailable"
  >("processing");
  const isSuccessfulStatus = [
    "success",
    "successful",
    "completed",
    "paid",
  ].includes(status);
  const isFailedStatus = [
    "failure",
    "failed",
    "cancel",
    "canceled",
    "cancelled",
  ].includes(status);

  useEffect(() => {
    if (!paymentId || (!isSuccessfulStatus && !isFailedStatus)) {
      setCallbackState("unavailable");
      return;
    }

    if (processedCallback.current === callbackParams) {
      return;
    }
    processedCallback.current = callbackParams;

    const params = new URLSearchParams(callbackParams);
    params.set("paymentID", paymentId);
    params.set("status", status);

    apiClient(`/payments/bkash/callback?${params.toString()}`, {
      method: "GET",
    })
      .then(() => setCallbackState("processed"))
      .catch(() => setCallbackState("error"));
  }, [callbackParams, isFailedStatus, isSuccessfulStatus, paymentId, status]);

  const isSuccessful = callbackState === "processed" && isSuccessfulStatus;
  const isFailed = callbackState === "processed" && isFailedStatus;

  const result = isSuccessful
    ? {
        title: "Payment successful",
        message: "Your bKash payment was confirmed by the payment server.",
        styles: "bg-green-100 text-green-700",
      }
    : isFailed
      ? {
          title: "Payment failed",
          message:
            "Your payment was not completed. Your complaint remains unpaid.",
          styles: "bg-red-100 text-red-700",
        }
      : callbackState === "processing"
        ? {
            title: "Confirming payment",
            message: "We are confirming your payment with the payment server.",
            styles: "bg-amber-100 text-amber-700",
          }
        : {
            title: "Payment status unavailable",
            message:
              callbackState === "error"
                ? "We could not send the payment result to the server. Check your pending payments before trying again."
                : "We could not determine the result of this payment. Check your pending payments before trying again.",
            styles: "bg-amber-100 text-amber-700",
          };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <section className="rounded-2xl border bg-white p-8 text-center shadow-sm sm:p-10">
          <div
            className={`mx-auto flex size-16 items-center justify-center rounded-full text-3xl font-bold ${result.styles}`}
          >
            {isSuccessful
              ? "✓"
              : isFailed
                ? "!"
                : callbackState === "processing"
                  ? "…"
                  : "?"}
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
