
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

import { Complaint } from "@/types/complaints.type";
import { AssignTechnician } from "./AssignTechnician";
import { CommonPagination } from "@/components/common/CommonPagination";

interface ComplaintTableProps {
  complaints: Complaint[];

  // Pagination data
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
  /* =========================================================
     Local Complaints State
  ========================================================== */

  const [localComplaints, setLocalComplaints] =
    useState<Complaint[]>(complaints);

  /* =========================================================
     Sync Parent Data
  ========================================================== */

  useEffect(() => {
    setLocalComplaints(complaints);
  }, [complaints]);

  /* =========================================================
     Status Variant
  ========================================================== */

  const getStatusVariant = (status?: string) => {
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
      {/* =====================================================
          Header
      ====================================================== */}

      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              All Complaints
            </h2>

            <p className="text-sm text-muted-foreground">
              Manage and monitor citizen complaints.
            </p>
          </div>

          <Badge variant="secondary">
            {localComplaints.length} Complaints
          </Badge>
        </div>
      </div>

      {/* =====================================================
          Table
      ====================================================== */}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>

              <TableHead>Department</TableHead>

              <TableHead>Location</TableHead>

              <TableHead>Status</TableHead>

              <TableHead>Payment</TableHead>

              <TableHead className="text-right">
                Assign
              </TableHead>

              <TableHead className="text-right">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {localComplaints.length > 0 ? (
              localComplaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  {/* =========================================
                      Title
                  ========================================== */}

                  <TableCell>
                    <div className="max-w-[250px]">
                      <p className="truncate font-medium">
                        {complaint.title}
                      </p>

                      {complaint.description && (
                        <p className="truncate text-xs text-muted-foreground">
                          {complaint.description}
                        </p>
                      )}
                    </div>
                  </TableCell>

                  {/* =========================================
                      Department
                  ========================================== */}

                  <TableCell>
                    {complaint.department || "N/A"}
                  </TableCell>

                  {/* =========================================
                      Location
                  ========================================== */}

                  <TableCell>
                    <span className="block max-w-[180px] truncate">
                      {complaint.location || "N/A"}
                    </span>
                  </TableCell>

                  {/* =========================================
                      Status
                  ========================================== */}

                  <TableCell>
                    <Badge
                      variant={getStatusVariant(
                        complaint.status,
                      )}
                    >
                      {complaint.status?.replaceAll(
                        "_",
                        " ",
                      ) || "UNKNOWN"}
                    </Badge>
                  </TableCell>

                  {/* =========================================
                      Payment
                  ========================================== */}

                  <TableCell>
                    {complaint.paymentStatus ? (
                      <Badge
                        variant={
                          complaint.paymentStatus === "PAID"
                            ? "default"
                            : "outline"
                        }
                      >
                        {complaint.paymentStatus}
                      </Badge>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>

                  {/* =========================================
                      Assign Technician
                  ========================================== */}

                  <TableCell className="text-right">
                    <AssignTechnician
                      complaintId={complaint.id}
                      complaintStatus={complaint.status ?? "UNKNOWN"}
                    />
                  </TableCell>

                  {/* =========================================
                      View
                  ========================================== */}

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
                  No complaints found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* =====================================================
          Pagination
      ====================================================== */}

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

