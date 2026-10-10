"use client";

import { Loader2, MessageSquareText, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

import { CommonPagination } from "@/components/common/CommonPagination";
import { Delete } from "@/components/common/delete";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button as UIButton } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useCreateFeedback } from "@/hooks/complain.hook";
import { getStatusLabel } from "@/lib/status-label";
import type { Complaint, MyComplaintsProps } from "@/types/complaints.type";

/* =========================================================
Date Formatter
========================================================= */

function formatDate(value?: string) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-BD", {
        dateStyle: "medium",
      }).format(date);
}

/* =========================================================
My Complaints
========================================================= */

export default function MyComplaints({
  complaints,
  meta,
  isLoading,
  isError,
  onDelete,
  deletingComplaintId,
  onPageChange,
  onSearchChange,
  onStatusChange,
  search,
  status,
}: MyComplaintsProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [feedbackComplaint, setFeedbackComplaint] = useState<Complaint | null>(
    null,
  );
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [feedbackErrors, setFeedbackErrors] = useState<{
    rating?: string;
    comment?: string;
  }>({});
  const feedbackMutation = useCreateFeedback();

  const selectedComplaint = complaints.find(
    (complaint) => complaint.id === deleteId,
  );

  const isDeleting = Boolean(deletingComplaintId);
  const isSubmittingFeedback = feedbackMutation.isPending;

  const openFeedback = (complaint: Complaint) => {
    if (complaint.status !== "CLOSED") {
      return;
    }

    setRating(0);
    setComment("");
    setFeedbackErrors({});
    setFeedbackComplaint(complaint);
  };

  const closeFeedback = () => {
    if (isSubmittingFeedback) {
      return;
    }

    setFeedbackComplaint(null);
    setFeedbackErrors({});
  };

  const handleSubmitFeedback = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!feedbackComplaint || feedbackComplaint.status !== "CLOSED") {
      return;
    }

    const errors: { rating?: string; comment?: string } = {};

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      errors.rating = "Choose a rating from 1 to 5 stars.";
    }

    if (!comment.trim()) {
      errors.comment = "Enter a comment before submitting feedback.";
    }

    setFeedbackErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    feedbackMutation.mutate(
      {
        rating,
        comment: comment.trim(),
        complaintId: feedbackComplaint.id,
      },
      {
        onSuccess: () => {
          toast.add({
            title: "Feedback submitted",
            description: "Thank you for sharing your feedback.",
            type: "success",
          });
          setFeedbackComplaint(null);
          setRating(0);
          setComment("");
          setFeedbackErrors({});
        },
        onError: (error) => {
          toast.add({
            title: "Could not submit feedback",
            description:
              error instanceof Error
                ? error.message
                : "Something went wrong while submitting your feedback.",
            type: "error",
          });
        },
      },
    );
  };

  /* =========================================================
KEEP PAGE VALID
========================================================= */

  useEffect(() => {
    if (meta.totalPage > 0 && meta.page > meta.totalPage) {
      onPageChange(meta.totalPage);
    }
  }, [meta.page, meta.totalPage, onPageChange]);

  /* =========================================================
DELETE
========================================================= */

  const handleConfirmDelete = () => {
    if (!deleteId) {
      return;
    }

    onDelete(deleteId);
    setDeleteId(null);
  };

  /* =========================================================
PAGE CHANGE
========================================================= */

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > meta.totalPage) {
      return;
    }

    onPageChange(newPage);

    document.getElementById("my-complaints")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  /* =========================================================
RENDER
========================================================= */

  const startItem = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;

  const endItem = Math.min(meta.page * meta.limit, meta.total);

  return (
    <>
      {" "}
      <section id="my-complaints" className="scroll-mt-6">
        {/* HEADER */}

        {/* COMPLAINT LIST */}

        <div className="mt-4 overflow-hidden rounded-xl border bg-card">
          {isLoading ? (
            <div className="space-y-3 p-5" aria-busy="true">
              <Skeleton className="h-5 w-48" />
              {[
                "complaint-one",
                "complaint-two",
                "complaint-three",
                "complaint-four",
                "complaint-five",
              ].map((row) => (
                <Skeleton key={row} className="h-16 w-full" />
              ))}
            </div>
          ) : isError ? (
            <p className="p-5 text-sm text-destructive">
              Unable to load complaints. Please try again.
            </p>
          ) : complaints.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">
              {search.trim() || status !== "ALL"
                ? "No complaints found."
                : "You have not submitted any complaints yet."}
            </p>
          ) : (
            <>
              {/* TOTAL */}

              <div className="border-b px-5 py-3">
                <p className="text-sm text-muted-foreground">
                  Showing {startItem}–{endItem} of {meta.total} complaints
                </p>
              </div>

              {/* LIST */}

              <div className="divide-y">
                {complaints.map((complaint) => {
                  const isCurrentDeleting =
                    deletingComplaintId === complaint.id;

                  return (
                    <article
                      key={complaint.id}
                      className="flex flex-wrap items-center justify-between gap-4 p-5"
                    >
                      {/* COMPLAINT INFORMATION */}

                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium">
                          {complaint.title || "Complaint"}
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                          Submitted {formatDate(complaint.createdAt)}
                        </p>

                        <Link
                          href={`/dashboard/citizen/complaints/${encodeURIComponent(
                            complaint.id,
                          )}`}
                          className="mt-2 inline-flex text-sm font-medium text-primary hover:underline"
                        >
                          View details
                        </Link>
                      </div>

                      {/* STATUS + ACTIONS */}

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                          {getStatusLabel(complaint.status)}
                        </span>

                        {complaint.status === "CLOSED" && (
                          <UIButton
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => openFeedback(complaint)}
                          >
                            <MessageSquareText
                              aria-hidden="true"
                              className="size-4"
                            />
                            Give Feedback
                          </UIButton>
                        )}

                        <UIButton
                          type="button"
                          variant="destructive"
                          size="sm"
                          disabled={isDeleting}
                          onClick={() => setDeleteId(complaint.id)}
                        >
                          <Trash2 aria-hidden="true" className="size-4" />

                          {isCurrentDeleting ? "Deleting..." : "Delete"}
                        </UIButton>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* PAGINATION */}

              {meta.totalPage > 1 && (
                <div className="border-t p-4">
                  <CommonPagination
                    page={meta.page}
                    totalPages={meta.totalPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>
      {/* DELETE CONFIRMATION */}
      <AlertDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setDeleteId(null);
          }
        }}
      >
        <Delete
          title={selectedComplaint?.title}
          isDeleting={isDeleting}
          onConfirm={handleConfirmDelete}
        />
      </AlertDialog>
      <Dialog
        open={Boolean(feedbackComplaint)}
        onOpenChange={(open) => {
          if (!open) {
            closeFeedback();
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Give feedback</DialogTitle>
            <DialogDescription>
              Share your experience with the resolution of{" "}
              {feedbackComplaint?.title || "this complaint"}.
            </DialogDescription>
          </DialogHeader>

          <form
            className="space-y-5"
            onSubmit={handleSubmitFeedback}
            noValidate
          >
            <div className="space-y-2">
              <fieldset
                aria-describedby={
                  feedbackErrors.rating ? "feedback-rating-error" : undefined
                }
                aria-invalid={Boolean(feedbackErrors.rating)}
                className="m-0 min-w-0 border-0 p-0"
              >
                <legend className="mb-2 text-sm font-medium">Rating</legend>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
                      aria-pressed={rating === star}
                      disabled={isSubmittingFeedback}
                      onClick={() => {
                        setRating(star);
                        setFeedbackErrors((current) => ({
                          ...current,
                          rating: undefined,
                        }));
                      }}
                      className="rounded-md p-1 text-amber-500 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Star
                        aria-hidden="true"
                        className={`size-7 ${rating >= star ? "fill-current" : ""}`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {rating ? `${rating} of 5` : "Select a rating"}
                  </span>
                </div>
              </fieldset>
              {feedbackErrors.rating && (
                <p
                  id="feedback-rating-error"
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {feedbackErrors.rating}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback-comment">Comment</Label>
              <Textarea
                id="feedback-comment"
                value={comment}
                onChange={(event) => {
                  setComment(event.target.value);
                  setFeedbackErrors((current) => ({
                    ...current,
                    comment: undefined,
                  }));
                }}
                placeholder="Tell us about your experience..."
                rows={4}
                disabled={isSubmittingFeedback}
                aria-invalid={Boolean(feedbackErrors.comment)}
                aria-describedby={
                  feedbackErrors.comment ? "feedback-comment-error" : undefined
                }
              />
              {feedbackErrors.comment && (
                <p
                  id="feedback-comment-error"
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {feedbackErrors.comment}
                </p>
              )}
            </div>

            <DialogFooter>
              <UIButton
                type="button"
                variant="outline"
                onClick={closeFeedback}
                disabled={isSubmittingFeedback}
              >
                Cancel
              </UIButton>
              <UIButton type="submit" disabled={isSubmittingFeedback}>
                {isSubmittingFeedback && (
                  <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                )}
                {isSubmittingFeedback ? "Submitting..." : "Submit Feedback"}
              </UIButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
