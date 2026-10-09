
"use client";

import * as React from "react";
import {
  CheckCircle2,
  Loader2,
  UserRoundPlus,
} from "lucide-react";

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

import {
  useCreateAssignment,
  useGetTechnicians,
} from "@/hooks/manager.hook";

import { normalizeTechnicians } from "@/types/manager.types";
import { toast } from "@/components/ui/toast";

type AssignTechnicianProps = {
  complaintId: string;
    complaintStatus:string
};

export function AssignTechnician({
  complaintId,complaintStatus
}: AssignTechnicianProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedTechnicianId, setSelectedTechnicianId] =
    React.useState("");
  const [note, setNote] = React.useState("");
const disabledStatuses = [
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
];

const isAssignDisabled = disabledStatuses.includes(
  complaintStatus?.toUpperCase() ?? "",
);
  const {
    data,
    isLoading,
    isError,
  } = useGetTechnicians();

  const {
    mutate,
    isPending,
  } = useCreateAssignment();

  const technicians = React.useMemo(() => {
    if (!data) return [];

    return normalizeTechnicians(data).filter(
      (user) => user.role === "TECHNICIAN",
    );
  }, [data]);

  const handleAssign = () => {
    if (!selectedTechnicianId) {
      toast.add({
        title: "Technician required",
        description: "Please select a technician.",
        type: "error",
      });
      return;
    }

    mutate(
      {
        complaintId,
        assignedToId: selectedTechnicianId,
        note: note.trim(),
      },
      {
        onSuccess: () => {
          toast.add({
            title: "Complaint assigned",
            description:
              "Technician assigned successfully.",
            type: "success",
          });

          setSelectedTechnicianId("");
          setNote("");
          setOpen(false);
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
      onOpenChange={(value) => {
        setOpen(value);

        if (!value && !isPending) {
          setSelectedTechnicianId("");
          setNote("");
        }
      }}
    >
      <DialogTrigger
        render={
         <Button
  type="button"
  variant="outline"
  size="icon"
  title={
    isAssignDisabled
      ? "This complaint cannot be reassigned"
      : "Assign technician"
  }
  disabled={isAssignDisabled}
>
  <UserRoundPlus className="h-4 w-4" />
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
            <DialogTitle>Assign Technician</DialogTitle>
            <DialogDescription>
              Select a technician and provide assignment instructions.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4">
            <Field>
              <FieldLabel htmlFor="technician">
                Technician
              </FieldLabel>

              <Select
                value={selectedTechnicianId || null}
                onValueChange={(value) => {
                  setSelectedTechnicianId(value ?? "");
                }}
                disabled={
                  isLoading ||
                  isPending ||
                  technicians.length === 0
                }
              >
                <SelectTrigger
                  id="technician"
                  className="w-full"
                >
                  <SelectValue
                    placeholder={
                      isLoading
                        ? "Loading technicians..."
                        : technicians.length === 0
                          ? "No technicians available"
                          : "Select technician"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  {technicians.map((technician) => (
                    <SelectItem
                      key={technician.id}
                      value={technician.id}
                    >
                      {technician.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FieldDescription>
                Choose the technician responsible for this complaint.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="assignment-note">
                Assignment Note
              </FieldLabel>

              <textarea
                id="assignment-note"
                value={note}
                onChange={(event) =>
                  setNote(event.target.value)
                }
                placeholder="Enter instructions for the technician..."
                rows={3}
                disabled={isPending}
                className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />

              <FieldDescription>
                Add optional instructions for the assigned technician.
              </FieldDescription>
            </Field>

            {isError && (
              <p className="text-sm text-destructive">
                Failed to load technicians. Please try again.
              </p>
            )}
          </FieldGroup>

          <DialogFooter>
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                >
                  Cancel
                </Button>
              }
            />

            <Button
              type="submit"
              disabled={
                !selectedTechnicianId ||
                isPending ||
                isLoading ||
                technicians.length === 0
              }
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Assign Technician
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

