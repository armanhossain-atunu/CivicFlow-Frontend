
"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetPayments } from "@/hooks/payments.hook";
import { CommonPagination } from "./CommonPagination";
import { CommonSearch } from "./CommonSearch";
import { CommonStatusFilter } from "./CommonStatusFilter";
import { toast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";

const ITEMS_PER_PAGE = 10;

interface PaymentComplaint {
  id?: string | number;
  category?: {
    paymentAmount?: number | string;
  };
}

interface PaymentRecord {
  id?: string | number;
  paymentId?: string | number;
  complaintId?: string | number;
  complaint?: PaymentComplaint;
  transactionId?: string | number;
  trxID?: string | number;
  trxId?: string | number;
  paymentMethod?: string;
  method?: string;
  amount?: number | string;
  paymentAmount?: number | string;
  paymentStatus?: string;
  status?: string;
  createdAt?: string;
  paidAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

interface PaymentPayload {
  payments?: PaymentRecord[];
}

interface PaymentResponse {
  data?: PaymentRecord[] | PaymentPayload;
  [key: string]: unknown;
}

interface PaymentStatusOption {
  value: string;
  label: string;
}

const PAYMENT_STATUS_OPTIONS: PaymentStatusOption[] = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "FAILED", label: "Failed" },
  { value: "CANCELLED", label: "Cancelled" },
];

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatAmount(value?: number | string) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) return "—";

  return `৳${amount.toLocaleString("en-BD")}`;
}

function CopyableId({
  value,
  label,
}: {
  value?: string | number;
  label: string;
}) {
  const [copied, setCopied] = useState(false);
  const copyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeout.current) {
        clearTimeout(copyTimeout.current);
      }
    };
  }, []);

  if (value === undefined || value === null || value === "") {
    return <>—</>;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(true);

      if (copyTimeout.current) {
        clearTimeout(copyTimeout.current);
      }
      copyTimeout.current = setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error(`Failed to copy ${label}:`, error);
      toast.add({
        title: "Copy failed",
        description: `Could not copy the ${label.toLowerCase()}.`,
        type: "error",
      });
    }
  };

  return (
    <div className="flex items-center gap-1">
      <span className="max-w-36 truncate font-mono text-xs" title={String(value)}>
        {value}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-7 shrink-0"
        onClick={handleCopy}
        title={copied ? "Copied" : `Copy ${label}`}
        aria-label={copied ? `${label} copied` : `Copy ${label}`}
      >
        {copied ? (
          <Check className="size-3.5 text-green-600" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </Button>
    </div>
  );
}

function getStatusVariant(status?: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status?.toUpperCase()) {
    case "PAID":
    case "SUCCESS":
    case "COMPLETED":
      return "default" as const;

    case "PENDING":
    case "PAYMENT_PENDING":
      return "secondary" as const;

    case "FAILED":
    case "FAILURE":
    case "CANCELLED":
      return "destructive" as const;

    default:
      return "outline" as const;
  }
}

export default function GetAllPayments() {
  const { data, isLoading, isError, error } = useGetPayments();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);

  if (isLoading) {
    return (
      <Card
        aria-busy="true"
      >
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-48" />
          <div className="space-y-2">
            {["payment-one", "payment-two", "payment-three", "payment-four", "payment-five"].map(
              (row) => (
                <Skeleton key={row} className="h-12 w-full" />
              ),
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <p className="p-6 text-sm text-destructive">
        {error.message || "Failed to load payments."}
      </p>
    );
  }

  // Adjust this according to your actual API response.
  const response = data as any;
  const payments = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.data?.payments)
        ? response.data.payments
        : [];
  const normalizedSearch = search.trim().toLowerCase();
  const filteredPayments = payments.filter((payment: any) => {
    const paymentStatus = String(
      payment.paymentStatus ?? payment.status ?? "",
    )
      .trim()
      .toUpperCase();
    const normalizedStatus =
      paymentStatus === "SUCCESS" || paymentStatus === "COMPLETED"
        ? "PAID"
        : paymentStatus === "PAYMENT_PENDING"
          ? "PENDING"
          : paymentStatus === "FAILURE"
            ? "FAILED"
            : paymentStatus;
    const matchesStatus = status === "ALL" || normalizedStatus === status;
    const matchesSearch =
      normalizedSearch === "" ||
      [
        payment.id,
        payment.paymentId,
        payment.complaintId,
        payment.complaint?.id,
        payment.transactionId,
        payment.trxID,
        payment.trxId,
        payment.paymentMethod,
        payment.method,
        payment.amount,
        payment.paymentAmount,
        paymentStatus,
      ].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(normalizedSearch),
      );

    return matchesStatus && matchesSearch;
  });
  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);
  const currentPage = Math.min(page, Math.max(totalPages, 1));
  const pagePayments = filteredPayments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Payments</CardTitle>
        <p className="text-sm text-muted-foreground">
          Total payments: {filteredPayments.length}
        </p>
      </CardHeader>
      <div className="flex flex-col gap-3 border-b px-6 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <CommonSearch
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Search payments..."
        />
        <CommonStatusFilter
          value={status}
          options={PAYMENT_STATUS_OPTIONS}
          onChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
        />
      </div>

      <CardContent>
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SL</TableHead>
                <TableHead>Payment ID</TableHead>
                <TableHead>Complaint ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {pagePayments.length > 0 ? (
                pagePayments.map((payment: any, index: number) => (
                  <TableRow
                    key={payment.id ?? payment.paymentId ?? index}
                  >
                    <TableCell>
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </TableCell>

                    <TableCell>
                      <CopyableId
                        value={payment.id ?? payment.paymentId}
                        label="Payment ID"
                      />
                    </TableCell>

                    <TableCell>
                      <CopyableId
                        value={payment.complaintId ?? payment.complaint?.id}
                        label="Complaint ID"
                      />
                    </TableCell>

                    <TableCell className="font-medium">
                      {formatAmount(
                        payment.amount ??
                          payment.paymentAmount ??
                          payment.complaint?.category?.paymentAmount,
                      )}
                    </TableCell>

                    <TableCell>
                      {payment.paymentMethod ??
                        payment.method ??
                        "—"}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={getStatusVariant(
                          payment.paymentStatus ?? payment.status,
                        )}
                      >
                        {payment.paymentStatus ??
                          payment.status ??
                          "UNKNOWN"}
                      </Badge>
                    </TableCell>

                    <TableCell className="max-w-40 truncate">
                      {payment.transactionId ??
                        payment.trxID ??
                        payment.trxId ??
                        "—"}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {formatDate(
                        payment.createdAt ??
                          payment.paidAt ??
                          payment.updatedAt,
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No payments match your search or selected status.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {totalPages > 1 && (
          <div className="pt-4">
            <CommonPagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
