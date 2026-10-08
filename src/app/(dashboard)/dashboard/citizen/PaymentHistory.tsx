
"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Copy, Share2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { PaymentHistoryProps } from "@/types/payment.type";

/* =========================================================
   Constants
========================================================= */

const ITEMS_PER_PAGE = 5;

/* =========================================================
   Date Formatter
========================================================= */

function formatDateTime(value?: string | null) {
  if (!value) {
    return "—";
  }

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
  return transactionId ? "Bkash" : "—";
}

/* =========================================================
   Transaction ID Component
========================================================= */

function TransactionId({ transactionId }: { transactionId?: string | null }) {
  const [copied, setCopied] = React.useState(false);

  if (!transactionId) {
    return <span className="text-muted-foreground">—</span>;
  }

  const handleShare = async () => {
    try {
      /* ==========================================
         Native Share API
      ========================================== */

      if (navigator.share) {
        await navigator.share({
          title: "Payment Transaction",
          text: `Transaction ID: ${transactionId}`,
        });

        return;
      }

      /* ==========================================
         Fallback: Copy to Clipboard
      ========================================== */

      await navigator.clipboard.writeText(transactionId);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Transaction share failed:", error);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transactionId);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Transaction copy failed:", error);
    }
  };

  return (
    <div className="flex min-w-[220px] items-center gap-2">
      {/* Transaction ID */}

      <span
        title={transactionId}
        className="max-w-[150px] truncate font-mono text-sm"
      >
        {transactionId}
      </span>

      {/* Copy */}

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={handleCopy}
        title="Copy transaction ID"
      >
        {copied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}

        <span className="sr-only">
          {copied ? "Copied" : "Copy transaction ID"}
        </span>
      </Button>

      {/* Share */}

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={handleShare}
        title="Share transaction ID"
      >
        <Share2 className="h-4 w-4" />

        <span className="sr-only">Share transaction ID</span>
      </Button>
    </div>
  );
}

/* =========================================================
   Pagination
========================================================= */

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Page Information */}

      <p className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{currentPage}</span>{" "}
        of <span className="font-medium text-foreground">{totalPages}</span>
      </p>

      {/* Buttons */}

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </Button>

        {/* Page Numbers */}

        <div className="hidden items-center gap-1 sm:flex">
          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;

            return (
              <Button
                key={page}
                type="button"
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                className="h-9 w-9 p-0"
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            );
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
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

  /* =========================================================
     Total Pages
  ========================================================== */

  const totalPages = Math.ceil(payments.length / ITEMS_PER_PAGE);

  /* =========================================================
     Reset Page
  ========================================================== */

  React.useEffect(() => {
    if (currentPage > Math.max(totalPages, 1)) {
      setCurrentPage(Math.max(totalPages, 1));
    }
  }, [currentPage, totalPages]);

  /* =========================================================
     Paginated Payments
  ========================================================== */

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedPayments = payments.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  /* =========================================================
     Page Change
  ========================================================== */

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    document
      .getElementById("payment-history")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  return (
    <section id="payment-history" className="scroll-mt-6">
      {/* =====================================================
          Header
      ====================================================== */}

      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Payment History</h2>

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

      {/* =====================================================
          Table Container
      ====================================================== */}

      <div className="mt-4 overflow-hidden rounded-xl border bg-card">
        {/* =====================================================
            Loading
        ====================================================== */}

        {isLoading && (
          <div className="p-5 text-sm text-muted-foreground">
            Loading payment history...
          </div>
        )}

        {/* =====================================================
            Error
        ====================================================== */}

        {!isLoading && isError && (
          <div className="p-5 text-sm text-destructive">
            Unable to load payment history.
          </div>
        )}

        {/* =====================================================
            Empty
        ====================================================== */}

        {!isLoading && !isError && payments.length === 0 && (
          <div className="p-5 text-sm text-muted-foreground">
            No payment history is available yet.
          </div>
        )}

        {/* =====================================================
            Table
        ====================================================== */}

        {!isLoading && !isError && payments.length > 0 && (
          <>
            <div className="w-full overflow-x-auto">
              <Table>
                {/* =================================================
                    Header
                ================================================== */}

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

                {/* =================================================
                    Body
                ================================================== */}

                <TableBody>
                  {paginatedPayments.map((payment) => {
                    const status = payment.status ?? "RECORDED";

                    return (
                      <TableRow key={payment.id}>
                        {/* =========================================
                            Complaint
                        ========================================== */}

                        <TableCell>
                          <div className="min-w-[200px]">
                            <p className="font-medium">
                              {payment.complaint?.title ?? "Complaint"}
                            </p>
                          </div>
                        </TableCell>

                        {/* =========================================
                            Method
                        ========================================== */}

                        <TableCell>
                          <Badge variant="outline">
                            {getPaymentMethod(payment.transactionId)}
                          </Badge>
                        </TableCell>

                        {/* =========================================
                            Transaction ID
                        ========================================== */}

                        <TableCell>
                          <TransactionId
                            transactionId={payment.transactionId}
                          />
                        </TableCell>

                        {/* =========================================
                            Amount
                        ========================================== */}

                        <TableCell className="whitespace-nowrap font-semibold">
                          {payment.amount !== undefined &&
                          payment.amount !== null
                            ? `৳${payment.amount}`
                            : "—"}
                        </TableCell>

                        {/* =========================================
                            Paid At
                        ========================================== */}

                        <TableCell className="whitespace-nowrap">
                          {formatDateTime(payment.paidAt)}
                        </TableCell>

                        {/* =========================================
                            Status
                        ========================================== */}

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

            {/* =====================================================
                Pagination
            ====================================================== */}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </section>
  );
}
