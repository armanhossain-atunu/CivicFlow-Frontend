
"use client";

import { Star } from "lucide-react";
import { useParams } from "next/navigation";

import { CloseAssignmentButton } from "@/components/common/CloseComplaintButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import {
  useGetAllComplaints,
  useGetFeedbacks,
} from "@/hooks/complain.hook";

import type {
  Complaint,
  FeedbackRecord,
} from "@/types/complaints.type";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isComplaint(value: unknown): value is Complaint {
  return isRecord(value) && typeof value.id === "string";
}

function getComplaints(value: unknown): Complaint[] {
  let current = value;

  for (let depth = 0; depth < 5; depth += 1) {
    if (Array.isArray(current)) {
      return current.filter(isComplaint);
    }

    if (!isRecord(current)) return [];

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
  const { complainId } = useParams<{ complainId: string }>();

  const { data, isLoading } = useGetAllComplaints();
  const feedbackQuery = useGetFeedbacks();

  const complaints = getComplaints(data);
  const complaint = complaints.find((item) => item.id === complainId);

  const feedback = getFeedbackRecords(feedbackQuery.data).find(
    (item) => item.complaintId === complainId,
  );

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
          <CardHeader>
            <Skeleton className="h-6 w-52" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-20 w-full" />
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
            <h1 className="text-xl font-semibold">
              Complaint not found
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              No complaint found with ID:
            </p>
            <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
              {complainId}
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
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="mt-1 font-medium">
                {complaint.location || "N/A"}
              </p>
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
              <p className="mt-1 font-medium">
                {complaint.paymentAmount ?? "N/A"}৳
              </p>
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
          </div>
        </CardContent>
      </Card>

      {/* Feedback Section: render only if matching feedback exists */}
      {feedback && (
        <Card>
          <CardHeader>
            <CardTitle>Citizen Feedback</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-6 md:grid-cols-[1fr_auto]">
              {/* Rating and comment */}
              <div className="min-w-0 space-y-4">
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

                  <span className="ml-2 text-sm font-semibold">
                    {feedback.rating} out of 5
                  </span>
                </div>

                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Comment
                  </p>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6">
                    {feedback.comment || "No comment provided."}
                  </p>
                </div>

                {feedback.createdAt && (
                  <p className="text-xs text-muted-foreground">
                    Submitted {formatDate(feedback.createdAt)}
                  </p>
                )}
              </div>

              {/* Citizen profile */}
              <aside className="flex min-w-0 items-center gap-3 rounded-lg border p-4 md:min-w-64 md:self-start">
                <Avatar className="size-12">
                  <AvatarImage
                    src={feedback.citizen?.imageUrl || undefined}
                    alt={citizenName}
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <p className="break-words text-sm font-semibold">
                    {citizenName}
                  </p>
                  <p className="break-all text-xs text-muted-foreground">
                    {feedback.citizen?.email || "Email unavailable"}
                  </p>
                </div>
              </aside>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
