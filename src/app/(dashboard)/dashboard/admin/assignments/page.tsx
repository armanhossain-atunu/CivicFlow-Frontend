
"use client";

import { useState } from "react";
import {
  AlertCircle,
  Check,
  ClipboardList,
  Copy,
  LockKeyhole,
  Loader2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";

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

import { CommonPagination } from "@/components/common/CommonPagination";
import { CommonSearch } from "@/components/common/CommonSearch";
import { CommonStatusFilter } from "@/components/common/CommonStatusFilter";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useManagerComplaints } from "@/hooks/manager.hook";
import { useCloseAdminAssignment } from "@/hooks/admin.hook";
import { AdminPage } from "../AdminPage";

const PAGE_SIZE = 10;

const ASSIGNMENT_STATUS_OPTIONS = [
  { value: "ALL", label: "All statuses" },
  { value: "ASSIGNED", label: "Assigned" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
  { value: "REJECTED", label: "Rejected" },
];

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-BD", {
    dateStyle: "medium",
    timeZone: "Asia/Dhaka",
  });
}

function getStatusVariant(status?: string) {
  switch (status?.toUpperCase()) {
    case "RESOLVED":
    case "CLOSED":
      return "default" as const;

    case "REJECTED":
      return "destructive" as const;

    default:
      return "outline" as const;
  }
}

