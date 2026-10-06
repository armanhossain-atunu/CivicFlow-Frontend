

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
};

export function AssignTechnician({
  complaintId,
}: AssignTechnicianProps) {
  const [open, setOpen] = React.useState(false);

  const [selectedTechnicianId, setSelectedTechnicianId] =
    React.useState("");

  // Get all technicians
  const {
    data,
    isLoading,
    isError,
  } = useGetTechnicians();

  // Create assignment mutation
  const {
    mutate,
    isPending,
  } = useCreateAssignment();

  // Normalize technician response
  // const technicians = React.useMemo(() => {
  //   if (!data) {
  //     return [];
  //   }

  //    return normalizeTechnicians(data);
  // }, [data]);
  const technicians = React.useMemo(() => {
  if (!data) return [];

  return normalizeTechnicians(data).filter(
    (user) => user.role === "TECHNICIAN",
  );
}, [data]);
console.log(technicians, "technicians");
  // Assign technician
  const handleAssign = () => {
    if (!selectedTechnicianId) {
      toast.add({
        title: "Technician required",
        description:
          "Please select a technician before assigning the complaint.",
        type: "error",
      });

      return;
    }

    mutate(
      {
        complaintId,
        assignedToId: selectedTechnicianId,
      },
      {
        onSuccess: () => {
          toast.add({
            title: "Complaint assigned",
            description:
              "The technician has been assigned successfully.",
            type: "success",
          });

          // Reset selected technician
          setSelectedTechnicianId("");

          // Close dialog
          setOpen(false);
        },

        onError: (error) => {
          toast.add({
            title: "Assignment failed",
            description:
              error instanceof Error
                ? error.message
                : "Unable to assign the complaint right now.",
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

        // Clear selection when closing
        if (!value) {
          setSelectedTechnicianId("");
        }
      }}
    >
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon"
            title="Assign technician"
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
            <DialogTitle>
              Assign Technician
            </DialogTitle>

            <DialogDescription>
              Select a technician to assign this complaint.
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
                  {technicians.length > 0 ? (
                    technicians.map((technician) => (
                      <SelectItem
                        key={technician.id}
                        value={technician.id}
                      >
                        {technician.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem
                      value="no-technician"
                      disabled
                    >
                      No technicians available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>

              <FieldDescription>
                Choose the technician responsible for this
                complaint.
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
