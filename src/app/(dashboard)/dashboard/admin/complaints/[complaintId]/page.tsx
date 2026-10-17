
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Star } from "lucide-react";

import { CloseAssignmentButton } from "@/components/common/CloseComplaintButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useManagerComplaint } from "@/hooks/manager.hook";
import { useGetFeedbacks } from "@/hooks/complain.hook";
import type { FeedbackRecord } from "@/types/complaints.type";

// Check whether a value is an object
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// Extract feedback records from nested API responses
function getFeedbackRecords(value: unknown): FeedbackRecord[] {
  let current = value;

  for (let depth = 0; depth < 5; depth += 1) {
    if (Array.isArray(current)) {
      return current.filter(
        (item): item is FeedbackRecord =>
          isRecord(item) &&
          typeof item.complaintId === "string" &&
          typeof item.rating === "number",
      );
    }

    if (!isRecord(current) || !("data" in current)) {
      return [];
    }

    current = current.data;
  }

  return [];
}

// Format date using Bangladesh time
function formatDate(value?: string) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleString("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dhaka",
  });
}

export default function ComplaintDetailsPage() {
  const params = useParams<{ complaintId: string }>();
  const complaintId = params.complaintId;

  const {
    data: complaint,
    isLoading,
    isError,
    error,
  } = useManagerComplaint(complaintId);


  const feedbackQuery = useGetFeedbacks();

  const feedback = getFeedbackRecords(feedbackQuery.data).find(
    (record) => record.complaintId === complaintId,
  );
  if (isLoading) {
    return (
      <main
        className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8"
        aria-busy="true"
        aria-label="Loading complaint details"
      >
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-3/4" />

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-52" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </main>
    );
  }

  if (isError || !complaint) {
    return (
      <main className="mx-auto w-full max-w-5xl space-y-4 px-4 py-8">
        <Button variant="outline" >
          <Link href="/dashboard/admin/complaints">
            Back to complaints
          </Link>
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

  const citizenName = feedback?.citizen?.name || "Unknown Citizen";

  const initials =
    citizenName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "C";

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
      <Button variant="outline">
        <Link href="/dashboard/admin/complaints">
          Back to complaints
        </Link>
      </Button>

      <div>
        <p className="text-sm font-medium text-primary">
          Complaint Details
        </p>
        <h1 className="mt-1 text-3xl font-bold">{complaint.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Complaint ID: {complaint.id}
        </p>
      </div>

      {/* Complaint Information */}
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
              <p className="mt-1 font-medium">
                {complaint.category || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="mt-1 font-medium">
                {complaint.location || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <div className="mt-1">
                <Badge>
                  {complaint.status.replaceAll("_", " ")}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Payment Status
              </p>
              <div className="mt-1">
                <Badge
                  variant={
                    complaint.paymentStatus === "PAID"
                      ? "default"
                      : "outline"
                  }
                >
                  {complaint.paymentStatus || "N/A"}
                </Badge>
              </div>
            </div>

            {complaint.createdAt && (
              <div>
                <p className="text-sm text-muted-foreground">
                  Submitted
                </p>
                <p className="mt-1 font-medium">
                  {formatDate(complaint.createdAt) || "N/A"}
                </p>
              </div>
            )}

            {complaint.citizenName && (
              <div>
                <p className="text-sm text-muted-foreground">
                  Submitted by
                </p>
                <p className="mt-1 font-medium">
                  {complaint.citizenName}
                </p>

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

      {/* Feedback: only show if feedback belongs to this complaint */}
      {feedback && (
        <section
          aria-labelledby="complaint-feedback-heading"
          className="space-y-5 rounded-xl border bg-card p-5 shadow-sm sm:p-6"
        >
              <div className="flex items-center justify-between gap-3">
                <h2
                  id="complaint-feedback-heading"
                  className="text-xl font-semibold"
                >
                  Feedback
                </h2>

                <span className="rounded-full bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-600">
                  {feedback.rating}/5 Rating
                </span>
              </div>

              <div className="grid gap-5 md:grid-cols-[1fr_auto]">
                {/* Feedback Details */}
                <article className="min-w-0 space-y-3">
                  <div
                    className="flex flex-wrap items-center gap-1"
                    role="img"
                    aria-label={`Rated ${feedback.rating} out of 5 stars`}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        aria-hidden="true"
                        className={`size-5 ${
                          star <= feedback.rating
                            ? "fill-amber-500 text-amber-500"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}

                    <span className="ml-2 text-sm font-medium">
                      {feedback.rating} out of 5
                    </span>
                  </div>

                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Citizen Comment
                    </p>

                    <p className="whitespace-pre-wrap break-words text-sm leading-6">
                      {feedback.comment || "No comment provided."}
                    </p>
                  </div>

                  {feedback.createdAt && (
                    <p className="text-xs text-muted-foreground">
                      Submitted {formatDate(feedback.createdAt)}
                    </p>
                  )}
                </article>

                {/* Citizen Information */}
                <aside className="space-y-3 rounded-lg border p-4 md:min-w-56">
                  <h3 className="text-sm font-semibold">Citizen Information</h3>

                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="size-12">
                      <AvatarImage
                        src={feedback.citizen?.imageUrl || undefined}
                        alt={citizenName}
                      />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 space-y-1">
                      <p className="break-words text-sm font-medium">
                        {citizenName}
                      </p>
                      <p className="break-all text-xs text-muted-foreground">
                        {feedback.citizen?.email || "Not available"}
                      </p>
                    </div>
                  </div>
                </aside>
              </div>
        </section>
      )}
    </main>
  );
}
