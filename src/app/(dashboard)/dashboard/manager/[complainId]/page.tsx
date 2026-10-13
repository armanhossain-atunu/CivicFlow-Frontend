"use client";

import { CloseAssignmentButton } from "@/components/common/CloseComplaintButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllComplaints } from "@/hooks/complain.hook";
import type { Complaint } from "@/types/complaints.type";
import { useParams } from "next/navigation";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isComplaint(value: unknown): value is Complaint {
  return isRecord(value) && typeof value.id === "string";
}

function getComplaints(value: unknown): Complaint[] {
  let current = value;

  for (let depth = 0; depth < 4; depth += 1) {
    if (Array.isArray(current)) {
      return current.filter(isComplaint);
    }

    if (!isRecord(current)) {
      return [];
    }

    if (Array.isArray(current.complaints)) {
      current = current.complaints;
    } else if ("data" in current) {
      current = current.data;
    } else {
      return [];
    }
  }

  return Array.isArray(current) ? current.filter(isComplaint) : [];
}

export default function ComplaintDetailsPage() {
  const { data, isLoading } = useGetAllComplaints();

  const { complainId } = useParams<{
    complainId: string;
  }>();

  const complaints = getComplaints(data);

  const complaint = complaints.find((item) => item.id === complainId);

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
          <CardHeader className="flex-row items-center justify-between">
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

  if (!complaint) {
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
      <div>
        <p className="text-sm font-medium text-primary">Complaint Details</p>

        <h1 className="mt-1 text-3xl font-bold">{complaint.title}</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Complaint ID: {complaint.id}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Complaint Information</CardTitle>
          <CloseAssignmentButton
            complaintId={complaint.id}
            status={complaint.status}
          />
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Description
            </p>

            <p className="mt-1">
              {complaint.description || "No description available."}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Department</p>
              <p className="mt-1 font-medium">
                {complaint.department || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="mt-1 font-medium">{complaint.location || "N/A"}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <div className="mt-1">
                <Badge>
                  {complaint.status?.replaceAll("_", " ") || "UNKNOWN"}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Pay Amount</p>
              <div className="mt-1">{complaint.paymentAmount || "N/A"}৳</div>
            </div>
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
