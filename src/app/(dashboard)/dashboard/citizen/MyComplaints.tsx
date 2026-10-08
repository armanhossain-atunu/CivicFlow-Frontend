"use client";

import { FilePlus2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { CommonPagination } from "@/components/common/CommonPagination";
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
import { getStatusLabel } from "@/lib/status-label";
import { CommonSearch } from "@/components/common/CommonSearch";
import { CommonStatusFilter } from "@/components/common/CommonStatusFilter";
import { COMPLAINT_STATUS_OPTIONS } from "@/lib/complaint-status";

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

// function getStatusLabel(status?: string) {
//   if (!status) {
//     return "Unknown";
//   }

//   const labels: Record<string, string> = {
//     PAYMENT_PENDING: "Payment",
//     SUBMITTED: "Submitted",
//     ASSIGNED: "Assigned",
//     IN_PROGRESS: "In Progress",
//     RESOLVED: "Resolved",
//     CLOSED: "Closed",
//     REJECTED: "Rejected",
//   };

//   return labels[status] ?? status.replaceAll("_", " ");
// }

// function getPaymentStatusLabel(status?: string) {
//   if (!status) {
//     return "";
//   }

//   const labels: Record<string, string> = {
//     PENDING: "Pending",
//     PAID: "Paid",
//     FAILED: "Failed",
//     CANCELLED: "Cancelled",
//   };

//   return labels[status] ?? status.replaceAll("_", " ");
// }

export default function MyComplaints({
  complaints,
  isLoading,
  isError,
  onDelete,
  deletingComplaintId,
}: MyComplaintsProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  // const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  // Pagination
  const [page, setPage] = useState(1);

  const itemsPerPage = 5;

  const selectedComplaint = complaints.find(
    (complaint) => complaint.id === deleteId,
  );

  const isDeleting = Boolean(deletingComplaintId);

  // Total pages
  const totalPages = Math.ceil(complaints.length / itemsPerPage);

  // Current page complaints
  const paginatedComplaints = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return complaints.slice(startIndex, endIndex);
  }, [complaints, page]);

  // Keep page valid after delete/filter
  if (page > totalPages && totalPages > 0) {
    setPage(totalPages);
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage);

    // Optional: scroll back to complaints section
    document
      .getElementById("my-complaints")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleConfirmDelete = () => {
    if (!deleteId) {
      return;
    }

    onDelete(deleteId);
    setDeleteId(null);
  };
  // Search and filter
  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const matchesStatus = status === "ALL" || complaint.status === status;

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText || complaint.title?.toLowerCase().includes(searchText);

      return matchesStatus && matchesSearch;
    });
  }, [complaints, search, status]);

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
          {/* Search and filter */}
          <div className="mt-4 flex flex-col gap-4">
            <CommonSearch
              value={search}
              onChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              placeholder="Search complaints..."
            />

            <CommonStatusFilter
              value={status}
              options={COMPLAINT_STATUS_OPTIONS}
              onChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
            />
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
            <>
              <div className="divide-y">
                {paginatedComplaints.map((complaint) => {
                  const isCurrentDeleting =
                    deletingComplaintId === complaint.id;

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
                          href={`/dashboard/citizen/complaints/${encodeURIComponent(
                            complaint.id,
                          )}`}
                          className="mt-2 inline-flex text-sm font-medium text-primary hover:underline"
                        >
                          View details
                        </Link>
                      </div>

                      {/* Status + Delete */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Complaint Status */}
                        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                          {getStatusLabel(complaint.status)}
                        </span>

                        {/* Payment Status */}
                        {/* {complaint.paymentStatus && (
                          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                            Payment:{" "}
                            {getPaymentStatusLabel(complaint.paymentStatus)}
                          </span>
                        )} */}

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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-t p-4">
                  <CommonPagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
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
