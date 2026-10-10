"use client";

import { useMemo } from "react";
import { AlertCircle, ChartNoAxesCombined, CreditCard, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useManagerComplaints } from "@/hooks/manager.hook";
import { useGetPayments } from "@/hooks/payments.hook";
import { AdminPage } from "../AdminPage";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getArrayPayload(value: unknown, names: string[]): unknown[] {
  let current = value;
  for (let depth = 0; depth < 4; depth += 1) {
    if (Array.isArray(current)) return current;
    if (!isRecord(current)) return [];

    const record = current;
    const namedArray = names
      .map((name) => record[name])
      .find(Array.isArray);
    if (namedArray) return namedArray;
    if (!("data" in current)) return [];
    current = current.data;
  }
  return Array.isArray(current) ? current : [];
}

function getPaymentStatus(value: unknown): string {
  if (!isRecord(value)) return "UNKNOWN";
  const status = value.paymentStatus ?? value.status;
  return typeof status === "string" ? status.toUpperCase() : "UNKNOWN";
}

export default function AdminReportsPage() {
  const complaintsQuery = useManagerComplaints(1, 100);
  const paymentsQuery = useGetPayments();
  const complaints = complaintsQuery.data?.complaints ?? [];
  const payments = getArrayPayload(paymentsQuery.data, ["payments"]);

  const complaintStatuses = useMemo(() => {
    return complaints.reduce<Record<string, number>>((counts, complaint) => {
      const status = complaint.status.toUpperCase();
      counts[status] = (counts[status] ?? 0) + 1;
      return counts;
    }, {});
  }, [complaints]);

  const paymentStatuses = useMemo(() => {
    return payments.reduce<Record<string, number>>((counts, payment) => {
      const status = getPaymentStatus(payment);
      counts[status] = (counts[status] ?? 0) + 1;
      return counts;
    }, {});
  }, [payments]);

  const hasError = complaintsQuery.isError || paymentsQuery.isError;

  return (
    <AdminPage
      title="Reports"
      description="Operational summaries based on complaint and payment records available to the admin dashboard."
    >
      {hasError && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 p-4 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          Some report data could not be loaded. Available figures are shown below.
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText aria-hidden="true" className="size-4 text-primary" />
              Complaints
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-3xl font-semibold tabular-nums">
              {complaintsQuery.isLoading
                ? "…"
                : (complaintsQuery.data?.total ?? "Unavailable")}
            </p>
            <p className="text-sm text-muted-foreground">
              Total reported complaints
            </p>
            {complaintsQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading status breakdown...
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {Object.entries(complaintStatuses).map(([status, count]) => (
                  <Badge key={status} variant="outline">
                    {status.replaceAll("_", " ")}: {count}
                  </Badge>
                ))}
                {complaints.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No complaint status records available.
                  </p>
                )}
              </div>
            )}
            {complaints.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Status breakdown for {complaints.length} loaded complaints.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard aria-hidden="true" className="size-4 text-primary" />
              Payments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-3xl font-semibold tabular-nums">
              {paymentsQuery.isLoading ? "…" : payments.length}
            </p>
            <p className="text-sm text-muted-foreground">
              Payment records returned by the payments service
            </p>
            {paymentsQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading payment status breakdown...
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {Object.entries(paymentStatuses).map(([status, count]) => (
                  <Badge key={status} variant="outline">
                    {status.replaceAll("_", " ")}: {count}
                  </Badge>
                ))}
                {payments.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No payment records available.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ChartNoAxesCombined
              aria-hidden="true"
              className="size-4 text-primary"
            />
            Report data coverage
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Complaint status counts reflect the first 100 complaint records
          available to this report. Payment counts reflect the records returned
          by the payments service. The current API does not expose a separate
          report aggregation endpoint.
        </CardContent>
      </Card>
    </AdminPage>
  );
}
