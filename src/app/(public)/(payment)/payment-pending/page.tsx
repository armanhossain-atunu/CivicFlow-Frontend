"use client";

import { useState } from "react";

import {
  useGetAllPendingComplaints,
  usePayForComplaint,
} from "@/hooks/complain.hook";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { toast } from "@/components/ui/toast";

const PaymentPending = () => {
  const [payingComplaintId, setPayingComplaintId] = useState<string | null>(
    null,
  );

  // Get pending complaints
  const {
    data,
    isLoading,
    isError,
  } = useGetAllPendingComplaints();

  // Payment mutation
  const { mutateAsync: payForComplaint } =
    usePayForComplaint();

  // Handle Pay Now
  const handlePayNow = async (complaintId: string) => {
    try {
      // Set only clicked complaint as paying
      setPayingComplaintId(complaintId);

      // Create bKash payment
      const result = await payForComplaint(complaintId);

      console.log("Payment Response:", result);

      // Get bKash payment URL
      const bkashURL =
        result?.data?.bkashURL ||
        result?.data?.bkashUrl ||
        result?.data?.paymentURL ||
        result?.data?.paymentUrl ||
        result?.bkashURL ||
        result?.bkashUrl ||
        result?.paymentURL ||
        result?.paymentUrl;

      // Check payment URL
      if (!bkashURL) {
        throw new Error(
          "bKash payment URL was not returned by the server.",
        );
      }

      // Validate URL
      const paymentUrl = new URL(bkashURL);

      if (paymentUrl.protocol !== "https:") {
        throw new Error(
          "The payment server returned an invalid checkout URL.",
        );
      }

      // Redirect to bKash
      window.location.assign(paymentUrl.toString());
    } catch (error) {
      console.error("Payment Error:", error);

      toast.add({
        title: "Payment failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong while creating the payment.",
        type: "error",
      });

      // Reset loading state
      setPayingComplaintId(null);
    }
  };

  // Loading
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <p className="text-muted-foreground">
          Loading pending payments...
        </p>
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="py-10 text-center">
        <p className="text-destructive">
          Failed to load pending payments.
        </p>
      </div>
    );
  }

  // Get only PENDING payments
  const pendingComplaints =
    data?.data?.data?.filter(
      (item: any) => item.paymentStatus === "PENDING",
    ) ?? [];

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Payment Pending
        </h1>

        <p className="text-muted-foreground">
          Complete your pending complaint payments.
        </p>
      </div>

      {/* No pending payment */}
      {pendingComplaints.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">
              No pending payment found.
            </p>
          </CardContent>
        </Card>
      ) : (
        /* Complaint Cards */
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pendingComplaints.map((complaint: any) => {
            // Check current complaint is paying
            const isPaying =
              payingComplaintId === complaint.id;

            return (
              <Card
                key={complaint.id}
                className="flex h-full flex-col transition-shadow hover:shadow-md"
              >
                {/* Card Header */}
                <CardHeader>
                  <CardTitle className="line-clamp-2">
                    {complaint.title}
                  </CardTitle>
                </CardHeader>

                {/* Card Content */}
                <CardContent className="flex-1 space-y-4">
                  {/* Category */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Category
                    </p>

                    <p className="text-sm font-medium">
                      {complaint.categoryName}
                    </p>
                  </div>

                  {/* Location */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Location
                    </p>

                    <p className="line-clamp-2 text-sm">
                      {complaint.location}
                    </p>
                  </div>

                  {/* Payment */}
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Payment Amount
                      </p>

                      <p className="text-lg font-bold">
                        ৳{complaint.paymentAmount}
                      </p>
                    </div>

                    {/* Status */}
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                      {complaint.paymentStatus}
                    </span>
                  </div>
                </CardContent>

                {/* Card Footer */}
                <CardFooter>
                  <Button
                    className="w-full"
                    disabled={payingComplaintId !== null}
                    onClick={() =>
                      handlePayNow(complaint.id)
                    }
                  >
                    {isPaying
                      ? "Creating Payment..."
                      : `Pay Now ৳${complaint.paymentAmount}`}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PaymentPending;

// http://localhost:5000/api/v1/payments/bkash/callback?paymentID=TR0011J4cfO7k1791103571653&status=failure&signature=066Snt8RVa&apiVersion=1.2.0-beta/