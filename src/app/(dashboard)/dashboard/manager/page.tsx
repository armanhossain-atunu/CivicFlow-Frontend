"use client";

import { useGetAllComplaints } from "@/hooks/complain.hook";
import ComplaintTable from "./ComplaintTable";
import ManagerStats from "./ManagerStats";

export default function ManagerDashboard() {
  const { data, isLoading } = useGetAllComplaints();

  const complaints = data?.data?.data ?? [];
console.log(complaints, "this is a complaint table page");
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
<ManagerStats complaints={complaints}/>
      <ComplaintTable complaints={complaints} />
    </main>
  );
}