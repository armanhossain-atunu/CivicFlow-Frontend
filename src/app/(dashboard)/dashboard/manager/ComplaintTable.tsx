
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Complaint } from "@/types/complaints.type";
import { Eye } from "lucide-react";
import Link from "next/link";

interface ComplaintTableProps {
  complaints: Complaint[];
}
const ComplaintTable = ({ complaints }: ComplaintTableProps) => {
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
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">All Complaints</h2>
            <p className="text-sm text-muted-foreground">
              Manage and monitor citizen complaints.
            </p>
          </div>

          <Badge variant="secondary">
            {complaints.length} Complaints
          </Badge>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {complaints.length > 0 ? (
              complaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell>
                    <div className="`max-w-[250px]">
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

                  <TableCell>
                    {complaint.department || "N/A"}
                  </TableCell>

                  <TableCell>
                    <span className=" `max-w-[180px]` truncate">
                      {complaint.location || "N/A"}
                    </span>
                  </TableCell>

                  <TableCell>
                    <Badge variant={getStatusVariant(complaint.status)}>
                      {complaint.status?.replaceAll("_", " ") || "UNKNOWN"}
                    </Badge>
                  </TableCell>

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
                  colSpan={6}
                  className="h-32 text-center text-muted-foreground"
                >
                  No complaints found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ComplaintTable;
