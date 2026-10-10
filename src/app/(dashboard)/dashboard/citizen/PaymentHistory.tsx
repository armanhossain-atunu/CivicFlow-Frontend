
"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Copy, Share2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CommonPagination } from "@/components/common/CommonPagination";
import { CommonSearch } from "@/components/common/CommonSearch";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";
import type { PaymentHistoryProps } from "@/types/payment.type";

/* =========================================================
   Constants
========================================================= */

const ITEMS_PER_PAGE = 5;

/* =========================================================
   Date Formatter
========================================================= */

function formatDateTime(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

/* =========================================================
   Status Badge
========================================================= */

function getStatusVariant(
  status?: string | null,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status?.toUpperCase()) {
    case "PAID":
    case "SUCCESS":
    case "COMPLETED":
      return "default";

    case "PENDING":
    case "PAYMENT_PENDING":
      return "secondary";

    case "FAILED":
    case "FAILURE":
      return "destructive";

    default:
      return "outline";
  }
}

/* =========================================================
   Payment Method
========================================================= */

function getPaymentMethod(transactionId?: string | null) {
  return transactionId ? "bKash" : "—";
}

/* =========================================================
   Transaction ID: Copy and Share
========================================================= */

function TransactionId({
  transactionId,
}: {
  transactionId?: string | null;
}) {
  const [copied, setCopied] = React.useState(false);

  const copyTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  React.useEffect(() => {
    return () => {
      if (copyTimeout.current) {
        clearTimeout(copyTimeout.current);
      }
    };
  }, []);

  if (!transactionId) {
    return (
      <span className="text-sm text-muted-foreground">
        Transaction ID unavailable
      </span>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transactionId);

      setCopied(true);

      if (copyTimeout.current) {
        clearTimeout(copyTimeout.current);
      }

      copyTimeout.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy transaction ID:", error);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "CivicFlow Payment Transaction",
      text: `CivicFlow Payment Transaction\nTransaction ID: ${transactionId}`,
    };

    try {
      if (typeof navigator.share === "function") {
        await navigator.share(shareData);
        return;
      }

      await handleCopy();
    } catch (error) {
      // Closing the native share dialog is not an application error.
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      console.error("Failed to share transaction ID:", error);
    }
  };

  return (
    <div className="flex min-w-[220px] items-center gap-1">
      <span
        title={transactionId}
        className="max-w-[150px] truncate font-mono text-xs"
      >
        {transactionId}
      </span>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={handleCopy}
        title={copied ? "Copied" : "Copy transaction ID"}
        aria-label="Copy transaction ID"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={handleShare}
        title="Share transaction ID"
        aria-label="Share transaction ID"
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

/* =========================================================
   Payment History
========================================================= */

export default function PaymentHistory({
  payments,
  isLoading,
  isError,
}: PaymentHistoryProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [paymentsSearch, setPaymentsSearch] = React.useState("");

  /* =========================================================
     Search
  ========================================================== */

  const filteredPayments = React.useMemo(() => {
    const query = paymentsSearch.trim().toLowerCase();

    if (!query) return payments;

    return payments.filter((payment) => {
      const title = payment.complaint?.title ?? "";
      const transactionId = payment.transactionId ?? "";
      const status = payment.status ?? "";
      const amount = String(payment.amount ?? "");
      const method = getPaymentMethod(payment.transactionId);

      return [
        title,
        transactionId,
        status,
        amount,
        method,
      ].some((value) => value.toLowerCase().includes(query));
    });
  }, [payments, paymentsSearch]);

  const handlePaymentsSearchChange = (value: string) => {
    setPaymentsSearch(value);
    setCurrentPage(1);
  };

  /* =========================================================
     Pagination
  ========================================================== */

  const totalPages = Math.ceil(
    filteredPayments.length / ITEMS_PER_PAGE,
  );

  React.useEffect(() => {
    setCurrentPage((page) => Math.min(page, Math.max(totalPages, 1)));
  }, [totalPages]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedPayments = filteredPayments.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);

    document.getElementById("payment-history")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  /* =========================================================
     Render
  ========================================================== */

  return (
    <section id="payment-history" className="scroll-mt-6 space-y-4">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Payment History</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Your latest payment transactions.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <CommonSearch
            value={paymentsSearch}
            onChange={handlePaymentsSearchChange}
            placeholder="Search payments..."
          />

          <Link
            href="/payment-pending"
            className="whitespace-nowrap text-sm font-medium text-primary hover:underline"
          >
            Pending payments
          </Link>
        </div>
      </div>

      {/* Table Container */}

      <div className="overflow-hidden rounded-xl border bg-card">
        {/* Loading */}

        {isLoading && (
          <div
            className="space-y-3 p-5"
            aria-busy="true"
          >
            <Skeleton className="h-5 w-48" />
            {["payment-one", "payment-two", "payment-three", "payment-four", "payment-five"].map(
              (row) => (
                <Skeleton key={row} className="h-12 w-full" />
              ),
            )}
          </div>
        )}

        {/* Error */}

        {!isLoading && isError && (
          <div className="p-5 text-sm text-destructive">
            Unable to load payment history. Please try again.
          </div>
        )}

        {/* Empty */}

        {!isLoading && !isError && payments.length === 0 && (
          <div className="p-5 text-sm text-muted-foreground">
            No payment history is available yet.
          </div>
        )}

        {/* No Search Results */}

        {!isLoading &&
          !isError &&
          payments.length > 0 &&
          filteredPayments.length === 0 && (
            <div className="p-5 text-sm text-muted-foreground">
              No payments match your search.
            </div>
          )}

        {/* Payment Table */}

        {!isLoading &&
          !isError &&
          filteredPayments.length > 0 && (
            <>
              <div className="w-full overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Complaint</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Paid At</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {paginatedPayments.map((payment) => {
                      const status = payment.status ?? "RECORDED";

                      return (
                        <TableRow key={payment.id}>
                          {/* Complaint */}

                          <TableCell>
                            <div className="min-w-[160px]">
                              <p className="font-medium">
                                {payment.complaint?.title ?? "Complaint"}
                              </p>
                            </div>
                          </TableCell>

                          {/* Method */}

                          <TableCell>
                            <Badge variant="outline">
                              {getPaymentMethod(payment.transactionId)}
                            </Badge>
                          </TableCell>

                          {/* Transaction ID */}

                          <TableCell>
                            <TransactionId
                              transactionId={payment.transactionId}
                            />
                          </TableCell>

                          {/* Amount */}

                          <TableCell className="whitespace-nowrap font-semibold">
                            {payment.amount !== undefined &&
                            payment.amount !== null
                              ? `৳${payment.amount}`
                              : "—"}
                          </TableCell>

                          {/* Paid At */}

                          <TableCell className="whitespace-nowrap">
                            {formatDateTime(payment.paidAt)}
                          </TableCell>

                          {/* Status */}

                          <TableCell>
                            <Badge variant={getStatusVariant(status)}>
                              {status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}

              {totalPages > 1 && (
                <div className="border-t p-4">
                  <CommonPagination
                    page={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
      </div>
    </section>
  );
}
