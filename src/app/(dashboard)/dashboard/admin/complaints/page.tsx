"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  Loader2,
  UserRoundPlus,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommonPagination } from "@/components/common/CommonPagination";
import { CommonSearch } from "@/components/common/CommonSearch";
import { CommonStatusFilter } from "@/components/common/CommonStatusFilter";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminUsers, useCreateAdminAssignment } from "@/hooks/admin.hook";
import { useManagerComplaints } from "@/hooks/manager.hook";
import { COMPLAINT_STATUS_OPTIONS } from "@/lib/complaint-status";
import { AdminPage } from "../AdminPage";
import { AssignTechnician } from "../../manager/AssignTechnician";
import Link from "next/link";

const PAGE_SIZE = 10;

function AdminAssignTechnician({ complaintId }: { complaintId: string }) {
  const [open, setOpen] = useState(false);
  const [technicianId, setTechnicianId] = useState("");
  const [note, setNote] = useState("");
  const {
    data: userResponse,
    isLoading: usersLoading,
    isError: usersError,
  } = useAdminUsers();
  const { mutate: assignTechnician, isPending } = useCreateAdminAssignment();
  const users = userResponse?.data?.data;
  const hasInvalidUserResponse =
    !usersLoading && !usersError && !Array.isArray(users);
  const technicians = Array.isArray(users)
    ? users.filter((user) => user.role === "TECHNICIAN")
    : [];

  const handleAssign = () => {
    if (!technicianId) return;

    assignTechnician(
      {
        complaintId,
        assignedToId: technicianId,
        note: note.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.add({
            title: "Complaint assigned",
            description: "Technician assigned successfully.",
            type: "success",
          });
          setOpen(false);
          setTechnicianId("");
          setNote("");
        },
        onError: (error) => {
          toast.add({
            title: "Assignment failed",
            description:
              error instanceof Error
                ? error.message
                : "Unable to assign the complaint.",
            type: "error",
          });
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen && !isPending) {
          setTechnicianId("");
          setNote("");
        }
      }}
    >
      <DialogTrigger
        render={
          <Button type="button" variant="outline" size="sm">
            <UserRoundPlus className="size-4" />
            Assign
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleAssign();
          }}
        >
          <DialogHeader>
            <DialogTitle>Assign technician</DialogTitle>
            <DialogDescription>
              Select a technician and add optional instructions.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-4">
            <Field>
              <FieldLabel htmlFor={`technician-${complaintId}`}>
                Technician
              </FieldLabel>
              {usersLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  value={technicianId || null}
                  onValueChange={(value) => setTechnicianId(value ?? "")}
                  disabled={isPending || technicians.length === 0}
                >
                  <SelectTrigger
                    id={`technician-${complaintId}`}
                    className="w-full"
                  >
                    <SelectValue
                      placeholder={
                        technicians.length === 0
                          ? "No technicians available"
                          : "Select technician"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {technicians.map((technician) => (
                      <SelectItem key={technician.id} value={technician.id}>
                        {technician.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <FieldDescription>
                Choose the technician responsible for this complaint.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor={`assignment-note-${complaintId}`}>
                Assignment note
              </FieldLabel>
              <textarea
                id={`assignment-note-${complaintId}`}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Optional instructions..."
                rows={3}
                disabled={isPending}
                className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </Field>
            {usersError && (
              <p className="text-sm text-destructive">
                Failed to load users. Please try again.
              </p>
            )}
            {hasInvalidUserResponse && (
              <p className="text-sm text-destructive">
                The user response did not contain a valid user list.
              </p>
            )}
          </FieldGroup>
          <DialogFooter>
            <DialogClose
              render={
                <Button type="button" variant="outline" disabled={isPending}>
                  Cancel
                </Button>
              }
            />
            <Button
              type="submit"
              disabled={
                !technicianId ||
                isPending ||
                usersLoading ||
                technicians.length === 0
              }
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <CheckCircle2 className="size-4" />
              )}
              {isPending ? "Assigning..." : "Assign technician"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminComplaintsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const { data, isLoading, isError, error } = useManagerComplaints(
    page,
    PAGE_SIZE,
  );
  const complaints = data?.complaints ?? [];
  console.log(complaints.length, "complaints");
  const query = search.trim().toLowerCase();
  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      !query ||
      [
        complaint.id,
        complaint.title,
        complaint.department,
        complaint.location,
      ].some((value) => value?.toLowerCase().includes(query));
    const normalizedStatus = complaint.status
      .trim()
      .toUpperCase()
      .replaceAll(/[\s-]+/g, "_");
    return matchesSearch && (status === "ALL" || normalizedStatus === status);
  });

  return (
    <AdminPage
      title="Complaints"
      description="Review incoming complaints, track status, and assign technicians."
    >
      {isLoading ? (
        <div
          className="space-y-4 rounded-xl border bg-card p-5"
          aria-busy="true"
        >
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-9 w-64" />
          </div>
          <Skeleton className="h-9 w-48" />
          <div className="space-y-2">
            {[
              "complaint-one",
              "complaint-two",
              "complaint-three",
              "complaint-four",
              "complaint-five",
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
            : "Failed to load complaints."}
        </div>
      ) : (
        <Card>
          <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All complaints</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {data?.total ?? 0} total complaints
              </p>
            </div>
            <CommonSearch
              value={search}
              onChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              placeholder="Search complaints..."
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <CommonStatusFilter
              value={status}
              options={COMPLAINT_STATUS_OPTIONS}
              onChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
            />
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Complaint</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>

                    <TableHead>Assignment</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComplaints.length ? (
                    filteredComplaints.map((complaint) => (
                      <TableRow key={complaint.id}>
                        <TableCell>
                          <p className="font-medium">{complaint.title}</p>
                          <p className="font-mono text-xs text-muted-foreground">
                            {complaint.id}
                          </p>
                        </TableCell>
                        <TableCell>{complaint.department ?? "—"}</TableCell>
                        <TableCell>{complaint.location ?? "—"}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{complaint.status}</Badge>
                        </TableCell>
                        <TableCell>{complaint.paymentStatus ?? "—"}</TableCell>
                        <TableCell>
                          <AssignTechnician
                            complaintId={complaint.id}
                            complaintStatus={complaint.status}
                          />
                          {/* <AdminAssignTechnician complaintId={complaint.id} /> */}
                        </TableCell>

                        {/* View Complaint */}
                        <TableCell className="text-right">
                          <Link
                            href={`/dashboard/admin/complaints/${complaint.id}`}
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No complaints match these filters on this page.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {(data?.totalPages ?? 1) > 1 && (
              <CommonPagination
                page={page}
                totalPages={data?.totalPages ?? 1}
                onPageChange={setPage}
              />
            )}
          </CardContent>
        </Card>
      )}
    </AdminPage>
  );
}
