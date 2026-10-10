"use client";

import { useState } from "react";
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
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p>Loading complaints...</p>
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
