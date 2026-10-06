"use client";

import { FilePlus2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type Complaint = {
  id: string;
  title?: string;
  status?: string;
  paymentStatus?: string;
  createdAt?: string;
};

type MyComplaintsProps = {
  complaints: Complaint[];
  isLoading: boolean;
  isError: boolean;

  onDelete: (complaintId: string) => void;
  deletingComplaintId?: string | null;
};

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

export default function MyComplaints({
  complaints,
  isLoading,
  isError,
  onDelete,
  deletingComplaintId,
}: MyComplaintsProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const selectedComplaint = complaints.find(
    (complaint) => complaint.id === deleteId,
  );

  const isDeleting = Boolean(deletingComplaintId);

  const handleConfirmDelete = () => {
    if (!deleteId) {
      return;
    }

    onDelete(deleteId);
    setDeleteId(null);
  };
  console.log(complaints, " this is a complaine page");
  return (
    <>
      <section id="my-complaints" className="scroll-mt-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">My complaints</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Current status of your submitted requests.
            </p>
          </div>

          <Link
            href="/complaint"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <FilePlus2 aria-hidden="true" className="size-4" />
            Create complaint
          </Link>
        </div>

        {/* Complaints */}
        <div className="mt-4 overflow-hidden rounded-xl border bg-card">
          {isLoading ? (
            <p className="p-5 text-sm text-muted-foreground">
              Loading complaints...
            </p>
          ) : isError ? (
            <p className="p-5 text-sm text-destructive">
              Unable to load complaints.
            </p>
          ) : complaints.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">
              You have not submitted any complaints yet.
            </p>
          ) : (
            <div className="divide-y">
              {complaints.map((complaint) => {
                const isCurrentDeleting = deletingComplaintId === complaint.id;

                return (
                  <article
                    key={complaint.id}
                    className="flex flex-wrap items-center justify-between gap-4 p-5"
                  >
                    {/* Complaint information */}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium">
                        {complaint.title || "Complaint"}
                      </h3>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Submitted {formatDate(complaint.createdAt)}
                      </p>
                      <Link
                        href={`/dashboard/citizen/complaints/${encodeURIComponent(complaint.id)}`}
                        className="mt-2 inline-flex text-sm font-medium text-primary hover:underline"
                      >
                        View details
                      </Link>
                    </div>

                    {/* Status + Delete */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                        {complaint.status || "Status unavailable"}
                      </span>

                      {complaint.paymentStatus && (
                        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                          Payment: {complaint.paymentStatus}
                        </span>
                      )}

                      {/* Delete */}
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        disabled={isDeleting}
                        onClick={() => setDeleteId(complaint.id)}
                      >
                        <Trash2 aria-hidden="true" className="size-4" />

                        {isCurrentDeleting ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Delete Confirmation */}
      <AlertDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setDeleteId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete complaint?</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                {selectedComplaint?.title || "this complaint"}
              </span>
              ?
              <br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              disabled={isDeleting}
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