export default function AdminAssignmentsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const [copiedComplaintId, setCopiedComplaintId] =
    useState<string | null>(null);

  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] =
    useState<string | null>(null);

  const { data, isLoading, isError, error } = useManagerComplaints(
    page,
    PAGE_SIZE,
  );

  const {
    mutate: closeAssignment,
    isPending: isClosing,
  } = useCloseAdminAssignment();

  const complaints = data?.complaints ?? [];
  const normalizedSearch = search.trim().toLowerCase();

  const assignedComplaints = complaints.filter((complaint) => {
    const normalizedStatus = complaint.status
      .trim()
      .toUpperCase()
      .replaceAll(/[\s-]+/g, "_");

    const hasAssignment =
      Boolean(complaint.technicianId) ||
      [
        "ASSIGNED",
        "IN_PROGRESS",
        "RESOLVED",
        "COMPLETED",
        "CLOSED",
      ].includes(normalizedStatus);

    const matchesSearch =
      !normalizedSearch ||
      [
        complaint.id,
        complaint.title,
        complaint.citizenName,
        complaint.citizenEmail,
        complaint.technicianName,
        complaint.technicianId,
        complaint.department,
      ].some((value) =>
        value?.toLowerCase().includes(normalizedSearch),
      );

    return (
      hasAssignment &&
      matchesSearch &&
      (status === "ALL" || normalizedStatus === status)
    );
  });

  const handleCopyComplaintId = async (complaintId: string) => {
    try {
      await navigator.clipboard.writeText(complaintId);

      setCopiedComplaintId(complaintId);

      window.setTimeout(() => {
        setCopiedComplaintId((current) =>
          current === complaintId ? null : current,
        );
      }, 2000);
    } catch (copyError) {
      console.error("Failed to copy complaint ID:", copyError);

      toast.add({
        title: "Copy failed",
        description: "Could not copy the complaint ID.",
        type: "error",
      });
    }
  };

  // Open custom confirmation dialog.
  const handleCloseAssignment = (complaintId: string) => {
    setSelectedComplaintId(complaintId);
    setCloseDialogOpen(true);
  };

  // Execute the mutation only after confirmation.
  const confirmCloseAssignment = () => {
    if (!selectedComplaintId || isClosing) return;

    closeAssignment(selectedComplaintId, {
      onSuccess: () => {
        toast.add({
          title: "Assignment closed",
          description:
            "The complaint status has been updated to closed.",
          type: "success",
        });

        setCloseDialogOpen(false);
        setSelectedComplaintId(null);
      },

      onError: (closeError) => {
        toast.add({
          title: "Failed to close assignment",
          description:
            closeError instanceof Error
              ? closeError.message
              : "Unable to update the complaint status.",
          type: "error",
        });
      },
    });
  };

  const changeSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const changeStatus = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const totalPages = data?.totalPages ?? 1;

  const filterBar = (
    <div className="flex flex-col gap-3 border-b p-4">
      <CommonSearch
        value={search}
        onChange={changeSearch}
        placeholder="Search complaint, citizen, or technician..."
      />

      <CommonStatusFilter
        value={status}
        options={ASSIGNMENT_STATUS_OPTIONS}
        onChange={changeStatus}
      />
    </div>
  );

  return (
    <AdminPage
      title="Assignments"
      description="Review technician assignments attached to complaints."
    >
      {isLoading ? (
        <div
          className="space-y-4 rounded-xl border bg-card p-5"
          aria-busy="true"
        >
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-48" />

          <div className="space-y-2">
            {[
              "assignment-one",
              "assignment-two",
              "assignment-three",
              "assignment-four",
              "assignment-five",
            ].map((row) => (
              <Skeleton key={row} className="h-12 w-full" />
            ))}
          </div>
        </div>
      ) : isError ? (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 p-4 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          {error instanceof Error
            ? error.message
            : "Failed to load assignments."}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="size-5" />
              Complaint Assignments
            </CardTitle>

            <p className="text-sm text-muted-foreground">
              {assignedComplaints.length} matching assignments on this page
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {filterBar}

            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Complaint</TableHead>
                    <TableHead>Citizen</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Complaint ID</TableHead>
                    <TableHead>Admin action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {assignedComplaints.length > 0 ? (
                    assignedComplaints.map((complaint) => {
                      const isClosed =
                        complaint.status.toUpperCase() === "CLOSED";

                      return (
                        <TableRow key={complaint.id}>
                          <TableCell className="min-w-48">
                            <p className="font-medium">
                              {complaint.title || "Untitled complaint"}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {complaint.category || "No category"}
                            </p>
                          </TableCell>

                          <TableCell className="min-w-40">
                            <p>{complaint.citizenName || "—"}</p>

                            <p className="text-xs text-muted-foreground">
                              {complaint.citizenEmail || ""}
                            </p>
                          </TableCell>

                          <TableCell className="min-w-40">
                            {complaint.technicianName ||
                              complaint.technicianId ||
                              "Technician not linked"}
                          </TableCell>

                          <TableCell>
                            {complaint.department || "—"}
                          </TableCell>

                          <TableCell>
                            <Badge variant="outline">
                              {complaint.paymentStatus || "UNKNOWN"}
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <Badge
                              variant={getStatusVariant(complaint.status)}
                            >
                              {complaint.status || "UNKNOWN"}
                            </Badge>
                          </TableCell>

                          <TableCell className="whitespace-nowrap">
                            {formatDate(complaint.createdAt)}
                          </TableCell>

                          <TableCell className="font-mono text-xs">
                            <div className="flex items-center gap-1">
                              <span
                                className="max-w-36 truncate"
                                title={complaint.id}
                              >
                                {complaint.id}
                              </span>

                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                onClick={() =>
                                  handleCopyComplaintId(complaint.id)
                                }
                                aria-label={
                                  copiedComplaintId === complaint.id
                                    ? "Complaint ID copied"
                                    : "Copy complaint ID"
                                }
                                title={
                                  copiedComplaintId === complaint.id
                                    ? "Copied"
                                    : "Copy complaint ID"
                                }
                              >
                                {copiedComplaintId === complaint.id ? (
                                  <Check className="size-3.5 text-green-600" />
                                ) : (
                                  <Copy className="size-3.5" />
                                )}
                              </Button>
                            </div>
                          </TableCell>

                          <TableCell>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={isClosed || isClosing}
                              onClick={() =>
                                handleCloseAssignment(complaint.id)
                              }
                            >
                              {isClosing ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <LockKeyhole className="size-4" />
                              )}

                              {isClosed ? "Closed" : "Close"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="h-28 text-center text-muted-foreground"
                      >
                        No assignments match the selected search or status
                        on this page.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <CommonPagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Custom close assignment confirmation dialog */}
      <AlertDialog
        open={closeDialogOpen}
        onOpenChange={(open) => {
          if (isClosing) return;

          setCloseDialogOpen(open);

          if (!open) {
            setSelectedComplaintId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Close complaint assignment?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to close this assignment? The complaint
              status will be updated to CLOSED. Please verify this action
              before continuing.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isClosing}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={isClosing || !selectedComplaintId}
              onClick={(event) => {
                event.preventDefault();
                confirmCloseAssignment();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isClosing && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}

              {isClosing ? "Closing..." : "Close Assignment"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminPage>
  );
}
