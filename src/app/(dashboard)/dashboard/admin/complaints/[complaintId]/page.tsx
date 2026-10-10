"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { CloseAssignmentButton } from "@/components/common/CloseComplaintButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useManagerComplaint } from "@/hooks/manager.hook";

export default function ComplaintDetailsPage() {
  const { complaintId } = useParams<{ complaintId: string }>();
  const {
    data: complaint,
    isLoading,
    isError,
    error,
  } = useManagerComplaint(complaintId);

  if (isLoading) {
    return (
      <main
        className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8"
        aria-busy="true"
        aria-label="Loading complaint details"
      >
        <Skeleton className="h-9 w-40" />
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
              {[
                "department",
                "category",
                "location",
                "status",
                "payment",
                "submitted",
              ].map((field) => (
                <div key={field} className="space-y-2">
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

  if (isError || !complaint) {
    return (
      <main className="mx-auto w-full max-w-5xl space-y-4 px-4 py-8">
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/dashboard/admin/complaints" />}
        >
          Back to complaints
        </Button>
        <Card>
          <CardContent className="py-10 text-center">
            <h1 className="text-xl font-semibold">
              {isError ? "Unable to load complaint" : "Complaint not found"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {error instanceof Error
                ? error.message
                : `No complaint found with ID: ${complaintId}`}
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
      <Button
        variant="outline"
        nativeButton={false}
        render={<Link href="/dashboard/admin/complaints" />}
      >
        Back to complaints
      </Button>
      <div>
        <p className="text-sm font-medium text-primary">Complaint Details</p>
        <h1 className="mt-1 text-3xl font-bold">{complaint.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Complaint ID: {complaint.id}
        </p>
      </div>

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
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
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="mt-1 font-medium">{complaint.category || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="mt-1 font-medium">{complaint.location || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <div className="mt-1">
                <Badge>{complaint.status.replaceAll("_", " ")}</Badge>
              </div>
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
            {/* <div>
              <p className="text-sm text-muted-foreground">Assigned technician</p>
              <p className="mt-1 font-medium">
                {complaint.technicianName ?? complaint.technicianId ?? "Unassigned"}
              </p>
            </div> */}
            {complaint.createdAt && (
              <div>
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="mt-1 font-medium">
                  {new Date(complaint.createdAt).toLocaleString("en-BD", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "Asia/Dhaka",
                  })}
                </p>
              </div>
            )}
            {complaint.citizenName && (
              <div>
                <p className="text-sm text-muted-foreground">Submitted by</p>
                <p className="mt-1 font-medium">{complaint.citizenName}</p>
                {complaint.citizenEmail && (
                  <p className="text-sm text-muted-foreground">
                    {complaint.citizenEmail}
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
