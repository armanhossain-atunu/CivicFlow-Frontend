"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useManagerComplaints } from "@/hooks/manager.hook";
import ComplaintTable from "./ComplaintTable";
import ManagerStats from "./ManagerStats";
import GetAllPayments from "@/components/common/getAllPayments";

const PAGE_SIZE = 10;

export default function ManagerDashboard() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useManagerComplaints(page, PAGE_SIZE);
  const complaints = data?.complaints ?? [];
  const totalPages = data?.totalPages ?? 1;

  if (isLoading) {
    return (
      <main
        className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8"
        aria-busy="true"
        aria-label="Loading manager dashboard"
      >
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-4 w-full max-w-xl" />
        </div>
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["stat-one", "stat-two", "stat-three", "stat-four"].map((stat) => (
            <Card key={stat}>
              <CardHeader>
                <Skeleton className="h-4 w-28" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))}
        </section>
        <div className="space-y-2 rounded-xl border p-5">
          <Skeleton className="h-6 w-48" />
          {["complaint-one", "complaint-two", "complaint-three", "complaint-four"].map(
            (row) => (
              <Skeleton key={row} className="h-12 w-full" />
            ),
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-medium text-primary">Operations</p>

        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Manager dashboard
        </h1>

        <p className="mt-2 text-muted-foreground">
          Monitor incoming complaints and connect each request with a
          technician.
        </p>
      </header>
      <ManagerStats
        complaints={complaints}
        totalComplaints={data?.total ?? 0}
      />
      <ComplaintTable
        complaints={complaints}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
      <GetAllPayments/>
    </main>
  );
}
