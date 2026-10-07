

"use client";

import React from "react";
import Link from "next/link";
import {
  Eye,
  Loader2,
  ClipboardList,
  Play,
  CheckCircle2,
} from "lucide-react";

import { useGetMyAssignments } from "@/hooks/technician.hook";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

type Complaint = {
  id?: string;
  title?: string;
  description?: string;
  location?: string;
  department?: string;
  category?: {
    department?: string;
  };
  status?: string;
};

type Assignment = {
  id: string;
  trackingId?: string;
  status?: string;
  title?: string;
  complaint?: Complaint;
};

const MyAssignments = () => {
  const { data, isLoading, isError } = useGetMyAssignments();

  console.log(data, "My Assignments");

  const assignments: Assignment[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : [];


  if (isError) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-sm text-destructive">
            Failed to load your assignments.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            My Assignments
          </h1>

          <p className="text-muted-foreground">
            View and manage complaints assigned to you.
          </p>
        </div>

        <Badge
          variant="secondary"
          className="w-fit px-3 py-1"
        >
          <ClipboardList className="mr-1.5 h-4 w-4" />

          {assignments.length} Assignment
          {assignments.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Assigned Complaints</CardTitle>

          <CardDescription>
            Complaints currently assigned to you.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {assignments.length === 0 ? (
            <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
              <ClipboardList className="mb-3 h-10 w-10 text-muted-foreground" />

              <h3 className="font-semibold">
                No assignments found
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                You currently have no complaints assigned to
                you.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Complaint</TableHead>

                    <TableHead>Department</TableHead>

                    <TableHead>Location</TableHead>

                    <TableHead>Status</TableHead>

                    <TableHead className="text-right">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {assignments.map((assignment) => {
                    const complaint =
                      assignment.complaint;

                    const department =
                      complaint?.department ??
                      complaint?.category?.department ??
                      "—";

                    const location =
                      complaint?.location ?? "—";

                    const title =
                      complaint?.title ??
                      assignment.title ??
                      "Untitled complaint";
const status = complaint?.status ?? assignment.status
                    return (
                      <TableRow key={assignment.id}>
                        {/* Complaint */}
                        <TableCell>
                          <div className="max-w-[280px]">
                            <p className="font-medium">
                              {title}
                            </p>

                            {assignment.trackingId && (
                              <p className="truncate text-xs text-muted-foreground">
                                ID: {assignment.trackingId}
                              </p>
                            )}
                          </div>
                        </TableCell>

                        {/* Department */}
                        <TableCell>
                          {department}
                        </TableCell>

                        {/* Location */}
                        <TableCell>
                          <span className="line-clamp-1 max-w-[180px]">
                            {location}
                          </span>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                         
                            { status }
                        </TableCell>

                        {/* Action */}
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            {/* View */}
                            <Button
                             
                              size="sm"
                              variant="outline"

                            >
                              <Link
                                href={`/dashboard/technician/${assignment.id}`} className="flex items-center"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};


export default MyAssignments;

