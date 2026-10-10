"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { AssignTechnician } from "./AssignTechnician";
import { CommonPagination } from "@/components/common/CommonPagination";
import type { ManagerComplaint } from "@/types/manager.types";
import { CommonSearch } from "@/components/common/CommonSearch";
import { CommonStatusFilter } from "@/components/common/CommonStatusFilter";
import { COMPLAINT_STATUS_OPTIONS } from "@/lib/complaint-status";

interface ComplaintTableProps {
  complaints: ManagerComplaint[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ComplaintTable = ({
  complaints,
  page,
  totalPages,
  onPageChange,
}: ComplaintTableProps) => {
  const [localComplaints, setLocalComplaints] =
    useState<ManagerComplaint[]>(complaints);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  useEffect(() => {
    setLocalComplaints(complaints);
  }, [complaints]);

  const filteredComplaints = localComplaints.filter((complaint) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      query === "" ||
      [
        complaint.id,
        complaint.title,
        complaint.description,
        complaint.department,
        complaint.location,
      ].some((value) => value?.toLowerCase().includes(query));
    const normalizedStatus = complaint.status
      .trim()
      .toUpperCase()
      .replaceAll(/[\s-]+/g, "_");
    const matchesStatus = status === "ALL" || normalizedStatus === status;

    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (
    status?: string,
  ): "default" | "destructive" | "secondary" | "outline" => {
    switch (status) {
      case "RESOLVED":
      case "CLOSED":
        return "default";

      case "REJECTED":
        return "destructive";

      case "IN_PROGRESS":
      case "ASSIGNED":
        return "secondary";

      default:
        return "outline";
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border bg-card">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">All Complaints</h2>

            <p className="text-sm text-muted-foreground">
              Manage and monitor citizen complaints.
            </p>
          </div>

          <Badge variant="secondary">
            {filteredComplaints.length} Complaints
          </Badge>
        </div>
      </div>
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <CommonSearch
          value={search}
          onChange={setSearch}
          placeholder="Search complaints..."
        />
        <CommonStatusFilter
          value={status}
          options={COMPLAINT_STATUS_OPTIONS}
          onChange={setStatus}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Assign</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredComplaints.length > 0 ? (
              filteredComplaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  {/* Title */}
                  <TableCell>
                    <div className="max-w-[250px]">
                      <p className="truncate font-medium">{complaint.title}</p>

                      {complaint.description && (
                        <p className="truncate text-xs text-muted-foreground">
                          {complaint.description}
                        </p>
                      )}
                    </div>
                  </TableCell>

                  {/* Department */}
                  <TableCell>{complaint.department || "N/A"}</TableCell>

                  {/* Location */}
                  <TableCell>
                    <span className="block max-w-[180px] truncate">
                      {complaint.location || "N/A"}
                    </span>
                  </TableCell>

                  {/* Complaint Status */}
                  <TableCell>
                    <Badge variant={getStatusVariant(complaint.status)}>
                      {complaint.status?.replaceAll("_", " ") || "UNKNOWN"}
                    </Badge>
                  </TableCell>

                  {/* Payment Status */}
                  <TableCell>
                    <Badge>{complaint?.paymentStatus}</Badge>
                  </TableCell>

                  {/* Assign Technician */}
                  <TableCell className="text-right">
                    <AssignTechnician
                      complaintId={complaint.id}
                      complaintStatus={complaint.status || "UNKNOWN"}
                    />
                  </TableCell>

                  {/* View Complaint */}
                  <TableCell className="text-right">
                    <Link
                      href={`/dashboard/manager/${complaint.id}`}
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
                  className="h-32 text-center text-muted-foreground"
                >
                  No complaints match your search or selected status.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t px-6 py-4">
          <CommonPagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ComplaintTable;
