"use client";

import { FilePlus2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { CommonPagination } from "@/components/common/CommonPagination";
import { CommonSearch } from "@/components/common/CommonSearch";
import { CommonStatusFilter } from "@/components/common/CommonStatusFilter";
import { Delete } from "@/components/common/delete";
import {
  AlertDialog,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button as UIButton } from "@/components/ui/button";
import { COMPLAINT_STATUS_OPTIONS } from "@/lib/complaint-status";
import { getStatusLabel } from "@/lib/status-label";
import { MyComplaintsProps } from "@/types/complaints.type";



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

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const [page, setPage] = useState(1);

  const itemsPerPage = 5;

  const selectedComplaint = complaints.find(
    (complaint) => complaint.id === deleteId,
  );

  const isDeleting = Boolean(deletingComplaintId);

  /*
   * ============================================
   * SEARCH + STATUS FILTER
   * ============================================
   */
  const filteredComplaints = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return complaints.filter((complaint) => {
      // Status filter
      const matchesStatus =
        status === "ALL" || complaint.status === status;

      // Search filter
      const matchesSearch =
        !searchText ||
        complaint.title?.toLowerCase().includes(searchText);

      return matchesStatus && matchesSearch;
    });
  }, [complaints, search, status]);

  /*
   * ============================================
   * TOTAL PAGES
   * ============================================
   */
  const totalPages = Math.ceil(
    filteredComplaints.length / itemsPerPage,
  );

  /*
   * ============================================
   * PAGINATION
   * ============================================
   */
  const paginatedComplaints = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return filteredComplaints.slice(startIndex, endIndex);
  }, [filteredComplaints, page]);

  /*
   * ============================================
   * KEEP PAGE VALID
   * ============================================
   */
  useEffect(() => {
    if (totalPages === 0) {
      setPage(1);
      return;
    }

    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  /*
   * ============================================
   * PAGE CHANGE
   * ============================================
   */
  const handlePageChange = (newPage: number) => {
    setPage(newPage);

    document
      .getElementById("my-complaints")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  /*
   * ============================================
   * SEARCH CHANGE
   * ============================================
   */
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  /*
   * ============================================
   * STATUS CHANGE
   * ============================================
   */
  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  /*
   * ============================================
   * DELETE
   * ============================================
   */
  const handleConfirmDelete = () => {
    if (!deleteId) {
      return;
    }

    onDelete(deleteId);
    setDeleteId(null);
  };

  return (
    <>
      <section id="my-complaints" className="scroll-mt-6">
        {/* ========================================
            HEADER
        ======================================== */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">
              My complaints
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Current status of your submitted requests.
            </p>
          </div>

          <Link
            href="/complaint"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <FilePlus2
              aria-hidden="true"
              className="size-4"
            />

            Create complaint
          </Link>
        </div>

        {/* ========================================
            SEARCH + STATUS FILTER
        ======================================== */}
        <div className="mt-5 space-y-4">
          {/* Search */}
          <CommonSearch
            value={search}
            onChange={handleSearchChange}
            placeholder="Search complaints..."
          />

          {/* Status */}
          <CommonStatusFilter
            value={status}
            options={COMPLAINT_STATUS_OPTIONS}
            onChange={handleStatusChange}
          />
        </div>

        {/* ========================================
            COMPLAINT LIST
        ======================================== */}
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
          ) : filteredComplaints.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">
              No complaints found.
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
                          Submitted{" "}
                          {formatDate(complaint.createdAt)}
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
                        {/* Status */}
                        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                          {getStatusLabel(complaint.status)}
                        </span>

                        {/* Delete */}
                        <UIButton
                          type="button"
                          variant="destructive"
                          size="sm"
                          disabled={isDeleting}
                          onClick={() =>
                            setDeleteId(complaint.id)
                          }
                        >
                          <Trash2
                            aria-hidden="true"
                            className="size-4"
                          />

                          {isCurrentDeleting
                            ? "Deleting..."
                            : "Delete"}
                        </UIButton>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* ========================================
                  PAGINATION
              ======================================== */}
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

      {/* ========================================
          DELETE DIALOG
      ======================================== */}
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
    </>
  );
}