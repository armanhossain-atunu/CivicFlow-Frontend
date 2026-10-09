"use client";

import { FilePlus2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { CommonPagination } from "@/components/common/CommonPagination";
import { CommonSearch } from "@/components/common/CommonSearch";
import { CommonStatusFilter } from "@/components/common/CommonStatusFilter";
import { Delete } from "@/components/common/delete";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button as UIButton } from "@/components/ui/button";
import { COMPLAINT_STATUS_OPTIONS } from "@/lib/complaint-status";
import { getStatusLabel } from "@/lib/status-label";
import { MyComplaintsProps } from "@/types/complaints.type";


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

const selectedComplaint = complaints.find(
(complaint) => complaint.id === deleteId,
);

const isDeleting = Boolean(deletingComplaintId);

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

const startItem =
meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;

const endItem = Math.min(meta.page * meta.limit, meta.total);

return (
<> <section id="my-complaints" className="scroll-mt-6">
{/* HEADER */}



    {/* COMPLAINT LIST */}

    <div className="mt-4 overflow-hidden rounded-xl border bg-card">
      {isLoading ? (
        <p className="p-5 text-sm text-muted-foreground">
          Loading complaints...
        </p>
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

                  {/* STATUS + DELETE */}

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                      {getStatusLabel(complaint.status)}
                    </span>

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
</>


);
}
