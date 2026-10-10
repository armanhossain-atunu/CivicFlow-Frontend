"use client";

import { Loader2, LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useCloseComplaint } from "@/hooks/complain.hook";

type CloseAssignmentButtonProps = {
  complaintId: string;
  status: string | undefined;
};

export function CloseAssignmentButton({
  complaintId,
  status,
}: CloseAssignmentButtonProps) {
  const { mutate, isPending } = useCloseComplaint();

  const isClosed = status === "CLOSED";

  const handleClose = () => {
    mutate(complaintId, {
      onSuccess: () => {
        toast.add({
          title: "Complaint closed",
          description: "The complaint assignment was closed successfully.",
          type: "success",
        });
      },
      onError: (error) => {
        toast.add({
          title: "Failed to close complaint",
          description:
            error instanceof Error ? error.message : "Something went wrong.",
          type: "error",
        });
      },
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isClosed || isPending}
      onClick={handleClose}
    >
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <LockKeyhole className="mr-2 h-4 w-4" />
      )}

      {isClosed ? "Closed" : isPending ? "Closing..." : "Close Complaint"}
    </Button>
  );
}
