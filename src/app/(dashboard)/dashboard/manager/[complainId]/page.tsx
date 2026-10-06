"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetAllComplaints } from "@/hooks/complain.hook";
import { Complaint } from "@/types/complaints.type";
import { useParams } from "next/navigation";

export default function ComplaintDetailsPage() {
  const { data, isLoading } = useGetAllComplaints();

  const { complainId } = useParams<{
    complainId: string;
  }>();

  const complaints: Complaint[] = data?.data?.data ?? [];

  console.log("Complaint ID:", complainId);
  console.log("Complaints:", complaints);

  const complaint = complaints.find(
    (item) => item.id === complainId,
  );

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <p className="text-muted-foreground">
          Loading complaint...
        </p>
      </main>
    );
  }

  if (!complaint) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <Card>
          <CardContent className="py-10 text-center">
            <h1 className="text-xl font-semibold">
              Complaint not found
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              No complaint found with ID:
            </p>

            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {complainId}
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
      <div>
        <p className="text-sm font-medium text-primary">
          Complaint Details
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          {complaint.title}
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Complaint ID: {complaint.id}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Complaint Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Description
            </p>

            <p className="mt-1">
              {complaint.description || "No description available."}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">
                Department
              </p>
              <p className="mt-1 font-medium">
                {complaint.department || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Location
              </p>
              <p className="mt-1 font-medium">
                {complaint.location || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Status
              </p>
              <div className="mt-1">
                <Badge>
                  {complaint.status?.replaceAll("_", " ") ||
                    "UNKNOWN"}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Pay Amount
              </p>
              <div className="mt-1">
              {complaint.paymentAmount || "N/A"}৳
                
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Payment Status
              </p>
              <div className="mt-1">
                <Badge
                  variant={
                    complaint.paymentStatus === "PAID"
                      ? "default"
                      : "outline"
                  }
                >
                  {complaint.paymentStatus || "N/A"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}