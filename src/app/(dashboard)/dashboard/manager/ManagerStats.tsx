
import {
  ClipboardList,
  CircleCheck,
  UserRoundPlus,
  Wrench,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { ManagerComplaint } from "@/types/manager.types";

interface ManagerStatsProps {
  complaints: ManagerComplaint[];
  totalComplaints: number;
}

function isResolved(status: string) {
  return ["RESOLVED", "COMPLETED", "CLOSED"].includes(
    status.toUpperCase(),
  );
}

function isInProgress(status: string) {
  return ["IN_PROGRESS", "IN PROGRESS", "ASSIGNED"].includes(
    status.toUpperCase(),
  );
}

export default function ManagerStats({
  complaints,
  totalComplaints,
}: ManagerStatsProps) {
  const stats = [
    {
      label: "Total complaints",
      value: totalComplaints,
      icon: ClipboardList,
    },
    {
      label: "Unassigned",
      value: complaints.filter(
        (complaint) => !complaint.technicianId,
      ).length,
      icon: UserRoundPlus,
    },
    {
      label: "In progress",
      value: complaints.filter((complaint) =>
        isInProgress(complaint.status),
      ).length,
      icon: Wrench,
    },
    {
      label: "Resolved",
      value: complaints.filter((complaint) =>
        isResolved(complaint.status),
      ).length,
      icon: CircleCheck,
    },
  ];

  return (
    <section
      aria-label="Complaint statistics"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {stats.map(({ label, value, icon: Icon }) => (
        <Card key={label}>
          <CardContent className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {label}
              </p>

              <p className="mt-2 text-2xl font-semibold tabular-nums">
                {value}
              </p>
            </div>

            <span className="rounded-lg bg-primary/10 p-3 text-primary">
              <Icon aria-hidden="true" className="size-5" />
            </span>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
