"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export default function BillingPage() {
  const searchParams = useSearchParams();

  const complaintId = searchParams.get("complaintId");
  const price = searchParams.get("price");

  const [isPending, setIsPending] = useState(false);

  const amount = price ? Number(price) : 0;

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
      setIsPending(true);

      const baseUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!baseUrl) {
        throw new Error("API URL is not configured.");
      }

      const response = await fetch(
        `${baseUrl}/payments/complaint/${encodeURIComponent(
          complaintId,
        )}/bkash/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.error?.message ||
            "Unable to create bKash payment.",
        );
      }

      /**
       * Expected backend response example:
       *
       * {
       *   success: true,
       *   message: "Payment created successfully",
       *   data: {
       *     paymentID: "TRX123",
       *     bkashURL: "https://..."
       *   }
       * }
       */

      const bkashURL =
        result?.data?.bkashURL ||
        result?.data?.bkashUrl ||
        result?.data?.paymentURL ||
        result?.data?.paymentUrl;

      if (!bkashURL) {
        throw new Error("bKash payment URL was not returned by the server.");
      }

      toast.add({
        title: "Payment created",
        description: "Redirecting you to bKash...",
        type: "success",
      });

      window.location.href = bkashURL;
    } catch (error) {
      toast.add({
        title: "Payment failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong while creating the payment.",
        type: "error",
      });
    } finally {
      setIsPending(false);
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
              Complaint ID is missing. Please return to your complaints page
              and try again.
            </p>

            <div className="mt-6">
              <Link href="/complaints">
                <Button>Back to Complaints</Button>
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
              You will be redirected to the bKash payment page to complete
              your transaction securely.
            </p>

            <div className="mt-4 text-center">
              <Link
                href="/complaints"
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