"use client";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type DeleteProps = {
  title?: string;
  isDeleting?: boolean;
  onConfirm: () => void;
};

export function Delete({
  title,
  isDeleting = false,
  onConfirm,
}: DeleteProps) {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete complaint?</AlertDialogTitle>

        <AlertDialogDescription>
          Are you sure you want to delete{" "}
          <span className="font-medium text-foreground">
            {title || "this complaint"}
          </span>
          ?
          <br />
          This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel disabled={isDeleting}>
          Cancel
        </AlertDialogCancel>

        <AlertDialogAction
          disabled={isDeleting}
          onClick={onConfirm}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}