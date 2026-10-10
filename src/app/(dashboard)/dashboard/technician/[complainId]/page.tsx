"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMyAssignments } from "@/hooks/technician.hook";
import { useParams } from "next/navigation";

type Complaint = {
  id: string;
  title?: string;
  description?: string;
  department?: string;
  location?: string;
  status?: string;
  paymentAmount?: number;
  paymentStatus?: string;
};

type Assignment = {
  id: string;
  status?: string;
  complaintId?: string;
  complaint?: Complaint;
};

export default function ComplaintDetailsPage() {
  const { complainId } = useParams<{
    complainId: string;
  }>();

  const { data, isLoading, isError } = useGetMyAssignments();

  console.log("Complaint ID:", complainId);
  console.log("Assignments:", data);

  /*
   * Handle different possible API response structures
   */
  const assignments: Assignment[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.data?.data)
        ? data.data.data
        : [];

  /*
   * Find assignment by complaint ID
   */
  const assignment = assignments.find(
    (item) =>
      item.complaintId === complainId ||
      item.complaint?.id === complainId ||
      item.id === complainId,
  );

  /*
   * Get complaint from assignment
   */
  const complaint = assignment?.complaint;

  if (isLoading) {
    return (
      <main
        className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8"
        aria-busy="true"
        aria-label="Loading complaint details"
      >
        <div className="space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Card>
          <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-6 w-52" />
            <Skeleton className="h-9 w-40" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {["one", "two", "three", "four", "five"].map((item) => (
                <div key={item} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-40" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <Card>
          <CardContent className="py-10 text-center">
            <h1 className="text-xl font-semibold">Failed to load complaint</h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Something went wrong while loading your assignments.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!assignment || !complaint) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <Card>
          <CardContent className="py-10 text-center">
            <h1 className="text-xl font-semibold">Complaint not found</h1>

            <p className="mt-2 text-sm text-muted-foreground">
              No complaint found with ID:
            </p>

            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {complainId}
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-primary">Complaint Details</p>

        <h1 className="mt-1 text-3xl font-bold">
          {complaint.title || "Untitled Complaint"}
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Complaint ID: {complaint.id}
        </p>
      </div>

      {/* Assignment Status */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment Status</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Status</p>

              <p className="mt-1 font-medium">
                {complaint.status?.replaceAll("_", " ") || "UNKNOWN"}
              </p>
            </div>

            <Badge>{complaint.status?.replaceAll("_", " ") || "UNKNOWN"}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Complaint Information */}
      <Card>
        <CardHeader>
          <CardTitle>Complaint Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Description */}
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Description
            </p>

            <p className="mt-1">
              {complaint.description || "No description available."}
            </p>
          </div>

          {/* Information Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Department */}
            <div>
              <p className="text-sm text-muted-foreground">Department</p>

              <p className="mt-1 font-medium">
                {complaint.department || "N/A"}
              </p>
            </div>

            {/* Location */}
            <div>
              <p className="text-sm text-muted-foreground">Location</p>

              <p className="mt-1 font-medium">{complaint.location || "N/A"}</p>
            </div>

            {/* Complaint Status */}
            <div>
              <p className="text-sm text-muted-foreground">Complaint Status</p>

              <div className="mt-1">
                <Badge>
                  {complaint.status?.replaceAll("_", " ") || "UNKNOWN"}
                </Badge>
              </div>
            </div>

            {/* Payment Amount */}
            <div>
              <p className="text-sm text-muted-foreground">Payment Amount</p>

              <p className="mt-1 font-medium">
                {complaint.paymentAmount !== undefined
                  ? `${complaint.paymentAmount}৳`
                  : "N/A"}
              </p>
            </div>

            {/* Payment Status */}
            <div>
              <p className="text-sm text-muted-foreground">Payment Status</p>

              <div className="mt-1">
                <Badge
                  variant={
                    complaint.paymentStatus === "PAID" ? "default" : "outline"
                  }
                >
                  {complaint.paymentStatus || "N/A"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
