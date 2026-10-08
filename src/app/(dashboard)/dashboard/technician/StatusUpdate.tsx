
"use client";

import React from "react";
import {
  CheckCircle2,
  Loader2,
  PlayCircle,
} from "lucide-react";

import { useUpdateStatus } from "@/hooks/technician.hook";
import { toast } from "@/components/ui/toast";

import { Button } from "@/components/ui/button";
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

type Status =
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED";

type StatusUpdateProps = {
  assignmentId: string;
  currentStatus?: string;
};

const StatusUpdate = ({
  assignmentId,
  currentStatus,
}: StatusUpdateProps) => {
  const {
    mutate: updateStatusMutation,
    isPending: isUpdating,
  } = useUpdateStatus();

  // Determine next status
  const nextStatus: Status | null =
    currentStatus === "ASSIGNED"
      ? "IN_PROGRESS"
      : currentStatus === "IN_PROGRESS"
        ? "RESOLVED"
        : null;

  // Already resolved
  if (
    currentStatus === "RESOLVED" ||
    nextStatus === null
  ) {
    return (
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled
      >
        <CheckCircle2 className="mr-2 h-4 w-4" />
        Resolved
      </Button>
    );
  }

  const isResolving = nextStatus === "RESOLVED";

  const handleStatusUpdate = () => {
    if (!assignmentId || !nextStatus) return;

    updateStatusMutation(
      {
        assignmentId,
        status: nextStatus,
      },
      {
        onSuccess: () => {
          toast.add({
            title: "Status updated",
            description: `Complaint status changed to ${nextStatus.replace(
              "_",
              " ",
            )}.`,
            type: "success",
          });
        },

        onError: (error) => {
          console.error(error);

          toast.add({
            title: "Update failed",
            description:
              "Failed to update complaint status.",
            type: "error",
          });
        },
      },
    );
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            type="button"
            size="sm"
            variant="outline"
          >
            {isResolving ? (
              <CheckCircle2 className="mr-2 h-4 w-4" />
            ) : (
              <PlayCircle className="mr-2 h-4 w-4" />
            )}

            {isResolving
              ? "Resolve"
              : "Update Status"}
          </Button>
        }
      />

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            Update Complaint Status
          </DialogTitle>

          <DialogDescription>
            Update this assignment to the next status.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {/* Current Status */}
          <div className="rounded-md border p-3">
            <p className="text-xs text-muted-foreground">
              Current Status
            </p>

            <p className="mt-1 font-medium">
              {currentStatus?.replace("_", " ")}
            </p>
          </div>

          {/* Next Status */}
          <div className="rounded-md border bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">
              New Status
            </p>

            <div className="mt-1 flex items-center gap-2">
              {isResolving ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <PlayCircle className="h-4 w-4" />
              )}

              <p className="font-medium">
                {nextStatus.replace("_", " ")}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose
            render={
              <Button
                type="button"
                variant="outline"
                disabled={isUpdating}
              >
                Cancel
              </Button>
            }
          />

          <Button
            type="button"
            onClick={handleStatusUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : isResolving ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Yes, Resolve
              </>
            ) : (
              <>
                <PlayCircle className="mr-2 h-4 w-4" />
                Start Work
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StatusUpdate;




